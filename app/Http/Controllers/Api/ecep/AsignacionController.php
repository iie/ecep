<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\RRHH\Persona;
use App\Models\RRHH\PersonaCargo;
use App\Models\RRHH\PersonaArchivo;
use App\Models\RRHH\PersonaAsignacion;
use App\Models\Infraestructura\Institucion;
use App\Models\Infraestructura\Zona;
use App\Models\Infraestructura\Estimacion;
use App\Models\Core\TablaMaestra;
use App\Models\Core\Comuna;
use App\Models\Core\Usuario;
use App\Models\RRHH\Cargo;
use App\Models\Evaluado\Aplicacion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use Maatwebsite\Excel\Facades\Excel;

class AsignacionController extends Controller
{
     
    public function __construct()
    {
        $this->fields = array();    
    }   

    public function descargaExcelAsignacion()
    {
        
		
		$personaP = DB::select('
			SELECT * FROM 
			(
				SELECT core.region.orden_geografico, core.region.nombre AS region, core.comuna.nombre as comuna, infraestructura.estimacion.id_sede_ecep as id, infraestructura.estimacion.dia, infraestructura.sede.nombre , rrhh.cargo.nombre_rol , rrhh.persona.run , rrhh.persona.nombres, rrhh.persona.apellido_materno, rrhh.persona.apellido_paterno, rrhh.persona.email, rrhh.persona.telefono
				FROM infraestructura.estimacion left join infraestructura.sede on (infraestructura.estimacion.id_sede = infraestructura.sede.id_sede), 
				rrhh.persona_asignacion, rrhh.persona, core.comuna, rrhh.cargo, core.region
				where rrhh.persona_asignacion.id_persona = rrhh.persona.id_persona
				and infraestructura.estimacion.id_comuna = core.comuna.id_comuna
				and infraestructura.estimacion.id_estimacion = rrhh.persona_asignacion.id_estimacion
				and rrhh.cargo.id_cargo = rrhh.persona_asignacion.id_cargo
				and core.region.id_region = core.comuna.id_region
				and rrhh.persona.borrado = false
				and rrhh.persona.deserta = false
				
			
			UNION
			
				SELECT core.region.orden_geografico, core.region.nombre AS region, core.comuna.nombre as comuna, infraestructura.estimacion.id_sede_ecep as id, infraestructura.estimacion.dia, infraestructura.sede.nombre , rrhh.cargo.nombre_rol , rrhh.persona.run , rrhh.persona.nombres, rrhh.persona.apellido_materno, rrhh.persona.apellido_paterno, rrhh.persona.email, rrhh.persona.telefono
				FROM infraestructura.estimacion 
				left join infraestructura.sede on (infraestructura.estimacion.id_sede = infraestructura.sede.id_sede), 
				rrhh.persona_cargo, core.comuna,  core.region, rrhh.persona, rrhh.cargo
				where infraestructura.estimacion.id_jefe_sede = rrhh.persona_cargo.id_persona_cargo
				and infraestructura.estimacion.id_comuna = core.comuna.id_comuna
				and core.region.id_region = core.comuna.id_region
				and rrhh.persona.borrado = false
				and rrhh.persona.deserta = false
				and rrhh.persona.id_persona = rrhh.persona_cargo.id_persona
				and rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo			
			) as res
			order by res.orden_geografico, res.comuna, res.id,res.nombre_rol , res.nombres

		');

        

		$personaP = json_decode(json_encode($personaP),1);

		$cols = array_keys($personaP[0]);
		$export = new ExcelExport([$cols, $personaP]);
		return Excel::download($export, 'listadoCompletoAsignacion_('.date('Y-m-d h:i:s').').xlsx');			
	}
	
    public function lista(Request $request){
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $personaP = DB::select("SELECT rrhh.persona.*, core.comuna.nombre as comuna, core.region.nombre as region, 
                infraestructura.zona.nombre as nombre_zona, rrhh.persona_asignacion.*, infraestructura.estimacion.*, 
                infraestructura.sede.nombre as sede, rrhh.cargo.nombre_rol as cargo
                FROM rrhh.persona
                LEFT JOIN core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                LEFT JOIN core.region on core.comuna.id_region = core.region.id_region
                LEFT JOIN infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region
                LEFT JOIN infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona
                LEFT JOIN rrhh.persona_asignacion on rrhh.persona.id_persona = rrhh.persona_asignacion.id_persona
                LEFT JOIN rrhh.cargo on rrhh.persona_asignacion.id_cargo = rrhh.cargo.id_cargo
                LEFT JOIN infraestructura.estimacion on rrhh.persona_asignacion.id_estimacion = infraestructura.estimacion.id_estimacion
                LEFT JOIN infraestructura.sede on infraestructura.estimacion.id_sede = infraestructura.sede.id_sede
                WHERE rrhh.persona.borrado = false
                AND (rrhh.persona.estado_proceso = 'seleccionado' 
                OR rrhh.persona.estado_proceso = 'capacitado')
                ORDER BY infraestructura.zona.nombre asc, core.region.orden_geografico asc, core.comuna.nombre asc"
            );

        $totalAsignados = DB::select("SELECT rrhh.persona.*, rrhh.persona_asignacion.*
                FROM rrhh.persona
                INNER JOIN rrhh.persona_asignacion on rrhh.persona.id_persona = rrhh.persona_asignacion.id_persona
                WHERE rrhh.persona.borrado = false
                AND (rrhh.persona.estado_proceso = 'seleccionado' 
                OR rrhh.persona.estado_proceso = 'capacitado')
        ");

        $totalRequeridos = DB::select("SELECT 
                SUM(infraestructura.estimacion.examinadores 
                    + infraestructura.estimacion.anfitriones 
                    + infraestructura.estimacion.supervisores) 
                    AS total_requeridos
                FROM infraestructura.estimacion
        ");
 
        $datos['total_asignados'] = $totalAsignados; 
        $datos['total_requeridos'] = $totalRequeridos;
        $datos['personal_postulacion'] = $personaP;
          
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

    public function listaCoordinadorZonal(Request $request){
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',
            'id_cargo' => 'required|int',
            'id_persona' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }


        $cargo = DB::table('rrhh.persona_cargo')
                ->leftJoin('infraestructura.zona','rrhh.persona_cargo.id_persona_cargo','=','infraestructura.zona.id_coordinador')
                ->where('rrhh.persona_cargo.id_persona',$post['id_persona'])
                ->where('rrhh.persona_cargo.id_cargo',$post['id_cargo'])
                ->get();
        foreach($cargo as $cargoAux){
            $zonas[] = $cargoAux->id_zona;
        }

        $personaP = DB::select("SELECT rrhh.persona.*, core.comuna.nombre as comuna, core.region.nombre as region, rrhh.cargo.nombre_rol as cargo,
                infraestructura.zona.nombre as nombre_zona, rrhh.persona_asignacion.*, infraestructura.estimacion.*, 
                infraestructura.sede.nombre as sede 
                FROM rrhh.persona
                LEFT JOIN core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                LEFT JOIN core.region on core.comuna.id_region = core.region.id_region
                LEFT JOIN infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region
                LEFT JOIN infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona
                LEFT JOIN rrhh.persona_asignacion on rrhh.persona.id_persona = rrhh.persona_asignacion.id_persona
                LEFT JOIN rrhh.cargo on rrhh.persona_asignacion.id_cargo = rrhh.cargo.id_cargo
                LEFT JOIN infraestructura.estimacion on rrhh.persona_asignacion.id_estimacion = infraestructura.estimacion.id_estimacion
                LEFT JOIN infraestructura.sede on infraestructura.estimacion.id_sede = infraestructura.sede.id_sede
                WHERE rrhh.persona.borrado = false
                AND (rrhh.persona.estado_proceso = 'seleccionado' OR rrhh.persona.estado_proceso = 'capacitado')
                AND infraestructura.zona.id_zona in (".implode($zonas,",").")
                ORDER BY infraestructura.zona.nombre asc, core.region.orden_geografico asc, core.comuna.nombre asc"
            );

        $totalAsignados = DB::select("SELECT rrhh.persona.*, rrhh.persona_asignacion.*, core.comuna.*, core.region.*, infraestructura.zona.*
                FROM rrhh.persona
                INNER JOIN rrhh.persona_asignacion on rrhh.persona.id_persona = rrhh.persona_asignacion.id_persona
                LEFT JOIN core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                LEFT JOIN core.region on core.comuna.id_region = core.region.id_region
                LEFT JOIN infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region
                LEFT JOIN infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona
                WHERE rrhh.persona.borrado = false
                AND (rrhh.persona.estado_proceso = 'seleccionado' 
                OR rrhh.persona.estado_proceso = 'capacitado')
                AND infraestructura.zona.id_zona in (".implode($zonas,",").")
        ");

        $totalRequeridos = DB::select("SELECT 
                SUM(infraestructura.estimacion.examinadores + infraestructura.estimacion.anfitriones + infraestructura.estimacion.supervisores) 
                    AS total_requeridos
                    FROM infraestructura.estimacion
                JOIN core.comuna on infraestructura.estimacion.id_comuna = core.comuna.id_comuna
                JOIN core.region on core.comuna.id_region = core.region.id_region
                JOIN infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region
                JOIN infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona
                WHERE infraestructura.zona.id_zona in (".implode($zonas,",").")
        ");

        $datos['total_asignados'] = $totalAsignados;
        $datos['total_requeridos'] = $totalRequeridos;
        $datos['personal_postulacion'] = $personaP;


        return response()->json($datos);    
    }

    public function listaCoordinador(Request $request){
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',
            'id_cargo' => 'required|int',
            'id_persona' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $cargo = DB::table('rrhh.persona_cargo')
                ->leftJoin('infraestructura.zona_region','rrhh.persona_cargo.id_persona_cargo','=','infraestructura.zona_region.id_coordinador')
                ->leftJoin('infraestructura.zona','infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
                ->where('rrhh.persona_cargo.id_persona',$post['id_persona'])
                ->where('rrhh.persona_cargo.id_cargo',$post['id_cargo'])
                ->get();
                
 
        $zonas = array();
        $regiones = array();

        foreach($cargo as $cargoAux){
            $zonas[] = $cargoAux->id_zona;
            $regiones[] = $cargoAux->id_region;
        }
                
        $personaP = array();
        $totalAsignados = array();

        if($zonas[0] != ""){

            $personaP = DB::select("SELECT rrhh.persona.*, core.comuna.nombre as comuna, core.region.nombre as region, 
                infraestructura.zona.nombre as nombre_zona,  rrhh.persona_asignacion.*, infraestructura.estimacion.*, 
                infraestructura.sede.nombre as sede, rrhh.cargo.nombre_rol as cargo
                FROM rrhh.persona
                LEFT JOIN core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                LEFT JOIN core.region on core.comuna.id_region = core.region.id_region
                LEFT JOIN infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region
                LEFT JOIN infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona
                LEFT JOIN rrhh.persona_asignacion on rrhh.persona.id_persona = rrhh.persona_asignacion.id_persona
                LEFT JOIN rrhh.cargo on rrhh.persona_asignacion.id_cargo = rrhh.cargo.id_cargo
                LEFT JOIN infraestructura.estimacion on rrhh.persona_asignacion.id_estimacion = infraestructura.estimacion.id_estimacion
                LEFT JOIN infraestructura.sede on infraestructura.estimacion.id_sede = infraestructura.sede.id_sede
                WHERE rrhh.persona.borrado = false
                AND (rrhh.persona.estado_proceso = 'seleccionado' OR rrhh.persona.estado_proceso = 'capacitado')
                AND infraestructura.zona.id_zona in (".implode($zonas,",").")
                AND zona_region.id_coordinador = ". $cargo[0]->id_persona_cargo."
                ORDER BY infraestructura.zona.nombre asc, core.region.orden_geografico asc, core.comuna.nombre asc"
            );

            $totalAsignados = DB::select("SELECT rrhh.persona.*, rrhh.persona_asignacion.*, core.comuna.*, core.region.*, infraestructura.zona.*
                FROM rrhh.persona
                INNER JOIN rrhh.persona_asignacion on rrhh.persona.id_persona = rrhh.persona_asignacion.id_persona
                LEFT JOIN core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
                LEFT JOIN core.region on core.comuna.id_region = core.region.id_region
                LEFT JOIN infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region
                LEFT JOIN infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona
                WHERE rrhh.persona.borrado = false
                AND (rrhh.persona.estado_proceso = 'seleccionado' 
                OR rrhh.persona.estado_proceso = 'capacitado')
                AND infraestructura.zona.id_zona in (".implode($zonas,",").")
                AND zona_region.id_coordinador = ". $cargo[0]->id_persona_cargo."
            ");

            $totalRequeridos = DB::select("SELECT 
                SUM(infraestructura.estimacion.examinadores + infraestructura.estimacion.anfitriones + infraestructura.estimacion.supervisores) 
                    AS total_requeridos
                    FROM infraestructura.estimacion
                JOIN core.comuna on infraestructura.estimacion.id_comuna = core.comuna.id_comuna
                JOIN core.region on core.comuna.id_region = core.region.id_region
                JOIN infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region
                JOIN infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona
                WHERE infraestructura.zona.id_zona in (".implode($zonas,",").")
                AND zona_region.id_coordinador = ". $cargo[0]->id_persona_cargo."
            ");

        }   

        $datos['total_asignados'] = $totalAsignados;
        $datos['total_requeridos'] = $totalRequeridos;
        $datos['personal_postulacion'] = $personaP;

        return response()->json($datos);    
    }

    public function guardar(Request $request){

        $post = $request->all();

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',           
            'id_persona_cargo' => 'required|int',
            'id_sede' => 'required|int',
            'id_sala' => 'required|int',
            'id_aplicacion' => 'required|int',
            'fecha' => 'required'
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }
     
 
        $cargo = PersonaCargo::where("id_persona_cargo", $post["id_persona_cargo"])->first();
 		
        if (empty($cargo)) {
            return response()->json(['resultado'=>'error','descripcion'=>'No esta asignado al cargo']);
        }
 
 		$asignacion = PersonaAsignacion::where('id_persona_cargo',$cargo->id_persona_cargo)->where('id_aplicacion',$post['id_aplicacion'])->first();

 		if(empty($asignacion)) {
 			$aplicacion = new Aplicacion;
 			$aplicacion->id_sala = $post['id_sala'];
 			$aplicacion->save();


            $asignacion = new PersonaAsignacion;
            $asignacion->id_persona_cargo = $cargo->id_persona_cargo;
            $asignacion->id_aplicacion = $aplicacion->id_aplicacion;
            DB::beginTransaction();
	        try{
	            $asignacion->save();
	        }catch (\Exception $e){
	            DB::rollback();
	            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
	        }

        }else{
        	arreglo('else');exit();
        }
            
         

        DB::commit();
        return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
    }

    public function obtenerCapacitados(Request $request){
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_comuna' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }
        $id_region = Comuna::find($post["id_comuna"])->id_region;
        if(!isset($id_region)){
            return response()->json(array("resultado"=>"error","descripcion"=>"id_comuna no tiene comuna asociada.")); 
        }

        $sql_pruebas = DB::select("SELECT MAX(cap_prueba.puntaje) as puntaje, rrhh.persona.id_persona
                                    FROM rrhh.capacitacion_prueba as cap_prueba
                                    INNER JOIN rrhh.capacitacion_persona ON (rrhh.capacitacion_persona.id_capacitacion_persona = cap_prueba.id_capacitacion_persona)
                                    INNER JOIN rrhh.persona ON (rrhh.capacitacion_persona.id_persona = rrhh.persona.id_persona) 
                                    INNER JOIN rrhh.capacitacion ON (rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion)
                                    INNER JOIN core.comuna ON (rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna)
                                    WHERE cap_prueba.prueba = 'Técnica'
                                    AND core.comuna.id_region= ". $id_region ."
                                    GROUP BY rrhh.persona.id_persona
                                    order by id_persona");

        $puntajes = [];
        foreach ($sql_pruebas as $value) {
            $puntajes[$value->id_persona] = $value->puntaje;
        }

      /*   $sql = DB::select("SELECT rrhh.persona.*, rrhh.persona_asignacion.id_estimacion, rrhh.persona_asignacion.id_persona_asignacion, rrhh.cargo.nombre_rol, rrhh.persona.estado_proceso, core.comuna.nombre as comuna, core.region.nombre as region
                            FROM rrhh.persona
                            LEFT JOIN rrhh.persona_asignacion ON (rrhh.persona_asignacion.id_persona = rrhh.persona.id_persona)
                            LEFT JOIN rrhh.cargo ON (rrhh.persona_asignacion.id_cargo = rrhh.cargo.id_cargo)
                            INNER JOIN core.comuna ON (rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna)
                            INNER JOIN core.region ON (core.region.id_region = core.comuna.id_region)
                            WHERE (rrhh.persona.estado_proceso = 'capacitado' OR rrhh.persona.estado_proceso = 'seleccionado')
                            AND rrhh.persona.borrado = false
                            AND core.region.id_region = " . $id_region); */

        $sql = DB::select("SELECT rrhh.persona.*, rrhh.persona_asignacion.id_estimacion, rrhh.persona_asignacion.id_persona_asignacion, cargoAsignacion.nombre_rol,
                            STRING_AGG(cargoPersona.nombre_rol,', ') lista_cargos, rrhh.persona.estado_proceso, core.comuna.nombre as comuna, core.region.nombre as region
                            FROM rrhh.persona
                            LEFT JOIN rrhh.persona_asignacion ON (rrhh.persona_asignacion.id_persona = rrhh.persona.id_persona)
                            LEFT JOIN rrhh.persona_cargo ON (rrhh.persona_cargo.id_persona = rrhh.persona.id_persona)
                            LEFT JOIN rrhh.cargo as cargoAsignacion ON (rrhh.persona_asignacion.id_cargo = cargoAsignacion.id_cargo)
                            LEFT JOIN rrhh.cargo as cargoPersona ON (rrhh.persona_cargo.id_cargo = cargoPersona.id_cargo)
                            INNER JOIN core.comuna ON (rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna)
                            INNER JOIN core.region ON (core.region.id_region = core.comuna.id_region)
                            WHERE (rrhh.persona.estado_proceso = 'capacitado' OR rrhh.persona.estado_proceso = 'seleccionado')
                            AND rrhh.persona.id_persona NOT IN (SELECT rrhh.persona_cargo.id_persona FROM infraestructura.estimacion, rrhh.persona_cargo WHERE infraestructura.estimacion.id_jefe_sede = rrhh.persona_cargo.id_persona_cargo)
                            AND rrhh.persona.borrado = false
                            AND core.region.id_region = 9
                            GROUP BY rrhh.persona.id_persona, rrhh.persona_asignacion.id_estimacion, rrhh.persona_asignacion.id_persona_asignacion, cargoAsignacion.nombre_rol, rrhh.persona.estado_proceso, core.comuna.nombre, core.region.nombre
                            ");

        $arr = [];
        foreach($sql as $valor){
            //TODO: Quitar el 'if' si es que se repara el error de registros inexistentes de pruebas técnicas
            //if(isset($puntajes[$valor->id_persona])){
                $valor->puntaje = isset($puntajes[$valor->id_persona]) ? intval($puntajes[$valor->id_persona]) : null;
                $arr[] = $valor;
            //}
        }
        return response()->json($arr);    
    }

    public function asignarCargoSede(Request $request){
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_estimacion' => 'required|int',
            'id_cargo' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $estimacion = Estimacion::find($post["id_estimacion"]);
        if(!isset($estimacion->id_estimacion)){
            return response()->json(array("resultado"=>"error","descripcion"=>"Estimación no encontrada.")); 
        }

        $cargo = Cargo::find($post["id_cargo"]);
        if(!isset($cargo->id_cargo)){
            return response()->json(array("resultado"=>"error","descripcion"=>"Cargo no encontrado.")); 
        }

        if(isset($post['personal'])){
            // arreglo($post['personal']);Exit;
            foreach ($post['personal'] as $personal) {
                $pers_asignacion = new PersonaAsignacion();
                $pers_asignacion->id_estimacion = $estimacion->id_estimacion;
                $pers_asignacion->id_cargo = $cargo->id_cargo;
                $pers_asignacion->id_persona = $personal["id_persona"];

                try {
                    $persona = Persona::find($personal["id_persona"]);
                    $persona->estado_proceso = 'seleccionado';
                    $pers_asignacion->save();
                    $persona->save();
                } catch (Exception $e) {
                    return response()->json(array("resultado"=>"error","descripcion"=>"Error al asignar: " . $e->getMessage())); 
                }
            }
            return response()->json(array("resultado"=>"ok","descripcion"=>"Se ha guardado con éxito.")); 
        }   
    }

    public function desasignar(Request $request){
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_persona_asignacion' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $pers_asignacion = PersonaAsignacion::find($post["id_persona_asignacion"]);
        if(!isset($pers_asignacion->id_persona_asignacion)){
            return response()->json(array("resultado"=>"ok","descripcion"=>"Asignación no encontrada."));     
        }
        $pers = Persona::find($pers_asignacion->id_persona);
        $pers->estado_proceso = "capacitado";
        try {
            $pers->save();
            $pers_asignacion->delete();
        } catch (\Exception $e) {
            return response()->json(array("resultado"=>"error","descripcion"=>"Error al eliminar asignación: " . $e->getMessage())); 
        }
        return response()->json(array("resultado"=>"ok","descripcion"=>"Se ha eliminado la asignación.")); 
    }
}
