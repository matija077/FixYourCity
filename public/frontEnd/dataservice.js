(function() {
	'use strict';
	
	angular
		.module('FixYourCityApp')
		.factory('dataservice', dataservice);
		
		dataservice.$inject = ['$http', '$resource', '$stateParams'];
		
	function dataservice($http, $resource, $stateParams){
		var service = {
			getCities : getCities,
			//getCity: getCity,
			getCategories : getCategories,
			signUp: signUp,
			getUser: getUser,
		}
		
		/*var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjQsImlzcyI6Imh0dHA6XC9cL2xvY2FsaG9zdFwvUldBXC9wdWJsaWNcL2FwaVwvYXV0aGVudGljYXRlIiwiaWF0IjoiMTQ0ODU1MzIzOCIsImV4cCI6IjE0NDg1NTY4MzgiLCJuYmYiOiIxNDQ4NTUzMjM4IiwianRpIjoiYjZmMjk0N2U0ODQ1ZDljOGE2OTU4ZDZhZGNlZGUwNTAifQ.5CbF03PUe1fr-gK2xQMlCjdCQ2LioWOizc6bqsLBiKY';*/
		
		return service;
		
		function getCities(){
			return $resource("api/cities/:id", {id: "@id"}, {
				getAll: {method: 'GET', 
					params:{}, isArray:false, 
					transformResponse: function(data, headers){
                   		// transform to array of objects 
                        return { data: angular.fromJson(data)};
                  	} 
				},
				getCity: {method: 'GET', params:{id: $stateParams.id}, isArray:false}
			});
		}
		
		function getCategories(){
			return $resource("api/categories", {}, {
				getAll: {method: 'GET', params:{}, isArray:false,
				transformResponse: function(data, headers){
					return { data: angular.fromJson(data)};
				}}
			});
		}
		
		function signUp(){
			return $resource("api/signup", {}, {
			});
		}
		
		function getUser(){
			return $resource("api/authenticate/user", {}, {
				getUser: {method: 'GET', params:{}, isArray:false,
				transformResponse: function(data, headers){
					return { data: angular.fromJson(data)};
				}}
			});
		}
		
		
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