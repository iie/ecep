<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\RRHH\Persona;
use App\Models\RRHH\PersonaCargo;
use App\Models\RRHH\PersonaArchivo;
use App\Models\Infraestructura\Institucion;
use App\Models\Infraestructura\Zona;
use App\Models\Core\TablaMaestra;
use App\Models\Core\Comuna;
use App\Models\Core\Region;
use App\Models\Core\Usuario;
use App\Models\RRHH\Cargo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

// use Maatwebsite\Excel\Facades\Excel;

require realpath(__DIR__ . '/../../../../..').'/vendor/phpmailer/phpmailer/src/Exception.php';
require realpath(__DIR__ . '/../../../../..').'/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require realpath(__DIR__ . '/../../../../..').'/vendor/phpmailer/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class PersonalController extends Controller
{
     
    public function __construct()
    {
        $this->fields = array();    
    }   


    public function descargaExcel(Request $request)
    {
        
		$post = $request->all();    

        $sexo = TablaMaestra::select('id_tabla_maestra','descripcion_larga')->where('discriminador','=','28')->get();
        foreach ($sexo as $s) {          
            $sexos[$s->id_tabla_maestra] = $s->descripcion_larga;
        }

        $estadoCivil =TablaMaestra::select('id_tabla_maestra','descripcion_larga')->where('discriminador','=','29')->get();
        foreach ($estadoCivil as $estado) {          
            $civil[$estado->id_tabla_maestra] = $estado->descripcion_larga;
        }

        $institucion = Institucion::select('institucion','id_institucion')->orderBy('institucion')->get();
        foreach ($institucion as $ins) {             
            $inst[$ins->id_institucion] = $ins->institucion;
        }

        $comunas = Comuna::get();
        foreach ($comunas as $com) {             
            $comuna[$com->id_comuna] = $com->nombre;
        }

        $personaP = DB::table('rrhh.persona')
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_postulacion','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->leftJoin('infraestructura.zona_region' , 'core.region.id_region','=','infraestructura.zona_region.id_region')
            ->leftJoin('infraestructura.zona' , 'infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
            ->select('rrhh.persona.*','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona.estado_proceso as estado', 'infraestructura.zona.nombre as nombre_zona')
            ->where('rrhh.persona.borrado','=', false)
            ->where('rrhh.persona.modificado','=',true)
            ->orderBy('infraestructura.zona.nombre','asc')
            ->orderBy('core.region.orden_geografico','asc')
            ->orderBy('core.comuna.nombre','asc')
			//->limit('100')
            ->get();

        foreach ($personaP as $index => $per) {
			$personaP[$index]->id_institucion = $personaP[$index]->id_institucion == null ? null : $inst[$personaP[$index]->id_institucion];
			$personaP[$index]->id_estado_civil = $personaP[$index]->id_estado_civil == null ? null : $civil[$personaP[$index]->id_estado_civil];
			$personaP[$index]->id_sexo = $personaP[$index]->id_sexo == null ? null : $sexos[$personaP[$index]->id_sexo];
			$personaP[$index]->id_comuna_nacimiento =  $personaP[$index]->id_comuna_nacimiento == null ? null : $comuna[$personaP[$index]->id_comuna_nacimiento];
			$personaP[$index]->id_comuna_residencia =  $personaP[$index]->id_comuna_residencia == null ? null : $comuna[$personaP[$index]->id_comuna_residencia];
        }
        
		$personaP = json_decode(json_encode($personaP),1);
		
		$cols = array_keys($personaP[0]);
		
		$export = new ExcelExport([$cols, $personaP]);

		return Excel::download($export, 'listadoFull ('.date('Y-m-d h:i:s').').xlsx');			
		// $t= "<table border='1'>";
		// $t.= "<tr>";
		// foreach($personaP[0] as $index=>$colsAux){
			// $t.= "<td>".trim($index)."</td>";
			// $colsArr[] = trim($index);
		// }
		// $t.= "</tr>";

		// foreach($personaP as $listadoCompletoAux){
			// $t.= "<tr>";
			// foreach($listadoCompletoAux as $valor){
				// $t.= "<td>".trim(str_replace(".",",",$valor))."</td>";
			// }	
			// $t.= "</tr>";
		// }
		// $t.= "</table>";
		
		//echo $t;
	}
    
	public function listaPostulantes(Request $request)
    {
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
        ]); 
        $sexo =TablaMaestra::select('id_tabla_maestra','descripcion_larga') 
            ->where('discriminador','=','28')->get();
        foreach ($sexo as $s) {          
            $sexos[$s->id_tabla_maestra] = $s->descripcion_larga;
        }

        $estadoCivil =TablaMaestra::select('id_tabla_maestra','descripcion_larga') 
            ->where('discriminador','=','29')->get();
        foreach ($estadoCivil as $estado) {          
            $civil[$estado->id_tabla_maestra] = $estado->descripcion_larga;
        }

        $institucion = Institucion::select('institucion','id_institucion')->orderBy('institucion')->get();
        foreach ($institucion as $ins) {             
            $inst[$ins->id_institucion] = $ins->institucion;
        }

        $comunas = Comuna::get();
        foreach ($comunas as $com) {             
            $comuna[$com->id_comuna] = $com->nombre;
        }

        if($post['id_tipo_usuario'] == 1051){
            $listaZona = DB::table('infraestructura.zona')
                    ->get();
            $zonas = array();
            foreach($listaZona as $listaZonaAux){
                $zonas[] = $listaZonaAux->id_zona;
            }

        }else if($post['id_cargo'] == 1003){
            $cargo = DB::table('rrhh.persona_cargo')
                ->leftJoin('infraestructura.zona','rrhh.persona_cargo.id_persona_cargo','=','infraestructura.zona.id_coordinador')
                ->where('rrhh.persona_cargo.id_persona',$post['id_persona'])
                ->where('rrhh.persona_cargo.id_cargo',$post['id_cargo'])
                ->get();
            foreach($cargo as $cargoAux){
                $zonas[] = $cargoAux->id_zona;
            }
        }else if($post['id_cargo'] == 1004){
            $cargo = DB::table('rrhh.persona_cargo')
                ->leftJoin('infraestructura.zona_region','rrhh.persona_cargo.id_persona_cargo','=','infraestructura.zona_region.id_coordinador')
                ->leftJoin('infraestructura.zona','infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
                ->where('rrhh.persona_cargo.id_persona',$post['id_persona'])
                ->where('rrhh.persona_cargo.id_cargo',$post['id_cargo'])
                ->get();

            $zonas = array();
            foreach($cargo as $cargoAux){
                $zonas[] = $cargoAux->id_zona;
            }   
        }  
// and zona.id_zona in (".implode($zonas,",").") ) 
        $personaP = Persona::
            //->join('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            //->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            leftJoin('core.comuna' , 'rrhh.persona.id_comuna_postulacion','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->leftJoin('infraestructura.zona_region' , 'core.region.id_region','=','infraestructura.zona_region.id_region')
            ->leftJoin('infraestructura.zona' , 'infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
            ->leftJoin('rrhh.persona_asignacion' , 'rrhh.persona.id_persona','=','rrhh.persona_asignacion.id_persona')
            ->leftJoin('rrhh.cargo' , 'rrhh.persona_asignacion.id_cargo','=','rrhh.cargo.id_cargo')
            ->select('rrhh.persona.*','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona.estado_proceso as estado',
                    'infraestructura.zona.nombre as nombre_zona','rrhh.cargo.nombre_rol')
            //->where('rrhh.cargo.id_cargo','!=',1003)
            //->where('rrhh.cargo.id_cargo','!=',1004)
            ->whereIn('infraestructura.zona.id_zona',$zonas)
            ->where('rrhh.persona.borrado','=', false)
            ->where('rrhh.persona.modificado','=',true)
            ->get();

        foreach ($personaP as $index => $per) {
            $personaP[$index]->id_institucion = $personaP[$index]->id_institucion == null ? null : $inst[$personaP[$index]->id_institucion];
            $personaP[$index]->id_estado_civil = $personaP[$index]->id_estado_civil == null ? null : $civil[$personaP[$index]->id_estado_civil];
            $personaP[$index]->id_sexo = $personaP[$index]->id_sexo == null ? null : $sexos[$personaP[$index]->id_sexo];
            $personaP[$index]->id_comuna_nacimiento =  $personaP[$index]->id_comuna_nacimiento == null ? null : $comuna[$personaP[$index]->id_comuna_nacimiento];
            $personaP[$index]->id_comuna_residencia =  $personaP[$index]->id_comuna_residencia == null ? null : $comuna[$personaP[$index]->id_comuna_residencia];
        }


        $columns=array(
            0=> "nro",
            1=> "nombre_zona",
            2=> "region",
            3=> "comuna",
            4=> "run",
            5=> "nombres",
            6=> "apellido_paterno",
            7=> "apellido_materno",
            8=> "nivel_estudios",
            9=> "estado",
            10=> "nombre_rol",
            11=> "id_persona",
            12=> "deserta"
        );

        $totalData = count($personaP);
        $limit = $request->input('length');
        $start = $request->input('start');
        $order = $columns[$request->input('order.0.column')];
        $dir = $request->input('order.0.dir');
        
        $searchCol1 =$request->input("columns.1.search.value");
        $searchCol2 =$request->input("columns.2.search.value");
        $searchCol3 =$request->input("columns.3.search.value");
        $searchCol9 =$request->input("columns.9.search.value");
        $searchCol10 =$request->input("columns.10.search.value");
        $quitar = array("$", "^");
        $searchCol1 = str_replace($quitar, "", $searchCol1);
        $searchCol2 = str_replace($quitar, "", $searchCol2);
        $searchCol3 = str_replace($quitar, "", $searchCol3);
        $searchCol9 = str_replace($quitar, "", $searchCol9);
        $searchCol10 = str_replace($quitar, "", $searchCol10);
  
        if(empty($request->input('search.value')) && $searchCol1 == '' && $searchCol2 == '' && 
            $searchCol3 == '' && $searchCol9 == '' && $searchCol10 == ''){

            if($order == 'nro'){
                $post = Persona::leftJoin('core.comuna' , 'rrhh.persona.id_comuna_postulacion','=','core.comuna.id_comuna')
                ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
                ->leftJoin('infraestructura.zona_region' , 'core.region.id_region','=','infraestructura.zona_region.id_region')
                ->leftJoin('infraestructura.zona' , 'infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
                ->leftJoin('rrhh.persona_asignacion' , 'rrhh.persona.id_persona','=','rrhh.persona_asignacion.id_persona')
                ->leftJoin('rrhh.cargo' , 'rrhh.persona_asignacion.id_cargo','=','rrhh.cargo.id_cargo')
                ->select('rrhh.persona.*','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona.estado_proceso as estado',
                        'infraestructura.zona.nombre as nombre_zona','rrhh.cargo.nombre_rol')
                ->whereIn('infraestructura.zona.id_zona',$zonas)
                ->where('rrhh.persona.borrado','=', false)
                ->where('rrhh.persona.modificado','=',true)
                ->offset($start)
                ->limit($limit)
                ->orderBy('infraestructura.zona.nombre','asc')
                ->orderBy('core.region.orden_geografico','asc')
                ->orderBy('core.comuna.nombre','asc')
                ->orderBy('rrhh.persona.nombres','asc')
                ->orderBy('rrhh.persona.apellido_paterno','asc')
                ->get();
            }else{
                $post = Persona::leftJoin('core.comuna' , 'rrhh.persona.id_comuna_postulacion','=','core.comuna.id_comuna')
                ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
                ->leftJoin('infraestructura.zona_region' , 'core.region.id_region','=','infraestructura.zona_region.id_region')
                ->leftJoin('infraestructura.zona' , 'infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
                ->leftJoin('rrhh.persona_asignacion' , 'rrhh.persona.id_persona','=','rrhh.persona_asignacion.id_persona')
                ->leftJoin('rrhh.cargo' , 'rrhh.persona_asignacion.id_cargo','=','rrhh.cargo.id_cargo')
                ->select('rrhh.persona.*','rrhh.persona.run as run','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona.estado_proceso as estado',
                        'infraestructura.zona.nombre as nombre_zona','rrhh.cargo.nombre_rol')
                ->whereIn('infraestructura.zona.id_zona',$zonas)
                ->where('rrhh.persona.borrado','=', false)
                ->where('rrhh.persona.modificado','=',true)
                ->offset($start)
                ->limit($limit)
                ->orderBy($order,$dir)
                ->get();
            }
             

            $totalFiltered =  count($personaP);
            
        }else{
            $sql = "select rrhh.persona.*, core.comuna.nombre as comuna, core.region.nombre as region, rrhh.persona.estado_proceso as estado, infraestructura.zona.nombre as nombre_zona, rrhh.cargo.nombre_rol, rrhh.persona.deserta 
                        from rrhh.persona 
                        left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
                        left join core.region on core.comuna.id_region = core.region.id_region 
                        left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region 
                        left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona 
                        left join rrhh.persona_asignacion on rrhh.persona.id_persona = rrhh.persona_asignacion.id_persona 
                        left join rrhh.cargo on rrhh.persona_asignacion.id_cargo = rrhh.cargo.id_cargo 
                        where rrhh.persona.borrado = false and rrhh.persona.modificado = true and infraestructura.zona.id_zona in (".implode($zonas,",").")";

            if($searchCol1 !=  ''){

                     $sql .= " and infraestructura.zona.nombre = '".$searchCol1."'" ;

            }
            if($searchCol2 !=  ''){
             
                 $sql .= " and core.region.nombre = '".$searchCol2."'";
                 
            }
            if($searchCol3 !=  ''){
           
                 $sql .= " and core.comuna.nombre = '".$searchCol3."'";

            }
            if($searchCol9 !=  ''){
                if($searchCol9 == 'desertó'){
                    $sql .= " and rrhh.persona.deserta = true ";
                }else{
                    $sql .= " and rrhh.persona.estado_proceso = '".strtolower($searchCol9)."'";
                }

            }
            if($searchCol10 !=  ''){
           
                 $sql .= " and rrhh.cargo.nombre_rol = '".$searchCol10."'";

            }
           
            if(!empty($request->input('search.value'))){
      
                $search = $request->input('search.value');


                $sql .= " and rrhh.persona.nombres ilike '%{$search}%'";
                $sql .= " or rrhh.persona.apellido_paterno ilike '%{$search}%'";
                $sql .= " or rrhh.persona.apellido_materno ilike '%{$search}%'";
                $sql .= " or rrhh.persona.run ilike  '%{$search}%'";

            }
 
              $sql .= " order by ".$order." ". $dir." limit ".$limit." offset ".$start;
      /*          $sql .= " order by infraestructura.zona.nombre asc, core.region.orden_geografico asc, core.comuna.nombre asc,rrhh.persona.nombres asc, rrhh.persona.apellido_paterno asc, ".$order." ". $dir." limit ".$limit." offset ".$start;*/
              $post = DB::select($sql);
 
              $totalFiltered = count($post);

        }



        $data = array();

            if($post ){
                foreach ($post as $r) {
                    $nestedData['nombre_zona'] = $r->nombre_zona;
 
                    $nestedData['region'] = $r->region;
                    $nestedData['comuna'] = $r->comuna;

                    $nestedData['run'] = $r->run;
                    $nestedData['nombres'] = $r->nombres;
                    $nestedData['apellido_paterno'] = $r->apellido_paterno;
                    $nestedData['apellido_materno'] = $r->apellido_materno;
                    $nestedData['nivel_estudios'] = $r->nivel_estudios;
                    $nestedData['estado'] = $r->estado;
                    $nestedData['id_persona'] = $r->id_persona;
                    $nestedData['nombre_rol'] = $r->nombre_rol;
                    $nestedData['deserta'] = $r->deserta;

                    $data [] =$nestedData;
                }

            }

        $json_data = array(
            "draw" => intval($request->input('draw')),
            "recordsTotal" => intval($totalData),
            "recordsFiltered"=> intval($totalFiltered),
            "data"=> $data
        );
        return json_encode($json_data);

        arreglo($personaP );
    }

    public function filtros(Request $request){

        $zonas = Zona::orderBy('id_zona')->get();
        $regiones = Region::orderBy('orden_geografico')->get();
        /*$comunas = Comuna::leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->select('core.comuna.*')
           // ->orderBy('core.region.orden_geografico','asc')
            ->orderBy('core.comuna.nombre', 'asc')->get();*/

        $comunas = DB::select("SELECT co.id_comuna, co.nombre
                        from core.region r
                        INNER JOIN core.comuna co ON (r.id_region = co.id_region)
                        where r.numero != '-1'
                        and co.id_comuna in (select id_comuna from infraestructura.estimacion)
                        order by r.orden_geografico, co.nombre");

        $datos['zonas'] = $zonas;
        $datos['regiones'] = $regiones;
        $datos['comunas'] = $comunas ;
        return response()->json($datos);    

    }

    public function lista(Request $request)
    {
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }
        $sexo =TablaMaestra::select('id_tabla_maestra','descripcion_larga') 
            ->where('discriminador','=','28')->get();
        foreach ($sexo as $s) {          
            $sexos[$s->id_tabla_maestra] = $s->descripcion_larga;
        }

        $estadoCivil =TablaMaestra::select('id_tabla_maestra','descripcion_larga') 
            ->where('discriminador','=','29')->get();
        foreach ($estadoCivil as $estado) {          
            $civil[$estado->id_tabla_maestra] = $estado->descripcion_larga;
        }

        $rol = Cargo::select('id_cargo','nombre_rol')->orderBy('nombre_rol','asc')->get();

        $institucion = Institucion::select('institucion','id_institucion')->orderBy('institucion')->get();
        foreach ($institucion as $ins) {             
            $inst[$ins->id_institucion] = $ins->institucion;
        }

        $reg = DB::select("SELECT r.numero as numero_region, r.nombre as nombre_region , co.id_comuna, co.nombre
                        from core.region r
                        INNER JOIN core.comuna co ON (r.id_region = co.id_region)
                        where r.numero != '-1'
                       order by r.orden_geografico, co.nombre");

        foreach ($reg as $key => $value) {
            $listaAnidada[$value->numero_region][] = $value;
        }

        foreach ($listaAnidada as $id_region => $comunas) {
            $region["id_region"]  = $comunas[0]->numero_region;
            $region["nombre"]  = $comunas[0]->nombre_region;
            $_comunas = array();
            foreach ($comunas as $value) {
                $_comunas[] = $value;
            }
            $region["comunas"]  = $_comunas;
            $listaFinal[] = $region;
        }

        $regPostulacion = DB::select("SELECT r.numero as numero_region, r.nombre as nombre_region , co.id_comuna, co.nombre
                        from core.region r
                        INNER JOIN core.comuna co ON (r.id_region = co.id_region)
                        where r.numero != '-1'
                        and co.id_comuna in (select id_comuna from infraestructura.estimacion)
                        order by r.orden_geografico, co.nombre");

        foreach ($regPostulacion as $key => $value) {
            $listaAnidadaPostulacion[$value->numero_region][] = $value;
        }

        foreach ($listaAnidadaPostulacion as $id_region => $comunas) {
            $region2["id_region"]  = $comunas[0]->numero_region;
            $region2["nombre"]  = $comunas[0]->nombre_region;
            $_comunas = array();
            foreach ($comunas as $value) {
                $_comunas[] = $value;
            }
            $region2["comunas"]  = $_comunas;
            $listaFinalPostulante[] = $region2;
        }

        $comunas = Comuna::get();
        foreach ($comunas as $com) {             
            $comuna[$com->id_comuna] = $com->nombre;
        }
        $personaP = DB::table('rrhh.persona')
            //->join('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            //->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('rrhh.persona_asignacion' , 'rrhh.persona.id_persona','=','rrhh.persona_asignacion.id_persona')
            ->leftJoin('rrhh.cargo' , 'rrhh.persona_asignacion.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_postulacion','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->leftJoin('infraestructura.zona_region' , 'core.region.id_region','=','infraestructura.zona_region.id_region')
            ->leftJoin('infraestructura.zona' , 'infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
            ->select('rrhh.persona.id_persona','rrhh.persona.run','rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno',
                'rrhh.persona.email','rrhh.persona.telefono','rrhh.persona.nivel_estudios','rrhh.persona.deserta','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona.estado_proceso as estado',
                    'infraestructura.zona.nombre as nombre_zona','rrhh.persona_asignacion.id_persona_asignacion','rrhh.cargo.nombre_rol')
            //->where('rrhh.cargo.id_cargo','!=',1003)
            //->where('rrhh.cargo.id_cargo','!=',1004)
            //->where('rrhh.cargo.id_cargo','!=',13)
            ->where('rrhh.persona.borrado','=', false)
            ->where('rrhh.persona.modificado','=',true)
            //->where('rrhh.persona_cargo.borrado','=', false)
            ->orderBy('infraestructura.zona.nombre','asc')
            ->orderBy('core.region.orden_geografico','asc')
            ->orderBy('core.comuna.nombre','asc')
            ->orderBy('rrhh.persona.nombres','asc')
            ->orderBy('rrhh.persona.apellido_paterno','asc')
            ->get();


		// $personaPTotal = DB::select("SELECT created_at, id_persona FROM rrhh.persona WHERE id_persona in (
											// SELECT rrhh.persona.id_persona
											// FROM rrhh.persona
											// INNER JOIN rrhh.persona_cargo ON rrhh.persona_cargo.id_persona = rrhh.persona.id_persona
											// INNER JOIN rrhh.cargo ON rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo
											// INNER JOIN core.comuna ON rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna
											// INNER JOIN core.region ON core.comuna.id_region = core.region.id_region 
											// WHERE rrhh.persona.modificado = TRUE 
											// AND rrhh.persona.borrado = FALSE)
											// AND rrhh.persona.id_comuna_postulacion in (SELECT
											// comuna.id_comuna
											// FROM core.region as region, core.comuna as comuna, infraestructura.estimacion as sede
											// WHERE region.id_region =  comuna.id_region AND sede.id_comuna = comuna.id_comuna)
											// ORDER BY created_at desc");
											
		// foreach($personaPTotal as $personaPTotalAux){
			 // $rrhh_Final[] = $personaPTotalAux->id_persona;
		// }		
		
		
     /*   foreach ($personaP as $index => $per) {
			//if(in_array($personaP[$index]->id_persona, $rrhh_Final)){
				$personaP[$index]->id_institucion = $personaP[$index]->id_institucion == null ? null : $inst[$personaP[$index]->id_institucion];
				$personaP[$index]->id_estado_civil = $personaP[$index]->id_estado_civil == null ? null : $civil[$personaP[$index]->id_estado_civil];
				$personaP[$index]->id_sexo = $personaP[$index]->id_sexo == null ? null : $sexos[$personaP[$index]->id_sexo];
				$personaP[$index]->id_comuna_nacimiento =  $personaP[$index]->id_comuna_nacimiento == null ? null : $comuna[$personaP[$index]->id_comuna_nacimiento];
				$personaP[$index]->id_comuna_residencia =  $personaP[$index]->id_comuna_residencia == null ? null : $comuna[$personaP[$index]->id_comuna_residencia];
        }*/

        $cZonal = DB::table('rrhh.persona')
        	->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_residencia','=','core.comuna.id_comuna')
            ->leftJoin('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('infraestructura.zona' , 'rrhh.persona_cargo.id_persona_cargo','=','infraestructura.zona.id_coordinador')   
            /*->leftJoin('infraestructura.zona_region' , 'infraestructura.zona.id_zona','=','infraestructura.zona_region.id_zona') */     
            /*->leftJoin('core.region' , 'infraestructura.zona_region.id_region','=','core.region.id_region')*/
            ->select('rrhh.persona.id_persona', 'rrhh.persona.id_comuna_residencia','rrhh.persona.run','rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.email','rrhh.persona.telefono',
			'rrhh.persona.estado_proceso as estado',/*'rrhh.persona_cargo.id_persona_cargo','rrhh.persona_cargo.estado',*/'rrhh.cargo.nombre_rol','infraestructura.zona.id_zona','infraestructura.zona.nombre as nombre_zona','core.comuna.nombre as comuna')
            ->where('rrhh.persona_cargo.id_cargo','=',1003)
            ->where('rrhh.persona_cargo.borrado','=',false)
            ->where('rrhh.persona.borrado','=', false)
            ->orderBy('infraestructura.zona.id_zona','asc')
            /*->orderBy('core.region.orden_geografico','asc')*/
            ->get();

        $cRegional = DB::table('rrhh.persona')
            ->leftJoin('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('infraestructura.zona_region' , 'rrhh.persona_cargo.id_persona_cargo','=','infraestructura.zona_region.id_coordinador')
            ->leftJoin('infraestructura.zona' , 'infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')   
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_residencia','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'infraestructura.zona_region.id_region','=','core.region.id_region')
            ->select('rrhh.persona.id_persona', 'rrhh.persona.id_comuna_residencia','rrhh.persona.run','rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.email','rrhh.persona.telefono','core.comuna.nombre as comuna','core.region.nombre as region',
			'rrhh.persona.estado_proceso as estado',/*'rrhh.persona_cargo.id_persona_cargo','rrhh.persona_cargo.estado',*/'rrhh.cargo.nombre_rol','infraestructura.zona.id_zona','infraestructura.zona.nombre as zona_nombre')
            ->where('rrhh.persona_cargo.id_cargo','=',1004)
            ->where('rrhh.persona_cargo.borrado','=',false)
            ->where('rrhh.persona.borrado','=', false)
            ->orderBy('core.region.orden_geografico','asc')
            ->get();

        $cCentro = DB::table('rrhh.persona')
            ->leftJoin('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('infraestructura.centro_operaciones' , 'rrhh.persona_cargo.id_persona_cargo','=','infraestructura.centro_operaciones.id_encargado') 
            ->leftJoin('infraestructura.zona_region' , 'infraestructura.centro_operaciones.id_zona_region','=','infraestructura.zona_region.id_zona_region')  
            ->leftJoin('core.comuna' , 'infraestructura.centro_operaciones.id_comuna','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'infraestructura.zona_region.id_region','=','core.region.id_region')
            ->select('rrhh.persona.id_persona', 'rrhh.persona.id_comuna_residencia','rrhh.persona.run','rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.email','rrhh.persona.telefono','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona.estado_proceso as estado',/*'rrhh.persona_cargo.id_persona_cargo','rrhh.persona_cargo.estado'*/'rrhh.cargo.nombre_rol')
            ->where('rrhh.persona_cargo.id_cargo','=',13)
            ->where('rrhh.persona_cargo.borrado','=',false)
            ->where('rrhh.persona.borrado','=', false)
            ->orderBy('core.region.orden_geografico','asc')
            ->get();

         $jefeSede = DB::table('rrhh.persona')
            ->leftJoin('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            //->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('infraestructura.estimacion' , 'rrhh.persona_cargo.id_persona_cargo','=','infraestructura.estimacion.id_jefe_sede') 
            ->leftJoin('infraestructura.sede' , 'infraestructura.estimacion.id_sede','=','infraestructura.sede.id_sede') 
             
            ->leftJoin('core.comuna' , 'infraestructura.estimacion.id_comuna','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->leftJoin('infraestructura.zona_region' , 'core.region.id_region','=','infraestructura.zona_region.id_zona_region')
            ->leftJoin('infraestructura.zona' , 'infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
            ->select('rrhh.persona.id_persona', 'rrhh.persona.id_comuna_residencia','rrhh.persona.run','rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.email','rrhh.persona.telefono','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona.estado_proceso as estado','infraestructura.sede.nombre as establecimiento', 'infraestructura.zona.nombre as zona')
            ->where('rrhh.persona_cargo.id_cargo','=',1010)
            ->where('rrhh.persona_cargo.borrado','=',false)
            ->where('rrhh.persona.borrado','=', false)
            ->orderBy('core.region.orden_geografico','asc')
            ->get();

        $datos['personal_postulacion'] = $personaP;
        $datos['coordinador_zonal'] = $cZonal;
        $datos['coordinador_regional'] = $cRegional;
        $datos['coordinador_centro'] = $cCentro;
        $datos['jefe_sede'] = $jefeSede;
        $datos['sexo'] = $sexo;
        $datos['estadoCivil'] = $estadoCivil;
        $datos['rol'] = $rol;
        $datos['regiones'] = $listaFinal;
        $datos['regiones_postulante'] = $listaFinalPostulante;
        $datos['institucion'] = $institucion ;
        return response()->json($datos);    
    }

    public function guardar(Request $request){

        $post = $request->all();

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_persona' => 'required|int',
            'id_persona_cargo' => 'required|int',
    
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }
     
        if($post['id_persona'] == -1){
            $persona = new persona;
        }else{
            $persona = Persona::where("rrhh.persona.id_persona", $post["id_persona"])->first();
        }
         
        $persona->run = $post['run'];
        $persona->nombres = $post['nombres'];
        $persona->apellido_paterno = $post['apellido_paterno'];
        $persona->apellido_materno = $post['apellido_materno'];
        $persona->email = $post['email'];
        $persona->telefono = $post['telefono'];

        $persona->id_comuna_nacimiento = $post['id_comuna_nacimiento'];
        $persona->id_sexo = $post['id_sexo'];
        $persona->id_estado_civil = $post['id_estado_civil'];
        $persona->id_institucion = $post['id_institucion'];
        $persona->id_comuna_residencia = $post['id_comuna_residencia'];
 
        $persona->nacionalidad = $post['nacionalidad'];
        $persona->domicilio = $post['domicilio'];
        $persona->domicilio_sector = $post['domicilio_sector'];
        $persona->fecha_nacimiento = $post['fecha_nacimiento'];
        $persona->nivel_estudios = $post['nivel_estudios'];
        $persona->profesion = $post['profesion'];
        $persona->banco_nro_cuenta = $post['banco_nro_cuenta'];
        $persona->banco_tipo_cuenta = $post['banco_tipo_cuenta'];
        $persona->banco_nombre = $post['banco_nombre'];
        $persona->otra_nacionalidad = $post['otra_nacionalidad'];
        $persona->id_comuna_postulacion = $post['id_comuna_postulacion'];

        if(isset($post['cargos_postulante'])){
            foreach ($post['cargos_postulante'] as $cargos) {
                $personaCargo = PersonaCargo::where('id_persona',$post['id_persona'])
                                ->where('id_cargo',$cargos['id_cargo'])
                                ->first();
 
                if(isset($personaCargo)){

         

                    if($persona->estado_proceso != 'contratado'){
                        if($cargos['cargo'] == 1){
                            $personaCargo->borrado = false;
                        }else{
                            $personaCargo->borrado = true;
                        }
   
                        try{
                            $personaCargo->save();
                        }catch (\Exception $e){
                            DB::rollback();
                            return response()->json(['resultado'=>'error','descripcion'=>'Error al modificar el cargo. ()'. $e->getMessage()]);
                        }
                    }
                }else if($cargos['cargo'] == 1){
                    $newPersonaCargo = new PersonaCargo;
                    $newPersonaCargo->id_persona = $post['id_persona'];
                    $newPersonaCargo->id_cargo = $cargos['id_cargo'];

                    try{
                        $newPersonaCargo->save();
                    }catch (\Exception $e){
                        DB::rollback();
                        return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar Nuevo Cargo. ()'. $e->getMessage()]);
                    }
                }
                /* 

                $personaCargo->id_persona = $persona->id_persona;
                $personaCargo->id_cargo = $cargo;
                $personaCargo->save(); */
            }
        }
              
        DB::beginTransaction();
        try{
            $persona->save(); 
            if($persona->id_usuario != null){

                $usuario = Usuario::where("id_usuario", $post["usuario_id"])->first();
                $usuario->usuario = isset($post['usuario']) ? $post['usuario'] : $usuario->usuario;
                $usuario->contrasena = isset($post['contrasena']) ? md5($post['contrasena']) : $usuario->contrasena;
                if(isset($post['id_cargo'])){
                    foreach ($post['id_cargo'] as $cargo) {
     
                        if($cargo == 1008){
                            //Tipo Relator
                            $usuario->id_tipo_usuario = 1052;
                        }else{
                            $usuario->id_tipo_usuario = 28;
                        }                     
                    }
                }
                   
                $usuario->save(); 
            }else{
                $usuario = new Usuario;
                $usuario->usuario = isset($post['usuario']) ? $post['usuario'] : null;
                $usuario->contrasena = isset($post['contrasena']) ? md5($post['contrasena']) : null;
                if(isset($post['id_cargo'])){
                    foreach ($post['id_cargo'] as $cargo) {
                        if($cargo == 1008){
                            //Tipo Relator
                            $usuario->id_tipo_usuario = 1052;
                        }else{
                            $usuario->id_tipo_usuario = 28;
                        }                     
                    }
                }
                $usuario->save(); 

                $persona->id_usuario = $usuario->id_usuario; 
                $persona->save(); 
            }

            /*if($post['id_persona_cargo'] != -1){

                $personaCargo = PersonaCargo::where('id_persona_cargo',$post['id_persona_cargo'])->first();
                //$personaCargo->id_cargo = isset($post['id_cargo']) ? $personaCargo->id_cargo :  $post['id_cargo'] ;
                //$personaCargo->estado = $post['estado'];
                $personaCargo->save(); 
            }else */
            if($post['id_persona_cargo'] == -1 && isset($post['id_cargo'])){

                foreach ($post['id_cargo'] as $cargoAux) {
                    if($cargoAux != 1008){
                        $personaCargo = new PersonaCargo;
                        $personaCargo->id_persona = $persona->id_persona;
                        $personaCargo->id_cargo = $cargoAux;
                        $personaCargo->save(); 
                    }                   
                }
            }
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
        }

        DB::commit();
        return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
    }

    public function modificar(Request $request){

        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_persona' => 'required|integer', 
            //'id_persona_cargo' => 'required|integer',   
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $comunas = Comuna::get();
        foreach ($comunas as $com) {             
            $comuna[$com->id_comuna] = $com->id_region;
        }

        /*$persona = Persona::leftJoin('core.usuario','rrhh.persona.id_usuario','=','core.usuario.id_usuario')
            ->leftJoin('rrhh.persona_cargo','rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->where("rrhh.persona.id_persona", $post["id_persona"])
            ->where("rrhh.persona_cargo.id_persona_cargo",$post["id_persona_cargo"])
            ->select('rrhh.persona.*','core.usuario.usuario','core.usuario.id_usuario')
            ->first();*/

        $persona = Persona::leftJoin('core.usuario','rrhh.persona.id_usuario','=','core.usuario.id_usuario')
            ->where("rrhh.persona.id_persona", $post["id_persona"])
            ->select('rrhh.persona.*','core.usuario.usuario','core.usuario.id_usuario')
            ->first();

        if(!empty($persona)){
            $persona['id_region_nacimiento'] = $persona->id_comuna_nacimiento == null ? null : $comuna[$persona->id_comuna_nacimiento];
            $persona['id_region_residencia'] = $persona->id_comuna_residencia == null ? null : $comuna[$persona->id_comuna_residencia];
            $persona['id_region_postulacion'] = $persona->id_comuna_postulacion == null ? null : $comuna[$persona->id_comuna_postulacion];
            $persona['cargos'] = PersonaCargo::where('id_persona',$post["id_persona"])
                                    ->where('borrado',false)
                                    ->select('id_persona_cargo','id_cargo')
                                    ->get();
        }
 
        if (empty($persona)) {
            return response()->json(['resultado'=>'error','descripcion'=>'No se encuentra la Persona']);
        }else{
            return response()->json($persona);  
        }
    }
    
    public function obtenerPersona(Request $request){

        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'run' => 'required',    
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $comunas = Comuna::get();
        foreach ($comunas as $com) {             
            $comuna[$com->id_comuna] = $com->id_region;
        }


        $persona = Persona::leftJoin('core.usuario','rrhh.persona.id_usuario','=','core.usuario.id_usuario')
            ->leftJoin('rrhh.persona_cargo','rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->where('rrhh.persona.run', $post['run'])
            ->select('rrhh.persona.*','rrhh.persona_cargo.id_persona_cargo','rrhh.persona_cargo.id_cargo',/*'rrhh.persona_cargo.estado',*/'core.usuario.usuario','core.usuario.id_usuario')
            ->first();
        if(!empty($persona)){
            if($persona->id_persona_cargo == null){
                $persona['id_region_nacimiento'] = $persona->id_comuna_nacimiento == null ? null : $comuna[$persona->id_comuna_nacimiento];
                $persona['id_region_residencia'] = $persona->id_comuna_residencia == null ? null : $comuna[$persona->id_comuna_residencia];
            }else{
                return response()->json(['resultado'=>'existe','descripcion'=>'La Persona ya tienes Cargos asignados']);
            }
             
        }
        if (empty($persona)) {
            return response()->json(['resultado'=>'error','descripcion'=>'No se encuentra la Persona']);
        }else{
            return response()->json($persona);  
        }
    }

    public function obtenerJefeSede(Request $request){

        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'run' => 'required',    
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $comunas = Comuna::get();
        foreach ($comunas as $com) {             
            $comuna[$com->id_comuna] = $com->id_region;
        }

        $capacitado = Persona::where('rrhh.persona.run', $post['run'])
            ->select('rrhh.persona.estado_proceso')
            ->first();

        if($capacitado->estado_proceso != 'capacitado'){
            return response()->json(['resultado'=>'existe','descripcion'=>'La Persona no ha sido Capacitada']);
        }

        $persona = Persona::leftJoin('core.usuario','rrhh.persona.id_usuario','=','core.usuario.id_usuario')
            ->leftJoin('rrhh.capacitacion_persona','rrhh.persona.id_persona','=','rrhh.capacitacion_persona.id_persona')
            ->where('rrhh.persona.run', $post['run'])
            ->where('rrhh.capacitacion_persona.estado', true)
            ->select('rrhh.persona.id_persona','rrhh.persona.run','rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.email','rrhh.persona.telefono','rrhh.persona.nivel_estudios','rrhh.persona.profesion','rrhh.persona.id_comuna_postulacion','rrhh.persona.estado_proceso','rrhh.capacitacion_persona.id_capacitacion_persona','rrhh.capacitacion_persona.estado')
            ->first();

        if(!empty($persona)){

            $personaCargo = PersonaCargo::where('id_persona', $persona->id_persona)
                ->where('id_cargo', 1010)->first();
    
             
            if(!empty($personaCargo)){
                return response()->json(['resultado'=>'existe','descripcion'=>'La Persona ya es Jefe de Sede']);
            }

            $pruebas = DB::select("SELECT rrhh.capacitacion_prueba.*, rrhh.capacitacion_persona.id_capacitacion_persona
                    FROM rrhh.capacitacion_prueba, rrhh.capacitacion_persona
                    where rrhh.capacitacion_prueba.id_capacitacion_persona = rrhh.capacitacion_persona.id_capacitacion_persona and rrhh.capacitacion_persona.id_capacitacion_persona = ".$persona->id_capacitacion_persona."
                    order by rrhh.capacitacion_prueba.prueba asc");

            if(count($pruebas) != 2){
                return response()->json(['resultado'=>'existe','descripcion'=>'Faltan pruebas por evaluar']);
            }

            foreach ($pruebas as $key => $value) {
                    $listaAnidadaPruebas[$value->id_capacitacion_persona][] = $value;
            }

            $persona['id_region_postulacion'] = $persona->id_comuna_postulacion == null ? null : $comuna[$persona->id_comuna_postulacion];

            $persona['pruebas'] = isset($listaAnidadaPruebas[$persona->id_capacitacion_persona])?$listaAnidadaPruebas[$persona->id_capacitacion_persona]:null;
   
             
        }
        if (empty($persona)) {
            return response()->json(['resultado'=>'error','descripcion'=>'No se encuentra la Persona']);
        }else{
            return response()->json($persona);  
        }
    }

    public function guardarJefeSede(Request $request){
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_persona' => 'required|int',    
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $personaCargo = PersonaCargo::where('id_persona', $post['id_persona'])
                ->where('id_cargo', 1010)->first();
    
        if(!empty($personaCargo)){
            return response()->json(['resultado'=>'existe','descripcion'=>'La Persona ya es Jefe de Sede']);
        }      

        $personaCargo = new PersonaCargo;
        $personaCargo->id_persona = $post['id_persona'];
        $personaCargo->id_cargo = 1010;

        DB::beginTransaction();
        try{
            $personaCargo->save();
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
        }

        DB::commit();
        return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);


    }
 
    public function cambiarEstado(Request $request){

        $post = $request->all();

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_cargo' => 'required|int', 
            'id_persona' => 'required|int',
    
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        if($post['id_cargo'] != -1 && $post['estado'] == 'contratado'){
            return response()->json(['resultado'=>'error','descripcion'=>'No tiene autorización para Contratar.']);
        }

        if($post['estado'] == 'capacitado'){
            return response()->json(['resultado'=>'error','descripcion'=>'No tiene autorización para Capacitar.']);
        }
        
        $persona = Persona::where('id_persona',$post['id_persona'])->first();
        $persona->estado_proceso =  $persona->estado_proceso  == 'contratado' ? $persona->estado_proceso : 
                                    $persona->estado_proceso == 'rechazado' ? $persona->estado_proceso : $post['estado'];

        DB::beginTransaction();
        try{
            $persona->save();
            if($post['estado'] == 'preseleccionado'){
                $nombre_completo = $persona->nombres . " " . $persona->apellido_paterno;
                $this->enviarCorreoPreseleccion($persona->email, $nombre_completo);
            } 
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
        }

        DB::commit();
        return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
    }

    public function documentos(Request $request){

        $post = $request->all();    
        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_persona' => 'required|integer', 
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $docs = PersonaArchivo::select('id_persona_archivo','id_persona','nombre_archivo','tipo','created_at','token_descarga','extension')
            ->where('id_persona',$post['id_persona'])
            ->where('borrado',false)
            ->get();

        foreach ($docs as $doc) {            
            $doc->token_descarga = $request->header('t').$doc->id_persona_archivo;
            $doc->save();
        }

        return response()->json($docs); 
    }

    public function listaCoordinadorZonal(Request $request)
    {
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',
            'id_cargo' => 'required|int',
            'id_persona' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }
        $sexo =TablaMaestra::select('id_tabla_maestra','descripcion_larga') 
            ->where('discriminador','=','28')->get();
        foreach ($sexo as $s) {          
            $sexos[$s->id_tabla_maestra] = $s->descripcion_larga;
        }

        $estadoCivil =TablaMaestra::select('id_tabla_maestra','descripcion_larga') 
            ->where('discriminador','=','29')->get();
        foreach ($estadoCivil as $estado) {          
            $civil[$estado->id_tabla_maestra] = $estado->descripcion_larga;
        }

        $rol = Cargo::select('id_cargo','nombre_rol')->orderBy('nombre_rol','asc')->get();

        $institucion = Institucion::select('institucion','id_institucion')->orderBy('institucion')->get();
        foreach ($institucion as $ins) {             
            $inst[$ins->id_institucion] = $ins->institucion;
        }

        $reg = DB::select("SELECT r.numero as numero_region, r.nombre as nombre_region , co.id_comuna, co.nombre
                        from core.region r
                        INNER JOIN core.comuna co ON (r.id_region = co.id_region)
                        where r.numero != '-1'
                       order by r.orden_geografico, co.nombre");

        foreach ($reg as $key => $value) {
            $listaAnidada[$value->numero_region][] = $value;
        }

        foreach ($listaAnidada as $id_region => $comunas) {
            $region["id_region"]  = $comunas[0]->numero_region;
            $region["nombre"]  = $comunas[0]->nombre_region;
            $_comunas = array();
            foreach ($comunas as $value) {
                $_comunas[] = $value;
            }
            $region["comunas"]  = $_comunas;
            $listaFinal[] = $region;
        }

        $regPostulacion = DB::select("SELECT r.numero as numero_region, r.nombre as nombre_region , co.id_comuna, co.nombre
                        from core.region r
                        INNER JOIN core.comuna co ON (r.id_region = co.id_region)
                        where r.numero != '-1'
                        and co.id_comuna in (select id_comuna from infraestructura.estimacion)
                        order by r.orden_geografico, co.nombre");

        foreach ($regPostulacion as $key => $value) {
            $listaAnidadaPostulacion[$value->numero_region][] = $value;
        }

        foreach ($listaAnidadaPostulacion as $id_region => $comunas) {
            $region2["id_region"]  = $comunas[0]->numero_region;
            $region2["nombre"]  = $comunas[0]->nombre_region;
            $_comunas = array();
            foreach ($comunas as $value) {
                $_comunas[] = $value;
            }
            $region2["comunas"]  = $_comunas;
            $listaFinalPostulante[] = $region2;
        }

        $comunas = Comuna::get();
        foreach ($comunas as $com) {             
            $comuna[$com->id_comuna] = $com->nombre;
        }

        $cargo = DB::table('rrhh.persona_cargo')
                ->leftJoin('infraestructura.zona','rrhh.persona_cargo.id_persona_cargo','=','infraestructura.zona.id_coordinador')
                ->where('rrhh.persona_cargo.id_persona',$post['id_persona'])
                ->where('rrhh.persona_cargo.id_cargo',$post['id_cargo'])
                ->get();
        foreach($cargo as $cargoAux){
            $zonas[] = $cargoAux->id_zona;
        }

        $personaP = DB::select("select rrhh.persona.*,rrhh.persona.estado_proceso as estado,comuna.nombre as comuna,region.nombre as region, zona.nombre as nombre_zona 
			from infraestructura.zona_region as zona_region, rrhh.persona, core.comuna as comuna, core.region as region , infraestructura.zona as zona where persona.borrado = false and persona.modificado = true and id_comuna_postulacion in (
            select id_comuna from infraestructura.zona as zona, infraestructura.zona_region as zona_region, core.region as region , core.comuna as comuna
            where zona.id_zona = zona_region.id_zona
            and zona_region.id_region =  region.id_region
            and region.id_region =  comuna.id_region
            and zona.id_zona in (".implode($zonas,",").") ) 
			
            and id_comuna_postulacion = comuna.id_comuna
            and region.id_region = comuna.id_region
			and zona.id_zona = zona_region.id_zona
			and zona_region.id_region = region.id_region");


/*
        $personaP = DB::table('rrhh.persona')
            ->leftJoin('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_residencia','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->leftJoin('infraestructura.zona_region' , 'core.region.id_region','=','infraestructura.zona_region.id_region')
            ->leftJoin('infraestructura.zona' , 'infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')   
            ->select('rrhh.persona.*','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona_cargo.id_persona_cargo','rrhh.persona_cargo.estado','rrhh.cargo.nombre_rol','infraestructura.zona.id_zona','rrhh.persona_cargo.id_persona','infraestructura.zona.nombre as nombre_zona')
            ->where('rrhh.persona_cargo.id_cargo','!=',1004)
            ->where('rrhh.persona_cargo.id_cargo','!=',1003)
            ->where('rrhh.persona_cargo.id_cargo','!=',13)
            ->where('rrhh.persona.borrado','=', false)
            ->where('rrhh.persona.modificado','=',true)
            ->whereIn('infraestructura.zona.id_zona', $zonas)
            ->orderBy('core.region.orden_geografico','asc')
            ->get(); */
   /*         arreglo($personaP);exit();*/

        foreach ($personaP as $index => $per) {
            $personaP[$index]->id_institucion = $personaP[$index]->id_institucion == null ? null : $inst[$personaP[$index]->id_institucion];
            $personaP[$index]->id_estado_civil = $personaP[$index]->id_estado_civil == null ? null : $civil[$personaP[$index]->id_estado_civil];
            $personaP[$index]->id_sexo = $personaP[$index]->id_sexo == null ? null : $sexos[$personaP[$index]->id_sexo];
            $personaP[$index]->id_comuna_nacimiento =  $personaP[$index]->id_comuna_nacimiento == null ? null : $comuna[$personaP[$index]->id_comuna_nacimiento];
            $personaP[$index]->id_comuna_residencia =  $personaP[$index]->id_comuna_residencia == null ? null : $comuna[$personaP[$index]->id_comuna_residencia];
        }

 
        $cRegional = DB::table('rrhh.persona')
            ->leftJoin('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('infraestructura.zona_region' , 'rrhh.persona_cargo.id_persona_cargo','=','infraestructura.zona_region.id_coordinador')
            ->leftJoin('infraestructura.zona' , 'infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')   
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_residencia','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'infraestructura.zona_region.id_region','=','core.region.id_region')
            ->select('rrhh.persona.id_persona', 'rrhh.persona.id_comuna_residencia','rrhh.persona.run','rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.email','rrhh.persona.telefono','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona.estado_proceso as estado',/*'rrhh.persona_cargo.id_persona_cargo','rrhh.persona_cargo.estado',*/'rrhh.cargo.nombre_rol','infraestructura.zona.id_zona','infraestructura.zona.nombre as zona_nombre')
            ->where('rrhh.persona_cargo.id_cargo','=',1004)
            ->where('rrhh.persona_cargo.borrado','=',false)
            ->whereIn('infraestructura.zona.id_zona', $zonas)
            ->orderBy('core.region.orden_geografico','asc')
            ->get();  
            

        $datos['personal_postulacion'] = $personaP;
        $datos['coordinador_regional'] = $cRegional;
        $datos['sexo'] = $sexo;
        $datos['estadoCivil'] = $estadoCivil;
        $datos['rol'] = $rol;
        $datos['regiones'] = $listaFinal;
        $datos['regiones_postulante'] = $listaFinalPostulante;
        $datos['institucion'] = $institucion ;
        return response()->json($datos);    
    }

    public function listaCoordinador(Request $request)
    {
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',
            'id_cargo' => 'required|int',
            'id_persona' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }
        $sexo =TablaMaestra::select('id_tabla_maestra','descripcion_larga') 
            ->where('discriminador','=','28')->get();
        foreach ($sexo as $s) {          
            $sexos[$s->id_tabla_maestra] = $s->descripcion_larga;
        }

        $estadoCivil =TablaMaestra::select('id_tabla_maestra','descripcion_larga') 
            ->where('discriminador','=','29')->get();
        foreach ($estadoCivil as $estado) {          
            $civil[$estado->id_tabla_maestra] = $estado->descripcion_larga;
        }

        $rol = Cargo::select('id_cargo','nombre_rol')->orderBy('nombre_rol','asc')->get();

        $institucion = Institucion::select('institucion','id_institucion')->orderBy('institucion')->get();
        foreach ($institucion as $ins) {             
            $inst[$ins->id_institucion] = $ins->institucion;
        }

        $reg = DB::select("SELECT r.numero as numero_region, r.nombre as nombre_region , co.id_comuna, co.nombre
                        from core.region r
                        INNER JOIN core.comuna co ON (r.id_region = co.id_region)
                        where r.numero != '-1'
                       order by r.orden_geografico, co.nombre");

        foreach ($reg as $key => $value) {
            $listaAnidada[$value->numero_region][] = $value;
        }

        foreach ($listaAnidada as $id_region => $comunas) {
            $region["id_region"]  = $comunas[0]->numero_region;
            $region["nombre"]  = $comunas[0]->nombre_region;
            $_comunas = array();
            foreach ($comunas as $value) {
                $_comunas[] = $value;
            }
            $region["comunas"]  = $_comunas;
            $listaFinal[] = $region;
        }

        $regPostulacion = DB::select("SELECT r.numero as numero_region, r.nombre as nombre_region , co.id_comuna, co.nombre
                        from core.region r
                        INNER JOIN core.comuna co ON (r.id_region = co.id_region)
                        where r.numero != '-1'
                        and co.id_comuna in (select id_comuna from infraestructura.estimacion)
                        order by r.orden_geografico, co.nombre");

        foreach ($regPostulacion as $key => $value) {
            $listaAnidadaPostulacion[$value->numero_region][] = $value;
        }

        foreach ($listaAnidadaPostulacion as $id_region => $comunas) {
            $region2["id_region"]  = $comunas[0]->numero_region;
            $region2["nombre"]  = $comunas[0]->nombre_region;
            $_comunas = array();
            foreach ($comunas as $value) {
                $_comunas[] = $value;
            }
            $region2["comunas"]  = $_comunas;
            $listaFinalPostulante[] = $region2;
        }

        $comunas = Comuna::get();
        foreach ($comunas as $com) {             
            $comuna[$com->id_comuna] = $com->nombre;
        }
		
        $cargo = DB::table('rrhh.persona_cargo')
                ->leftJoin('infraestructura.zona_region','rrhh.persona_cargo.id_persona_cargo','=','infraestructura.zona_region.id_coordinador')
                ->leftJoin('infraestructura.zona','infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
                ->where('rrhh.persona_cargo.id_persona',$post['id_persona'])
                ->where('rrhh.persona_cargo.id_cargo',$post['id_cargo'])
                ->get();

		$zonas = array();
		foreach($cargo as $cargoAux){
			$zonas[] = $cargoAux->id_zona;
		}				
		$personaP = array(); 
        
		if($zonas[0] != ""){

		$personaP = DB::select("select rrhh.persona.*,rrhh.persona.estado_proceso as estado, comuna.nombre as comuna,region.nombre as region , zona.nombre as nombre_zona 
            from rrhh.persona, core.comuna as comuna, core.region as region, infraestructura.zona as zona , infraestructura.zona_region as zona_region 
            where persona.borrado = false and persona.modificado = true and id_comuna_postulacion in (
            select id_comuna from infraestructura.zona as zona, infraestructura.zona_region as zona_region, core.region as region , core.comuna as comuna
            where zona.id_zona = zona_region.id_zona
            and zona_region.id_region =  region.id_region
            and region.id_region =  comuna.id_region
			and zona.id_zona in (".implode($zonas,",").") ) 
            and id_comuna_postulacion = comuna.id_comuna
            and region.id_region = comuna.id_region
            and zona_region.id_region =  region.id_region
            and zona.id_zona = zona_region.id_zona
            and zona_region.id_coordinador = ". $cargo[0]->id_persona_cargo."
            ");

			
			// $personaP = DB::select("select rrhh.persona.*,rrhh.persona.estado_proceso as estado, persona_cargo.*,cargo.*,comuna.nombre as comuna,region.nombre as region , zona.nombre as nombre_zona 
            // from rrhh.persona, rrhh.persona_cargo as persona_cargo, rrhh.cargo as cargo, core.comuna as comuna, core.region as region, infraestructura.zona as zona , infraestructura.zona_region as zona_region 
            // where persona.borrado = false and persona.modificado = true and id_comuna_postulacion in (
            // select id_comuna from infraestructura.zona as zona, infraestructura.zona_region as zona_region, core.region as region , core.comuna as comuna
            // where zona.id_zona = zona_region.id_zona
            // and zona_region.id_region =  region.id_region
            // and region.id_region =  comuna.id_region
            // and zona.id_zona in (".implode($zonas,",").") ) 
            // and persona_cargo.id_persona = persona.id_persona 
            // and persona_cargo.id_cargo = cargo.id_cargo
            // and id_comuna_postulacion = comuna.id_comuna
            // and region.id_region = comuna.id_region
            // and zona_region.id_region =  region.id_region
            // and zona.id_zona = zona_region.id_zona
            // and zona_region.id_coordinador = ". $cargo[0]->id_persona_cargo."
            // ");
		}	
        /*
        foreach ($personaP as $index => $per) {
            $personaP[$index]->id_institucion = $personaP[$index]->id_institucion == null ? null : $inst[$personaP[$index]->id_institucion];
            $personaP[$index]->id_estado_civil = $personaP[$index]->id_estado_civil == null ? null : $civil[$personaP[$index]->id_estado_civil];
            $personaP[$index]->id_sexo = $personaP[$index]->id_sexo == null ? null : $sexos[$personaP[$index]->id_sexo];
            $personaP[$index]->id_comuna_nacimiento =  $personaP[$index]->id_comuna_nacimiento == null ? null : $comuna[$personaP[$index]->id_comuna_nacimiento];
            $personaP[$index]->id_comuna_residencia =  $personaP[$index]->id_comuna_residencia == null ? null : $comuna[$personaP[$index]->id_comuna_residencia];
        }*/



        $datos['personal_postulacion'] = $personaP;
        $datos['sexo'] = $sexo;
        $datos['estadoCivil'] = $estadoCivil;
        $datos['rol'] = $rol;
        $datos['regiones'] = $listaFinal;
        $datos['regiones_postulante'] = $listaFinalPostulante;
        $datos['institucion'] = $institucion ;
        return response()->json($datos);    
    }

    function enviarCorreoPreseleccion($correo, $nombre){
        $url = url()->current();
        $aux_ruta = explode("//", $url);
        $aux2_ruta = explode(".iie.cl", $aux_ruta[1]);
        $ruta = $aux2_ruta[0];

        $path_files = realpath('') . '/archivos/';

        $subject = "Preselección - Evaluación Conocimientos Específicos y Pedagógicos";
        $html = "
        <p>Estimado/a " . $nombre . " </p>
        <p>Felicitaciones, Usted ha sido pre-seleccionado/a para participar en la Evaluación de Conocimientos Específicos y Pedagógicos, ECEP 2019.</p>
        <p>Para seguir en el proceso, será convocado en los próximos días a una sesión de Capacitación de carácter obligatorio. En esta jornada se abordará el proceso de aplicación, el cual se detalla en el Manual adjunto. Reviselo, ya que al finalizar la capacitación se evalúan los contenidos allí expuestos. </p>
		<p><b>Atentamente</b></p>
        <p><b>Equipo de Aplicación ECEP 2019</b></p>";
        
        $mail = new PHPMailer(true); 

		try {
			$mail->isSMTP(); // tell to use smtp
			$mail->CharSet = "utf-8"; // set charset to utf8
			$mail->SMTPDebug = 0;
			// $mail->Debugoutput = 'html';

			$mail->SMTPSecure = "tls"; // tls or ssl
			$mail->SMTPAuth = true;  // use smpt auth
			$mail->Host = "mail.smtp2go.com"; 
			$mail->Port = 2525;//2525; //443; 
			$mail->Username = "no-reply@ecep2019.iie.cl";
			$mail->Password = 'Zzh@@@m#k1ll@@ola##bk1;;;####llTFmdjg2019@@@@wcnYw';
			$mail->setFrom("no-reply@ecep2019.iie.cl", "ECEP");
			$mail->Subject = $subject;
			$mail->MsgHTML($html);
			$mail->addAddress($correo, $nombre);
            $mail->addBCC("alberto.paillao@iie.cl", "Alberto Paillao");
            $mail->addAttachment($path_files."Manual aplicación 2019_2410.pdf");
            if (strpos($ruta, 'ecep2019') !== false) { // Solo envía en producción
                $mail->send();
            }
		} catch (phpmailerException $e) {
			return;
		} catch (Exception $e) {
			return;			
		}
		return true;
    }

}