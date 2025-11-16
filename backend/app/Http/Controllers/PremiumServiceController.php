<?php

namespace App\Http\Controllers;

use App\Models\PremiumService;
use App\Helpers\NotificationHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PremiumServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = PremiumService::query();

            // Filter by category
            if ($request->has('category') && $request->category !== 'all') {
                $query->byCategory($request->category);
            }

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('is_active', $request->status === 'active');
            }

            // Search
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('name_en', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('description_en', 'like', "%{$search}%");
                });
            }

            // Order by
            $query->ordered();

            $services = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $services
            ]);

        } catch (\Exception $e) {
            Log::error('PremiumService index error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الخدمات المتميزة'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'name_en' => 'required|string|max:255',
                'description' => 'required|string',
                'description_en' => 'required|string',
                'price' => 'required|numeric|min:0',
                'category' => 'required|string|max:255',
                'icon' => 'required|string|max:255',
                'color' => 'required|string|max:255',
                'features' => 'nullable|array',
                'features_ar' => 'nullable|array',
                'features_en' => 'nullable|array',
                'is_active' => 'boolean',
                'order' => 'integer|min:0'
            ], [
                'name.required' => 'اسم الخدمة بالعربي مطلوب',
                'name_en.required' => 'اسم الخدمة بالإنجليزي مطلوب',
                'description.required' => 'وصف الخدمة بالعربي مطلوب',
                'description_en.required' => 'وصف الخدمة بالإنجليزي مطلوب',
                'price.required' => 'السعر مطلوب',
                'price.numeric' => 'السعر يجب أن يكون رقماً',
                'price.min' => 'السعر يجب أن يكون أكبر من أو يساوي صفر',
                'category.required' => 'فئة الخدمة مطلوبة',
                'icon.required' => 'أيقونة الخدمة مطلوبة',
                'color.required' => 'لون الخدمة مطلوب'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'البيانات المدخلة غير صحيحة',
                    'errors' => $validator->errors()
                ], 422);
            }

            $service = PremiumService::create($request->all());
            
            // إرسال إشعار لجميع المدراء الآخرين
            if ($request->user() && $request->user()->is_admin) {
                NotificationHelper::notifyAdminsOfModification(
                    $request->user(),
                    'premium-service',
                    $service->name ?? $service->name_en,
                    'created'
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء الخدمة المتميزة بنجاح',
                'data' => $service
            ], 201);

        } catch (\Exception $e) {
            Log::error('PremiumService store error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إنشاء الخدمة المتميزة'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $service = PremiumService::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $service
            ]);

        } catch (\Exception $e) {
            Log::error('PremiumService show error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'الخدمة المتميزة غير موجودة'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $service = PremiumService::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'name_en' => 'required|string|max:255',
                'description' => 'required|string',
                'description_en' => 'required|string',
                'price' => 'required|numeric|min:0',
                'category' => 'required|string|max:255',
                'icon' => 'required|string|max:255',
                'color' => 'required|string|max:255',
                'features' => 'nullable|array',
                'features_ar' => 'nullable|array',
                'features_en' => 'nullable|array',
                'is_active' => 'boolean',
                'order' => 'integer|min:0'
            ], [
                'name.required' => 'اسم الخدمة بالعربي مطلوب',
                'name_en.required' => 'اسم الخدمة بالإنجليزي مطلوب',
                'description.required' => 'وصف الخدمة بالعربي مطلوب',
                'description_en.required' => 'وصف الخدمة بالإنجليزي مطلوب',
                'price.required' => 'السعر مطلوب',
                'price.numeric' => 'السعر يجب أن يكون رقماً',
                'price.min' => 'السعر يجب أن يكون أكبر من أو يساوي صفر',
                'category.required' => 'فئة الخدمة مطلوبة',
                'icon.required' => 'أيقونة الخدمة مطلوبة',
                'color.required' => 'لون الخدمة مطلوب'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'البيانات المدخلة غير صحيحة',
                    'errors' => $validator->errors()
                ], 422);
            }

            $service->update($request->all());
            
            // إرسال إشعار لجميع المدراء الآخرين
            if ($request->user() && $request->user()->is_admin) {
                NotificationHelper::notifyAdminsOfModification(
                    $request->user(),
                    'premium-service',
                    $service->name ?? $service->name_en,
                    'updated'
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الخدمة المتميزة بنجاح',
                'data' => $service
            ]);

        } catch (\Exception $e) {
            Log::error('PremiumService update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحديث الخدمة المتميزة'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        try {
            $service = PremiumService::findOrFail($id);
            $serviceName = $service->name ?? $service->name_en;
            $service->delete();
            
            // إرسال إشعار لجميع المدراء الآخرين
            if ($request->user() && $request->user()->is_admin) {
                NotificationHelper::notifyAdminsOfModification(
                    $request->user(),
                    'premium-service',
                    $serviceName,
                    'deleted'
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الخدمة المتميزة بنجاح'
            ]);

        } catch (\Exception $e) {
            Log::error('PremiumService destroy error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في حذف الخدمة المتميزة'
            ], 500);
        }
    }

    /**
     * Get active services for public display
     */
    public function getActiveServices()
    {
        try {
            $services = PremiumService::active()
                ->ordered()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $services
            ]);

        } catch (\Exception $e) {
            Log::error('PremiumService getActiveServices error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الخدمات النشطة'
            ], 500);
        }
    }

    /**
     * Toggle service status
     */
    public function toggleStatus($id)
    {
        try {
            $service = PremiumService::findOrFail($id);
            $service->update(['is_active' => !$service->is_active]);

            return response()->json([
                'success' => true,
                'message' => $service->is_active ? 'تم تفعيل الخدمة' : 'تم إلغاء تفعيل الخدمة',
                'data' => $service
            ]);

        } catch (\Exception $e) {
            Log::error('PremiumService toggleStatus error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تغيير حالة الخدمة'
            ], 500);
        }
    }
}







