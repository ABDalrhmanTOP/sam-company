<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Benefit;
use App\Models\Package;
use App\Models\SupportInfo;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get all admins
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $admins = User::where('role', 'admin')->get();
        return response()->json([
            'status' => 'success',
            'data' => $admins
        ]);
    }

    /**
     * Get a specific admin
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $admin = User::where('role', 'admin')->findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $admin
        ]);
    }

    /**
     * Get dashboard statistics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics()
    {
        try {
            // Get total users count
            $totalUsers = User::count();

            // Get total messages count
            $totalMessages = Message::count();

            // Get active benefits count
            $activeBenefits = Benefit::where('is_active', true)->count();

            // Get active support info count
            $activeSupportInfo = SupportInfo::where('is_active', true)->count();

            // Get total packages count
            $totalPackages = Package::count();

            // Get active packages count
            $activePackages = Package::where('is_active', true)->count();

            // Get unread messages count
            $unreadMessages = Message::where('is_read', false)->count();

            // Calculate percentage changes (comparing with last month)
            $lastMonth = now()->subMonth();
            
            // Users change
            $usersLastMonth = User::where('created_at', '<=', $lastMonth)->count();
            $usersChange = $usersLastMonth > 0 
                ? round((($totalUsers - $usersLastMonth) / $usersLastMonth) * 100, 1)
                : 0;

            // Messages change
            $messagesLastMonth = Message::where('created_at', '<=', $lastMonth)->count();
            $messagesChange = $messagesLastMonth > 0 
                ? round((($totalMessages - $messagesLastMonth) / $messagesLastMonth) * 100, 1)
                : 0;

            // Benefits change
            $benefitsLastMonth = Benefit::where('created_at', '<=', $lastMonth)->where('is_active', true)->count();
            $benefitsChange = $benefitsLastMonth > 0 
                ? round((($activeBenefits - $benefitsLastMonth) / $benefitsLastMonth) * 100, 1)
                : 0;

            // Support info change
            $supportLastMonth = SupportInfo::where('created_at', '<=', $lastMonth)->where('is_active', true)->count();
            $supportChange = $supportLastMonth > 0 
                ? round((($activeSupportInfo - $supportLastMonth) / $supportLastMonth) * 100, 1)
                : 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'users' => [
                        'total' => $totalUsers,
                        'change' => $usersChange >= 0 ? '+' . $usersChange . '%' : $usersChange . '%',
                    ],
                    'messages' => [
                        'total' => $totalMessages,
                        'unread' => $unreadMessages,
                        'change' => $messagesChange >= 0 ? '+' . $messagesChange . '%' : $messagesChange . '%',
                    ],
                    'benefits' => [
                        'active' => $activeBenefits,
                        'total' => Benefit::count(),
                        'change' => $benefitsChange >= 0 ? '+' . $benefitsChange . '%' : $benefitsChange . '%',
                    ],
                    'support_info' => [
                        'active' => $activeSupportInfo,
                        'total' => SupportInfo::count(),
                        'change' => $supportChange >= 0 ? '+' . $supportChange . '%' : $supportChange . '%',
                    ],
                    'packages' => [
                        'active' => $activePackages,
                        'total' => $totalPackages,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في جلب الإحصائيات',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}