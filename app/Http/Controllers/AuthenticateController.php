<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use JWTAuth;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class AuthenticateController extends Controller
{
    public static function signup()
    {
        $credentials = Input::only('iduser', 'password');

        try {
            $user = User::create($credentials);
        } catch (Exception $e) {
            return Response::json(['error' => 'User already exists.'], HttpResponse::HTTP_CONFLICT);
        }
        
        $token = JWTAuth::fromUser($user);
        
        return Response::json(compact('token'));
    }
    
    public static function authenticate(Request $request)
    {
        $credentials = $request->only('iduser', 'password');

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
