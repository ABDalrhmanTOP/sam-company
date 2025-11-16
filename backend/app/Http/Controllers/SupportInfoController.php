<?php

namespace App\Http\Controllers;

use App\Models\SupportInfo;
use App\Helpers\NotificationHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SupportInfoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $supportInfos = SupportInfo::orderBy('order')->get();
        return response()->json($supportInfos);
    }

    /**
     * Get active support info for public display
     */
    public function getActiveSupportInfo()
    {
        $supportInfos = SupportInfo::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json($supportInfos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_ar' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'description_ar' => 'required|string',
            'description_en' => 'required|string',
            'icon' => 'nullable|string|max:255',
            'type' => 'required|in:channel,method,info',
            'value' => 'nullable|string|max:255',
            'link' => 'nullable|url|max:255',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer',
        ]);

        $supportInfo = SupportInfo::create($validated);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'support-info',
                $supportInfo->title_ar ?? $supportInfo->title_en,
                'created'
            );
        }
        
        return response()->json($supportInfo, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(SupportInfo $supportInfo)
    {
        return response()->json($supportInfo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SupportInfo $supportInfo)
    {
        $validated = $request->validate([
            'title_ar' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'description_ar' => 'required|string',
            'description_en' => 'required|string',
            'icon' => 'nullable|string|max:255',
            'type' => 'required|in:channel,method,info',
            'value' => 'nullable|string|max:255',
            'link' => 'nullable|url|max:255',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer',
        ]);

        $supportInfo->update($validated);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'support-info',
                $supportInfo->title_ar ?? $supportInfo->title_en,
                'updated'
            );
        }
        
        return response()->json($supportInfo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, SupportInfo $supportInfo)
    {
        $supportInfoName = $supportInfo->title_ar ?? $supportInfo->title_en;
        $supportInfo->delete();
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'support-info',
                $supportInfoName,
                'deleted'
            );
        }
        
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
