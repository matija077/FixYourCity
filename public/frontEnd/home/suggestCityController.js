(function(){
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('suggestCityController', suggestCityController);

		suggestCityController.$inject = ['dataservice'];

	function suggestCityController(dataservice){
		var vm = this;
		vm.hajdaj = false;
		vm.showaj = false;
		vm.showUSA = false;
		vm.suggestCity=suggestCity;
		vm.usa=usa;

		
		function suggestCity(){
			vm.hajdaj = true;
			vm.showaj = true;
			var user = JSON.parse(localStorage.getItem("user"));
			var suggestedcity={
				iduser : user.iduser,
				suggestcityname: vm.suggestCityValue,
				suggeststatename : vm.suggestStateValue,
			};
			dataservice.insertCity().save(suggestedcity);
		}

		function usa() {
			vm.isUSA = vm.suggestStateValue;
			if (vm.isUSA == "USA" || vm.isUSA == "usa") {
				vm.showUSA = true;
			} else {
				vm.showUSA=false;
			}
		}
	}
	
})();