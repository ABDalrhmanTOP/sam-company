<?php

namespace App\Http\Controllers;

use App\Models\HeroSetting;
use App\Helpers\NotificationHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HeroSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = HeroSetting::query();

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('title_ar', 'like', "%{$search}%")
                  ->orWhere('title_en', 'like', "%{$search}%")
                  ->orWhere('subtitle_ar', 'like', "%{$search}%")
                  ->orWhere('subtitle_en', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('is_active', $request->input('status') === 'active');
        }

        $settings = $query->orderBy('order')->paginate(10);

        return response()->json(['success' => true, 'data' => $settings]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'badge_ar' => 'nullable|string|max:255',
            'badge_en' => 'nullable|string|max:255',
            'title_ar' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'subtitle_ar' => 'required|string|max:255',
            'subtitle_en' => 'nullable|string|max:255',
            'description_ar' => 'required|string',
            'description_en' => 'nullable|string',
            'subscribe_cta_ar' => 'nullable|string|max:255',
            'subscribe_cta_en' => 'nullable|string|max:255',
            'speed_test_cta_ar' => 'nullable|string|max:255',
            'speed_test_cta_en' => 'nullable|string|max:255',
            'trust_badge_ar' => 'nullable|string|max:255',
            'trust_badge_en' => 'nullable|string|max:255',
            'customers_label_ar' => 'nullable|string|max:255',
            'customers_label_en' => 'nullable|string|max:255',
            'customers_count' => 'nullable|string|max:255',
            'speed_label_ar' => 'nullable|string|max:255',
            'speed_label_en' => 'nullable|string|max:255',
            'speed_value' => 'nullable|string|max:255',
            'uptime_label_ar' => 'nullable|string|max:255',
            'uptime_label_en' => 'nullable|string|max:255',
            'uptime_value' => 'nullable|string|max:255',
            'support_label_ar' => 'nullable|string|max:255',
            'support_label_en' => 'nullable|string|max:255',
            'support_value' => 'nullable|string|max:255',
            'background_type' => 'nullable|string|in:gradient,image,video',
            'background_image' => 'nullable|string|max:255',
            'background_video' => 'nullable|string|max:255',
            'gradient_colors' => 'nullable|array',
            'show_stats' => 'boolean',
            'show_trust_badge' => 'boolean',
            'show_cta_buttons' => 'boolean',
            'layout_style' => 'nullable|string|in:split,centered,left,right',
            'enable_animations' => 'boolean',
            'animation_settings' => 'nullable|array',
            'is_active' => 'boolean',
            'order' => 'nullable|integer|min:1',
        ], [
            'title_ar.required' => 'العنوان بالعربي مطلوب.',
            'subtitle_ar.required' => 'العنوان الفرعي بالعربي مطلوب.',
            'description_ar.required' => 'الوصف بالعربي مطلوب.',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'خطأ في التحقق', 'errors' => $validator->errors()], 422);
        }

        $setting = HeroSetting::create($request->all());
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'hero-setting',
                $setting->title_ar ?? $setting->title_en,
                'created'
            );
        }
        
        return response()->json(['success' => true, 'message' => 'تم إضافة إعدادات الهيرو بنجاح.', 'data' => $setting], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(HeroSetting $heroSetting)
    {
        return response()->json(['success' => true, 'data' => $heroSetting]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, HeroSetting $heroSetting)
    {
        $validator = Validator::make($request->all(), [
            'badge_ar' => 'nullable|string|max:255',
            'badge_en' => 'nullable|string|max:255',
            'title_ar' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'subtitle_ar' => 'required|string|max:255',
            'subtitle_en' => 'nullable|string|max:255',
            'description_ar' => 'required|string',
            'description_en' => 'nullable|string',
            'subscribe_cta_ar' => 'nullable|string|max:255',
            'subscribe_cta_en' => 'nullable|string|max:255',
            'speed_test_cta_ar' => 'nullable|string|max:255',
            'speed_test_cta_en' => 'nullable|string|max:255',
            'trust_badge_ar' => 'nullable|string|max:255',
            'trust_badge_en' => 'nullable|string|max:255',
            'customers_label_ar' => 'nullable|string|max:255',
            'customers_label_en' => 'nullable|string|max:255',
            'customers_count' => 'nullable|string|max:255',
            'speed_label_ar' => 'nullable|string|max:255',
            'speed_label_en' => 'nullable|string|max:255',
            'speed_value' => 'nullable|string|max:255',
            'uptime_label_ar' => 'nullable|string|max:255',
            'uptime_label_en' => 'nullable|string|max:255',
            'uptime_value' => 'nullable|string|max:255',
            'support_label_ar' => 'nullable|string|max:255',
            'support_label_en' => 'nullable|string|max:255',
            'support_value' => 'nullable|string|max:255',
            'background_type' => 'nullable|string|in:gradient,image,video',
            'background_image' => 'nullable|string|max:255',
            'background_video' => 'nullable|string|max:255',
            'gradient_colors' => 'nullable|array',
            'show_stats' => 'boolean',
            'show_trust_badge' => 'boolean',
            'show_cta_buttons' => 'boolean',
            'layout_style' => 'nullable|string|in:split,centered,left,right',
            'enable_animations' => 'boolean',
            'animation_settings' => 'nullable|array',
            'is_active' => 'boolean',
            'order' => 'nullable|integer|min:1',
        ], [
            'title_ar.required' => 'العنوان بالعربي مطلوب.',
            'subtitle_ar.required' => 'العنوان الفرعي بالعربي مطلوب.',
            'description_ar.required' => 'الوصف بالعربي مطلوب.',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'خطأ في التحقق', 'errors' => $validator->errors()], 422);
        }

        $heroSetting->update($request->all());
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'hero-setting',
                $heroSetting->title_ar ?? $heroSetting->title_en,
                'updated'
            );
        }
        
        return response()->json(['success' => true, 'message' => 'تم تحديث إعدادات الهيرو بنجاح.', 'data' => $heroSetting]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, HeroSetting $heroSetting)
    {
        $heroSettingName = $heroSetting->title_ar ?? $heroSetting->title_en;
        $heroSetting->delete();
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'hero-setting',
                $heroSettingName,
                'deleted'
            );
        }
        
        return response()->json(['success' => true, 'message' => 'تم حذف إعدادات الهيرو بنجاح.']);
    }

    /**
     * Toggle the active status of a hero setting.
     */
    public function toggleStatus(HeroSetting $heroSetting)
    {
        // If trying to activate, deactivate all others first
        if (!$heroSetting->is_active) {
            HeroSetting::where('is_active', true)->update(['is_active' => false]);
        }

        $heroSetting->is_active = !$heroSetting->is_active;
        $heroSetting->save();

        $message = $heroSetting->is_active ? 'تم تفعيل إعدادات الهيرو بنجاح.' : 'تم إلغاء تفعيل إعدادات الهيرو بنجاح.';
        return response()->json(['success' => true, 'message' => $message, 'data' => $heroSetting]);
    }

    /**
     * Get active hero settings for public display.
     */
    public function getActiveSettings()
    {
        $setting = HeroSetting::getPrimary();

        if (!$setting) {
            return response()->json(['success' => false, 'message' => 'لا توجد إعدادات هيرو نشطة'], 404);
        }

        return response()->json(['success' => true, 'data' => $setting]);
    }

    /**
     * Set as primary hero setting (deactivate others and activate this one).
     */
    public function setAsPrimary(HeroSetting $heroSetting)
    {
        // Deactivate all others
        HeroSetting::where('is_active', true)->update(['is_active' => false]);

        // Activate this one
        $heroSetting->is_active = true;
        $heroSetting->save();

        return response()->json(['success' => true, 'message' => 'تم تعيين إعدادات الهيرو كأساسية بنجاح.', 'data' => $heroSetting]);
    }
}
