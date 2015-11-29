<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\City;
use App\Category;


class ApiController extends Controller
{
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
	
	public static function insertCity($cityname,$state){
		$city = new City;
		$city->cityname=$cityname;
		$city->state=$state;
		
		if(!count(City::where('cityname',$cityname)->where('state',$state)->first())){
			//ovdje ide Wiki provjera
			$city->save();
			return \Response::json($city->idcity);
		}else{
			return \Response::json('City exists');
		}
		
	}
	
	
	
}