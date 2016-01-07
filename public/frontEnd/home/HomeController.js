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
		vm.filterCities = filterCities;
		vm.filterCategories = filterCategories;
		vm.insertCity=insertCity;
		vm.selectCity=selectCity;
		vm.selectedcity;
		vm.selectCategory=selectCategory;
		vm.selectedcategory;
		vm.proceedSubmit=proceedSubmit;
		vm.getProblems=getProblems;
		vm.problems= [];
		vm.toggle=toggle;
		
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
				if (angular.lowercase(element.cityname).indexOf(angular.lowercase(inputCityName))!=-1){
					vm.citiesToShow.push(element);
				}
			});
		}
		
		function filterCategories(inputCategoryName){
			vm.categoriesToShow = [];
			vm.categories.forEach(function(element) {
				if (angular.lowercase(element.ctgname).indexOf(angular.lowercase(inputCategoryName))!=-1){
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
			dataservice.goPath('submit', {"idcity": idcity, "idcategory": idcategory});
		}
		
		function getProblems(idcity,idcategory){
			return dataservice.getProblems(idcity,idcategory).getAll().$promise
				.then(function(problems){
					console.log(problems.data);
					return vm.problems = problems.data;
				});
		}
		
		function toggle(problem,vote){
			if(typeof problem.voted == 'undefined') problem.voted=0;
			if(vote==1){
				switch(problem.voted) {
					case -1: {
						problem.votenegative-=1;
						problem.votepositive+=1;
						problem.voted=1;
						break;
					}
					case 0: {
						problem.votepositive+=1;
						problem.voted=1;
						break;
					}
					case 1: {
						problem.votepositive-=1;
						problem.voted=0;
						break;
					}
				}
			}else{
				switch(problem.voted){
					case -1: {
						problem.votenegative-=1;
						//problem.votepositive+=1;
						problem.voted=0;
						break;
					}
					case 0: {
						problem.votenegative+=1;
						problem.voted=-1;
						break;
					}
					case 1: {
						problem.votepositive-=1;
						problem.votenegative+=1;
						problem.voted=-1;
						break;
					}
				}
			}
		}
		
	}
})();