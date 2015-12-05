(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('submitissueController', submitissueController);
		
		submitissueController.$inject = ['dataservice', '$routeParams'];
		
	function submitissueController(dataservice, $routeParams){
		var vm = this;
		var problem = {
			iduser: '',
			idcity : '',
			idcategory : '',
			address : '',
			text : '',
		};
		
		vm.city = [];
		vm.category = [];
		vm.address='';
		vm.sent=false;
		
		vm.getCity = getCity;
		vm.getCategory = getCategory;
		vm.submitissue = submitissue;
		vm.init = init;
		
		init();
		
		function init(){
			vm.city = getCity();
			vm.category = getCategory();
		};
		
		
		
		function getCity(){
			return dataservice.getCities().getCity({id:$routeParams.idcity});
		};
		
		function getCategory(){
			return dataservice.getCategories().getCategory({id:$routeParams.idcategory});
		};
		
		function submitissue(){
			problem.iduser=1;
			problem.idcity=vm.city.idcity;
			problem.idcategory=vm.category.idcategory;
			problem.address=vm.address;
			problem.text=vm.text;
			vm.sent=true;
			return dataservice.submitProblem().save(problem);
		};
	
	
	
		//vm.city=$routeParams.idcity;
		//vm.category=dataservice.getCategories().getCategory($routeParams.idcategory);
		/*
		function getCity(){
			return dataservice.getCities().getCity().$promise
				.then(function(city){
					console.log(city);
					return vm.city = city;
				})
		};
		
		
		/*
		var vm = this;
		vm.city = [];
		
		activate();
		
		function activate(){
			getCity();
		}
		
		function getCity(){
			//dataservice.getCity().query().$promise
			return dataservice.getCities().getCity().$promise
			//dataservice.getCity()
				.then(function(city){
					console.log(city);
					return vm.city = city;
				})
		}
		*/
	}
})();