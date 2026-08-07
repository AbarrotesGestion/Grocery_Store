<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SupplierNote;
use App\Models\SupplierNoteDetail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Product;
use Illuminate\Support\Facades\Mail;
use App\Mail\SupplierNoteConfirmed;


class SupplierNoteController extends Controller
{
    public function index(Request $request)
    {
        $notes = SupplierNote::with(['supplier', 'details.product', 'createdBy', 'confirmedBy'])
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $notes
        ], 200);
    }

    public function store(Request $request)
    {
        $employee = auth()->user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Empleado no encontrado'], 404);
        }

        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'total_amount' => 'required|numeric|min:0',
            'delivery_date' => 'required|date',
            'reminders' => 'nullable|string',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity_agreed' => 'required|integer|min:1',
            'products.*.price_agreed' => 'required|numeric|min:0',
            'products.*.discount' => 'nullable|numeric|min:0',
            'products.*.is_gift' => 'nullable|boolean',
        ]);

        DB::beginTransaction();
        try {
            $note = SupplierNote::create([
                'supplier_id' => $validated['supplier_id'],
                'total_amount' => $validated['total_amount'],
                'delivery_date' => $validated['delivery_date'],
                'reminders' => $validated['reminders'] ?? null,
                'status' => 'pending',
                'created_by' => $employee->id,
            ]);

            foreach ($validated['products'] as $product) {
                SupplierNoteDetail::create([
                    'supplier_note_id' => $note->id,
                    'product_id' => $product['product_id'],
                    'quantity_agreed' => $product['quantity_agreed'],
                    'price_agreed' => $product['price_agreed'],
                    'discount' => $product['discount'] ?? 0,
                    'is_gift' => $product['is_gift'] ?? false,
                ]);
            }

            DB::commit();

            // Fuera de la transacción, con su propio try/catch: un fallo de
            // correo nunca debe afectar la respuesta ni revertir la nota.
            $this->notificarAlmacenista($note->fresh(['supplier', 'details.product']), $employee);

            return response()->json([
                'message' => 'Nota de proveedor creada exitosamente',
                'data' => $note->fresh(['supplier', 'details.product']),
            ], 201);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            Log::error('Error al crear nota de proveedor', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error al crear la nota de proveedor'], 500);
        }
    }

    public function show($id)
    {
        $note = SupplierNote::with(['supplier', 'details.product', 'createdBy', 'confirmedBy'])->findOrFail($id);
        return response()->json([
            'data' => $note
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $note = SupplierNote::findOrFail($id);

        if ($note->status !== 'pending') {
            return response()->json([
                'message' => 'Solo se pueden editar notas en estado pendiente. Usa /confirm o /pay para avanzar el estado.'
            ], 400);
        }

        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'total_amount' => 'required|numeric|min:0',
            'delivery_date' => 'required|date',
            'reminders' => 'nullable|string',
        ]);

        $note->update($validated);

        return response()->json([
            'message' => 'Nota de proveedor actualizada exitosamente',
            'data' => $note
        ], 200);
    }

    /**
     * FIX: antes se podía borrar una nota en cualquier estado, incluyendo
     * 'confirmed' o 'paid'. Una nota confirmada ya incrementó stock real —
     * borrarla destruye la evidencia contable sin revertir ese movimiento.
     * Mismo criterio que ya aplicas en ClientDebtController::destroy().
     */
    public function destroy($id)
    {
        $note = SupplierNote::findOrFail($id);

        if (in_array($note->status, ['confirmed', 'paid'])) {
            return response()->json([
                'message' => 'No se puede eliminar una nota confirmada o pagada: ya afectó el stock y el historial financiero.'
            ], 409);
        }

        $note->delete();

        return response()->json([
            'message' => 'Nota de proveedor eliminada exitosamente'
        ], 200);
    }

    public function confirm(Request $request, $id)
    {
        $employee = auth()->user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Empleado no encontrado'], 404);
        }

        $note = SupplierNote::with(['details.product', 'supplier'])->findOrFail($id);

        if ($note->status !== 'pending') {
            return response()->json(['message' => 'Solo se pueden confirmar notas pendientes'], 400);
        }

        $validated = $request->validate([
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity_received' => 'required|integer|min:0',
            'observations' => 'nullable|string|max:1000',
        ]);

        $ids = array_column($validated['products'], 'product_id');
        if (count($ids) !== count(array_unique($ids))) {
            return response()->json([
                'message' => 'Hay productos repetidos. Agrupa las cantidades en una sola línea por producto.'
            ], 422);
        }

        DB::beginTransaction();
        try {
            $diferencias = [];

            foreach ($validated['products'] as $item) {
                $detail = $note->details->firstWhere('product_id', $item['product_id']);

                if (!$detail) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "El producto ID {$item['product_id']} no pertenece a esta nota de trato"
                    ], 422);
                }

                $detail->update(['quantity_received' => $item['quantity_received']]);
                Product::where('id', $item['product_id'])->increment('stock', $item['quantity_received']);

                $diferencias[] = [
                    'producto' => $detail->product->name ?? "ID {$item['product_id']}",
                    'pactado' => $detail->quantity_agreed,
                    'recibido' => $item['quantity_received'],
                    'diferencia' => $item['quantity_received'] - $detail->quantity_agreed,
                ];
            }

            $note->update([
                'status' => 'confirmed',
                'confirmed_by' => $employee->id,
                'confirmed_at' => now(),
                'observations' => $validated['observations'] ?? null,
            ]);

            DB::commit();

            $this->notificarAlDueno($note, $diferencias, $validated['observations'] ?? null, $employee);

            return response()->json([
                'message' => 'Nota confirmada y stock actualizado',
                'diferencias' => $diferencias,
                'data' => $note->fresh(['details.product', 'supplier']),
            ], 200);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            Log::error('Error al confirmar nota de proveedor', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Error al confirmar la nota'], 500);
        }
    }

    private function notificarAlDueno($note, array $diferencias, ?string $observaciones, $employee): void
    {
        try {
            $admins = \App\Models\User::whereHas('employee.role', function ($q) {
                $q->where('name', 'Administrador');
            })->get();

            foreach ($admins as $admin) {
                try {
                    Mail::to($admin->email)->send(
                        new \App\Mail\SupplierNoteConfirmed($note, $diferencias, $observaciones, $employee)
                    );
                } catch (\Throwable $e) {
                    Log::error('Error al notificar a un administrador', [
                        'note_id' => $note->id,
                        'email' => $admin->email,
                        'error' => $e->getMessage(),
                    ]);
                }
                usleep(1500000);
            }
        } catch (\Throwable $e) {
            Log::error('Error al notificar confirmación de nota', [
                'note_id' => $note->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * FIX: antes, si la llamada a Anthropic fallaba (rate limit, key inválida,
     * timeout, red caída), $response->json('content.0.text') regresaba null,
     * el código seguía de largo intentando limpiar/parsear ese null, y el
     * endpoint respondía 200 OK con products = null — el cliente (app Android)
     * interpretaría eso como "no se encontraron productos" en vez de "el
     * servicio falló". Ahora se detecta la falla explícitamente y se responde
     * con un status de error real. También se agregó timeout() explícito.
     */
    public function scan(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:10240',
        ]);

        try {
            $image = $request->file('image');
            $imageData = base64_encode(file_get_contents($image->getRealPath()));
            $mimeType = $image->getMimeType();

            $apiKey = config('services.anthropic.key');

            $response = Http::withHeaders([
                'x-api-key' => $apiKey,
                'anthropic-version' => '2023-06-01',
            ])->timeout(30)->post("https://api.anthropic.com/v1/messages", [
                'model' => 'claude-sonnet-4-6',
                'max_tokens' => 1024,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => [
                            [
                                'type' => 'image',
                                'source' => [
                                    'type' => 'base64',
                                    'media_type' => $mimeType,
                                    'data' => $imageData,
                                ]
                            ],
                            [
                                'type' => 'text',
                                'text' => 'Analiza este ticket de proveedor y extrae todos los productos. '
                                    . 'Para cada producto busca si tiene un código o clave impresa junto al nombre '
                                    . '(usualmente un número de varios dígitos que aparece antes o junto a la descripción '
                                    . 'del producto, distinto del precio). Devuelve SOLO un array JSON con los campos: '
                                    . 'nombre, codigo (o null si no detectas ninguno), cantidad, precio_unitario. '
                                    . 'Sin texto adicional, sin markdown, solo el JSON.'
                            ]
                        ]
                    ]
                ]
            ]);

            if ($response->failed()) {
                Log::error('Fallo llamada a Anthropic en scan()', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return response()->json([
                    'message' => 'El servicio de escaneo no respondió correctamente. Intenta de nuevo.'
                ], 502);
            }

            $text = $response->json('content.0.text');

            Log::info('Respuesta Anthropic:', [
                'response' => $response->json(),
                'text' => $text
            ]);

            if (!$text) {
                return response()->json([
                    'message' => 'No se pudo extraer texto de la imagen. Intenta con otra foto.'
                ], 422);
            }

            $clean = preg_replace('/```json\s*/i', '', $text);
            $clean = preg_replace('/```\s*/i', '', $clean);
            $clean = trim($clean);

            $products = json_decode($clean, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Respuesta de Anthropic no es JSON válido', ['texto' => $clean]);
                return response()->json([
                    'message' => 'No se pudo interpretar la respuesta del escaneo. Intenta con otra foto.'
                ], 422);
            }

            return response()->json([
                'message' => 'Productos extraídos del ticket',
                'products' => $products
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error al procesar la imagen en scan()', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Error al procesar la imagen'
            ], 500);
        }
    }

    public function historial()
    {
        $notes = SupplierNote::with(['supplier', 'details.product', 'confirmedBy'])
            ->whereIn('status', ['confirmed', 'paid'])
            ->orderBy('confirmed_at', 'desc')
            ->get();

        return response()->json(['data' => $notes], 200);
    }

    public function pay($id)
    {
        $note = SupplierNote::findOrFail($id);

        if ($note->status !== 'confirmed') {
            return response()->json(['message' => 'Solo se pueden pagar notas confirmadas'], 400);
        }

        $note->update(['status' => 'paid']);

        return response()->json(['message' => 'Nota marcada como pagada', 'data' => $note], 200);
    }

    private function notificarAlmacenista($note, $employee): void
    {
        try {
            $almacenistas = \App\Models\User::whereHas('employee.role', function ($q) {
                $q->where('name', 'Almacenista');
            })->get();

            foreach ($almacenistas as $u) {
                try {
                    Mail::to($u->email)->send(new \App\Mail\SupplierNoteCreated($note, $employee));
                } catch (\Throwable $e) {
                    Log::error('Error al notificar a un almacenista', [
                        'note_id' => $note->id,
                        'email' => $u->email,
                        'error' => $e->getMessage(),
                    ]);
                }
                usleep(1500000);
            }
        } catch (\Throwable $e) {
            Log::error('Error al notificar nota nueva al almacenista', [
                'note_id' => $note->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}