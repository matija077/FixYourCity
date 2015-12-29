(function(){
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('navbarController', navbarController);
		
	navbarController.$inject = ['$sce', '$auth', 'dataservice', '$rootScope'];
	
	function navbarController($sce, $auth, dataservice, $rootScope){
		var vm = this;
		vm.email = '';
		vm.password = '';
		vm.notifications = [];
		vm.numberOfNotifications = 0;
        vm.seen = false;
		vm.renderTab=renderTab;
		vm.login = login;
		vm.signUp = signUp;
		vm.logout = logout;
        vm.seenNotifications = seenNotifications;
		
		vm.tabs=[
			//BEGIN TABS
			// NOTE: , INSTAD OF ;
				{
					url: '#/',
					target: '',  
					icoSrc: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Number_sign.svg',
					innerDesc: 'Home',
				},
				{
					url: 'https://www.google.com/?q=angular',
					target: '_blank',  
					icoSrc: 'https://www.google.hr/images/branding/product/ico/googleg_lodp.ico',
					innerDesc: 'Google<sup> Angular</sup>',
				},
				{
					url: 'https://github.com/matija077/FixYourCity',
					target: '_blank',   
					icoSrc: 'https://github.com/fluidicon.png',
					innerDesc: 'GitHub<sup> FixYourCity</sup>', 															
				},
				{
					url: 'https://github.com/johnpapa/angular-styleguide#table-of-contents',
					target: '_blank', 
					icoSrc: 'https://github.com/fluidicon.png',
					innerDesc: 'Styleguide',
				},
				{
					url: 'http://laravel.com/docs/5.1/',
					target: '_blank',  
					icoSrc: 'http://laravel.com/favicon.png',
					innerDesc: 'Laravel<sup> Documentation</sup>',																
				},
				{
					url: 'http://getbootstrap.com/components/',
					target: '_blank',   
					icoSrc: 'http://getbootstrap.com/favicon.ico',
					innerDesc: 'Bootstrap',
				},
				{
					url: '#/about',
					target: '',  
					icoSrc: '',
					innerDesc: 'About',
				},
				
		/*
		*
		*		GENERIC TEMPLATE FOR TABS
		*		target '' (empty) or '_blank'
		*
		
				{
					url: '',
					target: '',   
					icoSrc: '',
					innerDesc: '',
				},
		
		*	
		*/
				];
			/*
			* END OF TABS
			*/
		
		activate();
		
		function activate(){
			getNotifications();	
			var localStorageNotifications = localStorage.getItem('notifications');
			var localStorageNotificationsCounter = localStorage.getItem('notifications counter');
			if (localStorageNotifications!=null){
				vm.notifications = localStorageNotifications;
			}
			if (localStorageNotificationsCounter!=null){
				vm.numberOfNotifications = localStorageNotificationsCounter;
			}
		}
		
		function renderTab(tab){     //called for each tab in navbar from html using ng-repeat
			var retval=''; 
			
			retval='<a href="'+tab.url+'" target="'+tab.target+'">';			
			if(tab.icoSrc){
				retval+='<img width="16px" height="16px" src="'+tab.icoSrc+'"/>';
			}			
			retval+=' '+tab.innerDesc+'</a>';
						
			return $sce.trustAsHtml(retval);    // 'accepts' it as a html code
		}
				
		function login(){
			if ((vm.email!='') && (vm.password!='')){
				var credentials = {
					email : vm.email,
					password : vm.password,
				}
				console.log(credentials);
				// Use Satellizer's $auth service to login
				$auth.login(credentials)
					.then(function(data) {
						dataservice.getUser().getUser().$promise
							.then(function(userData){
								//local storage accepts only string pairs
								//add user to local storage
								localStorage.setItem('user', JSON.stringify(userData.data.user));
								//needed for ng-if
								$rootScope.authenticated = true;
								$rootScope.role = userData.data.user.accesslevel;
								$rootScope.userName = userData.data.user.username;
								//load data agian
								dataservice.reload();
								console.log($rootScope.role);
							})
							.catch(function(userDataError){
								console.log('error retriving');
							});
					})
					.catch(function(data) {
						console.log(data + 'error');	
					});
			}
		}
		
		function signUp(){
			dataservice.goPath('signup');
		}
		
		function logout(){
			$auth.logout().then(function() {	
				localStorage.removeItem('user');
				
                $rootScope.authenticated = false;
				$rootScope.role = '1';
				$rootScope.userName = "";
				
				dataservice.reload();
			});
		}
		
		function getNotifications(){
            var userid;
            var array = [];
            //array is needed because vm.notifications is actually not a variable.
            userid = JSON.parse(localStorage.getItem('user'));
            //if there is no user authenticated, we are still making a call to backend.
            console.log(userid);
            if (userid!=null){
                userid = userid.iduser;
            }else{
                userid = 0;
            }
            dataservice.getNotifications(userid).getNotifications().$promise
                .then(function(data){
                    //we are saving notifications and number of notifications
                    angular.forEach(data.data, function(value, key){
                        //javascript considers this variable as string, so parsing is needed
                        vm.numberOfNotifications = parseInt(vm.numberOfNotifications, 10) + 1;
                        vm.numberOfNotifications = parseInt(vm.numberOfNotifications, 10);
                        //new notifications are prepended.
                        array.unshift(value)
                    })
                    vm.notifications = array.concat(vm.notifications);
                    localStorage.setItem('notifications', vm.notifications);
                    localStorage.setItem('notifications counter', vm.numberOfNotifications);
                    //if there are new notifications we need to tell user about that
                    vm.seen = false;
                    console.log(data);              
                })
                .catch(function(data){
                    console.log(data);
                });
        }
        
        function seenNotifications(){
            //we have seen notifications, so we will remove everything.
            localStorage.removeItem('notifications');
            localStorage.removeItem('notifications counter');
            vm.notifications = [];
            vm.numberOfNoticiations = 0;
            vm.seen = true;
        }
		
	}

})();