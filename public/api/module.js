(function() {
	'use strict';
	
	angular
		.module('FixYourCityApp', ['ngRoute'])
		.config(routeConfig);
		
	function routeConfig ($routeProvider){
		$routeProvider
			.when('/',{
				templateUrl: 'api/home/homePage.html',
				controller: 'HomeController',
				controllerAs: 'vm',
			})
			.otherwise({ redirectTo: '/'});
	}
})();