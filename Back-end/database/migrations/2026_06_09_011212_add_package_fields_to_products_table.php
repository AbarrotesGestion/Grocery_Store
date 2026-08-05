<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            //
            $table->integer('package_size')->nullable();
            $table->decimal('price_per_unit', 10, 2)->nullable();
            $table->decimal('price_per_package', 10, 2)->nullable();
            $table->integer('stock_in_units')->nullable();
            $table->boolean('allows_unit_sale')->nullable();
            $table->boolean('allows_package_sale')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            //
        $table->dropColumn([
         'package_size',
         'price_per_unit',
         'price_per_package',
         'stock_in_units',
         'allows_unit_sale',
         'allows_package_sale',
]);
        });
    }
};
