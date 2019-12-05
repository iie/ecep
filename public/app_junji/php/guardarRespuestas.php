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

if(isset($_GET["id_usuario"]) && isset($_GET["id_elemento_gestion"]) && isset($_GET["id_alternativa"])){
    $sql = "SELECT id_usuario FROM usuario WHERE id_usuario = " . $_GET["id_usuario"];
    $res = select($mbd, $sql);
    
    if(sizeof($res) > 0){
        $sql2 = "SELECT id_elemento_gestion
                FROM
                elemento_gestion
                WHERE id_elemento_gestion = " . $_GET["id_elemento_gestion"];
        $res2 = select($mbd, $sql2);

        if(sizeof($res2) > 0){
            $sql3 = "SELECT id_alternativa
                FROM
                alternativa
                WHERE id_alternativa = " . $_GET["id_alternativa"];
            $res3 = select($mbd, $sql3);
            if(sizeof($res3) > 0){
                $sql4 = "SELECT id_respuesta_usuario
                        FROM
                        respuesta_usuario
                        WHERE id_elemento_gestion = " .  $_GET["id_elemento_gestion"] . "
                        AND id_usuario = " . $_GET["id_usuario"];
                $res4 = select($mbd, $sql4);
                if(sizeof($res4) > 0){
                    $insert = "UPDATE respuesta_usuario SET id_alternativa = " . $_GET["id_alternativa"] . "
                                WHERE id_respuesta_usuario = " . $res4[0]["id_respuesta_usuario"];
                }else{
                    $insert = "INSERT INTO respuesta_usuario (id_usuario, id_elemento_gestion, id_alternativa)
                                VALUES (" . $_GET["id_usuario"] . ", " . $_GET["id_elemento_gestion"] . ", " . $_GET["id_alternativa"] . ")";
                }
                $res_insert = insert($mbd, $insert);
                // arreglo($insert);exit;
                $respuesta["respuesta"] = "ok";
                $respuesta["descripcion"] = "Se ha guardado.";
                echo json_encode($respuesta);
            }else{
                $respuesta["respuesta"] = "error";
                $respuesta["descripcion"] = "Alternativa no encontrada.";
                echo json_encode($respuesta);
            }
        }else{
            $respuesta["respuesta"] = "error";
            $respuesta["descripcion"] = "Elemento de gestión (pregunta) no encontrado.";
            echo json_encode($respuesta);
        }
    }else{
        $respuesta["respuesta"] = "error";
        $respuesta["descripcion"] = "Usuario no encontrado.";
        echo json_encode($respuesta);
    }
}else{
    $respuesta["respuesta"] = "error";
    $respuesta["descripcion"] = "Faltan Parámetros.";
    echo json_encode($respuesta);
}
?>