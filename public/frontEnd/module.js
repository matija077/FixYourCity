(function() {
	'use strict';
	
	angular
		.module('FixYourCityApp', ['ngRoute', 'ngResource'])
		.config(routeConfig);
		
	function routeConfig ($routeProvider){
		$routeProvider
			.when('/',{
				templateUrl: 'frontEnd/home/homePage.html',
				controller: 'HomeController',
				controllerAs: 'vm',
			})
			.when('/city/:id', {
				templateUrl: 'frontEnd/cities/city.html',
				controller: 'CityDetailController',
				controllerAs: 'vm',
			})
			.otherwise({ redirectTo: '/'});
	}
})();