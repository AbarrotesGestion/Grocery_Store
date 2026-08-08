<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'sale_group_id',
        'employee_id',
        'client_id',
        'product_id',
        'quantity',
        'sale_unit_type',
        'total_price',
        'cash_amount',
        'card_amount',
        'change_amount',
        'sale_date',
        'payment_method',
        'cash_register_id',
        'status',
    ];

    protected $casts = [
        'sale_date' => 'date',
        'quantity' => 'decimal:2',
        'total_price' => 'decimal:2',
        'cash_amount' => 'decimal:2',
        'card_amount' => 'decimal:2',
        'change_amount' => 'decimal:2',
    ];

    // Relaciones
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function debt()
    {
        return $this->hasOne(ClientDebt::class);
    }

    // Métodos de estado de venta
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function canBeCancelled(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Calcula cuántas unidades de stock reales fueron afectadas por esta línea,
     * considerando si la venta fue por pieza, paquete o peso.
     *
     * CENTRALIZA esta fórmula: cualquier método que necesite sumar/restar stock
     * relacionado con esta venta (cancel, revert, destroy) DEBE usar este método
     * en vez de leer $this->quantity directamente. $this->quantity es la cantidad
     * VENDIDA en la unidad que el cliente eligió (ej. 2 paquetes), no la cantidad
     * real de stock descontada (ej. 24 piezas si package_size = 12).
     */
    public function stockUnitsAfectadas(): float
    {
        if ($this->sale_unit_type === 'package') {
            return $this->quantity * ($this->product->package_size ?? 1);
        }

        // 'unit' y 'weight' descuentan stock 1:1 con la cantidad vendida
        return $this->quantity;
    }

    /**
     * Cancelar la venta y devolver el stock
     */
    public function cancel(): bool
    {
        if (!$this->canBeCancelled()) {
            return false;
        }

        $this->product->increment('stock', $this->stockUnitsAfectadas());

        $this->update(['status' => 'cancelled']);

        return true;
    }

    /**
     * Revertir cancelación
     */
    public function revert(): bool
    {
        if ($this->status !== 'cancelled') {
            return false;
        }

        $unidades = $this->stockUnitsAfectadas();

        if (!$this->product->hasStock($unidades)) {
            return false;
        }

        $this->product->decrement('stock', $unidades);

        $this->update(['status' => 'completed']);

        return true;
    }
}