<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
//use App\Models\Evaluado\Evaluado;
use App\Models\RRHH\Persona;
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

		$pers = Persona::where("email", $mail)->first();
		
		if(!isset($pers->id_persona)){
			return response()->json(array("respuesta"=>"error","descripcion"=>"No existe el MAIL enviado."));
		}

		$usuario = Usuario::find($pers->id_usuario);
		if(!isset($usuario->id_usuario)){
			return response()->json(array("respuesta"=>"error","descripcion"=>"No existe el usuario."));
		}
 
		$usuarioPass = Usuario::where("id_usuario", $usuario->id_usuario)->where("contrasena", md5($post['password']))->first();
		if(!isset($usuarioPass->id_usuario)){
			return response()->json(array("respuesta"=>"error","descripcion"=>"Contraseña incorrecta."));
		}

		// Revisar si el usuario es técnico
		// $r_usuario = RolUsuario::where("id_usuario", $usuarioPass->id_usuario)->where("id_rol_proceso", 1)->first();
		// if(!isset($r_usuario->id_usuario)){
			// return response()->json(array("respuesta"=>"error","descripcion"=>"El usuario no esta autorizado."));
		// }

		if($usuarioPass->token == null){
			$r = rand(1, 10000);
			$token = substr(strrev($usuarioPass->id_usuario."".$r."".$usuarioPass->contrasena.md5(trim($pers->run))).($usuarioPass->id_usuario."".$r."".$usuarioPass->contrasena.md5(trim($pers->run))),0,60);
			$usuarioPass->updated_by = new date();
			$usuarioPass->token = $token;
			$usuarioPass->save();
		}	
		return response()->json(array("id_usuario"=>$usuarioPass->id_usuario, "id_tipo_usuario"=>$usuarioPass->id_tipo_usuario, "token"=>$usuarioPass->token,
			"nombres"=>$pers->nombres, "apellidos"=>$pers->apellido_paterno.' '.$pers->apellido_materno, "id_persona"=>$pers->id_persona ));
    }
}