<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SupplierNoteCreated extends Mailable
{
    use Queueable, SerializesModels;

    public $note;
    public $creadoPor;

    public function __construct($note, $creadoPor)
    {
        $this->note = $note;
        $this->creadoPor = $creadoPor;
    }

    public function build()
    {
        return $this->subject('Nueva nota de trato pendiente — ' . ($this->note->supplier->company_name ?? 'Proveedor'))
                    ->view('emails.supplier_note_created');
    }
}