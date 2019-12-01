<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Infraestructura\Sede;
use App\Models\Infraestructura\Estimacion;
use App\Models\Infraestructura\Zona;
use App\Models\Infraestructura\ZonaRegion;
use App\Models\RRHH\Persona;
use App\Models\RRHH\PersonaAsignacion;
use App\Models\RRHH\PersonaCargo;
use App\Models\Core\Comuna;
use App\Models\Core\Region;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class SedeController extends Controller
{
	 
	public function __construct()
    {
		$this->fields = array();	
    }	

	public function inscritosDia(Request $request)
    {
	
		// $totalWns = DB::select("select created_at, updated_at, id_persona from rrhh.persona where id_persona in (
				// SELECT rrhh.persona.id_persona
											// FROM rrhh.persona
											// INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
											// INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
											// INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
											// INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
											// WHERE rrhh.persona.modificado = TRUE 
											// AND rrhh.persona.borrado = FALSE 
				// )
				// AND rrhh.persona.id_comuna_postulacion in (SELECT
                            // comuna.id_comuna
							// FROM core.region as region, core.comuna as comuna, infraestructura.sede as sede
							// WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna 
                            // ) order by created_at");
							
		$totalWns = DB::select("select rrhh.persona_archivo.created_at as archivo_creado, 
		rrhh.persona.created_at as persona_creada,  
		rrhh.persona.id_persona 
		from rrhh.persona, rrhh.persona_archivo 
		where rrhh.persona.id_persona = rrhh.persona_archivo.id_persona 
		and rrhh.persona.created_at<'2019-10-27 23:00:00'");
		//arreglo($totalWns);exit;
							
							
		foreach($totalWns as $totalWnsAux){
			
			//if($totalWnsAux->created_at == null){
				//DB::select("update rrhh.persona set creado_el = '".$totalWnsAux->archivo_creado."' where id_persona = ".$totalWnsAux->id_persona);
				
			//}
			//@$t[substr($totalWnsAux->created_at,0,10)]++;
		}
		//arreglo($t);
		exit;
		return response()->json($t);
		// arreglo($t);
		// foreach($t as $totalWnsAux){
			// @$tt+=$totalWnsAux;
		// }
		
		// echo $tt;
	}

	public function guardaLiceoCupo(Request $request)
    {
		
		$post = $request->all();	

		$validacion = Validator::make($post, [
			'id_usuario' => 'int|required',
			'id_estimacion' => 'int|required',
			'id_sede' => 'int|required',
		]);

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		//$estimacion = Estimacion::where('id_sede',$post["id_sede"])->first();
		$estimacion = Estimacion::find($post["id_estimacion"]);

		if(isset($estimacion->id_estimacion)){

			if($estimacion->id_sede == $post["id_sede"]){
				return response()->json(["respuesta"=>"error","descripcion"=>"Esta sede ya fue asignada a este cupo"]);
			} 
			//$estimacion->id_estimacion = $post["id_estimacion"];
			$estimacion->id_sede = $post["id_sede"] == -1 ? null : $post["id_sede"];
			DB::beginTransaction();
			try{
				$estimacion->save(); 
			}catch (\Exception $e){
				DB::rollback();
				return response()->json(['respuesta'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
			}
			DB::commit();
			return response()->json(["respuesta"=>"ok","descripcion"=>"Se ha guardado con exito"]);
			
		}
	}		

	public function quitarLiceoCupo(Request $request)
    {
		
		$post = $request->all();	

		$validacion = Validator::make($post, [
			'id_usuario' => 'int|required',
			'id_estimacion' => 'int|required',
		]);

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		//$estimacion = Estimacion::where('id_sede',$post["id_sede"])->first();
		$estimacion = Estimacion::find($post["id_estimacion"]);

		if(isset($estimacion->id_estimacion)){

			$estimacion->id_sede = null;
			DB::beginTransaction();
			try{
				$estimacion->save(); 
			}catch (\Exception $e){
				DB::rollback();
				return response()->json(['respuesta'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
			}
			DB::commit();
			return response()->json(["respuesta"=>"ok","descripcion"=>"Se ha guardado con exito"]);
			
		}
	}	

	public function listaSedeComuna(Request $request)
	{
		
		$post = $request->all();	

		$validacion = Validator::make($post, [
			'id_usuario' => 'int|required',
			'id_comuna' => 'int|required',
			'dia' => 'int|required',
		]);

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$sedeComunas = DB::select('SELECT comuna.id_comuna, sede.rbd, sede.nombre, sede.direccion, sede.id_sede
									FROM infraestructura.sede , core.comuna as comuna , core.region as region
									where sede.id_comuna = comuna.id_comuna 
									and comuna.id_region = region.id_region
									and comuna.id_comuna  = '.$post["id_comuna"].'
									and sede.estado = 2 
									and sede.id_sede not in (select infraestructura.estimacion.id_sede from infraestructura.estimacion where infraestructura.estimacion.id_sede is not null and dia = '.$post["dia"].')
									order by  region, comuna');

		return response()->json($sedeComunas);	
	}	
		
    public function lista(Request $request)
    {
		$post = $request->all();	

		$validacion = Validator::make($post, [
			'id_usuario' => 'int|required',
		]);

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$sede = DB::table('infraestructura.sede')
            ->join('core.comuna', 'infraestructura.sede.id_comuna', '=', 'core.comuna.id_comuna')
            ->join('core.provincia', 'core.comuna.id_provincia', '=', 'core.provincia.id_provincia')
            ->join('core.region', 'core.comuna.id_region', '=', 'core.region.id_region')
            ->leftJoin('infraestructura.sala', 'infraestructura.sede.id_sede', '=', 'infraestructura.sala.id_sede')
            ->leftJoin('infraestructura.centro_operaciones', 'infraestructura.sede.id_centro_operaciones', '=', 'infraestructura.centro_operaciones.id_centro_operaciones')
            ->leftJoin('infraestructura.estimacion', 'infraestructura.sede.id_sede', '=', 'infraestructura.estimacion.id_sede')
            ->select('infraestructura.sede.*', 'core.region.nombre as region', 'core.region.id_region','core.provincia.id_provincia','core.provincia.nombre as provincia','core.comuna.nombre as comuna', 'core.comuna.id_comuna','infraestructura.centro_operaciones.id_centro_operaciones','infraestructura.centro_operaciones.nombre as centro','infraestructura.estimacion.id_sede_ecep','infraestructura.estimacion.id_estimacion','infraestructura.estimacion.dia',
        		DB::raw("count(infraestructura.sala.id_sala) as salas"))
            ->orderBy('core.region.orden_geografico', 'asc')
            ->orderBy('core.comuna.nombre', 'asc')
            ->groupBy('infraestructura.sede.id_sede','core.region.id_region','core.comuna.nombre','core.provincia.id_provincia','core.comuna.id_comuna','infraestructura.centro_operaciones.id_centro_operaciones','infraestructura.estimacion.id_sede_ecep','infraestructura.estimacion.id_estimacion',
        		'infraestructura.estimacion.dia')
            ->get();

      	$reg = DB::select("SELECT r.numero as numero_region, r.nombre as nombre_region , co.id_comuna, co.nombre
                        from core.region r
                        INNER JOIN core.comuna co ON (r.id_region = co.id_region)
                        where r.numero != '-1'
                       order by r.orden_geografico, co.nombre");

		foreach ($reg as $key => $value) {
			$listaAnidada[$value->numero_region][] = $value;
		}

		foreach ($listaAnidada as $id_region => $comunas) {
			$region["id_region"]  = $comunas[0]->numero_region;
			$region["nombre"]  = $comunas[0]->nombre_region;
			$_comunas = array();
			foreach ($comunas as $value) {
				$_comunas[] = $value;
			}
			$region["comunas"]  = $_comunas;
			$listaFinal[] = $region;
		}

		$centros = DB::table('infraestructura.centro_operaciones')
					->leftJoin('core.comuna','infraestructura.centro_operaciones.id_comuna','=','core.comuna.id_comuna')
					->select('infraestructura.centro_operaciones.id_centro_operaciones' /*,'infraestructura.centro_operaciones.nombre'*/,'core.comuna.nombre')
					->where('infraestructura.centro_operaciones.confirmado','=',2)
					->orderBy('core.comuna.nombre', 'asc')
					->get();

		$datos['sedes'] = $sede;
		$datos['regiones'] = $listaFinal;
		$datos['centros'] = $centros;
		return response()->json($datos);	
    }

	public function listaEstimacion(Request $request)
    {
		$post = $request->all();	

		$validacion = Validator::make($post, [
			'id_usuario' => 'int|required',
			'dia' => 'int|required',
		]);

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$pers = Persona::where("id_usuario", $post["id_usuario"])->first();
		$pers_cargo = PersonaCargo::where("id_persona", $pers->id_persona)->where("borrado", false)->get();

		$cargos["zonal"] = false;
		$cargos["regional"] = false;
		$cargos["admin"] = false;
		if(sizeof($pers_cargo) == 0){
			$cargos["admin"] = true;
		}else{
			foreach ($pers_cargo as $_cargo) {
				if($_cargo["id_cargo"] == 1003){
					$cargos["zonal"] = true;
					$id_persona_cargo = $_cargo["id_persona_cargo"];
				}elseif($_cargo["id_cargo"] == 1004){
					$id_persona_cargo = $_cargo["id_persona_cargo"];
					$cargos["regional"] = true;
				}else{
					$cargos["admin"] = true;
				}
			}
		}
		
		
		if($cargos["admin"] == true){
			$sede = DB::select('SELECT comuna.id_comuna,  
								estimacion.id_estimacion, 
								estimacion.docentes, 
								estimacion.dia, 
								region.nombre as region, 
								comuna.nombre as comuna, 
								salas, 
								docentes, 
								sede.rbd, 
								sede.nombre, 
								sede.direccion, 
								estimacion.id_sede_ecep, 
								estimacion.id_sede,
								examinadores,
								anfitriones,
								supervisores,
								examinador_apoyo
								FROM infraestructura.estimacion as estimacion 
								left join infraestructura.sede on (estimacion.id_sede = sede.id_sede), core.comuna as comuna , core.region as region
								where estimacion.id_comuna = comuna.id_comuna 
								and comuna.id_region = region.id_region
								and estimacion.dia = '.$post['dia'].'
								order by  region, comuna');
		}elseif($cargos["zonal"] == true){
			$zona = Zona::where("id_coordinador", $id_persona_cargo)->first();
			$zona_region = ZonaRegion::where("id_zona", $zona->id_zona)->get();
			$str_sql = "";
			foreach ($zona_region as $z_regs) {
				$str_sql .= " region.id_region = " . $z_regs["id_region"] . " OR";
			}
			$str_sql = substr($str_sql,0,-2);

			$sede = DB::select('SELECT comuna.id_comuna,  
								estimacion.id_estimacion, 
								estimacion.docentes, 
								estimacion.dia, 
								region.nombre as region, 
								comuna.nombre as comuna, 
								salas, 
								docentes, 
								sede.rbd, 
								sede.nombre, 
								sede.direccion, 
								estimacion.id_sede_ecep, 
								estimacion.id_sede,
								examinadores,
								anfitriones,
								supervisores,
								examinador_apoyo
								FROM infraestructura.estimacion as estimacion 
								left join infraestructura.sede on (estimacion.id_sede = sede.id_sede), core.comuna as comuna , core.region as region
								where estimacion.id_comuna = comuna.id_comuna 
								and comuna.id_region = region.id_region 
								AND (' . $str_sql . ')
								and estimacion.dia = '.$post['dia'].'
								order by  region, comuna');
		}elseif($cargos["regional"] == true){
			$zona_region = ZonaRegion::where("id_coordinador", $id_persona_cargo)->get();
			$str_sql = "";
			foreach ($zona_region as $z_regs) {
				$str_sql .= " region.id_region = " . $z_regs["id_region"] . " OR";
			}
			$str_sql = substr($str_sql,0,-2);

			$sede = DB::select('SELECT comuna.id_comuna,  
								estimacion.id_estimacion, 
								estimacion.docentes, 
								estimacion.dia, 
								region.nombre as region, 
								comuna.nombre as comuna, 
								salas, 
								docentes, 
								sede.rbd, 
								sede.nombre, 
								sede.direccion, 
								estimacion.id_sede_ecep, 
								estimacion.id_sede,
								examinadores,
								anfitriones,
								supervisores,
								examinador_apoyo
								FROM infraestructura.estimacion as estimacion 
								left join infraestructura.sede on (estimacion.id_sede = sede.id_sede), core.comuna as comuna , core.region as region
								where estimacion.id_comuna = comuna.id_comuna 
								and comuna.id_region = region.id_region 
								AND (' . $str_sql . ')
								and estimacion.dia = '.$post['dia'].'
								order by  region, comuna');
		}

		$cont_total_exa = 0;
		$cont_total_anf = 0;
		$cont_total_exa_ap = 0;
		$cont_total_sup = 0;
		$cont_total_exa_req = 0;
		$cont_total_anf_req = 0;
		$cont_total_exa_ap_req = 0;
		$cont_total_sup_req = 0;
		foreach ($sede as $value) {
			$count_examinadores = PersonaAsignacion::where("id_estimacion", $value->id_estimacion)->where("id_cargo", 8)->count();
			$cont_total_exa += $count_examinadores;
			$count_supervisores = PersonaAsignacion::where("id_estimacion", $value->id_estimacion)->where("id_cargo", 9)->count();
			$cont_total_sup += $count_supervisores;
			$count_anfitriones = PersonaAsignacion::where("id_estimacion", $value->id_estimacion)->where("id_cargo", 1006)->count();
			$cont_total_anf += $count_anfitriones;
			$count_ex_apoyo = PersonaAsignacion::where("id_estimacion", $value->id_estimacion)->where("id_cargo", 1007)->count();
			$cont_total_exa_ap += $count_ex_apoyo;

			$value->examinadores_asignados = $count_examinadores;
			$value->supervisores_asignados = $count_supervisores;
			$value->anfitriones_asignados = $count_anfitriones;
			$value->ex_apoyo_asignados = $count_ex_apoyo;

			$cont_total_exa_req += $value->examinadores;
			$cont_total_anf_req += $value->anfitriones;
			$cont_total_exa_ap_req += $value->examinador_apoyo != null ? $value->examinador_apoyo : 0;
			$cont_total_sup_req += $value->supervisores;
		}
		$contadores["exa_asignados"] = $cont_total_exa;
		$contadores["sup_asignados"] = $cont_total_sup;
		$contadores["anf_asignados"] = $cont_total_anf;
		$contadores["exa_ap_asignados"] = $cont_total_exa_ap;
		$contadores["exa_requeridos"] = $cont_total_exa_req;
		$contadores["sup_requeridos"] = $cont_total_sup_req;
		$contadores["anf_requeridos"] = $cont_total_anf_req;
		$contadores["exa_ap_requeridos"] = $cont_total_exa_ap_req;
		$sede["contadores"] = $contadores;
		return response()->json($sede);	
	}		
	
    public function obtenerDataLiceo(Request $request){
		$post = $request->all();		

		$validator = Validator::make($request->all(), [
            'id_usuario' => 'required|int',
            'rbd' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(array("respuesta"=>"error","descripcion"=>$validator->errors()), 422);
        }

		$curl = curl_init();

		curl_setopt_array($curl, array(
		CURLOPT_URL => "http://api.datos.mineduc.cl/api/v2/datastreams/DIREC-DE-ESTAB-PRELI-2018/data.ajson/?auth_key=ead255281d8c4197bdb46aaf6c010a276cdd2375&filter0=column1[==]" . $post["rbd"],
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => "GET",
		CURLOPT_HTTPHEADER => array(
			"cache-control: no-cache"
		),
		));

		$response = curl_exec($curl);
		$err = curl_error($curl);

		curl_close($curl);
		$datos = json_decode($response);
		//arreglo($datos);exit();
		if(isset($datos->result[1])){
			$data = $datos->result[1];
			$arr["nombre"] = $data[3];
			$arr["id_region"] = $data[7];
			$arr["id_comuna"] = $data[9];
			$arr["comuna"] = $data[10];
		}else{
			return response()->json(array("respuesta"=>"error","descripcion"=>"No se encontraron datos para el RBD ingresado"));
		}
		return response()->json($arr);
	}

	public function obtenerDatosSede(Request $request){
		$post = $request->all();		

		$validator = Validator::make($request->all(), [
            'id_usuario' => 'required|int',
            'id_sede' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(array("respuesta"=>"error","descripcion"=>$validator->errors()), 422);
        }

		$sede = Sede::find($post["id_sede"]);
		$est = Estimacion::where('id_sede', $sede->id_sede)->first();
		if($est->id_jefe_sede != null){
			$pers_cargo = PersonaCargo::find($est->id_jefe_sede);
			$pers = Persona::find($pers_cargo->id_persona);
			if(isset($pers)){
				$nombre_jefe = $pers->nombres . " " . $pers->apellido_paterno;
			}else{
				
			}
		}else{
			$nombre_jefe = null;
		}
		
		$comuna = Comuna::find($sede->id_comuna);
		$region = Region::find($comuna->id_region);

		$sede["examinadores_requeridos"] = isset($est->examinadores) ? $est->examinadores : null;
		$sede["anfitriones_requeridos"] = isset($est->anfitriones) ? $est->anfitriones : null;
		$sede["examinadores_apoyo_requeridos"] = isset($est->examinador_apoyo) ? $est->examinador_apoyo : null;
		$sede["supervisores_requeridos"] = isset($est->supervisores) ? $est->supervisores : null;

		$sql = DB::select("SELECT 
							rrhh.persona_asignacion.id_cargo,
							Count(rrhh.persona.id_persona)
							FROM
							rrhh.persona
							INNER JOIN rrhh.persona_asignacion ON (rrhh.persona_asignacion.id_persona = rrhh.persona.id_persona)
							INNER JOIN infraestructura.estimacion ON (infraestructura.estimacion.id_estimacion = rrhh.persona_asignacion.id_estimacion)
							WHERE
							rrhh.persona_asignacion.id_estimacion = " . $est->id_estimacion . "
							GROUP BY rrhh.persona_asignacion.id_cargo");
		$sede["examinadores_asignados"] = 0;
		$sede["anfitriones_asignados"] = 0;
		$sede["examinadores_apoyo_asignados"] = 0;
		$sede["supervisores_asignados"] = 0;
		$sede["jefe_sede"] = $nombre_jefe;
		$sede["region"] = $region->nombre;
		$sede["comuna"] = $comuna->nombre;
		foreach ($sql as $value) {
			if($value->id_cargo == 8){
				$sede["examinadores_asignados"] = $value->count;
			}
			if($value->id_cargo == 9){
				$sede["supervisores_asignados"] = $value->count;
			}
			if($value->id_cargo == 1006){
				$sede["anfitriones_asignados"] = $value->count;
			}
			if($value->id_cargo == 1007){
				$sede["examinadores_apoyo_asignados"] = $value->count;
			}
		}
		return response()->json($sede);
	}

    public function guardar(Request $request){

    	$post = $request->all();

    	$validacion = Validator::make($post, [
    		'id_usuario' => 'required|int',
			'id_sede' => 'required',	
		]);	

		if ($validacion->fails()) {
			return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		if($post['id_sede'] == -1){
    		$sede = new Sede;
    	}else{
    		$sede = Sede::where("id_sede", $post["id_sede"])->first();
    	}

    	$sede->rbd = $post['rbd'];
    	$sede->nombre = $post['nombre'];
    	$sede->direccion = $post['direccion'];
    	$sede->nro_direccion = $post['nro'];
    	$sede->id_comuna = $post['comuna'];
    	$sede->estado = $post['estado'];

    	$sede->contacto_nombre = $post['contacto_nombre'];
    	$sede->contacto_email = $post['contacto_email'];
    	$sede->contacto_fono = $post['contacto_fono'];
    	$sede->contacto_cargo = $post['contacto_cargo'];
    	$sede->contacto_otro = $post['contacto_otro'];

    	$sede->salas_disponibles = $post['salas_disponibles'];
    	$sede->salas_requeridas = $post['salas_requeridas'];

    	$sede->id_centro_operaciones = $post['id_centro_operaciones'];

    	//$sede->id_estimacion = $post['cupo'];
    	
		DB::beginTransaction();
		try{
			$sede->save(); 
		}catch (\Exception $e){
			DB::rollback();
			return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
		}

		DB::commit();
		return response()->json(["respuesta"=>"ok","descripcion"=>"Se ha guardado con exito"]);
    }

    public function modificar(Request $request){

    	$post = $request->all();	

		$validacion = Validator::make($post, [
			'id_usuario' => 'required|int',
			'id_sede' => 'required|int',	
		]);	

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$sede = DB::table('infraestructura.sede')
            ->join('core.comuna', 'infraestructura.sede.id_comuna', '=', 'core.comuna.id_comuna')
            ->join('core.region', 'core.comuna.id_region', '=', 'core.region.id_region')
            ->select('infraestructura.sede.*', 'core.region.nombre as region', 'core.region.id_region','core.comuna.nombre as comuna', 'core.comuna.id_comuna')
            ->where('id_sede', '=',  $post["id_sede"])
            ->first();

		$estimacion = Estimacion::leftJoin('core.comuna','infraestructura.estimacion.id_comuna','=','core.comuna.id_comuna')
						->select('infraestructura.estimacion.*','core.comuna.nombre as comuna')
						->where('infraestructura.estimacion.id_comuna',$sede->id_comuna)
						->get();

		if (empty($sede)) {
            return response()->json(['resultado'=>'error','descripcion'=>'No se encuentra la Sede']);
        }else{
        	$datos['sede'] = $sede;
			$datos['estimacion'] = $estimacion;
        	return response()->json($datos);	
        }
    }
}
