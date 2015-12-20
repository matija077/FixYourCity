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
        $user = JWTAuth::parseToken()->authenticate();
        //get user's accesslevel to copare with route accesslevel
        $accesslevel = User::where('iduser', $user->iduser)->value('accesslevel');
        
        if ($accesslevel>=$role) {
            return $next($request);
        }
        
        return response('accesslevel not sufficent', 401);
    }
}
