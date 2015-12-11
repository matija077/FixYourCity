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
			.state('submit', {
				url: '/submit/:idcity/:idcategory',
				templateUrl:'frontEnd/home/submitissue.html',
				controller: 'submitissueController',
				controllerAs: 'vm',
			})
			.state('about',{
				url: '/about',
				templateUrl: 'frontEnd/about/about.html',
				controller: 'aboutController',
				controllerAs: 'vm',
			})
			$urlRouterProvider.otherwise( '/');

	}
})();

/* TEMPLATE
*
	.when('/', {
				templateUrl:'',
				controller: '',
				controllerAs: 'vm',
	})
*
*
*/
