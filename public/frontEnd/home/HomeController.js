(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('HomeController', HomeController);
		
		HomeController.$inject = ['dataservice'];
		
	function HomeController(dataservice){
		var vm = this;
		vm.cities = [];
		
		activate();
		
		function activate(){
			getCities();
		}
		
		function getCities(){
			//return dataservice.getCities().query().$promise
			return dataservice.getCities().getAll().$promise
				.then(function(data){
					return vm.cities = data;
				});
			//return dataservice.getCities().
		}
	}
})();