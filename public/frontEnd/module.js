(function() {
	'use strict';
	
	angular
		.module('FixYourCityApp', [ 'ui.router','ngResource','satellizer','ngFileUpload','ngBootstrapLightbox'])
		.config(routeConfig)
		.run(routeInterceptor);
		
	function routeConfig ($stateProvider, $urlRouterProvider, $authProvider){

		$authProvider.loginUrl = 'FixYourCity/public/api/authenticate';
		
		$stateProvider
			.state('home',{
				url: '/',
				title: 'Home',
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
				title: 'Submit problem',
				templateUrl:'frontend/home/submitissue.html',
				controller: 'submitissueController',
				controllerAs: 'vm',
				accesslevel: '2',
			})
			.state('about',{
				url: '/about',
				title: 'About',
				templateUrl: 'frontend/about/about.html',
				accesslevel: '1',
			})
			.state('signup', {
				url: '/signup',
				title: 'Sign up!',
				templateUrl: 'frontend/signup/signup.html',
				controller: 'signupController',
				controllerAs: 'vm',
				accesslevel: '1',
			})
            .state('admin page', {
                url: '/admin',
				title: 'Admin panel',
                templateUrl: 'frontend/admin page/admin_page.html',
                controller: 'AdminPageController',
                controllerAs: 'vm',
                accesslevel: '4',
            })
			.state('problem', {
				url: '/problem/:id',
				title: 'Problem',
				templateUrl: 'frontend/problem/problem.html',
				controller: 'problemController',
				controllerAs: 'vm',
				accesslevel: '1',
			})
			.state('feedback', {
				url: '/feedback',
				title: 'Send feedback',
				templateUrl: 'frontend/home/feedback.html',
				controller: 'feedbackController',
				controllerAs: 'vm',
				accesslevel: '2',
			})
			.state('suggestCity', {
				url: '/suggestCity',
				title: 'Suggest city',
				templateUrl: 'frontend/home/suggestCity.html',
				controller: 'suggestCityController',
				controllerAs: 'vm',
				accesslevel: '2',
			})
			.state('suggestCategory', {
				url: '/suggestCategory',
				title: 'Suggest category',
				templateUrl: 'frontend/home/suggestCategory.html',
				controller: 'suggestCategoryController',
				controllerAs: 'vm',
				accesslevel: '2',
			})
			.state('forbidden', {
				url: '/forbidden',
				title: 'Forbidden',
				templateUrl: 'frontend/home/forbidden.html',
				accesslevel: '1',
			})
			.state('suggestCR', {
				url: '/suggestCR',
				title: 'Apply for city representative',
				templateUrl: 'frontend/home/suggestCR.html',
				controller: 'suggestCRController',
				controllerAs: 'vm',
				accesslevel: '2',
			})
			$urlRouterProvider.otherwise( '/');

	}
	
	function routeInterceptor ($rootScope, $state){
		$rootScope.$on('$stateChangeStart', function(event, toState){
			var user = null;
			if(localStorage.getItem('user')){
				var user = JSON.parse(localStorage.getItem('user'));
			};
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
                $state.go('forbidden');
            }
		});
		$rootScope.$on('$stateChangeSuccess', function(event, toState) {
			//changes title of the page | adds number of unseen notifications in brackets for logged in users
			$rootScope.title = (toState && toState.title) ? toState.title : 'Fix Your City';
			if($rootScope.numofnotif && $rootScope.authenticated) $rootScope.title+=' (' + $rootScope.numofnotif + ')';
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