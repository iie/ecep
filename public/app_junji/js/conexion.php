<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Conexión BD
$usuario = "root";
$contraseña = "";
$mbd = new PDO('mysql:host=localhost;dbname=junji;charset=utf8', $usuario, $contraseña);

function select($mbd, $sql){
	try {
		$stmt = $mbd->query($sql);
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

function arreglo($arr){
	echo "<pre>";
	print_r($arr);
	echo "</pre>";
}
?>