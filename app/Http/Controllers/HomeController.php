<?php

namespace App\Http\Controllers;


use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    public static function index()
	{
		return view('index');
	}
}
