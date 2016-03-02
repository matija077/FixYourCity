(function() {
	'use strict';
	
	angular
		.module('FixYourCityApp')
		.factory('dataservice', dataservice);
		
		dataservice.$inject = ['$http', '$resource', '$stateParams', '$urlRouter', '$state', 'Upload'];
		
	function dataservice($http, $resource, $stateParams, $urlRouter, $state, Upload){

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
			banUser: banUser,
			getNotifications: getNotifications,
			getProblems: getProblems,
			getProblem: getProblem,
			toggleVote: toggleVote,
			submitComment: submitComment,
			suggestCity : suggestCity,
			feedback : feedback,
			suggestCategory : suggestCategory,
			getThumb : getThumb,
			addCategory: addCategory,
			promoteUser: promoteUser,
			addCities: addCities,
			suggestCR: suggestCR,
			addCityRep: addCityRep,
			vote: vote,
			mark: mark,
			follow: follow,
			checkUsername: checkUsername,
			checkEmail: checkEmail,
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
		
        function getUsers(user){
            /*javascript passes objects by reference, so we need to assing each
            *key, value pair of an object separately
            */
            var tempUser = Object.create(user);
            angular.forEach(user, function(value, key){
                
               if (value==null || value=='null' || value==''){
                   tempUser[key] = -1;
               } else {
                   tempUser[key] = value;
               }
               //console.log(value, key, tempUser);
            });
            //console.log(tempUser);
            return $resource("api/users/:username/:email/:accesslevel/:banned", {username: -1, email: -1, accesslevel: -1, banned: -1}, {
                getUsers: {method: 'GET', params:{username: tempUser.username, email: tempUser.email,
                    accesslevel: tempUser.accesslevel, banned: tempUser.bannedString}, isArray:false,
                transformResponse: function(data, headers){
                    return { data: angular.fromJson(data)};
                },
                stripTrailingSlashes: false
                },
                
            });
        }

        function banUser(iduser, timeToSend){
            console.log(iduser, timeToSend);
            return $resource("api/ban/:id/:time", {id: "@iduser"}, {
                banUser: {method: 'POST', params:{id: iduser, time: timeToSend}, isArray:false,
                transformResponse: function(data, headers){
                    return { data: angular.fromJson(data)};
                }},
            });
        }	
		
		function getNotifications(userid){
			return $resource("api/notification/:id", {}, {
				getNotifications: {method: 'GET', params: {id: userid}, isArray:false,
					transformResponse: function(data, headers){
						return { data: angular.fromJson(data)};
				}},
				hasSeenNotifications: {method: 'POST', params: {id: userid}, isArray:false }
			});
		}

		function getProblems(idcity,idcategory){
			var user = JSON.parse(localStorage.getItem("user"));
			return $resource("api/problems/:idcity/:idcategory", {idcity: "@idcity",idcategory: "@idcategory"}, {
				getAll: {method: 'GET', params:{idcity: idcity,idcategory: idcategory,'iduser':function(){if(!user){return 0; }else{return user.iduser}}}, isArray:false,
					transformResponse: function(data,headers){
						return { data: angular.fromJson(data) };
					}
				}
			});
		}
		
		function getProblem(id){
			var user = JSON.parse(localStorage.getItem("user"));
			return $resource("api/problem/:id", {id: "@id"}, {
				getProblem: {method: 'GET', params:{id: id,'iduser':function(){if(!user){return 0; }else{return user.iduser}}}, isArray:false }
			});
		}
		
		function toggleVote(problem,vote){
			var user = JSON.parse(localStorage.getItem("user"));
			if(!user){ 
				service.goPath('forbidden'); 
				return 0; 
			};
			if(typeof problem.voted == 'undefined' || problem.voted==null) problem.voted=0;
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
			};
			service.vote().save({'idproblem':problem.idproblem,'voted':vote,'iduser':user.iduser}).$promise
				.then(function(data){
					//console.log(data);
				});
		}
		
		function vote(){
			return $resource("api/vote", {}, {
			});
		}
		
		function suggestCity(){
			return $resource("api/suggestCity", {}, {
				getAll: {method: 'GET', params: {}, isArray:false,
					transformResponse: function(data, header){
						return { data: angular.fromJson(data) };
					}
				}
			});
		}

		function feedback(){
			return $resource("api/feedback", {}, {
			});
		}

		function suggestCategory(){
			return $resource("api/suggestCategory", {}, {
                getAll: {method: 'GET', params: {}, isArray:false,
                    transformResponse: function(data, header){
                        return { data: angular.fromJson(data) };
                    }
                }
			});
		}
        
        function addCategory(){
            return $resource("api/addCategory", {}, {
			});
        }
		
		function addCities(){
			return $resource("api/addCities", {}, {
			});
		}
		
		function addCityRep(){
			return $resource("api/addCityRep", {}, {
			});
		}
		
		function submitProblem($file,params){
			return Upload.upload({
				url: 'api/submitproblem',
				data: {'params':params},
				file: $file,
				progress: function(e){
					//var progressPercentage = parseInt(100.0 * e.loaded / e.total);
					//console.log('progress: ' + progressPercentage + '% ' + e.config.data.file.name);
					//console.log(e);  //literally nothing
				}
			}).then(function(data, status, headers, config) {
				return data.data;
			});
		};
		
		function submitComment($file,params){
			return Upload.upload({
				url: 'api/submitcomment',
				data: {'params':params},
				file: $file,
				progress: function(e){
				}
			}).then(function(data, status, headers, config) {
				return data.data;
			});
		};
		// put both problem and comment in one function?
        
        function promoteUser(){
            return $resource("api/promoteUser", {}, {            
            });
        }
		
		function getThumb(param){
			if(typeof param == 'undefined' || !param){
				return null; 
			};
			var inx = param.lastIndexOf(".");
			return param.slice(0,inx)+'t'+param.slice(inx);
		};
		
		function suggestCR(){
			return $resource("api/suggestCR", {}, {
				getAll: {method: 'GET', params: {}, isArray:false,
					transformResponse: function(data, header){
						return { data: angular.fromJson(data) };
					}
				}
			});
		}
		
		function mark(){
			return $resource("api/mark", {}, {
			});
		}
		
        function follow(){
            return $resource("api/follow", {}, {
            });
        }
		
		function checkUsername(param){
			return $resource("api/checkusername", {}, {
                check: {method: 'GET', params: {username:param}, isArray:false,
                    transformResponse: function(data, header){
                        return { data: angular.fromJson(data) };
                    }
                }
			});
		}
		
		function checkEmail(param){
			return $resource("api/checkemail", {}, {
                check: {method: 'GET', params: {email:param}, isArray:false,
                    transformResponse: function(data, header){
                        return { data: angular.fromJson(data) };
                    }
                }
			});
		}
	}
})();
