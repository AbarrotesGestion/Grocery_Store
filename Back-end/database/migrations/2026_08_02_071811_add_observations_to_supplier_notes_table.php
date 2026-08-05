<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('supplier_notes', function (Blueprint $table) {
   
            $table->text('observations')->nullable()->after('reminders');
            $table->timestamp('confirmed_at')->nullable()->after('observations');
        });
    }

    public function down(): void
    {
        Schema::table('supplier_notes', function (Blueprint $table) {
            $table->dropColumn(['observations', 'confirmed_at']);
        });
    }
};