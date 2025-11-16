<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\InternetController;
use App\Http\Controllers\BenefitController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\SupportInfoController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\SpeedTestSettingController;
use App\Http\Controllers\ContactInfoController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SpeedTestController;
use App\Http\Controllers\PremiumServiceController;
use App\Http\Controllers\HeroSettingController;
use App\Http\Controllers\AboutPageController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Root & test
Route::get('/', [ApiController::class, 'index']);
Route::get('/test', fn() => response()->json(['ok' => true]));

// Internet route (optional lang)
Route::get('/internet/{lang?}', [InternetController::class, 'index']);

// Speed Test public routes
Route::get('/speed-test/settings', [SpeedTestController::class, 'getSettings']);
Route::get('/speed-test/default', [SpeedTestController::class, 'getDefaultSetting']);
Route::post('/speed-test/perform', [SpeedTestController::class, 'performTest']);

// Premium services public routes
Route::get('/premium-services', [PremiumServiceController::class, 'getActiveServices']);

// Hero settings public routes
Route::get('/hero-settings', [HeroSettingController::class, 'getActiveSettings']);

// Announcements public routes
Route::get('/announcements/active', [AnnouncementController::class, 'active']);

// Public routes for packages and benefits
Route::get('/packages', [PackageController::class, 'getActivePackages']);
Route::get('/benefits', [BenefitController::class, 'getActiveBenefits']);
Route::get('/support-info', [SupportInfoController::class, 'getActiveSupportInfo']);
Route::get('/faqs', [FaqController::class, 'getActiveFaqs']);
Route::get('/contact-info', [ContactInfoController::class, 'getActiveContactInfo']);
Route::get('/about-page', [AboutPageController::class, 'show']);

// Public route for sending messages (contact form)
Route::post('/messages', [MessageController::class, 'store']);

// Authentication
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Auth)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // User info
    Route::get('/user', fn(Request $request) => $request->user());
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // API resource routes
    Route::apiResource('items', ApiController::class);

    /*
    |--------------------------------------------------------------------------
    | Admin Routes (Protected + Admin Middleware)
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')->middleware('is_admin')->group(function () {

        // Admin dashboard
        Route::get('/', [AdminController::class, 'index']);
        Route::get('/statistics', [AdminController::class, 'statistics']);
        Route::get('/users/{id}', [AdminController::class, 'show']);

        // Admin resource routes (All require authentication + admin)
        Route::apiResource('users', UserController::class);
        Route::apiResource('packages', PackageController::class);
        Route::apiResource('benefits', BenefitController::class);
        Route::apiResource('support-info', SupportInfoController::class);
        Route::apiResource('faqs', FaqController::class);
        Route::apiResource('speed-test-settings', SpeedTestSettingController::class);
        Route::apiResource('contact-info', ContactInfoController::class);
        Route::apiResource('messages', MessageController::class);
        Route::apiResource('premium-services', PremiumServiceController::class);
        Route::apiResource('announcements', AnnouncementController::class);

        // Premium services additional actions
        Route::post('/premium-services/{id}/toggle-status', [PremiumServiceController::class, 'toggleStatus']);

        // Hero settings admin routes
        Route::apiResource('hero-settings', HeroSettingController::class);
        Route::post('/hero-settings/{id}/toggle-status', [HeroSettingController::class, 'toggleStatus']);
        Route::post('/hero-settings/{id}/set-primary', [HeroSettingController::class, 'setAsPrimary']);

        // About page admin routes
        Route::get('/about-page', [AboutPageController::class, 'index']);
        Route::post('/about-page', [AboutPageController::class, 'store']);

        // Notifications admin routes
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::post('/notifications', [NotificationController::class, 'store']);
        Route::get('/notifications/{notification}', [NotificationController::class, 'show']);
        Route::put('/notifications/{notification}', [NotificationController::class, 'update']);
        Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);
        Route::delete('/notifications', [NotificationController::class, 'deleteAll']);
        Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    });
});

/*
|--------------------------------------------------------------------------
| API Version 1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    Route::get('/status', fn() => response()->json(['status' => 'active']));
});
