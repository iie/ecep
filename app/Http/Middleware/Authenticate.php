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
				$denegado['api/web/sede/lista'] = array(28, 1040, 1052);
				$denegado['api/web/sede/lista-sedes-comuna'] = array(28, 1040, 1052);
				$denegado['api/web/sede/guarda-liceo-cupo'] = array(28, 1040, 1052);
				$denegado['api/web/sede/lista-estimacion'] = array(28, 1040, 1052);
				$denegado['api/web/sede/obtenerDataLiceo'] = array(28, 1040, 1052);
				$denegado['api/web/sede/modificar'] = array(28, 1040, 1052);
				$denegado['api/web/sede/guardar'] = array(28, 1040, 1052);
			
			//SALA
				$denegado['api/web/sala/lista'] = array(28, 1040, 1052);
				$denegado['api/web/sala/guardar'] = array(28, 1040, 1052);
				$denegado['api/web/sala/modificar'] = array(28, 1040, 1052);

			//EVALUADO
				$denegado['api/web/evaluado/lista'] = array(28, 1040, 1042, 1052);

			//CENTRO OPERACIONES
				$denegado['api/web/centro/lista'] = array(28, 1040, 1042, 1052);
				$denegado['api/web/centro/guardar'] = array(28, 1040, 1042, 1052);
				$denegado['api/web/centro/modificar'] = array(28, 1040, 1042, 1052);
				$denegado['api/web/centro/zonas'] = array(28, 1040, 1042, 1052);
				$denegado['api/web/centro/modificarZona'] = array(28, 1040, 1042, 1052);
				$denegado['api/web/centro/zonasRegion'] = array(1040, 1042, 1052);
				$denegado['api/web/centro/modificarZonaRegion'] = array( 1040, 1042, 1052);
				$denegado['api/web/centro/centros'] = array(28, 1040, 1042, 1052);
				$denegado['api/web/centro/modificarEncargadoCentro'] = array(28, 1040, 1042, 1052);
				$denegado['api/web/centro/listaMonitoreo'] = array(28, 1040, 1042, 1052);
				$denegado['api/web/centro/sedes'] = array(28, 1040, 1042, 1052);
				$denegado['api/web/centro/modificarJefeSede'] = array(28, 1040, 1042, 1052);
 
			//CAPACITACION
				$denegado['api/web/capacitacion/lista'] = array( 1040, 1042, 1052);
				$denegado['api/web/capacitacion/obtenerPersonal'] = array(1040, 1042);
				$denegado['api/web/capacitacion/listaRelator'] = array( 1040, 1042);
				$denegado['api/web/capacitacion/guardar'] = array(1040, 1042);
				$denegado['api/web/capacitacion/guardarDocumento'] = array(1040, 1042);
				$denegado['api/web/capacitacion/modificarCapacitacion'] = array();
				$denegado['api/web/capacitacion/asignarCapacitacion'] = array(1040, 1042);
				$denegado['api/web/capacitacion/modificarPersona'] = array(1040, 1042);
				$denegado['api/web/capacitacion/guardarPersona'] = array(1040, 1042, 1052);
				$denegado['api/web/capacitacion/evaluacion'] = array(1040, 1042);
				$denegado['api/web/capacitacion/lista-regional'] = array( 1040, 1042);
				$denegado['api/web/capacitacion/deshabilitarCapacitacion'] = array( 1040, 1042);
				$denegado['api/web/capacitacion/desconvocar'] = array( 1040, 1042);
				$denegado['api/web/capacitacion/desertar'] = array( 1040, 1042);
 
			//RRHH
				//solo obtienen datos
				$denegado['api/web/personal/lista'] = array(1040, 1042, 1052);
				$denegado['api/web/personal/listaCoordinadorZonal'] = array(1040, 1042, 1052);
				$denegado['api/web/personal/listaCoordinador'] = array(1040, 1042, 1052);
				$denegado['api/web/personal/documentos'] = array(1040, 1042, 1052);
				$denegado['api/web/personal/obtenerPersona'] = array(1040, 1042, 1052);
				$denegado['api/web/personal/listaPostulantes'] = array(1040, 1042, 1052);
				//cambian valores es BD
				$denegado['api/web/personal/modificar'] = array(1040, 1042, 1052);
				$denegado['api/web/personal/guardar'] = array(1040, 1042, 1052);
				$denegado['api/web/personal/cambiarEstado'] = array(1040, 1042, 1052);

			//ASIGNACION
				//solo obtienen datos
				$denegado['api/web/sede/lista-estimacion'] = array(1040, 1042, 1052);
				$denegado['api/web/asignacion/lista'] = array(1040, 1042, 1052);
				$denegado['api/web/asignacion/listaCoordinador'] = array(1040, 1042, 1052);
				$denegado['api/web/asignacion/listaCoordinadorZonal'] = array(1040, 1042, 1052);
				
				//cambian valores es BD
				$denegado['api/web/asignacion/guardar'] = array(1040, 1042, 1052);
	
			
			//validacion para cada tipo de usuario.
			//el tipo de usuario 28 es persona, son las personas que tienen cargo
			//el tipo de usuario 1040 agencia
			//el tipo de usuario 1051 es admin	
			//el tipo de usuario 1042 infraestructura
			if(array_key_exists($request->path(), $denegado)){
				if(in_array($usuario[0]->id_tipo_usuario, $denegado[$request->path()])){
					return response()->json(['resultado'=>'error','descripcion'=>'Acceso Denegado 1']);
				}
			}
			else{
				return response()->json(['resultado'=>'error','descripcion'=>'Acceso Denegado 2']);
			}
			

			//validacion para cada cargo.
			//1003-> Ejecutivo iie
			//1004-> Encargado Regional
			//1008-> Relator
			$personaCargo = \DB::select("SELECT id_cargo FROM rrhh.persona_cargo 
				inner join rrhh.persona on rrhh.persona_cargo.id_persona = rrhh.persona.id_persona 
				WHERE rrhh.persona.id_usuario = '".$usuario[0]->id_usuario."' ");

 /*			if($usuario[0]->id_tipo_usuario == 28){
					//RRHH				
					$denegadoRRHH['api/web/personal/lista'] = array();
					$denegadoRRHH['api/web/personal/modificar'] = array();
					$denegadoRRHH['api/web/personal/guardar'] = array();
					$denegadoRRHH['api/web/personal/documentos'] = array();
					$denegadoRRHH['api/web/personal/cambiarEstado'] = array();
					$denegadoRRHH['api/web/personal/obtenerPersona'] = array();
					$denegadoRRHH['api/web/personal/listaCoordinadorZonal'] = array(1004);
					$denegadoRRHH['api/web/personal/listaCoordinador'] = array(1003);	
					$denegadoRRHH['api/web/asignacion/lista'] = array(1040, 1042);
					$denegadoRRHH['api/web/asignacion/listaCoordinador'] = array(1040, 1042);
					$denegadoRRHH['api/web/asignacion/guardar'] = array(1040, 1042);

					//CENTRO OPERACIONES
					$denegadoRRHH['api/web/centro/lista'] = array(28, 1040, 1042);
					$denegadoRRHH['api/web/centro/guardar'] = array(28, 1040, 1042);
					$denegadoRRHH['api/web/centro/modificar'] = array(28, 1040, 1042);
					$denegadoRRHH['api/web/centro/zonas'] = array(28, 1040, 1042);
					$denegadoRRHH['api/web/centro/modificarZona'] = array(28, 1040, 1042);
					$denegadoRRHH['api/web/centro/zonasRegion'] = array(1040, 1042);
					$denegadoRRHH['api/web/centro/modificarZonaRegion'] = array( 1040, 1042);

					//CAPACITACION
					$denegadoRRHH['api/web/capacitacion/lista'] = array(1040, 1042);
					$denegadoRRHH['api/web/capacitacion/guardar'] = array(1040, 1042);
					$denegadoRRHH['api/web/capacitacion/modificarCapacitacion'] = array(1052);
					$denegadoRRHH['api/web/capacitacion/asignarCapacitacion'] = array(1040, 1042);
				
					if(array_key_exists($request->path(), $denegadoRRHH)){
						if(in_array($personaCargo[0]->id_cargo, $denegadoRRHH[$request->path()])){
						 	return response()->json(['resultado'=>'error','descripcion'=>'Acceso Denegado 3']);
							 
						}
					}
					else{
						return response()->json(['resultado'=>'error','descripcion'=>'Acceso Denegado 4']);
					}					
			}*/

			$request->merge(array("id_usuario" => $usuario[0]->id_usuario));
			
			$_response = $next($request);
			
			//esto es para evitar la caché
			$_response->headers->set('Cache-Control: no-cache' , 'must-revalidate');
			$_response->headers->set("Pragma", "no-cache");
			$_response->headers->set("Expires", "Sat, 26 Jul 1997 05:00:00 GMT");
			
			return $_response;			
			
			
		}

        echo $msgInvalido;
        exit;
    }
}
