<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;

class ProductController extends Controller
{
    //
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('category')->orderBy('name', 'asc')->get();
        return response()->json($products);
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
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'price' => 'required|numeric|min:0.01',
            'purchase_price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'barcode' => 'nullable|string|max:255',
            'package_size' => 'nullable|integer|min:0',
            'stock_in_units' => 'nullable|integer|min:0',
            'price_per_unit' => 'nullable|numeric|min:0',
            'price_per_package' => 'nullable|numeric|min:0',
            'allows_unit_sale' => 'nullable|boolean',
            'allows_package_sale' => 'nullable|boolean',
            'allows_weight_sale' => 'nullable|boolean',
            'price_per_kg' => 'nullable|numeric|min:0',
        ]);

        // Asegurar que el stock tenga un valor por defecto
        $validated['stock'] = $validated['stock'] ?? 0;

        $product = Product::create($validated);

        return response()->json($product);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with('category')->findOrFail($id);
        return response()->json($product);
    }

    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'price' => 'required|numeric|min:0.01',
            'purchase_price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'barcode' => 'nullable|string|max:255',
            'package_size' => 'nullable|integer|min:0',
            'stock_in_units' => 'nullable|integer|min:0',
            'price_per_unit' => 'nullable|numeric|min:0',
            'price_per_package' => 'nullable|numeric|min:0',
            'allows_unit_sale' => 'nullable|boolean',
            'allows_package_sale' => 'nullable|boolean',
            'allows_weight_sale' => 'nullable|boolean',

            'price_per_kg' => 'nullable|numeric|min:0',
        ]);

        $product->update($validated);

        return response()->json(['message' => 'Producto actualizado exitosamente']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $product = Product::findOrFail($id);

            // Verificar si tiene ventas
            $ventasCount = $product->sales()->count();

            if ($ventasCount > 0) {
                return response()->json(['error' => "No se puede eliminar: tiene {$ventasCount} ventas."], 400);
            }

            $product->delete();
            return response()->json(['message' => 'Producto eliminado correctamente']);
        } catch (\Exception $e) {

            return response()->json(['error' => 'Error al eliminar: ' . $e->getMessage()], 500);
        }
    }


    public function trashed()
    {
        $products = Product::onlyTrashed()
            ->with('category')
            ->orderBy('deleted_at', 'desc')
            ->get();

        return response()->json($products);
    }
    // este es para restaurar un producto eliminado
    public function restore(string $id)
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->restore();

        return response()->json(['message' => 'Producto restaurado exitosamente']);
    }

    //este solo es borrar pernamente si es que el producto deja de existir 
    public function forceDelete(string $id)
    {
        // Solo administradores pueden eliminar permanentemente
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json([
                'error' => 'No tienes permisos para eliminar permanentemente productos'
            ], 403);
        }

        $product = Product::onlyTrashed()->findOrFail($id);

        // Verificar que no tenga ventas
        if ($product->sales()->count() > 0) {
            return response()->json(['error' => 'No se puede eliminar permanentemente porque tiene ventas registradas.'], 400);
        }

        // Eliminar PERMANENTEMENTE (se borra de la BD)
        $product->forceDelete();

        return response()->json(['message' => 'Producto eliminado permanentemente de la base de datos']);
    }



    public function match(Request $request)
    {
        $validated = $request->validate([
            'products' => 'required|array|min:1',
            'products.*.nombre' => 'required|string',
            'products.*.cantidad' => 'nullable|numeric',
            'products.*.precio_unitario' => 'nullable|numeric',
        ]);

        $matched = [];
        $unmatched = [];

        foreach ($validated['products'] as $item) {
            $nombreBuscado = strtolower(trim($item['nombre']));

            // PASO 1: buscar el producto con whereRaw como te expliqué
            $producto = Product::whereRaw('LOWER(name) = ?', [$nombreBuscado])->first();

            // PASO 2: si $producto existe, agregarlo a $matched con su id y nombre
            if ($producto) {
                $matched[] = [
                    'id' => $producto->id,
                    'name' => $producto->name,
                    'cantidad' => $item['cantidad'] ?? null,
                    'precio_unitario' => $item['precio_unitario'] ?? null,
                ];
            }
            // PASO 3: si no existe, agregarlo a $unmatched con el nombre original
            else {
                $unmatched[] = $item['nombre'];
            }
        }

        return response()->json([
            'matched' => $matched,
            'unmatched' => $unmatched,
        ]);
    }
}
