<!DOCTYPE html> 
<html data-ng-app="FixYourCityApp">
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="frontEnd/stylesheet.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
</head>
<body>
	
	
	<div class="container">
		<div class="navbar" >
			<div ng-include = "'frontEnd/home/header2.htm'"></div>
		</div>
		<div ng-view></div>
		<div class="footernavbar" >
			<div ng-include = "'frontEnd/home/footer.htm'"></div>
		</div>
		
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

	<script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
    <!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>

    
	
	<!--
	  <!-- Angular Material Javascript now available via Google CDN; version 0.11.2 used here -->
    <!--<script src="https://ajax.googleapis.com/ajax/libs/angular_material/0.11.2/angular-material.min.js"></script> 
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-animate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-aria.min.js"></script>
	 <!-- Angular Material CSS now available via Google CDN; version 0.11.2 used here -->
  <!--  <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/0.11.2/angular-material.min.css"> -->
	
	<script src="frontEnd/module.js"></script>
	
	<script src="frontEnd/home/HomeController.js"></script>
	
	<script src="frontEnd/cities/CityDetailController.js"></script>
	
	<script src="frontEnd/dataservice.js"></script>
	
	<script src="frontEnd/home/navbarController.js"></script>

	<script src="frontEnd/home/submitissueController.js"></script>

	<script src="frontEnd/about/aboutController.js"></script>
	
	<!--<script src="frontEnd/home/AppCtrl.js"></script>-->
	
	
</body>

</html>