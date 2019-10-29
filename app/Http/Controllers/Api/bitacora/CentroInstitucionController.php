<?php

namespace App\Http\Controllers\Api\Bitacora;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CentroInstitucionController extends Controller{

    /*public function index(Request $request){
		$post = $request->all();
        //$universidades = CentroInstitucion::all();
        $universidades= DB::select("SELECT ci.*
                                from centro_institucion ci
                                INNER JOIN centrosaplicacion ca ON (ci.id_centro_institucion = ca.centro_institucion_id)
                                INNER JOIN dependencias de ON (ca.id = de.centrosaplicacion_id)
                                INNER JOIN aplicaciones ap ON (de.id = ap.dependencia_id) WHERE ci. id_centro_institucion != 1000 GROUP BY ci.id_centro_institucion ORDER BY ci.nombre_institucion");

        return response()->json($universidades);
    }*/

    public function indexByIdRegion(Request $request){
        $post = $request->all();
        // $post["id_region"] = 13;

        $comunas = DB::select("SELECT  id_comuna
                            from core.comuna
                            where id_region = ".$post["id_region"]);
        $universidades = array();
        
        foreach ($comunas as $com) {
            $ues= DB::select("SELECT ins.id_institucion, ins.institucion
                            from infraestructura.institucion ins
                            INNER JOIN infraestructura.sede sd ON (sd.id_institucion = ins.id_institucion)
                            WHERE sd.id_comuna   = " . $com->id_comuna . " ORDER BY ins.institucion");

            if(sizeof($ues)>0){
                foreach ($ues as $u) {
                    $aux["id_centro_institucion"] = $u->id_institucion;
                    $aux["nombre_institucion"] = $u->institucion;
                    $universidades[] = $aux;
                }
            }
        }
        //Eliminar valores repetidos
        $universidades = array_values(array_unique($universidades, SORT_REGULAR));
        
        //ORDENAR
        foreach ($universidades as $clave => $valor) {
            $nombre[$clave] = $valor['nombre_institucion'];
            $id[$clave] = $valor['id_centro_institucion'];
        }
        array_multisort($nombre, SORT_ASC, $id, SORT_ASC, $universidades);

        return response()->json($universidades);
    }

   /* public function indexComplementariaByIdRegion(Request $request){
        $post = $request->all();
        // $post["id_region"] = 13;

        $comunas = DB::select("SELECT id
                            from comunas
                            where region_id = ".$post["id_region"]);
        $universidades = array();
        
        foreach ($comunas as $com) {
            $ues= DB::select("SELECT ci.*
                                from centro_institucion ci
                                INNER JOIN centrosaplicacion ca ON (ci.id_centro_institucion = ca.centro_institucion_id)
                                INNER JOIN dependencias de ON (ca.id = de.centrosaplicacion_id)
                                INNER JOIN aplicaciones ap ON (de.id = ap.dependencia_id) WHERE ci. id_centro_institucion != 1000 and ca.id_comuna= " . $com->id . " and ap.tiposaplicacion_id = 62 GROUP BY ci.id_centro_institucion ORDER BY ci.nombre_institucion");

            if(sizeof($ues)>0){
                foreach ($ues as $u) {
                    $aux["id_centro_institucion"] = $u->id_centro_institucion;
                    $aux["nombre_institucion"] = $u->nombre_institucion;
                    $universidades[] = $aux;
                }
            }
        }
        //Eliminar valores repetidos
        $universidades = array_values(array_unique($universidades, SORT_REGULAR));
        
        //ORDENAR
        foreach ($universidades as $clave => $valor) {
            $nombre[$clave] = $valor['nombre_institucion'];
            $id[$clave] = $valor['id_centro_institucion'];
        }
        array_multisort($nombre, SORT_ASC, $id, SORT_ASC, $universidades);

        return response()->json($universidades);
    }

    public function indexById(Request $request){
        $post = $request->all();

        $universidades = CentroInstitucion::all()->where("id_centro_institucion", $post["id_centro_institucion"]);

        return response()->json($universidades);
    }*/
}

