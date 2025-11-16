<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Helpers\NotificationHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $packages = Package::orderBy('order')->get();
        return response()->json($packages);
    }

    /**
     * Get active packages for public display
     */
    public function getActivePackages()
    {
        $packages = Package::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json($packages);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description_ar' => 'required|string',
            'description_en' => 'required|string',
            'price' => 'required|string',
            'speed' => 'required|string|max:255',
            'speed_unit' => 'nullable|string|max:50',
            'type' => 'required|in:home,business',
            'features' => 'nullable|array',
            'features_ar' => 'nullable|array',
            'features_en' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer',
            'popular' => 'sometimes|boolean',
        ]);

        $package = Package::create($validated);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'package',
                $package->name_ar ?? $package->name_en,
                'created'
            );
        }
        
        return response()->json($package, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Package $package)
    {
        return response()->json($package);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Package $package)
    {
        $validated = $request->validate([
            'name_ar' => 'sometimes|required|string|max:255',
            'name_en' => 'sometimes|required|string|max:255',
            'description_ar' => 'sometimes|required|string',
            'description_en' => 'sometimes|required|string',
            'price' => 'sometimes|required|string',
            'speed' => 'sometimes|required|string|max:255',
            'speed_unit' => 'nullable|string|max:50',
            'type' => 'sometimes|required|in:home,business',
            'features' => 'nullable|array',
            'features_ar' => 'nullable|array',
            'features_en' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer',
            'popular' => 'sometimes|boolean',
        ]);

        $package->update($validated);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'package',
                $package->name_ar ?? $package->name_en,
                'updated'
            );
        }
        
        return response()->json($package);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Package $package)
    {
        $packageName = $package->name_ar ?? $package->name_en;
        $package->delete();
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'package',
                $packageName,
                'deleted'
            );
        }
        
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
