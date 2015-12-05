<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\City;
use App\Category;
use App\Problem;


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
	
	public static function getCategory($idcategory)
    {
        $category = Category::where('idcategory', '=', $idcategory)->firstOrFail();
        
        return \Response::json($category);
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
		
		// destroy $city?
	}
	
	public static function submitProblem(Request $request){
		//exact duplicate check needed!
		
		$problem=array(
			'iduser' => $request->iduser,
			'idcity' => $request->idcity,
			'idcategory' => $request->idcategory,
			'address' => $request->address,
			'url' => NULL,
			'text' => $request->text,
			'votepositive' => '1',
			'votenegative' => '0',
			
		//	'' => $request->
		);
		
		$problem = Problem::create($problem);
		
		
	}
	
	
	
}