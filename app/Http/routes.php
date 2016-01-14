<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'HomeController@index');

Route::group(array('prefix' => 'api'), function() 
{
	Route::get('/cities/{id}', 'ApiController@getCity');
	Route::get('/cities', 'ApiController@getCities');
	Route::get('/categories', 'ApiController@getCategories');
	Route::get('/categories/{id}', 'ApiController@getCategory');
	Route::post('/insertcity', 'ApiController@insertCity');
	Route::post('/submitproblem', 'ApiController@submitProblem')->middleware('check:2');
	Route::get('/authenticate/user', 'AuthenticateController@getAuthenticatedUser');
	Route::post('/authenticate', 'AuthenticateController@authenticate');
	Route::post('/signup', 'AuthenticateController@signup');
    Route::get('/users/{username?}/{email?}/{accesslevel?}/{banned?}', 'ApiController@getUsers');
    Route::post('/ban/{id}/{time}', 'ApiController@banUser');
	Route::get('/notification/{id}', 'ApiController@getNotifications');
	Route::get('/problems/{idcity}/{idcategory}', 'ApiController@getProblems');
	Route::get('/problem/{id}', 'ApiController@getProblem');
	Route::post('/submitcomment', 'ApiController@submitComment');
	Route::post('/suggestCity', 'ApiController@suggestCity');
	Route::post('/feedback', 'ApiController@feedback');
	Route::post('/suggestCategory', 'ApiController@suggestCategory');
	//Route::post('/upload', 'ApiController@uploadImage')->middleware('check:2');
    Route::get('/suggestCategory', 'ApiController@getSuggestCategories');
    Route::post('/addCategory', 'ApiController@addCategory');
    Route::post('/promoteUser', 'ApiController@promoteUser');
});


?>