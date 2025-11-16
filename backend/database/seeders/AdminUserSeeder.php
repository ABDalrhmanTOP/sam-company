<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin user already exists
        $adminExists = User::where('email', 'admin@admin.com')->exists();

        if (!$adminExists) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@admin.com',
                'password' => Hash::make('admin123'),
                'is_admin' => true,
            ]);

            $this->command->info('Admin user created successfully!');
            $this->command->info('Email: admin@admin.com');
            $this->command->info('Password: admin123');
        } else {
            $this->command->info('Admin user already exists!');
        }
    }
}
