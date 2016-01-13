(function() {
	'use strict';
	
	angular	
		.module('FixYourCityApp')
		.controller('problemController', problemController);
		
		problemController.$inject = ['dataservice', '$stateParams', 'lightbox'];
		
	function problemController(dataservice, $stateParams, lightbox){
		var vm = this;
		vm.problem = [];
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
		vm.getThumb=getThumb;
		
		init();
		
		function init(){
			/*vm.problem = getProblem();
			console.log(vm.problem);*/
			getProblem(function(res){
				console.log('dada');
			});
			//console.log(vm.problem);
			//console.log(vm.problem.url);
			//console.log("url" in vm.problem);
			//vm.problem = asd;
		};
		
		function getProblem(){
			return dataservice.getProblem().getProblem({id:$stateParams.id}, function(res){
				console.log(res);
				vm.problem = res;
				vm.problem.turl = getThumb(vm.problem.url);
			});
		};
		
		function toggleVote(problem,vote){
			//console.log(vm.problem.url);
			//console.log(getThumb(vm.problem.url));
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
				//url: null,
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
		
		function openImg($index){
			var options = {
				fadeDuration : 0.7,
				resizeDuration : 0.5,
				fitImageInViewPort : false,
				positionFromTop : 50,  
				showImageNumberLabel : false,
				alwaysShowNavOnTouchDevices :false,
				wrapAround : false
			};
			/*
			album = [{
				src : '1.png',
				thumb : '1-thumb.png',
				caption : 'Optional caption 1'
			},{
				src : '2.png',
				thumb : '2-thumb.png',
				caption : 'Optional caption 2'
			},{
				src : '3.png', 
				thumb : '3-thumb.png',
				caption : 'Optional caption 3'
			}]; 
			*/
			//var th = getThumb(vm.problem.url);
			var album = [{
				src: vm.problem.url,
				//thumb: th,
				caption : 'ayyy'
			}];
			//console.log(album[0].thumb);
			//this.open = function($index){
			lightbox.open(album, $index, options);
			//	}
		};
		
		function getThumb(param){
		
			if(typeof param == 'undefined'){
				//console.log(param);
				return null; 
			}
			//console.log(param);
			var inx = param.lastIndexOf(".");
			return param.slice(0,inx)+'t'+param.slice(inx);
		};
	}
})();