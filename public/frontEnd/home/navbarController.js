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
		/*
		vm.activeAbout=activeAbout;
		vm.hoverAbout=hoverAbout;
		*/
		
		vm.tabs=[
			//BEGIN TABS
			// NOTE: , INSTAD OF ;
				{
					url: 'http://localhost/FixYourCity/public/#/',
					target: '',  
					icoSrc: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Number_sign.svg',
					innerDesc: 'Home',
				},
				{
					url: 'https://www.google.com/?q=angular',
					target: '_blank',  
					icoSrc: 'https://www.google.hr/images/branding/product/ico/googleg_lodp.ico',
					innerDesc: 'Google (q=angular)',															/*<sup> Angular</sup>', */   //html render, $sce ? angular-sanitize ?
				},
				{
					url: 'https://github.com/matija077/FixYourCity',
					target: '_blank',   
					icoSrc: 'https://github.com/fluidicon.png',
					innerDesc: 'GitHub (FixYourCity)', 															/*'<sup> FixYourCity</sup>',*/
				},
				{
					url: 'https://github.com/johnpapa/angular-styleguide#table-of-contents',
					target: '_blank', 
					icoSrc: 'https://github.com/fluidicon.png',
					innerDesc: 'Styleguide',
				},
				{
					url: 'http://laravel.com/docs/5.1/',
					target: '_blank',  
					icoSrc: 'http://laravel.com/favicon.png',
					innerDesc: 'Laravel (Doc)',																	/*<sup> Documentation</sup>',*/
				},
				{
					url: 'http://getbootstrap.com/components/',
					target: '_blank',   
					icoSrc: 'http://getbootstrap.com/favicon.ico',
					innerDesc: 'Bootstrap',
				},
				{
					url: 'http://localhost/FixYourCity/public/#/',
					target: '',  
					icoSrc: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Number_sign.svg',
					innerDesc: 'About',
				},
				
		/*
		*
		*		GENERIC TEMPLATE FOR TABS
		*		icoSrc is '#' sign
		*		target '' (empty) or '_blank'
		*
		*
		
				{
					url: '',
					target: '',   
					icoSrc: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Number_sign.svg',
					innerDesc: '',
				},
		
		*
		*	
		*/
				];
			/*
			*
			* END OF TABS
			*
			*/
		
		
		
		
		
		//activeAbout();
		
		/*
		function hoverAbout(){
			vm.InnerAbout="Fake link";
		}
		
		function activeAbout(){
			vm.InnerAbout="About";
		}
		*/
		
	}

})();