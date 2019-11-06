<?php

//Route::options('/regiones/idregionbyidcomuna', 'Api\postulacion\PostulacionController@corssAccept');
Route::middleware('cors')->post('/regiones/idregionbyidcomuna', 'Api\postulacion\PostulacionController@regionPorIdComuna');


Route::middleware('cors')->post('/regiones/obtener-region-por-comuna', 'Api\postulacion\PostulacionController@obtenerIdRegionPorComuna');
// https://2019.diagnosticafid.cl/public/api/usuarios/saveusuario
Route::middleware('cors')->post('/comunas/comunas-aplicacion', 'Api\postulacion\PostulacionController@obtenerComunasConAplicaciones');
//Route::options('/usuarios/saveusuario', 'Api\postulacion\PostulacionController@corssAccept');
Route::middleware('cors')->post('/usuarios/saveusuario', 'Api\postulacion\PostulacionController@saveUsuario');
Route::middleware('cors')->post('/usuarios/saveusuario2', 'Api\postulacion\PostulacionController@saveUsuario2');
Route::middleware('cors')->post('/usuarios/saveusuariolite', 'Api\postulacion\PostulacionController@saveUsuarioLite');

// https://2019.diagnosticafid.cl/public/api/personas/subirarchivos
//Route::options('/personas/subirarchivos', 'Api\postulacion\PostulacionController@corssAccept');
Route::middleware('cors')->post('/personas/subirarchivos', 'Api\postulacion\PostulacionController@subirArchivos');
Route::middleware('cors')->get('/personas/descarga/archivo/{id_persona_archivo}', 'Api\postulacion\PostulacionController@descargaArchivo');
?>