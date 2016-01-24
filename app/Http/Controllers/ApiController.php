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
use App\Imgurlink;
use App\suggestCR;
use App\Cityrep;
use App\Vote;


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
	
	public static function submitProblem(){
		
		//exact duplicate check needed!
		
		if(!$_POST['params']['idcity'] || !$_POST['params']['idcategory'] || !$_POST['params']['iduser'] || !$_POST['params']['address']){
			return \Response::json('Missing parameters');
		};
		
		if(!empty($_FILES)){
			$files = $_FILES;
			$link = self::uploadImage($files);
		}else{
			$link=-1;
		};
		
		if ($link==-1 || $link==-2 || $link==-3){
			$link = null;
		}else{
			$link = $link['data']['link'];
		};
		
		$problem = array(
			'iduser' => $_POST['params']['iduser'],
			'idcity' => $_POST['params']['idcity'],
			'idcategory' => $_POST['params']['idcategory'],
			'address' => $_POST['params']['address'],
			'url' => $link,
			'text' => $_POST['params']['text'],
			'votepositive' => '1',
			'votenegative' => '0',
			'lastactivity' => date('Y-m-d H:i:s', time()),
			'created' => date('Y-m-d H:i:s', time()),
		);
		
		$problem = Problem::create($problem);
		
		//add image deletion from imgur (imgurlink table, deletehash) if problem insert is unsuccessful
		
		return \Response::json($problem);
		
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
			$user = User::where('iduser', $userId)->select('lastactivity')->first();
			//check if it really is that user?
			$response = Subscribe::where('subscribe.iduser', $userId)
							->join('problem','problem.idproblem','=','subscribe.idproblem')
							->where('problem.lastactivity','>=',$user['lastactivity'])
							->join('category','category.idcategory','=','problem.idcategory')
							->join('city','city.idcity','=','problem.idcity')
							->select('problem.lastactivity','problem.text','problem.idproblem','category.ctgname','city.cityname')
							->get();
			
            if (!empty($response[0])){
                return \Response::json($response, 200);
            }else return \Response::json('No new notifications',200);
        }
		return \Response::json('', 400);
	}
	
	public static function hasSeenNotifications($iduser){
		if(!empty($iduser)){
			$user = User::where('iduser', $iduser)->first();
			$user->lastactivity = date('Y-m-d H:i:s', time());
			$user->save();
			return \Response::json('',200);
		}
		return \Response::json($iduser, 400);
	}
	
	public static function getProblems($idcity,$idcategory,Request $request){
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
		
		//following loop is to add number of comments for each problem that was found previously | and to add voted status of user for each problem
		while(isset($problems[$i])){
			$problems[$i]['comments'] = Comment::where('idproblem',$problems[$i]['idproblem'])->count();
			$problems[$i]['voted'] = Vote::where('idproblem',$problems[$i]['idproblem'])->where('iduser',$request->iduser)->select('choice')->first()['choice'];
			$i++;
		};
		
		return \Response::json($problems);
	}
	
	public static function getProblem($idproblem,Request $request){
		if($idproblem){
			
			$problem = Problem::where('idproblem',$idproblem)
								->join('user','user.iduser','=','problem.iduser')
								->join('category','category.idcategory','=','problem.idcategory')
								->select('problem.*','user.username','category.ctgname')->firstOrFail();
								
			//adds all comments and usernames for selected problem					
			$problem['comments'] = Comment::where('idproblem',$idproblem)
											->join('user','user.iduser','=','comment.iduser')
											->select('comment.*','user.username')
											->get();
			//adds user vote decision
			$problem['voted'] = Vote::where('idproblem',$idproblem)
									->where('iduser',$request->iduser)
									->select('choice')
									->first()['choice'];
			//adds users CR status
			$problem['cr'] = Cityrep::where('idcity',$problem->idcity)
									->where('iduser',$request->iduser)
									->select('idcityrep')
									->first()['idcityrep'];
								
			return \Response::json($problem);
		};
		return \Response::json('Error!',400);
		
	}

	public static function submitComment(){
		
		if(!$_POST['params']['iduser'] || !$_POST['params']['idproblem'] || !$_POST['params']['text']){
			return \Response::json('Missing parameters');
		};
		
		if(!empty($_FILES)){
			$files = $_FILES;
			$link = self::uploadImage($files);
		}else{
			$link=-1;
		};
		
		if ($link==-1 || $link==-2 || $link==-3){
			$link = null;
		}else{
			$link = $link['data']['link'];
		};
		
		$comment = array(
			'iduser' => $_POST['params']['iduser'],
			'idproblem' => $_POST['params']['idproblem'],
			'text' => $_POST['params']['text'],
			'url' => $link,
			'created' => date('Y-m-d H:i:s', time()),   //time isnt correct, need uniform assignment for all database tables
		);
		//update problems 'lastactivity' when a comment is added
		$problem = Problem::where('idproblem',$_POST['params']['idproblem'])->first();
		$problem->lastactivity = date('Y-m-d H:i:s', time());
		$problem->save();
		
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
		$temp=suggestCategory::where('suggestcategoryname',$request->suggestcategoryname)->first();
		if (!$temp) {
			$suggestedCategory = array(
				'iduser' => $request->iduser,
				'suggestcategoryname' => $request->suggestcategoryname,
			);
			$suggestedCategory = suggestCategory::create($suggestedCategory);
		} else return \Response::json('Duplicate category name.');
	}
	
	public static function uploadImage($files){
		/*
		*		UPLOAD TO SERVER
		*
		$target_file = __DIR__ .'/../../../storage/img_upload/' . basename($_FILES["file"]["name"][0]);
		
		$check = getimagesize($_FILES["file"]["tmp_name"][0]);
		if (!$check){
			return \Response::json('Not a file');
		};
		
		$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
		if(($_FILES["file"]["size"][0] > 5242880) || ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg")){
			return \Response::json('File too big or not an image! Extension: '. $imageFileType .'');
		};
		
		if (move_uploaded_file($_FILES["file"]["tmp_name"][0], $target_file)){
			return \Response::json('Image upload succesfull');
		}else{
			return \Response::json('Error uploading');
		};
		
		*/
		
		
		
		/*
		*		UPLOAD TO IMGUR (original, if called directly api/upload, now deprecated)
		*
		
		// add size and other checks
		//return \Response::json($_POST);
		
		
		$filename = $_FILES['file']['tmp_name'];
		$client_id = env('CLIENT_ID');
	
		$handle = fopen($filename, "r");
		$data = fread($handle, filesize($filename));
		$pvars = array('image' => base64_encode($data));
		$timeout = 30;
		
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);  //test if this line works on modulo
		curl_setopt($curl, CURLOPT_URL, 'https://api.imgur.com/3/image');
		curl_setopt($curl, CURLOPT_TIMEOUT, $timeout);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array('Authorization: Client-ID ' . $client_id));
		curl_setopt($curl, CURLOPT_POST, 1);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $pvars);
		$out = curl_exec($curl);
		curl_close ($curl);
		
		$pms = json_decode($out,true);
		// do stuff
		return \Response::json($pms['data']['link']);
		
		*/
		
		$check = getimagesize($files['file']['tmp_name']);
		if (!$check){
			return -1;
		};
		
		$imageFileType = pathinfo(basename($files['file']['name']),PATHINFO_EXTENSION);
		if(($files["file"]["size"] > 9437184) || ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg")){
			return -2;
		};
		
		$filename = $files['file']['tmp_name'];
		$client_id = env('CLIENT_ID');
	
		$handle = fopen($filename, "r");
		$data = fread($handle, filesize($filename));
		$pvars = array('image' => base64_encode($data));
		
		$timeout = 30;
		
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);  //test if this line works on modulo
		curl_setopt($curl, CURLOPT_URL, 'https://api.imgur.com/3/image');
		curl_setopt($curl, CURLOPT_TIMEOUT, $timeout);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array('Authorization: Client-ID ' . $client_id));
		curl_setopt($curl, CURLOPT_POST, 1);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $pvars);
		$out = curl_exec($curl);
		curl_close ($curl);
		
		$pms = json_decode($out,true);
		
		if($pms['success']){
			$dat = array(
				'url' => $pms['data']['link'],
				'deletehash' => $pms['data']['deletehash'],
			);
			Imgurlink::create($dat);
			return $pms;
		}
		return -3;
		
	}
    
    public static function getSuggestCategories(Request $request){
        $suggestedCategory = suggestCategory::get();
        foreach($suggestedCategory as $category){
            $category['username'] = User::where('iduser', $category->iduser)->value('username'); 
        }
        
        Return \Response::json($suggestedCategory, 200);
    }
    
    public static function addCategory(Request $request){
		$suggestCategories = $request->input();
		
		foreach($suggestCategories as $suggestCategory){
			$del = suggestCategory::where('idsuggestcategory', $suggestCategory['idsuggestcategory'])->first();
			suggestCategory::where('idsuggestcategory', $suggestCategory['idsuggestcategory'])->delete();
			
			if ($suggestCategory['pick']){
				$categoryAdd = array(
					'ctgname' => $del['suggestcategoryname'],
				);
				$categoryAdd = Category::create($categoryAdd);
			};
		};
		return \Response::json('Done', 200);
	}
	
	public static function promoteUser(Request $request){
		$step = $request->step;
		$userId = $request->iduser;
		$user = User::where('iduser', $userId)->first();
		//removes cities from CR on demote
		if($step==-1 && $user->accesslevel==3){
			Cityrep::where('iduser',$userId)->delete();
		};
		$user->accesslevel = $user->accesslevel + $step;
		$user->save();
		return \Response::json('Done', 200);
	}

    public static function suggestCR(Request $request){
		$suggestedCRarray = array(
			'idcity' => $request->idcity,
			'iduser' => $request->iduser,
			'text' => $request->text,
		);
		$suggestedCRarray = suggestCR::create($suggestedCRarray);
		return \Response::json($suggestedCRarray);
	}
	
	public static function getSuggestedCities(){
		$suggestedCities = suggestCity::join('user','user.iduser','=','suggestcity.iduser')
										->select('user.username','suggestcity.*')
										->get();
		return \Response::json($suggestedCities);
	}
	
	public static function addCities(Request $request){
		$changecities = $request->input();
		
		foreach($changecities as $city){
			$del = suggestCity::where('idsuggestcity', $city['idsuggestcity'])->first();
			suggestCity::where('idsuggestcity', $city['idsuggestcity'])->delete();
			
			if($city['pick']){
				$cityAdd = array(
					'cityname' => $del['suggestcityname'],
					'state' => $del['suggeststatename'],
				);
				$cityAdd = City::create($cityAdd);
			};
		};
		
		return \Response::json('Done');
	}
	
	public static function getSuggestedCR(){
		$suggestedCR = suggestCR::join('user','user.iduser','=','suggestcr.iduser')
									->join('city','city.idcity','=','suggestcr.idcity')
									->select('user.username','city.cityname','city.state','suggestcr.*')
									->get();
		return \Response::json($suggestedCR);
	}
	
	public static function addCityRep(Request $request){
		$changerep = $request->input();
		
		foreach($changerep as $rep){
			$del = suggestCR::where('idsuggestcr', $rep['idsuggestcr'])->first();
			suggestCR::where('idsuggestcr', $rep['idsuggestcr'])->delete();
			
			if($rep['pick']){
				$rep = array(
					'iduser' => $del['iduser'],
					'idcity' => $del['idcity'],
					'date_assigned' => date('Y-m-d H:i:s', time()),
				);
				$rep = Cityrep::create($rep);
				$user = User::where('iduser',$del['iduser'])->first();
				if($user->accesslevel!=4){
					$user->accesslevel = 3;
					$user->save();
				};
			};	
        };
		
        return \Response::json('Done');
	}
	
	public static function vote(Request $request){
		$voted = $request->voted;
		
		$uservote = Vote::where('iduser',$request->iduser)
					->where('idproblem',$request->idproblem)
					->first();
					
		$problem = Problem::where('idproblem',$request->idproblem)->first();
		
		if(empty($uservote)){ 
			//no vote has been added yet by this user for this problem
			$vote = array(
				'iduser' => $request->iduser,
				'idproblem' => $request->idproblem,
				'choice' => $voted,
			);
			
			$vote = Vote::create($vote);
			
			switch($voted){
				case -1:{
					$problem->votenegative++;
					break;
				}
				case 1:{
					$problem->votepositive++;
					break;
				}
			};
			
			$problem->save();
			return \Response::json('Done');
			
		}else{
			// user's changing his vote
			if($voted==1){
				switch($uservote->choice){
					case -1: {
						$problem->votenegative-=1;
						$problem->votepositive+=1;
						$uservote->choice=1;
						break;
					}
					case 0: {
						$problem->votenegative+=1;
						$uservote->choice=1;
						break;
					}
					case 1: {
						$problem->votepositive-=1;
						$uservote->choice=0;
						break;
					}
				};
			}else{
				switch($uservote->choice){
					case -1: {
						$problem->votenegative-=1;
						$uservote->choice=0;
						break;
					}
					case 0: {
						$problem->votenegative+=1;
						$uservote->choice=-1;
						break;
					}
					case 1: {
						$problem->votepositive-=1;
						$problem->votenegative+=1;
						$uservote->choice=-1;
						break;
					}
				};
			};
			
			$problem->save();
			$uservote->save();
			return \Response::json('Updated');
			
		};
			
		return \Response::json('Error!');
	}
	
	public static function mark(Request $request){
		if(empty($request->mark) && $request->mark!=0 || empty($request->idproblem)){
			return \Response::json('Missing parameters!');
		};
		$problem = Problem::where('idproblem',$request->idproblem)->first();
		//missing check if user is really CR of this city
		$problem->mark = $request->mark;
		$problem->lastactivity = date('Y-m-d H:i:s', time());
		$problem->save();
		return \Response::json('Done');
	}
}
	 