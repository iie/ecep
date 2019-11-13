<?php

namespace App\Http\Middleware;
use Closure;

// use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */
    // protected function redirectTo($request, Closure $next)
    // {
    //     return $next($request);
    //     // dd("PASO POR AQUÍ!");
    //     // return route('login');
    // }
    public function handle($request, Closure $next) {
		
        $token = $request->header('t');
        $msgInvalido = "token invalido";
        $msgExpiracion = "sesion expirada";
		$usuario = \DB::select("SELECT id_usuario, id_tipo_usuario FROM core.usuario WHERE token = '".$token."' ");
		
		
        
		if(count($usuario)>0){
			
			//SEDE
				$denedado['api/web/sede/lista'] = array(28, 1040);
				$denedado['api/web/sede/lista-sedes-comuna'] = array(28, 1040);
				$denedado['api/web/sede/guarda-liceo-cupo'] = array(28, 1040);
				$denedado['api/web/sede/lista-estimacion'] = array(28, 1040);
				$denedado['api/web/sede/obtenerDataLiceo'] = array(28, 1040);
				$denedado['api/web/sede/modificar'] = array(28, 1040);
				$denedado['api/web/sede/guardar'] = array(28, 1040);
			
			//SALA
				$denedado['api/web/sala/lista'] = array(28, 1040);
				$denedado['api/web/sala/guardar'] = array(28, 1040);
				$denedado['api/web/sala/modificar'] = array(28, 1040);

			//EVALUADO
				$denedado['api/web/evaluado/lista'] = array(28, 1040, 1042);

			//CENTRO OPERACIONES
				$denedado['api/web/centro/lista'] = array(28, 1040, 1042);
				$denedado['api/web/centro/guardar'] = array(28, 1040, 1042);
				$denedado['api/web/centro/modificar'] = array(28, 1040, 1042);
				$denedado['api/web/centro/zonas'] = array(28, 1040, 1042);
				$denedado['api/web/centro/modificarZona'] = array(28, 1040, 1042);
				$denedado['api/web/centro/zonasRegion'] = array(28, 1040, 1042);
				$denedado['api/web/centro/modificarZonaRegion'] = array(28, 1040, 1042);
				$denedado['api/web/centro/centros'] = array(28, 1040, 1042);
				$denedado['api/web/centro/modificarEncargadoCentro'] = array(28, 1040, 1042);
				$denedado['api/web/centro/listaMonitoreo'] = array(28, 1040, 1042);

			//RRHH
				$denedado['api/web/personal/lista'] = array(1040, 1042);
				$denedado['api/web/personal/modificar'] = array(1040, 1042);
				$denedado['api/web/personal/guardar'] = array(1040, 1042);
				$denedado['api/web/personal/documentos'] = array(1040, 1042);
				$denedado['api/web/personal/cambiarEstado'] = array(1040, 1042);
				$denedado['api/web/personal/obtenerPersona'] = array(1040, 1042);
				$denedado['api/web/personal/listaCoordinadorZonal'] = array(1040, 1042);
				$denedado['api/web/personal/listaCoordinador'] = array(1040, 1042);

			//CAPACITACION
				$denedado['api/web/capacitacion/lista'] = array(28, 1040, 1042);
				$denedado['api/web/capacitacion/guardar'] = array(28, 1040, 1042);
				$denedado['api/web/capacitacion/obtenerPersonal'] = array(28, 1040, 1042);
				$denedado['api/web/capacitacion/asignarCapacitacion'] = array(28, 1040, 1042);
				$denedado['api/web/capacitacion/listaRelator'] = array(28, 1040, 1042);
				$denedado['api/web/capacitacion/modificarPersona'] = array(28, 1040, 1042);
				$denedado['api/web/capacitacion/guardarPersona'] = array(28, 1040, 1042);
				$denedado['api/web/capacitacion/evaluacion'] = array(28, 1040, 1042);

			//ASIGNACION
				$denedado['api/web/asignacion/lista'] = array(28, 1040, 1042);
				$denedado['api/web/asignacion/listaCoordinador'] = array(28, 1040, 1042);
				$denedado['api/web/asignacion/guardar'] = array(28, 1040, 1042);
	
			
			//validacion para cada tipo de usuario.
			//el tipo de usuario 28 es persona, son las personas que tienen cargo
			//el tipo de usuario 1040 agencia
			//el tipo de usuario 1051 es admin	
			//el tipo de usuario 1042 infraestructura
			if(array_key_exists($request->path(), $denedado)){
				if(in_array($usuario[0]->id_tipo_usuario, $denedado[$request->path()])){
					echo "acceso denegado 1"; exit;
				}
			}
			else{
				echo "acceso denegado 2"; exit;
			}
			

			//validacion para cada cargo.
			//1003-> Ejecutivo iie
			//1004-> Encargado Regional
			//1008-> Relator
			
			// if($usuario[0]->id_tipo_usuario == 28){
					// //RRHH				
					// $denedadoRRHH['api/web/personal/lista'] = array();
					// $denedadoRRHH['api/web/personal/modificar'] = array();
					// $denedadoRRHH['api/web/personal/guardar'] = array();
					// $denedadoRRHH['api/web/personal/documentos'] = array();
					// $denedadoRRHH['api/web/personal/cambiarEstado'] = array();
					// $denedadoRRHH['api/web/personal/obtenerPersona'] = array();
					// $denedadoRRHH['api/web/personal/listaCoordinadorZonal'] = array(1004);
					// $denedadoRRHH['api/web/personal/listaCoordinador'] = array();	
					// // if(array_key_exists($request->path(), $denedadoRRHH)){
						// // if(in_array($usuario[0]->id_tipo_usuario, $denedadoRRHH[$request->path()])){
							// // echo "acceso denegado 1"; exit;
						// // }
					// // }
					// // else{
						// // echo "acceso denegado 2"; exit;
					// // }					
			// }

			
			
			
			$request->merge(array("id_usuario" => $usuario[0]->id_usuario));
			return $next($request);
		}

        echo $msgInvalido;
        exit;
    }
}
