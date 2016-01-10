(function(){
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('suggestCategoryController', suggestCategoryController);

		suggestCategoryController.$inject = ['dataservice'];

	function suggestCategoryController(dataservice){
		var vm = this;
		vm.hajdaj = false;
		vm.showaj = false;
		vm.suggestCategory=suggestCategory;
		

		function suggestCategory(){
			vm.hajdaj = true;
			vm.showaj = true;
			var user = JSON.parse(localStorage.getItem("user"));
			var enteredCategory={
				iduser : user.iduser,
				suggestcategoryname : vm.suggestCategoryName,
			};
			dataservice.suggestCategory().save(enteredCategory);
		}

	}
	
})();