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
		vm.activeAbout=activeAbout;
		vm.hoverAbout=hoverAbout;
		
		
		activeAbout();
		
		
		function hoverAbout(){
			vm.InnerAbout="Fake link";
		}
		
		function activeAbout(){
			vm.InnerAbout="About";
		}
		
		
		
	}

})();