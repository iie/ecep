<?php

namespace App\Http\Controllers\Api\Bitacora;
use Illuminate\Http\Request;
use App\Models\Infraestructura\Laboratorio;
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

    public function saveLaboratorio(Request $request){
        $post = $request->all();
        
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
            $dep->equipos_disponibles = isset($post["equipos_disponibles"])? $post["equipos_disponibles"] : null;
            $dep->updated_by = isset($post["usuario"])? $post["usuario"] : null;
            
            DB::beginTransaction();
            try{
                $dep->save();
            }
            catch (\Exception $e){
                DB::rollback();
                //$e->getMessage();
                return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ('.$e->getMessage().')']);
            }
            DB::commit();
            return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado"]);
        }
    }
}