<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CashRegister;
use App\Models\Sale;
use App\Models\Employee;

class CashRegisterController extends Controller
{
    //
    public function index()
    {
        $cashRegisters = CashRegister::with('employee')->orderBy('opened_at', 'desc')->get();
        return response()->json(['message' => 'Registros de caja disponibles', 'data' => $cashRegisters], 200);
    }

    public function show(string $id)
    {
        $cashRegister = CashRegister::with(['employee', 'sales'])->findOrFail($id);
        return response()->json(['message' => 'Registro de caja encontrado', 'data' => $cashRegister], 200);
    }


    public function active()
    {
        $employee = auth()->user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'No se encontró el empleado asociado al usuario autenticado'], 404);
        }

        $activeCashRegister = CashRegister::where('employee_id', $employee->id)
            ->whereNull('closed_at')
            ->first();

        if (!$activeCashRegister) {
            return response()->json(['message' => 'No tienes un turno abierto'], 404);
        }

        return response()->json(['message' => 'Turno activo encontrado', 'data' => $activeCashRegister], 200);
    }


    public function open(Request $request)
    {
        // 1. Validar opening_cash
        $validated = $request->validate([
            'opening_cash' => 'required|numeric|min:0',
        ]);

        // 2. Obtener el empleado autenticado
        $employee = auth()->user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'No se encontró el empleado asociado al usuario autenticado'], 404);
        }

        // 3. Verificar que no tenga un turno ya abierto (sin closed_at)
        $turnoAbierto = CashRegister::where('employee_id', $employee->id)
            ->whereNull('closed_at')
            ->first();
        if ($turnoAbierto) {
            return response()->json(['message' => 'Ya tienes un turno abierto'], 400);
        }

        // 4. Crear el registro en cash_registers
        $cashRegister = CashRegister::create([
            'employee_id' => $employee->id,
            'opening_cash' => $validated['opening_cash'],
            'opened_at' => now(),
        ]);

        // 5. Devolver JSON con el turno creado
        return response()->json(['message' => 'Turno abierto exitosamente', 'data' => $cashRegister], 201);
    }

    public function close(Request $request)
    {

        // repetir el mimo paso con open 
        $closedCash = $request->validate([
            'closed_cash' => 'required|numeric|min:0',
        ]);

        $turnoAbierto = CashRegister::where('employee_id', auth()->user()->employee->id)
            ->whereNull('closed_at')
            ->first();
        if (!$turnoAbierto) {
            return response()->json(['message' => 'No tienes un turno abierto para cerrar'], 400);
        }

        $totalEfectivo = Sale::where('cash_register_id', $turnoAbierto->id)
            ->where('payment_method', 'cash')
            ->sum('cash_amount');
        $expectedCash = $turnoAbierto->opening_cash + $totalEfectivo;

        $turnoAbierto->update([
            // ¿qué campos actualizas aquí?
            'closed_at' => now(),
            'actual_cash' => $closedCash['closed_cash'],
            'expected_cash' => $expectedCash,
        ]);
        return response()->json(['message' => 'Turno cerrado exitosamente', 'data' => $turnoAbierto], 200);
    }
}
