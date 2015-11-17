<html data-ng-app="FixYourCityApp">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="frontEnd/stylesheet.css">
</head>
<body>
	<div class="container">
		<div ng-view></div>
	</div>	
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-route.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-resource.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-cookies.js"></script>
	<script src="http://cdnjs.cloudflare.com/ajax/libs/restangular/1.3.1/restangular.js"></script>
	
	<script src="frontEnd/module.js"></script>
	
	<script src="frontEnd/home/HomeController.js"></script>
	
	<script src="frontEnd/cities/CityDetailController.js"></script>
	
	<script src="frontEnd/dataservice.js"></script>
</body>

</html>