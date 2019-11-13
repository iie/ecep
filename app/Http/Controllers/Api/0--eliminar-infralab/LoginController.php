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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class LoginController extends Controller
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

    public function loginTecnico(Request $request)
    {
		$this->corsAccept();
		
		$post = $request->all();	

		//validamos que no falten parametros y sean del tipo deseado
		$validacion = Validator::make($post, [
			'run' => 'required',	
			'infralab' => 'boolean',
		]);	

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}
		$run = str_replace(".","", $post['run']);
		$run = str_replace("-","", $run);
		$run = strtoupper($run);
		$runNro = substr($run, 0,(strlen($run)-1));
		$runDV = substr($run, -1);
		$run = trim($runNro)."-".trim($runDV);
		
		$pers = Persona::where("run", $run)->first();
		
		if(!isset($pers->id_persona)){
			return response()->json(array("respuesta"=>"error","descripcion"=>"No existe el RUN enviado."));
		}

		$usuario = Usuario::find($pers->id_usuario);
		if(!isset($usuario->id_usuario)){
			return response()->json(array("respuesta"=>"error","descripcion"=>"No existe el usuario registrado."));
		}

		// Revisar si el usuario es técnico
		$r_usuario = RolUsuario::where("id_usuario", $usuario->id_usuario)->where("id_rol_proceso", 10)->first();
		if(!isset($r_usuario->id_usuario)){
			return response()->json(array("respuesta"=>"error","descripcion"=>"El usuario no es técnico."));
		}

		if($usuario->token == null){
			$r = rand(1, 10000);
			$token = substr(strrev($usuario->id_usuario."".$r."".$usuario->contrasena.md5(trim($pers->run))).($usuario->id_usuario."".$r."".$usuario->contrasena.md5(trim($pers->run))),0,60);
			$usuario->token = $token;
			$usuario->save();
		}	

		$lab_revs = LaboratorioRevision::where("id_persona", $pers->id_persona)->get();
		
		if(sizeof($lab_revs) <= 0){
			return response()->json(array("respuesta"=>"error","descripcion"=>"El técnico no tiene visitas agendadas."));
		}
		$arr_lab = [];

		foreach($lab_revs as $_revs){
			$lab_visita = LaboratorioVisita::find($_revs->id_laboratorio_visita);
			$lab = Laboratorio::find($lab_visita->id_laboratorio);
			$sede = $lab->sede;
			$inst = $sede->institucion;

			$data_lab["id_laboratorio"] = $lab_visita->id_laboratorio;
			$data_lab["nombre_laboratorio"] = $lab->nombre_laboratorio;
			$data_lab["contacto_nombre"] = $lab->contacto_nombre;
			$data_lab["contacto_cargo"] = $lab->contacto_cargo;
			$data_lab["contacto_telefono"] = $lab->contacto_telefono;
			$data_lab["contacto_email"] = $lab->contacto_email;
			$data_lab["id_visita"] = $lab_visita->id_laboratorio_visita;
			$data_lab["direccion"] = $lab->direccion;
			$data_lab["fecha_visita"] = $lab_visita->fecha_inicio;
			$data_lab["id_tecnico_encargado"] = $lab_visita->id_tecnico_encargado;
			// Revisar si el usuario que ingresa es el tecnico oficial o asistente. Si es asistente se muestran los estados del tecnico titular.
			$rev_encargado = LaboratorioRevision::where("id_laboratorio_visita", $lab_visita->id_laboratorio_visita)->where("id_persona", $lab_visita->id_tecnico_encargado)->first();
			$cont_oficial = 0;
			if($rev_encargado->id_persona == $pers->id_persona){
				$data_lab["estado"] = $lab_visita->estado == 0 ? "pendiente" : ($lab_visita->estado == 1 ? "En Proceso": "finalizado");
				$data_lab["visita_finalizada"] = $lab_visita->estado == 2 ? true : false;
				$data_lab["fecha_visita_finalizada"] = $lab_visita->fecha_termino;
				$data_lab["asistente"] = false;
				$cont_oficial++;
			}else{
				if(isset($post["infralab"]) && $post["infralab"] == true){
					$data_lab["asistente"] = true;
				}
				$data_lab["estado"] = $lab_visita->estado == 0 ? "pendiente" : ($lab_visita->estado == 1 ? "En Proceso": "finalizado");
				$data_lab["visita_finalizada"] = $lab_visita->estado == 2 ? true : false;
				$data_lab["fecha_visita_finalizada"] = $lab_visita->fecha_termino;
			}
			
			$alt[$inst->id_institucion][$sede->id_sede][$lab_visita->id_laboratorio][$_revs->id_laboratorio_revision] = $data_lab;
			$nombres_sede[$sede->id_sede] = $sede->nombre;
			$nombres_inst[$inst->id_institucion] = $inst->institucion;
		}

		foreach($alt as $id_inst => $_sede){
			foreach($_sede as $id_sede => $_lab){
				foreach($_lab as $_rev) {
					foreach ($_rev as $_vis) {
						$datos_lab[] = $_vis;
					}
				}
				$aux_sede["nombre"] = $nombres_sede[$id_sede];
				$aux_sede["datos"] = $datos_lab;
				$datos_sede[] = $aux_sede;
				unset($datos_lab);
			}
			$datos_inst["nombre"] = $nombres_inst[$id_inst];
			$datos_inst["datos"] = $datos_sede;
			$arr_lab[] = $datos_inst;
			unset($datos_sede);
		}
		
		$arr_final = [];
		$arr_final["nombre_tecnico"] = $pers->nombres . " " . $pers->apellido_paterno;
		$arr_final["run_tecnico"] = $pers->run;
		$arr_final["token"] = $usuario->token;
		$arr_final["datos_visitas"] = $arr_lab;
		
		if(isset($post["infralab"]) && $post["infralab"] == true && $cont_oficial == 0){
			return response()->json(array("respuesta"=>"error","descripcion"=>"No existen visitas agendadas."));
		}
		return response()->json(array("respuesta"=>"ok","descripcion"=>$arr_final));
    }
}