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
		vm.filterCategories = filterCategories;
		vm.insertCity=insertCity;
		vm.selectCity=selectCity;
		vm.selectedcity;
		vm.selectCategory=selectCategory;
		vm.selectedcategory;
		vm.proceedSubmit=proceedSubmit;
		
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
			dataservice.goPath('/submit/'+idcity+'/'+idcategory);
		}
		
		
	}
})();