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
			.when('/submit/:idcity/:idcategory', {
				templateUrl:'frontEnd/home/submitissue.html',
				controller: 'submitissueController',
				controllerAs: 'vm',
			})
			.when('/about',{
				templateUrl: 'frontEnd/about/about.html',
				controller: 'aboutController',
				controllerAs: 'vm',
			})
			.otherwise({ redirectTo: '/'});
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
