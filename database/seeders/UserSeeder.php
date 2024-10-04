<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        User::truncate();
        Schema::enableForeignKeyConstraints();

        DB::table('users')->insert([
            [
                'name' => 'lesto',
                'email' => 'lesto@gmail.com',
                'password' => \bcrypt('12345')
            ],
            [
                'name' => 'ipul',
                'email' => 'ipul@gmail.com',
                'password' => \bcrypt('12345')
            ]
        ]);
    }
}
