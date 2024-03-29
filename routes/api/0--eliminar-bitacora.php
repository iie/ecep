<?php

/* Regiones-Comunas */

Route::get('/regiones/indexcomplementaria', 'Api\bitacora\RegionController@indexComplementaria');
Route::get('/universidades/indexbyidregion', 'Api\bitacora\CentroInstitucionController@indexByIdRegion');
Route::get('/sedes/indexbyid', 'Api\bitacora\CentroAplicacionController@indexById');

Route::post('/sedes/saveSede', 'Api\bitacora\CentroAplicacionController@saveSede');
Route::options('/sedes/saveSede', 'Api\bitacora\CentroAplicacionController@corsAccept'); 

Route::post('/laboratorio/saveLaboratorio', 'Api\bitacora\LaboratorioController@saveLaboratorio');
Route::options('/laboratorio/saveLaboratorio', 'Api\bitacora\LaboratorioController@corsAccept');

Route::get('/laboratorio/indexbydiscriminador', 'Api\bitacora\LaboratorioController@indexByDiscriminador');

Route::post('/laboratorio/saveContingencia', 'Api\bitacora\LaboratorioController@saveContingencia');
Route::options('/laboratorio/saveContingencia', 'Api\bitacora\LaboratorioController@corsAccept');

Route::get('/laboratorio/indexlab', 'Api\bitacora\LaboratorioController@indexLab');

Route::post('/laboratorio/saveBlock', 'Api\bitacora\LaboratorioController@saveBlock');

Route::get('/aplicaciones/indexcomplementariabysedeid', 'Api\bitacora\AplicacionController@indexComplementariaBySedeId');
/*Route::get('/comunas/index', 'Api\bitacora\ComunaController@index');
Route::get('/comunas/indexbyregion', 'Api\bitacora\ComunaController@indexByRegion');
Route::get('/comunas/indexbyid', 'Api\bitacora\ComunaController@indexById');*/
Route::post('/login/login-bitacora' , 'Api\bitacora\LoginController@loginBitacora');
Route::options('/login/login-bitacora', 'Api\bitacora\LoginController@corsAccept');

?>