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
			.state('signup', {
				url: '/signup',
				templateUrl: 'frontend/signup/signup.html',
				controller: 'signupController',
				controllerAs: 'vm',
				accesslevel: '1',
			})
			.state('problem', {
				url: '/problem/:id',
				templateUrl: 'frontend/problem/problem.html',
				controller: 'problemController',
				controllerAs: 'vm',
				accesslevel: '1',
			})
			.state('feedback', {
				url: '/feedback',
				templateUrl: 'frontend/home/feedback.html',
				controller: 'feedbackController',
				controllerAs: 'vm',
				accesslevel: '1',
			})
			.state('suggestCity', {
				url: '/suggestCity',
				templateUrl: 'frontend/home/suggestCity.html',
				controller: 'suggestCityController',
				controllerAs: 'vm',
				accesslevel: '1',
			})
			.state('suggestCategory', {
				url: '/suggestCategory',
				templateUrl: 'frontend/home/suggestCategory.html',
				controller: 'suggestCategoryController',
				controllerAs: 'vm',
				accesslevel: '1',
			})
			$urlRouterProvider.otherwise( '/');

	}
	
	function routeInterceptor ($rootScope, $state){
		$rootScope.$on('$stateChangeStart', function(event, toState){
			var user = JSON.parse(localStorage.getItem('user'));
			var token = localStorage.getItem('satellizer_token');
			//console.log('user :', user);
			//console.log('token :', token);
			//console.log('role :', $rootScope.role);
			
			//if a user  came from a different webpage,
			//but a token is still valid in local storage autheticate him
			if (token!=null && user!=null) {
				$rootScope.authenticated = true;
				$rootScope.role = user.accesslevel;
                $rootScope.userName = user.username;
				//console.log('role :', $rootScope.role);
				//console.log(toState);      
            }else {
                //if user is a guest, on a first state change assign him role 1
                $rootScope.role = '1';
                $rootScope.authenticated = false;
                //on exparation token is removed by Satelizer. We need to take care of removing the user.
                if (user!=null) {
                    localStorage.removeItem('user');
                }
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
	.state('', {
				url: '/',
				templateUrl: '',
				controller: '',
				controllerAs: 'vm',
				accesslevel: '',
	})
*
*
*/
