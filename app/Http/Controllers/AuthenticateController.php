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
        if (!$user->exists){
            $user = array('username' => $request->username, 'email' => $request->email,
                'password' =>  \Hash::make($request->password), 'accesslevel' => $request->accesslevel, 
                'karma' => $request->karma);
                
            $user = User::create($user);
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

        // if no errors are encountered we can return a JWT
        return response()->json(compact('token'));
    }
}
