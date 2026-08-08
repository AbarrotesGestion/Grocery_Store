<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProviderFund;

class ProviderFundSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
    if (ProviderFund::count() === 0) {
        ProviderFund::create([
            'defined_amount' => 0,
            'extraction_limit' => 0,
            'available_balance' => 0,
        ]);
    
    }
}
}