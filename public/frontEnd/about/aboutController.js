(function(){
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('aboutController', aboutController);
	
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