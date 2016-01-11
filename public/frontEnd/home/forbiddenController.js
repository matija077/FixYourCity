(function(){
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('forbiddenController', forbiddenController);

		//forbiddenController.$inject = ['dataservice'];

	function forbiddenController(dataservice){
		 var vm = this;
		 vm.url = "http://i.imgur.com/Y3jSzRg.png";
	}
	
})();