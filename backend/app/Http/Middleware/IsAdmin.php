<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'غير مصرح بالوصول. يرجى تسجيل الدخول أولاً.'
            ], 401);
        }

        $user = $request->user();
        
        // Check if user is admin or has permissions
        if (!$user->is_admin) {
            // Check if user has any permissions
            $permissions = $user->permissions ?? [];
            if (empty($permissions) || !is_array($permissions) || count($permissions) === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'ليس لديك صلاحيات للوصول إلى هذه الصفحة.'
                ], 403);
            }
        }

        return $next($request);
    }
}
