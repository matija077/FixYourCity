(function(){
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('navbarController', navbarController);
		
	navbarController.$inject = ['$sce', '$auth', 'dataservice', '$rootScope', '$interval', '$timeout'];
	
	function navbarController($sce, $auth, dataservice, $rootScope, $interval, $timeout){
		var vm = this;
		vm.email = '';
		vm.password = '';
		vm.notifications = [];
		vm.numberOfNotifications = 0;
        vm.intervalFirstPass = true;
		vm.seen = true;
        vm.timeNotif = 0;
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
					url: '#/about',
					target: '',  
					icoSrc: '',
					innerDesc: 'About',
				},
				];
			//END OF TABS
		
		activate();
		
		function activate(){
			//we're checking if user is logged in on every refresh or pageload
			//required when users token has expired and we need to clear his login 
			dataservice.getUser().getUser().$promise
				.then(function(userData){
					//console.log(userData);
					if(userData.data[0]=="error"){
						localStorage.removeItem('user');
						$rootScope.authenticated = false;
						$rootScope.role = '1';
						$rootScope.userName = "";
						return;
					};
					//local storage accepts only string pairs
					//add user to local storage
					localStorage.setItem('user', JSON.stringify(userData.data.user));
					$rootScope.authenticated = true;
					$rootScope.role = userData.data.user.accesslevel;
					$rootScope.userName = userData.data.user.username;
					//get notifications only if user is logged in
                    if (vm.intervalFirstPass==true)
                    {
                        getNotifications(userData.data.user.iduser);
                        vm.intervalFirstPass = false;
                    }
                    var intervalNotif = $interval(function(){
                        if (JSON.parse(localStorage.getItem('user'))==null || localStorage.getItem('satellizer_token')==null)
                        {    
                            $interval.cancel(intervalNotif);
                            return;
                        }
                        getNotifications(userData.data.user.iduser);
                    }, 10000);

					/*
					dataservice.reload();
					activate(); //loads navbar again (notifications)
					//console.log($rootScope.role);
					*/
				})
				.catch(function(userDataError){
					//console.log('error retriving');
				});
			
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
						dataservice.reload();
						activate();
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
		
		function getNotifications(userid){
			//currently only called when (re)loading page. clears any existing notifications!
			vm.notifications = [];
			vm.numberOfNotifications = 0;
			dataservice.getNotifications(userid).getNotifications().$promise
				.then(function(data){
					if(data.data!="No new notifications"){
						angular.forEach(data.data, function(value, key){
							vm.notifications.push(value);
							vm.numberOfNotifications++;
						});
					vm.seen = false;
					$rootScope.numofnotif = vm.numberOfNotifications;
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
						$rootScope.numofnotif = 0;
						//we do not clear notifications because they might be opened again
					};
				});
		}
		
		function showNotifs(){
            //console.log(vm.notifshow, vm.seen);
            //we need to detect if notification button is pressed while timer is still going.
            //if that's the c
            if (vm.notifshow=="timeoutTime")
            {
                $timeout.cancel(vm.timeNotif);
                vm.notifshow = false;
            }
			if(vm.notifshow){
                vm.fade = "fadeOut";
                vm.timeNotif = $timeout(function(){
                   vm.notifshow = false;
                }, 500);
                vm.notifshow = "timeoutTime";
			}else{
				vm.notifshow = true;
				vm.seen = true;
                vm.fade = "fadeIn";
			}
		};
        
	}

})();