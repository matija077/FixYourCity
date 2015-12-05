(function() {
	'use strict';
	
	angular
		.module('FixYourCityApp')
		.factory('dataservice', dataservice);
		
		dataservice.$inject = ['$http', '$resource', '$routeParams', '$location'];
		
	function dataservice($http, $resource, $routeParams, $location){
		//var dat={};
		var service = {
			getCities : getCities,
			//getCity: getCity,
			getCategories : getCategories,
			insertCity : insertCity,
			goPath : goPath,   //goPath(path)  partial path where to redirect (checks module.js)
			submitProblem : submitProblem,
			//saveData : saveData,
			//getData : getData,
		}
		
		return service;
		
		function getCities(){
			return $resource("api/cities/:id", {id: "@id"}, {
				getAll: {method: 'GET', params:{}, isArray:false, 
				transformResponse: function(data, headers){
                    // transform to array of objects 
					//console.log($resource);
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
			return $resource("api/insertcity/:cityname/:state",{cityname:"@cityname",state:"@state"},{
				send: {method: 'POST', params:{}, isArray:false,
				transformResponse: function(data, headers){
					return { data: angular.fromJson(data)};
				}}
			});
		}
		
		function goPath(param){
			$location.path(param);
		}
		
		function submitProblem(){
			return $resource("api/submitproblem", {}, {
				//
			});
		}
		
		
		
		
		/*
		function saveData(d1,d2){
				console.log(d1,d2);
				dat={d1,d2};
		}
		
		function getData(){
			return dat;
		}
		*/
		
		 /*function getCity(){
			console.log($routeParams.id);			
			return $resource("api/cities/:id", {id: "@id"}, {
				query: {method: 'GET', params:{id: $routeParams.id}, isArray:true}
			});
		}*/
		/*function getCity(){
			return $http.get("api/cities/" + $routeParams.id)
				.success (function(data, status, header, config){
                    return data;
                }).
                error (function(data, status, header, config){
                    console.log('Error:'+ status);
                });
		}*/
	}
})();