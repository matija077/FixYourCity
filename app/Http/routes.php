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
	Route::get('/users/{username?}/{email?}/{accesslevel?}/{banned?}', 'ApiController@getUsers')->middleware('check:4');
	Route::post('/ban/{id}/{time}', 'ApiController@banUser')->middleware('check:4');
	Route::get('/notification/{id}', 'ApiController@getNotifications')->middleware('check:2');
	Route::post('/notification/{id}', 'ApiController@hasSeenNotifications')->middleware('check:2');
	Route::get('/problems/{idcity}/{idcategory}', 'ApiController@getProblems');
	Route::get('/problem/{id}', 'ApiController@getProblem');
	Route::post('/submitcomment', 'ApiController@submitComment')->middleware('check:2');
	Route::post('/suggestCity', 'ApiController@suggestCity')->middleware('check:2');
	Route::get('/suggestCity', 'ApiController@getSuggestedCities')->middleware('check:4');
	Route::post('/feedback', 'ApiController@feedback')->middleware('check:2');
	Route::post('/suggestCategory', 'ApiController@suggestCategory')->middleware('check:2');
	Route::get('/suggestCategory', 'ApiController@getSuggestCategories')->middleware('check:4');
	Route::post('/addCategory', 'ApiController@addCategory')->middleware('check:4');
	Route::post('/addCities', 'ApiController@addCities')->middleware('check:4');
	Route::post('/addCityRep', 'ApiController@addCityRep')->middleware('check:4');
	Route::post('/promoteUser', 'ApiController@promoteUser')->middleware('check:4');
	Route::post('/suggestCR', 'ApiController@suggestCR')->middleware('check:2');
	Route::get('/suggestCR', 'ApiController@getSuggestedCR')->middleware('check:4');
	Route::post('/vote', 'ApiController@vote')->middleware('check:2');
	Route::post('/mark', 'ApiController@mark')->middleware('check:3');
	Route::post('/follow', 'ApiController@follow');
});


?>