<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InventoryAdjustmentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ClientDebtController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\SupplierDebtController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;


// Test básico
Route::get('/test', function () {
    return response()->json([
        'message' => 'Api funcionando correctamente'
    ]);
});


// Login
Route::post('/login', [AuthController::class, 'login']);


// Usuario autenticado
Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return response()->json($request->user());
});


// Ventas
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('sales', SaleController::class);
    Route::post('sales/{id}/cancel', [SaleController::class, 'cancel']);
    Route::post('sales/{id}/revert', [SaleController::class, 'revert']);
});


// Ajustes de inventario
Route::middleware(['auth:sanctum', 'role:Almacenista,Administrador'])->group(function () {
    Route::apiResource('inventory-adjustments', InventoryAdjustmentController::class);
});


// Empleados
Route::middleware(['auth:sanctum', 'role:Administrador'])->group(function () {
    Route::apiResource('employees', EmployeeController::class);
});

// Roles
Route::middleware(['auth:sanctum', 'role:Administrador'])->group(function () {
    Route::apiResource('roles', RoleController::class);
});

// Productos
Route::middleware(['auth:sanctum', 'role:Almacenista,Administrador,Cajero'])->group(function () {
    Route::get('products/trashed', [ProductController::class, 'trashed']);
    Route::post('products/{id}/restore', [ProductController::class, 'restore']);
    Route::delete('products/{id}/force-delete', [ProductController::class, 'forceDelete']);
    Route::apiResource('products', ProductController::class);
});

// Categorías
Route::middleware(['auth:sanctum', 'role:Almacenista,Administrador'])->group(function () {
    Route::apiResource('categories', CategoryController::class);
});

// Clientes y deudas de clientes
Route::middleware(['auth:sanctum', 'role:Cajero,Administrador'])->group(function () {
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('client-debts', ClientDebtController::class);
});

// Proveedores y deudas
Route::middleware(['auth:sanctum', 'role:Administrador'])->group(function () {
    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('supplier-debts', SupplierDebtController::class);
});

// Dashboard
Route::middleware(['auth:sanctum', 'role:Administrador'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index']);
    Route::get('dashboard/reportes/ventas', [DashboardController::class, 'reporteVentas']);
    Route::get('dashboard/reportes/productos', [DashboardController::class, 'reporteProductos']);
    Route::get('dashboard/reportes/clientes', [DashboardController::class, 'reporteClientes']);
    Route::get('dashboard/reportes/deudas', [DashboardController::class, 'reporteDeudas']);
});
