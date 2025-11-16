<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Helpers\NotificationHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::orderBy('created_at', 'desc')->get();
        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        $message = Message::create($validated);
        
        // إرسال إشعار لجميع المدراء عند استلام رسالة جديدة
        NotificationHelper::notifyAdminsOfNewMessage($message);
        
        return response()->json($message, Response::HTTP_CREATED);
    }

    public function show(Message $message)
    {
        return response()->json($message);
    }

    public function update(Request $request, Message $message)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:new,read,replied,archived',
            'is_read' => 'sometimes|boolean',
            'read_at' => 'sometimes|nullable|date',
            'admin_notes' => 'sometimes|nullable|string',
        ]);

        // Auto-set read_at when marking as read
        if (isset($validated['is_read']) && $validated['is_read'] && !$message->read_at) {
            $validated['read_at'] = now();
        }

        $message->update($validated);
        return response()->json($message);
    }

    public function destroy(Message $message)
    {
        $message->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
