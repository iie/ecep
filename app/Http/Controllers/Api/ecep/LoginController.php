<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
//use App\Models\Evaluado\Evaluado;
use App\Models\RRHH\Persona;
use App\Models\RRHH\PersonaCargo;
use App\Models\Core\Usuario;
//use App\Models\Core\RolUsuario;
//use App\Models\Core\RolProceso;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
	 
	public function __construct()
    {
		$this->fields = array();	
    }	
	
	public function index()
    {
		
    }

    public function login(Request $request)
    {
		
		$post = $request->all();	

		//validamos que no falten parametros y sean del tipo deseado
		$validacion = Validator::make($post, [
			//'run' => 'required',	
			'mail' => 'required',
			'password' => 'required',
		]);	

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}


		
		/*$run = str_replace(".","", $post['run']);
		$run = str_replace("-","", $run);
		$run = strtoupper($run);
		$runNro = substr($run, 0,(strlen($run)-1));
		$runDV = substr($run, -1);
		$run = trim($runNro)."-".trim($runDV);*/
		
		$mail = trim($post["mail"]);

		$pers = Usuario::where("usuario", $mail)->first();
		
		if(!isset($pers->id_usuario)){
			return response()->json(array("respuesta"=>"error","descripcion"=>"No existe el usuario enviado."));
		}

		// $usuario = Usuario::find($pers->id_usuario);
		// if(!isset($usuario->id_usuario)){
			// return response()->json(array("respuesta"=>"error","descripcion"=>"No existe el usuario."));
		// }
 
		$usuarioPass = Usuario::where("id_usuario", $pers->id_usuario)->where("contrasena", md5($post['password']))->first();
		if(!isset($usuarioPass->id_usuario)){
			return response()->json(array("respuesta"=>"error","descripcion"=>"Contraseña incorrecta."));
		}

		if($pers->id_tipo_usuario == 28){//persona

			//1003-> Coordinador Zonal
			//1004-> Encargado Regional
			//13->   Encargados de Centro
		
			$persona = Persona::where("id_usuario", $pers->id_usuario)->first();
			if(isset($persona->id_persona)){

				//obtenemos el cargo. si una persona tiena más de un cargo, devolvemos el más alto
				$personaCargo = PersonaCargo::where("id_persona", $persona->id_persona)->where("id_cargo", 1003)->first();
				if(isset($personaCargo->id_persona_cargo)){
					$tipoUsuario = 1003;
				}
				else{
					$personaCargo = PersonaCargo::where("id_persona", $persona->id_persona)->where("id_cargo", 1004)->first();	
					if(isset($personaCargo->id_persona_cargo)){
						$tipoUsuario = 1004;
					}
					else{
						$personaCargo = PersonaCargo::where("id_persona", $persona->id_persona)->where("id_cargo", 13)->first();
						if(isset($personaCargo->id_persona_cargo)){
							$tipoUsuario = 13;
						}	
						else{
							return response()->json(array("respuesta"=>"error","descripcion"=>"No autorizado."));			
						}
					}
				}
			}
			else{
				return response()->json(array("respuesta"=>"error","descripcion"=>"No existe la persona."));
			}
			
		}
		
		// $arrNombre["54642"]["nombres"] = 'monitoreoiie';
		// $arrNombre["54642"]["apellido_paterno"] = 'monitoreoiie';
		// $arrNombre["54590"]["nombres"] = 'agencia';
		// $arrNombre["54590"]["apellido_paterno"] = 'agencia';

		elseif($pers->id_tipo_usuario == 1040){
			$pers->nombres = $usuarioPass->usuario;
			$pers->apellido_paterno = "";
			$pers->apellido_materno = "";
			$tipoUsuario = 1040;
		}
		elseif($pers->id_tipo_usuario == 1047){
			$tipoUsuario = 1047;
		}
		else{
			return response()->json(array("respuesta"=>"error","descripcion"=>"No autorizado"));			
		}
		
		// Revisar si el usuario es técnico
		// $r_usuario = RolUsuario::where("id_usuario", $usuarioPass->id_usuario)->where("id_rol_proceso", 1)->first();
		// if(!isset($r_usuario->id_usuario)){
			// return response()->json(array("respuesta"=>"error","descripcion"=>"El usuario no esta autorizado."));
		// }
		
		

		if($usuarioPass->token == null){
			$r = rand(1, 10000);
			$token = substr(strrev($usuarioPass->id_usuario."".$r."".$usuarioPass->contrasena.md5(trim($pers->run))).($usuarioPass->id_usuario."".$r."".$usuarioPass->contrasena.md5(trim($pers->run))),0,60);
			//$usuarioPass->updated_by = new date();
			$usuarioPass->token = $token;
			$usuarioPass->save();
		}	
		return response()->json(array("id_usuario"=>$usuarioPass->id_usuario, "id_tipo_usuario"=>$tipoUsuario, "token"=>$usuarioPass->token,
			"nombres"=>$pers->nombres, "apellidos"=>$pers->apellido_paterno.' '.$pers->apellido_materno, "id_persona"=>$pers->id_persona ));
    }
    
	public function tokenCheck(Request $request){
        $token = $request->header('t');

        $usuario = Usuario::where("token",$token)->first();

        if(isset($usuario->id_usuario) ){
            return response()->json(['resultado' => 'ok', 'descripcion' => true]);
        }else{
            return response()->json(['resultado' => 'error', 'descripcion' => 'token invalido']);
        }
    }		
}