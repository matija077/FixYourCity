<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>

<?php

	$cityFound = false;

	if ((isset($_POST['enteredState'])) && !empty($_POST['enteredState'])) {
		$state = $_POST['enteredState'];
	} else $state = '';

	if ((isset($_POST['enteredCity'])) && !empty($_POST['enteredCity'])) {
		$city = $_POST['enteredCity'];
		$city = ucfirst($city);   // pretvori prvo slovo u veliko
		$town = $city . "_(town)";
		$city = str_replace(" ", "_", $city);
		$city = implode('_', array_map('ucfirst', explode('_', $city)));

		if (empty($state) == false) {
			$city = $city . ",_" . $state;
			$city = str_replace(" ", "_", $city);
			$city = implode('_', array_map('ucfirst', explode('_', $city)));
		}

		$link = "https://en.wikipedia.org/wiki/" . $city;
		$content = @file_get_contents($link);

		$searchValue = "class=\"postal-code\"";   //trazi za class="postal-code"
		$altSearchValue = "Cities and towns";
		$altAltSearchValue = "<a href=\"/wiki/City\" title=\"City\">City</a>";
		$village = "village";

		if (strpos($content, $searchValue) == false && strpos($content, $altSearchValue) == false
			&& strpos($content, $altAltSearchValue) == false) {
		echo "Couldn't find city: " . "<i>$city</i>";
		} else {
			$cityFound = true;
			if (strpos($content, $village) == true) {
				echo "Village " . "<i>$city</i>" . " has been found!";
			}
			else echo "City " . "<i>$city</i>" . " has been found!";
		}

		if (strpos($content, $town) == true) {
			echo "<br/>... but town " . "<i>$town</i>" . " has been found!";
		}

		if ($cityFound == false) {
			echo ". Try filling the <b>state</b> info below.";
		}
		
	} else echo "Please enter city name.";

?>

 <form action="searchIfCityExists.php" method="POST">
 	Enter city: <input type="textbox" name="enteredCity"/>
 	Enter state (optional):<input type="textbox" id="state" name="enteredState"/>
 	<input type ="submit" value="Check"/>
 </form>

</body>
</html>