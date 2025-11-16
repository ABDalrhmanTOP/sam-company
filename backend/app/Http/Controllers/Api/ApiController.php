<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'Welcome to API',
            'status' => 'success'
        ]);
    }
}
