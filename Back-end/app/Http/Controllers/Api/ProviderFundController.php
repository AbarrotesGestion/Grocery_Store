<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProviderFund;
use App\Models\SupplierNote;
use App\Models\SupplierDebt;
use App\Models\Supplier;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProviderFundController extends Controller
{
    public function index(Request $request)
    {
        $supplierDebts = Supplier::withSum(['debts' => function($query) {
            $query->whereIn('status', ['pending', 'overdue']);
        }], 'amount')->get();

        $funds = ProviderFund::with('createdBy')->get();

        $notasPendientes = SupplierNote::with('supplier')
            ->where('status', 'pending')
            ->get()
            ->groupBy('supplier_id');

        return response()->json([
            'data' => $funds,
            'suppliers_pending' => $supplierDebts,
            'supplier_notes_pending' => $notasPendientes,
        ], 200);
    }

    public function show($id)
    {
        $fund = ProviderFund::with('createdBy')->find($id);
        if (!$fund) {
            return response()->json(['message' => 'Fondo de proveedor no encontrado'], 404);
        }
        return response()->json([
            'data' => $fund
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'defined_amount' => 'nullable|numeric|min:0',
            'extraction_limit' => 'nullable|numeric|min:0',
            'available_balance' => 'nullable|numeric|min:0',
        ]);

        try {
            $fund = ProviderFund::find($id);
            if (!$fund) {
                return response()->json(['message' => 'Fondo de proveedor no encontrado'], 404);
            }

            $fund->update($validated);

            return response()->json([
                'message' => 'Fondo de proveedor actualizado exitosamente',
                'data' => $fund
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error al actualizar fondo de proveedor', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Error al actualizar el fondo de proveedor'], 500);
        }
    }

    /**
     * FIX: antes esto hacía "leer saldo -> validar -> restar -> guardar" sin
     * transacción ni bloqueo. Dos extracciones simultáneas podían leer el
     * mismo available_balance, ambas pasar la validación, y ambas restar,
     * dejando el fondo sobregirado. Ahora usa lockForUpdate() dentro de una
     * transacción: la segunda petición concurrente espera a que la primera
     * termine y commitee antes de leer el saldo actualizado.
     */
    public function extract(Request $request, $id)
{
    $validated = $request->validate([
        'amount' => 'required|numeric|min:0',
    ]);

    try {
        return DB::transaction(function () use ($validated, $id) {
            $fund = ProviderFund::lockForUpdate()->find($id);

            if (!$fund) {
                return response()->json(['message' => 'Fondo de proveedor no encontrado'], 404);
            }

            if ($validated['amount'] > $fund->available_balance) {
                return response()->json(['message' => 'El monto a extraer excede el saldo disponible'], 400);
            }

            // FIX: faltaba validar contra extraction_limit (RF-45). Antes solo
            // se comparaba contra available_balance, permitiendo extracciones
            // que superaban el límite configurado por el dueño para proteger
            // el efectivo de caja.
            if ($fund->extraction_limit !== null && $validated['amount'] > $fund->extraction_limit) {
                return response()->json([
                    'message' => "El monto excede el límite de extracción configurado (\${$fund->extraction_limit}). Requiere autorización del dueño.",
                    'extraction_limit' => $fund->extraction_limit,
                ], 422);
            }

            $fund->decrement('available_balance', $validated['amount']);

            return response()->json([
                'message' => 'Monto extraído exitosamente',
                'data' => $fund->fresh()
            ], 200);
        });
    } catch (\Exception $e) {
        Log::error('Error al extraer del fondo de proveedor', ['id' => $id, 'error' => $e->getMessage()]);
        return response()->json(['message' => 'Error al extraer del fondo de proveedor'], 500);
    }
}
}