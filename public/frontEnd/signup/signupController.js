(function(){
	'use strict';
	
	angular
		.module('FixYourCityApp')
		.controller('signupController', signupController);
		
	signupController.$inject = ['dataservice', '$timeout', '$interval'];
	
	function signupController(dataservice, $timeout, $interval){
		var vm = this;
		var user = {
			username: '',
			email: '',
			password: '',
			retypePassword: '',
		}
		/* check status:
		* 0 - expecting more input
		* 1 - any error
		* 2 - input approved
		* 3 - waiting for server response (checking availability)
		*/
		var check = {
			username: 0, //status
			usernameHas: '', //sets class
			email: 0,
			emailHas: '',
			password: 0,
			passwordHas: '',
			retypePassword: 0,
			retypeHas: '',
			complete: 0,
			timeusername: 0, //holds id of $timeout for checking username
			emailtime: 0, // ^for email
			success: 0, //determines successful registration
			countdown: 5, //duration before user is redirected to homepage
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
			dataservice.signUp().save(user).$promise
				.then(function(resource){
					//console.log(resource);
					if(resource.success){
						vm.check.success=1;
						var tmp = $interval(function(){
							vm.check.countdown--;
							},1000);
						$timeout(function(){
							$interval.cancel(tmp);
							dataservice.goPath('home');
						},5000);
					};
					
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
			//resetting completion status immediately rather than 1.5s later in some cases
			vm.check.complete=0;
			
			/* time constraint to prevent spam of username check calls to server for each char
			* after each char we clear queued execution of previous username entry, and set a new one
			*/
			$timeout.cancel(check.timeusername);
			check.timeusername = $timeout(function(){
				// do not execute if username isn't at least 2 characters long
				if(user.username.length>1){
					vm.check.username=3;
					vm.check.usernameHas='has-warning';
					dataservice.checkUsername(user.username).check().$promise
						.then(function(data){
							if(data.data=='1'){
								vm.check.username=2;
								vm.check.usernameHas='has-success';
								isFormComplete();
							}else{
								vm.check.username=1;
								vm.check.usernameHas='has-error';
							};
						});
				};
			},1500); //wait 1.5s after last char entry
		};
		
		function changeEmail(){
			check.email=0;
			check.emailHas='';
			vm.check.complete=0;
			
			$timeout.cancel(check.emailtime);
			check.emailtime = $timeout(function(){
				//if we're (kinda) sure email has been entered, database is queried, else it isn't email - error feedback
				if(user.email.indexOf('@')>0 && user.email.lastIndexOf('.')-user.email.indexOf('@')>0){
					vm.check.email=3;
					vm.check.emailHas='has-warning';
					dataservice.checkEmail(user.email).check().$promise
						.then(function(data){
							//console.log(data);
							if(data.data=='1'){
								vm.check.email=2;
								vm.check.emailHas='has-success';
								isFormComplete();
							}else{
								vm.check.email=1;
								vm.check.emailHas='has-error';
							};
						});
				}else{
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












