(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('problemController', problemController);
		
		problemController.$inject = ['dataservice', '$stateParams'];
		
	function problemController(dataservice, $stateParams){
		var vm = this;
		vm.problem = [];
		vm.textcomment;
		vm.sent=false;
		vm.user = JSON.parse(localStorage.getItem("user"));
		vm.retval=false;
		
		vm.init=init;
		vm.toggleVote=toggleVote;
		vm.getProblem=getProblem;
		vm.submitComment=submitComment;
		
		
		init();
		
		function init(){
			vm.problem = getProblem();
			//console.log(vm.problem);
		};
		
		function getProblem(){
			return dataservice.getProblem().getProblem({id:$stateParams.id});
		};
		
		function toggleVote(problem,vote){
			dataservice.toggleVote(problem,vote);
		};
		
		function submitComment(){
			if (!vm.user){
				console.log('Not logged in');
				return;
			}
			var comment = {
				iduser: vm.user.iduser,
				idproblem: vm.problem.idproblem,
				text: vm.textcomment,
				url: null,
			};
			dataservice.submitComment().save(comment).$promise
				.then(function(response){
					var topush = {
						username: vm.user.username,
						created: response.created,
						text: response.text,
						//more parameters required, such as image url
					};
					vm.problem.comments.push(topush);
					vm.sent=true;
				})
				.catch(function(data){
					console.log(data);
				//TODO: add error message	
				});

		};
	}
})();