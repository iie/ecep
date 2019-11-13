<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$bd = 'endfid2019Oficial';
include("funciones.php");
include("conexion.php");

$sql = "SELECT * from rrhh.persona where run = '".strtoupper(str_replace(".","",$_GET["run"]))."' ";
$res = select($dbX, $sql);

$final = [];
foreach($res as $pers){
    // print_r($pers["id_persona"]);exit;
    $sql = "SELECT * FROM rrhh.persona_proyecto WHERE id_persona = ".$pers["id_persona"];
    $proy = select($dbX, $sql);
    // print_r($proy);exit;
    $sql = "SELECT * FROM rrhh.persona_postula WHERE id_persona_proyecto = " .$proy[0]["id_persona_proyecto"];
    $post = select($dbX, $sql);
    $pers["postula_coordinador"] = null;
    if(sizeof($post)>0){
        foreach ($post as $_post) {
            if($_post["id_rol_proceso"] == 8){
                $pers["postula_examinador"] = true;
            }
            if($_post["id_rol_proceso"] == 9){
                $pers["postula_supervisor"] = true;
            }
            if($_post["id_rol_proceso"] == 1002){
                $pers["postula_tecnico"] = true;
            }
            if($_post["id_rol_proceso"] == 1001){
                $pers["postula_tecnico"] = true;
            }
            if($_post["id_rol_proceso"] == 1003){
                $pers["postula_coordinador"] = true;
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
    if(sizeof($post)>0){
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

header('Content-Type: application/json');
echo json_encode($final);
?>