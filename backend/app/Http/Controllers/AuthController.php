<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['المستخدم غير موجود'],
            ]);
        }

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['كلمة المرور غير صحيحة'],
            ]);
        }

        // Check if user is admin or has permissions
        if (!$user->is_admin && (empty($user->permissions) || !is_array($user->permissions) || count($user->permissions) === 0)) {
            throw ValidationException::withMessages([
                'email' => ['ليس لديك صلاحيات للدخول'],
            ]);
        }

        // Create token using Sanctum
        $token = $user->createToken('admin-token', ['*'])->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'تم تسجيل الخروج بنجاح']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'current_password' => 'required_with:password|string',
            'password' => 'nullable|string|min:8|confirmed',
            'password_confirmation' => 'nullable|string|min:8',
        ]);

        // Update name if provided
        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }

        // Update email if provided
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }

        // Update password if provided
        if (isset($validated['password'])) {
            // Verify current password
            if (!Hash::check($validated['current_password'], $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['كلمة المرور الحالية غير صحيحة'],
                ]);
            }
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'تم تحديث الملف الشخصي بنجاح',
            'user' => $user,
        ]);
    }
}
