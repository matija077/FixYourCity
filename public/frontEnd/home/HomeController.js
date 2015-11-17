(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('HomeController', HomeController);
		
		HomeController.$inject = ['dataservice'];
		
	function HomeController(dataservice){
		var vm = this;
		vm.cities = [];
		vm.citiesToShow = [];
		vm.categories = [];
		vm.categoriesToShow = [];
		vm.filterCities = filterCities;
		
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
					return vm.categories = resource.data;
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
	}
})();