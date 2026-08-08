<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Employee;

class ProviderFund extends Model
{
    //
    protected $fillable = [
        'defined_amount',
        'extraction_limit',
        'available_balance',
        'created_by',
    ];

    public function createdBy()
    {
        return $this->belongsTo(Employee::class, 'created_by');
    }
}
