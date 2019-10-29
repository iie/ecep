<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//$bd = 'endfid2019Oficial';
include("funciones.php");
include("conexion.php");



//SE OBTIENEN TODAS LAS REGIONES
$regionNombreSql = "SELECT id_comuna as id, nombre as nombre_comuna from core.comuna where id_region = ".$_GET["region_id"] ." ORDER BY nombre";
$region = select($dbX, $regionNombreSql);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: OPTIONS, POST, GET");
header("Access-Control-Allow-Headers: *");
echo json_encode($region);
?>