<?php 

if(isset($_GET["path"])){
	$img = "/var/www/html/recursos/img".$_GET["path"]; 
	$type = pathinfo($path, PATHINFO_EXTENSION);
	header ('content-type: '.$type); 
	if(file_exists($img)){
		readfile($img); 
	}		
}

?> 