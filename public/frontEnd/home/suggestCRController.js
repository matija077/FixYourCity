(function(){
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('suggestCRController', suggestCRController);

		suggestCRController.$inject = ['dataservice'];

	function suggestCRController(dataservice){
		var vm = this;
		vm.citiesToShow = [];
		vm.cities=[];
		vm.selectedcity;
		vm.filterCities = filterCities;
		vm.selectCity=selectCity;
		vm.suggestCR = suggestCR;
		vm.getCities = getCities;
	
		activate();
		
		function activate(){
			getCities();	
		}
		
		function getCities(){
			return dataservice.getCities().getAll().$promise
				.then(function(resource){
					vm.citiesToShow = resource.data;
					vm.cities = resource.data;
				});
		}
		
		function filterCities(inputCityName){
			vm.citiesToShow = [];
			vm.cities.forEach(function(element) {
				if (angular.lowercase(element.cityname).indexOf(angular.lowercase(inputCityName))!=-1){
					vm.citiesToShow.push(element);
				};
			});
		}

		function selectCity(param){
			if(vm.selectedcity!=param){
				vm.selectedcity=param;
			}
		}

		function suggestCR(){
			var user = JSON.parse(localStorage.getItem("user"));
			var toSuggest={
				idcity : vm.selectedcity,
				iduser : user.iduser,
				text : vm.comment,
			};
			dataservice.suggestCR().save(toSuggest).$promise
				.then(function(data){
					//console.log(data);
				});
		}

	}
	
})();