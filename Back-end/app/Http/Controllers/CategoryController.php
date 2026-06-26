<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::withCount('products')->orderBy('name', 'asc')->get();
        
        return response()->json(['message' => 'Categorías obtenidas exitosamente', 'data' => $categories], 200);
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
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string|max:500',
        ]);

        Category::create($validated);
        
        return response()->json(['message' => 'Categoría creada exitosamente', 'data' => $validated], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = Category::with('products')->findOrFail($id);
        return response()->json(['message' => 'Categoría obtenida exitosamente', 'data' => $category], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $category = Category::findOrFail($id);
        return response()->json(['message' => 'Categoría obtenida exitosamente', 'data' => $category], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string|max:500',
        ]);

        $category->update($validated);
        
        return response()->json(['message' => 'Categoría actualizada exitosamente', 'data' => $category], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);
        
        // Verificar si la categoría tiene productos asociados
        if ($category->products()->exists()) {
            return response()->json(['message' => 'No se puede eliminar la categoría porque tiene productos asociados'], 400);
        }
        
        $category->delete();
        
        return response()->json(['message' => 'Categoría eliminada exitosamente'], 200);
    }
}