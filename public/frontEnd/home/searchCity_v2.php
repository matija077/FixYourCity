<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>

<?php

$check = checkCityOrCountry('Belgium');
if($check === false)    
    echo 'Not Valid country';
else
{
    echo 'Valid: <pre>';
    print_r($check);
    echo '</pre>';
}

function checkCityOrCountry($name)
{
    $checkCity = $name;
    $checkCity = mb_strtolower($checkCity, "UTF-8");

    $countries = vkapi('database.getCountries', array(
            'need_all' => 1,
            'count' => 1000), null, true);
   $countries = $countries['response'];

    $validString = false;

    $cCnt = count($countries);
    for($i = 0; $i < $cCnt; ++$i)
    {
        $title = mb_strtolower($countries[$i]['title'], "UTF-8");
        if(mb_strpos($title, $checkCity, 0, 'UTF-8') !== false)
        {
            $validString = $countries[$i];
            break;
        }

        /*search by cities too, but extremely long*/
        // $cities = vkapi('database.getCities', array(
        //     'country_id' => $countries[$i]['cid'],
        //     'q' => $checkCity,
        //     'count' => 1000), null, true);
        // $cities = $cities['response'];
        // if(count($cities) > 0)
        // {
        //     $validString = $cities;
        //     break;
        // }
    }

    return $validString;
}
/**
 * @function vkapi          Perform a request to api VK
 * @param  string $method   Name of method
 * @param  array   $params  Post parameters
 * @param  string  $token   Secure token if you need it
 * @param  boolean $array   If = true, will returns an array, in other case - an object
 * @return array            Result
 */
function vkapi($method, $params = array(), $token=null, $array=false) {
    try
    {
        $rid = 0;
        if(isset($token))
            $params["access_token"] = $token;

        $params['lang'] = 'en';
        $paramstr = http_build_query($params);
        $url = "https://api.vk.com/method/" . $method . "?" . $paramstr;

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = json_decode(curl_exec($ch));

        if($array == true)
        {
            $result = json_decode(json_encode($result), true);
        }

        return $result;

    }
    catch(Exception $e)
    {
        throw new Exception('VK API: '.$e->getMessage());
    }
}
?>

</body>
</html>

