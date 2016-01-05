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
        vm.userChosen = 0;
        vm.renderParts = renderParts;
        vm.returnUsers = returnUsers;
        vm.choseuser = choseUser;
		
        activate();

        function activate(){
            returnUsers();
        }

        function renderParts(part){
            /*
            *1 = user
            *2 = feedback
            *3 = feedback
            *4 = feedback
            */
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
            
        }

	}
})();