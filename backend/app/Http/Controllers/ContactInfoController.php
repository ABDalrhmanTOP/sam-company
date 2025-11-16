<?php

namespace App\Http\Controllers;

use App\Models\ContactInfo;
use App\Helpers\NotificationHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ContactInfoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contactInfos = ContactInfo::orderBy('order')->get();
        return response()->json($contactInfos);
    }

    /**
     * Get active contact info for public display
     */
    public function getActiveContactInfo()
    {
        $contactInfos = ContactInfo::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json($contactInfos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'label_ar' => 'required|string|max:255',
            'label_en' => 'required|string|max:255',
            'value' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'order' => 'sometimes|integer',
            'is_active' => 'sometimes|boolean',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
        ]);

        $contactInfo = ContactInfo::create($validated);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'contact-info',
                $contactInfo->label_ar ?? $contactInfo->label_en,
                'created'
            );
        }
        
        return response()->json($contactInfo, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(ContactInfo $contactInfo)
    {
        return response()->json($contactInfo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ContactInfo $contactInfo)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'label_ar' => 'required|string|max:255',
            'label_en' => 'required|string|max:255',
            'value' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'order' => 'sometimes|integer',
            'is_active' => 'sometimes|boolean',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
        ]);

        $contactInfo->update($validated);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'contact-info',
                $contactInfo->label_ar ?? $contactInfo->label_en,
                'updated'
            );
        }
        
        return response()->json($contactInfo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, ContactInfo $contactInfo)
    {
        $contactInfoName = $contactInfo->label_ar ?? $contactInfo->label_en;
        $contactInfo->delete();
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'contact-info',
                $contactInfoName,
                'deleted'
            );
        }
        
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
