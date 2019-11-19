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
use App\Models\RRHH\Capacitacion;

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
				@$t[substr(date("Y-m-d H:i:s"),0,10)]++;
			}
			else{
				@$t[substr($totalWnsAux->created_at,0,10)]++;
			}
			
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
        
        //Capacitaciones
        $sql = DB::select("SELECT
                            rrhh.capacitacion.id_capacitacion,
                            rrhh.capacitacion_prueba.prueba,
                            rrhh.capacitacion_prueba.puntaje,
                            rrhh.capacitacion_prueba.nota,
                            rrhh.capacitacion_persona.estado,
                            rrhh.capacitacion_persona.confirma_asistencia,
							rrhh.capacitacion_persona.asistencia,
                            rrhh.capacitacion.id_comuna,
                            rrhh.capacitacion_persona.id_persona
                            FROM
                            rrhh.capacitacion_prueba
                            INNER JOIN rrhh.capacitacion_persona ON rrhh.capacitacion_prueba.id_capacitacion_persona = rrhh.capacitacion_persona.id_capacitacion_persona
                            INNER JOIN rrhh.capacitacion ON rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion");
        foreach($sql as $_cap){
            if($_cap->prueba == 'Psicologica'){
				$_capacitacion[$_cap->id_persona][$_cap->prueba]["puntaje"] = ($_cap->puntaje==1)?'Recomendado':'No recomendado';	
			}
			else{
				$_capacitacion[$_cap->id_persona][$_cap->prueba]["puntaje"] = $_cap->puntaje;	
				
			}
			
            $_capacitacionPersona[$_cap->id_persona]["estado"] = ($_cap->estado	!=null)?(($_cap->estado	==true)?1:0):'-';;
            $_capacitacionPersona[$_cap->id_persona]["asistencia"] = ($_cap->asistencia!=null)?(($_cap->asistencia==true)?'Asiste':'No asiste'):'-';
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
		$_estado[] = 'rechazado';
        
		$traduccion["Examinador de Apoyo"] = "examinador_de_apoyo";
		$traduccion["Anfitrión"] = "anfitrion";
		$traduccion["Examinador"] = "Examinador";
		$traduccion["Supervisor"] = "Supervisor";		
			
        foreach ($_estado as $estadoAux) {
            foreach($_region as $region=>$comunas){
				foreach($comunas as $comuna){
                    $arrComunas[] = $comuna;
                    foreach($_cargo as $_cargoAux){
						$arr[$estadoAux][$region][$comuna][$_cargoAux] = 0;
						$arr[$estadoAux][$region][$comuna]["nombre_comuna"] = $comuna;
						if(array_key_exists($_cargoAux, $traduccion)){
							$arrCont[$estadoAux][$traduccion[$_cargoAux]] = 0;
						}
					}
                }
            }
        }
      //******FIN INICIALIZAMOS

		$totalWns = DB::select("SELECT estado_proceso, nombre_rol, rrhh.persona.id_persona, rrhh.persona.run, rrhh.persona.nombres, rrhh.persona.apellido_paterno, rrhh.persona.estado_proceso, rrhh.persona.id_comuna_postulacion, core.comuna.nombre
								FROM rrhh.persona
								INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
								INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
								INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
								INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
								WHERE rrhh.persona.modificado = TRUE 
								AND rrhh.persona.borrado = FALSE 
								AND rrhh.persona.id_comuna_postulacion in (SELECT
								comuna.id_comuna
								FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
								WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna
								)");
	
		$conTotal = array();
        $totalCapacitados = array();
        $totalPreseleccionado = array();
        $totalSeleccionado = array();
        $totalContratado = array();
		
		
		
		foreach($totalWns as $totalWnsAux){
			
			if(@!in_array($totalWnsAux->id_persona, $yaContada)){
				$conTotal[$totalWnsAux->id_persona]	= true;
				@$_arrComuna[$totalWnsAux->nombre]["reclutado"]++;
				
				if($totalWnsAux->estado_proceso == 'capacitado'){
					if($totalWnsAux->nombre_rol=='Examinador'){
						@$totalCapacitados[$totalWnsAux->id_persona]	= true;		
						@$_arrComuna[$totalWnsAux->nombre]["capacitado"]++;
						if(array_key_exists($totalWnsAux->id_persona, $_capacitacionPersona)){
							$_arrComunaCapacitados["rut"] = $totalWnsAux->run;
							$_arrComunaCapacitados["nombre"] = $totalWnsAux->nombres;
							$_arrComunaCapacitados["apellido"] = $totalWnsAux->apellido_paterno;
							$_arrComunaCapacitados["psicologica_pts"] = isset($_capacitacion[$totalWnsAux->id_persona]["Psicologica"]["puntaje"]) ? $_capacitacion[$totalWnsAux->id_persona]["Psicologica"]["puntaje"] : null;
							$_arrComunaCapacitados["tecnica_pts"] = isset($_capacitacion[$totalWnsAux->id_persona]["Técnica"]["puntaje"]) ? $_capacitacion[$totalWnsAux->id_persona]["Técnica"]["puntaje"] : null;
							$_arrComunaCapacitados["estado"] = $_capacitacionPersona[$totalWnsAux->id_persona]["estado"]; //isset($_capacitacion[$totalWnsAux->id_persona]["Técnica"]["estado"]) ? $_capacitacion[$totalWnsAux->id_persona]["Técnica"]["estado"] : null;
							$_arrComunaCapacitados["asistencia"] = $_capacitacionPersona[$totalWnsAux->id_persona]["asistencia"];  //isset($_capacitacion[$totalWnsAux->id_persona]["Técnica"]["asistencia"]) ? $_capacitacion[$totalWnsAux->id_persona]["Técnica"]["asistencia"] : null;
							$arrLista[$totalWnsAux->nombre]['capacitado'][] = $_arrComunaCapacitados;
						}
					}					
				}
				
				if($totalWnsAux->estado_proceso == 'seleccionado'){
					@$totalSeleccionado[$totalWnsAux->id_persona]	= true;	
					@$_arrComuna[$totalWnsAux->nombre]["seleccionado"]++;

					if($totalWnsAux->nombre_rol=='Examinador'){
						@$_arrComuna[$totalWnsAux->nombre]["capacitado"]++;
						if(array_key_exists($totalWnsAux->id_persona, $_capacitacionPersona)){
							$_arrComunaCapacitados["rut"] = $totalWnsAux->run;
							$_arrComunaCapacitados["nombre"] = $totalWnsAux->nombres;
							$_arrComunaCapacitados["apellido"] = $totalWnsAux->apellido_paterno;
							$_arrComunaCapacitados["psicologica_pts"] = isset($_capacitacion[$totalWnsAux->id_persona]["Psicologica"]["puntaje"]) ? $_capacitacion[$totalWnsAux->id_persona]["Psicologica"]["puntaje"] : null;
							$_arrComunaCapacitados["tecnica_pts"] = isset($_capacitacion[$totalWnsAux->id_persona]["Técnica"]["puntaje"]) ? $_capacitacion[$totalWnsAux->id_persona]["Técnica"]["puntaje"] : null;
							$_arrComunaCapacitados["estado"] = isset($_capacitacion[$totalWnsAux->id_persona]["Técnica"]["estado"]) ? $_capacitacion[$totalWnsAux->id_persona]["Técnica"]["estado"] : null;
							$_arrComunaCapacitados["estado"] = $_capacitacionPersona[$totalWnsAux->id_persona]["estado"]; //isset($_capacitacion[$totalWnsAux->id_persona]["Técnica"]["estado"]) ? $_capacitacion[$totalWnsAux->id_persona]["Técnica"]["estado"] : null;
							$_arrComunaCapacitados["asistencia"] = $_capacitacionPersona[$totalWnsAux->id_persona]["asistencia"];  //isset($_capacitacion[$totalWnsAux->id_persona]["Técnica"]["asistencia"]) ? $_capacitacion[$totalWnsAux->id_persona]["Técnica"]["asistencia"] : null;
							$arrLista[$totalWnsAux->nombre]['capacitado'][] = $_arrComunaCapacitados;
						}	
					}

				
				}
				
				if($totalWnsAux->estado_proceso == 'contratado'){
					@$totalContratado[$totalWnsAux->id_persona]	= true;	
					@$_arrComuna[$totalWnsAux->nombre]["contratado"]++;
                    @$_arrComuna[$totalWnsAux->nombre]["seleccionado"]++;

					if($totalWnsAux->nombre_rol=='Examinador'){
						@$_arrComuna[$totalWnsAux->nombre]["capacitado"]++;
						if(array_key_exists($totalWnsAux->id_persona, $_capacitacionPersona)){
							$_arrComunaCapacitados["rut"] = $totalWnsAux->run;
							$_arrComunaCapacitados["nombre"] = $totalWnsAux->nombres;
							$_arrComunaCapacitados["apellido"] = $totalWnsAux->apellido_paterno;
							$_arrComunaCapacitados["psicologica_pts"] = isset($_capacitacion[$totalWnsAux->id_persona]["Psicologica"]["puntaje"]) ? $_capacitacion[$totalWnsAux->id_persona]["Psicologica"]["puntaje"] : null;
							$_arrComunaCapacitados["tecnica_pts"] = isset($_capacitacion[$totalWnsAux->id_persona]["Técnica"]["puntaje"]) ? $_capacitacion[$totalWnsAux->id_persona]["Técnica"]["puntaje"] : null;
							$_arrComunaCapacitados["estado"] = $_capacitacionPersona[$totalWnsAux->id_persona]["estado"]; //isset($_capacitacion[$totalWnsAux->id_persona]["Técnica"]["estado"]) ? $_capacitacion[$totalWnsAux->id_persona]["Técnica"]["estado"] : null;
							$_arrComunaCapacitados["asistencia"] = $_capacitacionPersona[$totalWnsAux->id_persona]["asistencia"];  //isset($_capacitacion[$totalWnsAux->id_persona]["Técnica"]["asistencia"]) ? $_capacitacion[$totalWnsAux->id_persona]["Técnica"]["asistencia"] : null;
							$arrLista[$totalWnsAux->nombre]['capacitado'][] = $_arrComunaCapacitados;
						}
					}
					
				}
			
				if(array_key_exists($totalWnsAux->nombre_rol, $traduccion)){

					//capacitado
					if($totalWnsAux->estado_proceso == 'capacitado' || $totalWnsAux->estado_proceso == 'seleccionado' || $totalWnsAux->estado_proceso == 'contratado'){
						if($traduccion[$totalWnsAux->nombre_rol]=='Examinador'){
							@$arrCont["capacitado"][$traduccion[$totalWnsAux->nombre_rol]]++;					
						}
						else{
							@$arrCont["capacitado"][$traduccion[$totalWnsAux->nombre_rol]] = 0;
						}
					}
					
					//seleccionado
					if($totalWnsAux->estado_proceso == 'contratado' || $totalWnsAux->estado_proceso == 'seleccionado'){
						@$arrCont["seleccionado"][$traduccion[$totalWnsAux->nombre_rol]]++;				
					}
					
					//contratado
					if($totalWnsAux->estado_proceso == 'contratado'){
						@$arrCont["contratado"][$traduccion[$totalWnsAux->nombre_rol]]++;				
					}
				}			
			}
			
			//para los ratios
			if(array_key_exists($totalWnsAux->nombre_rol, $traduccion)){

				@$arrCont["reclutado"][$traduccion[$totalWnsAux->nombre_rol]]++;		
			}


			$yaContada[] = $totalWnsAux->id_persona;
		}

		$sql = DB::select("SELECT
                            rrhh.persona.estado_proceso as estado,
                            core.region.nombre AS region,
                            core.comuna.nombre AS comuna,
							core.comuna.id_comuna,
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
							core.comuna.id_comuna,
                            rrhh.cargo.nombre_rol 
                            ORDER BY
                            core.region.orden_geografico,
                            core.comuna.nombre");

        foreach ($sql as $value) {
            if(($value->estado == 'preseleccionado')||($value->estado == 'rechazado')){
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
                            
							//esta linea es para la tabla, cols después de avance
							if($estado=='capacitado'){
								if((($_rol=='examinador_de_apoyo')||($_rol=='anfitrion')||($_rol=='Supervisor'))){
									$auxRol[$_rol] = 0;	
								}
								else{
									//if($_rol=='Examinador'){
										$auxRol[$_rol] = $cont;		
									//}
								}
							}
							else{
								$auxRol[$_rol] = $cont;	
							}							
						}
                    }
                    if(in_array($comuna, $arrComunas)){
                        $auxComuna["comuna"] = $comuna;
                        $auxComuna["data_comuna"] = $auxRol;
                        $auxComuna["data_comuna"]["requeridos"] = isset($req_comuna[$comuna]) ? $req_comuna[$comuna] : null;
						$auxComuna["data_comuna"]["wnsUnicos"] = isset($_arrComuna[$comuna][$estado]) ? $_arrComuna[$comuna][$estado] : 0;
						$auxComuna["data_comuna"]["capacitados"] = isset($arrLista[$comuna][$estado]) ? $arrLista[$comuna][$estado] : array();
						
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
		$arrFinal["contador"]["totalWns"] = count($conTotal);
        $arrFinal["contador"]["total_capacitado"] = count($totalCapacitados) + count($totalSeleccionado) + count($totalContratado);
        $arrFinal["contador"]["total_seleccionado"] = count($totalSeleccionado);
        $arrFinal["contador"]["total_contratado"] = count($totalContratado);
	
        return response()->json(array("resultado"=>"ok","descripcion"=>$arrFinal)); 
	}
	
	public function capacitacionesPorComuna(Request $request){
		$post = $request->all();

		$validacion = Validator::make($post, [
            'nombre_comuna' => 'required|string', 
		]); 
		
		if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
		}
		
		$sql = DB::select("SELECT
							rrhh.capacitacion.lugar,
							rrhh.capacitacion.id_capacitacion,
							rrhh.capacitacion.fecha_hora,
							rrhh.capacitacion.archivo_asistencia,
							rrhh.persona.nombres,
							rrhh.persona.apellido_paterno,
							rrhh.persona.apellido_materno,
							rrhh.persona.run
							FROM
							rrhh.capacitacion
							INNER JOIN rrhh.persona ON rrhh.capacitacion.id_relator = rrhh.persona.id_persona 
							INNER JOIN core.comuna ON rrhh.capacitacion.id_comuna = core.comuna.id_comuna
							WHERE
							core.comuna.nombre ILIKE '". $post["nombre_comuna"] ."'");
		$arr = [];
		if(sizeof($sql) > 0){
			foreach ($sql as $value) {
				$aux["archivo"] = $value->archivo_asistencia != null ? $value->id_capacitacion : null;
				$aux["lugar"] = $value->lugar;
				$aux["fecha_hora"] = $value->fecha_hora;
				$aux["nombre"] = $value->nombres . " " . $value->apellido_paterno;
				$aux["run"] = $value->run;
				$arr[] = $aux;
			}
			return response()->json(array("resultado"=>"ok","descripcion"=>$arr)); 
		}else{
			return response()->json(array("resultado"=>"error","descripcion"=>"No se encontraron capacitaciones para esta comuna.")); 
		}
	}

	public function descargaArchivoCapacitacion($idCapacitacion){
		$cap = Capacitacion::find($idCapacitacion);
		if(!isset($cap->id_capacitacion)){
			return response()->json(array("resultado"=>"error","descripcion"=>"Capacitación enviada no existe.")); 
		}
		$ext = $this->diccionarioTipos($cap->archivo_mimetype);
		$decoded = base64_decode($cap->archivo_asistencia);

		$file = 'archivo.' . $ext;
		file_put_contents($file, $decoded);
		
		if (file_exists($file)) {
			header('Content-Description: File Transfer');
			header('Content-Type: application/octet-stream');
			header('Content-Disposition: attachment; filename="'.basename($file).'"');
			header('Expires: 0');
			header('Cache-Control: must-revalidate');
			header('Pragma: public');
			header('Content-Length: ' . filesize($file));
			readfile($file);
			exit;
		}
	}

	function diccionarioTipos($mimeType){
		$salida = "";
		switch ($mimeType) {
			case 'image/jpeg':
				$salida = "jpg";
				break;
			case 'image/png':
				$salida = "png";
				break;
			case 'application/pdf':
				$salida = "pdf";
				break;
			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				$salida = "docx";
				break;
			case 'application/msword':
				$salida = "doc";
				break;
		}
		return $salida;
	}
	
}