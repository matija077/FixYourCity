<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

use JWTAuth;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\City;
use App\Category;
use App\Problem;
use App\Comment;
use App\User;
use App\Subscribe;


class ApiController extends Controller
{
    //add jwt token to every api route
    /*public function __construct()
    {
         $this->middleware('jwt.auth');
    }*/
    
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

	private static function checkCountry($name){
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

	private static function checkCity($grad, $numbah, $region){
		$grad = implode(' ', array_map('ucfirst', explode(' ', $grad)));
		$string_to_search = $grad;
		$grad = str_replace(" ", "+", $grad);
		$cities = file_get_contents('http://api.vk.com/method/database.getCities?country_id=' . $numbah . '&need_all=1&count=1000&q=' . $grad . '&lang=en');
		$json_array = json_decode($cities, true);
		$cirilica = self::vratiCyrilic($string_to_search);
		//$cirReg = self::vratiCyrilic($region);    //maybe update later
		$found = "";
		if (!isset($json_array['response'])) return $found; 
		for($i = 0; $i < count($json_array['response']); ++$i){
			$removeSpecialChar = self::cleanString($json_array['response'][$i]['title']);
			if($json_array['response'][$i]['title'] == $string_to_search || $json_array['response'][$i]['title'] == $cirilica || $string_to_search == $removeSpecialChar) {
				if(empty($region) || $json_array['response'][$i]['region'] == $region){
					$found = $json_array['response'][$i]['title'];
					break;
				}
			}
		}
		return $found;
	}
	
	public static function isUSA($state){
		$array = array(
			'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine',
			'Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota',
			'Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
		);
		return in_array($state,$array);
	}
	
	public static function insertCity(Request $request){
		if(!$request->cityname || !$request->state){ 
			return \Response::json('Missing parameters');
		}

		$temp=City::where('cityname',$request->cityname)->where('state',$request->state)->first();
		if(!count($temp)) {  //ne postoji vec u bazi
			
			if(self::isUSA($request->state)){
				$numbah=9; // USA has id 9 in the API
				$region=$request->state;
			}else{
				if($request->state=="USA") return \Response::json("Enter state name");
				$name = $request->state;
				$name = implode(' ', array_map('ucfirst', explode(' ', $name)));
				$numbah = self::checkCountry($name);
				$region = "";
			}
			
			if (!empty($numbah)){
				$cityToInsert = self::checkCity($request->cityname, $numbah, $region);
				if (!empty($cityToInsert)) {
					$stateToInsert = implode(' ', array_map('ucfirst', explode(' ', $request->state)));
					$newcity=array(
						'cityname' => $cityToInsert,
						'state' => $stateToInsert,
					);
					$newcity = City::create($newcity)->idcity;
					return \Response::json($newcity);
				}else{
					return \Response::json('Ne postoji');
				};
			}else{
				return \Response::json('Country or state does not exist');
			}

			
		}
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
			'lastactivity' => date('Y-m-d H:i:s', time()),
		);
		
		$problem = Problem::create($problem);
		
		//destroy $problem?
		
	}
	
	public static function getNotifications($userId){
        if ($userId!=0) {
            $counter = 0;
            $user = User::where('iduser', $userId)->first();
            $userLastActivity = $user->lastactivity;
            $subcribes = Subscribe::where('iduser', $userId)->get();
            foreach($subcribes as $subcribe){
                //maybe just use one query??
                $problem = Problem::where('idproblem', $subcribe->idproblem)->first();
                $problemLastActivity = $problem->lastactivity;
                $probemText = $problem->text;
                $categoryName = Category::where('idcategory', $problem->idcategory)->value('ctgname');
                //$categoryname = Category::where('idcategory', $)
                if ($problemLastActivity>$userLastActivity){
                    $response[$counter++] = $probemText.' in category '.$categoryName.' has been updateded';
                }
            }
            //every time we try to query notifications update user's lastactivity
            $lastactivity = date('Y-m-d H:i:s', time());
            $user->lastactivity = $lastactivity;
            $user->save();

            if ($counter>0){
                return \Response::json($response, 200);
            }

        }
		return \Response::json('', 400);
	}

	public static function getProblems($idcity,$idcategory){
		$i = 0;
		
		// MARK isn't yet included in query
		
		//if idcategory is -1 it means category hasn't been selected -> querying only by city
		if($idcategory!=-1){
			$problems = Problem::where('idcity',$idcity)
								->where('problem.idcategory',$idcategory)
								->join('user','user.iduser','=','problem.iduser')
								->join('category','category.idcategory','=','problem.idcategory')
								->select('problem.*','user.username','category.ctgname')
								->get();
		}else{
			$problems = Problem::where('idcity',$idcity)
								->join('user','user.iduser','=','problem.iduser')
								->join('category','category.idcategory','=','problem.idcategory')
								->select('problem.*','user.username','category.ctgname')
								->get();
		}
		
		//following loop is to add number of comments for each problem that was found previously
		while(isset($problems[$i])){
			$problems[$i]['comments']=Comment::where('idproblem',$problems[$i]['idproblem'])->count();
			$i++;
		};
		
		return \Response::json($problems);
	}
	
}
	 
