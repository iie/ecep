<?php

//https://informes.diagnosticafid.cl/public/api/test-lab/laboratorio/info-por-id	
Route::middleware('auth:api')->post('test-lab/laboratorio/info-por-id' , 'Api\TestLabController@infoPorId');	

//https://informes.diagnosticafid.cl/public/api/test-lab/equipo/info-por-id-placa
Route::middleware('auth:api')->post('test-lab/equipo/info-por-id-placa' , 'Api\TestLabController@infoPorIdPlaca');	

//https://informes.diagnosticafid.cl/public/api/test-lab/equipo/guarda-mac
Route::middleware('auth:api')->post('test-lab/equipo/guarda-id-placa' , 'Api\TestLabController@guardaIdPlaca');	

//https://informes.diagnosticafid.cl/public/api/test-lab/equipo/guarda-info
Route::middleware('auth:api')->post('test-lab/equipo/guarda-info' , 'Api\TestLabController@guardaInfo');

//https://informes.diagnosticafid.cl/public/api/test-lab/equipo/test-velocidad-guarda
Route::middleware('auth:api')->post('test-lab/equipo/test-velocidad-guarda' , 'Api\TestLabController@testVelocidadGuarda');	

//https://informes.diagnosticafid.cl/public/api/test-lab/equipo/test-demo-guarda
Route::middleware('auth:api')->post('test-lab/equipo//test-demo-guarda' , 'Api\TestLabController@testDemoGuarda');	

//https://informes.diagnosticafid.cl/public/api/test-lab/equipo/resultado-test
Route::middleware('auth:api')->post('test-lab/equipo/resultado-test' , 'Api\TestLabController@resultadoTest');	

//https://informes.diagnosticafid.cl/public/api/test-lab/equipo/cuestionario-guarda
Route::middleware('auth:api')->post('test-lab/equipo/cuestionario-guarda' , 'Api\TestLabController@cuestionarioGuarda');	

//https://informes.diagnosticafid.cl/public/api/test-lab/equipo/json-info-guarda
Route::middleware('auth:api')->post('test-lab/equipo/json-info-guarda' , 'Api\TestLabController@jsonInfoGuarda');	

//https://informes.diagnosticafid.cl/public/api/test-lab/equipo/test-velocidad-por-lab
Route::middleware('auth:api')->post('test-lab/equipo/test-velocidad-por-lab' , 'Api\TestLabController@testVelocidadPorLab');	

?>