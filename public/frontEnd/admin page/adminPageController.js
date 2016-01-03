(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('AdminPageController', AdminPageController);
		
		AdminPageController.$inject = ['dataservice'];
		
	function AdminPageController(dataservice){
		var vm = this;
		
		activate();
		
		function activate(){
		}
		
	}
})();