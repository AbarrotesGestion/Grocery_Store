<h2>Nueva nota de trato pendiente de confirmar</h2>

<p><strong>Proveedor:</strong> {{ $note->supplier->company_name ?? '—' }}</p>
<p><strong>Creada por:</strong> {{ $creadoPor->first_name }} {{ $creadoPor->last_name }}</p>
<p><strong>Fecha de entrega estimada:</strong> {{ \Carbon\Carbon::parse($note->delivery_date)->format('d/m/Y') }}</p>
<p><strong>Monto pactado:</strong> ${{ number_format($note->total_amount, 2) }}</p>

<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
    <tr style="background:#f3f4f6;">
        <th align="left">Producto</th>
        <th>Cantidad pactada</th>
        <th>Precio pactado</th>
    </tr>
    @foreach ($note->details as $d)
        <tr>
            <td>{{ $d->product->name ?? '—' }}</td>
            <td align="center">{{ $d->quantity_agreed }}</td>
            <td align="center">${{ number_format($d->price_agreed, 2) }}</td>
        </tr>
    @endforeach
</table>

@if ($note->reminders)
    <h3>Recordatorio del dueño</h3>
    <p style="background:#fef3c7; padding:10px; border-left:4px solid #d97706;">{{ $note->reminders }}</p>
@endif

<p style="margin-top:16px;">Cuando llegue la mercancía, entra a la app para escanear el ticket de entrega y confirmar la recepción.</p>
