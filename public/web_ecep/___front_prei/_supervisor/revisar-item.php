<?php 
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

//ENCABEZADO
$path_to_file = 'html/enc_carga.html';
$file_contents = file_get_contents($path_to_file);
$file_contents = str_replace("{{no_mostrar_menu}}", 'style="display:none;"', $file_contents);
echo $file_contents; 

//BODY
include("html/revisar-item.html");

//PIE
$path_to_file = 'html/pie.html';
$file_contents = file_get_contents($path_to_file);
$jsUsar = "revisar-item.js";
$file_contents = str_replace("{{js_incluir}}", '<script type="text/javascript" src="js/'.$jsUsar.'"></script>', $file_contents);
echo $file_contents; 

