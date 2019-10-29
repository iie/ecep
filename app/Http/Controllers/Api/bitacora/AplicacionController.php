<?php

namespace App\Http\Controllers\Api\Bitacora;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class aplicacionController extends Controller{
    

    /*public function index(Request $request){
        $aps = Aplicaciones::all();

        return response()->json($aps);
    }

	public function indexByDependenciaId(Request $request){
		//Borrar la siguiente linea cuando se cambie el servicio a Post
		// $post["dependencia_id"] = 1700;
        $dep = Dependencias::find($post["dependencia_id"]);
        $aps = Aplicaciones::where("dependencia_id", $post["dependencia_id"])->where("tiposaplicacion_id", 60)->get();
        $aux["nombre_dependencia"] = $dep["nombre_dependencia"];
        $aux["aplicaciones"] = (sizeof($aps)>0) ? $aps : "Sin aplicaciones";
        return response()->json($aux);
    }*/

	/*public function indexBySedeId(Request $request){
		$post = $request->all();
        $deps = Dependencias::where("centrosaplicacion_id", $post["centrosaplicacion_id"])->get();
        $aps = [];

        foreach($deps as $dep){
        	$var = Aplicaciones::where("dependencia_id", $dep["id"])->orderBy('fecha_agendada', 'asc')->get();
        	if(sizeof($var)>0){
        		$aux["nombre_dependencia"] = $dep["nombre_dependencia"];
                $aux["persona_disponible_apertura"] = $dep["persona_disponible_apertura"];
                $aux["observaciones"] = $dep["observaciones_dependencia"];
                $aux["horario_apertura"] = $dep["horario_apertura"];
                $aux["telefono_persona_apertura"] = $dep["telefono_persona_apertura"];
                $aux["id"] = $dep["id"];
                $aux["direccion_dep"] = $dep["direccion_dep"];
                $aux["facultad_sector"] = $dep["facultad_sector"];
        		$aux["aplicaciones"] = $var;
        		array_push($aps, $aux);
        	}
        }
        return response()->json($aps);
    }*/

    public function indexComplementariaBySedeId(Request $request){
         $post = $request->all();
         $sedes = array();
        //$sedes = CentroAplicacion::where("centro_institucion_id", $post["centro_institucion_id"])->get();
        $deps= DB::select("SELECT lb.id_laboratorio, lb.nombre_laboratorio, lb.nro_equipos_operativos, lb.observacion_visita, lb.contacto_nombre as encargado_apertura, lb.contacto_telefono as telefono_encargado_apertura, lb.contacto_email as email_encargado_lab, lb.direccion as direccion_lab, 
                                    sd.contacto_nombre as encargado_sede, sd.contacto_email, sd.contacto_telefono, sd.observacion,vs.acceso_desde_0730 ,c.nombre as nombre_comuna, r.nombre as nombre_region
                                from infraestructura.laboratorio lb
                                INNER JOIN infraestructura.sede sd ON (sd.id_sede = lb.id_sede) 
                                INNER JOIN infraestructura.laboratorio_visita vs ON (vs.id_laboratorio = lb.id_laboratorio) 
                                INNER JOIN core.comuna c ON (c.id_comuna = sd.id_comuna) 
                                INNER JOIN core.region r ON (r.id_region = c.id_region)
                                WHERE lb.id_sede = " .$post["centrosaplicacion_id"]. "GROUP BY lb.id_laboratorio, lb.nombre_laboratorio, lb.nro_equipos_operativos, lb.observacion_visita, lb.contacto_nombre, lb.contacto_telefono, lb.direccion, lb.contacto_email, sd.contacto_nombre, sd.contacto_email, sd.contacto_telefono, sd.observacion,vs.acceso_desde_0730, c.nombre, r.nombre ORDER BY lb.updated_at asc");
        
        if(sizeof($deps)>0){
                foreach ($deps as $u) {
                    $aux["id_laboratorio"] = $u->id_laboratorio;
                    $aux["nombre_laboratorio"] = $u->nombre_laboratorio;
                    $aux["nro_equipos_operativos"] = $u->nro_equipos_operativos;
                    $aux["observacion_visita"] = $u->observacion_visita;
                    $aux["nombre_region"] = $u->nombre_region;
                    $aux["nombre_comuna"] = $u->nombre_comuna;
                    $aux["direccion_lab"] = $u->direccion_lab;
                    $aux["encargado_apertura"] = $u->encargado_apertura;
                    $aux["telefono_encargado_apertura"] = $u->telefono_encargado_apertura;
                    $aux["email_encargado_lab"] = $u->email_encargado_lab;
                    $aux["encargado_sede"] = $u->encargado_sede;
                    $aux["email_encargado_sede"] = $u->contacto_email;
                    $aux["contacto_telefono_sede"] = $u->contacto_telefono;
                    $aux["observacion_sede"] = $u->observacion;
                    $aux["acceso_desde_0730"] = $u->acceso_desde_0730;
                    $sedes[] = $aux;
                }
            }

        
    
            
        return response()->json($sedes);
    }

    /*public function saveAplicacion(Request $request){
		$post = $request->all();		

		// validamos que no falten parametros y sean del tipo deseado
		$validacion = Validator::make($post, [
			'id' => 'int|required',		
		]);		

        if ($validacion->fails()) {
			return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }	

        $aps = Aplicaciones::find($post["id"]);
        if (empty($aps)) {
        	return response()->json(['resultado'=>'error','descripcion'=>'No se encuentra el id de aplicación']);
        }else{
            if(isset($post["observaciones_supervisor"])){
                $aps->observaciones_supervisor = isset($post["observaciones_supervisor"])? $post["observaciones_supervisor"] : null;
            }else{
                $aps->hora_inicio_b1 = isset($post["hora_inicio_b1"])?$post["hora_inicio_b1"]:null;
                $aps->hora_termino_b1 = isset($post["hora_termino_b1"])? $post["hora_termino_b1"] : null;
                $aps->presentes_b1 = isset($post["presentes_b1"])? $post["presentes_b1"] : null;
                $aps->hora_inicio_b2 = isset($post["hora_inicio_b2"])? $post["hora_inicio_b2"] : null;
                $aps->hora_termino_b2 = isset($post["hora_termino_b2"])? $post["hora_termino_b2"] : null;
                $aps->presentes_b2 = isset($post["presentes_b2"])? $post["presentes_b2"] : null;
                $aps->observaciones_b1 = isset($post["observaciones_b1"])? $post["observaciones_b1"] : null;
                $aps->observaciones_b2 = isset($post["observaciones_b2"])? $post["observaciones_b2"] : null;
            }
        	
			
			DB::beginTransaction();
			try{		
				$aps->save();
			}
			catch (\Exception $e){
				DB::rollback();
				//$e->getMessage();
				return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ('.$e->getMessage().')']);
			}
			DB::commit();		
			return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado"] );
		}	
    }*/
}
    
    


