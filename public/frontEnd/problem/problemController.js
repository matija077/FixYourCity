(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('problemController', problemController);
		
		problemController.$inject = ['dataservice', '$stateParams', 'lightbox'];
		
	function problemController(dataservice, $stateParams, lightbox){
		var vm = this;
		vm.problem = [];
		vm.album = [];
		vm.textcomment;
		vm.sent=0;
		vm.user = JSON.parse(localStorage.getItem("user"));
		vm.retval=false;
		vm.file;
		
		vm.init=init;
		vm.toggleVote=toggleVote;
		vm.getProblem=getProblem;
		vm.submitComment=submitComment;
		vm.openImg=openImg;
		
		init();
		
		function init(){
			getProblem();
		};
		
		function getProblem(){
			return dataservice.getProblem().getProblem({id:$stateParams.id}, function(res){
				vm.problem = res;
				vm.album.push({
					src: vm.problem.url,
					thumb: dataservice.getThumb(vm.problem.url),
					caption: vm.problem.text,
				});
				angular.forEach(vm.problem.comments, function(comment){
					vm.album.push({
						src: comment.url,
						thumb: dataservice.getThumb(comment.url),
						caption: comment.text,
					});
				});
			});
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
			};
			/*
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
			*/
			vm.sent=1;
			dataservice.submitComment(vm.file,comment)
				.then(function(data){
					if(data.idcomment!='undefined' && data.idcomment>0){
						vm.problem.comments.push({
							username: vm.user.username,
							created: data.created,
							text: data.text,
							url: data.url,
						});
						vm.sent=2;
					}
				})
				.catch(function(data){
					vm.sent=-1;
				});
		};
		
		function openImg(index){
			var options = {
				fadeDuration : 0.7,
				resizeDuration : 0.5,
				fitImageInViewPort : false,
				positionFromTop : 50,  
				showImageNumberLabel : false,
				alwaysShowNavOnTouchDevices :true,
				wrapAround : false
			};
			/* Due to how 'ngBootstrapLightbox' works, it requires the array sent as 'album' to have all image source 'src' fields filled, but since it is not a requirement...
			*	...for either a problem or comment on problem to have an image, array 'filledalbum' is sent, which contains only those objects that do have an image set.
			*  For same reason, 'index' variable has to be translated to match the object/image it is referencing in the new array.
			*  It is not possible to add required fields to 'vm.problem' because it does not match the needed array order (because of the 'comments' section)!
			*
			*  All problem images (problem+comments) are stored in an album which can be navigated through
			*/
			var filledalbum=[];
			var counter=index;
			angular.forEach(vm.album, function(album){
					if(album.src){
						filledalbum.push(album);
					}else{
						if(counter>0) index--;
					};
					counter--;
			});
			lightbox.open(filledalbum, index, options);
		};
		
	}
})();