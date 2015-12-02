(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('HomeController', HomeController);
		
		HomeController.$inject = ['dataservice', '$auth'];
		
	function HomeController(dataservice, $auth){
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
		vm.filterCities = filterCities;
		vm.filterCategories = filterCategories;
		vm.login = login;
		
		activate();
		
		function activate(){
			getCities();
			getCategories();
			
		}
		
		function getCities(){
			//return dataservice.getCities().query().$promise
			return dataservice.getCities().getAll().$promise
				.then(function(resource){
					console.log(resource);
					vm.citiesToShow = resource.data;
					return vm.cities = resource.data;
				});
			//return dataservice.getCities().
		}
		
		function getCategories(){
			return dataservice.getCategories().getAll().$promise
				.then(function(resource){
					console.log(resource);
					vm.categoriesToShow = resource.data;
				    vm.categories = resource.data;
					console.log(vm.categories);
				});
		}
		
		function filterCities(inputCityName){
			vm.citiesToShow = [];
			vm.cities.forEach(function(element) {
				console.log(element);
				if (element.cityname.indexOf(inputCityName)!=-1){
					vm.citiesToShow.push(element);
				}
			});
			console.log(vm.citiesToShow);
		}
		
		function filterCategories(inputCategoryName){
			vm.categoriesToShow = [];
			console.log(vm.categories);
			vm.categories.forEach(function(element) {
				console.log(element, inputCategoryName);
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
					console.log('in');
				})
				.catch(function(data) {
					console.log(data + 'error');	
				});
		}
	}
})();