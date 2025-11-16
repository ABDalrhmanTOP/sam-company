<?php

namespace App\Http\Controllers;

use App\Models\AboutPage;
use App\Helpers\NotificationHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AboutPageController extends Controller
{
    /**
     * Get about page data (for admin)
     */
    public function index()
    {
        try {
            $data = AboutPage::first();

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في جلب البيانات'
            ], 500);
        }
    }

    /**
     * Get about page data (public)
     */
    public function show()
    {
        try {
            $data = AboutPage::first();

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا توجد بيانات'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في جلب البيانات'
            ], 500);
        }
    }

    /**
     * Create or update about page data
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                // بدون أي حقل إلزامي required حالياً
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'خطأ في التحقق',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = AboutPage::first();
            $isUpdate = (bool) $data;

            if ($data) {
                // Update existing
                $data->update($request->all());
            } else {
                // Create new
                $data = AboutPage::create($request->all());
            }

            // إرسال إشعار لجميع المدراء الآخرين عند التعديل
            if ($request->user() && $request->user()->is_admin) {
                NotificationHelper::notifyAdminsOfModification(
                    $request->user(),
                    'about-page',
                    'صفحة من نحن',
                    $isUpdate ? 'updated' : 'created'
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'تم حفظ البيانات بنجاح',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في حفظ البيانات: ' . $e->getMessage()
            ], 500);
        }
    }
}
