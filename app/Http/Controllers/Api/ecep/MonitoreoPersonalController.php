<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\RRHH\Persona;
use App\Models\RRHH\Cargo;
use App\Models\RRHH\PersonaCargo;
use App\Models\RRHH\PersonaArchivo;
use App\Models\Infraestructura\Institucion;
use App\Models\Core\TablaMaestra;
use App\Models\Core\Comuna;
use App\Models\Core\Region;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MonitoreoPersonalController extends Controller
{
     
    public function __construct()
    {
        $this->fields = array();    
    }   

    public function listaPersonal(Request $request){
        
        $post = $request->all();    
		
		//******INICIO INICIALIZAMOS

		//todos los cargos
		$cargo = Cargo::get();
		foreach($cargo as $cargos){
			$_cargo[] = $cargos->nombre_rol;
		}
		
		//todas las comunas/regiones donde hay sede
		$sql = DB::select("SELECT
                            region.nombre as region,
                            comuna.nombre as comuna
							FROM core.region as region, core.comuna as comuna, infraestructura.sede as sede
							WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
							");
		
		foreach($sql as $region){
			$_region[$region->region][] = $region->comuna;
		}
		
		//todos los estados
		$_estado[] = 'reclutado';
		$_estado[] = 'preseleccionado';
		$_estado[] = 'capacitado';
		$_estado[] = 'seleccionado';
		$_estado[] = 'contratado';
        
		foreach($_cargo as $_cargoAux){
			foreach($_region as $region=>$comunas){
				foreach($comunas as $comuna){
                    $arrComunas[] = $comuna;
					foreach($_estado as $estadoAux){
						$arr[$_cargoAux][$region][$comuna][$estadoAux] = 0;
					}
				}
			}
		}
        //******FIN INICIALIZAMOS
        
		$sql = DB::select("SELECT
                            rrhh.persona_cargo.estado,
                            core.region.nombre as region,
                            core.comuna.nombre as comuna,
                            rrhh.cargo.nombre_rol,
                            count (rrhh.persona_cargo.estado) as cuenta_estado
                            FROM
                            rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region
                            WHERE rrhh.persona.modificado = true AND rrhh.persona.borrado = false
                            GROUP BY rrhh.persona_cargo.estado, core.region.nombre, core.region.orden_geografico, core.comuna.nombre, rrhh.cargo.nombre_rol order by core.region.orden_geografico, core.comuna.nombre");
        foreach ($sql as $value) {
            $arr[$value->nombre_rol][$value->region][$value->comuna][$value->estado] = $value->cuenta_estado;
        }
		
		
		$arrFinal = [];
		
        foreach ($arr as $rol => $data_rol) {
			$regiones = array();
            foreach ($data_rol as $region => $data_region) {
				$comunas = array();
                foreach ($data_region as $comuna => $data_comuna) {
					$auxCargo = array();
					
                    foreach ($data_comuna as $cargo => $cont) {
                        if(in_array($comuna, $arrComunas)){
                            switch ($rol) {
                                case 'Examinador de Apoyo':
                                    $_rol = 'examinador_de_apoyo';
                                    break;
                                case 'Anfitrión':
                                    $_rol = 'anfitrion';
                                    break;
                                default:
                                    $_rol = $rol;
                                    break;
                            }
                            @$arrCont[$_rol][$cargo] += $cont;
                        }
                        $auxCargo[$cargo] = $cont;
                    }
                    if(in_array($comuna, $arrComunas)){
                        $auxComuna["comuna"] = $comuna;
					
                        $auxComuna["data_comuna"] = $auxCargo;
                        $comunas[] = $auxComuna;
                    }
                }
                $auxRegion["region"] = $region;
                $auxRegion["data_region"] = $comunas;
                unset($comunas);
                $regiones[] = $auxRegion;
            }
            
			$auxRol["cargo"] = $rol;
            $auxRol["data_rol"] = $regiones;
            unset($regiones);
            $arrFinal[] = $auxRol;
        }
        $arrFinal["contador"] = $arrCont;
		
        return response()->json(array("resultado"=>"ok","descripcion"=>$arrFinal)); 
    }

    public function listaPersonalPorEstado(Request $request){
        
        $post = $request->all();    
		
		//******INICIO INICIALIZAMOS

		//todos los cargos
		$cargo = Cargo::get();
		foreach($cargo as $cargos){
			$_cargo[] = $cargos->nombre_rol;
		}
		
		//todas las comunas/regiones donde hay sede
		$sql = DB::select("SELECT
                            region.nombre as region,
                            comuna.nombre as comuna
							FROM core.region as region, core.comuna as comuna, infraestructura.sede as sede
							WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
							");
		
		foreach($sql as $region){
			$_region[$region->region][] = $region->comuna;
		}
		
		//todos los estados
		$_estado[] = 'reclutado';
		$_estado[] = 'preseleccionado';
		$_estado[] = 'capacitado';
		$_estado[] = 'seleccionado';
		$_estado[] = 'contratado';
        
        foreach ($_estado as $estadoAux) {
            foreach($_region as $region=>$comunas){
				foreach($comunas as $comuna){
                    $arrComunas[] = $comuna;
                    foreach($_cargo as $_cargoAux){
						$arr[$estadoAux][$region][$comuna][$_cargoAux] = 0;
					}
                }
            }
        }

        // Contadores
        $count_reclutado = DB::select("SELECT
                            COUNT (distinct rrhh.persona.run) AS cuenta_persona
                            FROM
                            rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            WHERE
                            rrhh.persona.modificado = TRUE 
                            AND rrhh.persona.borrado = FALSE
                            AND rrhh.persona_cargo.estado like 'reclutado'");
        $total_reclutado = $count_reclutado[0]->cuenta_persona;

        $count_capacitado = DB::select("SELECT
                            COUNT (distinct rrhh.persona.run) AS cuenta_persona
                            FROM
                            rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            WHERE
                            rrhh.persona.modificado = TRUE 
                            AND rrhh.persona.borrado = FALSE
                            AND rrhh.persona_cargo.estado like 'capacitado'");
        $total_capacitado = $count_capacitado[0]->cuenta_persona;

        $count_seleccionado = DB::select("SELECT
                            COUNT (distinct rrhh.persona.run) AS cuenta_persona
                            FROM
                            rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            WHERE
                            rrhh.persona.modificado = TRUE 
                            AND rrhh.persona.borrado = FALSE
                            AND rrhh.persona_cargo.estado like 'seleccionado'");
        $total_seleccionado = $count_seleccionado[0]->cuenta_persona;

        $count_contratado = DB::select("SELECT
                            COUNT (distinct rrhh.persona.run) AS cuenta_persona
                            FROM
                            rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            WHERE
                            rrhh.persona.modificado = TRUE 
                            AND rrhh.persona.borrado = FALSE
                            AND rrhh.persona_cargo.estado like 'contratado'");
        $total_contratado = $count_contratado[0]->cuenta_persona;

        //******FIN INICIALIZAMOS
        
		$sql = DB::select("SELECT
                            rrhh.persona_cargo.estado,
                            core.region.nombre AS region,
                            core.comuna.nombre AS comuna,
                            rrhh.cargo.nombre_rol,
                            COUNT ( rrhh.cargo.nombre_rol ) AS cuenta_rol
                            FROM rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            WHERE rrhh.persona.modificado = TRUE 
                            AND rrhh.persona.borrado = FALSE 
                            GROUP BY
                            rrhh.persona_cargo.estado,
                            core.region.nombre,
                            core.region.orden_geografico,
                            core.comuna.nombre,
                            rrhh.cargo.nombre_rol 
                            ORDER BY
                            core.region.orden_geografico,
                            core.comuna.nombre");
        foreach ($sql as $value) {
            $arr[$value->estado][$value->region][$value->comuna][$value->nombre_rol] = $value->cuenta_rol;
        }
		
		$arrFinal = [];
		
        foreach ($arr as $estado => $data_estado) {
			$regiones = array();
            foreach ($data_estado as $region => $data_region) {
				$comunas = array();
                foreach ($data_region as $comuna => $data_comuna) {
					$auxRol = array();
					
                    foreach ($data_comuna as $rol => $cont) {
                        if(in_array($comuna, $arrComunas)){
                            switch ($rol) {
                                case 'Examinador de Apoyo':
                                    $_rol = 'examinador_de_apoyo';
                                    break;
                                case 'Anfitrión':
                                    $_rol = 'anfitrion';
                                    break;
                                default:
                                    $_rol = $rol;
                                    break;
                            }
                            @$arrCont[$estado][$_rol] += $cont;
                        }
                        $auxRol[$_rol] = $cont;
                    }
                    if(in_array($comuna, $arrComunas)){
                        $auxComuna["comuna"] = $comuna;
					
                        $auxComuna["data_comuna"] = $auxRol;
                        $comunas[] = $auxComuna;
                    }
                }
                $auxRegion["region"] = $region;
                $auxRegion["data_region"] = $comunas;
                unset($comunas);
                $regiones[] = $auxRegion;
            }
            
			$auxEstado["estado"] = $estado;
            $auxEstado["data_estado"] = $regiones;
            unset($regiones);
            $arrFinal[] = $auxEstado;
        }
        $arrFinal["contador"] = $arrCont;
		$arrFinal["contador"]["total_reclutado"] = $total_reclutado;
        $arrFinal["contador"]["total_capacitado"] = $total_capacitado;
        $arrFinal["contador"]["total_seleccionado"] = $total_seleccionado;
        $arrFinal["contador"]["total_contratado"] = $total_contratado;
        return response()->json(array("resultado"=>"ok","descripcion"=>$arrFinal)); 
    }
}
// namespace App\Http\Controllers\Api\ecep;
// use Illuminate\Http\Request;
// use App\Http\Controllers\Controller;
// use App\Models\RRHH\Persona;
// use App\Models\RRHH\Cargo;
// use App\Models\RRHH\PersonaCargo;
// use App\Models\RRHH\PersonaArchivo;
// use App\Models\Infraestructura\Institucion;
// use App\Models\Core\TablaMaestra;
// use App\Models\Core\Comuna;
// use App\Models\Core\Region;

// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Validator;

// class MonitoreoPersonalController extends Controller
// {
     
    // public function __construct()
    // {
        // $this->fields = array();    
    // }   

    // public function listaPersonal(Request $request){
        
        // $post = $request->all();    

        // // $validacion = Validator::make($post, [
        // //     'id_usuario' => 'required|int', 
        // // ]); 

        // // if ($validacion->fails()) {
        // //     return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        // // }
		
		
		// //******INICIO INICIALIZAMOS

		// //todos los cargos
		// $cargo = Cargo::get();
		// foreach($cargo as $cargos){
			// $_cargo[] = $cargos->nombre_rol;
		// }
		
		// //todas las comunas/regiones donde hay sede
		// $sql = DB::select("SELECT
                            // region.nombre as region,
                            // comuna.nombre as comuna
							// FROM core.region as region, core.comuna as comuna, infraestructura.sede as sede
							// WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna order by core.region.orden_geografico, core.comuna.nombre
							
							// ");
		
		// foreach($sql as $region){
			// $_region[$region->region][] = $region->comuna;
		// }
		
		// //todos los estados
		// $_estado[] = 'reclutado';
		// $_estado[] = 'preseleccionado';
		// $_estado[] = 'capacitado';
		// $_estado[] = 'seleccionado';
		// $_estado[] = 'contratado';
        
		// foreach($_cargo as $_cargoAux){
			// foreach($_region as $region=>$comunas){
				// foreach($comunas as $comuna){
                    // $arrComunas[] = $comuna;
					// foreach($_estado as $estadoAux){
						// $arr[$_cargoAux][$region][$comuna][$estadoAux] = 0;
					// }
				// }
			// }
		// }
        // //******FIN INICIALIZAMOS
        
		// $sql = DB::select("SELECT
                            // rrhh.persona_cargo.estado,
                            // core.region.nombre as region,
                            // core.comuna.nombre as comuna,
                            // rrhh.cargo.nombre_rol,
                            // count (rrhh.persona_cargo.estado) as cuenta_estado
                            // FROM
                            // rrhh.persona
                            // INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            // INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            // INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
                            // INNER JOIN core.region ON core.comuna.id_region = core.region.id_region
                            // WHERE rrhh.persona.modificado = true AND rrhh.persona.borrado = false
                            // GROUP BY rrhh.persona_cargo.estado, core.region.nombre, core.region.orden_geografico, core.comuna.nombre, rrhh.cargo.nombre_rol order by core.region.orden_geografico, core.comuna.nombre");
        // foreach ($sql as $value) {
            // $arr[$value->nombre_rol][$value->region][$value->comuna][$value->estado] = $value->cuenta_estado;
        // }
		
		
		// $arrFinal = [];
		
        // foreach ($arr as $rol => $data_rol) {
			// $regiones = array();
            // foreach ($data_rol as $region => $data_region) {
				// $comunas = array();
                // foreach ($data_region as $comuna => $data_comuna) {
					// $auxCargo = array();
					
                    // foreach ($data_comuna as $cargo => $cont) {
                        // if(in_array($comuna, $arrComunas)){
                            // switch ($rol) {
                                // case 'Examinador de Apoyo':
                                    // $_rol = 'examinador_de_apoyo';
                                    // break;
                                // case 'Anfitrión':
                                    // $_rol = 'anfitrion';
                                    // break;
                                // default:
                                    // $_rol = $rol;
                                    // break;
                            // }
                            // @$arrCont[$_rol][$cargo] += $cont;
                        // }
                        // $auxCargo[$cargo] = $cont;
                    // }
                    // if(in_array($comuna, $arrComunas)){
                        // $auxComuna["comuna"] = $comuna;
					
                        // $auxComuna["data_comuna"] = $auxCargo;
                        // $comunas[] = $auxComuna;
                    // }
                // }
                // $auxRegion["region"] = $region;
                // $auxRegion["data_region"] = $comunas;
                // unset($comunas);
                // $regiones[] = $auxRegion;
            // }
            
			// $auxRol["cargo"] = $rol;
            // $auxRol["data_rol"] = $regiones;
            // unset($regiones);
            // $arrFinal[] = $auxRol;
        // }
        // $arrFinal["contador"] = $arrCont;
		
        // return response()->json(array("resultado"=>"ok","descripcion"=>$arrFinal)); 
    // }

    // public function listaPersonalPorEstado(Request $request){
        
        // $post = $request->all();    
		
		// //******INICIO INICIALIZAMOS

		// //todos los cargos
		// $cargo = Cargo::get();
		// foreach($cargo as $cargos){
			// $_cargo[] = $cargos->nombre_rol;
		// }
		
		// //todas las comunas/regiones donde hay sede
		// $sql = DB::select("SELECT
                            // region.nombre as region,
                            // comuna.nombre as comuna
							// FROM core.region as region, core.comuna as comuna, infraestructura.sede as sede
							// WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
							// ");
		
		// foreach($sql as $region){
			// $_region[$region->region][] = $region->comuna;
		// }
		
		// //todos los estados
		// $_estado[] = 'reclutado';
		// $_estado[] = 'preseleccionado';
		// $_estado[] = 'capacitado';
		// $_estado[] = 'seleccionado';
		// $_estado[] = 'contratado';
        
        // foreach ($_estado as $estadoAux) {
            // foreach($_region as $region=>$comunas){
				// foreach($comunas as $comuna){
                    // $arrComunas[] = $comuna;
                    // foreach($_cargo as $_cargoAux){
						// $arr[$estadoAux][$region][$comuna][$_cargoAux] = 0;
					// }
                // }
            // }
        // }

        // //******FIN INICIALIZAMOS
        
		// $sql = DB::select("SELECT
                            // rrhh.persona_cargo.estado,
                            // core.region.nombre AS region,
                            // core.comuna.nombre AS comuna,
                            // rrhh.cargo.nombre_rol,
                            // COUNT ( rrhh.cargo.nombre_rol ) AS cuenta_rol
                            // FROM rrhh.persona
                            // INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            // INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            // INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            // INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            // WHERE rrhh.persona.modificado = TRUE 
                            // AND rrhh.persona.borrado = FALSE 
                            // GROUP BY
                            // rrhh.persona_cargo.estado,
                            // core.region.nombre,
                            // core.region.orden_geografico,
                            // core.comuna.nombre,
                            // rrhh.cargo.nombre_rol 
                            // ORDER BY
                            // core.region.orden_geografico,
                            // core.comuna.nombre");
        // foreach ($sql as $value) {
            // $arr[$value->estado][$value->region][$value->comuna][$value->nombre_rol] = $value->cuenta_rol;
        // }
		
		// $arrFinal = [];
		
        // foreach ($arr as $estado => $data_estado) {
			// $regiones = array();
            // foreach ($data_estado as $region => $data_region) {
				// $comunas = array();
                // foreach ($data_region as $comuna => $data_comuna) {
					// $auxRol = array();
					
                    // foreach ($data_comuna as $rol => $cont) {
                        // if(in_array($comuna, $arrComunas)){
                            // switch ($rol) {
                                // case 'Examinador de Apoyo':
                                    // $_rol = 'examinador_de_apoyo';
                                    // break;
                                // case 'Anfitrión':
                                    // $_rol = 'anfitrion';
                                    // break;
                                // default:
                                    // $_rol = $rol;
                                    // break;
                            // }
                            // @$arrCont[$estado][$_rol] += $cont;
                        // }
                        // $auxRol[$_rol] = $cont;
                    // }
                    // if(in_array($comuna, $arrComunas)){
                        // $auxComuna["comuna"] = $comuna;
					
                        // $auxComuna["data_comuna"] = $auxRol;
                        // $comunas[] = $auxComuna;
                    // }
                // }
                // $auxRegion["region"] = $region;
                // $auxRegion["data_region"] = $comunas;
                // unset($comunas);
                // $regiones[] = $auxRegion;
            // }
            
			// $auxEstado["estado"] = $estado;
            // $auxEstado["data_estado"] = $regiones;
            // unset($regiones);
            // $arrFinal[] = $auxEstado;
        // }
        // $arrFinal["contador"] = $arrCont;
		
        // return response()->json(array("resultado"=>"ok","descripcion"=>$arrFinal)); 
    // }
	
//}