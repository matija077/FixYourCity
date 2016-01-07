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
			getNotifications: getNotifications,
			getProblems: getProblems,
			getProblem: getProblem,
			toggleVote: toggleVote,
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
		
		function getNotifications(userid){
			return $resource("api/notification/:id", {}, {
				getNotifications: {method: 'GET', params: {id: userid}, isArray:false,
					transformResponse: function(data, headers){
						return { data: angular.fromJson(data)};
				}	}
			});
		}
		
		function getProblems(idcity,idcategory){
			return $resource("api/problems/:idcity/:idcategory", {idcity: "@idcity",idcategory: "@idcategory"}, {
				getAll: {method: 'GET', params:{idcity: idcity,idcategory: idcategory}, isArray:false,
					transformResponse: function(data,headers){
						return { data: angular.fromJson(data) };
					}
				}
			});
		}
		
		function getProblem(id){
			return $resource("api/problem/:id", {id: "@id"}, {
				getProblem: {method: 'GET', params:{id: id}, isArray:false }
			});
		}
		
		function toggleVote(problem,vote){
			if(typeof problem.voted == 'undefined') problem.voted=0;
			if(vote==1){
				switch(problem.voted) {
					case -1: {
						problem.votenegative-=1;
						problem.votepositive+=1;
						problem.voted=1;
						break;
					}
					case 0: {
						problem.votepositive+=1;
						problem.voted=1;
						break;
					}
					case 1: {
						problem.votepositive-=1;
						problem.voted=0;
						break;
					}
				}
			}else{
				switch(problem.voted){
					case -1: {
						problem.votenegative-=1;
						problem.voted=0;
						break;
					}
					case 0: {
						problem.votenegative+=1;
						problem.voted=-1;
						break;
					}
					case 1: {
						problem.votepositive-=1;
						problem.votenegative+=1;
						problem.voted=-1;
						break;
					}
				}
			}
		}
	}
})();