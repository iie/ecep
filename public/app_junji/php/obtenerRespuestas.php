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

if(isset($_GET["usuario"])){
    $sql = "SELECT id_usuario, programa FROM usuario WHERE usuario = '" . $_GET["usuario"] . "'";
    $res = select($mbd, $sql);
    
    if(sizeof($res)>0){
        $sql2 = "SELECT usuario.usuario,
                area.nombre as area, 
                area.id_area, 
                dimension.id_dimension, 
                dimension.dimension, 
                elemento_gestion.id_elemento_gestion,
                elemento_gestion.elemento_gestion,
                alternativa.id_alternativa,
                alternativa.alternativa,
                respuesta_usuario.id_alternativa as respuesta
                FROM
                usuario
                INNER JOIN area ON (area.tipo_jardin = usuario.programa)
                INNER JOIN dimension ON (dimension.id_area = area.id_area)
                INNER JOIN elemento_gestion ON (dimension.id_dimension = elemento_gestion.id_dimension)
                LEFT JOIN alternativa ON (alternativa.id_elemento_gestion = elemento_gestion.id_elemento_gestion)
                LEFT JOIN respuesta_usuario ON (respuesta_usuario.id_usuario = usuario.id_usuario AND respuesta_usuario.id_elemento_gestion = elemento_gestion.id_elemento_gestion)
                WHERE usuario.usuario = " . $_GET["usuario"];
        $res2 = select($mbd, $sql2);
        // arreglo($res2);exit;
        $arr = [];
        $cont = 0;
        foreach($res2 as $value){
            $cont++;
            $areas[$value["id_area"]] = $value["area"];
            $dimensiones[$value["id_dimension"]] = $value["dimension"];
            $preguntas[$value["id_elemento_gestion"]] = $value["elemento_gestion"];
            $alternativas[$value["id_alternativa"]] = $value["alternativa"];
            
            // TODO: Traer datos reales cuando estén en la tabla de alternativas (Por ahora se envían como prueba)
            $arr[$value["id_area"]][$value["id_dimension"]][$value["id_elemento_gestion"]]["respuesta"] = $value["respuesta"];
            $arr[$value["id_area"]][$value["id_dimension"]][$value["id_elemento_gestion"]][$cont] = "alternativa" . $cont;
        }

        $final = [];
        foreach($arr as $id_area => $dimension){
            foreach($dimension as $id_dimension => $pregunta){
                foreach ($pregunta as $id_pregunta => $alternativa) {
                    foreach ($alternativa as $id_alternativa => $valor) {
                        if($id_alternativa != "respuesta"){
                            $alt["nombre_alternativa"] = isset($alternativas[$id_alternativa]) ? $alternativas[$id_alternativa] : 0;
                            $alt["id_alternativa"] = $id_alternativa;
                            $alt["marcada"] = false;
                            $aux_alt[] =isset($alt) ? $alt :0;
                        }else{
                            $respuesta = $valor;
                        }
                    }
                    if($respuesta != null){
                        foreach ($aux_alt as $key => $valores) {
                            if($valores["id_alternativa"] == intval($respuesta)){
                                $aux_alt[$key]["marcada"] = true;
                            }
                        }
                    }
                    $preg["nombre_pregunta"] = $preguntas[$id_pregunta];
                    $preg["id_pregunta"] = $id_pregunta;
                    $preg["datos"] = $aux_alt;
                    unset($aux_alt);
                    $aux_preg[] = $preg;
                }
                $_dim["nombre_dimension"] = $dimensiones[$id_dimension];
                $_dim["id_dimension"] = $id_dimension;
                $_dim["datos"] = $aux_preg;
                unset($aux_preg);
                $aux_dim[] = $_dim;
            }
            $_area["nombre_area"] = $areas[$id_area];
            $_area["id_area"] = $id_area;
            $_area["datos"] = $aux_dim;
            unset($aux_dim);
            $final[] = $_area;
        }
        $respuesta["respuesta"] = "ok";
        $respuesta["descripcion"] = $final;
        echo json_encode($respuesta);
    }
}else{
    $respuesta["respuesta"] = "error";
    $respuesta["descripcion"] = "Faltan Parámetros.";
    echo json_encode($respuesta);
}
?>