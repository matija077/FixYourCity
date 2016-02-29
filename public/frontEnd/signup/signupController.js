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
			accesslevel: '2', //this shouldn't be assigned here
			karma: '1'
		}
		/* check codes:
		* 0 - expecting more input
		* 1 - any error
		* 2 - input approved
		*/
		var check = {
			username: 0,
			usernameHas: '',
			email: 0,
			emailHas: '',
			password: 0,
			passwordHas: '',
			retypePassword: 0,
			retypeHas: '',
			complete: 0,
		}
		vm.user = user;
		vm.check = check;
		vm.signUp = signUp;
		vm.changeRetype = changeRetype;
		vm.changePassword = changePassword;
		vm.changeUsername = changeUsername;
		vm.changeEmail = changeEmail;
		vm.isFormComplete = isFormComplete;
		
		
		
		function signUp(){
				return dataservice.signUp().save(user).$promise
					.then(function(resource){
						console.log(resource);
						dataservice.goPath('home');
					})
					.catch(function(data){
						console.log('error :', data);
					});
		}
		
		function changeRetype(){
			if(!user.retypePassword.length || user.retypePassword.length<user.password.length){
				check.retypePassword=0;
				vm.check.retypeHas='';
			}else if(user.password!=user.retypePassword){
				check.retypePassword=1;
				vm.check.retypeHas='has-error';
			}else{
				check.retypePassword=2;
				vm.check.retypeHas='has-success';
			};
			isFormComplete();
		};
		
		function changePassword(){
			changeRetype();
			//this should also check only when focus is lost
			if(user.password.length<6){
				check.password=1;
				check.passwordHas='has-error';
			}else{
				check.password=2;
				check.passwordHas='has-success';
			};
			isFormComplete();
			
		};
		
		function changeUsername(){
			if(user.username.length<2){
				vm.check.username=0;
				vm.check.usernameHas='';
			}else{
				//TODO: check if username is free
				//time constraint to prevent spam on each key? (wait x time after last key)
				vm.check.username=2;
				vm.check.usernameHas='has-success';
			};
			isFormComplete();
		};
		
		function changeEmail(){
			
			//make it check this only after it lost focus?
			if(user.email.indexOf('@')==-1 || user.email.lastIndexOf('.')-user.email.indexOf('@')<=0){
				check.email=0;
				check.emailHas='';
			}else{
				//TODO: check if email is available
				check.email=2;
				check.emailHas='has-success';
			};
			isFormComplete();
		};
		
		function isFormComplete(){
			if(check.username==2 && check.email==2 && check.password==2 && check.retypePassword==2){
				check.complete=1;
			}else{
				check.complete=0;
			};
		};
	}
})();












