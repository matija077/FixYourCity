(function() {
	'use strict';
	
	angular
		.module('FixYourCityApp')
		.factory('dataservice', dataservice);
		
		dataservice.$inject = ['$http', '$resource', '$routeParams', '$location'];
		
	function dataservice($http, $resource, $routeParams, $location){
		var service = {
			getCities : getCities,
			getCategories : getCategories,
			insertCity : insertCity,
			goPath : goPath,   //goPath(path)  partial path where to redirect (checks module.js)
			submitProblem : submitProblem,
			
		}
		
		return service;
		
		function getCities(){
			return $resource("api/cities/:id", {id: "@id"}, {
				getAll: {method: 'GET', params:{}, isArray:false, 
				transformResponse: function(data, headers){
                    // transform to array of objects 
                    return { data: angular.fromJson(data)};
                }},
				getCity: {method: 'GET', params:{id: $routeParams.id}, isArray:false}
			});
		}
		
		function getCategories(){
			return $resource("api/categories/:id", {id: "@id"}, {
				getAll: {method: 'GET', params:{}, isArray:false,
				transformResponse: function(data, headers){
					return { data: angular.fromJson(data)};
				}},
				getCategory: {method: 'GET', params:{id: $routeParams.id}, isArray:false}
			});
		}
		
		function insertCity(){
			return $resource("api/insertcity", {}, {
			});
		}
		
		function goPath(param){
			$location.path(param);
		}
		
		function submitProblem(){
			return $resource("api/submitproblem", {}, {
			});
		}
		
		/****/
		/*function checkCountry(){
			return $resource("api/checkcountry/:id", {id: "@id"}, {
				getAll: {method: 'POST', params:{}, isArray:false, 
				transformResponse: function(data, headers){
                    // transform to array of objects 
                    return { data: angular.fromJson(data)};
                }},
				checkCountry: {method: 'POST', params:{id: $routeParams.id}, isArray:false}
			});
		}*/
		
	}
})();