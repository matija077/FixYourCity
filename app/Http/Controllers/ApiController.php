<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\City;
use App\Category;

class ApiController extends Controller
{
    //add jwt token to every api route
    public function __construct()
    {
         $this->middleware('jwt.auth');
    }
    
    public static function getCities()
    {     
        $cities = City::all();  
        //$cities = City::all()->toJson();  
                        
       //return Response($cities);
       return \Response::json($cities);    
    }
    
    public static function getCity($idcity)
    {
        $city = City::where('idcity', '=', $idcity)->firstOrFail();
        
        return \Response::json($city);
    }
    
    public static function getCategories()
    {
        $categories = Category::all();
        
          return \Response::json($categories);
    }
}


?>