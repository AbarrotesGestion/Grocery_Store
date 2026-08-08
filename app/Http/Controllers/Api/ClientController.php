<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Client;

class ClientController extends Controller
{
    //
      public function index()
    {
        $clients = Client::orderBy('first_name', 'asc')->get();
        return response()->json([
            'message' => 'Lista de clientes',
            'data' => $clients
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'required|string|max:20',
            'street_1' => 'required|string|max:255',
            'street_2' => 'nullable|string|max:255',
            'neighborhood' => 'required|string|max:255',
        ]);

        $Client = Client::create($validated);
        return response()->json([
            'message' => 'cliente creado exitosamente',
            'data' => $Client
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $client = Client::with('debts')->findOrFail($id);
        return response()->json([
            'message' => 'Cliente encontrado',
            'data' => $client
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $client = Client::findOrFail($id);
        
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email,' . $id,
            'phone' => 'required|string|max:20',
            'street_1' => 'required|string|max:255',
            'street_2' => 'nullable|string|max:255',
            'neighborhood' => 'required|string|max:255',
        ]);

        $client->update($validated);
        
        return response()->json([
            'message' => 'Cliente actualizado exitosamente',
            'data' => $client
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $client = Client::findOrFail($id);
        
        // Verificar si el cliente tiene deudas pendientes
        if ($client->debts()->whereIn('status', ['pending', 'overdue'])->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el cliente porque tiene deudas pendientes',
            ], 400);
        }
        
        $client->delete();
        
        return response()->json([
            'message' => 'Cliente eliminado exitosamente',
            'data' => $client
        ], 200);
    }
}
