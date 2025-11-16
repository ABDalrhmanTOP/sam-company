<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Helpers\NotificationHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'is_admin' => 'boolean',
            'permissions' => 'nullable|array',
        ]);
        $validated['password'] = Hash::make($validated['password']);
        $validated['is_admin'] = $validated['is_admin'] ?? false;
        $validated['permissions'] = $request->permissions ?? [];
        $user = User::create($validated);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'user',
                $user->name,
                'created'
            );
        }
        
        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'is_admin' => 'boolean',
            'permissions' => 'nullable|array',
        ]);
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }
        if ($request->has('permissions')) {
            $validated['permissions'] = $request->permissions;
        }
        $user->update($validated);
        
        // إرسال إشعار لجميع المدراء الآخرين (فقط إذا كان المستخدم المعدل مختلف عن المعدل)
        if ($request->user() && $request->user()->is_admin && $request->user()->id !== $user->id) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'user',
                $user->name,
                'updated'
            );
        }
        
        return response()->json($user);
    }

    public function destroy(Request $request, User $user)
    {
        $userName = $user->name;
        $user->delete();
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'user',
                $userName,
                'deleted'
            );
        }
        
        return response()->json(['message' => 'User deleted successfully']);
    }
}
