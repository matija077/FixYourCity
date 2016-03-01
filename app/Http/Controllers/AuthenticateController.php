<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use JWTAuth;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\User;

class AuthenticateController extends Controller
{
    public static function signup(Request $request)
    {
        //if user exists returns a new model instance
        try {
            $user = User::firstorNew(['email' => $request->email]);
        }//catching any erros that may occur
        catch(Exception $e){
            return \Response::json(['error' => $e->getMessage()], 404);
        }
        /*
        *check if user actually exists in database
        * '\' in front of a Hash for including
        */
		$time = date('Y-m-d H:i:s', time());
		if (!$user->exists){
			$user = array(
				'username' => $request->username,
				'email' => $request->email,
				'password' =>  \Hash::make($request->password),
				'accesslevel' => 2,
				'karma' => $request->karma,
				'banned' => $time,
				'registered' => $time,
			);
                
            $user = User::create($user);
            //banned in array not working, this is a fix
            $user->banned = $time;
            $user->save();
        }//user exist; return 'conflict error'
        else{
            return \Response::json(['error' => 'User already exists.'], 409);
        }
               
        $token = JWTAuth::fromUser($user);
        
        return \Response::json(compact('token'));
    }
    
    public static function authenticate(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            // verify the credentials and create a token for the user
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json([$credentials], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        //we need to check if user is banned
        //TODO: rewrite HTTP codes for errors.
        $email = $request->email;
        $user = User::where('email', $email)->first();
        $time = date('Y-m-d H:i:s', time());
        if ($user->banned<=0){
            return response()->json(['error' => 'user_is_perma_banned'], 501);
        } else if ($user->banned>$time){
            return response()->json(['error' => 'user_is_temporary_banned'], 502);
        }
        // if no errors are encountered we can return a JWT
        return response()->json(compact('token'));
    }
    
    public function getAuthenticatedUser()
    {
        try {
			if(!JWTAuth::getToken()){
				return \Response::json(array('0'=>'error','1'=>'Not logged in'),200);
			}

            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['token_expired'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['token_invalid'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['token_absent'], $e->getStatusCode());

        }

        // the token is valid and we have found the user via the sub claim
        return response()->json(compact('user'));
    }

}
