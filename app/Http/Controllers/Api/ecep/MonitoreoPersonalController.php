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

	public function inscritosDia(Request $request){
		$totalWns = DB::select("SELECT created_at, id_persona FROM rrhh.persona WHERE id_persona in (
				                    SELECT rrhh.persona.id_persona
                                    FROM rrhh.persona
                                    INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                                    INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                                    INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                                    INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                                    WHERE rrhh.persona.modificado = TRUE 
                                    AND rrhh.persona.borrado = FALSE)
                                    AND rrhh.persona.id_comuna_postulacion in (SELECT
                                    comuna.id_comuna
                                    FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
                                    WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna)
                                    ORDER BY created_at desc");
							
		foreach($totalWns as $totalWnsAux){
			
			if(($totalWnsAux->created_at=="") || ($totalWnsAux->created_at ==null)){
				$p = Persona::find($totalWnsAux->id_persona);
				$p->created_at = date("Y-m-d H:i:s");
				$p->save();
			}
			@$t[substr($totalWnsAux->created_at,0,10)]++;
		}
		foreach($t as $fecha=>$inscritos){
			$res['fecha'] = $fecha;
			$res['inscritos'] = $inscritos;
			$resFinal[] = $res;
		}
		return response()->json($resFinal);
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
							FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
							WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
                            ORDER BY region.orden_geografico, comuna.nombre
							");
		
		foreach($sql as $region){
			$_region[$region->region][] = $region->comuna;
		}
		
        //todos los estados
        $_estado[] = 'reclutado';
        $_estado[] = 'postulante';
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

        $sql = DB::select("SELECT
                core.comuna.nombre,
                SUM(infraestructura.estimacion.examinadores) as total_examinadores,
                SUM(infraestructura.estimacion.anfitriones) as total_anfitriones,
                SUM(infraestructura.estimacion.supervisores) as total_supervisores,
                SUM(infraestructura.estimacion.examinador_apoyo) as total_ex_apoyo
                FROM
                infraestructura.estimacion
                INNER JOIN core.comuna ON infraestructura.estimacion.id_comuna = core.comuna.id_comuna
				WHERE infraestructura.estimacion.dia = 1
                GROUP BY core.comuna.nombre
                ORDER BY core.comuna.nombre");
       
        foreach ($sql as $_req) {
            $req_comuna[$_req->nombre]["Examinador"] = $_req->total_examinadores;
            $req_comuna[$_req->nombre]["anfitrion"] = $_req->total_anfitriones;
            $req_comuna[$_req->nombre]["Supervisor"] = $_req->total_supervisores;
            $req_comuna[$_req->nombre]["examinador_de_apoyo"] = $_req->total_ex_apoyo;
        }
        //******FIN INICIALIZAMOS
        
		$sql = DB::select("SELECT
                            rrhh.persona.estado_proceso as estado,
                            core.region.nombre as region,
                            core.comuna.nombre as comuna,
                            rrhh.cargo.nombre_rol,
                            count (rrhh.persona.estado_proceso) as cuenta_estado
                            FROM
                            rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region
                            WHERE rrhh.persona.modificado = true AND rrhh.persona.borrado = false
                            GROUP BY rrhh.persona.estado_proceso, core.region.nombre, core.region.orden_geografico, core.comuna.nombre, rrhh.cargo.nombre_rol order by core.region.orden_geografico, core.comuna.nombre");

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
                            
                            if($cargo == "reclutado"){
                                if($cargo != "postulante"){
                                    $auxCargo[$cargo] = $cont;
                                    @$auxCargo["postulante"] += $cont;
                                    @$arrCont[$_rol][$cargo] += $cont;
                                    @$arrCont[$_rol]["postulante"] += $cont;
                                }
                            }else{
                                if($cargo != "postulante"){
                                    $auxCargo[$cargo] = $cont;
                                    @$auxCargo["postulante"] += $cont;
                                    @$arrCont[$_rol][$cargo] += $cont;
                                    @$arrCont[$_rol]["postulante"] += $cont;
                                }          
                            }
                        }
                    }
                    if(in_array($comuna, $arrComunas)){
                        $auxComuna["comuna"] = $comuna;
				        $auxCargo["requeridos"] = isset($req_comuna[$comuna][$_rol]) ? $req_comuna[$comuna][$_rol] : null;
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
							FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
							WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
                            ORDER BY region.orden_geografico, comuna.nombre
							");
		
		foreach($sql as $region){
			$_region[$region->region][] = $region->comuna;
		}

        $sql = DB::select("SELECT
                core.comuna.nombre,
                SUM(infraestructura.estimacion.examinadores) as total_examinadores,
                SUM(infraestructura.estimacion.anfitriones) as total_anfitriones,
                SUM(infraestructura.estimacion.supervisores) as total_supervisores,
                SUM(infraestructura.estimacion.examinador_apoyo) as total_ex_apoyo
                FROM
                infraestructura.estimacion
                INNER JOIN core.comuna ON infraestructura.estimacion.id_comuna = core.comuna.id_comuna
				WHERE infraestructura.estimacion.dia = 1
                GROUP BY core.comuna.nombre
                ORDER BY core.comuna.nombre");
       
        foreach ($sql as $_req) {
            $req_comuna[$_req->nombre]["Examinador"] = $_req->total_examinadores;
            $req_comuna[$_req->nombre]["anfitrion"] = $_req->total_anfitriones;
            $req_comuna[$_req->nombre]["Supervisor"] = $_req->total_supervisores;
            $req_comuna[$_req->nombre]["examinador_de_apoyo"] = $_req->total_ex_apoyo;
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
                            AND rrhh.persona.estado_proceso like 'reclutado' 
							and rrhh.persona.id_persona in (SELECT rrhh.persona.id_persona
                            FROM rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            WHERE rrhh.persona.modificado = TRUE 
                            AND rrhh.persona.borrado = FALSE )
							
							AND core.comuna.id_comuna in (SELECT
                            core.comuna.id_comuna
							FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
							WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
                            ORDER BY region.orden_geografico, comuna.nombre)");
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
                            AND rrhh.persona.estado_proceso like 'capacitado'
							and rrhh.persona.id_persona in (SELECT rrhh.persona.id_persona
                            FROM rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            WHERE rrhh.persona.modificado = TRUE 
                            AND rrhh.persona.borrado = FALSE )		
							AND core.comuna.id_comuna in (SELECT
                            core.comuna.id_comuna
							FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
							WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
                            ORDER BY region.orden_geografico, comuna.nombre)							
							
							
							");
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
                            AND rrhh.persona.estado_proceso like 'seleccionado'
							and rrhh.persona.id_persona in (SELECT rrhh.persona.id_persona
                            FROM rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            WHERE rrhh.persona.modificado = TRUE 
                            AND rrhh.persona.borrado = FALSE )		
							AND core.comuna.id_comuna in (SELECT
                            core.comuna.id_comuna
							FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
							WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
                            ORDER BY region.orden_geografico, comuna.nombre)							

							
							");
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
                            AND rrhh.persona.estado_proceso like 'contratado'
							and rrhh.persona.id_persona in (SELECT rrhh.persona.id_persona
                            FROM rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            WHERE rrhh.persona.modificado = TRUE 
                            AND rrhh.persona.borrado = FALSE )	
							AND core.comuna.id_comuna in (SELECT
                            core.comuna.id_comuna
							FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
							WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
                            ORDER BY region.orden_geografico, comuna.nombre)							
							
							");
        $total_contratado = $count_contratado[0]->cuenta_persona;

        $count_preseleccionado = DB::select("SELECT
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
                            AND rrhh.persona.estado_proceso like 'preseleccionado'
							and rrhh.persona.id_persona in (SELECT rrhh.persona.id_persona
                            FROM rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            WHERE rrhh.persona.modificado = TRUE 
                            AND rrhh.persona.borrado = FALSE )		
							AND core.comuna.id_comuna in (SELECT
                            core.comuna.id_comuna
							FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
							WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
                            ORDER BY region.orden_geografico, comuna.nombre)							
							
							");
        $total_preseleccionado = $count_preseleccionado[0]->cuenta_persona;
        //******FIN INICIALIZAMOS

        /* Contador unico postulantes*/
		$sql = DB::select("SELECT distinct(rrhh.persona.id_persona), rrhh.persona.id_comuna_postulacion, core.comuna.nombre
                            FROM rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            WHERE rrhh.persona.modificado = TRUE 
                            AND rrhh.persona.borrado = FALSE 
                            AND core.comuna.id_comuna in (SELECT
                            core.comuna.id_comuna
                            FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
                            WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
                            ORDER BY region.orden_geografico, comuna.nombre)");
        foreach ($sql as $value) {
            @$_arrComuna[$value->nombre]["reclutado"]++;
        }

        /* Contador unico capacitados*/
        $sql = DB::select("SELECT distinct(rrhh.persona.id_persona), rrhh.persona.id_comuna_postulacion, core.comuna.nombre
                            FROM rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            WHERE rrhh.persona.modificado = TRUE 
                            AND rrhh.persona.borrado = FALSE 
                            AND rrhh.persona.estado_proceso LIKE 'capacitado'
                            AND core.comuna.id_comuna in (SELECT
                            core.comuna.id_comuna
                            FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
                            WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
                            ORDER BY region.orden_geografico, comuna.nombre)");
        foreach ($sql as $value) {
            @$_arrComuna[$value->nombre]["capacitado"]++;
        }

        /* Contador unico seleccionados*/
        $sql = DB::select("SELECT distinct(rrhh.persona.id_persona), rrhh.persona.id_comuna_postulacion, core.comuna.nombre
                            FROM rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            WHERE rrhh.persona.modificado = TRUE 
                            AND rrhh.persona.borrado = FALSE 
                            AND rrhh.persona.estado_proceso LIKE 'seleccionado'
                            AND core.comuna.id_comuna in (SELECT
                            core.comuna.id_comuna
                            FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
                            WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
                            ORDER BY region.orden_geografico, comuna.nombre)");
        foreach ($sql as $value) {
            @$_arrComuna[$value->nombre]["seleccionado"]++;
        }

        /* Contador unico contratados*/
        $sql = DB::select("SELECT distinct(rrhh.persona.id_persona), rrhh.persona.id_comuna_postulacion, core.comuna.nombre
                            FROM rrhh.persona
                            INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                            INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                            INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                            INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                            WHERE rrhh.persona.modificado = TRUE 
                            AND rrhh.persona.borrado = FALSE 
                            AND rrhh.persona.estado_proceso LIKE 'contratado'
                            AND core.comuna.id_comuna in (SELECT
                            core.comuna.id_comuna
                            FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
                            WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
                            ORDER BY region.orden_geografico, comuna.nombre)");
        foreach ($sql as $value) {
            @$_arrComuna[$value->nombre]["contratado"]++;
        }
		
		$sql = DB::select("SELECT
                            rrhh.persona.estado_proceso as estado,
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
                            rrhh.persona.estado_proceso,
                            core.region.nombre,
                            core.region.orden_geografico,
                            core.comuna.nombre,
                            rrhh.cargo.nombre_rol 
                            ORDER BY
                            core.region.orden_geografico,
                            core.comuna.nombre");

        foreach ($sql as $value) {
            if($value->estado == 'preseleccionado'){
				$value->estado = 'reclutado';
			}
			@$arr[$value->estado][$value->region][$value->comuna][$value->nombre_rol]+= $value->cuenta_rol;
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
                            $auxRol[$_rol] = $cont;
							if($estado == 'preseleccionado' || $estado == 'rechazado'){
								$estado = 'reclutado';
                            }
                            if($estado == 'capacitado'){
                                @$arrCont[$estado]["Examinador"] += $cont;
                            }
                            @$arrCont[$estado][$_rol] += $estado != "capacitado" ? $cont : 0;
                            if($estado == 'capacitado' || $estado == 'seleccionado' || $estado == 'contratado'){
                                @$arrCont["reclutado"][$_rol] += $cont;
                            }
						}
                    }
                    if(in_array($comuna, $arrComunas)){
                        $auxComuna["comuna"] = $comuna;
                        $auxComuna["data_comuna"] = $auxRol;
                        $auxComuna["data_comuna"]["requeridos"] = isset($req_comuna[$comuna]) ? $req_comuna[$comuna] : null;
						$auxComuna["data_comuna"]["wnsUnicos"] = isset($_arrComuna[$comuna][$estado]) ? $_arrComuna[$comuna][$estado] : 0;
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
		
		$totalWns = DB::select("SELECT count(*) as totalwns FROM rrhh.persona WHERE id_persona in (
                                    SELECT rrhh.persona.id_persona
                                    FROM rrhh.persona
                                    INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
                                    INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
                                    INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                                    INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
                                    WHERE rrhh.persona.modificado = TRUE 
                                    AND rrhh.persona.borrado = FALSE 
                                    )
                                    AND rrhh.persona.id_comuna_postulacion in (SELECT
                                    comuna.id_comuna
                                    FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
                                    WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
                                    )");

        $arrFinal["contador"] = $arrCont;
		$arrFinal["contador"]["totalWns"] = $totalWns[0]->totalwns;
		$arrFinal["contador"]["total_reclutado"] = $total_reclutado;
        $arrFinal["contador"]["total_capacitado"] = $total_capacitado;
        $arrFinal["contador"]["total_preseleccionado"] = $total_preseleccionado;
        $arrFinal["contador"]["total_seleccionado"] = $total_seleccionado;
        $arrFinal["contador"]["total_contratado"] = $total_contratado;
        return response()->json(array("resultado"=>"ok","descripcion"=>$arrFinal)); 
    }
}