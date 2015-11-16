(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('CityDetailController', CityDetailController);
		
		CityDetailController.$inject = ['dataservice', '$routeParams'];
		
	function CityDetailController(dataservice, $routeParams){
		var vm = this;
		vm.city = [];
		
		activate();
		
		function activate(){
			getCity();
			console.log(vm.city);
		}
		
		function getCity(){
			//dataservice.getCity().query().$promise
			return dataservice.getCities().getCity().$promise
			//dataservice.getCity()
				.then(function(city){
					console.log(city);
					return vm.city = city[0];
				})
		}
	}
})();