(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('HomeController', HomeController);
		
		HomeController.$inject = ['dataservice', '$auth', '$rootScope', '$state', 'lightbox'];
		
	function HomeController(dataservice, $auth, $rootScope, $state, lightbox){
		var vm = this;
		vm.cities = [];
		vm.citiesToShow = [];
		vm.categories = [];
		vm.categoriesToShow = [];
		vm.filterCities = filterCities;
		vm.filterCategories = filterCategories;
		vm.insertCity=insertCity;
		vm.selectCity=selectCity;
		vm.selectedcity;
		vm.selectCategory=selectCategory;
		vm.selectedcategory;
		vm.proceedSubmit=proceedSubmit;
		vm.getProblems=getProblems;
		vm.problems= [];
		vm.toggleVote=toggleVote;
		vm.showsearch=true;
		vm.showsearchToggle=showsearchToggle;
		vm.sort=sort;
		vm.reverse=true;
		vm.sortpick='created';  //DEFAULT sort
		vm.openImg=openImg;
		
		activate();
		
		function activate(){
			getCities();
			getCategories();
			
		}
		
		function getCities(){
			return dataservice.getCities().getAll().$promise
				.then(function(resource){
					vm.citiesToShow = resource.data;
					return vm.cities = resource.data;
				});
		}
		
		function getCategories(){
			return dataservice.getCategories().getAll().$promise
				.then(function(resource){
					vm.categoriesToShow = resource.data;
				    vm.categories = resource.data;
				});
		}
		
		function filterCities(inputCityName){
			vm.citiesToShow = [];
			vm.cities.forEach(function(element) {
				if (angular.lowercase(element.cityname).indexOf(angular.lowercase(inputCityName))!=-1){
					vm.citiesToShow.push(element);
				}
			});
		}
		
		function filterCategories(inputCategoryName){
			vm.categoriesToShow = [];
			vm.categories.forEach(function(element) {
				if (angular.lowercase(element.ctgname).indexOf(angular.lowercase(inputCategoryName))!=-1){
					vm.categoriesToShow.push(element);
				}
			});
		} 
	
		function insertCity(){
			var citytoinsert={
				cityname: vm.cityname,
				state : vm.state,
			};
			dataservice.insertCity().save(citytoinsert);
		}
		
		function selectCity(param){
			if(vm.selectedcity!=param){
				vm.selectedcity=param;
				if(vm.selectedcategory){
					getProblems(param,vm.selectedcategory);
					showsearchToggle(); //automatically collapses city+category search only once both are selected
				}else{
					getProblems(param,-1);
				}
			}
		}
		
		function selectCategory(param){
			if(vm.selectedcategory!=param){
				vm.selectedcategory=param;
				if(vm.selectedcity){
					getProblems(vm.selectedcity,param);
					showsearchToggle(); //automatically collapses city+category search only once both are selected
				}
			}
		}
	
		function proceedSubmit(idcity,idcategory){
			dataservice.goPath('submit', {"idcity": idcity, "idcategory": idcategory});
		}
		
		function getProblems(idcity,idcategory){
			return dataservice.getProblems(idcity,idcategory).getAll().$promise
				.then(function(problems){
					//console.log(problems.data);
					vm.problems = problems.data;
					angular.forEach(vm.problems, function(problem){
						problem.thumb = dataservice.getThumb(problem.url);
					});
				});
		}
		
		function toggleVote(problem,vote){
			dataservice.toggleVote(problem,vote);
		}
		
		function showsearchToggle(){
			if(vm.showsearch){
				vm.showsearch=false;;
			}else{
				vm.showsearch=true;;
			}
		}
		
		function sort(pick){
			vm.sortpick=pick;
		}
		
		function openImg(id){
			var options = {
				fadeDuration : 0.7,
				resizeDuration : 0.5,
				fitImageInViewPort : false,
				positionFromTop : 50,  
				showImageNumberLabel : false,
				alwaysShowNavOnTouchDevices :true,
				wrapAround : false
			};
			var filledalbum=[];
			var counter=0;
			var found=false;
			/* 
			*  Here (different than problemController.js) we do not make an album (for all problem images) but rather make it only that the selected/clicked image is displayed
			*  'id' (idproblem) is sent because '$index' is not consistent as a result of sorting 
			*/
			angular.forEach(vm.problems, function(problem){
				if(!found && problem.idproblem==id && problem.url){
					filledalbum.push({
						src: problem.url,
						thumb: problem.thumb,
						caption: problem.text,
					});
					found=true;
				};
			});
			lightbox.open(filledalbum, 0, options); // image index is 0 because it is a single image album
		};
		
	}
})();