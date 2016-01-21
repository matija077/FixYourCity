<!DOCTYPE html> 
<html data-ng-app="FixYourCityApp">
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="frontend/stylesheet.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="frontend/ng-bootstrap-lightbox/lightbox.min.css">
</head>
<body>
	
	
	<div class="container">
		<div class="navbar" >
			<div ng-include = "'frontend/home/navbar.htm'"></div>
		</div>
		<div ui-view></div>
		<div class="footernavbar" >
			<div ng-include = "'frontend/home/footer.htm'"></div>
		</div>
	</div>	
	
	<noscript>
		<center>
			<img src="http://i.imgur.com/eEWwVtb.png" /> <br/><br /> <h3>Sorry! This site requires enabled JavaScript.</h3>
		</center>
	</noscript>
	
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-route.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.15/angular-ui-router.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-resource.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-cookies.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/satellizer/0.13.1/satellizer.min.js"></script>
	<!--<script src="http://cdnjs.cloudflare.com/ajax/libs/restangular/1.3.1/restangular.js"></script>-->
	<!--   1.3.14 -->

	
	<script src="frontend/module.js"></script>
	
	<script src="frontend/home/HomeController.js"></script>
	
	<script src="frontend/cities/CityDetailController.js"></script>
	
	<script src="frontend/dataservice.js"></script>
	
	<script src="frontend/home/navbarController.js"></script>

	<script src="frontend/home/submitissueController.js"></script>

	<script src="frontend/about/aboutController.js"></script>
	
	<script src="frontend/signup/signupController.js"></script>
    
    <script src="frontend/admin page/adminPageController.js"></script>
	
	<script src="frontend/problem/problemController.js"></script>
	
	<script src="frontend/home/feedbackController.js"></script>

	<script src="frontend/home/suggestCityController.js"></script>

	<script src="frontend/home/suggestCategoryController.js"></script>

	<script src="frontend/home/suggestCRController.js"></script>
	
	<script src="frontend/ng-file-upload/ng-file-upload-shim.min.js"></script> <!-- for no html5 browsers support -->
	<script src="frontend/ng-file-upload/ng-file-upload.min.js"></script>
	
	<script src="frontend/ng-bootstrap-lightbox/bootstrap-modal.min.js"></script>
	<script src="frontend/ng-bootstrap-lightbox/lightbox.min.js"></script>
</body>

</html>