(function(){
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('navbarController', navbarController);
	
	function navbarController($sce){
		var vm = this;
		vm.renderTab=renderTab;
		
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
					innerDesc: 'Google<sup> Angular</sup>',
				},
				{
					url: 'https://github.com/matija077/FixYourCity',
					target: '_blank',   
					icoSrc: 'https://github.com/fluidicon.png',
					innerDesc: 'GitHub<sup> FixYourCity</sup>', 															
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
					innerDesc: 'Laravel<sup> Documentation</sup>',																
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
					icoSrc: '',
					innerDesc: 'About',
				},
				
		/*
		*
		*		GENERIC TEMPLATE FOR TABS
		*		icoSrc is '#' sign
		*		target '' (empty) or '_blank'
		*
		
				{
					url: '',
					target: '',   
					icoSrc: '',
					innerDesc: '',
				},
		
		*	
		*/
				];
			/*
			* END OF TABS
			*/
		
		
		function renderTab(tab){     //called for each tab in navbar from html using ng-repeat
			var retval=''; 
			
			retval='<a href="'+tab.url+'" target="'+tab.target+'">';			
			if(tab.icoSrc){
				retval+='<img width="16px" height="16px" src="'+tab.icoSrc+'"/>';
			}			
			retval+=' '+tab.innerDesc+'</a>';
						
			return $sce.trustAsHtml(retval);    // 'accepts' it as a html code
		}
		
	}

})();