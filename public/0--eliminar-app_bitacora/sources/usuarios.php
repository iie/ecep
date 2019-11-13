<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$bd = 'endfid2019Oficial';
include("funciones.php");
include("conexion.php");


$sql = "SELECT id_usuario as id , usuario, contrasena from core.usuario where borrado = false and usuario = '".$_GET["usuario"]."' ";
$res = select($dbX, $sql);

header('Content-Type: application/json');
echo json_encode($res);
?>