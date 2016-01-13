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
        vm.usersReturned = {};
        vm.userChosed = '';
        vm.categories = {};
        vm.categoriesToAdd = [];
        vm.temporaryBanTime = {};
        vm.renderParts = renderParts;
        vm.returnUsers = returnUsers;
        vm.choseUser = choseUser;
        vm.banUser = banUser;
        vm.emptyUsers = emptyUsers;
        vm.getCategories = getCategories;
        vm.addCategory = addCategory;
        vm.saveCategories = saveCategories;
		
        activate();

        function activate(){
        }

        function renderParts(part){
            //we use ng-switch, so we need to reinitialize variables
            if (vm.temporaryBanTime.days != 0) {
                vm.temporaryBanTime = {'days' : 0, 'hours' : 24};
            }
              if (part=='category'){
                getCategories();
            }
            return vm.chosenPart = part;
        }

        function returnUsers(){
            if (vm.user.username!=null || vm.user.email!=null || vm.user.accesslevel!=null || vm.user.bannedString!=null){
                return dataservice.getUsers(vm.user).getUsers().$promise
                    .then(function(data){
                        console.log(data.data); 
                        return vm.usersReturned = data.data; 
                    })
                    .catch(function(data){
                        return console.log(data.error);
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
            if (time.days>0 || time.hours>0){
                //banned time is computed in hours
                time = time.days*24 + time.hours;
            }
            dataservice.banUser(vm.userChosed.iduser, time).banUser().$promise
                .then(function(data){
                    dataservice.reload();
                    console.log(data);
                })
                .catch(function(data){
                    console.log(data);
                });
        }
        
        function emptyUsers(){
            vm.usersReturned = {};
        }
        
        function getCategories(){
            dataservice.suggestCategory().getAll().$promise
                .then(function(data){
                    vm.categories = data.data;
                });
        }
        
        function addCategory(idsuggestCategory, namesuggestCategory){
            var array = [];
            console.log(vm.categoriesToAdd.length);
            for (var counter = vm.categoriesToAdd.length; counter>0; counter--){
                //console.log(vm.categoriesToAdd[counter-1][0], idsuggestCategory);
                //console.log(vm.categoriesToAdd);
                if (vm.categoriesToAdd[counter-1][0]==idsuggestCategory){
                    vm.categoriesToAdd.splice(counter-1, 1);
                }
                //console.log(vm.categoriesToAdd);
            }
            array.push([idsuggestCategory, namesuggestCategory]);
            vm.categoriesToAdd = array.concat(vm.categoriesToAdd);
            console.log(vm.categoriesToAdd);

        }
        
        function saveCategories(){
            console.log(vm.categoriesToAdd);
            dataservice.addCategory().save(vm.categoriesToAdd).$promise
                 .then(function(data){
                     //initalize suggested categories again
                     renderParts('category');
                     vm.categoriesToAdd = [];
                     console.log(vm.categoriesToAdd);
                     console.log(data);
                });
        }

	}
})();