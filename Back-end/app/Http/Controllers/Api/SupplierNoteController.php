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

class SupplierNoteController extends Controller
{
    //

    public function index()
    {
        $notes = SupplierNote::with(['supplier', 'details.product', 'createdBy', 'confirmedBy'])->get();
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
                // ¿qué campos van aquí?
                'supplier_id' => $validated['supplier_id'],
                'total_amount' => $validated['total_amount'],
                'delivery_date' => $validated['delivery_date'],
                'reminders' => $validated['reminders'] ?? null,
                'status' => 'pending',
                'created_by' => $employee->id,
            ]);

            foreach ($validated['products'] as $product) {
                SupplierNoteDetail::create([
                    // ¿qué campos van aquí?
                    'supplier_note_id' => $note->id,
                    'product_id' => $product['product_id'],
                    'quantity_agreed' => $product['quantity_agreed'],
                    'price_agreed' => $product['price_agreed'],
                    'discount' => $product['discount'] ?? 0,
                    'is_gift' => $product['is_gift'] ?? false,
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Nota de proveedor creada exitosamente'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
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

        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'total_amount' => 'required|numeric|min:0',
            'delivery_date' => 'required|date',
            'reminders' => 'nullable|string',
            'status' => 'required|in:pending,confirmed,cancelled',
        ]);

        $note->update($validated);

        return response()->json([
            'message' => 'Nota de proveedor actualizada exitosamente',
            'data' => $note
        ], 200);
    }
    public function destroy($id)
    {
        $note = SupplierNote::findOrFail($id);
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

        $note = SupplierNote::with('details.product')->findOrFail($id);

        if ($note->status !== 'pending') {
            return response()->json(['message' => 'Solo se pueden confirmar notas pendientes'], 400);
        }

        $validated = $request->validate([
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity_received' => 'required|integer|min:0',
        ]);

        DB::beginTransaction();
        try {
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
            }
            $note->update([
                'status' => 'confirmed',
                'confirmed_by' => $employee->id,
            ]);

            DB::commit();
            return response()->json(['message' => 'Nota confirmada y stock actualizado', 'data' => $note->fresh('details.product')], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }



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
            ])->post("https://api.anthropic.com/v1/messages", [


                // aquí va el body

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
                                'text' => 'Analiza este ticket de proveedor y extrae todos los productos. Devuelve SOLO un array JSON con los campos: nombre, cantidad, precio_unitario. Sin texto adicional, sin markdown, solo el JSON.'
                            ]
                        ]
                    ]
                ]
            ]);

            // Texto crudo de Anthropic
            $text = $response->json('content.0.text');

            // Log completo de la respuesta
            Log::info('Respuesta Anthropic:', [
                'response' => $response->json(),
                'text' => $text
            ]);

            // 🔧 Limpieza de markdown que Gemini agrega a veces
            $clean = preg_replace('/```json\s*/i', '', $text);
            $clean = preg_replace('/```\s*/i', '', $clean);
            $clean = trim($clean);

            // Intentar decodificar
            $products = json_decode($clean, true);

            return response()->json([
                'message' => 'Productos extraídos del ticket',
                'products' => $products
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al procesar la imagen: ' . $e->getMessage()
            ], 500);
        }
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
}
