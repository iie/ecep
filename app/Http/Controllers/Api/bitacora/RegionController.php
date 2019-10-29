<?php
namespace App\Http\Controllers\Api\Bitacora;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Core\Comuna;
use App\Models\Core\Region;
//use App\Models\Core\Dependencias;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class RegionController extends Controller{



   /* public function index(Request $request){
        $reg = DB::select("SELECT r.numero, r.nombre
                                from regiones r
                                INNER JOIN comunas co ON (r.id_region = co.region_id)
                                INNER JOIN centrosaplicacion ca ON (co.id = ca.id_comuna)
                                INNER JOIN dependencias de ON (ca.id = de.centrosaplicacion_id)
                                INNER JOIN aplicaciones ap ON (de.id = ap.dependencia_id)
                                where r.numero != '-1'
                                group by r.id order by r.id");
        return response()->json($reg);
    }*/

    public function indexComplementaria(Request $request){
        $reg = DB::select("SELECT r.numero as numero_region, r.nombre as nombre_region
                                from core.region r
                                INNER JOIN core.comuna co ON (r.id_region = co.id_region)
                                where r.numero != '-1'
                                group by r.id_region order by r.id_region");
        return response()->json($reg);


    }

    public function regionPorIdComuna(Request $request){
        $post = $request->all();

		$validacion = Validator::make($post, [
            'id_comuna_n' => 'int|required',
            'id_comuna_r' => 'int|required'
        ]);	
        
        if($validacion->fails()){
            return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $comuna_n = Comuna::find($post["id_comuna_n"]);
        $comuna_r = Comuna::find($post["id_comuna_r"]);
        if(!isset($comuna_n->id_comuna) || !isset($comuna_r->id_comuna)){
            return response()->json(array("respuesta"=>"error","descripcion"=>"El id de comuna no corresponde.")); 
        }
        $arr["id_region_nacimiento"] = $comuna_n->id_region;
        $arr["id_region_residencia"] = $comuna_r->id_region;
        
        return response()->json(array("respuesta"=>"OK", "descripcion" => $arr));
    }
}
    


