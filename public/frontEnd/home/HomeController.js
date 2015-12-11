(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('HomeController', HomeController);
		
		HomeController.$inject = ['dataservice', '$auth', '$rootScope', '$state'];
		
	function HomeController(dataservice, $auth, $rootScope, $state){
		var vm = this;
		vm.cities = [];
		vm.citiesToShow = [];
		vm.categories = [];
		vm.categoriesToShow = [];
		var credentials = {
                /*email: vm.email,
                password: vm.password*/
				email: 'ryanchenkie7@gmail.com',
				password: 'secret'
        }
		var user = {
			username: 'yolo2',
			email: 'ryanchenkie10@gmail.com',
			password: 'secret',
			accesslevel: '1',
			karma: '50'
		}
		vm.filterCities = filterCities;
		vm.filterCategories = filterCategories;
		vm.insertCity=insertCity;
		vm.selectCity=selectCity;
		vm.selectedcity;
		vm.selectCategory=selectCategory;
		vm.selectedcategory;
		vm.proceedSubmit=proceedSubmit;
		vm.login = login;
		vm.signUp = signUp;
		vm.logout = logout;
		
		activate();
		
		function activate(){
			getCities();
			getCategories();
			
		}
		
		function getCities(){
			return dataservice.getCities().getAll().$promise
				.then(function(resource){
					vm.citiesToShow = resource.data;
					return vm.cities = resource.data;
				});
		}
		
		function getCategories(){
			return dataservice.getCategories().getAll().$promise
				.then(function(resource){
					vm.categoriesToShow = resource.data;
				    vm.categories = resource.data;
				});
		}
		
		function filterCities(inputCityName){
			vm.citiesToShow = [];
			vm.cities.forEach(function(element) {
				if (element.cityname.indexOf(inputCityName)!=-1){
					vm.citiesToShow.push(element);
				}
			});
		}
		
		function filterCategories(inputCategoryName){
			vm.categoriesToShow = [];
			vm.categories.forEach(function(element) {
				if (element.ctgname.indexOf(inputCategoryName)!=-1){
					vm.categoriesToShow.push(element);
				}
			});
			console.log(vm.categoriesToShow);
		} 
		
		function login(){
            // Use Satellizer's $auth service to login
            $auth.login(credentials)
				.then(function(data) {
					dataservice.getUser().getUser().$promise
						.then(function(userData){
							//local storage accepts only string pairs7
							//add user to local storage
							localStorage.setItem('user', JSON.stringify(userData.data.user));
							//needed fro  ng-if
							$rootScope.authenticated = true;
							//load data agian
							$state.reload();
						})
						.catch(function(userDataError){
							console.log('error retriving');
						});
				})
				.catch(function(data) {
					console.log(data + 'error');	
				});
		}
		
		function signUp(){
			return dataservice.signUp().save(user).$promise
				.then(function(resource){
					console.log(resource);
				});
		}
		
		function logout(){
			$auth.logout().then(function() {	
				localStorage.removeItem('user');
				
                $rootScope.authenticated = false;
				
				$state.reload();
			});
		}
		
		function insertCity(){
			var citytoinsert={
				cityname: vm.cityname,
				state : vm.state,
			};
			dataservice.insertCity().save(citytoinsert);
		}
		
		function selectCity(param){
			vm.selectedcity=param;
		}
		
		function selectCategory(param){
			vm.selectedcategory=param;
		}
	
		function proceedSubmit(idcity,idcategory){
			//dataservice.goPath('/submit/'+idcity+'/'+idcategory);
			$state.go('submit', {"idcity": idcity, "idcategory": idcategory});
		}
		
		
	}
})();