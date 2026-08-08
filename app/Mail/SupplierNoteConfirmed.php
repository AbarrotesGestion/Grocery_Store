<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SupplierNoteConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public $note;
    public $diferencias;
    public $observaciones;
    public $employee;

    public function __construct($note, array $diferencias, ?string $observaciones, $employee)
    {
        $this->note = $note;
        $this->diferencias = $diferencias;
        $this->observaciones = $observaciones;
        $this->employee = $employee;
    }

    public function build()
    {
        return $this->subject('Entrada de mercancía confirmada — ' . ($this->note->supplier->company_name ?? 'Proveedor'))
                    ->view('emails.supplier_note_confirmed');
    }
}