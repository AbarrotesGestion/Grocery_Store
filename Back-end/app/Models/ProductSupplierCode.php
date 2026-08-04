<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSupplierCode extends Model
{
    protected $fillable = ['product_id', 'supplier_id', 'code'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
    
}

