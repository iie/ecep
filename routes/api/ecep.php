<?php

Route::get('web/login' , 'Api\ecep\LoginController@login');	

//Route::middleware('auth:api')->post('sede/lista' , 'Api\ecep\SedeController@lista');	

//SEDE

	Route::middleware('auth:api')->post('web/sede/lista' , 'Api\ecep\SedeController@lista');	
	Route::middleware('auth:api')->post('web/sede/obtenerDataLiceo' , 'Api\ecep\SedeController@obtenerDataLiceo');
	Route::middleware('auth:api')->post('web/sede/modificar' , 'Api\ecep\SedeController@modificar');
	Route::middleware('auth:api')->post('web/sede/guardar' , 'Api\ecep\SedeController@guardar');
//SALA

	Route::middleware('auth:api')->post('web/sala/lista' , 'Api\ecep\SalaController@lista');
	Route::middleware('auth:api')->post('web/sala/guardar' , 'Api\ecep\SalaController@guardar');
	Route::middleware('auth:api')->post('web/sala/modificar' , 'Api\ecep\SalaController@modificar');
	
//EVALUADO

	Route::middleware('auth:api')->post('web/evaluado/lista' , 'Api\ecep\EvaluadoController@lista');



//CENTRO OPERACIONES
	Route::middleware('auth:api')->post('web/centro/lista' , 'Api\ecep\CentroController@lista');
	Route::middleware('auth:api')->post('web/centro/guardar' , 'Api\ecep\CentroController@guardar');
	Route::middleware('auth:api')->post('web/centro/modificar' , 'Api\ecep\CentroController@modificar');
	Route::middleware('auth:api')->post('web/centro/zonas' , 'Api\ecep\CentroController@zonas');
	Route::middleware('auth:api')->post('web/centro/modificarZona' , 'Api\ecep\CentroController@modificarZona');
	Route::middleware('auth:api')->post('web/centro/zonasRegion' , 'Api\ecep\CentroController@zonasRegion');
	Route::middleware('auth:api')->post('web/centro/modificarZonaRegion' , 'Api\ecep\CentroController@modificarZonaRegion');
	Route::middleware('auth:api')->post('web/centro/centros' , 'Api\ecep\CentroController@centros');
	Route::middleware('auth:api')->post('web/centro/modificarEncargadoCentro' , 'Api\ecep\CentroController@modificarEncargadoCentro');
	
	Route::middleware('auth:api')->post('web/centro/listaMonitoreo' , 'Api\ecep\CentroController@listaMonitoreo');

//RRHH
	Route::middleware('auth:api')->post('web/personal/lista' , 'Api\ecep\PersonalController@lista');
	Route::middleware('auth:api')->post('web/personal/modificar' , 'Api\ecep\PersonalController@modificar');
	Route::middleware('auth:api')->post('web/personal/guardar' , 'Api\ecep\PersonalController@guardar');
	Route::middleware('auth:api')->post('web/personal/documentos' , 'Api\ecep\PersonalController@documentos');
	Route::middleware('auth:api')->post('web/personal/cambiarEstado' , 'Api\ecep\PersonalController@cambiarEstado');
	Route::middleware('auth:api')->post('web/personal/obtenerPersona' , 'Api\ecep\PersonalController@obtenerPersona');

	Route::middleware('auth:api')->post('web/personal/listaCoordinadorZonal' , 'Api\ecep\PersonalController@listaCoordinadorZonal');
	Route::middleware('auth:api')->post('web/personal/listaCoordinador' , 'Api\ecep\PersonalController@listaCoordinador');

//RRHH Monitoreo
  	Route::get('web/monitoreo/personal/lista' , 'Api\ecep\MonitoreoPersonalController@listaPersonal');
	Route::get('web/monitoreo/personal-por-estado/lista' , 'Api\ecep\MonitoreoPersonalController@listaPersonalPorEstado');

//INFRAESTRUCTURA Monitoreo	
	Route::get('web/monitoreo/infraestructura/lista' , 'Api\ecep\MonitoreoInfraestructuraController@listaSedes');
	Route::get('web/monitoreo/infraestructura/centros/lista' , 'Api\ecep\MonitoreoInfraestructuraController@listaCentroOperaciones');

//MONITOREO MP3
	Route::get('web/monitoreo/mp3/lista' , 'Api\ecep\MonitoreoMP3Controller@lista');
	Route::get('web/monitoreo/mp3/guardar' , 'Api\ecep\MonitoreoMP3Controller@guardar');

?>