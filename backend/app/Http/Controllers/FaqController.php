<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Helpers\NotificationHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $faqs = Faq::orderBy('order')->get();
        return response()->json($faqs);
    }

    /**
     * Get active FAQs for public display
     */
    public function getActiveFaqs()
    {
        $faqs = Faq::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json($faqs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question_ar' => 'required|string|max:255',
            'question_en' => 'required|string|max:255',
            'answer_ar' => 'required|string',
            'answer_en' => 'required|string',
            'category' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer',
        ]);

        $faq = Faq::create($validated);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'faq',
                $faq->question_ar ?? $faq->question_en,
                'created'
            );
        }
        
        return response()->json($faq, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Faq $faq)
    {
        return response()->json($faq);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question_ar' => 'required|string|max:255',
            'question_en' => 'required|string|max:255',
            'answer_ar' => 'required|string',
            'answer_en' => 'required|string',
            'category' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer',
        ]);

        $faq->update($validated);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'faq',
                $faq->question_ar ?? $faq->question_en,
                'updated'
            );
        }
        
        return response()->json($faq);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Faq $faq)
    {
        $faqQuestion = $faq->question_ar ?? $faq->question_en;
        $faq->delete();
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'faq',
                $faqQuestion,
                'deleted'
            );
        }
        
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
