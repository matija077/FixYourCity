<?php

namespace App\Http\Middleware;

use Closure;

use App\Tracker;
use JWTAuth;

class Tracking
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        return $next($request);
    }
	
	public function terminate($request, $response)
	{
		$user = 0;
		
		//returns user but always throws 'could not parse token from request' exception?
		try{
			$user = JWTAuth::parseToken()->authenticate();
		}catch(\Tymon\JWTAuth\Exceptions\JWTException $e){
			//literally nothing
		}
		
		//takes all headers form request to get custom returned referrer path
		$temp = getallheaders();
		
		$track = array(
			'iduser' => (isset($user['iduser']) ? $user['iduser'] : '0'),
			'ip' => $_SERVER['REMOTE_ADDR'],
			'browser' => (isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '0'),
			'referer' => (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '0'),
			'internalref' => (isset($temp['internalref']) ? $temp['internalref'] : '0') ,
			'destination' => $_SERVER['REQUEST_URI'],
		);
		$track = Tracker::create($track);
		
		
		return 1;
    }
}
