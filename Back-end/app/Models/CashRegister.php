<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Sale;
use App\Models\Employee;

class CashRegister extends Model
{
    //
    protected $fillable = [
        'employee_id',
        'opening_cash',
        'opened_at',
        'expected_cash',
        'actual_cash',
        'closed_at',
    ];

public function sales()
{
    return $this->hasMany(Sale::class);
}

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
