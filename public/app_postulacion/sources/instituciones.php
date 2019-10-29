<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include("funciones.php");
include("conexion.php");

//SE OBTIENEN TODAS LAS REGIONES
// Filtrado sin liceos
$regionNombreSql = "SELECT id_institucion as id, institucion as nombre_institucion from infraestructura.institucion where id_institucion NOT IN (353, 395,350, 351, 358, 349) order by nombre_institucion";
$region = select($dbX, $regionNombreSql);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: OPTIONS, POST, GET");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');
echo json_encode($region);
?>