<?php

Route::get('web/login' , 'Api\ecep\LoginController@login');	

//Route::get('importa-sedes' , 'Api\ecep\SalaController@importaSedes');	
Route::get('importa-salas' , 'Api\ecep\SalaController@importaSalas');	
Route::get('importa-evaluados' , 'Api\ecep\SalaController@importaEvaluados');	
Route::get('importa-asignaturas' , 'Api\ecep\SalaController@importaAsignaturas');	
Route::get('sqltotable' , 'Api\ecep\SalaController@sqlToTable');	
Route::get('sincroniza-estimacion' , 'Api\ecep\SalaController@sincronizaEstimacion');	
Route::get('inscritos-dia' , 'Api\ecep\SedeController@inscritosDia');	

//SEDE
	Route::middleware('auth:api')->post('web/sede/lista' , 'Api\ecep\SedeController@lista');	
	Route::middleware('auth:api')->post('web/sede/lista-sedes-comuna' , 'Api\ecep\SedeController@listaSedeComuna');	
	Route::middleware('auth:api')->post('web/sede/guarda-liceo-cupo' , 'Api\ecep\SedeController@guardaLiceoCupo');		
	Route::middleware('auth:api')->post('web/sede/lista-estimacion' , 'Api\ecep\SedeController@listaEstimacion');	
	Route::middleware('auth:api')->post('web/sede/obtenerDataLiceo' , 'Api\ecep\SedeController@obtenerDataLiceo');
	Route::post('web/sede/obtenerDatosSede' , 'Api\ecep\SedeController@obtenerDatosSede');
	Route::middleware('auth:api')->post('web/sede/modificar' , 'Api\ecep\SedeController@modificar');
	Route::middleware('auth:api')->post('web/sede/guardar' , 'Api\ecep\SedeController@guardar');
	Route::middleware('auth:api')->post('web/sede/quitar-liceo-cupo' , 'Api\ecep\SedeController@quitarLiceoCupo');
//SALA
	Route::middleware('auth:api')->post('web/sala/lista' , 'Api\ecep\SalaController@lista');
	Route::middleware('auth:api')->post('web/sala/guardar' , 'Api\ecep\SalaController@guardar');
	Route::middleware('auth:api')->post('web/sala/modificar' , 'Api\ecep\SalaController@modificar');

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
	Route::middleware('auth:api')->post('web/centro/sedes' , 'Api\ecep\CentroController@sedes');
	Route::middleware('auth:api')->post('web/centro/modificarJefeSede' , 'Api\ecep\CentroController@modificarJefeSede');
	Route::middleware('auth:api')->post('web/centro/listaMonitoreo' , 'Api\ecep\CentroController@listaMonitoreo');

//EVALUADO
	Route::middleware('auth:api')->post('web/evaluado/lista' , 'Api\ecep\EvaluadosController@lista');

//RRHH
	Route::middleware('auth:api')->post('web/personal/lista' , 'Api\ecep\PersonalController@lista');
	Route::middleware('auth:api')->post('web/personal/listaPostulantes' , 'Api\ecep\PersonalController@listaPostulantes'); 
	Route::middleware('auth:api')->post('web/personal/listaPostulantes' , 'Api\ecep\PersonalController@listaPostulantes'); 
	Route::middleware('auth:api')->post('web/personal/modificar' , 'Api\ecep\PersonalController@modificar');
	Route::middleware('auth:api')->post('web/personal/guardar' , 'Api\ecep\PersonalController@guardar');
	Route::middleware('auth:api')->post('web/personal/documentos' , 'Api\ecep\PersonalController@documentos');
	Route::middleware('auth:api')->post('web/personal/cambiarEstado' , 'Api\ecep\PersonalController@cambiarEstado');
	Route::middleware('auth:api')->post('web/personal/obtenerPersona' , 'Api\ecep\PersonalController@obtenerPersona');
	Route::middleware('auth:api')->post('web/personal/obtenerJefeSede' , 'Api\ecep\PersonalController@obtenerJefeSede');
	Route::middleware('auth:api')->post('web/personal/filtros' , 'Api\ecep\PersonalController@filtros');
	Route::middleware('auth:api')->post('web/personal/guardarJefeSede' , 'Api\ecep\PersonalController@guardarJefeSede');


	Route::middleware('auth:api')->post('web/personal/listaCoordinadorZonal' , 'Api\ecep\PersonalController@listaCoordinadorZonal');
	Route::middleware('auth:api')->post('web/personal/listaCoordinador' , 'Api\ecep\PersonalController@listaCoordinador');
	Route::get('web/personal/descarga-listado/{region}/{comuna}/{estado}/{cargo}' , 'Api\ecep\PersonalController@descargaExcel');
	Route::get('web/personal/descarga-listado-fudea/{region}/{comuna}/{estado}/{cargo}' , 'Api\ecep\PersonalController@descargaExcelFUDEA');


//CAPACITACION
	Route::middleware('auth:api')->post('web/capacitacion/lista' , 'Api\ecep\CapacitacionController@lista');
	Route::middleware('auth:api')->post('web/capacitacion/guardar' , 'Api\ecep\CapacitacionController@guardar');
	Route::middleware('auth:api')->post('web/capacitacion/guardarDocumento' , 'Api\ecep\CapacitacionController@guardarDocumento');
	Route::middleware('auth:api')->post('web/capacitacion/modificarCapacitacion' , 'Api\ecep\CapacitacionController@modificarCapacitacion');
	Route::middleware('auth:api')->post('web/capacitacion/obtenerPersonal' , 'Api\ecep\CapacitacionController@obtenerPersonal');
	Route::middleware('auth:api')->post('web/capacitacion/asignarCapacitacion' , 'Api\ecep\CapacitacionController@asignarCapacitacion');
	Route::middleware('auth:api')->post('web/capacitacion/listaRelator' , 'Api\ecep\CapacitacionController@listaRelator');
	Route::middleware('auth:api')->post('web/capacitacion/modificarPersona' , 'Api\ecep\CapacitacionController@modificarPersona');
	Route::middleware('auth:api')->post('web/capacitacion/guardarPersona' ,'Api\ecep\CapacitacionController@guardarPersona');
	Route::middleware('auth:api')->post('web/capacitacion/evaluacion' ,'Api\ecep\CapacitacionController@evaluacion');
	Route::middleware('auth:api')->post('web/capacitacion/deshabilitarCapacitacion' ,'Api\ecep\CapacitacionController@deshabilitarCapacitacion');
	Route::middleware('auth:api')->post('web/capacitacion/desconvocar' ,'Api\ecep\CapacitacionController@desconvocar');
	Route::middleware('auth:api')->post('web/capacitacion/desertar' ,'Api\ecep\CapacitacionController@desertar');
	Route::middleware('auth:api')->post('web/capacitacion/obtenerNota' , 'Api\ecep\CapacitacionController@obtenerNota');
	Route::middleware('auth:api')->post('web/capacitacion/guardarNota' , 'Api\ecep\CapacitacionController@guardarNota');
	Route::middleware('auth:api')->post('web/capacitacion/obtenerPersonaCapacitacion' , 'Api\ecep\CapacitacionController@obtenerPersonaCapacitacion');
	Route::middleware('auth:api')->post('web/capacitacion/filtros' , 'Api\ecep\CapacitacionController@filtros');

	Route::middleware('auth:api')->post('web/capacitacion/listaPostulantes' ,'Api\ecep\CapacitacionController@listaPostulantes');
	
	Route::post('web/capacitacion/obtenerPersonalConvocado' , 'Api\ecep\CapacitacionController@obtenerPersonalConvocado');
	Route::post('web/capacitacion/notificarCapacitacionPorCorreo' , 'Api\ecep\CapacitacionController@notificarCapacitacionPorCorreo');
	
	//Route::middleware('auth:api')->post('web/capacitacion/evaluacion' ,'Api\ecep\CapacitacionController@evaluacion');
	Route::middleware('auth:api')->post('web/capacitacion/lista-regional' ,'Api\ecep\CapacitacionController@listaRegional');
	Route::get('web/capacitacion/confirma/{idCapPersona}' ,'Api\ecep\CapacitacionController@infoConfirmacion');
	Route::post('web/capacitacion/guarda-confirmacion' ,'Api\ecep\CapacitacionController@guardarConfirmacion');
	Route::get('web/capacitacion/test-mailing' ,'Api\ecep\CapacitacionController@testCorreo');
	Route::get('web/capacitacion/descarga-listado/' , 'Api\ecep\CapacitacionExcelController@descargaExcelCapacitacion');

 
	
//ASIGNACION
	Route::middleware('auth:api')->post('web/asignacion/lista' , 'Api\ecep\AsignacionController@lista');
	Route::middleware('auth:api')->post('web/asignacion/listaCoordinadorZonal' , 'Api\ecep\AsignacionController@listaCoordinadorZonal');
	Route::middleware('auth:api')->post('web/asignacion/listaCoordinador' , 'Api\ecep\AsignacionController@listaCoordinador');
	Route::middleware('auth:api')->post('web/asignacion/guardar' , 'Api\ecep\AsignacionController@guardar');
	Route::middleware('auth:api')->post('web/asignacion/lista-estimacion' , 'Api\ecep\AsignacionController@listaEstimacion');	
	Route::get('web/asignacion/descargar-excel' , 'Api\ecep\AsignacionController@descargaExcelAsignacion');

	Route::post('web/asignacion/obtenerCapacitados' , 'Api\ecep\AsignacionController@obtenerCapacitados');
	Route::post('web/asignacion/obtenerCapacitadosD2' , 'Api\ecep\AsignacionController@obtenerCapacitadosD2');
	Route::post('web/asignacion/obtenerAsignados' , 'Api\ecep\AsignacionController@obtenerAsignados');
	Route::post('web/asignacion/asignarCargoSede' , 'Api\ecep\AsignacionController@asignarCargoSede');
	Route::post('web/asignacion/desasignar' , 'Api\ecep\AsignacionController@desasignar');

//MONITOREO RRHH 
	Route::get('web/monitoreo/personal/lista' , 'Api\ecep\MonitoreoPersonalController@listaPersonal');
	Route::get('web/monitoreo/personal-por-estado/lista' , 'Api\ecep\MonitoreoPersonalController@listaPersonalPorEstado');
	Route::get('web/monitoreo/inscritos-dia' , 'Api\ecep\MonitoreoPersonalController@inscritosDia');	
	Route::post('web/monitoreo/capacitaciones-por-comuna' , 'Api\ecep\MonitoreoPersonalController@capacitacionesPorComuna');
	Route::get('web/monitoreo/capacitaciones/descarga-archivo/{idCapacitacion}' , 'Api\ecep\MonitoreoPersonalController@descargaArchivoCapacitacion');	

//MONITOREO INFRAESTRUCTURA 	
	Route::get('web/monitoreo/infraestructura/lista' , 'Api\ecep\MonitoreoInfraestructuraController@listaSedes');
	Route::get('web/monitoreo/infraestructura/centros/lista' , 'Api\ecep\MonitoreoInfraestructuraController@listaCentroOperaciones');

//MONITOREO MP3
	Route::get('web/monitoreo/mp3/lista' , 'Api\ecep\MonitoreoMP3Controller@lista');
	Route::get('web/monitoreo/mp3/guardar' , 'Api\ecep\MonitoreoMP3Controller@guardar');

//MONITOREO CALL CENTER
	Route::get('web/monitoreo/call-center/lista' , 'Api\ecep\MonitoreoCallCenterController@lista');

//MONITOREO ACTAS
	Route::get('web/monitoreo/actas/lista' , 'Api\ecep\MonitoreoActasController@lista');

//MONITOREO APLICACION
	Route::get('web/monitoreo/aplicacion/lista' , 'Api\ecep\MonitoreoAplicacionController@lista');
	Route::get('web/monitoreo/aplicacion/prueba' , 'Api\ecep\MonitoreoAplicacionController@prueba');

	Route::get('web/monitoreo/aplicacion/monitoreoExcel/' , 'Api\ecep\MonitoreoAplicacionController@monitoreoExcel');
?>