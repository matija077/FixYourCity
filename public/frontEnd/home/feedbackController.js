(function(){
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('feedbackController', feedbackController);

		feedbackController.$inject = ['dataservice'];

	function feedbackController(dataservice){
		var vm = this;
		vm.hajdaj = false;
		vm.showaj = false;
		vm.feedback=feedback;
		

		function feedback(){
			vm.hajdaj = true;
			vm.showaj = true;
			var user = JSON.parse(localStorage.getItem("user"));
			var enteredFeedback={
				iduser : user.iduser,
				feedbacksubject: vm.feedbackSubject,
				feedbacktext : vm.feedbackTextarea,
			};
			dataservice.feedback().save(enteredFeedback);
		}

	}
	
})();