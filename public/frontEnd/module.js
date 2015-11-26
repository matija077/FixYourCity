(function() {
	'use strict';
	
	angular
		.module('FixYourCityApp', [ 'ui.router','ngResource','satellizer'])
		.config(routeConfig);
		
	function routeConfig ($stateProvider, $urlRouterProvider, $authProvider){
		$authProvider.loginUrl = 'RWA/public/api/authenticate';
		
		$stateProvider
			.state('home',{
				url: '/',
				templateUrl: 'frontEnd/home/homePage.html',
				controller: 'HomeController',
				controllerAs: 'vm',
			})
			.state('city', {
				url: '/city/:id',
				templateUrl: 'frontEnd/cities/city.html',
				controller: 'CityDetailController',
				controllerAs: 'vm',
			})
			$urlRouterProvider.otherwise( '/');
	}
})();