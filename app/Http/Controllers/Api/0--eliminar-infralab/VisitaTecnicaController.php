<?php
namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Evaluado\Evaluado;
use App\Models\RRHH\Persona;
use App\Models\Core\Usuario;
use App\Models\Core\RolUsuario;
use App\Models\Core\RolProceso;
use App\Models\Infraestructura\Laboratorio;
use App\Models\Infraestructura\LaboratorioVisita;
use App\Models\Infraestructura\LaboratorioRevision;
use App\Models\Infraestructura\LaboratorioEquipo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class VisitaTecnicaController extends Controller
{
	 
	public function __construct()
    {
		$this->fields = array();	
    }	
	
	function corsAccept(){
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Methods: OPTIONS, POST");
		header("Access-Control-Allow-Headers: t");
	}
    
	public function index()
    {

    }

    
    public function obtenerDatosLaboratorio(Request $request){
		$this->corsAccept();
		$post = $request->all();	

		  //validamos que no falten parametros y sean del tipo deseado
		$validacion = Validator::make($post, [
			'id_visita' => 'required',
			'id_persona' => 'int|required',
		]);	

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$arr = $this->_obtenerDatosLaboratorio($post["id_persona"], $post["id_visita"]);
		if(isset($arr["respuesta"]) && $arr["respuesta"] == "error"){
			return response()->json(array("respuesta"=>"error","descripcion"=>$arr["descripcion"]));
		}
		return response()->json(array("respuesta"=>"ok","descripcion"=>$arr));
	}
	
	public function _obtenerDatosLaboratorio($idPersona, $idVisita){

		$lab_visita = LaboratorioVisita::find($idVisita);

		if(!isset($lab_visita->id_laboratorio_visita)){
			$arr["respuesta"] = "error";
			$arr["descripcion"] = "No se encuentra la visita seleccionada.";
			return $arr;
		}
		
		$arr["infraestructura"]["a1"] = $lab_visita->resp_a1;
		$arr["infraestructura"]["a2"] = $lab_visita->resp_a2;
		$arr["infraestructura"]["a3"] = $lab_visita->resp_a3;
		$arr["infraestructura"]["a4"] = $lab_visita->resp_a4;
		$arr["infraestructura"]["a5"] = $lab_visita->resp_a5;
		$arr["infraestructura"]["a6"] = $lab_visita->resp_a6;
		$arr["infraestructura"]["a7"] = $lab_visita->resp_a7;
		$arr["infraestructura"]["a8_acceso1"] = $lab_visita->resp_a8_acceso1;
		$arr["infraestructura"]["a8_acceso2"] = $lab_visita->resp_a8_acceso2;
		$arr["infraestructura"]["a9"] = $lab_visita->resp_a9;
		$arr["infraestructura"]["a10"] = $lab_visita->resp_a10;
		$arr["infraestructura"]["a11"] = $lab_visita->resp_a11;
		$arr["infraestructura"]["a12"] = $lab_visita->resp_a12;
		$arr["infraestructura"]["observaciones"] = $lab_visita->observaciones_a;

		$arr["red_electrica"]["b1"] = $lab_visita->resp_b1;
		$arr["red_electrica"]["b2"] = $lab_visita->resp_b2;
		$arr["red_electrica"]["b3"] = $lab_visita->resp_b3;
		$arr["red_electrica"]["b3_cantidad"] = $lab_visita->resp_b3_cantidad;
		$arr["red_electrica"]["b4"] = $lab_visita->resp_b4;
		$arr["red_electrica"]["b4_ubicacion"] = $lab_visita->resp_b4_ubicacion;
		$arr["red_electrica"]["b5"] = $lab_visita->resp_b5;
		$arr["red_electrica"]["b5_cantidad_cableada"] = $lab_visita->resp_b5_cantidad_cableada;
		$arr["red_electrica"]["b5_cantidad_inalambrica"] = $lab_visita->resp_b5_cantidad_inalambrica;
		$arr["red_electrica"]["b6"] = $lab_visita->resp_b6;
		$arr["red_electrica"]["b7"] = $lab_visita->resp_b7;
		$arr["red_electrica"]["b8"] = $lab_visita->resp_b8;
		$arr["red_electrica"]["observaciones"] = $lab_visita->observaciones_b;

		$arr["mobiliario"]["c1"] = $lab_visita->resp_c1;
		$arr["mobiliario"]["c2"] = $lab_visita->resp_c2;
		$arr["mobiliario"]["c3"] = $lab_visita->resp_c3;
		$arr["mobiliario"]["c3_cantidad"] = $lab_visita->resp_c3_cantidad;
		$arr["mobiliario"]["c4"] = $lab_visita->resp_c4;
		$arr["mobiliario"]["observaciones"] = $lab_visita->observaciones_c;

		$arr["chequeo"]["resultado"] = $lab_visita->resultado_chequeo;
		$arr["chequeo"]["acceso_desde_0730"] = $lab_visita->acceso_desde_0730;
		$arr["chequeo"]["nro_equipos_operativos"] = $lab_visita->nro_equipos_operativos;
		$arr["chequeo"]["nro_equipos_no_operativos"] = $lab_visita->nro_equipos_no_operativos;
		$arr["chequeo"]["nro_equipos_contingencia"] = $lab_visita->nro_equipos_contingencia;
		$arr["chequeo"]["nombre_contacto_apertura"] = $lab_visita->nombre_contacto_apertura;
		$arr["chequeo"]["celular_contacto_apertura"] = $lab_visita->celular_contacto_apertura;
		$arr["chequeo"]["nombre_referencia_laboratorio"] = $lab_visita->nombre_referencia_laboratorio;
		$arr["chequeo"]["observaciones"] = $lab_visita->observaciones_chequeo;

		$lab = Laboratorio::find($lab_visita->id_laboratorio);
		$sede = $lab->sede;
		$inst = $sede->institucion;
		$pers = Persona::find($lab_visita->id_tecnico_encargado);
		$lab_rev = LaboratorioRevision::where("id_laboratorio_visita", $lab_visita->id_laboratorio_visita)->where("id_persona", $pers->id_persona)->first();

		$arr["contacto_observacion"] = $lab->contacto_observacion;

		$arr["datos_visita"]["direccion"] = $lab->direccion;
		$arr["datos_visita"]["institucion"] = $inst->institucion;
		$arr["datos_visita"]["sede"] = $sede->nombre;
		$arr["datos_visita"]["laboratorio"] = $lab->nombre_laboratorio;
		$arr["datos_visita"]["nombre_tecnico"] = $pers->nombres ." ". $pers->apellido_paterno; 
		$arr["datos_visita"]["fecha_visita"] = $lab_visita->fecha_inicio; 
		$arr["datos_visita"]["estado"] = $lab_rev->finalizado == true ? "finalizado" : $lab_rev->estado;
		$arr["datos_visita"]["id_laboratorio_visita"] = $lab_visita->id_laboratorio_visita;
		$arr["datos_visita"]["id_laboratorio"] = $lab->id_laboratorio;
		$arrEquipo = array();
		$sql = DB::select("SELECT infraestructura.laboratorio_equipo.*, rrhh.persona.nombres, rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno
				FROM infraestructura.laboratorio_equipo
				INNER JOIN infraestructura.laboratorio_revision ON infraestructura.laboratorio_equipo.id_laboratorio_revision = infraestructura.laboratorio_revision.id_laboratorio_revision
				INNER JOIN infraestructura.laboratorio_visita ON infraestructura.laboratorio_revision.id_laboratorio_visita = infraestructura.laboratorio_visita.id_laboratorio_visita
				INNER JOIN rrhh.persona ON infraestructura.laboratorio_revision.id_persona = rrhh.persona.id_persona 
				WHERE
				infraestructura.laboratorio_visita.id_laboratorio_visita = ". $lab_visita->id_laboratorio_visita ."
				ORDER BY
				infraestructura.laboratorio_equipo.updated_at DESC");

		foreach ($sql as $_equipo) {
			$arrEquipo[] = $_equipo;
		}
		
		$arr["datos_visita"]["equipos"] = $arrEquipo;
		
		return $arr;
	}
	
	public function obtenerDatosVisita(Request $request){
		$this->corsAccept();
		$post = $request->all();	

		//validamos que no falten parametros y sean del tipo deseado
		$validacion = Validator::make($post, [
			'id_visita' => 'int|required',
			'clave' => 'required',
		]);	

		if($validacion->fails()){
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		if($post["clave"] != "8b655fd8e0ecdc5e36ecefe0993d7891e388f02f750e65ebba95ab9493cd"){
			return response()->json(array("respuesta"=>"error","descripcion"=>"La clave no corresponde.")); 
		}

		$arr = $this->_obtenerDatosLaboratorio('', $post["id_visita"]);

		if(isset($arr["respuesta"]) && $arr["respuesta"] == "error"){
			return response()->json(array("respuesta"=>"error","descripcion"=>$arr["descripcion"]));
		}
		return response()->json(array("respuesta"=>"ok","descripcion"=>$arr));
    }

    public function guardarDatosLaboratorio(Request $request){
		
		$this->corsAccept();
		$post = $request->all();	

		//validamos que no falten parametros y sean del tipo deseado
		$validacion = Validator::make($post, [
			'id_visita' => 'int|required',
			'id_persona' => 'int|required',
		]);	
	
		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$pers = Persona::where("id_usuario", $post["id_usuario"])->first();
		
		if(!isset($pers->id_persona)){
			return response()->json(array("respuesta"=>"error","descripcion"=> "Usuario no encontrado en el sistema"));
		}

		$lab_visita = LaboratorioVisita::where("id_laboratorio_visita", $post["id_visita"])->where("id_tecnico_encargado", $pers->id_persona)->first();
		
		if(!isset($lab_visita->id_laboratorio_visita)){
			return response()->json(array("respuesta"=>"error","descripcion"=> "El técnico ingresado no puede registrar datos para esta visita."));
		}

		$lab_visitas_activas = LaboratorioVisita::where("id_tecnico_encargado", $pers->id_persona)
			->where("estado", 1)
			->where("id_laboratorio_visita", "!=", $lab_visita->id_laboratorio_visita)
			->get();
		
		if(sizeof($lab_visitas_activas)>0){
			return response()->json(array("respuesta"=>"error","descripcion"=> "Deben finalizarse todas las revisiones de laboratorio antes de comenzar una nueva."));
		}

		$lab_visita->resp_a1 = isset($post["infraestructura"]["a1"])? $post["infraestructura"]["a1"] : null;
		$lab_visita->resp_a2 = isset($post["infraestructura"]["a2"])? $post["infraestructura"]["a2"] : null;
		$lab_visita->resp_a3 = isset($post["infraestructura"]["a3"])? $post["infraestructura"]["a3"] : null;
		$lab_visita->resp_a4 = isset($post["infraestructura"]["a4"])? $post["infraestructura"]["a4"] : null;
		$lab_visita->resp_a5 = isset($post["infraestructura"]["a5"])? $post["infraestructura"]["a5"] : null;
		$lab_visita->resp_a6 = isset($post["infraestructura"]["a6"])? $post["infraestructura"]["a6"] : null;
		$lab_visita->resp_a7 = isset($post["infraestructura"]["a7"])? $post["infraestructura"]["a7"] : null;
		$lab_visita->resp_a8_acceso1 = isset($post["infraestructura"]["a8_acceso1"]) ? $post["infraestructura"]["a8_acceso1"] : null;
		$lab_visita->resp_a8_acceso2 = isset($post["infraestructura"]["a8_acceso2"]) ? $post["infraestructura"]["a8_acceso2"] : null;
		$lab_visita->resp_a9 = isset($post["infraestructura"]["a9"])? $post["infraestructura"]["a9"] : null;
		$lab_visita->resp_a10 = isset($post["infraestructura"]["a10"])? $post["infraestructura"]["a10"] : null;
		$lab_visita->resp_a11 = isset($post["infraestructura"]["a11"])? $post["infraestructura"]["a11"] : null;
		$lab_visita->resp_a12 = isset($post["infraestructura"]["a12"])? $post["infraestructura"]["a12"] : null;
		$lab_visita->observaciones_a = isset($post["infraestructura"]["observaciones"])? $post["infraestructura"]["observaciones"] : null;

		$lab_visita->resp_b1 = isset($post["red_electrica"]["b1"])? $post["red_electrica"]["b1"] : null;
		$lab_visita->resp_b2 = isset($post["red_electrica"]["b2"])? $post["red_electrica"]["b2"] : null;
		$lab_visita->resp_b3 = isset($post["red_electrica"]["b3"])? $post["red_electrica"]["b3"] : null;
		$lab_visita->resp_b3_cantidad = isset($post["red_electrica"]["b3_cantidad"])? $post["red_electrica"]["b3_cantidad"] : null;
		$lab_visita->resp_b4 = isset($post["red_electrica"]["b4"])? $post["red_electrica"]["b4"] : null;
		$lab_visita->resp_b4_ubicacion = isset($post["red_electrica"]["b4_ubicacion"])? $post["red_electrica"]["b4_ubicacion"] : null;
		$lab_visita->resp_b5 = isset($post["red_electrica"]["b5"])? $post["red_electrica"]["b5"] : null; 
		$lab_visita->resp_b5_cantidad_cableada = isset($post["red_electrica"]["b5_cantidad_cableada"])? $post["red_electrica"]["b5_cantidad_cableada"] : null;
		$lab_visita->resp_b5_cantidad_inalambrica = isset($post["red_electrica"]["b5_cantidad_inalambrica"])? $post["red_electrica"]["b5_cantidad_inalambrica"] : null;
		$lab_visita->resp_b6 = isset($post["red_electrica"]["b6"])? $post["red_electrica"]["b6"] : null;
		$lab_visita->resp_b7 = isset($post["red_electrica"]["b7"])? $post["red_electrica"]["b7"] : null;
		$lab_visita->resp_b8 = isset($post["red_electrica"]["b8"])? $post["red_electrica"]["b8"] : null;
		$lab_visita->observaciones_b = isset($post["red_electrica"]["observaciones"])? $post["red_electrica"]["observaciones"] : null;

		$lab_visita->resp_c1 = isset($post["mobiliario"]["c1"])? $post["mobiliario"]["c1"] : null;
		$lab_visita->resp_c2 = isset($post["mobiliario"]["c2"])? $post["mobiliario"]["c2"] : null;
		$lab_visita->resp_c3 = isset($post["mobiliario"]["c3"])? $post["mobiliario"]["c3"] : null;
		$lab_visita->resp_c3_cantidad = isset($post["mobiliario"]["c3_cantidad"])? $post["mobiliario"]["c3_cantidad"] : null;
		$lab_visita->resp_c4 = isset($post["mobiliario"]["c4"])? $post["mobiliario"]["c4"] : null;
		$lab_visita->observaciones_c = isset($post["mobiliario"]["observaciones"])? $post["mobiliario"]["observaciones"] : null;

		$lab_visita->resultado_chequeo = isset($post["chequeo"]["resultado"])? $post["chequeo"]["resultado"] : null;
		if(isset($post["chequeo"]["acceso_desde_0730"])){
			$acceso_0730 = $post["chequeo"]["acceso_desde_0730"] == "SI" ? true : false;
		}
		$lab_visita->acceso_desde_0730 = isset($acceso_0730)? $acceso_0730 : null;
		$lab_visita->nro_equipos_operativos = isset($post["chequeo"]["nro_equipos_operativos"])? $post["chequeo"]["nro_equipos_operativos"] : null;
		$lab_visita->nro_equipos_no_operativos = isset($post["chequeo"]["nro_equipos_no_operativos"])? $post["chequeo"]["nro_equipos_no_operativos"] : null;
		$lab_visita->nro_equipos_contingencia = isset($post["chequeo"]["nro_equipos_contingencia"])? $post["chequeo"]["nro_equipos_contingencia"] : null;
		$lab_visita->nombre_contacto_apertura = isset($post["chequeo"]["nombre_contacto_apertura"])? $post["chequeo"]["nombre_contacto_apertura"] : null;
		
		$lab_visita->nombre_referencia_laboratorio = isset($post["chequeo"]["nombre_referencia_laboratorio"])? $post["chequeo"]["nombre_referencia_laboratorio"] : null;
		$lab_visita->observaciones_chequeo = isset($post["chequeo"]["observaciones"])? $post["chequeo"]["observaciones"] : null;

		$lab = Laboratorio::find($lab_visita->id_laboratorio);
		$lab->contacto_observacion = isset($post["contacto_observacion"])? $post["contacto_observacion"] : null;

		DB::beginTransaction();
		try{
			$lab_rev = LaboratorioRevision::where("id_laboratorio_visita", $lab_visita->id_laboratorio_visita)->where("id_persona", $post["id_persona"])->first();
			$lab_visita->estado = 1;
			// $lab_rev->estado = "En Proceso";
			if(isset($post["finalizado"]) && $post["finalizado"] == true){
				// $lab_rev->fecha_termino = date("Y-m-d H:i:s");
				// $lab_rev->estado = "Finalizado";
				// $lab_rev->finalizado = true;
				$lab_visita->estado = 2;
				$lab_visita->fecha_termino = date("Y-m-d H:i:s");
				$lab = Laboratorio::find($lab_visita->id_laboratorio);
				$lab->nro_equipos_operativos =  isset($post["chequeo"]["nro_equipos_operativos"])? $post["chequeo"]["nro_equipos_operativos"] : null;
			}
			$lab->save();
			$lab_rev->save();
			$lab_visita->save();

			/* VALIDACIÓN PARA FINALIZAR SIN CAMPOS NULOS EN BD*/
			if(isset($post["finalizado"]) && $post["finalizado"] == true){
			$sql = DB::select("SELECT * 
					from  infraestructura.laboratorio_visita
					where id_laboratorio_visita = " . $lab_visita->id_laboratorio_visita);
				foreach ($sql as $visita) {
					foreach ($visita as $key => $data_visita) {
						if($key != "borrado"){
							if($data_visita == 0 || ($key == "acceso_desde_0730" && $data_visita == null) || ($key == "visita_previa" && $data_visita == null)){
								$data_visita = "false";
							}
							if($key != "borrado" || $key != "observaciones_a" || $key != "observaciones_b"  || $key != "observaciones_c" || $key != "observaciones_chequeo" || $key != "updated_by"){
								if($data_visita == null){
									DB::rollback();
									return response()->json(array("respuesta"=>"error","descripcion"=> "Existen campos vacíos en base de datos. Revise los campos e intente nuevamente."));
								}
							}
						}
					}
				}
			}
		}catch (\Exception $e){
			DB::rollback();
			return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar datos. ('.$e->getMessage().')']);
		}
		DB::commit();
		
		return response()->json(array("respuesta"=>"ok","descripcion"=>"Se ha guardado correctamente."));
    }
}