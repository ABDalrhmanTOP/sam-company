<?php

namespace App\Http\Controllers;

use App\Models\Benefit;
use App\Helpers\NotificationHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BenefitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $benefits = Benefit::orderBy('order')->get();
        return response()->json($benefits);
    }

    /**
     * Get active benefits for public display
     */
    public function getActiveBenefits()
    {
        $benefits = Benefit::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json($benefits);
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
            'icon' => 'required|string|max:255',
            'language' => 'nullable|in:ar,en',
            'target_pages' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer',
        ]);

        $benefit = Benefit::create($validated);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'benefit',
                $benefit->title_ar ?? $benefit->title_en,
                'created'
            );
        }
        
        return response()->json($benefit, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Benefit $benefit)
    {
        return response()->json($benefit);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Benefit $benefit)
    {
        $validated = $request->validate([
            'title_ar' => 'sometimes|required|string|max:255',
            'title_en' => 'sometimes|required|string|max:255',
            'description_ar' => 'sometimes|required|string',
            'description_en' => 'sometimes|required|string',
            'icon' => 'sometimes|required|string|max:255',
            'language' => 'nullable|in:ar,en',
            'target_pages' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer',
        ]);

        $benefit->update($validated);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'benefit',
                $benefit->title_ar ?? $benefit->title_en,
                'updated'
            );
        }
        
        return response()->json($benefit);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Benefit $benefit)
    {
        $benefitName = $benefit->title_ar ?? $benefit->title_en;
        $benefit->delete();
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'benefit',
                $benefitName,
                'deleted'
            );
        }
        
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
