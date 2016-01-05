(function() {
	'use strict';
	
	angular
		.module('FixYourCityApp')
		.factory('dataservice', dataservice);
		
		dataservice.$inject = ['$http', '$resource', '$stateParams', '$urlRouter','$state'];
		
	function dataservice($http, $resource, $stateParams, $urlRouter, $state){

		var service = {
			getCities : getCities,
			getCategories : getCategories,
			insertCity : insertCity,
			goPath : goPath,   //goPath(path)  partial path where to redirect (checks module.js)
			submitProblem : submitProblem,
			signUp: signUp,
			getUser: getUser,
			reload : reload,
            getUsers: getUsers,
		}
		
		/*var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjQsImlzcyI6Imh0dHA6XC9cL2xvY2FsaG9zdFwvUldBXC9wdWJsaWNcL2FwaVwvYXV0aGVudGljYXRlIiwiaWF0IjoiMTQ0ODU1MzIzOCIsImV4cCI6IjE0NDg1NTY4MzgiLCJuYmYiOiIxNDQ4NTUzMjM4IiwianRpIjoiYjZmMjk0N2U0ODQ1ZDljOGE2OTU4ZDZhZGNlZGUwNTAifQ.5CbF03PUe1fr-gK2xQMlCjdCQ2LioWOizc6bqsLBiKY';*/
		
		return service;
		
		function getCities(){
			return $resource("api/cities/:id", {id: "@id"}, {
				getAll: {method: 'GET', params:{}, isArray:false, 
					transformResponse: function(data, headers){
                   		// transform to array of objects 
                        return { data: angular.fromJson(data)};
                  	} 
				},
				getCity: {method: 'GET', params:{id: $stateParams.id}, isArray:false}
			});
		}
		
		function getCategories(){
			return $resource("api/categories/:id", {id: "@id"}, {
				getAll: {method: 'GET', params:{}, isArray:false,
				transformResponse: function(data, headers){
					return { data: angular.fromJson(data)};
				}},
				getCategory: {method: 'GET', params:{id: $stateParams.id}, isArray:false}
			});
		}
		
		function insertCity(){
			return $resource("api/insertcity", {}, {
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
		
		function goPath(stateName, params){
			$state.go(stateName, params);
		}
		
		function reload(){
			$state.reload();
		}
		
		function submitProblem(){
			return $resource("api/submitproblem", {}, {
			});
		}
        
        function getUsers(){
            return $resource("api/users", {}, {
                getUsers: {method: 'GET', params:{}, isArray:false,
                transformResponse: function(data, headers){
                    return { data: angular.fromJson(data)};
                }},
            });
        }
	}
})();

