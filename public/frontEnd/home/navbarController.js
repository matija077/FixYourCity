(function(){
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('navbarController', navbarController);
	
	/*
	*
	*	TESTING
	*
	*/
	
	function navbarController(){
		var vm = this;
		vm.active=active;
		vm.hover=hover;
		
		
		//value('txt','beg');
		
		
		
		active();
		
		
		function hover(){
			vm.txt="HOVER";
		}
		
		function active(){
			vm.txt="fake link";
		}
		
		//	return vm;
	}

})();