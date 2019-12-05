<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: OPTIONS, POST, GET");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json; charset=utf-8');

include("conexion.php");
// Conexión BD
$respuesta = ["respuesta" => "",
                "descripcion" => ""];
if(isset($_GET["usuario"]) && isset($_GET["contrasena"])){
    $sql = "SELECT * from usuario where usuario = '". $_GET["usuario"] . "' 
            AND contrasena = '" . $_GET["contrasena"]."'";
    $res = select($mbd, $sql);

    if(sizeof($res) > 0){
        $respuesta["respuesta"] = "ok";
        $respuesta["descripcion"] = $res[0];
        echo json_encode($respuesta);
    }else{
        $respuesta["respuesta"] = "error";
        $respuesta["descripcion"] = "Usuario y contrasena no registrados.";
        echo json_encode($respuesta);
    }

}else{
    $respuesta["respuesta"] = "error";
    $respuesta["descripcion"] = "Faltan Parámetros.";
    return json_encode("error");
}


?>