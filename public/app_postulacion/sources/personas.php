<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//$bd = 'endfid2019Oficial';
include("funciones.php");
include("conexion.php");

$sql = "SELECT * from rrhh.persona where run = '".strtoupper(str_replace(".","",$_GET["run"]))."' ";
$res = select($dbX, $sql);

$final = [];
foreach($res as $pers){
    $sql = "SELECT usuario from core.usuario where id_usuario = " .($pers["id_usuario"]);
    $user = select($dbX, $sql);
    $pers["usuario"] = isset($user[0]["usuario"]) ? $user[0]["usuario"] : null;
    
    //$sql = "SELECT * FROM rrhh.persona_proyecto WHERE id_persona = ".$pers["id_persona"];
    //$proy = select($dbX, $sql);
    
    $post = [];
    //if(isset($proy[0])){
        $sql = "SELECT * FROM rrhh.persona_cargo WHERE id_persona = " .$pers["id_persona"];
        $post = select($dbX, $sql);
    //}
    $pers["postula_examinador_apoyo"] = null;
    $pers["postula_anfitrion"] = null;
    if(sizeof($post)>0){
        foreach ($post as $_post) {
            if($_post["id_cargo"] == 8){
                $pers["postula_examinador"] = true;
            }
            if($_post["id_cargo"] == 9){
                $pers["postula_supervisor"] = true;
            }
            if($_post["id_cargo"] == 1007){
                $pers["postula_examinador_apoyo"] = true;
            }
            if($_post["id_cargo"] == 1006){
                $pers["postula_anfitrion"] = true;
            }
        }
    }

    $arch = [
        "cedula_identidad" => null,
        "curriculum" => null,
        "certificado_antecedentes" => null,
        "certificado_titulo" => null,
    ];
    $sql = "SELECT * FROM rrhh.persona_archivo WHERE id_persona = ".$pers["id_persona"];
    $archivos = select($dbX, $sql);
    if(sizeof($archivos)>0){
        foreach ($archivos as $_arch) {
            if($_arch["tipo"] == "cedula_identidad"){
                $arch["cedula_identidad"] = $_arch["id_persona_archivo"];
            }
            if($_arch["tipo"] == "curriculum"){
                $arch["curriculum"] = $_arch["id_persona_archivo"];
            }
            if($_arch["tipo"] == "certificado_antecedentes"){
                $arch["certificado_antecedentes"] = $_arch["id_persona_archivo"];
            }
            if($_arch["tipo"] == "certificado_titulo"){
                $arch["certificado_titulo"] = $_arch["id_persona_archivo"];
            }
        }
    }
	
	if(!$pers["id_institucion"]){
		$pers["id_institucion"] = 1000;
	}
    $pers["archivos"] = $arch; 
    $final[] = $pers;
}
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: OPTIONS, POST, GET");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');
echo json_encode($final);
?>