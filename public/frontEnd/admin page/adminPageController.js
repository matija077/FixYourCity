(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('AdminPageController', AdminPageController);
		
		AdminPageController.$inject = ['dataservice'];
		
	function AdminPageController(dataservice){
		var vm = this;
		vm.chosenPart = "searchUser";
		vm.user = {'username': null, 'email': null, 'accesslevel': null, 'banned': null, 'bannedString': null};
        vm.initalState = 0;
		vm.usersReturned = [];
		vm.userChosed = '';		//chosed srsly
		vm.categories = [];		//CAT
		vm.categoriesToAdd = [];//CAT
		vm.cities = [];			//CITY
		vm.changecities=[];		//CITY
		vm.cr = [];				//CR
		vm.changerep = [];		//CR
		vm.temporaryBanTime = {};
		vm.error = '';
		vm.renderParts = renderParts;
		vm.returnUsers = returnUsers;
		vm.choseUser = choseUser;
		vm.banUser = banUser;
		//vm.emptyUsers = emptyUsers;
		vm.getCategories = getCategories;
		vm.addCategory = addCategory;
		vm.saveCategories = saveCategories;
		vm.promoteUser = promoteUser;
		vm.getCities = getCities;
		vm.saveCities=saveCities;
		vm.addCity=addCity;
		vm.getCityRep = getCityRep;
		vm.saveRep=saveRep;
		vm.addRep=addRep;
		
		activate();
		
		function activate(){
			
		}
		
		function renderParts(part){
			//we use ng-switch, so we need to reinitialize variables
			switch(part){
				case 'category': {
					getCategories();
					vm.categoriesToAdd=[];
					break;
				}
				case 'city': {
					getCities();
					vm.changecities=[];
					break;
				}
				case 'promote': {
					getCityRep();
					vm.changerep=[];
					break;
				}
				case 'banUser':{
					vm.temporaryBanTime = {'days' : 0, 'hours' : 24};
					break;
				}
			}
			return vm.chosenPart = part;
		}

        function returnUsers(){
            if (vm.user.username!=null || vm.user.email!=null || vm.user.accesslevel!=null || vm.user.bannedString!=null){
                vm.initalState = 1;
                return dataservice.getUsers(vm.user).getUsers().$promise
                    .then(function(data){
                        console.log(data.data);
                        return vm.usersReturned = data.data; 
                    })
                    .catch(function(data){
                        //return console.log(data.error);
                    });
            }
        }

        function choseUser(user){
            //if same user has already been higlighted, then remove highlight
            if (vm.userChosed.iduser==user.iduser){
                vm.userChosed = '';
            //if nothing is highlighted or other user is highlihted, add highlight
            } else {
                vm.userChosed = user;
            }
        }

        function banUser(time){
            /*
            *pernamently banned = 0
            *temporary banned   = days as hours + hours
            *unban              = -1
            */
            console.log(time);
            if (time.days>0 || time.hours>0){
                //banned time is computed in hours
                time = time.days*24 + time.hours;
            }
            
            dataservice.banUser(vm.userChosed.iduser, time).banUser().$promise
                .then(function(data){
                    dataservice.reload();
                })
                .catch(function(data){
                    //console.log(data);
                });
        }
        /*
        function emptyUsers(){
            vm.usersReturned = {};
        }
        */
        function getCategories(){
            dataservice.suggestCategory().getAll().$promise
                .then(function(data){
                    vm.categories = data.data;
                });
        }
		
		function addCategory(sent,pick){
			var found = false;
			angular.forEach(vm.categoriesToAdd, function(category){
				if(category.idsuggestcategory==sent.idsuggestcategory){
					if(category.pick!=pick) category.pick=!category.pick;
					found=true;
				};
			});
			if(!found){
				vm.categoriesToAdd.push({
					'idsuggestcategory':sent.idsuggestcategory,
					'pick':pick,
				});
				sent.marked=true; // marking for deletion from vm.cities
			};
        }
        
        function saveCategories(){
            dataservice.addCategory().save(vm.categoriesToAdd).$promise
                 .then(function(data){
					 for(var i=vm.categories.length-1;i>=0;i--){
						if(typeof vm.categories[i].marked !='undefined'){
							vm.categories.splice(i,1);
						};
					};
					vm.categoriesToAdd=[];
                });
        }
        
        function promoteUser(step){
            var user ={
                iduser: vm.userChosed.iduser,
                step: step,
            };
            //console.log(vm.userChosed);
            dataservice.promoteUser().save(user).$promise
                .then(function(data){
                    console.log(data);
                    dataservice.reload();
                })
                .catch(function(data){
                    //console.log(data);
                    vm.error = data;
                })
        }
		
		function getCities(){
			dataservice.suggestCity().getAll().$promise
				.then(function(data){
					//console.log(data);
					vm.cities=data.data;
				});
		}
		
		function addCity(sent,pick){
			var found = false;
			angular.forEach(vm.changecities, function(city){
				if(city.idsuggestcity==sent.idsuggestcity){
					if(city.pick!=pick) city.pick=!city.pick;
					found=true;
				};
			});
			if(!found){
				vm.changecities.push({
					'idsuggestcity':sent.idsuggestcity,
					'pick':pick,
				});
				sent.marked=true; // marking for deletion from vm.cities
			};
		}
		
		function saveCities(){
			dataservice.addCities().save(vm.changecities).$promise
				.then(function(data){
					//console.log(data);
					// removing city entries that we sent to server
					for(var i=vm.cities.length-1;i>=0;i--){
						if(typeof vm.cities[i].marked !='undefined'){
							vm.cities.splice(i,1);
						};
					};
					vm.changecities=[];
				});
		}
		
		function getCityRep(){
			dataservice.suggestCR().getAll().$promise
				.then(function(data){
					//console.log(data);
					vm.cr=data.data;
				});
		}
		
		function addRep(sent,pick){
			var found = false;
			angular.forEach(vm.changerep, function(rep){
				if(rep.idsuggestcr==sent.idsuggestcr){
					if(rep.pick!=pick) rep.pick=!rep.pick;
					found=true;
				};
			});
			if(!found){
				vm.changerep.push({
					'idsuggestcr':sent.idsuggestcr,
					'pick':pick,
				});
				sent.marked=true; // marking for deletion from vm.cr
			};
		}
		
		function saveRep(){
			dataservice.addCityRep().save(vm.changerep).$promise
				.then(function(data){
					//console.log(data);
					for(var i=vm.cr.length-1;i>=0;i--){
						if(typeof vm.cr[i].marked !='undefined'){
							vm.cr.splice(i,1);
						};
					};
					vm.changerep=[];
				});
		}
		
		
	}
})();