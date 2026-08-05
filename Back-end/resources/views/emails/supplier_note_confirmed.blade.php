<h2>Entrada de mercancía confirmada</h2>

<p><strong>Proveedor:</strong> {{ $note->supplier->company_name ?? '—' }}</p>
<p><strong>Confirmó:</strong> {{ $employee->first_name }} {{ $employee->last_name }}</p>
<p><strong>Fecha:</strong> {{ now()->format('d/m/Y H:i') }}</p>

<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
    <tr style="background:#f3f4f6;">
        <th align="left">Producto</th>
        <th>Pactado</th>
        <th>Recibido</th>
        <th>Diferencia</th>
    </tr>
    @foreach ($diferencias as $d)
        <tr>
            <td>{{ $d['producto'] }}</td>
            <td align="center">{{ $d['pactado'] }}</td>
            <td align="center">{{ $d['recibido'] }}</td>
            <td align="center" style="color: {{ $d['diferencia'] < 0 ? '#dc2626' : ($d['diferencia'] > 0 ? '#d97706' : '#16a34a') }};">
                @if ($d['diferencia'] === 0) completo
                @elseif ($d['diferencia'] < 0) faltaron {{ abs($d['diferencia']) }}
                @else llegaron {{ $d['diferencia'] }} de más
                @endif
            </td>
        </tr>
    @endforeach
</table>

@if ($observaciones)
    <h3>Observaciones del encargado</h3>
    <p style="background:#fef3c7; padding:10px; border-left:4px solid #d97706;">{{ $observaciones }}</p>
@endif