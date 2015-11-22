<!DOCTYPE html> 
<html data-ng-app="FixYourCityApp">
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="frontEnd/stylesheet.css">
</head>
<body>
	
	
	<div class="container">
		<div class="navbar" >
			<div ng-include = "'frontEnd/home/navbar.htm'"></div>
		</div>
		<div ng-view></div>
	</div>	
	
	<noscript>
		<center>
			<img src="http://i.imgur.com/eEWwVtb.png" /> <br/><br /> <h3>Sorry! This site requires enabled JavaScript.</h3>
		</center>
	</noscript>
	
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-route.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-resource.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-cookies.js"></script>
	<script src="http://cdnjs.cloudflare.com/ajax/libs/restangular/1.3.1/restangular.js"></script>
	
	<script src="frontEnd/module.js"></script>
	
	<script src="frontEnd/home/HomeController.js"></script>
	
	<script src="frontEnd/cities/CityDetailController.js"></script>
	
	<script src="frontEnd/dataservice.js"></script>
	
	<script src="frontEnd/home/navbarController.js"></script>
	
</body>

</html>