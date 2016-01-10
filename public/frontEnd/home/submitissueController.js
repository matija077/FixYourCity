(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('submitissueController', submitissueController);
		
		submitissueController.$inject = ['dataservice', '$stateParams', 'Upload'];
		
	function submitissueController(dataservice, $stateParams, Upload){
		var vm = this;
		vm.city = [];
		vm.category = [];
		vm.address='';
		vm.sent=false;
		
		vm.getCity = getCity;
		vm.getCategory = getCategory;
		vm.submitissue = submitissue;
		vm.init = init;
		vm.uploadFile = uploadFile;
		
		init();
		
		function init(){
			vm.city = getCity();
			vm.category = getCategory();
		};
		
		function getCity(){
			return dataservice.getCities().getCity({id:$stateParams.idcity});
		};
		
		function getCategory(){
			return dataservice.getCategories().getCategory({id:$stateParams.idcategory});
		};
		
		function submitissue(){
			var user = JSON.parse(localStorage.getItem("user"));
			var problem = {
				iduser: user.iduser,
				idcity : vm.city.idcity,
				idcategory : vm.category.idcategory,
				address : vm.address,
				text : vm.text,
			};
			dataservice.submitProblem().save(problem).$promise
				.then(function(data){
					vm.sent=true;
				})
				.catch(function(data){
					console.log(data);
				//TODO: add error message	
				});
		};
		
		function uploadFile($file){
			Upload.upload({
				url: 'api/upload',
				file: $file,
				progress: function(e){}
			}).then(function(data, status, headers, config) {
				// file is uploaded successfully
				console.log(data);
			}); 
		};
		
		
	}
})();