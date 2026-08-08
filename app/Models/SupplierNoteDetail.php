<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\SupplierNote;

class SupplierNoteDetail extends Model
{
    //
    protected $fillable = [
        'supplier_note_id',
        'product_id',
        'quantity_agreed',
        'unit_price',
        'total_price',
        'quantity_received',
        'discount',
        'is_gift',
        'price_agreed',						
    ];

public function product()
{
    return $this->belongsTo(Product::class, 'product_id'); 
}

    public function supplierNote()
    {
        return $this->belongsTo(SupplierNote::class, 'supplier_note_id');
    }

}
