(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('AdminPageController', AdminPageController);
		
		AdminPageController.$inject = ['dataservice'];
		
	function AdminPageController(dataservice){
		var vm = this;
        vm.chosenPart = "searchUser";
        vm.user = {};
        vm.usersReturned = {};
        vm.userChosed = '';
        vm.renderParts = renderParts;
        vm.returnUsers = returnUsers;
        vm.choseUser = choseUser;
        vm.banUser = banUser;
		
        activate();

        function activate(){
            returnUsers();
        }

        function renderParts(part){
            return vm.chosenPart = part;
        }

        function returnUsers(){
            return dataservice.getUsers().getUsers().$promise
                .then(function(data){
                    console.log(data );
                    return vm.usersReturned = data.data; 
                })
                .catch(function(data){
                    return console.log(data.error);
                });
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
            if (time==''){
                time = 0;
            }
            dataservice.banUser().banUser(time).$promise
                .then(function(data){
                    console.log(data);
                })
                .catch(function(data){
                    console.log(data);
                });
        }

	}
})();