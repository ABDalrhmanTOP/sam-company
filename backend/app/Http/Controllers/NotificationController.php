<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    /**
     * Display a listing of notifications.
     */
    public function index(Request $request)
    {
        try {
            $query = Notification::query();

            // Filter by user if user_id is provided
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            } else {
                // If no user_id, return all notifications (admin view)
                // or filter by authenticated user
                $user = $request->user();
                if ($user && !$user->is_admin) {
                    $query->where(function($q) use ($user) {
                        $q->where('user_id', $user->id)
                          ->orWhereNull('user_id'); // Global notifications
                    });
                }
            }

            // Filter by read status
            if ($request->has('is_read')) {
                $query->where('is_read', $request->is_read);
            }

            // Filter by type
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            // Order by created_at desc
            $notifications = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $notifications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في جلب الإشعارات: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created notification.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'message' => 'required|string',
                'type' => 'nullable|in:info,success,warning,error',
                'user_id' => 'nullable|exists:users,id',
                'link' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'خطأ في التحقق من البيانات',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $notification = Notification::create([
                'title' => $request->title,
                'message' => $request->message,
                'type' => $request->type ?? 'info',
                'user_id' => $request->user_id,
                'link' => $request->link,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء الإشعار بنجاح',
                'data' => $notification
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في إنشاء الإشعار: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified notification.
     */
    public function show(Notification $notification)
    {
        return response()->json([
            'success' => true,
            'data' => $notification
        ]);
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(Notification $notification)
    {
        try {
            $notification->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديد الإشعار كمقروء',
                'data' => $notification->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في تحديث الإشعار: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user && !$user->is_admin) {
                // Mark only user's notifications as read
                Notification::where('user_id', $user->id)
                    ->orWhereNull('user_id')
                    ->update(['is_read' => true]);
            } else {
                // Admin can mark all notifications as read
                Notification::query()->update(['is_read' => true]);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تحديد جميع الإشعارات كمقروءة'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في تحديث الإشعارات: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified notification.
     */
    public function update(Request $request, Notification $notification)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'message' => 'sometimes|string',
                'type' => 'sometimes|in:info,success,warning,error',
                'is_read' => 'sometimes|boolean',
                'link' => 'sometimes|nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'خطأ في التحقق من البيانات',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $notification->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الإشعار بنجاح',
                'data' => $notification->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في تحديث الإشعار: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified notification.
     */
    public function destroy(Notification $notification)
    {
        try {
            $notification->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الإشعار بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في حذف الإشعار: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete all notifications.
     */
    public function deleteAll(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user && !$user->is_admin) {
                // Delete only user's notifications
                Notification::where('user_id', $user->id)
                    ->orWhereNull('user_id')
                    ->delete();
            } else {
                // Admin can delete all notifications
                Notification::query()->delete();
            }

            return response()->json([
                'success' => true,
                'message' => 'تم حذف جميع الإشعارات'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في حذف الإشعارات: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}







