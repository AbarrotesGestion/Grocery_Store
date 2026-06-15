<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class SaleController extends Controller
{
    //
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
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'client_id' => 'nullable|exists:clients,id',
        ]);

        DB::beginTransaction();
        try {
            // Obtener empleado autenticado
            $employee = auth()->user()->employee;
            if (!$employee) {
                DB::rollBack();
                return response()->json(['message' => 'No se encontró el empleado asociado al usuario autenticado'], 404);
            }

            $product = Product::findOrFail($validated['product_id']);

            // Verificar stock disponible
            if ($product->stock < $validated['quantity']) {
                DB::rollBack();
                return response()->json(['message' => 'No hay suficiente stock para realizar la venta'], 400);
            }

            // Registrar la venta
            $total = $product->price * $validated['quantity'];
            $sale = Sale::create([
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'total_price' => $total,
                'employee_id' => $employee->id,
                'client_id' => $validated['client_id'] ?? null, // Asociar con el cliente autenticado
                'status' => 'completed', // Establecer el estado inicial de la venta
            ]);

            // Descontar el stock del producto
            $product->decrement('stock', $validated['quantity']);

            DB::commit();
            Log::info('Venta registrada exitosamente: ' . $sale->id);
            
            return response()->json(['message' => 'Venta registrada exitosamente', 'data' => $sale], 201);
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al registrar venta: ' . $e->getMessage());
            return response()->json(['message' => 'Ocurrió un error al registrar la venta: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
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
            'quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $sale = Sale::findOrFail($id);
            $oldProduct = Product::findOrFail($sale->product_id);
            $newProduct = Product::findOrFail($validated['product_id']);

            // Devolver stock del producto anterior
            $oldProduct->increment('stock', $sale->quantity);

            // Verificar stock del nuevo producto
            if ($newProduct->stock < $validated['quantity']) {
                DB::rollBack();
                return response()->json(['message' => 'No hay suficiente stock disponible'], 400);
            }

            // Descontar stock del nuevo producto
            $newProduct->decrement('stock', $validated['quantity']);

            // Actualizar venta
            $sale->update([
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'total_price' => $newProduct->price * $validated['quantity'],
            ]);

            DB::commit();
            return response()->json(['message' => 'Venta actualizada exitosamente', 'data' => $sale], 200);
                
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar la venta: ' . $e->getMessage()], 500);
        }
    }
// se agrgan don dunciones en la cula se pueden cancelar la venta y revertir la cancelacion de la venta

 public function cancel(string $id)
    {
        $sale = Sale::findOrFail($id);
        
        // Verificar si ya está cancelada
        if ($sale->isCancelled()) {
            return response()->json(['message' => 'Esta venta ya está cancelada'], 400);
        }

        DB::beginTransaction();
        try {
            // Cancelar venta (devuelve stock automáticamente)
            if ($sale->cancel()) {
                DB::commit();
                Log::info('Venta cancelada: ' . $sale->id);
                return response()->json(['message' => 'Venta cancelada exitosamente. Stock devuelto al inventario.'], 200);
            } else {
                DB::rollBack();
                return response()->json(['message' => 'No se pudo cancelar la venta'], 400);
            }
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al cancelar venta: ' . $e->getMessage());
            
            return response()->json(['message' => 'Error al cancelar la venta: ' . $e->getMessage()], 500);
        }
    }

    /**
     * REVERTIR CANCELACIÓN (opcional)
     */
    public function revert(string $id)
    {
        // Solo administradores pueden revertir
        if (!auth()->user()->isAdmin()) {
        return response()->json(['message' => 'No tienes permisos para revertir ventas canceladas'], 403);
        }

        $sale = Sale::findOrFail($id);
        
        if (!$sale->isCancelled()) {
            return response()->json(['message' => 'Esta venta no está cancelada'], 400);
        }

        DB::beginTransaction();
        try {
            // Revertir cancelación
            if ($sale->revert()) {
                DB::commit();
                Log::info('Venta revertida: ' . $sale->id);
                return response()->json(['message' => 'Venta revertida exitosamente. Stock ajustado.'], 200);
            } else {
                DB::rollBack();
                return response()->json(['message' => 'No hay stock suficiente para revertir la cancelación'], 400);
            }
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al revertir venta: ' . $e->getMessage());
            
            return response()->json(['message' => 'Error al revertir la venta: ' . $e->getMessage()], 500);
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
            $product = Product::findOrFail($sale->product_id);

            // Devolver el stock al producto
            $product->increment('stock', $sale->quantity);

            $sale->delete();

            DB::commit();
            return response()->json(['message' => 'Venta eliminada exitosamente'], 200);
                
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al eliminar la venta: ' . $e->getMessage()], 500);
        }
    }
}
