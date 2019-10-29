<?php

// https://2019.diagnosticafid.cl/public/api/regiones/idregionbyidcomuna

//Route::options('/regiones/idregionbyidcomuna', 'Api\postulacion\PostulacionController@corssAccept');
Route::middleware('cors')->post('/regiones/idregionbyidcomuna', 'Api\postulacion\PostulacionController@regionPorIdComuna');


// https://2019.diagnosticafid.cl/public/api/usuarios/saveusuario
//Route::options('/usuarios/saveusuario', 'Api\postulacion\PostulacionController@corssAccept');
Route::middleware('cors')->post('/usuarios/saveusuario', 'Api\postulacion\PostulacionController@saveUsuario');

// https://2019.diagnosticafid.cl/public/api/personas/subirarchivos
//Route::options('/personas/subirarchivos', 'Api\postulacion\PostulacionController@corssAccept');
Route::middleware('cors')->post('/personas/subirarchivos', 'Api\postulacion\PostulacionController@subirArchivos');
Route::middleware('cors')->get('/personas/descarga/archivo/{id_persona_archivo}', 'Api\postulacion\PostulacionController@descargaArchivo');
?>