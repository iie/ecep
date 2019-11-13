<?php
function select($dbX, $sql){
	try {
		$stmt = $dbX->query($sql);
		if($stmt){
			$line = $stmt->fetchAll(PDO::FETCH_ASSOC);
			return $line;
		}	
		else{
			echo "error";
		}
    } 
	catch (Exception $e) {
        echo $e->getMessage();
        exit;
    }	
}

function arreglo($array){
	if(is_Array($array)){
		echo "<pre>";
		print_r($array);
		echo "</pre>";
	}
	else{
		echo "no es arreglo :(";
	}
}

function multibyte_trim($str)
{
	if (!function_exists("mb_trim") || !extension_loaded("mbstring")) {
		return preg_replace("/(^\s+)|(\s+$)/u", "", $str);
	} else {
		return mb_trim($str);
	}
}
?>