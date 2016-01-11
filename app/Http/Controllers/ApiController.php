<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

use JWTAuth;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\City;
use App\Category;
use App\Problem;
use App\User;
use App\Comment;
use App\Subscribe;
use App\suggestCity;
use App\feedback;
use App\suggestCategory;


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
		if (!$request->suggestcityname || !$request->suggeststatename){
			return \Response::json('Missing parameters');
		}
		
		$temp=City::where('cityname',$request->suggestcityname)->where('state',$request->suggeststatename)->first();  //city exists and already in DB
		$temp2=suggestCity::where('suggestcityname',$request->suggestcityname)->where('suggeststatename',$request->suggeststatename)->first(); //city does not exists and already in DB
		if(!count($temp) && !count($temp2)) {  //ne postoji vec u bazi
			
			if(self::isUSA($request->suggeststatename)){
				$numbah=9; // USA has id 9 in the API
				$region=$request->suggeststatename;
			}else{
				if($request->suggeststatename=="USA") return \Response::json("Enter state name");
				$name = $request->suggeststatename;
				$name = implode(' ', array_map('ucfirst', explode(' ', $name)));
				$numbah = self::checkCountry($name);
				$region = "";
			}
			
			if (!empty($numbah)){
				$cityToInsert = self::checkCity($request->suggestcityname, $numbah, $region);
				if (!empty($cityToInsert)) {
					$stateToInsert = implode(' ', array_map('ucfirst', explode(' ', $request->suggeststatename)));
					$newcity=array(
						'cityname' => $cityToInsert,
						'state' => $stateToInsert,
					);
					$newcity = City::create($newcity)->idcity;
					return \Response::json('City inserted successfully!');
				}else{
					self::suggestCity($request);
					return \Response::json('Ne postoji, suggested!');
				};
			}else{
				self::suggestCity($request); 
				return \Response::json('City name suggested, Admin notified!');
			}
			
		} else {
			return \Response::json('City is already in database.');
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
    
    public static function getUsers($username=NULL, $email=NULL, $accesslevel=NULL, $banned=NUll){
        $QueryParametars = (object)array('username' => $username, 'email' => $email, 'accesslevel' => $accesslevel, 'banned' => $banned);
        $query = User::where(function($query) use (&$QueryParametars){
            $date =  date('Y-m-d H:i:s', time());
            foreach($QueryParametars as $key => $value){
                if ($value==-1){
                    //$arrayOfQueries[$counter] = User::where($key, $value);
                    unset($QueryParametars->$key);
                } else if ($key=='username' || $key=='email') {
                    $query->where($key, 'like', $value.'%');
                }  else if ($value=='pernamently') {
                     $query->where($key, 0);
                }  else if ($value=='temporary') {
                    $query->where($key, '>', $date);
                }  else if ($value=='No') {
                    $query->where($key, '<=', $date)->where($key, '!=', 0);
                }   else {
                    $query->where($key, $value);
                }
                
            }
            //dd($query); 
        })
        ->get();
        /*$finalQuery = User::where('iduser', '!=', -1) ;
        $finalQuery->unionAll($arrayOfQueries);*/
        /*$query = User::where(function($query){
            foreach($QueryParametars as $key => $value){
                $query->where($key, $value);
            }
        })
        ->get();*/
        $users = $query;
        $date = date('Y-m-d H:i:s', time());
        foreach($users as $user){
            if ($user->banned>$date){
                $user->bannedString = 'temporary';
            } else if ($user->banned==0) {
                $user->bannedString = 'pernamently';  
            } else { 
                $user->bannedString = 'No';
            }
        }
        
        return \Response::json($users, 200);
    }

    public static function banUser(Request $request, $idUser, $time){
        //if time is 0, user is perma banned
        if ($time==NAN){
            return \Response::json('bantime is Nan', 400);
        }
        /*time greater than 0, we add ban time to current time in seconds
         *we recieve time in hours -> 1h = 3600 seconds
         *if time is equal to 0, we leave like that
         *if time is less than 0, we use current time
        */
        if ($time>0) {
            $newtime = time()+$time*3600;
            $date =  date('Y-m-d H:i:s', $newtime);
        } else if ($time==0) {
            $date = 0;
        } else {
            $date = date('Y-m-d H:i:s', time());
        }
        $user = User::where('iduser', $idUser)->first();
        $user->banned = $date;
        $user->save();
        if ($time==0){
            return \Response::json('user '.$user->username. 'has been perma banned', 200);
        }else if ($time>0) {
            return \Response::json('user '.$user->username. 'has been temporary banned', 200);
        } else {
            return \Response::json('user '.$user->username. 'is unbanned', 200);
        }
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
            }else return \Response::json('No new notifications',200);

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
			$problems[$i]['comments'] = Comment::where('idproblem',$problems[$i]['idproblem'])->count();
			$i++;
		};
		
		return \Response::json($problems);
	}
	
	public static function getProblem($idproblem){
		if($idproblem){
			$i = 0;
			
			$problem = Problem::where('idproblem',$idproblem)
								->join('user','user.iduser','=','problem.iduser')
								->join('category','category.idcategory','=','problem.idcategory')
								->select('problem.*','user.username','category.ctgname')->firstOrFail();
								
			//adds all comments and usernames for selected problem					
			$problem['comments'] = Comment::where('idproblem',$idproblem)
											->join('user','user.iduser','=','comment.iduser')
											->select('comment.*','user.username')
											->get();
											
			return \Response::json($problem);
		}
		return \Response::json('Greska');
		
	}

	public static function submitComment(Request $request){
		if(!$request->iduser || !$request->idproblem || !$request->text){
			return \Response::json('Missing parameters');
		}
		$comment = array(
			'iduser' => $request->iduser,
			'idproblem' => $request->idproblem,
			'text' => $request->text,
			'url' => $request->url,
			'created' => date('Y-m-d H:i:s', time()),   //time isnt correct, need uniform assignment for all database tables
		);
		
		$comment = Comment::create($comment);
		
		return \Response::json($comment);
	}
	
	public static function suggestCity(Request $request){
			$suggestedCityArray = array(
				'iduser' => $request->iduser,
				'suggestcityname' => $request->suggestcityname,
				'suggeststatename' => $request->suggeststatename,
			);
			$suggestedCityArray = suggestCity::create($suggestedCityArray);
	}

	public static function feedback(Request $request){
		$enteredFeedback = array(
			'iduser' => $request->iduser,
			'feedbacksubject' => $request->feedbacksubject,
			'feedbacktext' => $request->feedbacktext,
		);
		$enteredFeedback = feedback::create($enteredFeedback);
	}

	public static function suggestCategory(Request $request){
		$suggestedCategory = array(
			'iduser' => $request->iduser,
			'suggestcategoryname' => $request->suggestcategoryname,
		);
		$suggestedCategory = suggestCategory::create($suggestedCategory);
	}
	
	
}
	 