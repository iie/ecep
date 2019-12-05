<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: OPTIONS, POST, GET");
header("Access-Control-Allow-Headers: *");
//header('Content-Type: application/json; charset=utf-8');

include("conexion.php");

// $file = file("txt/area.txt");
// foreach($file as $fileAux){
	// $camposAux = explode("\t", $fileAux);
	// $sql = "insert into area (id_area_junji, nombre,descripcion, tipo_jardin,orden,nombre_corto) values (	\"".trim($camposAux[0])."\",  \"".trim($camposAux[2])."\" ,   \"".trim($camposAux[3])."\",   \"".trim($camposAux[4])."\", 
		  // \"".trim($camposAux[5])."\",   \"".trim($camposAux[6])."\") ; <br/>";

	// $res = insert($mbd, $sql);
// }	

// $file = file("txt/dimension.txt");
// foreach($file as $fileAux){
	// /*
    // [0] => 1
    // [1] => 2019
    // [2] => 1
    // [3] => Visión Estratégica 
    // [4] => Describe cómo la Dirección del jardín infantil proyecta su gestión, la planifica y la orienta al logro de sus metas.
    // [5] => 1.10
    // [6] => 1
    // [7] => Se valida la existencia de práctica(s) efectiva(s) en el/los elemento(s) (insertar números de las dimensiones acompañados de las letras de los elementos pertinentes), a través de (insertar prácticas que den cuenta de estas mejoras).  En el/los elemento(s) de gestión se observa(n) (insertar número de elemento y los datos que evidencien los resultados específicos que se obtuvieron de cada elemento de gestión evaluado en este nivel).  Se sugiere para el/los elemento(s): (insertar el/los elemento(s) señalando las mejoras específicas recomendadas para cada uno)     Es posible ratificar práctica(s) evaluada(s) y mejorada(s) tales como: (señalar las prácticas para el/los elemento(s) de gestión pertinente(s), cómo se han evaluado y qué modificaciones se han incorporado para cada una).  Sin embargo esta(s) práctica(s) carece(n) de efectividad, ya que no ha(n) logrado los objetivos trazados para cada uno de los elementos de gestión (nombrar elemento(s) pertinente(s) y señalar meta y/o objetivo-en contraste con el logro de cada uno de ellos).  Se sugiere para el/los elemento(s) (insertar elemento(s) de gestión pertinente(s) y señalar una posible modificación de la práctica que permita lograr la meta para el elemento y adecuar estas metas a la realidad del jardín infantil. Realizar esto con cada elemento de gestión evaluado en este nivel).    Se observa en el/los elemento(s) (insertar elemento(s) de gestión) una práctica orientada a resultados, puesto que se evidencian prácticas identificables y/o medibles cualitativas como cuantitativamente, tales como: (señalar práctica relacionándola con los objetivos y/o metas para cada una. Realizar esto con cada uno de los elementos de gestión pertinentes).  Sin embargo, se evidencia que las prácticas para el/los elemento(s) (insertar elemento(s) de gestión pertinente(s) no han sido evaluadas ni mejoradas.   Se propone para el elemento (insertar cada elemento de gestión pertinente con los insumos sugeridos de implementar para su mejora, basados en las evidencias y experticia de los validadores).    Se autentifica una práctica con despliegue total, (señalar la práctica y el elemento al que pertenece) ya que integra a todos los actores y tiene alcance en todos los contenidos relevantes del elemento de gestión. Esto se evidencia en (señalar el alcance, en términos de amplitud y profundidad, de la práctica) (Realizar esto con cada una de las prácticas evaluadas en este nivel).  No obstante, la(s) práctica(s) (señalar las prácticas realizadas en estos elementos) carece(n) de orientación al logro de resultados identificables, pues no se observan metas u objetivos que orienten la gestión.  Se sugiere establecer metas u objetivos que permitan la medición y el logro de los resultados esperados por la gestión del jardín infantil. Por ejemplo,  (señalar posibles metas que se pueden establecer para cada elemento de gestión, basándose en elementos técnicos y experticia de los validadores).    Se valida(n) práctica(s) sistemática(s) pues se constata un proceso secuencial y repetitivo/ una práctica que podría repetirse porque está planificada volver a ejecutarla (elegir una de las dos frases anteriores según corresponda la realidad verificada, si hay proceso secuencial o si es sólo una práctica realizada una vez), como por ejemplo (señalar las prácticas identificadas para cada elemento de gestión y hacer la conexión con los contenidos relevantes que está cubriendo).  Sin embargo, (señalar la práctica y el elemento) tiene(n) un despliegue parcial debido a que no abarca(n) todos los contenidos relevantes del elemento de gestión, pues requiere que (señalar aquellos aspectos que no se están trabajando con la práctica, es decir, no tiene profundidad y/o amplitud. Realizar esto con cada práctica evaluada en este nivel).  Se propone para el elemento de gestión (insertar elemento pertinente) definir acciones como: (señalar acciones que permitan complementar la práctica y alcanzar el despliegue total. Realizar esto con cada elemento de gestión evaluado en este nivel). De esta manera, se podría alcanzar el despliegue necesario para cada una de la(s) práctica(s) desarrollada(s).    Se observa la existencia de acciones aisladas que no se constituyen sistemáticamente, ya que la(s) práctica(s) (insertar la(s) práctica(s) observada(s)) carece(n) de un procedimiento, por ende, se desprende que es/son anecdótica(s).  Se recomienda que se establezca una práctica que considere (insertar insumos y procedimientos recomendados para implementar la(s) práctica(s) de modo sistemático).    Finalmente, se destaca que la dimensión (insertar nombre de la dimensión) posee, en su mayoría, prácticas (indicar el nivel en el cual se evaluaron la mayoría de las prácticas) y que es importante desarrollar acciones que le permitan elevar el nivel alcanzado en las prácticas restantes (Esto aplica para todos los niveles exceptuando que todos los elementos de gestión de la dimensión, se encuentren en nivel 5). Además, se deja consignado que los medios de verificación revisados para esta dimensión son: (señalar los medios de verificación que fueron presentados durante la visita).  
    // [8] => 1.1
	// */
	// $camposAux = explode("\t", $fileAux);
	
	// $sql = "insert into dimension (id_dimension_junji, 
									// id_area,
									// dimension, 
									// descripcion,
									// ponderacion,
									// orden,
									// retroalimentacion,
									// nombre_corto	
										// ) values (	
									// \"".trim($camposAux[0])."\",  
									// \"".trim($camposAux[2])."\",   
									// \"".trim($camposAux[3])."\",   
									// \"".trim($camposAux[4])."\", 
									// \"".trim($camposAux[5])."\",   
									// \"".trim($camposAux[6])."\",
									// \"".trim($camposAux[7])."\",
									// \"".trim($camposAux[8])."\"
									// ); ";
	
	// $res = insert($mbd, $sql);
// }	

// $file = file("txt/elementos_gestion.txt");
// foreach($file as $fileAux){

	// $camposAux = explode("\t", $fileAux);
	
	// $sql = "insert into elemento_gestion (id_elemento_gestion_junji, 
									// id_dimension	,
									// elemento_gestion	, 
									// orden	,
									// nombre_corto	,
									// indicador	
										// ) values (	
									// \"".trim($camposAux[0])."\",  
									// \"".trim($camposAux[1])."\",   
									// \"".trim($camposAux[2])."\",   
									// \"".trim($camposAux[3])."\", 
									// \"".trim($camposAux[4])."\",   
									// \"".trim($camposAux[5])."\"
									// ); ";
	
	// $res = insert($mbd, $sql);
// }	

// $file = file("txt/alternativas.txt");
// foreach($file as $fileAux){

	// $camposAux = explode("\t", $fileAux);
	
	// $sql = "insert into alternativa (id_elemento_gestion, 
									// alternativa		,
									// nota	, 
									// estrato	,
									// id_region	
										// ) values (	
									// \"".trim($camposAux[0])."\",  
									// \"".trim($camposAux[1])."\",   
									// \"".trim($camposAux[2])."\",   
									// \"".trim($camposAux[3])."\", 
									// \"".trim($camposAux[4])."\"   
									// ); ";

	// $res = insert($mbd, $sql);
// }



?>