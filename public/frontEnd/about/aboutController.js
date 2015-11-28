(function(){
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('aboutController', aboutController);
	
	/*
	*
	* DOES NOT accept HTML tags, only plaintext
	* 
	* TO DO: extend with $sce for HTML tag rendering: check 'navbarController.js' 
	*
	*/
	
	function aboutController(){
		var vm = this;
		vm.setTitle=setTitle;
		vm.setInnerText=setInnerText;
		
		
		setTitle();
		setInnerText();
		
		
		function setTitle(){
			vm.title="About";
		}
		
		function setInnerText(){
			vm.innerText="About page text!";
		}
		
	}
	
})();