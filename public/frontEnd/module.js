(function() {
	'use strict';
	
	angular
		.module('FixYourCityApp', [ 'ui.router','ngResource','satellizer'])
		.config(routeConfig)
		.run(routeInterceptor);
		
	function routeConfig ($stateProvider, $urlRouterProvider, $authProvider){
		$authProvider.loginUrl = 'FixYourCity/public/api/authenticate';
		
		$stateProvider
			.state('home',{
				url: '/',
				templateUrl: 'frontend/home/homePage.html',
				controller: 'HomeController',
				controllerAs: 'vm',
				accesslevel: '1',
			})
			.state('city', {
				url: '/city/:id',
				templateUrl: 'frontend/cities/city.html',
				controller: 'CityDetailController',
				controllerAs: 'vm',
				accesslevel: '2',
			})
			.state('submit', {
				url: '/submit/:idcity/:idcategory',
				templateUrl:'frontend/home/submitissue.html',
				controller: 'submitissueController',
				controllerAs: 'vm',
				accesslevel: '1',	
			})
			.state('about',{
				url: '/about',
				templateUrl: 'frontend/about/about.html',
				controller: 'aboutController',
				controllerAs: 'vm',
				accesslevel: '1',
			})
			$urlRouterProvider.otherwise( '/');

	}
	
	function routeInterceptor ($rootScope, $state){
		$rootScope.$on('$stateChangeStart', function(event, toState){
			var user = JSON.parse(localStorage.getItem('user'));
			console.log(user);
			console.log($rootScope.role);
			
			//if a user  came from a different webpage,
			//but a token is still valid in local storage autheticate him
			if (user!=null) {
				$rootScope.authenticated = true;
				$rootScope.role = user.accesslevel;
				console.log($rootScope.role);
				console.log(toState);
				}else {
					//if user is a guest, on a first state change assign him role 1
					$rootScope.role = '1';
				}
				//it-s enough to check accesslevel only. If user is authenticated he
				//will have accesslevel > 1
				if (toState.accesslevel>$rootScope.role){
					event.preventDefault();
					$state.go('about');
				}
		});
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
