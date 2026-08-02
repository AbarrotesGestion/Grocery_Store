<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use SoftDeletes; // ← AGREGAR
    protected $fillable = [
        'category_id',
        'supplier_id',
        'name',
        'description',
        'barcode',
        'stock', // Cambiado de current_stock para consistencia
        'min_stock',
        'purchase_price',
        'price', // retail_price (para consistencia con controllers)
        'package_size',
        'stock_in_units',
        'price_per_unit',
        'price_per_package',
        'allows_unit_sale',
        'allows_package_sale',
        'allows_weight_sale',
        'price_per_kg',

    ];

    protected $casts = [
        'stock' => 'integer',
        'min_stock' => 'integer',
        'purchase_price' => 'decimal:2',
        'price' => 'decimal:2',
        'price_per_unit' => 'decimal:2',
        'price_per_package' => 'decimal:2',
        'price_per_kg' => 'decimal:2',
        'allows_unit_sale' => 'boolean',
        'allows_package_sale' => 'boolean',
        'allows_weight_sale' => 'boolean',
    ];

    // Relaciones
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }


    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function inventoryAdjustments()
    {
        return $this->hasMany(InventoryAdjustment::class);
    }

    // Métodos auxiliares
    public function isLowStock()
    {
        return $this->stock <= $this->min_stock;
    }

    public function hasStock($quantity = 1)
    {
        return $this->stock >= $quantity;
    }
}
