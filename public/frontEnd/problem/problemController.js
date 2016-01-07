(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('problemController', problemController);
		
		problemController.$inject = ['dataservice', '$stateParams'];
		
	function problemController(dataservice, $stateParams){
		var vm = this;
		vm.problem = [];
		
		vm.init=init;
		vm.toggleVote=toggleVote;
		vm.getProblem=getProblem;
		
		
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
		
	}
})();