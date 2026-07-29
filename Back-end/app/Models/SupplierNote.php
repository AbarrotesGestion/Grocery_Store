<?php

namespace App\Models;

use App\Models\Employee;
use App\Models\Supplier;
use App\Models\SupplierNoteDetail;
use Illuminate\Database\Eloquent\Model;

class SupplierNote extends Model
{
    //
    protected $fillable = [
        'supplier_id',
        'status',
        'total_amount',
        'delivery_date',
        'anticipated_ticket_path',
        'delivery_ticket_path',
        'reminders',
        'created_by',
        'confirmed_by',


    ];
    public function createdBy()
    {
        return $this->belongsTo(Employee::class, 'created_by');
    }

    public function confirmedBy()
    {
        return $this->belongsTo(Employee::class, 'confirmed_by');
    }

        public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

        public function details()
    {
        return $this->hasMany(SupplierNoteDetail::class, 'supplier_note_id');
    }
}
