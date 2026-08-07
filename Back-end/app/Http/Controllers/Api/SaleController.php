<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;


class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with(['product', 'employee', 'client'])->orderBy('created_at', 'desc')->get();
        return response()->json(['message' => 'ventas disponibles', 'data' => $sales], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|numeric|min:0.01',
            'products.*.sale_unit_type' => 'nullable|string|in:unit,package,weight',
            'client_id' => 'nullable|exists:clients,id',
            'payment_method' => 'required|in:cash,card,mixed',
            'cash_amount' => 'required|numeric|min:0',
            'card_amount' => 'required|numeric|min:0',
        ]);

        $ids = array_column($validated['products'], 'product_id');
        if (count($ids) !== count(array_unique($ids))) {
            return response()->json([
                'message' => 'Hay productos repetidos. Agrupa las cantidades en una sola línea por producto.'
            ], 422);
        }

        DB::beginTransaction();
        try {
            $employee = auth()->user()->employee;
            if (!$employee) {
                DB::rollBack();
                return response()->json(['message' => 'No se encontró el empleado asociado al usuario autenticado'], 404);
            }

            $turnoActivo = \App\Models\CashRegister::where('employee_id', $employee->id)
                ->whereNull('closed_at')
                ->first();

            if (!$turnoActivo) {
                DB::rollBack();
                return response()->json(['message' => 'No tienes un turno de caja abierto. Abre un turno antes de vender.'], 400);
            }

            $lines = [];
            $ticketTotal = 0;

            foreach ($validated['products'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                $unitType = $item['sale_unit_type'] ?? 'unit';
                $quantity = $item['quantity'];

                $stockToDeduct = $quantity;
                $lineTotal = 0;

                if ($unitType === 'package') {
                    $stockToDeduct = $quantity * ($product->package_size ?? 1);
                    $lineTotal = ($product->price_per_package ?? $product->price) * $quantity;
                } elseif ($unitType === 'weight') {
                    $lineTotal = ($product->price_per_kg ?? $product->price) * $quantity;
                } else { // unit
                    $lineTotal = ($product->price_per_unit ?? $product->price) * $quantity;
                }

                if ($product->stock < $stockToDeduct) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "No hay suficiente stock de {$product->name}. Requerido: {$stockToDeduct}, Disponible: {$product->stock}"
                    ], 400);
                }

                $ticketTotal += $lineTotal;

                $lines[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'stock_to_deduct' => $stockToDeduct,
                    'sale_unit_type' => $unitType,
                    'total_price' => $lineTotal,
                ];
            }

            $pagado = $validated['cash_amount'] + $validated['card_amount'];
            if ($pagado < $ticketTotal) {
                DB::rollBack();
                return response()->json(['message' => 'El monto pagado no cubre el total de la venta'], 422);
            }

            $changeAmount = round($pagado - $ticketTotal, 2);

            // FIX: el cambio siempre se entrega en efectivo. Si el efectivo
            // entregado por el cliente no alcanza para cubrir ese cambio,
            // la combinación de pago no es válida (ej. pagar todo con
            // tarjeta pero de todos modos "recibir cambio" en efectivo que
            // nadie entregó). Sin esta validación, cash_amount se guardaba
            // negativo y contaminaba el corte de caja.
            if ($validated['cash_amount'] < $changeAmount) {
                DB::rollBack();
                return response()->json([
                    'message' => 'El efectivo entregado no alcanza para cubrir el cambio calculado. Revisa cash_amount y card_amount.'
                ], 422);
            }

            $cashCobrado = round($validated['cash_amount'] - $changeAmount, 2);
            $cardCobrado = round($validated['card_amount'], 2);

            $saleGroupId = (string) Str::uuid();
            $createdSales = [];
            $sumaCashAsignada = 0;
            $sumaCardAsignada = 0;
            $lastIndex = count($lines) - 1;

            foreach ($lines as $i => $line) {
                $proportion = $ticketTotal > 0 ? $line['total_price'] / $ticketTotal : 0;

                if ($i === $lastIndex) {
                    $lineCash = round($cashCobrado - $sumaCashAsignada, 2);
                    $lineCard = round($cardCobrado - $sumaCardAsignada, 2);
                } else {
                    $lineCash = round($cashCobrado * $proportion, 2);
                    $lineCard = round($cardCobrado * $proportion, 2);
                    $sumaCashAsignada += $lineCash;
                    $sumaCardAsignada += $lineCard;
                }

                $sale = Sale::create([
                    'sale_group_id' => $saleGroupId,
                    'product_id' => $line['product']->id,
                    'quantity' => $line['quantity'],
                    'sale_unit_type' => $line['sale_unit_type'],
                    'total_price' => $line['total_price'],
                    'employee_id' => $employee->id,
                    'client_id' => $validated['client_id'] ?? null,
                    'cash_register_id' => $turnoActivo->id,
                    'payment_method' => $validated['payment_method'],
                    'cash_amount' => $lineCash,
                    'card_amount' => $lineCard,
                    'change_amount' => $i === $lastIndex ? $changeAmount : 0,
                    'status' => 'completed',
                ]);

                $line['product']->decrement('stock', $line['stock_to_deduct']);
                $createdSales[] = $sale;
            }

            DB::commit();

            try {
                Log::info('Venta registrada: ' . $saleGroupId);
            } catch (\Throwable $e) {
                // el logging nunca debe afectar la respuesta ya confirmada
            }

            return response()->json([
                'message' => 'Venta registrada exitosamente',
                'sale_group_id' => $saleGroupId,
                'total' => $ticketTotal,
                'change_amount' => $changeAmount,
                'data' => $createdSales,
            ], 201);

        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            Log::error('Error al registrar venta', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error al registrar la venta'], 500);
        }
    }

    public function show(string $id)
    {
        $sale = Sale::with(['product', 'employee', 'client'])->findOrFail($id);
        return response()->json(['message' => 'Venta encontrada', 'data' => $sale], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0.01',
            'sale_unit_type' => 'nullable|string|in:unit,package,weight',
            'additional_cash' => 'nullable|numeric|min:0',
            'additional_card' => 'nullable|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $sale = Sale::lockForUpdate()->findOrFail($id);

            if ($sale->isCancelled()) {
                DB::rollBack();
                return response()->json(['message' => 'No se puede editar una venta cancelada'], 400);
            }

            $oldProduct = Product::findOrFail($sale->product_id);
            $newProduct = Product::findOrFail($validated['product_id']);

            // 1. Devolver el stock del producto viejo (usa el helper del modelo
            // para que la fórmula de package_size sea idéntica en todo el sistema)
            $oldProduct->increment('stock', $sale->stockUnitsAfectadas());

            // 2. Calcular los nuevos totales y stock a descontar
            $newUnitType = $validated['sale_unit_type'] ?? 'unit';
            $newQuantity = $validated['quantity'];
            $newStockToDeduct = $newQuantity;
            $newLineTotal = 0;

            if ($newUnitType === 'package') {
                $newStockToDeduct = $newQuantity * ($newProduct->package_size ?? 1);
                $newLineTotal = ($newProduct->price_per_package ?? $newProduct->price) * $newQuantity;
            } elseif ($newUnitType === 'weight') {
                $newLineTotal = ($newProduct->price_per_kg ?? $newProduct->price) * $newQuantity;
            } else {
                $newLineTotal = ($newProduct->price_per_unit ?? $newProduct->price) * $newQuantity;
            }

            if ($newProduct->stock < $newStockToDeduct) {
                DB::rollBack();
                return response()->json(['message' => "No hay suficiente stock. Requerido: {$newStockToDeduct}"], 400);
            }
            $newProduct->decrement('stock', $newStockToDeduct);

            $otrasLineas = Sale::where('sale_group_id', $sale->sale_group_id)
                ->where('id', '!=', $sale->id)
                ->lockForUpdate()
                ->get();

            $cambioYaEntregadoAntes = round($sale->change_amount + $otrasLineas->sum('change_amount'), 2);

            $ticketTotal = $newLineTotal + $otrasLineas->sum('total_price');
            $cashTotalTicket = $sale->cash_amount + $otrasLineas->sum('cash_amount');
            $cardTotalTicket = $sale->card_amount + $otrasLineas->sum('card_amount');
            $yaPagado = $cashTotalTicket + $cardTotalTicket;

            $diferencia = round($ticketTotal - $yaPagado, 2);
            $cambioAEntregar = 0;

            if ($diferencia > 0) {
                $extra = ($validated['additional_cash'] ?? 0) + ($validated['additional_card'] ?? 0);
                if ($extra < $diferencia) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "El nuevo producto cuesta más. Faltan \${$diferencia} por cobrar.",
                        'faltante' => $diferencia,
                    ], 422);
                }
                $cashTotalTicket += $validated['additional_cash'] ?? 0;
                $cardTotalTicket += $validated['additional_card'] ?? 0;
            } elseif ($diferencia < 0) {
                $cambioAEntregar = abs($diferencia);
                $descuentoCash = min($cambioAEntregar, $cashTotalTicket);
                $cashTotalTicket -= $descuentoCash;
                $restante = $cambioAEntregar - $descuentoCash;
                if ($restante > 0) {
                    $cardTotalTicket -= $restante;
                }
            }

            $sale->update([
                'product_id' => $newProduct->id,
                'quantity' => $newQuantity,
                'sale_unit_type' => $newUnitType,
                'total_price' => $newLineTotal,
                'cash_amount' => $ticketTotal > 0 ? round($cashTotalTicket * ($newLineTotal / $ticketTotal), 2) : 0,
                'card_amount' => $ticketTotal > 0 ? round($cardTotalTicket * ($newLineTotal / $ticketTotal), 2) : 0,
            ]);

            foreach ($otrasLineas as $otra) {
                $proportion = $ticketTotal > 0 ? $otra->total_price / $ticketTotal : 0;
                $otra->update([
                    'cash_amount' => round($cashTotalTicket * $proportion, 2),
                    'card_amount' => round($cardTotalTicket * $proportion, 2),
                ]);
            }

            $cambioNuevoAEntregar = max(0, round($cambioAEntregar - $cambioYaEntregadoAntes, 2));

            DB::commit();
            return response()->json([
                'message' => 'Venta actualizada exitosamente',
                'data' => $sale->fresh(),
                'cambio_a_entregar' => $cambioNuevoAEntregar,
            ], 200);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            Log::error('Error al actualizar venta', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Error al actualizar la venta'], 500);
        }
    }

    private function cancelSaleLine(Sale $sale): array
    {
        if ($sale->isCancelled()) {
            return ['ok' => false, 'reason' => 'ya_cancelada'];
        }

        if ($sale->cancel()) {
            return ['ok' => true];
        }

        return ['ok' => false, 'reason' => 'error'];
    }

    public function cancel(string $id)
    {
        $sale = Sale::findOrFail($id);

        DB::beginTransaction();
        try {
            $resultado = $this->cancelSaleLine($sale);

            if (!$resultado['ok'] && $resultado['reason'] === 'ya_cancelada') {
                DB::rollBack();
                return response()->json(['message' => 'Esta venta ya está cancelada'], 400);
            }
            if (!$resultado['ok']) {
                DB::rollBack();
                return response()->json(['message' => 'No se pudo cancelar la venta'], 400);
            }

            DB::commit();
            Log::info('Venta cancelada: ' . $sale->id);
            return response()->json(['message' => 'Venta cancelada exitosamente. Stock devuelto al inventario.'], 200);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            Log::error('Error al cancelar venta', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Error al cancelar la venta'], 500);
        }
    }

    public function cancelGroup(string $saleGroupId)
    {
        $lineas = Sale::where('sale_group_id', $saleGroupId)->get();

        if ($lineas->isEmpty()) {
            return response()->json(['message' => 'No se encontró ningún ticket con ese identificador'], 404);
        }

        DB::beginTransaction();
        try {
            $canceladas = 0;
            $yaCanceladas = 0;

            foreach ($lineas as $sale) {
                $resultado = $this->cancelSaleLine($sale);
                if ($resultado['ok']) {
                    $canceladas++;
                } elseif ($resultado['reason'] === 'ya_cancelada') {
                    $yaCanceladas++;
                }
            }

            DB::commit();
            Log::info("Ticket cancelado: {$saleGroupId} ({$canceladas} líneas canceladas, {$yaCanceladas} ya lo estaban)");

            return response()->json([
                'message' => 'Ticket cancelado exitosamente. Stock devuelto al inventario.',
                'lineas_canceladas' => $canceladas,
                'lineas_ya_canceladas_previamente' => $yaCanceladas,
            ], 200);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            Log::error('Error al cancelar ticket', ['sale_group_id' => $saleGroupId, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Error al cancelar el ticket'], 500);
        }
    }

    /**
     * REVERTIR CANCELACIÓN (solo Administrador)
     */
    public function revert(string $id)
    {
        if (!auth()->user()->isAdmin()) {
            return response()->json(['message' => 'No tienes permisos para revertir ventas canceladas'], 403);
        }

        $sale = Sale::findOrFail($id);

        if (!$sale->isCancelled()) {
            return response()->json(['message' => 'Esta venta no está cancelada'], 400);
        }

        DB::beginTransaction();
        try {
            if ($sale->revert()) {
                DB::commit();
                Log::info('Venta revertida: ' . $sale->id);
                return response()->json(['message' => 'Venta revertida exitosamente. Stock ajustado.'], 200);
            } else {
                DB::rollBack();
                return response()->json(['message' => 'No hay stock suficiente para revertir la cancelación'], 400);
            }
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            Log::error('Error al revertir venta', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Error al revertir la venta'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::beginTransaction();
        try {
            $sale = Sale::findOrFail($id);

            // FIX: antes esto reimplementaba la reversión de stock a mano
            // usando $sale->quantity directamente, sin considerar package_size,
            // y sin pasar por Sale::cancel() -> mismo bug que cancel()/revert().
            // Ahora usa el helper centralizado del modelo.
            if (!$sale->isCancelled()) {
                $sale->product->increment('stock', $sale->stockUnitsAfectadas());
            }

            $sale->delete();

            DB::commit();
            return response()->json(['message' => 'Venta eliminada exitosamente'], 200);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            Log::error('Error al eliminar venta', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Error al eliminar la venta'], 500);
        }
    }

    public function addItemsToGroup(Request $request, string $saleGroupId)
    {
        $validated = $request->validate([
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|numeric|min:0.01',
            'products.*.sale_unit_type' => 'nullable|string|in:unit,package,weight',
            'additional_cash' => 'nullable|numeric|min:0',
            'additional_card' => 'nullable|numeric|min:0',
        ]);

        $ids = array_column($validated['products'], 'product_id');
        if (count($ids) !== count(array_unique($ids))) {
            return response()->json([
                'message' => 'Hay productos repetidos. Agrupa las cantidades en una sola línea por producto.'
            ], 422);
        }

        $employee = auth()->user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Empleado no encontrado'], 404);
        }

        DB::beginTransaction();
        try {
            $existingLines = Sale::where('sale_group_id', $saleGroupId)->lockForUpdate()->get();

            if ($existingLines->isEmpty()) {
                DB::rollBack();
                return response()->json(['message' => 'No se encontró el ticket con ese identificador'], 404);
            }

            $firstLine = $existingLines->first();
            $turno = \App\Models\CashRegister::find($firstLine->cash_register_id);
            if (!$turno || $turno->closed_at !== null) {
                DB::rollBack();
                return response()->json(['message' => 'No se pueden agregar productos: el turno de caja ya cerró.'], 400);
            }

            $employeeId = $firstLine->employee_id;
            $clientId = $firstLine->client_id;
            $cashRegisterId = $firstLine->cash_register_id;

            $totalActual = $existingLines->sum('total_price');
            $efectivoTotalTicket = $existingLines->sum('cash_amount') + ($validated['additional_cash'] ?? 0);
            $tarjetaTotalTicket = $existingLines->sum('card_amount') + ($validated['additional_card'] ?? 0);

            $newLinesData = [];
            $newItemsTotal = 0;

            foreach ($validated['products'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                $unitType = $item['sale_unit_type'] ?? 'unit';
                $quantity = $item['quantity'];

                $stockToDeduct = $quantity;
                $lineTotal = 0;

                if ($unitType === 'package') {
                    $stockToDeduct = $quantity * ($product->package_size ?? 1);
                    $lineTotal = ($product->price_per_package ?? $product->price) * $quantity;
                } elseif ($unitType === 'weight') {
                    $lineTotal = ($product->price_per_kg ?? $product->price) * $quantity;
                } else {
                    $lineTotal = ($product->price_per_unit ?? $product->price) * $quantity;
                }

                if ($product->stock < $stockToDeduct) {
                    DB::rollBack();
                    return response()->json(['message' => "No hay suficiente stock de {$product->name}"], 400);
                }

                $newItemsTotal += $lineTotal;

                $newLinesData[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'stock_to_deduct' => $stockToDeduct,
                    'sale_unit_type' => $unitType,
                    'total_price' => $lineTotal,
                ];
            }

            $granTotalTicket = $totalActual + $newItemsTotal;
            $totalPagado = $efectivoTotalTicket + $tarjetaTotalTicket;

            if ($totalPagado < $granTotalTicket) {
                DB::rollBack();
                $faltante = round($granTotalTicket - $totalPagado, 2);
                return response()->json([
                    'message' => "Falta dinero para agregar estos productos. Faltan \${$faltante}.",
                    'faltante' => $faltante
                ], 422);
            }

            $cambioAEntregar = round($totalPagado - $granTotalTicket, 2);

            // Misma regla que en store(): el cambio se paga en efectivo, así
            // que valida que haya suficiente efectivo en el ticket para cubrirlo.
            if ($efectivoTotalTicket < $cambioAEntregar) {
                DB::rollBack();
                return response()->json([
                    'message' => 'El efectivo del ticket no alcanza para cubrir el cambio calculado.'
                ], 422);
            }

            $efectivoCobradoReal = round($efectivoTotalTicket - $cambioAEntregar, 2);

            $metodoFinal = match (true) {
                $efectivoCobradoReal > 0 && $tarjetaTotalTicket > 0 => 'mixed',
                $tarjetaTotalTicket > 0 => 'card',
                default => 'cash',
            };

            $createdSales = [];
            foreach ($newLinesData as $line) {
                $sale = Sale::create([
                    'sale_group_id' => $saleGroupId,
                    'product_id' => $line['product']->id,
                    'quantity' => $line['quantity'],
                    'sale_unit_type' => $line['sale_unit_type'],
                    'total_price' => $line['total_price'],
                    'employee_id' => $employeeId,
                    'client_id' => $clientId,
                    'cash_register_id' => $cashRegisterId,
                    'payment_method' => $metodoFinal,
                    'cash_amount' => 0,
                    'card_amount' => 0,
                    'change_amount' => 0,
                    'status' => 'completed',
                ]);

                $line['product']->decrement('stock', $line['stock_to_deduct']);
                $createdSales[] = $sale;
            }

            $todasLasLineas = Sale::where('sale_group_id', $saleGroupId)->get();
            $sumaCashAsignada = 0;
            $sumaCardAsignada = 0;
            $lastIndex = count($todasLasLineas) - 1;

            foreach ($todasLasLineas as $i => $linea) {
                $proportion = $granTotalTicket > 0 ? $linea->total_price / $granTotalTicket : 0;

                if ($i === $lastIndex) {
                    $lineCash = round($efectivoCobradoReal - $sumaCashAsignada, 2);
                    $lineCard = round($tarjetaTotalTicket - $sumaCardAsignada, 2);
                } else {
                    $lineCash = round($efectivoCobradoReal * $proportion, 2);
                    $lineCard = round($tarjetaTotalTicket * $proportion, 2);
                    $sumaCashAsignada += $lineCash;
                    $sumaCardAsignada += $lineCard;
                }

                $linea->update([
                    'cash_amount' => $lineCash,
                    'card_amount' => $lineCard,
                    'change_amount' => $i === $lastIndex ? $cambioAEntregar : 0,
                    'payment_method' => $metodoFinal,
                ]);
            }

            DB::commit();
            Log::info("Productos agregados al ticket: {$saleGroupId}");

            return response()->json([
                'message' => 'Productos agregados al ticket exitosamente',
                'sale_group_id' => $saleGroupId,
                'gran_total' => $granTotalTicket,
                'cambio_a_entregar' => $cambioAEntregar,
                'nuevas_lineas' => $createdSales
            ], 200);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            Log::error('Error al agregar productos al ticket', ['sale_group_id' => $saleGroupId, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Error al agregar productos al ticket'], 500);
        }
    }
}