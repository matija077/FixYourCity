(function(){
	'use strict';
	
	angular
		.module('FixYourCityApp')
		.controller('signupController', signupController);
		
	signupController.$inject = ['dataservice'];
	
	function signupController(dataservice){
		var vm = this;
		var user = {
			username: '',
			email: '',
			password: '',
			retypePassword: '',
			accesslevel: '2',
			karma: '1'
		}
		var error = {
			username: 0,
			email: 0,
			password: 0,
			retypePassword: 0,
		}
		vm.user = user;
		vm.error = error;
		vm.signUp = signUp;
		vm.errorCheck = errorCheck;
		
		
		
		function signUp(){
		if (errorCheck()!=1){	
				return dataservice.signUp().save(user).$promise
					.then(function(resource){
						console.log(resource);
						//TODO: login();
						dataservice.goPath('home');
						
					})
					.catch(function(data){
						console.log('error :', data);
					});
	
		}
		}	
		//check for empty inputs and password dont mach
		function errorCheck(){
			var errorExists = 0;
			vm.error.username = 0;
			vm.error.email = 0;
			vm.error.password = 0;
			vm.error.retypePassword = 0;
			
			if (vm.user.username==''){
				vm.error.username = 1;
				errorExists = 1;
			}
			if (vm.user.email=='') {
				vm.error.email = 1;
				errorExists = 1;
			}
			//first check password dont mach, then check if one is empty 
			if (vm.user.password!=vm.user.retypePassword){
				vm.error.password = 2;
			    vm.error.retypePassword = 2;
				errorExists = 1;
			}
			if (vm.user.password=='') {
				vm.error.password = 1;
				errorExists = 1;
			}
			if (vm.user.retypePassword=='') {
				vm.error.retypePassword = 1;
				errorExists = 1;
			}
			
			return errorExists;
		}
	}
})();












