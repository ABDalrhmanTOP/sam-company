<?php

namespace App\Http\Controllers;

use App\Models\Benefit;
use App\Models\Package;
use Illuminate\Http\Request;

class InternetController extends Controller
{
    public function index($lang = 'ar')
    {
        $packages = Package::where('language', $lang)->get();
        $benefits = Benefit::where('language', $lang)->get();

        return response()->json([
            'packages' => $packages,
            'benefits' => $benefits,
        ]);
    }
}
