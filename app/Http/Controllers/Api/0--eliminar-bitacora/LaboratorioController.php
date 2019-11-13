<?php

namespace App\Http\Controllers\Api\Bitacora;
use Illuminate\Http\Request;
use App\Models\Core\TablaMaestra;
use App\Models\Infraestructura\Laboratorio;
use App\Models\Infraestructura\VisitaPrevia;
use App\Models\Evaluado\Contingencia;
use App\Models\Evaluado\Aplicacion;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class LaboratorioController extends Controller{
    /*public function corsAccept(Request $request){
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: OPTIONS, POST");
        header("Access-Control-Allow-Headers: t");
    }*/

    /*public function index(Request $request){
        $dependencias = Dependencias::all();

        return response()->json($dependencias);
    }

    public function indexById(Request $request){
        $post = $request->all();
        $final = array();
        $dependencias = Dependencias::where("centrosaplicacion_id", $post["centrosaplicacion_id"])->get();
        foreach ($dependencias as $dep){
            $app = Aplicaciones::where("dependencia_id", $dep["id"])->get();
            //Obtiene solo las dependencias que tengas una aplicación
            if(sizeof($app)>0){
                array_push($final, $dep);
            }
        }
        return response()->json($final);
    }*/

    public function indexLab(Request $request){
        $post = $request->all();

        $contingencia= DB::select("SELECT  evct.id_aplicacion, evct.contingencia, evct.id_estado, evct.id_contingencia, evct.created_at,
                                            tc.descripcion_larga tipo_contingencia, ec.descripcion_larga, ec.id_tabla_maestra,
                                            ap.fecha_agendada, ap.id_tipo_aplicacion
                                    from evaluado.contingencia evct
                                    INNER JOIN core.tabla_maestra tc ON (evct.id_tipo_contingencia = tc.id_tabla_maestra)
                                    INNER JOIN core.tabla_maestra ec ON (evct.id_estado = ec.id_tabla_maestra)
                                    INNER JOIN evaluado.aplicacion ap ON (evct.id_aplicacion = ap.id_aplicacion) 
                                    WHERE evct.id_aplicacion =  " . $post['idaplicacion'] . " AND ap.fecha_agendada = '" . $post['fechaaplicacion'] ."'");
        
        

        $aplicacionContingencia['contingencias'] = $contingencia;
                                            //->get();
        return response()->json($aplicacionContingencia);
    }

    public function saveLaboratorio(Request $request){
        $post = $request->all();
        //arreglo($post);exit;
        // validamos que no falten parametros y sean del tipo deseado
        $validacion = Validator::make($post, [
            'id' => 'int|required',
            'equipos_disponibles' => 'int|nullable',
        ]);

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422);
        }
        

        $dep = Laboratorio::find($post["id"]);

           
                    
                    

        if (empty($dep)) {
            return response()->json(['resultado'=>'error','descripcion'=>'No se encuentra el id de dependencia']);
        }else{
            //$dep->nombre_dependencia = isset($post["nombre_dependencia"])?$post["nombre_dependencia"]:null;
            
            $dep->contacto_nombre = isset($post["nombre_encargado"])?$post["nombre_encargado"]:null;
            $dep->contacto_email     = isset($post["correo_dependencia"])? $post["correo_dependencia"] : null;
            $dep->contacto_telefono = isset($post["telefono_dependencia"])? $post["telefono_dependencia"] : null;
            //$dep->horario_apertura = isset($post["horario_apertura"])? $post["horario_apertura"] : null;
            /*$dep->persona_disponible_apertura = isset($post["persona_disponible_apertura"])? $post["persona_disponible_apertura"] : null;
            $dep->telefono_persona_apertura = isset($post["telefono_persona_apertura"])? $post["telefono_persona_apertura"] : null;*/
            $dep->observacion = isset($post["observaciones_dependencia"])? $post["observaciones_dependencia"] : null;
            $dep->observacion_vp = isset($post["equipos_disponibles_vp"])? $post["equipos_disponibles_vp"] : null;
            $dep->equipos_disponibles = isset($post["equipos_disponibles"])? $post["equipos_disponibles"] : null;
            $dep->nro_equipos_operativos_vp = isset($post["equipos_disponibles_vp"])? $post["equipos_disponibles_vp"] : null;
            
            DB::beginTransaction();

                $vist = VisitaPrevia::where("id_laboratorio", $post["id"])->first();
                 if (!isset($vist->id_visita_previa)) {
                    $vist = new VisitaPrevia();
                    $vist->id_laboratorio = $post["id"];
                    $vist->resp_encargado = $post["resp_encargado"];
                    $vist->resp_encargado_email = $post["resp_encargado_email"];
                    $vist->resp_encargado_fono = $post["resp_encargado_fono"];
                    $vist->resp_apertura = $post["resp_apertura"];
                    $vist->resp_pcs_operativos = $post["resp_pcs_operativos"];
                    // $vist->updated_by = $post["usuario"];
                    $vist->save();
                    }
            try{
                $dep->save();
            }
            catch (\Exception $e){
                DB::rollback();
                //$e->getMessage();
                return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ('.$e->getMessage().')']);
            }
            DB::commit();
            return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado!!"]);
        }
       
    }

    public function indexByDiscriminador(Request $request){
        $post = $request->all();

        $tablaMaestra = TablaMaestra::select('id_tabla_maestra','discriminador','borrado','descripcion_larga')->where('discriminador', 2)->get();

        return response()->json($tablaMaestra);
    }

     public function saveContingencia(Request $request){

        $post = $request->all();
        $validacion = Validator::make($post, [
            'aplicaciones_id' => 'int|required',
            'tipos_contingencia_id' => 'int|nullable',
        ]);

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422);
        }
        

        $cont = new Contingencia();
       
        $cont->id_aplicacion = $post['aplicaciones_id'];
        $cont->id_tipo_contingencia = $post['tipos_contingencia_id'];
        $cont->id_estado = 105;
        $cont->contingencia = $post['contingencia'];
        DB::beginTransaction();
        
        try{        
            $cont->save();           
        }catch (\Exception $e){
            DB::rollback();
            //$e->getMessage()
            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
        }
        DB::commit();       
        return response()->json(array("respuesta"=>"ok","descripcion"=>"Se ha guardado"));  
    }
    
    public function saveBlock(Request $request){
        $post = $request->all();
        //arreglo($post);exit;
        // validamos que no falten parametros y sean del tipo deseado
        $validacion = Validator::make($post, [
            'id' => 'int|required',
        ]);

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422);
        }
        

        $apl = Aplicacion::find($post["id"]);

        if (empty($apl)) {
            return response()->json(['resultado'=>'error','descripcion'=>'No se encuentra el id de aplicacion']);
        }else{
            if(isset($post["b1_hora_inicio"]) || isset($post["b1_hora_termino"]) || isset($post["b1_presentes"]) || isset($post["b1_observaciones"])){
                $apl->b1_hora_inicio =$post["b1_hora_inicio"];
                $apl->b1_hora_termino = $post["b1_hora_termino"];
                $apl->b1_presentes     = $post["b1_presentes"];
                $apl->b1_observaciones = $post["b1_observaciones"];
            }
            if(isset($post["b2_hora_inicio"]) || isset($post["b2_hora_termino"]) || isset($post["b2_presentes"]) || isset($post["b2_observaciones"])){
                $apl->b2_hora_inicio =$post["b2_hora_inicio"];
                $apl->b2_hora_termino = $post["b2_hora_termino"];
                $apl->b2_presentes     = $post["b2_presentes"];
                $apl->b2_observaciones = $post["b2_observaciones"];
            }
           
            $apl->observaciones_supervisor = $post["observaciones_supervisor"];
            
            DB::beginTransaction();
            try{
                $apl->save();
            }
            catch (\Exception $e){
                DB::rollback();
                //$e->getMessage();
                return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ('.$e->getMessage().')']);
            }
            DB::commit();
            return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado!!"]);
        }

    }

}