<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Conexión BD
$usuario = "prcon2019_junji";
$contraseña = "(ZD6VE?_6g#p";
$mbd = new PDO('mysql:host=localhost;dbname=prcon2019_junji;charset=utf8', $usuario, $contraseña);

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

function update($dbX, $sql){
	try {
		$stmt = $dbX->prepare($sql);
		$stmt->execute();	
    } 
	catch (Exception $e) {
        echo $e->getMessage();
        exit;
    }		
}

function insert($dbX, $sql){
	try {
		$stmt = $dbX->prepare($sql);
		$stmt->execute();	
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