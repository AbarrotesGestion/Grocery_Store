<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\InventoryAdjustmentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\RoleController;

Route::get('/test',function(){
    return response ()->json([
        'message' => 'Api funcionando correctamente'
    ]);
});
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return response()->json($request->user());
});



Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('sales', \App\Http\Controllers\Api\SaleController::class);
    Route::post('sales/{id}/cancel', [\App\Http\Controllers\Api\SaleController::class, 'cancel']);
    Route::post('sales/{id}/revert', [\App\Http\Controllers\Api\SaleController::class, 'revert']);
});


Route::middleware(['auth:sanctum', 'role:Almacenista'])->group(function () {
    // aquí van las rutas de productos
    Route::get('/productos',function(){
    return response ()->json([
        'message' => ',lista de productos'
    ]);


});
});

Route::middleware(['auth:sanctum', 'role:Almacenista,Administrador'])->group(function () {
    Route::apiResource('inventory-adjustments', InventoryAdjustmentController::class);
});


Route::middleware(['auth:sanctum', 'role:Administrador'])->group(function () {
    Route::apiResource('employees', EmployeeController::class);
});

Route::middleware(['auth:sanctum', 'role:Administrador'])->group(function () {
    Route::apiResource('roles', RoleController::class);
});

Route::middleware(['auth:sanctum', 'role:Almacenista,Administrador,Cajero'])->group(function () {
 Route::get('products/trashed', [ProductController::class, 'trashed']);
    Route::post('products/{id}/restore', [ProductController::class, 'restore']);
    Route::delete('products/{id}/force-delete', [ProductController::class, 'forceDelete']);
    Route::apiResource('products', ProductController::class);
});


