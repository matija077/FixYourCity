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
    //add jwt token to every api route
    /*public function __construct()
    {
         $this->middleware('jwt.auth');
    }*/
    
    public static function getCities()
    {     
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



	private static function checkCountry($name){
		$name = str_replace("+", " ", $name);
		$countries = file_get_contents('http://api.vk.com/method/database.getCountries?need_all=1&count=1000&lang=en');
		$pozicija = strpos($countries, $name);
		$razdvoji = substr($countries, $pozicija-18, 9);
		$broj = preg_replace("/[^0-9]/","",$razdvoji);
		return $broj;
	}
	
	private static function vratiCyrilic($latinString) {
		$cyr  = array('а','б','в','г','д','e','ж','з','и','й','к','л','м','н','о','п','р','с','т','у', 
			'ф','х','ц','ч','ш','щ','ъ','ь', 'ю','я','А','Б','В','Г','Д','Е','Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У',
			'Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ь', 'Ю','Я' );
			$lat = array( 'a','b','v','g','d','e','zh','z','i','y','k','l','m','n','o','p','r','s','t','u',
			'f' ,'h' ,'ts' ,'ch','sh' ,'sht' ,'a' ,'y' ,'yu' ,'ya','A','B','V','G','D','E','Zh',
			'Z','I','Y','K','L','M','N','O','P','R','S','T','U',
			'F' ,'H' ,'Ts' ,'Ch','Sh' ,'Sht' ,'A' ,'Y' ,'Yu' ,'Ya' );
			$cyrilicString = str_replace($lat, $cyr, $latinString);
        return $cyrilicString;
	}

	private static function cleanString($text){
		$utf8 = array(
			'/[áàâãªä]/u'   =>   'a',
			'/[ÁÀÂÃÄ]/u'    =>   'A',
			'/[İÍÌÎÏ]/u'    =>   'I',
			'/[íìîï]/u'     =>   'i',
			'/[éèêë]/u'     =>   'e',
			'/[ÉÈÊË]/u'     =>   'E',
			'/[óòôõºö]/u'   =>   'o',
			'/[ÓÒÔÕÖ]/u'    =>   'O',
			'/[úùûü]/u'     =>   'u',
			'/[ÚÙÛÜ]/u'     =>   'U',
			'/ç/'           =>   'c',
			'/Ç/'           =>   'C',
			'/ñ/'           =>   'n',
			'/Ñ/'           =>   'N',
			'/–/'           =>   '-', // UTF-8 hyphen to "normal" hyphen
			'/[’‘‹›‚]/u'    =>   ' ', // Literally a single quote
			'/[“”«»„]/u'    =>   ' ', // Double quote
			'/ /'           =>   ' ', // nonbreaking space (equiv. to 0x160)
		);
		return preg_replace(array_keys($utf8), array_values($utf8), $text);
	}

	private static function checkCity($request, $numbah){
		$grad = $request->cityname;
		$grad = implode(' ', array_map('ucfirst', explode(' ', $grad)));
		$string_to_search = $grad;
		$grad = str_replace(" ", "+", $grad);
		$grad = implode('+', array_map('ucfirst', explode('+', $grad)));
		$cities = file_get_contents('http://api.vk.com/method/database.getCities?country_id=' . $numbah . '&need_all=1&count=1000&q=' . $grad . '&lang=en');
		$json_array = json_decode($cities, true);
		$podrucje = "";
		$cirilica = self::vratiCyrilic($string_to_search);
		$found = false;
		for($i = 0; $i < count($json_array['response']); ++$i){
			$removeSpecialChar = self::cleanString($json_array['response'][$i]['title']);
			if($json_array['response'][$i]['title'] == $string_to_search || $json_array['response'][$i]['title'] == $cirilica || $string_to_search == $removeSpecialChar) {
				$found = true;
				$grad = $json_array['response'][$i]['title'];
				if(isset($json_array['response'][$i]['region'])) {
					$regija = $json_array['response'][$i]['region'];
				}else $regija = "";
				break;
				if(isset($json_array['response'][$i]['area'])) {
					echo "Area: " . $json_array['response'][$i]['area'] . "<br />";
				}
			}
		}
		return $found;
	}

	private static function unos ($found) {
		if ($found) {
			$newcity=array(
			'cityname' => $request->cityname,
			'state' => $request->state,);
		$newcity = City::create($newcity)->idcity;
		return \Response::json($newcity);
		}else {
			return \Response::json('Ne postoji');
		};
	}
	
	public static function insertCity(Request $request){
		if(!$request->cityname || !$request->state){ 
			return \Response::json('Missing parameters');
		}

		$temp=City::where('cityname',$request->cityname)->where('state',$request->state)->first();
		if(!count($temp)) {  //ne postoji vec u bazi
			$provjera = false;
    
			$name = $request->state;
			$name = str_replace(" ", "+", $name);
			$name = implode('+', array_map('ucfirst', explode('+', $name)));
			$numbah = self::checkCountry($name);
      

			if ($numbah == "") {
				//echo "Country not found.";
			}else {
				$provjera = self::checkCity($request, $numbah);
			}

			if ($provjera) {
				$cityToInsert = implode(' ', array_map('ucfirst', explode(' ', $request->cityname)));
				$stateToInsert = implode(' ', array_map('ucfirst', explode(' ', $request->state)));
				$newcity=array(
					'cityname' => $cityToInsert,
					'state' => $stateToInsert,
				);
				$newcity = City::create($newcity)->idcity;
				return \Response::json($newcity);
			}else {
				return \Response::json('Ne postoji');
			}
		}
	}
	
	/*
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
	*/
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


	
}
	 
