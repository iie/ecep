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
?>