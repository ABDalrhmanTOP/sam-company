<?php

namespace Database\Seeders;

use App\Models\SpeedTestSetting;
use Illuminate\Database\Seeder;

class SpeedTestSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'api_name' => 'Speedtest by Ookla',
                'api_url' => 'https://www.speedtest.net/api/ios/v2/flash/findServer',
                'api_key' => null,
                'is_default' => true,
                'is_active' => true,
                'order' => 1,
                'description' => 'Ookla Speedtest API - One of the most accurate speed test services',
            ],
            [
                'api_name' => 'Fast.com by Netflix',
                'api_url' => 'https://api.fast.com/netflix/speedtest',
                'api_key' => null,
                'is_default' => false,
                'is_active' => true,
                'order' => 2,
                'description' => 'Netflix Fast.com API - Simple and straightforward speed test',
            ],
            [
                'api_name' => 'Cloudflare Speed Test',
                'api_url' => 'https://speed.cloudflare.com/__down',
                'api_key' => null,
                'is_default' => false,
                'is_active' => true,
                'order' => 3,
                'description' => 'Cloudflare Speed Test API - Fast and reliable CDN-based speed test',
            ],
        ];

        foreach ($settings as $setting) {
            SpeedTestSetting::create($setting);
        }
    }
}
