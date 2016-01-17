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
		vm.seen = true;
		vm.renderTab=renderTab;
		vm.login = login;
		vm.signUp = signUp;
		vm.logout = logout;
		vm.goPath = goPath;
		vm.seenNotifications = seenNotifications;
		vm.showNotifs=showNotifs;
		vm.notifshow = false;
		
		vm.tabs=[
			//BEGIN TABS
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
					url: '#/about',
					target: '',  
					icoSrc: '',
					innerDesc: 'About',
				},
				];
			/*
			* END OF TABS
			*/
		
		activate();
		
		function activate(){
			getNotifications();
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
				//console.log(credentials);
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
								//console.log($rootScope.role);
							})
							.catch(function(userDataError){
								//console.log('error retriving');
							});
					})
					.catch(function(data) {
						//console.log(data + 'error');	
					});
			}
		}
		
		function signUp(){
			dataservice.goPath('signup',-1); //-1 = no parameters
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
        
        function goPath(state,num){
			var params = "";
			if(num>0){ //specifically for calling from notification window - redirects to /problem/id
				showNotifs();
				params = {'id':num};
			};
            dataservice.goPath(state, params);
        }
		
		function getNotifications(){
			var userid = JSON.parse(localStorage.getItem('user')).iduser;
			if(typeof userid == 'undefined' || !userid){
				return;
			};
			dataservice.getNotifications(userid).getNotifications().$promise
				.then(function(data){
					if(data.data!="No new notifications"){
						angular.forEach(data.data, function(value, key){
							vm.notifications.push(value);
							vm.numberOfNotifications++;
						});
					vm.seen = false;
					//console.log(vm.notifications);  
					};
				})
				.catch(function(data){
				//console.log(data, vm.seen);
				});
		}
        
        function seenNotifications(){
			showNotifs();
			dataservice.getNotifications(JSON.parse(localStorage.getItem('user')).iduser).hasSeenNotifications().$promise
				.then(function(data){
					if(data.$resolved){
						vm.numberOfNotifications = 0;
						//we do not clear notifications because they might be opened again
					};
				});
		}
		
		function showNotifs(){
			if(vm.notifshow){
				vm.notifshow=false;
			}else{
				vm.notifshow=true;
				vm.seen = true;
			}
		};
	}

})();