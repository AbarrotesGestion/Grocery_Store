<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Reporte de Dashboard — Abarrotes Katy</title>
    <style>
        @page { 
            margin: 25px 30px 45px 30px; 
        }

        body { 
            font-family: 'DejaVu Sans', sans-serif; 
            font-size: 10px; 
            color: #1F2A22; 
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }

        /* --- ENCABEZADO --- */
        .header-table {
            width: 100%;
            border-bottom: 3px solid #2E6B4E;
            padding-bottom: 8px;
            margin-bottom: 15px;
        }
        .header-title {
            font-size: 20px;
            font-weight: bold;
            color: #2E6B4E;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .header-subtitle {
            font-size: 10px;
            color: #6b7280;
            margin-top: 2px;
        }
        .header-badge {
            background-color: #2E6B4E;
            color: #ffffff;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
            text-align: right;
            display: inline-block;
        }

        /* --- TÍTULOS DE SECCIÓN --- */
        h2 { 
            font-size: 12px; 
            color: #2E6B4E; 
            margin: 16px 0 8px 0; 
            padding-bottom: 3px;
            border-bottom: 1.5px solid #E3DECF; 
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        /* --- TARJETAS KPI (RESUMEN) --- */
        .cards { 
            width: 100%; 
            margin-bottom: 8px; 
            border-spacing: 4px;
            border-collapse: separate;
        }
        .cards td { 
            width: 20%; 
            padding: 0;
            vertical-align: top;
        }
        .card { 
            border: 1px solid #E3DECF; 
            border-radius: 6px; 
            padding: 8px 6px; 
            background: #FAF9F5; 
            text-align: center;
        }
        .card .label { 
            font-size: 7.5px; 
            color: #6b7280; 
            text-transform: uppercase; 
            font-weight: bold;
        }
        .card .value { 
            font-size: 14px; 
            font-weight: bold; 
            color: #1F2A22; 
            margin-top: 4px; 
        }

        /* --- TABLAS DE DATOS --- */
        table.data { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 4px; 
            page-break-inside: avoid;
        }
        table.data th { 
            background: #2E6B4E; 
            color: #ffffff; 
            font-size: 8.5px; 
            text-align: left;
            padding: 6px; 
            text-transform: uppercase; 
            letter-spacing: 0.2px;
        }
        table.data td { 
            padding: 5px 6px; 
            border-bottom: 1px solid #E3DECF; 
            font-size: 9px;
        }
        table.data tr:nth-child(even) td { 
            background: #FAF9F5; 
        }

        /* Utilidades */
        .right { text-align: right; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .alert { color: #dc2626; font-weight: bold; }
        .muted { color: #9ca3af; }
        .ticket-code {
            font-family: monospace;
            background-color: #EFEDE4;
            padding: 1px 4px;
            border-radius: 3px;
            font-size: 8.5px;
            color: #2E6B4E;
        }

        /* --- BARRAS DE GRÁFICO (ÚLTIMOS 7 DÍAS) --- */
        .bar-container {
            width: 100%;
            margin-bottom: 8px;
            page-break-inside: avoid;
        }
        .bar-row { 
            width: 100%; 
            margin-bottom: 2px; 
            border-collapse: collapse;
        }
        .bar-label { 
            width: 55px; 
            font-size: 8.5px; 
            color: #4b5563; 
            font-weight: bold;
        }
        .bar-track { 
            background: #EFEDE4; 
            height: 12px; 
            border-radius: 3px;
            overflow: hidden;
        }
        .bar-fill { 
            background: #2E6B4E; 
            height: 12px; 
            border-radius: 3px;
        }
        .bar-value { 
            width: 75px; 
            font-size: 8.5px; 
            text-align: right; 
            font-weight: bold;
            color: #1F2A22;
        }

        /* --- PIE DE PÁGINA FIJO --- */
        .footer { 
            position: fixed;
            bottom: -30px;
            left: 0;
            right: 0;
            padding-top: 6px; 
            border-top: 1px solid #E3DECF;
            font-size: 8px; 
            color: #9ca3af; 
            width: 100%;
        }
        .footer-table {
            width: 100%;
        }
        .page-number:before {
            content: "Página " counter(page);
        }
    </style>
</head>
<body>

    <!-- PIE DE PÁGINA FIJO -->
    <div class="footer">
        <table class="footer-table">
            <tr>
                <td style="text-align: left;">Abarrotes Katy &nbsp;·&nbsp; Sistema de Gestión Punto de Venta</td>
                <td style="text-align: center; font-style: italic;">Solo incluye ventas completadas</td>
                <td style="text-align: right;" class="page-number"></td>
            </tr>
        </table>
    </div>

    <!-- ENCABEZADO -->
    <table class="header-table">
        <tr>
            <td style="vertical-align: middle;">
                <div class="header-title">Abarrotes Katy</div>
                <div class="header-subtitle">Reporte Ejecutivo de Dashboard</div>
            </td>
            <td style="text-align: right; vertical-align: middle;">
                <div class="header-badge">Generado: {{ $generado }}</div>
            </td>
        </tr>
    </table>

    <!-- TARJETAS DE RESUMEN (KPIs) -->
    <h2>Resumen del día</h2>
    <table class="cards">
        <tr>
            <td>
                <div class="card">
                    <div class="label">Tickets hoy</div>
                    <div class="value">{{ $ventasHoy }}</div>
                </div>
            </td>
            <td>
                <div class="card">
                    <div class="label">Total vendido</div>
                    <div class="value">${{ number_format($ventasHoyTotal, 2) }}</div>
                </div>
            </td>
            <td>
                <div class="card">
                    <div class="label">Bajo stock</div>
                    <div class="value {{ $productosBajoStock->count() > 0 ? 'alert' : '' }}">
                        {{ $productosBajoStock->count() }}
                    </div>
                </div>
            </td>
            <td>
                <div class="card">
                    <div class="label">Deudas clientes</div>
                    <div class="value">${{ number_format($deudasPendientes, 2) }}</div>
                </div>
            </td>
            <td>
                <div class="card">
                    <div class="label">Clientes</div>
                    <div class="value">{{ $clientesActivos }}</div>
                </div>
            </td>
        </tr>
    </table>

    <!-- GRÁFICO DE BARRAS DE VENTAS -->
    <h2>Ventas de los últimos 7 días</h2>
    <div class="bar-container">
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
    </div>

    <!-- ALERTA DE PRODUCTOS CON BAJO STOCK -->
    @if ($productosBajoStock->count() > 0)
        <h2>Productos con bajo stock — requieren reabastecimiento</h2>
        <table class="data">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th class="center">Stock actual</th>
                    <th class="center">Stock Mínimo</th>
                    <th class="center">Faltante</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($productosBajoStock as $p)
                    <tr>
                        <td>{{ $p->name }}</td>
                        <td class="center alert">{{ $p->stock }}</td>
                        <td class="center">{{ $p->min_stock }}</td>
                        <td class="center bold">{{ max(0, $p->min_stock - $p->stock) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <!-- CATEGORÍAS -->
    <h2>Productos por categoría</h2>
    <table class="data">
        <thead>
            <tr>
                <th>Categoría</th>
                <th class="center">Número de Productos</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($categorias as $c)
                <tr>
                    <td>{{ $c->name }}</td>
                    <td class="center">{{ $c->products_count }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <!-- ÚLTIMAS VENTAS REGISTRADAS -->
    <h2>Últimas ventas registradas</h2>
    <table class="data">
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Ticket</th>
                <th>Producto</th>
                <th class="center">Cant.</th>
                <th class="right">Total</th>
                <th class="right">Efectivo</th>
                <th class="right">Tarjeta</th>
                <th>Empleado</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($ultimasVentas as $v)
                <tr>
                    <td>{{ $v->created_at->format('d/m/Y H:i') }}</td>
                    <td>
                        {{-- Las ventas anteriores al rediseño no tienen sale_group_id --}}
                        @if ($v->sale_group_id)
                            <span class="ticket-code">{{ substr($v->sale_group_id, 0, 8) }}</span>
                        @else
                            <span class="muted">—</span>
                        @endif
                    </td>
                    <td>{{ $v->product->name ?? '—' }}</td>
                    <td class="center">{{ $v->quantity }}</td>
                    <td class="right">${{ number_format($v->total_price, 2) }}</td>
                    <td class="right">${{ number_format($v->cash_amount, 2) }}</td>
                    <td class="right">${{ number_format($v->card_amount, 2) }}</td>
                    {{-- Sin fallback a un nombre concreto: atribuir una venta a
                         una persona equivocada es peor que mostrar un guion --}}
                    <td>{{ $v->employee->first_name ?? '—' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>