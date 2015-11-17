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
		vm.filterCities = filterCities;
		
		activate();
		
		function activate(){
			getCities();
			
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