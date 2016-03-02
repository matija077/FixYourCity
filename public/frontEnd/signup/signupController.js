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
			karma: '1'
		}
		/* check status:
		* 0 - expecting more input
		* 1 - any error
		* 2 - input approved
		* 3 - waiting for server response (checking availability)
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
			timeusername: 0, //holds id of settimeout for checking username
			emailtime: 0, // ^for email
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
			//tooltip message on error
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
			vm.check.username=0;
			vm.check.usernameHas='';
			/* time constraint to prevent spam of username check calls to server for each char
			* after each char we clear queued execution of previous username entry, and set a new one
			*/
			clearTimeout(check.timeusername);
			check.timeusername = setTimeout(function(){
				// do not execute if username isn't at least 2 characters long
				if(user.username.length>1){
					vm.check.username=3;
					vm.check.usernameHas='has-warning';
					dataservice.checkUsername(user.username).check().$promise
						.then(function(data){
							//console.log(data);
							if(data.data=='1'){
								vm.check.username=2;
								vm.check.usernameHas='has-success';
							}else{
								vm.check.username=1;
								vm.check.usernameHas='has-error';
							};
							isFormComplete();
						});
				};
			},1500); //wait 1.5s after last char entry
		};
		
		function changeEmail(){
			check.email=0;
			check.emailHas='';
			clearTimeout(check.emailtime);
			check.emailtime = setTimeout(function(){
				//if we're (kinda) sure email has been entered, database is queried, else it isn't email - error feedback | (else does not work consistently!)
				if(user.email.indexOf('@')>0 && user.email.lastIndexOf('.')-user.email.indexOf('@')>0){
					vm.check.email=3;
					vm.check.emailHas='has-warning';
					dataservice.checkEmail(user.email).check().$promise
						.then(function(data){
							//console.log(data);
							if(data.data=='1'){
								vm.check.email=2;
								vm.check.emailHas='has-success';
							}else{
								vm.check.email=1;
								vm.check.emailHas='has-error';
							};
							isFormComplete();
						});
				}else{
					// DOES NOT WORK PROPERLY
					// check.email does get updated in controller, but change isnt applied to view (html)
					check.email=1;
					check.emailHas='has-error';
				};
			},1500);
			
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












