<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\RRHH\Persona;
use App\Models\RRHH\PersonaCargo;
use App\Models\Infraestructura\Zona;
use App\Models\Infraestructura\Institucion;
use App\Models\Core\Comuna;
use App\Models\Core\Usuario;
use App\Models\Core\TablaMaestra;
use App\Models\RRHH\Cargo;
use App\Models\RRHH\Capacitacion;
use App\Models\RRHH\CapacitacionPersona;
use App\Models\RRHH\CapacitacionPrueba;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use Maatwebsite\Excel\Facades\Excel;


class CapacitacionExcelController extends Controller
{
     
    public function __construct()
    {
        $this->fields = array();    
    }   

     public function descargaExcelCapacitacion(Request $request)
    {
        

		$personaP = DB::select("select 
								cp.id_capacitacion_persona, r.nombre as region, c.nombre as comuna, cap.fecha_hora, cap.lugar, 
								p.run, p.nombres, p.apellido_paterno, p.apellido_materno, p.telefono,p.email,  
								(CASE WHEN cp.asistencia = true THEN 'Asiste' else (CASE WHEN cp.asistencia is null THEN 'Sin información' else 'Ausente' END) END) as Asistencia, 
								(select puntaje from rrhh.capacitacion_prueba where prueba = 'Técnica' and id_capacitacion_persona = cp.id_capacitacion_persona) as \"Técnica\",
								(select puntaje from rrhh.capacitacion_prueba where prueba = 'Psicologica' and id_capacitacion_persona = cp.id_capacitacion_persona) as \"Sicológica\",
								(CASE WHEN cp.estado = true THEN 'Aprueba' else 'Rechazado' END) as Estado   
								from rrhh.persona as p, core.region as r, core.comuna as c, rrhh.capacitacion as cap, rrhh.capacitacion_persona as cp
								WHERE r.id_region = c.id_region
								AND c.id_comuna = p.id_comuna_postulacion
								AND cap.id_capacitacion = cp.id_capacitacion
								AND cp.id_persona = p.id_persona
								AND cp.borrado = false
								ORDER BY r.orden_geografico, c.nombre, cap.fecha_hora, cap.lugar, p.nombres");
		foreach($personaP as $index=>$personaPAux){
			$personaP[$index]->Técnica = (($personaP[$index]->Técnica == '') or ($personaP[$index]->Técnica == null)  or ($personaP[$index]->Técnica == 'null'))?0:$personaP[$index]->Técnica;
			$personaP[$index]->Sicológica = (($personaP[$index]->Sicológica == '') or ($personaP[$index]->Sicológica == null) or ($personaP[$index]->Sicológica == 'null'))?'Sin información':(($personaP[$index]->Sicológica == 1)?'Recomendado':'No recomendado');
		}
        
		$personaP = json_decode(json_encode($personaP),1);
		
		$cols = array_keys($personaP[0]);
		
		$export = new ExcelExport([$cols, $personaP]);

		return Excel::download($export, 'listadoFullCapacitacion ('.date('Y-m-d h:i:s').').xlsx');			

	}
}