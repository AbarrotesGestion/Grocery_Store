<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_supplier_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('supplier_id')->constrained()->onDelete('cascade');
            $table->string('code');
            $table->timestamps();

            // Un mismo proveedor no puede usar el mismo código para dos
            // productos distintos, pero distintos proveedores SÍ pueden
            // compartir el mismo código entre ellos sin problema.
            $table->unique(['supplier_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_supplier_codes');
    }
};