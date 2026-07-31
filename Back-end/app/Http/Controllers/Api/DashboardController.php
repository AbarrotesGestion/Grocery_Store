<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Product;
use App\Models\Client;
use App\Models\ClientDebt;
use App\Models\Category;
use App\Models\SupplierDebt;
use Carbon\Carbon;

class DashboardController extends Controller
{
    //
    public function index()
    {
        // 1. Estadísticas Básicas
        $ventasHoy = Sale::whereDate('created_at', Carbon::today())->count();
        $ventasHoyTotal = Sale::whereDate('created_at', Carbon::today())->sum('total_price');
        $productosConBajoStock = Product::whereColumn('stock', '<=', 'min_stock')->count();
        $deudasPendientes = ClientDebt::whereIn('status', ['pending', 'overdue'])->sum('balance_due');
        $clientesActivos = Client::count();

        // 2. Datos para Gráfica de Ganancias vs Gastos (Últimos 7 días)
        $diasLabels = [];
        $gananciasData = [];
        $gastosData = [];

        $ventas =  Sale::whereBetween('created_at', [Carbon::today()->subDays(6), Carbon::today()])
            ->selectRaw('DATE(created_at) as fecha, SUM(total_price) as total')
            ->groupBy('fecha')
            ->pluck('total', 'fecha');
        $deudas = SupplierDebt::whereBetween('created_at', [Carbon::today()->subDays(6), Carbon::today()])
            ->selectRaw('DATE(created_at) as fecha, SUM(amount) as total')
            ->groupBy('fecha')
            ->pluck('total', 'fecha');
        $gastos = Sale::whereBetween('sales.created_at', [Carbon::today()->subDays(6), Carbon::today()])
            ->join('products', 'sales.product_id', '=', 'products.id')
            ->selectRaw('DATE(sales.created_at) as fecha, SUM(products.purchase_price * sales.quantity) as total')
            ->groupBy('fecha')
            ->pluck('total', 'fecha');

        for ($i = 6; $i >= 0; $i--) {
            $fecha = Carbon::today()->subDays($i);
            $diasLabels[] = $fecha->format('d M');
            $gananciasData[] = $ventas[$fecha->format('Y-m-d')] ?? 0;
            $deudas_Proveedor[] = $deudas[$fecha->format('Y-m-d')] ?? 0;
            $gastosData[] = $gastos[$fecha->format('Y-m-d')] ?? 0;
        }

        // 3. Datos para Gráfica de Inventario
        $categorias = Category::withCount('products')->get();
        $labelsCategorias = $categorias->pluck('name');
        $conteoProductos = $categorias->pluck('products_count');
        $totalProductos = $conteoProductos->sum();

        // 4. Últimas 5 ventas
        $ultimasVentas = Sale::with(['product', 'employee', 'client'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        return response()->json([
            'message' => 'Dashboard',
            'ventasHoy' => $ventasHoy,
            'ventasHoyTotal' => $ventasHoyTotal,
            'productosConBajoStock' => $productosConBajoStock,
            'deudasPendientes' => $deudasPendientes,
            'clientesActivos' => $clientesActivos,
            'ultimasVentas' => $ultimasVentas,
            'diasLabels' => $diasLabels,
            'gananciasData' => $gananciasData,
            'gastosData' => $gastosData,
            'labelsCategorias' => $labelsCategorias,
            'conteoProductos' => $conteoProductos,
            'totalProductos' => $totalProductos,
            'ventas' => $ventas,
            'deudasProveedor' => $deudas_Proveedor,
        ]);
    }

    public function reporteVentas()
    {
        $ventas = Sale::with(['product', 'employee', 'client'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'message' => 'Reporte de ventas',
            'data' => $ventas
        ], 200);
    }

    public function reporteProductos()
    {
        $productos = Product::with('category')
            ->orderBy('stock', 'asc')
            ->get();
        return response()->json([
            'message' => 'Reporte de productos',
            'data' => $productos
        ], 200);
    }

    public function reporteClientes()
    {
        $clientes = Client::withCount('debts')
            ->with('debts')
            ->get();
        return response()->json([
            'message' => 'Reporte de clientes',
            'data' => $clientes
        ], 200);
    }

    public function reporteDeudas()
    {
        $deudasClientes = ClientDebt::with('client')
            ->whereIn('status', ['pending', 'overdue'])
            ->orderBy('due_date', 'asc')
            ->get();
        return response()->json([
            'message' => 'Reporte de deudas de clientes',
            'data' => $deudasClientes
        ], 200);
    }
}
