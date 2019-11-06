<?php
namespace App\Http\Controllers\Api\postulacion;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Evaluado\Evaluado;
use App\Models\RRHH\Persona;
use App\Models\RRHH\PersonaCargo;
//use App\Models\RRHH\PersonasProyectos;
//use App\Models\RRHH\PersonaComunaAsignacion;
use App\Models\RRHH\PersonaArchivo;
use App\Models\Core\Usuario;
use App\Models\Core\Comuna;
use App\Models\Core\Region;
//use App\Models\Core\RolUsuario;
//use App\Models\Core\RolProceso;
use App\Models\Infraestructura\Laboratorio;
use App\Models\Infraestructura\LaboratorioVisita;
use App\Models\Infraestructura\LaboratorioRevision;
use App\Models\Infraestructura\LaboratorioEquipo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


require realpath(__DIR__ . '/../../../../..').'/vendor/phpmailer/phpmailer/src/Exception.php';
require realpath(__DIR__ . '/../../../../..').'/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require realpath(__DIR__ . '/../../../../..').'/vendor/phpmailer/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class PostulacionController extends Controller
{
	 
	public function __construct()
    {
		$this->fields = array();	
    }	
	
	function corssAccept(Request $request){
		// header("Access-Control-Allow-Origin: *");
		// header("Access-Control-Allow-Methods: OPTIONS, POST, GET");
		// header("Access-Control-Allow-Headers: *");
	}
    
	public function index()
    {

    }

	public function descargaArchivo($id_persona_archivo){
        if($id_persona_archivo!=""){
			$personaArchivo = PersonaArchivo::where('token_descarga',$id_persona_archivo)->first();
			if(isset($personaArchivo->id_persona_archivo)){
				$persona = Persona::find($personaArchivo->id_persona);
				$decoded = base64_decode($personaArchivo->archivo);
				$file = 'tmp_file_'.$id_persona_archivo;
				file_put_contents($file, $decoded);
				
				if (file_exists($file)) {
					header('Content-Description: File Transfer');
					if($personaArchivo->mime_type!=""){
						header('Content-Type: '.$personaArchivo->mime_type);						
					}
					else{
						header('Content-Type: application/octet-stream');	
					}
					header('Content-Disposition: attachment; filename="'.$persona->run."_".$personaArchivo->tipo.".".$personaArchivo->extension.'"');
					header('Expires: 0');
					header('Cache-Control: must-revalidate');
					header('Pragma: public');
					header('Content-Length: ' . filesize($file));
					readfile($file);
					exit;
				}
				else{
					echo "no existe el archivo";
					exit;
				}
			}
			else{
				echo "no existe el archivo";
				exit;
			}			
		}
	}
	
	public function regionPorIdComuna(Request $request){
		//$this->corssAccept();
        $post = $request->all();

		$validacion = Validator::make($post, [
            'id_comuna_n' => 'int|nullable',
            'id_comuna_r' => 'int|nullable'
        ]);	
        
        if($validacion->fails()){
            return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $comuna_n = Comuna::find($post["id_comuna_n"]);
        $comuna_r = Comuna::find($post["id_comuna_r"]);
        // if(!isset($comuna_n->id_comuna) || !isset($comuna_r->id_comuna)){
        //     return response()->json(array("respuesta"=>"error","descripcion"=>"El id de comuna no corresponde.")); 
        // }
        $arr["id_region_nacimiento"] = isset($comuna_n->id_region) ? $comuna_n->id_region : null;
        $arr["id_region_residencia"] = isset($comuna_r->id_region) ? $comuna_r->id_region : null;
        
        return response()->json(array("respuesta"=>"OK", "descripcion" => $arr));
	}
	
	public function obtenerComunasConAplicaciones(Request $request){
		$post = $request->all();
		$comunas = DB::select("SELECT distinct com.id_comuna,com.nombre 
									FROM core.comuna as com
									INNER JOIN infraestructura.sede as sd ON (sd.id_comuna = com.id_comuna)
									WHERE com.id_region=" .$post["region_id"]. "
									order by id_comuna,com.nombre");

		$arrComunas = [];
		foreach ($comunas as $comuna) {
			$arrComunas[] = $comuna;
		}
		return response()->json(array("respuesta"=>"OK", "descripcion" => $arrComunas));
	}

	public function saveUsuarioLite(Request $request){
		$post = $request->all();

		if($post['run']!=""){
			$persona = Persona::where("run", strtoupper($post["run"]))->first();
			if(!isset($persona->id_persona)){
				$persona= new Persona();
				// Buscar email
				$pers_mail = Persona::where("email", $post["correo_electronico_principal"])->first();
				if(isset($pers_mail->id_persona)){
					if(strtoupper($pers_mail->run) != strtoupper($post["run"])){
						return response()->json(array("respuesta"=>"error","descripcion"=>"Ya existe un usuario registrado con el correo enviado.")); 
					}
				}
			}
			if($persona->modificado == true){
				$this->enviarNotificacionError("Usuario ya modificó su formulario de postulación", "Guardar usuario", $post);
				return response()->json(array("respuesta"=>"error","descripcion"=>"Usted ya envió una postulación.")); 
			}
			
			$usuario = DB::select("SELECT id_usuario , usuario, contrasena FROM core.usuario WHERE borrado = false AND usuario = '" . trim(strtolower($post['usuario'])) . "'");
			if(!isset($usuario[0])){
				$editar = false;	
				$usuario = new Usuario();
				$id = DB::table('core.usuario')->latest('id_usuario')->first()->id_usuario;				// Obtener ultimo id_usuario
				$clave1 = isset($post["nombres"]) ? trim(strtolower(str_replace(" ", "", $post["nombres"]))): "nombre";
				$clave2 = isset($post["apellido_paterno"]) ? trim(strtolower(str_replace(" ", "", $post["apellido_paterno"]))): "apellido";
				$usuario->usuario = $clave1 .".". $clave2 .".". ($id+1);
				$usuario->contrasena = md5("endfiD2018");        
				$usuario->id_tipo_usuario = 28;
				$usuario->borrado = false;
			}else{
				$editar = true;
				$usuario = Usuario::where("usuario", $post["usuario"])->first();
			}
			
			DB::beginTransaction();
			try{
				$usuario->save();
				//creamos en la tabla persona
				$persona->run = strtoupper($post['run']);
				$persona->nombres = isset($post["nombres"])?$post["nombres"]:null;
				$persona->apellido_paterno = isset($post["apellido_paterno"])?$post["apellido_paterno"]:null;
				$persona->apellido_materno = isset($post["apellido_materno"])?$post["apellido_materno"]:null;
				$nombre_completo = $post["nombres"] . " " . $post["apellido_paterno"];
				// Formatear fecha de nacimiento
				$date = isset($post["fecha_nacimiento"]) ? str_replace('/', '-', $post["fecha_nacimiento"]) : null;
				$persona->fecha_nacimiento = $date != null ? date('Y-m-d', strtotime($date)) : null;

				$persona->id_comuna_residencia = isset($post["id_comuna_residencia"])?$post["id_comuna_residencia"]:null;
				$persona->id_sexo = $post["id_sexo"];
				$persona->email = isset($post["correo_electronico_principal"])?$post["correo_electronico_principal"]:null;
				$persona->telefono = isset($post["telefono_principal"])?$post["telefono_principal"]:null;
				$persona->modificado = isset($post["modificado"])?$post["modificado"]:null;
				$persona->id_comuna_postulacion = isset($post["id_comuna_postulacion"])?$post["id_comuna_postulacion"]:null;
				$persona->nivel_estudios = isset($post["nivel_estudios"])?$post["nivel_estudios"]:null;
				$persona->profesion = $post["profesion"];
				$persona->apoyo_discapacidad_visual = isset($post["apoyo_visual"])?$post["apoyo_visual"]:false;
				$persona->apoyo_discapacidad_auditiva = isset($post["apoyo_auditivo"])?$post["apoyo_auditivo"]:false;
				
				$persona->id_usuario = $usuario->id_usuario;
				$persona->save();

				$cargo = "";
					DB::select("delete from rrhh.persona_cargo where id_persona = ".$persona->id_persona);
					if(isset($post["postula_examinador"]) && $post["postula_examinador"]=='true'){
						$cargo .= "examinador, ";
						$personaCargo = new PersonaCargo();
						$personaCargo->id_persona = $persona->id_persona;
						$personaCargo->id_cargo = 8;
						//$personaCargo->reclutado = true;
						$personaCargo->save();
					}
	
					if(isset($post["postula_supervisor"]) && $post["postula_supervisor"]=='true'){
						$cargo .= "supervisor, ";
						$personaCargo = new PersonaCargo();
						$personaCargo->id_persona = $persona->id_persona;
						$personaCargo->id_cargo = 9;
						//$personaCargo->reclutamiento = true;		
						$personaCargo->save();					
					}
					if(isset($post["postula_examinador_apoyo"]) && $post["postula_examinador_apoyo"]=='true'){
						$cargo .= "examinador de apoyo, ";
						$personaCargo = new PersonaCargo();
						$personaCargo->id_persona = $persona->id_persona;
						$personaCargo->id_cargo = 1007;	
						//$personaCargo->reclutamiento = true;
						$personaCargo->save();			
					}
					if(isset($post["postula_anfitrion"]) && $post["postula_anfitrion"]=='true'){
						$cargo .= "anfitrión, ";
						$personaCargo = new PersonaCargo();
						$personaCargo->id_persona = $persona->id_persona;
						$personaCargo->id_cargo = 1006;	
						//$personaCargo->reclutamiento = true;
						$personaCargo->save();			
					}
			
			}catch (\Exception $e){
				DB::rollback();
				$persona->modificado = false;
				$persona->save();
				
				$this->enviarNotificacionError($e->getMessage(), "Guardar usuario (lite)", $post);
				return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
			}
			
			DB::commit();
			
			/* ETAPA 2 Subir Archivos*/
			$arr_arch = json_decode($post["json_archivos"], 1);
		 	$subidas["cedula_identidad"] = false;
			$subidas["certificado_antecedentes"] = false;
			$subidas["curriculum"] = false;
			$subidas["certificado_titulo"] = false;

		 	foreach ($arr_arch as $_tipo => $dato_b64) {
				if($dato_b64 != null){
					$subidas[$_tipo] = $this->subirArchivos2($dato_b64, $persona->id_persona, $_tipo, null);
				}
			}

			if ($editar == false){
				foreach ($subidas as $tipo_ => $bool) {
					if($bool == false){
						return response()->json(array("respuesta"=>"error", "descripcion"=>"Falló la carga del archivo de tipo: " . $tipo_ . ". Intente subir nuevamente.")); 
					}
				}
			}
				
			$subject = "Postulación - Evaluación Conocimientos Específicos y Pedagógicos";
			$html = "
				<p>Estimado/a " . $nombre_completo . " </p>
				<p>Agradecemos su interés en participar en Evaluación Conocimientos Específicos y Pedagógicos, como " . $cargo . ". Su postulación ha sido registrada. Revisaremos sus antecedentes y en caso de ser preseleccionado será contactado/a para coordinar la fecha y lugar de capacitación.</p>
				<br>
				<p>Saludos cordiales</p>
				<p>Equipo de Aplicación ECEP</p>";
		
			$mail = new PHPMailer(true); 
			$mail->isSMTP(); // tell to use smtp
			$mail->CharSet = "utf-8"; // set charset to utf8
			// $mail->SMTPDebug = 3;
			//$mail->Debugoutput = 'html';

			$mail->SMTPSecure = "ssl"; // tls or ssl
			$mail->SMTPAuth = true;  // use smpt auth
			$mail->Host = "mail.smtp2go.com"; 
			$mail->Port = 443;//2525; //443; 
			$mail->Username = "postulaciones-ecep@iie.cl";
			$mail->Password = "N3RzZmIzNjJyem4w";
			$mail->setFrom("postulaciones-ecep@iie.cl", "ECEP");
			$mail->Subject = $subject;
			$mail->MsgHTML($html);
			$mail->addAddress($post["correo_electronico_principal"], $nombre_completo);
			$mail->addBCC("alberto.paillao@iie.cl", "Alberto Paillao");
			// $mail->addBCC("roberto.novoa@iie.cl", "Pul Ento");
			$mail->send();
			
			return response()->json(["respuesta"=>"ok","descripcion"=>"Se ha creado el usuario"]);	
		}
	}
	
	public function saveUsuario2(Request $request){
		$post = $request->all();
		
		if($post['run']!=""){
			$persona = Persona::where("run", strtoupper($post["run"]))->first();
			if(!isset($persona->id_persona)){
				$persona= new Persona();
				// Buscar email
				$pers_mail = Persona::where("email", $post["correo_electronico_principal"])->first();
				if(isset($pers_mail->id_persona)){
					if(strtoupper($pers_mail->run) != strtoupper($post["run"])){
						return response()->json(array("respuesta"=>"error","descripcion"=>"Ya existe un usuario registrado con el correo enviado.")); 
					}
				}
			}
			if($persona->modificado == true){
				$this->enviarNotificacionError("Usuario ya modificó su formulario de postulación", "Guardar usuario", $post);
				return response()->json(array("respuesta"=>"error","descripcion"=>"Usted ya envió una postulación.")); 
			}
			
			$usuario = DB::select("SELECT id_usuario , usuario, contrasena FROM core.usuario WHERE borrado = false AND usuario = '" . trim(strtolower($post['usuario'])) . "'");
			if(!isset($usuario[0])){
				$editar = false;	
				$usuario = new Usuario();
				$id = DB::table('core.usuario')->latest('id_usuario')->first()->id_usuario;				// Obtener ultimo id_usuario
				$clave1 = isset($post["nombres"]) ? trim(strtolower(str_replace(" ", "", $post["nombres"]))): "nombre";
				$clave2 = isset($post["apellido_paterno"]) ? trim(strtolower(str_replace(" ", "", $post["apellido_paterno"]))): "apellido";
				$usuario->usuario = $clave1 .".". $clave2 .".". ($id+1);
				$usuario->contrasena = md5("endfiD2018");        
				$usuario->id_tipo_usuario = 28;
				$usuario->borrado = false;
			}else{
				$editar = true;
				$usuario = Usuario::where("usuario", $post["usuario"])->first();
			}
			
			DB::beginTransaction();
			try{
				$usuario->save();
				//creamos en la tabla persona
				$persona->run = strtoupper($post['run']);
				$persona->nombres = isset($post["nombres"])?$post["nombres"]:null;
				$persona->apellido_paterno = isset($post["apellido_paterno"])?$post["apellido_paterno"]:null;
				$persona->apellido_materno = isset($post["apellido_materno"])?$post["apellido_materno"]:null;
				$nombre_completo = $post["nombres"] . " " . $post["apellido_paterno"];
				// Formatear fecha de nacimiento
				$date = isset($post["fecha_nacimiento"]) ? str_replace('/', '-', $post["fecha_nacimiento"]) : null;
				$persona->fecha_nacimiento = $date != null ? date('Y-m-d', strtotime($date)) : null;

				$persona->id_comuna_nacimiento = isset($post["id_comuna_nacimiento"])?$post["id_comuna_nacimiento"]:null;
				$persona->domicilio = isset($post["direccion_residencia"])?$post["direccion_residencia"]:null;
				$persona->domicilio_sector = isset($post["sector_residencia"])?$post["sector_residencia"]:null;
				$persona->nacionalidad = isset($post["nacionalidad"])?$post["nacionalidad"]:null;
				$persona->id_comuna_residencia = isset($post["id_comuna_residencia"])?$post["id_comuna_residencia"]:null;
				$persona->id_sexo = $post["id_sexo"];
				$persona->id_estado_civil = $post["id_estado_civil"];
				$persona->email = isset($post["correo_electronico_principal"])?$post["correo_electronico_principal"]:null;
				$persona->telefono = isset($post["telefono_principal"])?$post["telefono_principal"]:null;
				$persona->otro_lugar_nacimiento = isset($post["otro_lugar_nacimiento"])?$post["otro_lugar_nacimiento"]:null;
				$persona->otra_nacionalidad = isset($post["otra_nacionalidad"])?$post["otra_nacionalidad"]:null;
				$persona->modificado = isset($post["modificado"])?$post["modificado"]:null;
				$persona->id_comuna_postulacion = isset($post["id_comuna_postulacion"])?$post["id_comuna_postulacion"]:null;
				$persona->nivel_estudios = isset($post["nivel_estudios"])?$post["nivel_estudios"]:null;
				$persona->universidad = isset($post["universidad"])?$post["universidad"]:null;
				if($post["id_universidad"] != 1000){
					$persona->id_institucion = isset($post["id_universidad"])?$post["id_universidad"]:null;	
				}
				else{
					$persona->id_institucion = null;	
				}
				
				$persona->profesion = $post["profesion"];

				$persona->licencia_conducir = isset($post["licencia_conducir"])?$post["licencia_conducir"]:null;
				$persona->automovil = isset($post["automovil"])?$post["automovil"]:null;
				$persona->licencia_clase = isset($post["clase_licencia"])?$post["clase_licencia"]:null;
				$_db = json_decode($post["datos_bancarios"],1);
				$persona->banco_nro_cuenta = $_db["numero_cuenta"];
				$persona->banco_tipo_cuenta = $_db["tipo_cuenta"];
				$persona->banco_nombre = $_db["banco"];
				
				$persona->id_usuario = $usuario->id_usuario;
				$persona->postulacion_finalizada = true;
				$persona->save();

				$cargo = "";
				//if($editar == false){
					DB::select("delete from rrhh.persona_cargo where id_persona = ".$persona->id_persona);
					if(isset($post["postula_examinador"]) && $post["postula_examinador"]=='true'){
						$cargo .= "examinador, ";
						$personaCargo = new PersonaCargo();
						$personaCargo->id_persona = $persona->id_persona;
						$personaCargo->id_cargo = 8;
						//$personaCargo->reclutado = true;
						$personaCargo->save();
					}
	
					if(isset($post["postula_supervisor"]) && $post["postula_supervisor"]=='true'){
						$cargo .= "supervisor, ";
						$personaCargo = new PersonaCargo();
						$personaCargo->id_persona = $persona->id_persona;
						$personaCargo->id_cargo = 9;
						//$personaCargo->reclutamiento = true;		
						$personaCargo->save();					
					}
					if(isset($post["postula_examinador_apoyo"]) && $post["postula_examinador_apoyo"]=='true'){
						$cargo .= "examinador de apoyo, ";
						$personaCargo = new PersonaCargo();
						$personaCargo->id_persona = $persona->id_persona;
						$personaCargo->id_cargo = 1007;	
						//$personaCargo->reclutamiento = true;
						$personaCargo->save();			
					}
					if(isset($post["postula_anfitrion"]) && $post["postula_anfitrion"]=='true'){
						$cargo .= "anfitrión, ";
						$personaCargo = new PersonaCargo();
						$personaCargo->id_persona = $persona->id_persona;
						$personaCargo->id_cargo = 1006;	
						//$personaCargo->reclutamiento = true;
						$personaCargo->save();			
					}
			
			}catch (\Exception $e){
				DB::rollback();
				$persona->postulacion_finalizada = false;
				$persona->save();
				
				$this->enviarNotificacionError($e->getMessage(), "Guardar usuario", $post);
				return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
			}
			DB::commit();

			/* ETAPA 2 Subir Archivos*/
			$arr_arch = json_decode($post["json_archivos"], 1);
		 	$subidas["cedula_identidad"] = false;
			$subidas["certificado_antecedentes"] = false;
			$subidas["curriculum"] = false;
			$subidas["certificado_titulo"] = false;

		 	foreach ($arr_arch as $_tipo => $dato_b64) {
				if($dato_b64 != null){
					$subidas[$_tipo] = $this->subirArchivos2($dato_b64, $persona->id_persona, $_tipo, null);
				}
			}

			if ($editar == false){
				foreach ($subidas as $tipo_ => $bool) {
					if($bool == false){
						return response()->json(array("respuesta"=>"error", "descripcion"=>"Falló la carga del archivo de tipo: " . $tipo_ . ". Intente subir nuevamente.")); 
					}
				}
			}
			
			// CORREO
			$subject = "Postulación - Evaluación Conocimientos Específicos y Pedagógicos";
			$html = "
				<p>Estimado/a " . $nombre_completo . " </p>
				<p>Agradecemos su interés en participar en Evaluación Conocimientos Específicos y Pedagógicos, como " . $cargo . ". Su postulación ha sido registrada. Revisaremos sus antecedentes y en caso de ser preseleccionado será contactado/a para coordinar la fecha y lugar de capacitación.</p>
				<br>
				<p>Saludos cordiales</p>
				<p>Equipo de Aplicación ECEP</p>";
		
			$mail = new PHPMailer(true); 
			$mail->isSMTP(); // tell to use smtp
			$mail->CharSet = "utf-8"; // set charset to utf8
			// $mail->SMTPDebug = 3;
			//$mail->Debugoutput = 'html';

			$mail->SMTPSecure = "ssl"; // tls or ssl
			$mail->SMTPAuth = true;  // use smpt auth
			$mail->Host = "mail.smtp2go.com"; 
			$mail->Port = 443;//2525; //443; 
			$mail->Username = "postulaciones-ecep@iie.cl";
			$mail->Password = "N3RzZmIzNjJyem4w";
			$mail->setFrom("postulaciones-ecep@iie.cl", "ECEP");
			$mail->Subject = $subject;
			$mail->MsgHTML($html);
			$mail->addAddress($post["correo_electronico_principal"], $nombre_completo);
			$mail->addBCC("alberto.paillao@iie.cl", "Alberto Paillao");
			// $mail->addBCC("roberto.novoa@iie.cl", "Pul Ento");
			$mail->send();
			
			return response()->json(["respuesta"=>"ok","descripcion"=>"Se ha creado el usuario."]);	
		}
	}

	public function obtenerIdRegionPorComuna(Request $request){
        $post = $request->all();

        $validacion = Validator::make($post, [
			'id_comuna' => 'int|required',
		]);	
			
		if($validacion->fails()){
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$comuna = Comuna::find($post["id_comuna"]);

		$arr["id_region"] = isset($comuna->id_region) ? $comuna->id_region : null;
		return response()->json(array("respuesta"=>"OK", "descripcion" => $arr));
	}

	function subirArchivos2($archivo, $idPersona, $tipo, $idPersonaArchivo){
        if(isset($archivo) && isset($idPersona) && isset($tipo)){
	    	if (isset($idPersonaArchivo)){
    		 	$arc = PersonaArchivo::find($idPersonaArchivo);
	    	 	if(isset($arc->id_persona_archivo)){
	    	 		$arc = new PersonaArchivo();
	    	 	}
    		}else{
	    	 	$arc = new PersonaArchivo();
    	 	}

	 		$imgdata = base64_decode($archivo);
			$f = finfo_open();
			$mime_type = finfo_buffer($f, $imgdata, FILEINFO_MIME_TYPE);
			unset($imgdata);
			$ext = $this->diccionarioTipos($mime_type);
	        
	        $arc->id_persona = $idPersona;
	        $arc->archivo = $archivo;
			$arc->nombre_archivo = $idPersona . "-" . $tipo;
			$arc->mime_type = $mime_type;
	        $arc->extension = $this->diccionarioTipos($mime_type);
	        $arc->tipo = $tipo;
	        try {
	        	$carpeta = realpath(__DIR__ . '/../../../../..') . "/uploads/";
		        if (!file_exists($carpeta)) {
		            mkdir($carpeta);
		        }
	        	$file = fopen (realpath(__DIR__ . '/../../../../..') . "/uploads/" . $idPersona . "-" .$tipo. "." . $arc->extension,'w');
				fwrite ($file, $archivo);
				fclose ($file);
	        	$arc->save();
	        } catch (Exception $e) {
	        	$post["archivo"] = $archivo;
	        	$post["idPersona"] = $idPersona;
	        	$post["tipo"] = $tipo;
	        	$post["idPersonaArchivo"] = $idPersonaArchivo;
	        	$this->enviarNotificacionError($e->getMessage(), "Subir Archivos", $post);
	        	return false; 
	        }
	        return true;

        }else{
        	return false;
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
				default :
					$salida = "desconocido";
					break;
			}
			return $salida;
	}

	function enviarNotificacionPostulacion($correo, $nombre, $cargo) {
		exit;
		$subject = "Postulación - Evaluación Conocimientos Específicos y Pedagógicos";
		$html = "
		<p>Estimado/a " . $nombre . " </p>
		<p>Agradecemos su interés en participar en Evaluación Conocimientos Específicos y Pedagógicos, como " . $cargo . ".Su postulación ha sido registrada. Revisaremos sus antecedentes y en caso de ser preseleccionado será contactado/a para coordinar la fecha y lugar de capacitación.</p>
		<br>
		<p>Saludos cordiales</p>
		<p>Equipo de Aplicación ECEP</p>";
		
		//arreglo($html);
		
		$mail = new PHPMailer(true); 
		// arreglo($mail);exit;
		try {
			$mail->isSMTP(); // tell to use smtp
			$mail->CharSet = "utf-8"; // set charset to utf8
			$mail->SMTPDebug = 0;
			$mail->Debugoutput = 'html';

			$mail->SMTPSecure = "tls"; // tls or ssl
			$mail->SMTPAuth = true;  // use smpt auth
			$mail->Host = "mail.smtp2go.com"; 
			$mail->Port = 443;//2525; //443; 
			$mail->Username = "postulaciones-ecep@iie.cl";
			$mail->Password = "b2QxMmhzam9nc2kw";
			$mail->setFrom("postulaciones-ecep@iie.cl", "ECEP");
			$mail->Subject = $subject;
			$mail->MsgHTML($html);
			$mail->addAddress($correo, $nombre);
			$mail->addBCC("alberto.paillao@iie.cl", "Alberto Paillao");
			// $mail->addBCC("roberto.novoa@iie.cl", "Pul Ento");
			$mail->send();
		} catch (phpmailerException $e) {
			//echo($e);
			// arreglo($e->errorMessage());exit;
		} catch (Exception $e) {
			//echo($e);
			// arreglo($e->errorMessage());exit;				
		}
		return true;
	}

	function enviarNotificacionPreseleccion($correo, $nombre, $fecha, $direccion) {
		$subject = "Preseleccionado - Evaluación Conocimientos Específicos y Pedagógicos";
		$html = "
		<p>Estimado " . $nombre . " </p>
		<p>Usted ha sido preseleccionado para participar en Evaluación Conocimientos Específicos y Pedagógicos</p>
		<p>De acuerdo a su confirmación telefónica deberá participar de una jornada de capacitación, que se realizará el día " .$fecha. " en " . $direccion . ". Para ese día debe haber leído el manual de capacitación adjunto.</p>
		<p>Además deberá  firmar un acuerdo de confidencialidad, el cual se adjunta en este correo.</p>
		<br>
		<p>Saludos cordiales</p>
		<p>Equipo de Aplicación ECEP</p>";
			
		// $mail = new PHPMailer(true); 
		
		// try {
			// $mail->isSMTP(); // tell to use smtp
			// $mail->CharSet = "utf-8"; // set charset to utf8
			// $mail->SMTPDebug = 0;
			// $mail->Debugoutput = 'html';

			// $mail->SMTPSecure = "tls"; // tls or ssl
			// $mail->SMTPAuth = true;  // use smpt auth
			// $mail->Host = "smtp.gmail.com"; 
			// $mail->Port = 587; //443; 
			// $mail->Username = "postulaciones-ecep@iie.cl";
			// $mail->Password = "ecep2019@iie@";
			// $mail->setFrom("postulaciones-ecep@iie.cl", "ECEP");
			// $mail->Subject = $subject;
			// $mail->MsgHTML($html);
			// $mail->addAddress($correo, $nombre);
			// $mail->addCc("alberto.paillao@iie.cl", "Alberto Paillao");
			// $mail->send();
		// } catch (phpmailerException $e) {
			// //echo($e);
			// arreglo($e->errorMessage());exit;
		// } catch (Exception $e) {
			// arreglo($e->errorMessage());exit;
			// //echo($e);				
		// }
	}

	function enviarNotificacionError($error, $proceso, $post) {
		$cadena = "";
		foreach($post as $_p => $v){
			$cadena .= $_p . " => " .$v . "<br>";
		}
		$subject = "Error en guardado de datos - ECEP";
		$html = "
		<p>Equipo de Desarrollo ECEP:</p>
		<p>Se ha generado un error intentado guardar datos</p>
		<p>La información del error es la siguiente:</p>
		<p>Proceso en el que se generó el error: " . $proceso . "</p>
		<p>Descripción del error: ".$error."</p>
		<p>Datos enviados en la petición: <br>".$cadena."</p>
		<p>Saludos.</p>";
		
		$mail = new PHPMailer(true); 
		$mail->isSMTP(); // tell to use smtp
		$mail->CharSet = "utf-8"; // set charset to utf8
		//$mail->SMTPDebug = 0;
		//$mail->Debugoutput = 'html';

		$mail->SMTPSecure = "ssl"; // tls or ssl
		$mail->SMTPAuth = true;  // use smpt auth
		$mail->Host = "mail.smtp2go.com"; 
		$mail->Port = 443;//2525; //443; 
		$mail->Username = "postulaciones-ecep@iie.cl";
		$mail->Password = "N3RzZmIzNjJyem4w";
		$mail->setFrom("postulaciones-ecep@iie.cl", "ECEP");
		$mail->Subject = $subject;
		$mail->MsgHTML($html);
		$mail->addAddress("alberto.paillao@iie.cl", "Alberto Paillao");
		$mail->addBCC("roberto.novoa@iie.cl", "Pul Ento");
		try {
			$mail->send();
		} catch (phpmailerException $e) {
			return;
			//echo($e);
		} catch (Exception $e) {
			return;
			//echo($e);				
		}
	}

	// public function saveUsuario(Request $request){

	// 	$post = $request->all();

	// 	if($post['run']!=""){
	// 		//lo primero es buscar si el email enviado (ya sea nuevo o actualización) está siendo usado por otra persona
	// 		$pers_mail = Persona::where("email", "ilike", trim(strtolower($post["correo_electronico_principal"])))->first();
	// 		if(isset($pers_mail->id_persona)){
	// 			if(strtoupper($pers_mail->run) != strtoupper($post["run"])){
	// 				return response()->json(array("respuesta"=>"error","descripcion"=>"Ya existe un usuario registrado con el correo enviado.")); 
	// 			}
	// 		}

	// 		//buscamos la persona por el run ingresado
	// 		$persona = Persona::where("run", strtoupper($post["run"]))->first();

	// 		//si es una persona que ya existe, verificamos si ya envió sus datos
	// 		if(isset($persona->modificado)){
	// 			if($persona->modificado == true){
	// 				$this->enviarNotificacionError("Usuario ya modificó su formulario de postulación", "Guardar usuario", $post);
	// 				return response()->json(array("respuesta"=>"error","descripcion"=>"Usted ya envió una postulación.")); 
	// 			}
	// 		}

	// 		//si el run no existe creamos la persona
	// 		$id = DB::table('core.usuario')->latest('id_usuario')->first()->id_usuario;				// Obtener ultimo id_usuario
	// 		$clave1 = isset($post["nombres"]) ? trim(strtolower(str_replace(" ", "", $post["nombres"]))): "nombre";
	// 		$clave2 = isset($post["apellido_paterno"]) ? trim(strtolower(str_replace(" ", "", $post["apellido_paterno"]))): "apellido";
			
	// 		if(!isset($persona->id_persona)){
	// 			$persona = new Persona();
	// 			$usuario = new Usuario();
	// 			$usuario->usuario = $clave1 .".". $clave2 .".". ($id+1);
	// 			$usuario->contrasena = md5("endfiD2018");        
	// 			$usuario->id_tipo_usuario = 28;
	// 			$usuario->borrado = false;
	// 		}
	// 		else{
	// 			//$usuario = Usuario::where("usuario", "ilike", trim(strtolower($post["usuario"])))->first();
	// 			$usuario = Usuario::find($persona->id_usuario);
	// 			//$usuario->usuario = trim(strtolower($post["correo_electronico_principal"])))
	// 			//$usuario->id_usuario = $persona->id_usuario;
	// 			$usuario->usuario = $clave1 .".". $clave2 .".". ($id+1);
	// 		}
			
	// 		// $usuario = DB::select("SELECT id_usuario , usuario, contrasena FROM core.usuario WHERE borrado = false AND usuario = lower('" . trim(strtolower($post['usuario'])) . "')");
	// 		// if(!isset($usuario[0])){
	// 			// //$editar = false;	
	// 			// $usuario = new Usuario();
	// 			// $id = DB::table('core.usuario')->latest('id_usuario')->first()->id_usuario;				// Obtener ultimo id_usuario
	// 			// $clave1 = isset($post["nombres"]) ? trim(strtolower(str_replace(" ", "", $post["nombres"]))): "nombre";
	// 			// $clave2 = isset($post["apellido_paterno"]) ? trim(strtolower(str_replace(" ", "", $post["apellido_paterno"]))): "apellido";
	// 			// $usuario->usuario = $clave1 .".". $clave2 .".". ($id+1);
	// 			// $usuario->contrasena = md5("endfiD2018");        
	// 			// $usuario->id_tipo_usuario = 28;
	// 			// $usuario->borrado = false;
	// 		// }else{
	// 			// //$editar = true;
	// 			// $usuario = Usuario::where("usuario", "ilike", trim(strtolower($post["usuario"])))->first();
	// 		// }
			
	// 		DB::beginTransaction();
	// 		try{
	// 			$usuario->save();
	// 			//creamos en la tabla persona
	// 			$persona->run = strtoupper($post['run']);
	// 			$persona->nombres = isset($post["nombres"])?$post["nombres"]:null;
	// 			$persona->apellido_paterno = isset($post["apellido_paterno"])?$post["apellido_paterno"]:null;
	// 			$persona->apellido_materno = isset($post["apellido_materno"])?$post["apellido_materno"]:null;
	// 			$nombre_completo = $post["nombres"] . " " . $post["apellido_paterno"];
	// 			// Formatear fecha de nacimiento
	// 			$date = isset($post["fecha_nacimiento"]) ? str_replace('/', '-', $post["fecha_nacimiento"]) : null;
	// 			$persona->fecha_nacimiento = $date != null ? date('Y-m-d', strtotime($date)) : null;

	// 			$persona->id_comuna_nacimiento = isset($post["id_comuna_nacimiento"])?$post["id_comuna_nacimiento"]:null;
	// 			$persona->domicilio = isset($post["direccion_residencia"])?$post["direccion_residencia"]:null;
	// 			$persona->domicilio_sector = isset($post["sector_residencia"])?$post["sector_residencia"]:null;
	// 			$persona->nacionalidad = isset($post["nacionalidad"])?$post["nacionalidad"]:null;
	// 			$persona->id_comuna_residencia = isset($post["id_comuna_residencia"])?$post["id_comuna_residencia"]:null;
	// 			$persona->id_sexo = $post["id_sexo"];
	// 			$persona->id_estado_civil = $post["id_estado_civil"];
	// 			$persona->email = isset($post["correo_electronico_principal"])?$post["correo_electronico_principal"]:null;
	// 			$persona->telefono = isset($post["telefono_principal"])?$post["telefono_principal"]:null;
	// 			$persona->otro_lugar_nacimiento = isset($post["otro_lugar_nacimiento"])?$post["otro_lugar_nacimiento"]:null;
	// 			$persona->otra_nacionalidad = isset($post["otra_nacionalidad"])?$post["otra_nacionalidad"]:null;
	// 			$persona->modificado = isset($post["modificado"])?$post["modificado"]:null;
	// 			$persona->id_comuna_postulacion = isset($post["id_comuna_postulacion"])?$post["id_comuna_postulacion"]:null;
	// 			$persona->nivel_estudios = isset($post["nivel_estudios"])?$post["nivel_estudios"]:null;
	// 			$persona->universidad = isset($post["universidad"])?$post["universidad"]:null;
	// 			if($post["id_universidad"] != 1000){
	// 				$persona->id_institucion = isset($post["id_universidad"])?$post["id_universidad"]:null;	
	// 			}
	// 			else{
	// 				$persona->id_institucion = null;	
	// 			}
				
	// 			$persona->profesion = $post["profesion"];

	// 			$persona->licencia_conducir = isset($post["licencia_conducir"])?$post["licencia_conducir"]:null;
	// 			$persona->automovil = isset($post["automovil"])?$post["automovil"]:null;
	// 			$persona->licencia_clase = isset($post["clase_licencia"])?$post["clase_licencia"]:null;
	// 			$_db = json_decode($post["datos_bancarios"],1);
	// 			$persona->banco_nro_cuenta = $_db["numero_cuenta"];
	// 			$persona->banco_tipo_cuenta = $_db["tipo_cuenta"];
	// 			$persona->banco_nombre = $_db["banco"];
				
	// 			$persona->id_usuario = $usuario->id_usuario;
	// 			$persona->save();
				
	// 			//$tm = DB::select("SELECT id_tabla_maestra FROM core.tabla_maestra WHERE descripcion_corta = 'endfid2019' ");
	// 			//$id_proyecto = $tm[0]->id_tabla_maestra;
				
	// 			// if($editar == true){
	// 				// $personaProyecto = PersonasProyectos::where("id_persona", $persona->id_persona)->first();
	// 				// if(!isset($personaProyecto->id_persona_proyecto)){
	// 					// $personaProyecto = new PersonasProyectos();
	// 					// $personaProyecto->id_persona = $persona->id_persona;
	// 					// $personaProyecto->id_proyecto = $id_proyecto;
	// 					// $personaProyecto->save();
	// 				// }
	// 			// }else{
	// 				// $personaProyecto = new PersonasProyectos();
	// 				// $personaProyecto->id_persona = $persona->id_persona;
	// 				// $personaProyecto->id_proyecto = $id_proyecto;
	// 				// $personaProyecto->save();
	// 			// }
				
				
	// 			// DB::select("delete from core.rol_usuario where id_usuario = ".$usuario->id_usuario);
	// 			// if(isset($post["postula_examinador"]) && $post["postula_examinador"]=='true'){
	// 				// $rolUsuario = new RolUsuario(); 
	// 				// $rolUsuario->id_usuario = $usuario->id_usuario;
	// 				// $rolUsuario->id_rol_proceso = 8;
	// 				// $rolUsuario->save(); 
	// 			// }	
	// 			// if(isset($post["postula_supervisor"]) && $post["postula_supervisor"]=='true'){
	// 				// $rolUsuario = new RolUsuario(); 
	// 				// $rolUsuario->id_usuario = $usuario->id_usuario;
	// 				// $rolUsuario->id_rol_proceso = 9;
	// 				// $rolUsuario->save(); 
	// 			// }	
	// 			// if(isset($post["postula_examinador_apoyo"]) && $post["postula_examinador_apoyo"]=='true'){
	// 				// $rolUsuario = new RolUsuario(); 
	// 				// $rolUsuario->id_usuario = $usuario->id_usuario;
	// 				// $rolUsuario->id_rol_proceso = 1007;
	// 				// $rolUsuario->save(); 
	// 			// }	
	// 			// if(isset($post["postula_anfitrion"]) && $post["postula_anfitrion"]=='true'){
	// 				// $rolUsuario = new RolUsuario(); 
	// 				// $rolUsuario->id_usuario = $usuario->id_usuario;
	// 				// $rolUsuario->id_rol_proceso = 1006;
	// 				// $rolUsuario->save(); 
	// 			// }	

	// 			$cargo = "";
	// 			//if($editar == false){
	// 				DB::select("delete from rrhh.persona_cargo where id_persona = ".$persona->id_persona);
	// 				if(isset($post["postula_examinador"]) && $post["postula_examinador"]=='true'){
	// 					$cargo .= "examinador, ";
	// 					$personaCargo = new PersonaCargo();
	// 					$personaCargo->id_persona = $persona->id_persona;
	// 					$personaCargo->id_cargo = 8;
	// 					//$personaCargo->reclutado = true;
	// 					$personaCargo->save();
	// 				}
	
	// 				if(isset($post["postula_supervisor"]) && $post["postula_supervisor"]=='true'){
	// 					$cargo .= "supervisor, ";
	// 					$personaCargo = new PersonaCargo();
	// 					$personaCargo->id_persona = $persona->id_persona;
	// 					$personaCargo->id_cargo = 9;
	// 					//$personaCargo->reclutamiento = true;		
	// 					$personaCargo->save();					
	// 				}
	// 				if(isset($post["postula_examinador_apoyo"]) && $post["postula_examinador_apoyo"]=='true'){
	// 					$cargo .= "examinador de apoyo, ";
	// 					$personaCargo = new PersonaCargo();
	// 					$personaCargo->id_persona = $persona->id_persona;
	// 					$personaCargo->id_cargo = 1007;	
	// 					//$personaCargo->reclutamiento = true;
	// 					$personaCargo->save();			
	// 				}
	// 				if(isset($post["postula_anfitrion"]) && $post["postula_anfitrion"]=='true'){
	// 					$cargo .= "anfitrión, ";
	// 					$personaCargo = new PersonaCargo();
	// 					$personaCargo->id_persona = $persona->id_persona;
	// 					$personaCargo->id_cargo = 1006;	
	// 					//$personaCargo->reclutamiento = true;
	// 					$personaCargo->save();			
	// 				}			
	// 		}catch (\Exception $e){
	// 			DB::rollback();
	// 			$persona->modificado = false;
	// 			$persona->save();
				
	// 			$this->enviarNotificacionError($e->getMessage(), "Guardar usuario", $post);
	// 			return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
	// 		}
	// 		//$persona->modificado = false;
	// 		//$persona->save();
			
	// 		DB::commit();
			
	// 		// if($this->enviarNotificacionPostulacion($post["correo_electronico_principal"], $nombre_completo, $cargo)){
				
	// 		$subject = "Postulación - Evaluación Conocimientos Específicos y Pedagógicos";
	// 		$html = "
	// 			<p>Estimado/a " . $nombre_completo . " </p>
	// 			<p>Agradecemos su interés en participar en Evaluación Conocimientos Específicos y Pedagógicos, como " . substr($cargo, 0 ,-2) . ". Su postulación ha sido registrada. Revisaremos sus antecedentes y en caso de ser preseleccionado será contactado/a para coordinar la fecha y lugar de capacitación.</p>
	// 			<br>
	// 			<p>Saludos cordiales</p>
	// 			<p>Equipo de Aplicación ECEP</p>";
		
	// 		$mail = new PHPMailer(true); 
	// 		$mail->isSMTP(); // tell to use smtp
	// 		$mail->CharSet = "utf-8"; // set charset to utf8
	// 		// $mail->SMTPDebug = 0;
	// 		// $mail->Debugoutput = 'html';

	// 		$mail->SMTPSecure = "ssl"; // tls or ssl
	// 		$mail->SMTPAuth = true;  // use smpt auth
	// 		$mail->Host = "mail.smtp2go.com"; 
	// 		$mail->Port = 443;//2525; //443; 
	// 		$mail->Username = "postulaciones-ecep@iie.cl";
	// 		$mail->Password = "N3RzZmIzNjJyem4w";
	// 		$mail->setFrom("postulaciones-ecep@iie.cl", "ECEP");
	// 		$mail->Subject = $subject;
	// 		$mail->MsgHTML($html);
	// 		$mail->addAddress($post["correo_electronico_principal"], $nombre_completo);
	// 		$mail->addBCC("alberto.paillao@iie.cl", "Alberto Paillao");
	// 		$mail->addBCC("roberto.novoa@iie.cl", "Pul Ento");
	// 		try {
	// 			$mail->send();
	// 		} catch (phpmailerException $e) {
	// 			//echo($e);
	// 		} catch (Exception $e) {
	// 			//echo($e);				
	// 		}
			
	// 		return response()->json(["respuesta"=>"ok","descripcion"=>"Se ha creado el usuario"]);	
	// 	}
	// }

	// public function subirArchivos(Request $request){
 //        $post = $request->all();
 //        // $validacion = Validator::make($post, [
	// 		// 'run' => 'required|string',
 //            // 'documento' => 'required|string',
 //            // 'nombreArchivo' => 'required|string',
 //            // 'tipo' => 'required|string',
 //            // 'id_persona_archivo' => 'int|nullable'
	// 	// ]);	
			
	// 	//if ($validacion->fails()) {
	// 		//return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
 //        //}
 //        try {        
	// 		$run = $post['run'];
	// 		$documento = $post['documento'];
	// 		$nombreArchivo = $post['nombreArchivo'];
	// 		$tipo = $post["tipo"];

	// 		/* ***** Tipos de archivo ******/
	// 			/* cedula_identidad */
	// 			/* curriculum */
	// 			/* certificado_antecedentes */
	// 			/* certificado_titulo */
	// 		function diccionarioTipos($mimeType){
	// 			$salida = "";
	// 			switch ($mimeType) {
	// 				case 'image/jpeg':
	// 					$salida = "jpg";
	// 					break;
	// 				case 'image/png':
	// 					$salida = "png";
	// 					break;
	// 				case 'application/pdf':
	// 					$salida = "pdf";
	// 					break;
	// 				case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
	// 					$salida = "docx";
	// 					break;
	// 				case 'application/msword':
	// 					$salida = "doc";
	// 					break;
	// 			}
	// 			return $salida;
	// 		}

	// 		$run = str_replace(".","", $post['run']);
	// 		$run = str_replace("-","", $run);
	// 		$run = strtoupper($run);
	// 		$runNro = substr($run, 0,(strlen($run)-1));
	// 		$runDV = substr($run, -1);
	// 		$run = trim($runNro)."-".trim($runDV);
			
	// 		$pers = Persona::where("run", 'ilike', $run)->first();

	// 		$ext_exp = explode(".", $nombreArchivo);
	// 		$ext = $ext_exp[sizeof($ext_exp)-1];

	// 		$imgdata = base64_decode($documento);

	// 		$f = finfo_open();

	// 		$mime_type = finfo_buffer($f, $imgdata, FILEINFO_MIME_TYPE);

	// 		if($post['id_persona_archivo'] == -1){
	// 			$arc = new PersonaArchivo();
	// 		}else{
	// 			$arc = PersonaArchivo::find($post['id_persona_archivo']);
	// 		}
			
	// 		$arc->id_persona = $pers->id_persona;
	// 		$arc->archivo = $documento;
	// 		$arc->nombre_archivo = $nombreArchivo;
	// 		$arc->mime_type = $mime_type;
	// 		$arc->extension = diccionarioTipos($mime_type);
	// 		$arc->tipo = $tipo;


 //        	$folderPath = realpath(__DIR__ . '/../../../../..') . "/uploads/";
	//         if (!file_exists($folderPath)) {
	//             mkdir($folderPath);
	//         }
 //        	$pdf = fopen (realpath(__DIR__ . '/../../../../..') . "/uploads/" . $tipo . "-" .$run. "." . $arc->extension,'w');
	// 		fwrite ($pdf, $post["documento"]);
	// 		fclose ($pdf);
 //        	$arc->save();
 //        } catch (Exception $e) {
 //        	// unset($post["documento"]);
 //        	$this->enviarNotificacionError($e->getMessage(), "Subir Archivos", $post);
 //        	return response()->json(array("respuesta"=>"error","descripcion"=> "Error al guardar: " . $e->getMessage())); 
 //        }
 //        return response()->json(['resultado'=>'OK','descripcion'=>'Se ha guardado el archivo correctamente.']);
	// }
}