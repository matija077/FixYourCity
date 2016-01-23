<?php

namespace App\Http\Middleware;

use Closure;

use Illuminate\Http\Request;
use JWTAuth;
use App\User;

class AccesslevelCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $role)
    {
        //get user from token not folloeing prinicples of reusable coding
        try{
            $user = JWTAuth::parseToken()->authenticate();      
            //get user's accesslevel to copare with route accesslevel
            if ($user!=''){
                $accesslevel = User::where('iduser', $user->iduser)->value('accesslevel');
            }
        }catch(Exception $e){
            $accesslevel = 1;
            return response('error'.$e, 404);
        }
            /*every time user is authenticated and uses routes with this middleware, 
            *it updates user's lastactivity column.  
            */ 
		//REMOVED: lastactivity has since been redone to be used for checking when were notifications last seen
		// and thus is no longer needed here as it would break that functionality
		/*
		if ($user!=''){
            //date_default_timezone_set('Europe/Zagreb');
            //time is off by an hour
            //$hour = 3600;
            $lastactivity = date('Y-m-d H:i:s', time());
            $user->lastactivity = $lastactivity;    
            $user->save();
        }
        */
        if ($accesslevel>=$role) {
            return $next($request);
        }
        
      
        
        return response('accesslevel not sufficent', 401);
    }
}
