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
    public static function getCities(){
       $cities = City::all();  
		
       return \Response::json($cities);    
    }
    
    public static function getCity($idcity) {
        $city = City::where('idcity', '=', $idcity)->firstOrFail();
        
        return \Response::json($city);
    }
    
    public static function getCategories(){
        $categories = Category::all();
        
        return \Response::json($categories);
    }
	
	public static function getCategory($idcategory){
        $category = Category::where('idcategory', '=', $idcategory)->firstOrFail();
        
        return \Response::json($category);
    }
	
	
	public static function insertCity(Request $request){
		if(!$request->cityname || !$request->state){ 
			return \Response::json('Missing parameters');
		}
		
		$temp=City::where('cityname',$request->cityname)->where('state',$request->state)->first();
		if(!count($temp)){
			$newcity=array(
				'cityname' => $request->cityname,
				'state' => $request->state,
			);
			$newcity = City::create($newcity)->idcity;
			return \Response::json($newcity);
		}else{
			
			return \Response::json(['error'=>'0','errordesc'=>'City exists']);
		};
		
		// destroy $newcity?
	}
	
	public static function submitProblem(Request $request){
		if(!$request->iduser || !$request->idcity || !$request->idcategory || !$request->address){
			return \Response::json('Missing parameters');
		}
			
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
		);
		
		$problem = Problem::create($problem);
		
		//destroy $problem?
		
	}
	
	//missing parameters check for everything?
	
	
}