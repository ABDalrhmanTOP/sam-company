<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run seeders
        $this->call([
            AdminUserSeeder::class,
            PremiumServiceSeeder::class,
            BenefitSeeder::class,
            ContactInfoSeeder::class,
            FaqSeeder::class,
            PackageSeeder::class,
            SpeedTestSettingSeeder::class,
            SupportInfoSeeder::class,
            HeroSettingSeeder::class,
            AboutPageSeeder::class,
            AnnouncementSeeder::class,
        ]);
    }
}
