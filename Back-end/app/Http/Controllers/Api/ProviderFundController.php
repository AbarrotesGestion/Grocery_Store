<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProviderFund;
use App\Models\SupplierNote;
use App\Models\SupplierDebt;
use App\Models\Supplier;

class ProviderFundController extends Controller
{
    //
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

    // public function store(Request $request)
    // {
    //     $employee = auth()->user()->employee;
    //     if (!$employee) {
    //         return response()->json(['message' => 'Empleado no encontrado'], 404);
    //     }

    //     $validated = $request->validate([
    //         'defined_amount' => 'required|numeric|min:0',
    //         'extraction_limit' => 'required|numeric|min:0',
    //         'available_balance' => 'required|numeric|min:0',
    //     ]);

    //     $fund = ProviderFund::create([
    //         'defined_amount' => $validated['defined_amount'],
    //         'extraction_limit' => $validated['extraction_limit'],
    //         'available_balance' => $validated['available_balance'],
    //         'created_by' => $employee->id,
    //     ]);

    //     return response()->json([
    //         'message' => 'Fondo de proveedor creado exitosamente',
    //         'data' => $fund
    //     ], 201);
    // }

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
        $fund = ProviderFund::find($id);
        if (!$fund) {
            return response()->json(['message' => 'Fondo de proveedor no encontrado'], 404);
        }

        $validated = $request->validate([
            'defined_amount' => 'nullable|numeric|min:0',
            'extraction_limit' => 'nullable|numeric|min:0',
            'available_balance' => 'nullable|numeric|min:0',
        ]);

        $fund->update($validated);

        return response()->json([
            'message' => 'Fondo de proveedor actualizado exitosamente',
            'data' => $fund
        ], 200);
    }

    public function extract(Request $request, $id)
    {
        $fund = ProviderFund::find($id);
        if (!$fund) {
            return response()->json(['message' => 'Fondo de proveedor no encontrado'], 404);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        if ($validated['amount'] > $fund->available_balance) {
            return response()->json(['message' => 'El monto a extraer excede el saldo disponible'], 400);
        }

        $fund->available_balance -= $validated['amount'];
        $fund->save();

        return response()->json([
            'message' => 'Monto extraído exitosamente',
            'data' => $fund
        ], 200);
    }


}
