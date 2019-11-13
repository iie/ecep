<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$bd = 'endfid2019Oficial';
include("funciones.php");
include("conexion.php");



//SE OBTIENEN TODAS LAS REGIONES
$regionNombreSql = "SELECT id_institucion as id, institucion as nombre_institucion from infraestructura.institucion where participa = true order by nombre_institucion";
$region = select($dbX, $regionNombreSql);

header('Content-Type: application/json');
echo json_encode($region);
?>