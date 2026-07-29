<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SupplierNote;
use App\Models\SupplierNoteDetail;
use Illuminate\Support\Facades\DB;
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

public function confirm($id)
{
    $employee = auth()->user()->employee;
    if (!$employee) {
        return response()->json(['message' => 'Empleado no encontrado'], 404);
    }

    $note = SupplierNote::with('details.product')->findOrFail($id);

    if ($note->status !== 'pending') {
        return response()->json(['message' => 'Solo se pueden confirmar notas pendientes'], 400);
    }

    DB::beginTransaction();
    try {
        // Actualizar stock de cada producto
        foreach ($note->details as $detail) {
            $detail->product->increment('stock', $detail->quantity_agreed);
        }

        $note->update([
            'status' => 'confirmed',
            'confirmed_by' => $employee->id,
        ]);

        DB::commit();
        return response()->json(['message' => 'Nota confirmada y stock actualizado', 'data' => $note], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


    public function scan()
    {

        $notes = SupplierNote::with(['supplier', 'details.product', 'createdBy', 'confirmedBy'])->get();
        return response()->json([
            'data' => $notes
        ], 200);
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
