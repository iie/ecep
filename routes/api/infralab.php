<?php

Route::middleware('auth:api')->post('obtener-datos-lab' , 'Api\VisitaTecnicaController@obtenerDatosLaboratorio');
Route::post('obtener-datos-visita' , 'Api\VisitaTecnicaController@obtenerDatosVisita');
Route::middleware('auth:api')->post('guardar-datos-lab' , 'Api\VisitaTecnicaController@guardarDatosLaboratorio');

?>