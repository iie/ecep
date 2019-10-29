<?php

namespace App\Http\Controllers\Api\Bitacora;
use Illuminate\Http\Request;
use App\Models\Infraestructura\Sede;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CentroAplicacionController extends Controller{

   /* public function index(Request $request){
        $sedes = CentroAplicacion::all();

        return response()->json($sedes);
    }*/

    public function indexById(Request $request){
        $post = $request->all();

        //$sedes = CentroAplicacion::where("centro_institucion_id", $post["centro_institucion_id"])->get();
        $ues= DB::select("SELECT sd.*
                            from infraestructura.sede sd
                            WHERE sd.id_institucion = " .$post["centro_institucion_id"]. " AND sd.id_sede in 
                            (select id_sede from infraestructura.laboratorio where (cumple = 1 or cumple = 2)) GROUP BY sd.id_sede ORDER BY sd.nombre");

                            
        
       /* for ($i=0; $i<count($ues); $i++) {
            $informacion= DB::select("SELECT c.nombre,  r.nombre
                                from core.comuna c
                                INNER JOIN core.region r ON (c.id_region = r.id_region) WHERE c.id_comuna = " .$ues[$i]->id_comuna . "");
           
        }*/

         $sedes = array();
        if(sizeof($ues)>0){
                foreach ($ues as $u) {
                    $aux["id_sede"] = $u->id_sede;
                    $aux["nombre_sede"] = $u->nombre;
                    $sedes[] = $aux;
                }
            }

        /* $sedes = array_values(array_unique($sedes, SORT_REGULAR));
        
        //ORDENAR
        foreach ($sedes as $clave => $valor) {
            $nombre[$clave] = $valor['nombre_sede'];
            $id_sede[$clave] = $valor['id_sede'];
        }
        array_multisort($nombre, SORT_ASC, $id_sede, SORT_ASC, $sedes);
            */
        return response()->json($sedes);
    }

    /*public function indexByIdComplementaria(Request $request){
        $post = $request->all();

        //$sedes = CentroAplicacion::where("centro_institucion_id", $post["centro_institucion_id"])->get();
        $sedes= DB::select("SELECT ca.*
                                from centrosaplicacion ca
                                INNER JOIN dependencias de ON (ca.id = de.centrosaplicacion_id)
                                INNER JOIN aplicaciones ap ON (de.id = ap.dependencia_id) WHERE ca.centro_institucion_id = " .$post["centro_institucion_id"]. " and ap.tiposaplicacion_id = 62
                                GROUP BY ca.id ORDER BY ca.nombre_sede");
        
        for ($i=0; $i<count($sedes); $i++) {
            $informacion= DB::select("SELECT c.nombre_comuna,  r.nombre_region
                                from comunas c
                                INNER JOIN regiones r ON (c.region_id = r.id) WHERE c.id = " .$sedes[$i]->id_comuna . "");
            $sedes[$i]->nombre_comuna =  $informacion[0]->nombre_comuna;
            $sedes[$i]->nombre_region =  $informacion[0]->nombre_region;
        }
        return response()->json($sedes);
    }*/

    public function saveSede(Request $request){
        $post = $request->all();

        // validamos que no falten parametros y sean del tipo deseado
        $validacion = Validator::make($post, [
            'id' => 'int|required',
        ]);

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422);
        }

        $sede = Sede::find($post["id"]);
        if (empty($sede)) {
            return response()->json(['resultado'=>'error','descripcion'=>'No se encuentra el id de sede']);
        }else{
            $sede->contacto_nombre = isset($post["nombre_contacto_inicial"])?$post["nombre_contacto_inicial"]:null;
            $sede->contacto_email = isset($post["correo_contacto_inicial"])? $post["correo_contacto_inicial"] : null;
            $sede->contacto_telefono = isset($post["telefono_movil_contacto_inicial"])? $post["telefono_movil_contacto_inicial"] : null;
            $sede->observacion = isset($post["observaciones"])? $post["observaciones"] : null;
            $sede->updated_by = isset($post["usuario"])? $post["usuario"] : null;

            DB::beginTransaction();
            try{
                $sede->save();
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
