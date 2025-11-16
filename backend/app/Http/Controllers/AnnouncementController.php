<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Helpers\NotificationHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AnnouncementController extends Controller
{
    // Public endpoint: get active announcement (optionally by language)
    public function active(Request $request)
    {
        $lang = $request->query('lang', 'ar');
        $announcement = Announcement::query()
            ->where('is_active', true)
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->first();
        if (!$announcement) {
            return response()->json(null, 200);
        }
        $text = $lang === 'en' ? ($announcement->text_en ?? '') : ($announcement->text_ar ?? '');
        $cta  = $lang === 'en' ? ($announcement->cta_en ?? '')  : ($announcement->cta_ar ?? '');
        return response()->json([
            'text' => $text,
            'cta' => $cta,
            'language' => $lang,
        ]);
    }

    // Admin: list announcements
    public function index()
    {
        return Announcement::orderByDesc('id')->get();
    }

    // Admin: store announcement
    public function store(Request $request)
    {
        // bilingual single-record schema
        $data = $request->validate([
            'text_ar' => 'required|string|min:3',
            'text_en' => 'required|string|min:3',
            'cta_ar' => 'nullable|string',
            'cta_en' => 'nullable|string',
            'is_active' => 'boolean',
            'date' => 'nullable|date',
        ]);
        $announcement = Announcement::create($data);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'announcement',
                substr($announcement->text_ar ?? $announcement->text_en, 0, 30),
                'created'
            );
        }
        
        return response()->json($announcement, 201);
    }

    // Admin: show
    public function show(Announcement $announcement)
    {
        return $announcement;
    }

    // Admin: update
    public function update(Request $request, Announcement $announcement)
    {
        $data = $request->validate([
            'text_ar' => 'sometimes|required|string|min:3',
            'text_en' => 'sometimes|required|string|min:3',
            'cta_ar' => 'nullable|string',
            'cta_en' => 'nullable|string',
            'is_active' => 'boolean',
            'date' => 'nullable|date',
        ]);
        $announcement->update($data);
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'announcement',
                substr($announcement->text_ar ?? $announcement->text_en, 0, 30),
                'updated'
            );
        }
        
        return response()->json($announcement);
    }

    // Admin: delete
    public function destroy(Request $request, Announcement $announcement)
    {
        $announcementText = substr($announcement->text_ar ?? $announcement->text_en, 0, 30);
        $announcement->delete();
        
        // إرسال إشعار لجميع المدراء الآخرين
        if ($request->user() && $request->user()->is_admin) {
            NotificationHelper::notifyAdminsOfModification(
                $request->user(),
                'announcement',
                $announcementText,
                'deleted'
            );
        }
        
        return response()->json([ 'message' => 'deleted' ]);
    }
}
