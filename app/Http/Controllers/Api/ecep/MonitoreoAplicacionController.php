<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Infraestructura\Estimacion;

class MonitoreoAplicacionController extends Controller
{
     
    public function __construct()
    {
        $this->fields = array();    
    }   

	public function lista(Request $request){

        $regular1 = DB::select('SELECT estimacion.id_estimacion, comuna.id_comuna,  
                region.nombre as region, comuna.nombre as comuna,  provincia.nombre as provincia, estimacion.id_sede_ecep, estimacion.dia, estimacion.salas, estimacion.docentes                         
                
                FROM infraestructura.estimacion as estimacion
                left JOIN core.comuna comuna ON (estimacion.id_comuna = comuna.id_comuna)
     			left JOIN core.provincia provincia ON (comuna.id_provincia = provincia.id_provincia)
     			left JOIN core.region region ON (provincia.id_region = region.id_region)
                where estimacion.dia = 1
                and comuna.id_region = region.id_region
                order by region.orden_geografico, provincia.nombre, comuna.nombre');

       	$regular2 = DB::select('SELECT estimacion.id_estimacion, comuna.id_comuna,  
                region.nombre as region, comuna.nombre as comuna,  provincia.nombre as provincia, estimacion.id_sede_ecep, estimacion.dia, estimacion.salas, estimacion.docentes                         
                
                FROM infraestructura.estimacion as estimacion
                left JOIN core.comuna comuna ON (estimacion.id_comuna = comuna.id_comuna)
     			left JOIN core.provincia provincia ON (comuna.id_provincia = provincia.id_provincia)
     			left JOIN core.region region ON (provincia.id_region = region.id_region)
                where estimacion.dia = 2
                and comuna.id_region = region.id_region
                order by region.orden_geografico, provincia.nombre, comuna.nombre');

        $suma = DB::select('SELECT  SUM(estimacion.salas) as salas , SUM(estimacion.docentes) as docentes FROM infraestructura.estimacion as estimacion where estimacion.dia = 1');

        $suma2 = DB::select('SELECT  SUM(estimacion.salas) as salas , SUM(estimacion.docentes) as docentes FROM infraestructura.estimacion as estimacion where estimacion.dia = 2');

       	$datos['regular1'] = $regular1;
        $datos['sumas_regular1'] = $suma;
        $datos['regular2'] = $regular2;
        $datos['sumas_regular2'] = $suma2;
        return response()->json($datos);    
	}
}