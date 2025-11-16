<?php

namespace App\Http\Controllers;

use App\Models\SpeedTestSetting;
use App\Helpers\NotificationHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SpeedTestSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $settings = SpeedTestSetting::orderBy('order')->get();
        return response()->json($settings);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'api_name' => 'required|string|max:255',
            'api_url' => 'required|url|max:255',
            'api_key' => 'nullable|string|max:255',
            'is_default' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer',
            'description' => 'nullable|string',
        ]);

        // If this is marked as default, unset other defaults
        if ($validated['is_default'] ?? false) {
            SpeedTestSetting::where('is_default', true)->update(['is_default' => false]);
        }

        $setting = SpeedTestSetting::create($validated);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'speed-test-setting',
                $setting->api_name,
                'created'
            );
        }
        
        return response()->json($setting, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(SpeedTestSetting $speedTestSetting)
    {
        return response()->json($speedTestSetting);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SpeedTestSetting $speedTestSetting)
    {
        $validated = $request->validate([
            'api_name' => 'required|string|max:255',
            'api_url' => 'required|url|max:255',
            'api_key' => 'nullable|string|max:255',
            'is_default' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer',
            'description' => 'nullable|string',
        ]);

        // If this is marked as default, unset other defaults
        if (($validated['is_default'] ?? false) && !$speedTestSetting->is_default) {
            SpeedTestSetting::where('is_default', true)->where('id', '!=', $speedTestSetting->id)->update(['is_default' => false]);
        }

        $speedTestSetting->update($validated);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'speed-test-setting',
                $speedTestSetting->api_name,
                'updated'
            );
        }
        
        return response()->json($speedTestSetting);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, SpeedTestSetting $speedTestSetting)
    {
        $settingName = $speedTestSetting->api_name;
        $speedTestSetting->delete();
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'speed-test-setting',
                $settingName,
                'deleted'
            );
        }
        
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
