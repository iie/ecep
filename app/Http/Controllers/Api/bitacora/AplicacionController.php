<?php

namespace App\Http\Controllers\Api\Bitacora;
use Illuminate\Http\Request;
use App\Models\Evaluado\Aplicacion;
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
        $deps= DB::select("SELECT lb.id_laboratorio ,lb.nombre_laboratorio,lb.nro_equipos_operativos, lb.observacion_visita,lb.contacto_nombre as encargado_apertura,lb.contacto_telefono as telefono_encargado_apertura, lb.contacto_email as email_encargado_lab,lb.direccion as direccion_lab, 
                                lb.observacion_vp, lb.nro_equipos_operativos_vp, vs.acceso_desde_0730, vs.id_laboratorio_visita
                                FROM infraestructura.laboratorio lb
                                INNER JOIN infraestructura.sede sd ON (sd.id_sede = lb.id_sede) 
                                INNER JOIN infraestructura.laboratorio_visita vs ON (vs.id_laboratorio = lb.id_laboratorio) 
                                WHERE lb.id_sede = " .$post["centrosaplicacion_id"]. " 
                                AND vs.id_laboratorio_visita in (select id_laboratorio_visita  
                                from infraestructura.laboratorio_visita 
                                where id_laboratorio = lb.id_laboratorio
                                order by id_laboratorio_visita DESC limit 1)
                                GROUP BY lb.id_laboratorio,lb.nombre_laboratorio,lb.nro_equipos_operativos, lb.observacion_visita,lb.contacto_nombre,lb.contacto_telefono,lb.contacto_email,lb.direccion, 
                                lb.observacion_vp, lb.nro_equipos_operativos_vp, vs.acceso_desde_0730, vs.id_laboratorio_visita ORDER BY lb.updated_at asc");
        
        if(sizeof($deps)>0){

                foreach ($deps as $u) {

                    $app = Aplicacion::where("id_laboratorio", $u->id_laboratorio)->where("id_tipo_aplicacion", 60)->orderBy('fecha_agendada', 'asc')->get();
                    $aux["id_laboratorio"] = $u->id_laboratorio;
                    $aux["nombre_laboratorio"] = $u->nombre_laboratorio;
                    $aux["nro_equipos_operativos"] = $u->nro_equipos_operativos;
                    $aux["observacion_visita"] = $u->observacion_visita;
                    $aux["direccion_lab"] = $u->direccion_lab;
                    $aux["encargado_apertura"] = $u->encargado_apertura;
                    $aux["telefono_encargado_apertura"] = $u->telefono_encargado_apertura;
                    $aux["email_encargado_lab"] = $u->email_encargado_lab;
                    $aux["acceso_desde_0730"] = $u->acceso_desde_0730;
                    $aux["obs_vistp"] = $u->observacion_vp;
                    $aux["nro_equip_vistp"] = $u->nro_equipos_operativos_vp;
                    $aux["aplicacion"] = $app;
                    $aux["aplicacion_complementaria"] = $app;
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
    
    


