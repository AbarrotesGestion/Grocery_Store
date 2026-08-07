<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        return response()->json($roles);
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $role = Role::create($validate);
            DB::commit();
            return response()->json([
                'message' => 'Rol creado exitosamente',
                'role' => $role
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error al crear rol', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al crear el rol'], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $role = Role::findOrFail($id);
            $role->update($validate);
            DB::commit();
            return response()->json(['message' => 'Rol actualizado exitosamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al actualizar rol', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al actualizar el rol'], 500);
        }
    }

    /**
     * FIX: antes esto borraba el rol sin verificar si había empleados
     * asignados. Todos tus demás controladores de entidad referenciada
     * (Category, Client, Supplier) sí bloquean el borrado en ese caso —
     * aquí faltaba el mismo criterio.
     */
    public function destroy(string $id)
    {
        try {
            $role = Role::findOrFail($id);

            if ($role->employees()->exists()) {
                return response()->json([
                    'message' => 'No se puede eliminar el rol porque hay empleados asignados a él'
                ], 409);
            }

            $role->delete();
            return response()->json(['message' => 'Rol eliminado exitosamente']);
        } catch (\Exception $e) {
            Log::error('Error al eliminar rol', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al eliminar el rol'], 500);
        }
    }
}