<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ClientDebt;


class ClientDebtController extends Controller
{
    public function index()
    {
        $debts = ClientDebt::with('client')->orderBy('due_date', 'asc')->get();
        return response()->json([
            'data' => $debts
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'sale_id' => 'nullable|exists:sales,id',
            'start_date' => 'required|date',
            'due_date' => 'required|date|after:start_date',
            'balance_due' => 'required|numeric|min:0.01',
            'status' => 'required|in:pending,paid,overdue',
        ]);

        $debt = ClientDebt::create($validated);
        return response()->json([
            'message' => 'Deuda del cliente creada exitosamente',
            'data' => $debt
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $debt = ClientDebt::with('client')->findOrFail($id);
        return response()->json([
            'message' => 'Deuda encontrada',
            'data' => $debt
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $debt = ClientDebt::findOrFail($id);

        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'sale_id' => 'nullable|exists:sales,id',
            'start_date' => 'required|date',
            'due_date' => 'required|date|after:start_date',
            'balance_due' => 'required|numeric|min:0.01',
            'status' => 'required|in:pending,paid,overdue',
        ]);

        $debt->update($validated);

        return response()->json([
            'message' => 'Deuda del cliente actualizada exitosamente',
            'data' => $debt
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $debt = ClientDebt::findOrFail($id);

        // No permitir eliminar deudas pendientes
        if (in_array($debt->status, ['pending', 'overdue'])) {
            return response()->json([
                'message' => 'No se puede eliminar una deuda pendiente o vencida. Por favor, actualice el estado a pagada antes de eliminar.'
            ], 409);
        }

        $debt->delete();
        return response()->json([
            'message' => 'Deuda del cliente eliminada exitosamente'
        ], 200);
    }
}
