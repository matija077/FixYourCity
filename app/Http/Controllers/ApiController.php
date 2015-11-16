<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\City;

class ApiController extends Controller
{
    public static function getCities()
    {
        $cities = City::all();
        
        return \Response::json($cities);
    }
    
    public static function getCity($idcity)
    {
        $city = City::where('idcity', '=', $idcity)->get();
        
        return \Response::json($city);
    }
}


?>