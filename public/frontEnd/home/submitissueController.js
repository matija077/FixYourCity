(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('submitissueController', submitissueController);
		
		submitissueController.$inject = ['dataservice', '$routeParams'];
		
	function submitissueController(dataservice, $routeParams){
		var vm = this;
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
			var problem = {
				iduser: '1',
				idcity : vm.city.idcity,
				idcategory : vm.category.idcategory,
				address : vm.address,
				text : vm.text,
			};
			vm.sent=true;
			dataservice.submitProblem().save(problem);
			// error check before vm.sent=true?
		};
		
		
		
	}
})();