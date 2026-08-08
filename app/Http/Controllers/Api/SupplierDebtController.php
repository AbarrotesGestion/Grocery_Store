<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupplierDebt;
use Illuminate\Http\Request;
use Exception;

class SupplierDebtController extends Controller
{
    //
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Obtener todas las deudas con su proveedor asociado
            $debts = SupplierDebt::with('supplier')->get();
            return response()->json([
                'message' => 'Lista de deudas de proveedores',
                'data' => $debts
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la lista de deudas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validar los datos del formulario
            $validated = $request->validate([
                'supplier_id' => 'required|exists:suppliers,id',
                'start_date' => 'required|date',
                'due_date' => 'required|date|after:start_date',
                'amount' => 'required|numeric|min:0.01',
                'status' => 'required|in:pending,paid,overdue',
            ]);

            // Crear la deuda con los datos validados
            $debt = SupplierDebt::create($validated);
            return response()->json([
                'message' => 'Deuda del proveedor creada exitosamente',
                'data' => $debt
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al crear la deuda del proveedor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $debt = SupplierDebt::with('supplier')->findOrFail($id);
            return response()->json([
                'message' => 'Deuda encontrada',
                'data' => $debt
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Deuda no encontrada o error en el servidor',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $debt = SupplierDebt::findOrFail($id);

            // Validar los datos del formulario
            $validated = $request->validate([
                'supplier_id' => 'required|exists:suppliers,id',
                'start_date' => 'required|date',
                'due_date' => 'required|date|after:start_date',
                'amount' => 'required|numeric|min:0.01',
                'status' => 'required|in:pending,paid,overdue',
            ]);

            // Actualizar con datos validados
            $debt->update($validated);
            return response()->json([
                'message' => 'Deuda del proveedor actualizada exitosamente',
                'data' => $debt
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la deuda del proveedor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $debt = SupplierDebt::findOrFail($id);

            // No permitir eliminar deudas pendientes o vencidas
            if (in_array($debt->status, ['pending', 'overdue'])) {
                return response()->json([
                    'message' => 'No se puede eliminar una deuda pendiente o vencida.'
                ], 409);
            }

            $debt->delete();
            return response()->json([
                'message' => 'Deuda del proveedor eliminada exitosamente'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar la deuda del proveedor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}