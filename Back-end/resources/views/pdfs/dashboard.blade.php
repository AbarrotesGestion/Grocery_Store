<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 25px 30px; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1F2A22; }

        .header { border-bottom: 3px solid #2E6B4E; padding-bottom: 10px; margin-bottom: 18px; }
        .header h1 { margin: 0; font-size: 20px; color: #2E6B4E; }
        .header .meta { font-size: 10px; color: #6b7280; margin-top: 3px; }

        h2 { font-size: 13px; color: #2E6B4E; margin: 20px 0 8px; padding-bottom: 4px;
             border-bottom: 1px solid #E3DECF; }

        .cards { width: 100%; margin-bottom: 6px; }
        .cards td { width: 20%; padding: 4px; }
        .card { border: 1px solid #E3DECF; border-radius: 6px; padding: 8px; background: #FAF9F5; }
        .card .label { font-size: 8px; color: #6b7280; text-transform: uppercase; }
        .card .value { font-size: 16px; font-weight: bold; color: #1F2A22; margin-top: 2px; }

        table.data { width: 100%; border-collapse: collapse; margin-top: 4px; }
        table.data th { background: #2E6B4E; color: #fff; font-size: 9px; text-align: left;
                        padding: 6px; text-transform: uppercase; }
        table.data td { padding: 5px 6px; border-bottom: 1px solid #eee; }
        table.data tr:nth-child(even) td { background: #FAF9F5; }
        .right { text-align: right; }
        .center { text-align: center; }
        .alert { color: #dc2626; font-weight: bold; }

        .bar-row { width: 100%; margin-bottom: 3px; }
        .bar-label { width: 60px; font-size: 9px; color: #6b7280; }
        .bar-track { background: #EFEDE4; height: 14px; }
        .bar-fill { background: #2E6B4E; height: 14px; }
        .bar-value { width: 70px; font-size: 9px; text-align: right; }

        .footer { margin-top: 25px; padding-top: 8px; border-top: 1px solid #E3DECF;
                  font-size: 8px; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>

<div class="header">
    <h1>Abarrotes Katy</h1>
    <div class="meta">Reporte de Dashboard &nbsp;·&nbsp; Generado el {{ $generado }}</div>
</div>

<h2>Resumen del día</h2>
<table class="cards">
    <tr>
        <td><div class="card"><div class="label">Ventas hoy</div><div class="value">{{ $ventasHoy }}</div></div></td>
        <td><div class="card"><div class="label">Total vendido</div><div class="value">${{ number_format($ventasHoyTotal, 2) }}</div></div></td>
        <td><div class="card"><div class="label">Bajo stock</div><div class="value">{{ $productosBajoStock->count() }}</div></div></td>
        <td><div class="card"><div class="label">Deudas clientes</div><div class="value">${{ number_format($deudasPendientes, 2) }}</div></div></td>
        <td><div class="card"><div class="label">Clientes</div><div class="value">{{ $clientesActivos }}</div></div></td>
    </tr>
</table>

<h2>Ventas de los últimos 7 días</h2>
@foreach ($serie as $d)
    <table class="bar-row">
        <tr>
            <td class="bar-label">{{ $d['etiqueta'] }}</td>
            <td>
                <div class="bar-track">
                    <div class="bar-fill" style="width: {{ $maxSerie > 0 ? round(($d['total'] / $maxSerie) * 100) : 0 }}%;"></div>
                </div>
            </td>
            <td class="bar-value">${{ number_format($d['total'], 2) }}</td>
        </tr>
    </table>
@endforeach

@if ($productosBajoStock->count() > 0)
    <h2>Productos con bajo stock — requieren reabastecimiento</h2>
    <table class="data">
        <tr>
            <th>Producto</th><th class="center">Stock actual</th>
            <th class="center">Mínimo</th><th class="center">Faltante</th>
        </tr>
        @foreach ($productosBajoStock as $p)
            <tr>
                <td>{{ $p->name }}</td>
                <td class="center alert">{{ $p->stock }}</td>
                <td class="center">{{ $p->min_stock }}</td>
                <td class="center">{{ max(0, $p->min_stock - $p->stock) }}</td>
            </tr>
        @endforeach
    </table>
@endif

<h2>Productos por categoría</h2>
<table class="data">
    <tr><th>Categoría</th><th class="center">Productos</th></tr>
    @foreach ($categorias as $c)
        <tr><td>{{ $c->name }}</td><td class="center">{{ $c->products_count }}</td></tr>
    @endforeach
</table>

<h2>Últimas ventas registradas</h2>
<table class="data">
    <tr>
        <th>Fecha</th><th>Producto</th><th class="center">Cant.</th>
        <th class="right">Total</th><th class="right">Efectivo</th><th class="right">Tarjeta</th>
    </tr>
    @foreach ($ultimasVentas as $v)
        <tr>
            <td>{{ $v->created_at->format('d/m/Y H:i') }}</td>
            <td>{{ $v->product->name ?? '—' }}</td>
            <td class="center">{{ $v->quantity }}</td>
            <td class="right">${{ number_format($v->total_price, 2) }}</td>
            <td class="right">${{ number_format($v->cash_amount, 2) }}</td>
            <td class="right">${{ number_format($v->card_amount, 2) }}</td>
        </tr>
    @endforeach
</table>

<div class="footer">
    Sistema de Gestión — Abarrotes Katy &nbsp;·&nbsp; Solo se consideran ventas con estado «completada»
</div>

</body>
</html>