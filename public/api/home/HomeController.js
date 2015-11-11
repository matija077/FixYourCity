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
			
		}
		
	}
})();