<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>

<script type="text/javascript">
	
	function showHideRegion() {
		if (document.getElementById("country").value === "USA") {
			//document.getElementById("prikaz").innerHTML = ("Upisao si USA.");
			document.getElementById("regionDIV").style.display = "block";
		} else document.getElementById("regionDIV").style.display = "none";
		//document.write("Upisao si USA.");
		
	}

</script>

<?php


if (isset($_POST['enteredRegion']) && !empty($_POST['enteredRegion'])) {
	$region = $_POST['enteredRegion'];
	$region = implode(' ', array_map('ucfirst', explode(' ', $region)));
	$region_to_search = $region;
	$region = str_replace(" ", "+", $region);
	$region = implode('+', array_map('ucfirst', explode('+', $region)));
} else {
	$region = "";
	$region_to_search = "";
}

//$check = checkCountry('Croatia');
//echo var_dump($check);
if (isset($_POST['enteredCountry']) && !empty($_POST['enteredCountry']) && isset($_POST['enteredCity']) && !empty($_POST['enteredCity'])) {
		$name = $_POST['enteredCountry'];
		$name = str_replace(" ", "+", $name);
		$name = implode('+', array_map('ucfirst', explode('+', $name)));
		$numbah = checkCountry($name);
	
		if ($region != "") {
		$regionNumbah = checkRegion($region, $numbah);
		} else $regionNumbah = "";

		if ($numbah == "") {
			echo "Country not found.";
		}
		else {
			checkCity($region, $numbah, $regionNumbah);
		}
	
}


/*
$numbah = checkCountry($name);
if ($numbah != "") echo $numbah;
else echo "Country not found.";
checkCity($numbah);*/

//$check = checkCityOrCountry('Hungary');
//echo var_dump($check);

function checkCountry($name){

	$name = str_replace("+", " ", $name);
	
	//dobivamo sve drzave, trebaju nam jer ne zelimo provjeravati bas sve gradove u cijelom svijetu, vec samo onaj koji korisnik zeli u odredenoj drzavi
    $countries = file_get_contents('http://api.vk.com/method/database.getCountries?need_all=1&count=1000&lang=en');

    //dohvati poziciju $countries gdje je odredena drzava smjestena na stranici
    $pozicija = strpos($countries, $name);
   
    //izvuci mi samo CID za drzavu koju zeli user
    $razdvoji = substr($countries, $pozicija-18, 9);

   //bazirano na dobivenom stringu za CID, izvuci samo brojeve
   $broj = preg_replace("/[^0-9]/","",$razdvoji);
   //echo $broj;

    /*$arr = json_decode($countries, true);
    foreach ($arr['response'] as $country) {
        if (mb_strtolower($country['title']) === mb_strtolower($name)) {
            //return true;
        }
    }*/
    echo $broj . "<br />";
     //vrati dobiveni CID za daljnu provjeru postoji li grad
  	 return $broj;
    //return false;
}

function vratiCyrilic($latinString) {
	 $cyr  = array('а','б','в','г','д','e','ж','з','и','й','к','л','м','н','о','п','р','с','т','у', 
        'ф','х','ц','ч','ш','щ','ъ','ь', 'ю','я','А','Б','В','Г','Д','Е','Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У',
        'Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ь', 'Ю','Я' );
        $lat = array( 'a','b','v','g','d','e','zh','z','i','y','k','l','m','n','o','p','r','s','t','u',
        'f' ,'h' ,'ts' ,'ch','sh' ,'sht' ,'a' ,'y' ,'yu' ,'ya','A','B','V','G','D','E','Zh',
        'Z','I','Y','K','L','M','N','O','P','R','S','T','U',
        'F' ,'H' ,'Ts' ,'Ch','Sh' ,'Sht' ,'A' ,'Y' ,'Yu' ,'Ya' );
        $cyrilicString = str_replace($lat, $cyr, $latinString);
        //$textlat = str_replace($lat, $cyr, $textlat);
        //echo("$textcyr $textlat");
        return $cyrilicString;
        echo $cyrilicString;
}


function checkCity($region, $numbah, $regionNumbah){

	//$viseGradova = 0;

	if ((isset($_POST['enteredCity'])) && !empty($_POST['enteredCity'])) {
		$grad = $_POST['enteredCity'];
		$grad = implode(' ', array_map('ucfirst', explode(' ', $grad)));
		$string_to_search = $grad;
		//echo $string_to_search;
		$grad = str_replace(" ", "+", $grad);

		$grad = implode('+', array_map('ucfirst', explode('+', $grad)));
		//echo $grad;
		
	}

	 if ($region != "") {
	 	//$cities = file_get_contents('http://api.vk.com/method/database.getCities?country_id=' . $numbah . '&need_all=1&count=1000&q=' . $grad . '&lang=en');
	 	$cities = file_get_contents('https://api.vk.com/method/database.getCities?country_id=' . $numbah . '&need_all=1&count=1000&region_id=' . $regionNumbah .'&q=' . $grad . '&lang=en');
	 	//echo "region not empty";
	 } else {
	 	$cities = file_get_contents('http://api.vk.com/method/database.getCities?country_id=' . $numbah . '&need_all=1&count=1000&q=' . $grad . '&lang=en');
	 	//echo "region empty";
	 }
	 //echo $cities;

	 /*if (strpos($cities, $grad) == true) {
	 	echo "<br/>Grad postoji";
	 }*/
	/* $upit = "\"title\"" . ":" . "\"$grad\"";
	 //echo $upit;
	 //if ((strpos($cities, $upit) == true)) {
	 if(preg_match("~\b$upit\b~", $cities)) {
        echo "<br>Grad postoji</br>";
        echo "\"title\"" . ":" . "\"$grad\"";
        echo $cities;
	}*/
		//$cities je zapravi json string
	$json_array = json_decode($cities, true);
	
	//$string_to_search = $grad;
	$region_to_search = $region;

	$podrucje = "";

	//$trstr = iconv("UTF-8", "ISO-8859-1//TRANSLIT", $string_to_search);
	$cirilica = vratiCyrilic($string_to_search);
	//echo "ruski: " . $cirilica;

	$found = false;
	for($i = 0; $i < count($json_array['response']); ++$i){
	    //if($json_array['response'][$i]['title'] == $string_to_search && $json_array['response'][$i]['region'] == $region_to_search){
	    		//if($json_array['response'][$i]['region'] == $region_to_search) {
		if($json_array['response'][$i]['title'] == $string_to_search || $json_array['response'][$i]['title'] == $cirilica) {
		
	        $found = true;
	        $grad = $json_array['response'][$i]['title'];
	        if(isset($json_array['response'][$i]['region'])) {
	        	$regija = $json_array['response'][$i]['region'];
	        } else $regija = "";

	        /*echo "<script type='text/javascript'>
	        	if ($json_array.hasOwnProperty('area'))
	        		$podrucje = $json_array['response'][$i]['area'];
	        	</script>";*/

	    
	        //if ($json_array['response'][$i]['area']) 
	          //if (isset($json_array['area']))

	        	//$podrucje = $json_array['response'][$i]['area'];

	        //var_dump(array_key_exists('region', $json_array));
	        /*if (typeof ($json_array.area != "undefined")) {
		       echo "Area postoji";
		     }*/
		      //break;
		   if ($region != "") {
		   	break;
		   } else {
		   	 //$viseGradova = 1;
		   	 echo "<br />City: " . $grad . "<br />";
        	 echo "Region: " . $regija . "<br />";
       		 //echo "Podrucje: " . $podrucje . "<br />";
		   }

		   if(isset($json_array['response'][$i]['area'])) {
	        		echo "Area: " . $json_array['response'][$i]['area'] . "<br />";
	        }
		
		 	 /*if (strpos($cities, "area")) {
	        	 $podrucje =  $json_array['response'][$i]['area'];
	        	 echo "Podrucje: " . $podrucje;
	 	     }*/
		}
	}

			//if ($viseGradova == 1) echo "<br />->Pronasao vise gradova s istim imenom. <br />";

/*********/

	$json_array = json_decode($cities, true);
	//$string_to_search = $grad;
	$region_to_search = $region;

	$found2 = false;

	$regionCyrilic = vratiCyrilic($region_to_search);

	for($i = 0; $i < count($json_array['response']); ++$i){

		if(isset($json_array['response'][$i]['region'])) {
	    	if ($json_array['response'][$i]['region'] == $region_to_search || $json_array['response'][$i]['region'] == $region_to_search) {

	    	 $found2 = true;
	        //$grad = $json_array['response'][$i]['title'];
	        $regija = $json_array['response'][$i]['region'];

	        break;
	     }
	    }
	}


	if($found){
	    echo "<br>City exists!</br>";
        //echo "\"title\"" . ":" . "\"$grad\"";
        //echo "Naziv: " . $grad . "<br />";
        //echo "Regija: " . $regija . "<br />";
        //echo "Podrucje: " . $podrucje . "<br />";
        //if ($area != "") echo "Podrucje: " . $area;
	}else{
	    echo "<br>City does not exists.</br>";
	}
	if ($found2) {
		echo "Naziv: " . $grad . "<br />";
		echo "City in entered region exists!<br />";
		echo "Regija: " . $regija . "<br />";
	}	else {
		if ($region != "") echo "<br>City in region does not exists.<br />";
	}
}


function checkRegion($region, $numbah){

	 $regionContent = file_get_contents('http://api.vk.com/method/database.getRegions?country_id=' . $numbah . '&need_all=1&count=1000&lang=en');

	 $pozicijaRegija = strpos($regionContent, $region);

	  $razdvojiRegija = substr($regionContent, $pozicijaRegija-18, 15);

	  $brojRegija = preg_replace("/[^0-9]/","", $razdvojiRegija);

	  echo $brojRegija;

	  return $brojRegija;

}

?>

<form action="validateCity.php" method="POST">
	 	Enter city: <input type="textbox" name="enteredCity"/>
	 	Enter country:<input type="textbox" id="country" onKeyPress="showHideRegion()" onKeyUp="showHideRegion()" onfocus="showHideRegion()" onblur="showHideRegion()" name="enteredCountry"/>
	 	<div id="regionDIV" style="display:none">Enter region (USA only):<input type="textbox" id="region" name="enteredRegion"/></div>
	 	<!--Enter country:<input type="textbox" id="country" name="enteredCountry"/>
	 	<div id="regionDIV">Enter region (optional):<input type="textbox" id="region" name="enteredRegion"/></div>-->
	 	<input type ="submit" value="Check"/>
</form>

</body>
</html>
