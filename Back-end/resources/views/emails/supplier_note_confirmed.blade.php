<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; color: #1F2A22; }
        table { border-collapse: collapse; width: 100%; margin-top: 12px; }
        th, td { border: 1px solid #E3DECF; padding: 8px; text-align: left; }
        th { background: #2E6B4E; color: #fff; }
        .diferencia-ok { color: #16A34A; font-weight: bold; }
        .diferencia-mal { color: #DC2626; font-weight: bold; }
        .observaciones { background: #fef3c7; padding: 10px; border-left: 4px solid #d97706; margin-top: 16px; }
    </style>
</head>
<body>

<h2>Entrada de mercancía confirmada</h2>

<p><strong>Proveedor:</strong> {{ $note->supplier->company_name ?? '—' }}</p>
<p><strong>Confirmó:</strong> {{ $employee->first_name }} {{ $employee->last_name }}</p>
<p><strong>Fecha:</strong> {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}</p>

<table>
    <tr>
        <th>Producto</th>
        <th>Pactado</th>
        <th>Recibido</th>
        <th>Diferencia</th>
    </tr>
    @foreach ($diferencias as $d)
        <tr>
            <td>{{ $d['producto'] }}</td>
            <td>{{ $d['pactado'] }}</td>
            <td>{{ $d['recibido'] }}</td>
            <td>
                @if ($d['diferencia'] == 0)
                    <span class="diferencia-ok">completo</span>
                @elseif ($d['diferencia'] < 0)
                    <span class="diferencia-mal">faltaron {{ abs($d['diferencia']) }}</span>
                @else
                    <span class="diferencia-mal">llegaron {{ $d['diferencia'] }} de más</span>
                @endif
            </td>
        </tr>
    @endforeach
</table>

@if ($observaciones)
    <h3>Observaciones del encargado</h3>
    <div class="observaciones">{{ $observaciones }}</div>
@endif

</body>
</html>
