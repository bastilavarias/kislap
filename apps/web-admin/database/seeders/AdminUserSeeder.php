<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = 'admin@kislap.test';

        User::updateOrCreate(
            ['email' => $email],
            [
                'first_name' => 'Kislap',
                'last_name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'newsletter' => false,
                'github' => false,
                'google' => false,
            ],
        );
    }
}
