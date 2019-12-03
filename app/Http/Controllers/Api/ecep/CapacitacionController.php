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

require realpath(__DIR__ . '/../../../../..').'/vendor/phpmailer/phpmailer/src/Exception.php';
require realpath(__DIR__ . '/../../../../..').'/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require realpath(__DIR__ . '/../../../../..').'/vendor/phpmailer/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class CapacitacionController extends Controller
{
     
    public function __construct()
    {
        $this->fields = array();    
    }  


    public function listaPostulantes(Request $request)
    {
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
        ]); 

        if($post['id_tipo_usuario'] == 1051){
            $listaZona = DB::table('infraestructura.zona')
                    ->get();
            $zonas = array();
            foreach($listaZona as $listaZonaAux){
                $zonas[] = $listaZonaAux->id_zona;
            }
        }else{
            $cargo = DB::table('rrhh.persona_cargo')
                    ->leftJoin('infraestructura.zona','rrhh.persona_cargo.id_persona_cargo','=','infraestructura.zona.id_coordinador')
                    ->where('rrhh.persona_cargo.id_persona',$post['id_persona'])
                    ->where('rrhh.persona_cargo.id_cargo',$post['id_cargo'])
                    ->get();

            $zonas = array();
            foreach($cargo as $cargoAux){
                $zonas[] = $cargoAux->id_zona;
            }
        }       

        $personaP = array(); 
        /*$relatores = array(); */
        $listaCapacitaciones = array(); 
        $listaAnidadaR = []; 
        $finalRegCapacitaciones = [];
        if(count($zonas) > 0){
            
            //todas las personas que ya están en una capacitación no se pueden meter a otra capacitación a menos que hayan estado en una capacitación pero hayan reprobado
            
            //ahora de todas las personas que confirmacion asistencia los que pueden volver a ser convocados son los rechazados
            
            $personaP = DB::select("select DISTINCT 
                    rrhh.persona.id_persona, rrhh.persona.run,rrhh.persona.nombres,rrhh.persona.apellido_paterno,rrhh.persona.apellido_materno,rrhh.persona.deserta,
                    rrhh.persona.borrado, rrhh.persona.email, rrhh.persona.estado_proceso,rrhh.persona.id_usuario,rrhh.persona.telefono,
                    core.comuna.nombre as comuna, core.region.nombre as region, 
                    infraestructura.zona.nombre as nombre_zona, core.region.orden_geografico,
                    rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion_persona.estado,  rrhh.capacitacion_persona.asistencia, rrhh.capacitacion_persona.id_capacitacion, rrhh.capacitacion.lugar, core.region.id_region as id_region_postulacion,
                    rrhh.capacitacion.fecha_hora, rrhh.capacitacion_persona.borrado as borrado_capacitacion, rrhh.persona.id_comuna_postulacion 
                    from rrhh.persona 
                    inner join rrhh.persona_cargo on rrhh.persona.id_persona = rrhh.persona_cargo.id_persona 
                    left join rrhh.cargo on rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo 
                    left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
                    left join core.region on core.comuna.id_region = core.region.id_region 
                    left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region 
                    left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona 
                    left join rrhh.capacitacion_persona on rrhh.persona.id_persona = rrhh.capacitacion_persona.id_persona 
                    left join rrhh.capacitacion on rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
                    where  rrhh.cargo.id_cargo != 1003
                        and rrhh.cargo.id_cargo != 1004 
                        and rrhh.cargo.id_cargo != 13 
                        and rrhh.persona.borrado = false
                        and rrhh.persona.modificado = true 
                        and rrhh.persona.estado_proceso = 'preseleccionado'
                        and rrhh.persona.id_persona not in (select id_persona from rrhh.capacitacion_persona where estado != false)
                        and rrhh.persona_cargo.borrado = false
                    and zona.id_zona in (".implode($zonas,",").")
                    GROUP BY rrhh.persona.id_persona,core.comuna.nombre,core.region.nombre, infraestructura.zona.nombre, rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion.lugar,core.region.id_region,
                    rrhh.capacitacion.fecha_hora,core.region.orden_geografico
                    ORDER BY infraestructura.zona.nombre asc, 
                        core.region.orden_geografico asc, 
                        core.comuna.nombre asc");


        }




        $columns=array(
            0=> "id_persona",
            1=> "region",
            2=> "comuna",
            3=> "run",
            4=> "nombres",
            5=> "apellido_paterno",
            6=> "apellido_materno",
            7=> "telefono",
            8=> "id_capacitacion",
            9=> "lugar",
            10=> "fecha_hora",
            11=> "borrado_capacitacion",
            12=> "asistencia",
            13=> "estado",
            14=> "id_capacitacion_persona",
            15=> "deserta",
            16=> "id_comuna_postulacion",
            17=> "id_region_postulacion",
            18=> "email",
        );


        $totalData = count($personaP);
        $limit = $request->input('length');
        $start = $request->input('start');
        $order = $columns[$request->input('order.0.column')];
        $dir = $request->input('order.0.dir');
        
        $searchCol1 =$request->input("columns.1.search.value");
        $searchCol2 =$request->input("columns.2.search.value");
        $searchCol9 =$request->input("columns.9.search.value");
        $searchCol10 =$request->input("columns.10.search.value");
        $quitar = array("$", "^");
        $searchCol1 = str_replace($quitar, "", $searchCol1);
        $searchCol2 = str_replace($quitar, "", $searchCol2);
        $searchCol9 = str_replace($quitar, "", $searchCol9);
        $searchCol10 = str_replace($quitar, "", $searchCol10);
        if(empty($request->input('search.value')) && $searchCol1 == '' && $searchCol2 == ''&& $searchCol9 == '' && $searchCol10 == ''){

            $post = DB::select("select DISTINCT 
                    rrhh.persona.id_persona, rrhh.persona.run,rrhh.persona.nombres,rrhh.persona.apellido_paterno,rrhh.persona.apellido_materno,rrhh.persona.deserta,
                    rrhh.persona.borrado, rrhh.persona.email, rrhh.persona.estado_proceso,rrhh.persona.id_usuario,rrhh.persona.telefono,
                    core.comuna.nombre as comuna, core.region.nombre as region, 
                    infraestructura.zona.nombre as nombre_zona, core.region.orden_geografico,
                    rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion_persona.estado,  rrhh.capacitacion_persona.asistencia, rrhh.capacitacion_persona.id_capacitacion, rrhh.capacitacion.lugar, core.region.id_region as id_region_postulacion,rrhh.persona.id_comuna_postulacion ,
                    rrhh.capacitacion.fecha_hora, rrhh.capacitacion_persona.borrado as borrado_capacitacion 
                    from rrhh.persona 
                    inner join rrhh.persona_cargo on rrhh.persona.id_persona = rrhh.persona_cargo.id_persona 
                    left join rrhh.cargo on rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo 
                    left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
                    left join core.region on core.comuna.id_region = core.region.id_region 
                    left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region 
                    left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona 
                    left join rrhh.capacitacion_persona on rrhh.persona.id_persona = rrhh.capacitacion_persona.id_persona 
                    left join rrhh.capacitacion on rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
                    where  rrhh.cargo.id_cargo != 1003
                        and rrhh.cargo.id_cargo != 1004 
                        and rrhh.cargo.id_cargo != 13 
                        and rrhh.persona.borrado = false
                        and rrhh.persona.modificado = true 
                        and rrhh.persona.estado_proceso = 'preseleccionado'
                        and rrhh.persona.id_persona not in (select id_persona from rrhh.capacitacion_persona where estado != false)
                        and rrhh.persona_cargo.borrado = false
                    and zona.id_zona in (".implode($zonas,",").")
                    GROUP BY rrhh.persona.id_persona,core.comuna.nombre,core.region.nombre, infraestructura.zona.nombre, rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion.lugar,core.region.id_region,
                    rrhh.capacitacion.fecha_hora,core.region.orden_geografico
                    ORDER BY infraestructura.zona.nombre asc, 
                        core.region.orden_geografico asc, 
                        core.comuna.nombre asc");

            $totalFiltered =  count($personaP);
        }else{
            $sql = "select DISTINCT 
                    rrhh.persona.id_persona, rrhh.persona.run,rrhh.persona.nombres,rrhh.persona.apellido_paterno,rrhh.persona.apellido_materno,rrhh.persona.deserta,
                    rrhh.persona.borrado, rrhh.persona.email, rrhh.persona.estado_proceso,rrhh.persona.id_usuario,rrhh.persona.telefono,
                    core.comuna.nombre as comuna, core.region.nombre as region, 
                    infraestructura.zona.nombre as nombre_zona, core.region.orden_geografico,
                    rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion_persona.estado,  rrhh.capacitacion_persona.asistencia, rrhh.capacitacion_persona.id_capacitacion, rrhh.capacitacion.lugar, core.region.id_region as id_region_postulacion,
                    rrhh.capacitacion.fecha_hora, rrhh.capacitacion_persona.borrado as borrado_capacitacion 
                    from rrhh.persona 
                    inner join rrhh.persona_cargo on rrhh.persona.id_persona = rrhh.persona_cargo.id_persona 
                    left join rrhh.cargo on rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo 
                    left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
                    left join core.region on core.comuna.id_region = core.region.id_region 
                    left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region 
                    left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona 
                    left join rrhh.capacitacion_persona on rrhh.persona.id_persona = rrhh.capacitacion_persona.id_persona 
                    left join rrhh.capacitacion on rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
                    where  rrhh.cargo.id_cargo != 1003
                        and rrhh.cargo.id_cargo != 1004 
                        and rrhh.cargo.id_cargo != 13 
                        and rrhh.persona.borrado = false
                        and rrhh.persona.modificado = true 
                        and rrhh.persona.estado_proceso = 'preseleccionado'
                        and rrhh.persona.id_persona not in (select id_persona from rrhh.capacitacion_persona where estado != false)
                        and rrhh.persona_cargo.borrado = false
                    and zona.id_zona in (".implode($zonas,",").")
                   
            ";

            if($searchCol1 !=  ''){

                     $sql .= " and core.region.nombre = '".$searchCol1."'" ;

            }
            if($searchCol2 !=  ''){
             
                 $sql .= " and core.comuna.nombre = '".$searchCol2."'";
                 
            }

            if($searchCol9 !=  ''){

                $sql .= " and rrhh.capacitacion.lugar = '".strtolower($searchCol9)."'";
   

            }
            if($searchCol10 !=  ''){
           
                 $sql .= " and rrhh.capacitacion.fecha_hora = '".$searchCol10."'";

            }
           
            if(!empty($request->input('search.value'))){
      
                $search = $request->input('search.value');


                $sql .= " and rrhh.persona.nombres ilike '%{$search}%'";
                $sql .= " or rrhh.persona.apellido_paterno ilike '%{$search}%'";
                $sql .= " or rrhh.persona.apellido_materno ilike '%{$search}%'";
                $sql .= " or rrhh.persona.run ilike  '%{$search}%'";

            }
 
              $sql .= " GROUP BY rrhh.persona.id_persona,core.comuna.nombre,core.region.nombre, infraestructura.zona.nombre, rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion.lugar,core.region.id_region,
                    rrhh.capacitacion.fecha_hora,core.region.orden_geografico order by infraestructura.zona.nombre asc, 
                        core.region.orden_geografico asc, 
                        core.comuna.nombre asc, ".$order." ". $dir." limit ".$limit." offset ".$start;
              
              $post = DB::select($sql);
 
              $totalFiltered = count($post);

        }


        $data = array();

            if($post ){
                foreach ($post as $r) {
                    $nestedData['id_capacitacion'] = $r->id_capacitacion;
 
                    $nestedData['region'] = $r->region;
                    $nestedData['comuna'] = $r->comuna;

                    $nestedData['run'] = $r->run;
                    $nestedData['nombres'] = $r->nombres;
                    $nestedData['apellido_paterno'] = $r->apellido_paterno;
                    $nestedData['apellido_materno'] = $r->apellido_materno;
                    $nestedData['telefono'] = $r->telefono;
                    $nestedData['id_persona'] = $r->id_persona;
                    $nestedData['fecha_hora'] = $r->fecha_hora;
                    $nestedData['lugar'] = $r->lugar;
                    $nestedData['borrado_capacitacion'] = $r->borrado_capacitacion;
                    $nestedData['asistencia'] = $r->asistencia;
                    $nestedData['estado'] = $r->estado;
                    $nestedData['id_capacitacion_persona'] = $r->id_capacitacion_persona;
                    $nestedData['deserta'] = $r->deserta;
                    $nestedData['id_comuna_postulacion'] = $r->id_comuna_postulacion;
                    $nestedData['id_region_postulacion'] = $r->id_region_postulacion;
                    $nestedData['email'] = $r->email;

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

    public function lista(Request $request)
    {
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_cargo' => 'required|int',
            //'id_persona' => 'int',
            'id_tipo_usuario' => 'int',

        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }
        
        $sexo = TablaMaestra::select('id_tabla_maestra','descripcion_larga') 
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

        $listaAnidadaC=[];
        $cap = DB::table('rrhh.capacitacion')
                 ->leftJoin('core.comuna' , 'rrhh.capacitacion.id_comuna','=','core.comuna.id_comuna')
                 ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
                 ->select('rrhh.capacitacion.archivo_nombre','rrhh.capacitacion.archivo_mimetype','rrhh.capacitacion.borrado','rrhh.capacitacion.capacidad','rrhh.capacitacion.fecha_hora','rrhh.capacitacion.id_capacitacion','rrhh.capacitacion.id_comuna','rrhh.capacitacion.id_relator','rrhh.capacitacion.lugar','rrhh.capacitacion.observacion','rrhh.capacitacion.asistentes','core.region.id_region')
                 ->where('rrhh.capacitacion.borrado','=',false)
                 ->orderBy('core.comuna.nombre','asc')
                 ->get();

        foreach ($cap as $key => $value) {
            $listaAnidadaC[$value->id_region][] = $value;
        }

        if($post['id_tipo_usuario'] == 1051){
            $listaZona = DB::table('infraestructura.zona')
                    ->get();
            $zonas = array();
            foreach($listaZona as $listaZonaAux){
                $zonas[] = $listaZonaAux->id_zona;
            }
        }else{
            $cargo = DB::table('rrhh.persona_cargo')
                    ->leftJoin('infraestructura.zona','rrhh.persona_cargo.id_persona_cargo','=','infraestructura.zona.id_coordinador')
                    ->where('rrhh.persona_cargo.id_persona',$post['id_persona'])
                    ->where('rrhh.persona_cargo.id_cargo',$post['id_cargo'])
                    ->get();

            $zonas = array();
            foreach($cargo as $cargoAux){
                $zonas[] = $cargoAux->id_zona;
            }
        }    	

		$personaP = array(); 
		/*$relatores = array(); */
		$listaCapacitaciones = array(); 
 		$listaAnidadaR = []; 
 		$finalRegCapacitaciones = [];
		if(count($zonas) > 0){
			
			//todas las personas que ya están en una capacitación no se pueden meter a otra capacitación a menos que hayan estado en una capacitación pero hayan reprobado
			
			//ahora de todas las personas que confirmacion asistencia los que pueden volver a ser convocados son los rechazados
			
	        $personaP = DB::select("select DISTINCT 
	                rrhh.persona.id_persona, rrhh.persona.run,rrhh.persona.nombres,rrhh.persona.apellido_paterno,rrhh.persona.apellido_materno,rrhh.persona.deserta,
                    rrhh.persona.borrado, rrhh.persona.email, rrhh.persona.estado_proceso,rrhh.persona.id_usuario,rrhh.persona.telefono,
                    core.comuna.nombre as comuna, core.region.nombre as region, 
	                infraestructura.zona.nombre as nombre_zona, core.region.orden_geografico,
	                rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion_persona.estado,  rrhh.capacitacion_persona.asistencia, rrhh.capacitacion_persona.id_capacitacion, rrhh.capacitacion.lugar, core.region.id_region as id_region_postulacion,
	                rrhh.capacitacion.fecha_hora, rrhh.capacitacion_persona.borrado as borrado_capacitacion 
	                from rrhh.persona 
	                inner join rrhh.persona_cargo on rrhh.persona.id_persona = rrhh.persona_cargo.id_persona 
	                left join rrhh.cargo on rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo 
	                left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
	                left join core.region on core.comuna.id_region = core.region.id_region 
	                left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region 
	                left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona 
	                left join rrhh.capacitacion_persona on rrhh.persona.id_persona = rrhh.capacitacion_persona.id_persona 
	                left join rrhh.capacitacion on rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
	                where  rrhh.cargo.id_cargo != 1003
	                    and rrhh.cargo.id_cargo != 1004 
	                    and rrhh.cargo.id_cargo != 13 
	                    and rrhh.persona.borrado = false
	                    and rrhh.persona.modificado = true 
	                    and rrhh.persona.estado_proceso = 'preseleccionado'
                        and rrhh.persona.id_persona not in (select id_persona from rrhh.capacitacion_persona where estado != false)
	                    and rrhh.persona_cargo.borrado = false
					and zona.id_zona in (".implode($zonas,",").")
	                GROUP BY rrhh.persona.id_persona,core.comuna.nombre,core.region.nombre, infraestructura.zona.nombre, rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion.lugar,core.region.id_region,
	                rrhh.capacitacion.fecha_hora,core.region.orden_geografico
	                ORDER BY infraestructura.zona.nombre asc, 
	                    core.region.orden_geografico asc, 
	                    core.comuna.nombre asc");

	        $listaCapacitaciones = DB::select(		
						"select rrhh_c.asistentes, rrhh_c.id_capacitacion, rrhh_c.archivo_nombre, rrhh_c.archivo_mimetype, rrhh_c.borrado, rrhh_c.capacidad, rrhh_c.fecha_hora, rrhh_c.id_comuna, rrhh_c.id_relator, rrhh_c.lugar, rrhh_c.observacion, rrhh_c.asistentes, core.comuna.nombre as comuna, core.region.nombre as region, core.region.id_region, rrhh.persona.nombres,
						rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno, 
						
						(select count(p.id_capacitacion) from rrhh.capacitacion_persona as p
                        where p.id_capacitacion = rrhh_c.id_capacitacion
						and p.borrado = false
                        group by p.id_capacitacion) as convocados, 
						
						(select count(p.id_persona) as confirmados from rrhh.capacitacion as c left join rrhh.capacitacion_persona as p
                        on (c.id_capacitacion = p.id_capacitacion) where confirma_asistencia = 1
                        and c.id_capacitacion = rrhh_c.id_capacitacion
						and p.borrado = false
                        group by c.id_capacitacion) as confirmados,

						(select count(rrhh.capacitacion_persona.id_persona) from rrhh.capacitacion_persona where estado = true 
						and rrhh.capacitacion_persona.id_capacitacion = rrhh_c.id_capacitacion
						and rrhh.capacitacion_persona.borrado = false
						group by rrhh.capacitacion_persona.id_capacitacion ) as aprobados

						from rrhh.capacitacion as rrhh_c
						left join rrhh.persona on rrhh_c.id_relator = rrhh.persona.id_persona
						left join core.comuna on rrhh_c.id_comuna = core.comuna.id_comuna
						left join core.region on core.comuna.id_region = core.region.id_region
						left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region
						left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona
						where infraestructura.zona.id_zona in (".implode($zonas,",").") and rrhh_c.borrado = false
						order by rrhh_c.borrado asc,core.region.orden_geografico asc, core.comuna.nombre asc");


            $pruebas = DB::select("SELECT rrhh.capacitacion_prueba.*,rrhh.capacitacion_persona.id_capacitacion_persona,rrhh.capacitacion.id_relator
                    FROM rrhh.capacitacion_prueba,rrhh.capacitacion,rrhh.capacitacion_persona
                    where rrhh.capacitacion_prueba.id_capacitacion_persona = rrhh.capacitacion_persona.id_capacitacion_persona
                    and rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
                    order by rrhh.capacitacion_prueba.prueba asc");

            foreach ($pruebas as $key => $value) {
                    $listaAnidadaPruebas[$value->id_capacitacion_persona][] = $value;
            }

            $personaCapacitadas = DB::select("select DISTINCT 
                    rrhh.persona.id_persona, rrhh.persona.apellido_materno, rrhh.persona.apellido_paterno, rrhh.persona.deserta, rrhh.persona.estado_proceso, rrhh.persona.id_usuario, rrhh.persona.nombres, rrhh.persona.run, rrhh.capacitacion_persona.estado,
                    core.comuna.nombre as comuna, core.region.nombre as region, 
                    infraestructura.zona.nombre as nombre_zona, core.region.orden_geografico,
                    rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion_persona.id_capacitacion, rrhh.capacitacion.lugar, 
                    rrhh.capacitacion.fecha_hora, rrhh.capacitacion_persona.borrado as borrado_capacitacion, rrhh.capacitacion_persona.asistencia
                    from rrhh.persona 
                    inner join rrhh.persona_cargo on rrhh.persona.id_persona = rrhh.persona_cargo.id_persona 
                    left join rrhh.cargo on rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo 
                    left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
                    left join core.region on core.comuna.id_region = core.region.id_region 
                    left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region 
                    left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona 
                    left join rrhh.capacitacion_persona on rrhh.persona.id_persona = rrhh.capacitacion_persona.id_persona 
                    left join rrhh.capacitacion on rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
                    where  rrhh.cargo.id_cargo != 1003
                        and rrhh.cargo.id_cargo != 1004 
                        and rrhh.cargo.id_cargo != 13 
                        and rrhh.persona.borrado = false
                        and rrhh.persona.modificado = true 
                        and rrhh.persona.estado_proceso = 'capacitado'
                        and rrhh.persona_cargo.borrado = false
                    and zona.id_zona in (".implode($zonas,",").")
                    GROUP BY rrhh.persona.id_persona,core.comuna.nombre,core.region.nombre, infraestructura.zona.nombre, rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion.lugar,
                    rrhh.capacitacion.fecha_hora,core.region.orden_geografico
                    ORDER BY infraestructura.zona.nombre asc, 
                        core.region.orden_geografico asc, 
                        core.comuna.nombre asc, rrhh.capacitacion.fecha_hora, rrhh.capacitacion.lugar ");

            foreach ($personaCapacitadas as $index => $per) {

                $personaCapacitadas[$index]->pruebas = isset($listaAnidadaPruebas[$per->id_capacitacion_persona])?$listaAnidadaPruebas[$per->id_capacitacion_persona]:null;
            }   

        	$regCapacitaciones = DB::select("SELECT r.numero as numero_region, r.nombre as nombre_region , co.id_comuna, co.nombre
                        from core.region r
                        INNER JOIN core.comuna co ON (r.id_region = co.id_region)
                        INNER JOIN infraestructura.zona_region zr ON (r.id_region = zr.id_region)
                        INNER JOIN infraestructura.zona z ON (zr.id_zona = z.id_zona)
                        where r.numero != '-1' 
                            and z.id_zona in (".implode($zonas,",").")
                       	order by r.orden_geografico, co.nombre");

	        foreach ($regCapacitaciones as $key => $value) {
	            $listaAnidadaCap[$value->numero_region][] = $value;
	        }

	        foreach ($listaAnidadaCap as $id_region => $comunas) {
	            $region["id_region"]  = $comunas[0]->numero_region;
	            $region["nombre"]  = $comunas[0]->nombre_region;
	            $_comunas = array();
	            foreach ($comunas as $value) {
	                $_comunas[] = $value;
	            }
	            $region["comunas"]  = $_comunas;
	            $finalRegCapacitaciones[] = $region;
	        }

	        /*$relatores = DB::select("select rrhh.persona.nombres, rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno, rrhh.persona.id_persona, core.comuna.id_comuna, 
	        	core.comuna.nombre as comuna, core.region.nombre as region, rrhh.persona.run 
				from rrhh.persona 
				left join core.usuario on rrhh.persona.id_usuario = core.usuario.id_usuario 
				left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
				left join core.region on core.comuna.id_region = core.region.id_region 
				left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region 
				left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona 
				where core.usuario.id_tipo_usuario = 1052
					and rrhh.persona.borrado = false 
					and zona.id_zona in (".implode($zonas,",").")
				order by core.region.orden_geografico asc, core.comuna.nombre asc");*/


            $relatores = DB::select("select rrhh_p.nombres, rrhh_p.apellido_paterno, rrhh_p.apellido_materno,rrhh_p.id_persona, core.comuna.id_comuna,
               core.comuna.nombre as comuna, core.region.nombre as region, rrhh_p.run, (select count(c.id_capacitacion) from rrhh.capacitacion as c
                      where c.id_relator= rrhh_p.id_persona
                      group by c.id_relator) as capacitaciones
               from rrhh.persona  as rrhh_p
               left join core.usuario on rrhh_p.id_usuario = core.usuario.id_usuario
               left join core.comuna on rrhh_p.id_comuna_postulacion = core.comuna.id_comuna
               left join core.region on core.comuna.id_region = core.region.id_region
               left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region
               left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona
               where core.usuario.id_tipo_usuario = 1052
                   and rrhh_p.borrado = false
               order by core.region.orden_geografico asc, core.comuna.nombre asc, rrhh_p.nombres asc, rrhh_p.apellido_paterno asc");

	        /*
	        foreach ($relatores as $key => $value) {
	            $listaAnidadaR[$value->id_comuna][] = $value;
	        }*/

	    }
        $totalCapacitado = Persona::where('estado_proceso','capacitado')->count(); 

 
        $datos['personal_postulacion'] = $personaP;
        $datos['lista_capacitados'] = $personaCapacitadas;
        $datos['regiones'] = $listaFinal;
        $datos['regiones_postulante'] = $listaFinalPostulante;
        $datos['regiones_capacitacion'] = $finalRegCapacitaciones;
        $datos['lista_reladores'] = $relatores;
        /*$datos['relatores'] = $listaAnidadaR;*/
        $datos['capacitaciones'] = $listaAnidadaC;
        $datos['lista_capacitacion'] = $listaCapacitaciones;
        $datos['sexo'] = $sexo;
        $datos['estadoCivil'] = $estadoCivil;
        $datos['institucion'] = $institucion ;
        $datos['total_capacitados'] = $totalCapacitado;
        return response()->json($datos);    
    }

    public function listaRegional(Request $request)
    {   
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_cargo' => 'required|int',
            //'id_persona' => 'int',
            'id_tipo_usuario' => 'int',

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

        $listaAnidadaC=[];
        $cap = DB::table('rrhh.capacitacion')
                 ->leftJoin('core.comuna' , 'rrhh.capacitacion.id_comuna','=','core.comuna.id_comuna')
                 ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
                 ->select('rrhh.capacitacion.archivo_nombre','rrhh.capacitacion.archivo_mimetype','rrhh.capacitacion.borrado','rrhh.capacitacion.capacidad','rrhh.capacitacion.fecha_hora','rrhh.capacitacion.id_capacitacion','rrhh.capacitacion.id_comuna','rrhh.capacitacion.id_relator','rrhh.capacitacion.lugar','rrhh.capacitacion.observacion','rrhh.capacitacion.asistentes','core.region.id_region')
                 ->where('rrhh.capacitacion.borrado','=',false)
                 ->orderBy('core.comuna.nombre','asc')
                 ->get();

        foreach ($cap as $key => $value) {
            $listaAnidadaC[$value->id_region][] = $value;
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
        /*$relatores = array(); */
        $listaCapacitaciones = array(); 
        $listaAnidadaR = []; 
        $finalRegCapacitaciones = [];
        if(count($zonas) > 0){
            
            //todas las personas que ya están en una capacitación no se pueden meter a otra capacitación a menos que hayan estado en una capacitación pero hayan reprobado
            
            //ahora de todas las personas que confirmacion asistencia los que pueden volver a ser convocados son los rechazados
            
            $personaP = DB::select("select DISTINCT 
                    rrhh.persona.*, core.comuna.nombre as comuna, core.region.nombre as region, 
                    infraestructura.zona.nombre as nombre_zona, core.region.orden_geografico,
                    rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion_persona.estado, rrhh.capacitacion_persona.asistencia, rrhh.capacitacion_persona.id_capacitacion, rrhh.capacitacion.lugar, core.region.id_region as id_region_postulacion,
                    rrhh.capacitacion.fecha_hora, rrhh.capacitacion_persona.borrado as borrado_capacitacion 
                    from rrhh.persona 
                    inner join rrhh.persona_cargo on rrhh.persona.id_persona = rrhh.persona_cargo.id_persona 
                    left join rrhh.cargo on rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo 
                    left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
                    left join core.region on core.comuna.id_region = core.region.id_region 
                    left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region 
                    left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona 
                    left join rrhh.capacitacion_persona on rrhh.persona.id_persona = rrhh.capacitacion_persona.id_persona 
                    left join rrhh.capacitacion on rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
                    where  rrhh.cargo.id_cargo != 1003
                        and rrhh.cargo.id_cargo != 1004 
                        and rrhh.cargo.id_cargo != 13 
                        and rrhh.persona.borrado = false
                        and rrhh.persona.modificado = true 
                        and rrhh.persona.estado_proceso = 'preseleccionado'
                        and rrhh.persona.id_persona not in (select id_persona from rrhh.capacitacion_persona where estado != false)
                        and rrhh.persona_cargo.borrado = false
                    and zona.id_zona in (".implode($zonas,",").")
                    and infraestructura.zona_region.id_coordinador = ". $cargo[0]->id_persona_cargo."
                    GROUP BY rrhh.persona.id_persona,core.comuna.nombre,core.region.nombre, infraestructura.zona.nombre, rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion.lugar,core.region.id_region,
                    rrhh.capacitacion.fecha_hora,core.region.orden_geografico
                    ORDER BY infraestructura.zona.nombre asc, 
                        core.region.orden_geografico asc, 
                        core.comuna.nombre asc");

            $listaCapacitaciones = DB::select("select rrhh_c.asistentes, rrhh_c.id_capacitacion, rrhh_c.archivo_nombre, rrhh_c.archivo_mimetype, rrhh_c.borrado, rrhh_c.capacidad, rrhh_c.fecha_hora, rrhh_c.id_comuna, rrhh_c.id_relator, rrhh_c.lugar, rrhh_c.observacion, rrhh_c.asistentes, core.comuna.nombre as comuna, core.region.nombre as region, core.region.id_region, rrhh.persona.nombres,
                rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno, 
                    
					(select count(p.id_capacitacion) from rrhh.capacitacion_persona as p
                        where p.id_capacitacion = rrhh_c.id_capacitacion
						and p.borrado = false
                        group by p.id_capacitacion) as convocados, 
                    
					(select count(p.id_persona) as confirmados from rrhh.capacitacion as c left join rrhh.capacitacion_persona as p
                        on (c.id_capacitacion = p.id_capacitacion) where confirma_asistencia = 1
                        and c.id_capacitacion = rrhh_c.id_capacitacion
						and p.borrado = false
                        group by c.id_capacitacion) as confirmados,
						
						(select count(rrhh.capacitacion_persona.id_persona) from rrhh.capacitacion_persona where estado = true 
						and rrhh.capacitacion_persona.id_capacitacion = rrhh_c.id_capacitacion
						and rrhh.capacitacion_persona.borrado = false
						group by rrhh.capacitacion_persona.id_capacitacion ) as aprobados						
						
            from rrhh.capacitacion as rrhh_c
            left join rrhh.persona on rrhh_c.id_relator = rrhh.persona.id_persona
            left join core.comuna on rrhh_c.id_comuna = core.comuna.id_comuna
            left join core.region on core.comuna.id_region = core.region.id_region
            left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region
            left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona
            where infraestructura.zona.id_zona in (".implode($zonas,",").") and rrhh_c.borrado = false
            order by rrhh_c.borrado asc, core.region.orden_geografico asc, core.comuna.nombre asc");




            $pruebas = DB::select("SELECT rrhh.capacitacion_prueba.*,rrhh.capacitacion_persona.id_capacitacion_persona,rrhh.capacitacion.id_relator
                    FROM rrhh.capacitacion_prueba,rrhh.capacitacion,rrhh.capacitacion_persona
                    where rrhh.capacitacion_prueba.id_capacitacion_persona = rrhh.capacitacion_persona.id_capacitacion_persona
                    and rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
                    order by rrhh.capacitacion_prueba.prueba asc");

            foreach ($pruebas as $key => $value) {
                    $listaAnidadaPruebas[$value->id_capacitacion_persona][] = $value;
            }

            $personaCapacitadas = DB::select("select DISTINCT 
                    rrhh.persona.id_persona, rrhh.persona.apellido_materno, rrhh.persona.apellido_paterno, rrhh.persona.deserta, rrhh.persona.estado_proceso, rrhh.persona.id_usuario, rrhh.persona.nombres, rrhh.persona.run, rrhh.capacitacion_persona.estado,
                    rrhh.capacitacion_persona.asistencia, core.comuna.nombre as comuna, core.region.nombre as region, 
                    infraestructura.zona.nombre as nombre_zona, core.region.orden_geografico,
                    rrhh.capacitacion_persona.id_capacitacion_persona,rrhh.capacitacion_persona.id_capacitacion, rrhh.capacitacion.lugar, 
                    rrhh.capacitacion.fecha_hora, rrhh.capacitacion_persona.borrado as borrado_capacitacion 
                    from rrhh.persona 
                    inner join rrhh.persona_cargo on rrhh.persona.id_persona = rrhh.persona_cargo.id_persona 
                    left join rrhh.cargo on rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo 
                    left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
                    left join core.region on core.comuna.id_region = core.region.id_region 
                    left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region 
                    left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona 
                    left join rrhh.capacitacion_persona on rrhh.persona.id_persona = rrhh.capacitacion_persona.id_persona 
                    left join rrhh.capacitacion on rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
                    where  rrhh.cargo.id_cargo != 1003
                        and rrhh.cargo.id_cargo != 1004 
                        and rrhh.cargo.id_cargo != 13 
                        and rrhh.persona.borrado = false
                        and rrhh.persona.modificado = true 
                        and rrhh.persona.estado_proceso = 'capacitado'
                        and rrhh.persona_cargo.borrado = false
                    and zona.id_zona in (".implode($zonas,",").")
                    GROUP BY rrhh.persona.id_persona,core.comuna.nombre,core.region.nombre, infraestructura.zona.nombre, rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion.lugar,
                    rrhh.capacitacion.fecha_hora,core.region.orden_geografico
                    ORDER BY infraestructura.zona.nombre asc, 
                        core.region.orden_geografico asc, 
                        core.comuna.nombre asc");

            foreach ($personaCapacitadas as $index => $per) {

                $personaCapacitadas[$index]->pruebas = isset($listaAnidadaPruebas[$per->id_capacitacion_persona])?$listaAnidadaPruebas[$per->id_capacitacion_persona]:null;
            }   


            $regCapacitaciones = DB::select("SELECT r.numero as numero_region, r.nombre as nombre_region , co.id_comuna, co.nombre
                        from core.region r
                        INNER JOIN core.comuna co ON (r.id_region = co.id_region)
                        INNER JOIN infraestructura.zona_region zr ON (r.id_region = zr.id_region)
                        INNER JOIN infraestructura.zona z ON (zr.id_zona = z.id_zona)
                        where r.numero != '-1' 
                            and z.id_zona in (".implode($zonas,",").")
                        order by r.orden_geografico, co.nombre");

            foreach ($regCapacitaciones as $key => $value) {
                $listaAnidadaCap[$value->numero_region][] = $value;
            }

            foreach ($listaAnidadaCap as $id_region => $comunas) {
                $region["id_region"]  = $comunas[0]->numero_region;
                $region["nombre"]  = $comunas[0]->nombre_region;
                $_comunas = array();
                foreach ($comunas as $value) {
                    $_comunas[] = $value;
                }
                $region["comunas"]  = $_comunas;
                $finalRegCapacitaciones[] = $region;
            }


            $relatores = DB::select("select rrhh_p.nombres, rrhh_p.apellido_paterno, rrhh_p.apellido_materno,rrhh_p.id_persona, core.comuna.id_comuna,
               core.comuna.nombre as comuna, core.region.nombre as region, rrhh_p.run, (select count(c.id_capacitacion) from rrhh.capacitacion as c
                      where c.id_relator= rrhh_p.id_persona
                      group by c.id_relator) as capacitaciones
                from rrhh.persona  as rrhh_p
                left join core.usuario on rrhh_p.id_usuario = core.usuario.id_usuario 
                left join core.comuna on rrhh_p.id_comuna_postulacion = core.comuna.id_comuna 
                left join core.region on core.comuna.id_region = core.region.id_region 
                left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region 
                left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona 
                where core.usuario.id_tipo_usuario = 1052
                    and rrhh_p.borrado = false 
                    and zona.id_zona in (".implode($zonas,",").")
                order by core.comuna.nombre asc");
            /*
            foreach ($relatores as $key => $value) {
                $listaAnidadaR[$value->id_comuna][] = $value;
            }*/

        }
 
        $datos['personal_postulacion'] = $personaP;
        $datos['lista_capacitados'] = $personaCapacitadas;
        $datos['regiones'] = $listaFinal;
        $datos['regiones_postulante'] = $listaFinalPostulante;
        $datos['regiones_capacitacion'] = $finalRegCapacitaciones;
        $datos['lista_reladores'] = $relatores;
        /*$datos['relatores'] = $listaAnidadaR;*/
        $datos['capacitaciones'] = $listaAnidadaC;
        $datos['lista_capacitacion'] = $listaCapacitaciones;
        $datos['sexo'] = $sexo;
        $datos['estadoCivil'] = $estadoCivil;
        $datos['institucion'] = $institucion ;
        return response()->json($datos);    
    }

    public function modificarCapacitacion(Request $request){

        $post = $request->all();

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_capacitacion' => 'required|int'
    
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }
     
        $capacitacion = Capacitacion::where('id_capacitacion',$post['id_capacitacion'])
            ->join('core.comuna','rrhh.capacitacion.id_comuna','=','core.comuna.id_comuna')
            ->join('core.region','core.comuna.id_region','=','core.region.id_region')
            ->select('rrhh.capacitacion.archivo_nombre','rrhh.capacitacion.archivo_mimetype','rrhh.capacitacion.borrado','rrhh.capacitacion.capacidad','rrhh.capacitacion.fecha_hora','rrhh.capacitacion.id_capacitacion','rrhh.capacitacion.id_comuna','rrhh.capacitacion.id_relator','rrhh.capacitacion.lugar','rrhh.capacitacion.observacion','rrhh.capacitacion.asistentes','rrhh.capacitacion.asistentes','core.region.id_region','core.comuna.id_comuna')
            ->first();
       
        if (empty($capacitacion)) {
            return response()->json(['resultado'=>'error','descripcion'=>'No se encuentra la Persona']);
        }else{
            return response()->json($capacitacion);  
        }
    }

    public function guardar(Request $request){

        $post = $request->all();

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_comuna' => 'required|int',
            'id_relator' => 'required|int',
            'lugar' => 'required',
            'fecha' => 'required',
    
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }
     

        if($post['id_capacitacion'] == -1){
            $capacitacion = new Capacitacion;
        }else{
            $capacitacion = Capacitacion::where("id_capacitacion", $post["id_capacitacion"])->first();
        }

        $capacitacion->id_relator = isset($post['id_relator']) ? $post['id_relator'] : $capacitacion->id_relator;
        $capacitacion->id_comuna = isset($post['id_comuna']) ? $post['id_comuna'] : $capacitacion->id_comuna;
        $capacitacion->lugar = isset($post['lugar']) ? $post['lugar'] : $capacitacion->lugar;
        $capacitacion->fecha_hora = isset($post['fecha']) ? $post['fecha'] : $capacitacion->fecha_hora;
        $capacitacion->observacion = isset($post['observacion']) ? $post['observacion'] : null;
        $capacitacion->asistentes = isset($post['asistentes']) ? $post['asistentes'] : 0;
        $capacitacion->capacidad = isset($post['capacidad']) ? $post['capacidad'] : $capacitacion->capacidad;

        if(isset($post['documento']) && $capacitacion->archivo_asistencia == null){
            function diccionarioTipos($mimeType){
                $salida = "";
                switch ($mimeType) {
                    case 'image/jpeg':
                        $salida = "jpg";
                        break;
                    case 'image/png':
                        $salida = "png";
                        break;
                    case 'application/pdf':
                        $salida = "pdf";
                        break;
                    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                        $salida = "docx";
                        break;
                    case 'application/msword':
                        $salida = "doc";
                        break;
                }
                return $salida;
            }

            $documento = $post['documento'];
            $nombreArchivo = $post['nombre_archivo'];

            $imgdata = base64_decode($documento);
            $f = finfo_open();

            $mime_type = finfo_buffer($f, $imgdata, FILEINFO_MIME_TYPE);

            $capacitacion->archivo_asistencia = $documento;
            $capacitacion->archivo_nombre = $nombreArchivo;
            $capacitacion->archivo_mimetype = $mime_type;

            $folderPath = realpath(__DIR__ . '/../../../../..') . "/uploads/";
            if (!file_exists($folderPath)) {
                mkdir($folderPath);
            }
            $pdf = fopen (realpath(__DIR__ . '/../../../../..') . "/uploads/" . $capacitacion->id_capacitacion . "-" .$nombreArchivo. "." . diccionarioTipos($mime_type),'w');
            fwrite ($pdf, $post["documento"]);
            fclose ($pdf);

        }
        DB::beginTransaction();
        try{
           $capacitacion->save();
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
        }

        DB::commit();
        return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
    }

    public function guardarDocumento(Request $request){

        $post = $request->all();

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_capacitacion' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $capacitacion = Capacitacion::where("id_capacitacion", $post["id_capacitacion"])->first();

        if(isset($post['documento']) && $capacitacion->archivo_asistencia == null){
            function diccionarioTipos($mimeType){
                $salida = "";
                switch ($mimeType) {
                    case 'image/jpeg':
                        $salida = "jpg";
                        break;
                    case 'image/png':
                        $salida = "png";
                        break;
                    case 'application/pdf':
                        $salida = "pdf";
                        break;
                    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                        $salida = "docx";
                        break;
                    case 'application/msword':
                        $salida = "doc";
                        break;
                }
                return $salida;
            }

            $documento = $post['documento'];
            $nombreArchivo = $post['nombre_archivo'];

            $imgdata = base64_decode($documento);
            $f = finfo_open();

            $mime_type = finfo_buffer($f, $imgdata, FILEINFO_MIME_TYPE);

            $capacitacion->archivo_asistencia = $documento;
            $capacitacion->archivo_nombre = $nombreArchivo;
            $capacitacion->archivo_mimetype = $mime_type;

            $folderPath = realpath(__DIR__ . '/../../../../..') . "/uploads/";
            if (!file_exists($folderPath)) {
                mkdir($folderPath);
            }
            $pdf = fopen (realpath(__DIR__ . '/../../../../..') . "/uploads/" . $capacitacion->id_capacitacion . "-" .$nombreArchivo. "." . diccionarioTipos($mime_type),'w');
            fwrite ($pdf, $post["documento"]);
            fclose ($pdf);

        }
        DB::beginTransaction();
        try{
           $capacitacion->save();
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
        }

        DB::commit();
        return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
    }

    public function modificarPersona(Request $request){

        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_capacitacion' => 'required|integer', 
            //'id_persona' => 'required|integer',   
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        /*$persona = DB::table('rrhh.persona')
                    ->join('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
                    ->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')

                    ->leftJoin('rrhh.capacitacion_persona', 'rrhh.persona_cargo.id_persona_cargo','=','rrhh.capacitacion_persona.id_persona_cargo')
                    ->leftJoin('rrhh.capacitacion', 'rrhh.capacitacion_persona.id_capacitacion','=','rrhh.capacitacion.id_capacitacion')

                    ->leftJoin('rrhh.capacitacion_prueba', 'rrhh.capacitacion_persona.id_capacitacion_persona','=','rrhh.capacitacion_prueba.id_capacitacion_persona')

                    ->select('rrhh.persona.id_persona','rrhh.persona.nombres','rrhh.persona.apellido_paterno',
                        'rrhh.persona.apellido_materno','rrhh.persona_cargo.id_persona_cargo','rrhh.cargo.nombre_rol',
                        'rrhh.capacitacion_persona.id_capacitacion_persona','rrhh.capacitacion_prueba.id_capacitacion_prueba')
                    ->where('rrhh.persona_cargo.id_cargo','=',$post['id_cargo'])
                    ->where('rrhh.capacitacion_persona.id_capacitacion','=',$post['id_capacitacion'])
                    ->toSql();*/
        $capacitacionPrueba =  DB::table('rrhh.capacitacion_prueba')
                    ->orderBy('prueba','asc')
                    ->get();
        $pruebas = [];
        foreach ($capacitacionPrueba as $prueba) {             
            $pruebas[$prueba->id_capacitacion_persona][] = $prueba;
        }

  
 
        /*$persona = DB::select("select rrhh.persona.id_persona, rrhh.persona.nombres, rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno, 
            rrhh.persona_cargo.id_persona_cargo, rrhh.cargo.nombre_rol, rrhh.capacitacion_persona.id_capacitacion_persona
            from rrhh.persona 
            inner join rrhh.persona_cargo on rrhh.persona.id_persona = rrhh.persona_cargo.id_persona 
            left join rrhh.cargo on rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo 
            left join rrhh.capacitacion_persona on rrhh.persona_cargo.id_persona_cargo = rrhh.capacitacion_persona.id_persona_cargo 
            left join rrhh.capacitacion on rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
            where rrhh.persona_cargo.id_cargo = ".$post['id_cargo']."
                and rrhh.capacitacion_persona.id_capacitacion = ".$post['id_capacitacion']);*/
        $persona = DB::table('rrhh.persona')
        /*   ->join('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
                    ->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
        */
                    ->leftJoin('rrhh.capacitacion_persona', 'rrhh.persona.id_persona','=','rrhh.capacitacion_persona.id_persona')
                    ->leftJoin('rrhh.capacitacion', 'rrhh.capacitacion_persona.id_capacitacion','=','rrhh.capacitacion.id_capacitacion')

                    ->select('rrhh.persona.id_persona','rrhh.persona.run','rrhh.persona.nombres','rrhh.persona.apellido_paterno',
                        'rrhh.persona.apellido_materno','rrhh.capacitacion_persona.asistencia','rrhh.capacitacion_persona.estado',
                        'rrhh.capacitacion_persona.id_capacitacion_persona','rrhh.capacitacion.id_capacitacion')
                    //->where('rrhh.persona_cargo.id_cargo','=',$post['id_cargo'])
                    ->where('rrhh.capacitacion_persona.id_capacitacion','=',$post['id_capacitacion'])
                    ->where('rrhh.persona.estado_proceso','=', 'preseleccionado')
                     ->where('rrhh.persona.deserta','=', false)
                    ->where('rrhh.capacitacion_persona.borrado','=',false)
                    ->orderBy('rrhh.persona.nombres','asc')
                    ->orderBy('rrhh.persona.apellido_paterno','asc')
                    ->get();
        foreach ($persona as $index => $per) {             
            $persona[$index]->capacitacion_prueba = isset($pruebas[$persona[$index]->id_capacitacion_persona]) ?
                $pruebas[$persona[$index]->id_capacitacion_persona] : null;
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
            ->select('rrhh.persona.*','rrhh.persona_cargo.id_persona_cargo','rrhh.persona_cargo.id_cargo','rrhh.persona_cargo.estado','core.usuario.usuario','core.usuario.id_usuario')
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
 
    public function cambiarEstado(Request $request){

        $post = $request->all();

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_cargo' => 'required|int', 
            'id_persona_cargo' => 'required|int',
    
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        if($post['id_cargo'] != -1 && $post['estado'] == 'contratado'){
            return response()->json(['resultado'=>'error','descripcion'=>'No tiene autorización para Contratar.']);
        }
        
        $personaCargo = PersonaCargo::where('id_persona_cargo',$post['id_persona_cargo'])->first();
        $personaCargo->estado =  $personaCargo->estado  == 'contratado' ? $personaCargo->estado : 
                                    $personaCargo->estado == 'rechazado' ? $personaCargo->estado : $post['estado'];

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

    public function listaRelator(Request $request)
    {
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',
            'id_persona' => 'required|int',
             
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }
      
        $personaP = DB::select("select DISTINCT 
                    rrhh.persona.*, core.comuna.nombre as comuna, core.region.nombre as region, 
                    infraestructura.zona.nombre as nombre_zona, core.region.orden_geografico,
                    rrhh.capacitacion_persona.id_capacitacion_persona,rrhh.capacitacion_persona.id_capacitacion, rrhh.capacitacion.lugar, rrhh.capacitacion_persona.estado, rrhh.capacitacion_persona.asistencia, 
                    rrhh.capacitacion.fecha_hora, rrhh.capacitacion_persona.borrado as borrado_capacitacion 
                    from rrhh.persona 
                    inner join rrhh.persona_cargo on rrhh.persona.id_persona = rrhh.persona_cargo.id_persona 
                    left join rrhh.cargo on rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo 
                    left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
                    left join core.region on core.comuna.id_region = core.region.id_region 
                    left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region 
                    left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona 
                    left join rrhh.capacitacion_persona on rrhh.persona.id_persona = rrhh.capacitacion_persona.id_persona 
                    left join rrhh.capacitacion on rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
                    where  
                        rrhh.persona.borrado = false
                        and rrhh.persona.modificado = true 
                        and rrhh.persona.estado_proceso = 'preseleccionado'
                        and rrhh.persona_cargo.borrado = false
                        and rrhh.capacitacion_persona.borrado = false
                        and rrhh.capacitacion.id_relator = ".$post['id_persona']."
                    GROUP BY rrhh.persona.id_persona,core.comuna.nombre,core.region.nombre, infraestructura.zona.nombre, rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion.lugar,
                    rrhh.capacitacion.fecha_hora,core.region.orden_geografico
                    ORDER BY infraestructura.zona.nombre asc, 
                        core.region.orden_geografico asc, 
                        core.comuna.nombre asc,
                        rrhh.persona.nombres asc,
                        rrhh.persona.apellido_paterno asc");

        $pruebas = DB::select("SELECT rrhh.capacitacion_prueba.*,rrhh.capacitacion_persona.id_capacitacion_persona,rrhh.capacitacion.id_relator
                    FROM rrhh.capacitacion_prueba,rrhh.capacitacion,rrhh.capacitacion_persona
                    where rrhh.capacitacion_prueba.id_capacitacion_persona = rrhh.capacitacion_persona.id_capacitacion_persona
                    and rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
                    and rrhh.capacitacion.id_relator = ".$post['id_persona']."order by rrhh.capacitacion_prueba.prueba asc");

        foreach ($pruebas as $key => $value) {
                $listaAnidadaPruebas[$value->id_capacitacion_persona][] = $value;
        }
 
        $personaCapacitadas = DB::select("select DISTINCT 
                    rrhh.persona.id_persona,rrhh.persona.run,rrhh.persona.nombres,rrhh.persona.apellido_paterno,rrhh.persona.apellido_materno, core.comuna.nombre as comuna, core.region.nombre as region, infraestructura.zona.nombre as nombre_zona, core.region.orden_geografico,
                    rrhh.capacitacion_persona.id_capacitacion_persona,rrhh.capacitacion_persona.id_capacitacion, rrhh.capacitacion.lugar, 
                    rrhh.capacitacion.fecha_hora, rrhh.capacitacion_persona.borrado as borrado_capacitacion,rrhh.capacitacion_persona.estado, rrhh.capacitacion_persona.asistencia  
                    from rrhh.persona 
                    inner join rrhh.persona_cargo on rrhh.persona.id_persona = rrhh.persona_cargo.id_persona 
                    left join rrhh.cargo on rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo 
                    left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
                    left join core.region on core.comuna.id_region = core.region.id_region 
                    left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region 
                    left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona 
                    left join rrhh.capacitacion_persona on rrhh.persona.id_persona = rrhh.capacitacion_persona.id_persona 
                    left join rrhh.capacitacion on rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
                    left join rrhh.capacitacion_prueba on rrhh.capacitacion_persona.id_capacitacion_persona = rrhh.capacitacion_prueba.id_capacitacion_persona 
                    where  rrhh.persona.borrado = false
                        and rrhh.persona.modificado = true 
                        and rrhh.persona.estado_proceso = 'capacitado'
                        and rrhh.persona_cargo.borrado = false
                        and rrhh.capacitacion_persona.borrado = false
                        and rrhh.capacitacion.id_relator = ".$post['id_persona']."
                    GROUP BY rrhh.persona.id_persona,core.comuna.nombre,core.region.nombre, infraestructura.zona.nombre, rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion.lugar,
                    rrhh.capacitacion.fecha_hora,core.region.orden_geografico
                    ORDER BY infraestructura.zona.nombre asc, 
                        core.region.orden_geografico asc, 
                        core.comuna.nombre asc,
                        rrhh.persona.nombres asc,
                        rrhh.persona.apellido_paterno asc");

        foreach ($personaCapacitadas as $index => $per) {

                $personaCapacitadas[$index]->pruebas = isset($listaAnidadaPruebas[$per->id_capacitacion_persona])?$listaAnidadaPruebas[$per->id_capacitacion_persona]:null;
        }
 
 
     /*   $listaCapacitaciones = DB::table('rrhh.capacitacion')
            ->leftJoin('rrhh.persona_cargo' , 'rrhh.capacitacion.id_relator','=','rrhh.persona_cargo.id_persona_cargo')
            ->leftJoin('rrhh.persona' , 'rrhh.persona_cargo.id_persona','=','rrhh.persona.id_persona')
            ->leftJoin('core.comuna' , 'rrhh.capacitacion.id_comuna','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->select('rrhh.capacitacion.*','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno')
            ->where('rrhh.capacitacion.id_relator','=', $post['id_persona'])
            ->orderBy('core.region.orden_geografico','asc')
            ->orderBy('core.comuna.nombre','asc')
            ->get();*/

            $listaCapacitaciones = DB::select("select rrhh_c.asistentes, rrhh_c.id_capacitacion, rrhh_c.archivo_nombre, rrhh_c.archivo_mimetype, rrhh_c.borrado, rrhh_c.capacidad, rrhh_c.fecha_hora, rrhh_c.id_comuna, rrhh_c.id_relator, rrhh_c.lugar, rrhh_c.observacion, rrhh_c.asistentes, core.comuna.nombre as comuna, core.region.nombre as region, core.region.id_region, rrhh.persona.nombres,
                rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno, 
                
					(select count(p.id_capacitacion) from rrhh.capacitacion_persona as p
                        where p.id_capacitacion = rrhh_c.id_capacitacion
						and p.borrado = false
                        group by p.id_capacitacion) as convocados, 

                    (select count(p.id_persona) as confirmados from rrhh.capacitacion as c left join rrhh.capacitacion_persona as p
                        on (c.id_capacitacion = p.id_capacitacion) where confirma_asistencia = 1
                        and c.id_capacitacion = rrhh_c.id_capacitacion
						and p.borrado = false
                        group by c.id_capacitacion) as confirmados,
					(select count(rrhh.capacitacion_persona.id_persona) from rrhh.capacitacion_persona where estado = true 
						and rrhh.capacitacion_persona.id_capacitacion = rrhh_c.id_capacitacion
						and rrhh.capacitacion_persona.borrado = false
						group by rrhh.capacitacion_persona.id_capacitacion ) as aprobados						
						
            from rrhh.capacitacion as rrhh_c
            left join rrhh.persona on rrhh_c.id_relator = rrhh.persona.id_persona
            left join core.comuna on rrhh_c.id_comuna = core.comuna.id_comuna
            left join core.region on core.comuna.id_region = core.region.id_region
            left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region
            left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona
            where rrhh_c.id_relator =  ".$post['id_persona']." and rrhh_c.borrado = false
            order by rrhh_c.borrado asc, core.region.orden_geografico asc, core.comuna.nombre asc");

        $datos['personal_capacitacion'] = $personaP;
        $datos['lista_capacitados'] = $personaCapacitadas;
        $datos['lista_capacitacion'] = $listaCapacitaciones;
       
        return response()->json($datos);    
    }
	
    public function obtenerPersonal(Request $request)
    {
        $post = $request->all();    
        //capacitaciones por cargo?
        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',
            'id_region' => 'required|int',
           // 'id_cargo' => 'required|int',
            'id_capacitacion' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $cap = Capacitacion::where('id_capacitacion',$post['id_capacitacion'])->first();
 
        if(date('Y-m-d H:i:s') > $cap->fecha_hora) //capacitacion pasada. no hay nada que hacer
        {
			//consultamos la tabla capacitación persona incluyendo a todos los convocados

					$personaP = DB::select("select rrhh.persona.run, rrhh.persona.nombres, rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno, rrhh.persona.telefono,
						rrhh.persona.id_persona, core.comuna.nombre as comuna, core.region.id_region,core.region.nombre as region, core.region.orden_geografico,
						rrhh_cp.id_capacitacion, rrhh.persona.estado_proceso, rrhh_cp.confirma_asistencia, rrhh_cp.estado,
						
						(select count(id_persona) from rrhh.capacitacion_persona where estado = false AND rrhh.capacitacion_persona.id_persona = rrhh_cp.id_persona 
						group by rrhh.capacitacion_persona.id_persona )	as veces_reprobada									
						
						from rrhh.persona 
						left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
						left join core.region on core.comuna.id_region = core.region.id_region 
						left join rrhh.capacitacion_persona as rrhh_cp on rrhh.persona.id_persona = rrhh_cp.id_persona 
						left join rrhh.capacitacion on rrhh_cp.id_capacitacion = rrhh.capacitacion.id_capacitacion 
						
						where core.region.id_region = ".$post['id_region']."
						and rrhh.persona.borrado = false
                        and rrhh.persona.borrado = false
						and rrhh.persona.modificado = true
						and rrhh_cp.borrado = false
						and rrhh_cp.id_capacitacion = ".$post['id_capacitacion']."
						order by core.region.orden_geografico asc,core.comuna.nombre asc, rrhh.persona.nombres asc,rrhh.persona.apellido_paterno asc");
        }
		else{ //capacitación futura. Se divide en 2. Los que ya se convocaron y los que son convocables.
		
			//primero los ya convocados.... luego union con los convocables
			$personaP = DB::select("(select rrhh.persona.run, rrhh.persona.nombres, rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno, rrhh.persona.telefono,
					rrhh.persona.id_persona, core.comuna.nombre as comuna, core.region.id_region,core.region.nombre as region, core.region.orden_geografico,
					rrhh_cp.id_capacitacion, rrhh.persona.estado_proceso, rrhh_cp.confirma_asistencia	, rrhh_cp.estado,
					
					(select count(id_persona) from rrhh.capacitacion_persona where estado = false AND rrhh.capacitacion_persona.id_persona = rrhh_cp.id_persona 
					group by rrhh.capacitacion_persona.id_persona )	as veces_reprobada									
					
				from rrhh.persona 
				left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
				left join core.region on core.comuna.id_region = core.region.id_region 
				left join rrhh.capacitacion_persona as rrhh_cp on rrhh.persona.id_persona = rrhh_cp.id_persona 
				left join rrhh.capacitacion on rrhh_cp.id_capacitacion = rrhh.capacitacion.id_capacitacion 
				where core.region.id_region = ".$post['id_region']."
					and rrhh.persona.borrado = false
					and estado_proceso = 'preseleccionado'
					and rrhh.persona.modificado = true
					and rrhh_cp.borrado = false
					and rrhh_cp.id_capacitacion = ".$post['id_capacitacion']."
				order by core.region.orden_geografico asc,core.comuna.nombre asc, rrhh.persona.nombres asc,rrhh.persona.apellido_paterno asc)
				
				union 
				(
				select rrhh_p.run, rrhh_p.nombres, rrhh_p.apellido_paterno, rrhh_p.apellido_materno, rrhh_p.telefono,
					rrhh_p.id_persona, core.comuna.nombre as comuna, core.region.id_region,core.region.nombre as region, core.region.orden_geografico,
					null as id_capacitacion, rrhh_p.estado_proceso, null as confirma_asistencia, null as estado,
					(select count(id_persona) from rrhh.capacitacion_persona where estado = false AND rrhh.capacitacion_persona.id_persona = rrhh_p.id_persona 
					group by rrhh.capacitacion_persona.id_persona )	as veces_reprobada		
					
				from rrhh.persona as rrhh_p 
				left join core.comuna on rrhh_p.id_comuna_postulacion = core.comuna.id_comuna 
				left join core.region on core.comuna.id_region = core.region.id_region 
				where core.region.id_region = ".$post['id_region']."
					and rrhh_p.borrado = false
					and estado_proceso = 'preseleccionado'
					and rrhh_p.modificado = true
					and rrhh_p.id_persona not in (select id_persona from rrhh.capacitacion_persona where id_capacitacion_persona not in (select id_capacitacion_persona from rrhh.capacitacion_prueba) and id_capacitacion in (select id_capacitacion from rrhh.capacitacion where fecha_hora < now()))  										
					and rrhh_p.id_persona not in (select id_persona from rrhh.capacitacion_persona where estado = true)
					and rrhh_p.id_persona not in (select id_persona from rrhh.capacitacion_persona where capacitacion_persona.id_capacitacion != ".$post['id_capacitacion']."
					AND capacitacion_persona.id_capacitacion not in (select rrhh.capacitacion.id_capacitacion from rrhh.capacitacion where fecha_hora < now()	))										
					
					and rrhh_p.id_persona not in (
					
				select rrhh.persona.id_persona from rrhh.persona 
				left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
				left join core.region on core.comuna.id_region = core.region.id_region 
				left join rrhh.capacitacion_persona on rrhh.persona.id_persona = rrhh.capacitacion_persona.id_persona 
				left join rrhh.capacitacion on rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
				where core.region.id_region = ".$post['id_region']."
					and rrhh.persona.borrado = false
					and estado_proceso = 'preseleccionado'
					and rrhh.persona.modificado = true
					and rrhh.capacitacion_persona.borrado = false
					and rrhh.capacitacion_persona.id_capacitacion = ".$post['id_capacitacion']." )
					
				order by core.region.orden_geografico asc,core.comuna.nombre asc, rrhh_p.nombres asc,rrhh_p.apellido_paterno asc)");
        }
           
        $url = url()->current();
        $aux_ruta = explode("//", $url);
        $aux2_ruta = explode(".iie.cl", $aux_ruta[1]);
        $ruta = $aux2_ruta[0];
        $final = [];
        foreach ($personaP as $value) {
            if($value->id_capacitacion != null){
                $idCapPersona = CapacitacionPersona::where("id_persona", $value->id_persona)->where("id_capacitacion", $value->id_capacitacion)->first()->id_capacitacion_persona;
            }
            $aux["run"] = $value->run;
            $aux["nombres"] = $value->nombres;
            $aux["apellido_paterno"] = $value->apellido_paterno;
            $aux["apellido_materno"] = $value->apellido_materno;
            $aux["id_persona"] = $value->id_persona;
            $aux["comuna"] = $value->comuna;
            $aux["id_region"] = $value->id_region;
            $aux["region"] = $value->region;
            $aux["orden_geografico"] = $value->orden_geografico;
            $aux["id_capacitacion"] = $value->id_capacitacion;
            $aux["estado_proceso"] = $value->estado_proceso;
            $aux["confirma_asistencia"] = $value->confirma_asistencia;
            $aux["estado"] = $value->estado;
            $aux["telefono"] = $value->telefono;
            $aux["veces_reprobada"] = $value->veces_reprobada;

            if(isset($idCapPersona)){
                $encriptado = $this->encriptar($idCapPersona);
                $aux["link_confirmacion"] = "https://" . $ruta . ".iie.cl/public/web_ecep/confirma_capacitacion.html?idCapPersona=".$encriptado;
            }else{
                $aux["link_confirmacion"] = null;
            }
            $final[] = $aux;
            unset($idCapPersona);
        }
        $datos['personal_capacitacion'] = $final;
        return response()->json($datos);    
    }

    public function obtenerPersonalConvocado(Request $request)
    {
        $post = $request->all();    
        //capacitaciones por cargo?
        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',
            'id_region' => 'required|int',
           // 'id_cargo' => 'required|int',
            'id_capacitacion' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $cap = Capacitacion::where('id_capacitacion',$post['id_capacitacion'])->first();
 
        if(date('Y-m-d H:i:s') < $cap->fecha_hora){
			//consultamos la tabla capacitación persona incluyendo a todos los convocados
			$personaP = DB::select("select rrhh.persona.run, rrhh.persona.nombres, rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno, 
										rrhh.persona.id_persona, core.comuna.nombre as comuna, core.region.id_region,core.region.nombre as region, core.region.orden_geografico,
										rrhh.capacitacion_persona.id_capacitacion, rrhh.persona.estado_proceso, rrhh.capacitacion_persona.confirma_asistencia, rrhh.capacitacion_persona.estado
									from rrhh.persona 
										left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
										left join core.region on core.comuna.id_region = core.region.id_region 
										left join rrhh.capacitacion_persona on rrhh.persona.id_persona = rrhh.capacitacion_persona.id_persona 
										left join rrhh.capacitacion on rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
									where core.region.id_region = ".$post['id_region']."
										and rrhh.persona.borrado = false
										and rrhh.persona.modificado = true
										and rrhh.capacitacion_persona.borrado = false
										and rrhh.capacitacion_persona.id_capacitacion = ".$post['id_capacitacion']."
										order by core.region.orden_geografico asc,core.comuna.nombre asc, rrhh.persona.nombres asc,rrhh.persona.apellido_paterno asc");
        }else{
            return response()->json(array("resultado"=>"error","descripcion"=>"Capacitación ya fue realizada.")); 
        }

        $datos['personal_capacitacion'] = $personaP;
        return response()->json($datos);    

    }

    public function asignarCapacitacion(Request $request)
    {
        $post = $request->all();    
        //capacitaciones por cargo?
        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',
            'id_capacitacion' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        if(isset($post['personal_capacitacion'])){
            foreach ($post['personal_capacitacion'] as $personal) {
                if($post['id_capacitacion'] != -1){
                    //$capacitacionPersona = CapacitacionPersona::where('id_capacitacion',$post['id_capacitacion'])->where('id_persona',$personal['id_persona'])->first();
             
                    // if(isset($capacitacionPersona)){
                        // $cap = Capacitacion::find($post['id_capacitacion']);
                        // $persona = Persona::find($capacitacionPersona->id_persona);
                        // $nombre_completo = $persona->nombres . " " . $persona->apellido_paterno;
                        // $correo = $persona->email;
                        // $lugar = $cap->lugar;
                        // $fecha_hora = $cap->fecha_hora;
                        // if($personal['asignar'] == 1){
                            // //$capacitacionPersona->borrado = false;
                        // }
						// else{
                            // //$capacitacionPersona->borrado = true;
                        // }

                        // try{
                            // $capacitacionPersona->save();
                            // $this->enviarCorreoConfirmacion($correo, $nombre_completo, $fecha_hora, $lugar, $capacitacionPersona->id_capacitacion_persona);
                        // }catch (\Exception $e){
                            // DB::rollback();
                            // return response()->json(['resultado'=>'error','descripcion'=>'Error al modificar la asignación. ()'. $e->getMessage()]);
                        // }
               
                    // }
					//else if($personal['asignar'] == 1){
					if($personal['asignar'] == 1){	
						$capacitacionPersona = CapacitacionPersona::where('id_capacitacion',$post['id_capacitacion'])->where('id_persona',$personal['id_persona'])->first();
						if(!isset($capacitacionPersona->id_capacitacion_persona)){
							$newCapacitacionPersona = new CapacitacionPersona;
							$newCapacitacionPersona->id_capacitacion = $post['id_capacitacion'];
							$newCapacitacionPersona->id_persona = $personal['id_persona'];
							// Datos para envío de correo
							$cap = Capacitacion::find($post['id_capacitacion']);
							$persona = Persona::find($personal['id_persona']);
							$nombre_completo = $persona->nombres . " " . $persona->apellido_paterno;
							$correo = $persona->email;
							$lugar = $cap->lugar;
							$fecha_hora = $cap->fecha_hora;
							try{
								$newCapacitacionPersona->save();
								$log = DB::select("SELECT * FROM rrhh.log_correo_capacitacion 
								WHERE id_capacitacion = " . $post['id_capacitacion'] . "
								AND id_persona = " . $persona->id_persona ."
								AND correo = '" . $correo . "'");
								if(sizeof($log) == 0){
									if($this->enviarCorreoConfirmacion($correo, $nombre_completo, $fecha_hora, $lugar, $newCapacitacionPersona->id_capacitacion_persona, null)){
										DB::insert('insert into rrhh.log_correo_capacitacion (id_capacitacion, id_persona, correo) values (?, ?, ?)', 
													[$newCapacitacionPersona->id_capacitacion, $persona->id_persona, $correo]);
									}
								}
							}catch (\Exception $e){
								DB::rollback();
								return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar asignación. ()'. $e->getMessage().' line->'. $e->getLine()]);
							}
							
						}
                    }
                }
				// else{
                    // $capacitacionPersona = CapacitacionPersona::where('id_persona',$personal['id_persona'])->first();
                    // try{
                        // $capacitacionPersona->borrado = true;
                        // $capacitacionPersona->save();
                    // }catch (\Exception $e){
                        // DB::rollback();
                        // return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar asignación. ()'. $e->getMessage()]);
                    // }
                // }
 
            }
            DB::commit();
        	return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
        }
    }

    public function notificarCapacitacionPorCorreo(Request $request)
    {
        $post = $request->all();    
        //capacitaciones por cargo?
        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',
            'id_capacitacion' => 'required|int',
            'correo_copia' => 'email||nullable'
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }
    
        if(isset($post['personal_capacitacion'])){
            foreach ($post['personal_capacitacion'] as $personal) {
                if($post['id_capacitacion'] != -1){
					if($personal['asignar'] == 1){	
                        $capacitacionPersona = CapacitacionPersona::where('id_capacitacion',$post['id_capacitacion'])
                                                ->where('id_persona',$personal['id_persona'])
                                                ->first();

                        // Datos para envío de correo
                        $cap = Capacitacion::find($post['id_capacitacion']);
                        $persona = Persona::find($personal['id_persona']);
                        $nombre_completo = $persona->nombres . " " . $persona->apellido_paterno;
                        $correo = $persona->email;
                        $lugar = $cap->lugar;
                        $fecha_hora = $cap->fecha_hora;
                        try{
                            if(!$this->enviarCorreoConfirmacion($correo, $nombre_completo, $fecha_hora, $lugar, $capacitacionPersona->id_capacitacion_persona, $post["correo_copia"])){
                                return response()->json(["resultado"=>"error","descripcion"=>"Error al enviar correos."]);
                            }
                        }catch (\Exception $e){
                            DB::rollback();
                            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar asignación. ()'. $e->getMessage().' line->'. $e->getLine()]);
                        }
                    }
                }
            }
            DB::commit();
        	return response()->json(["resultado"=>"ok","descripcion"=>"correos enviados con éxito."]);
        }
    }
 
    public function desertar(Request $request)
    {
        $post = $request->all();    
        //capacitaciones por cargo?
        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',
            'id_persona' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $persona = Persona::where('id_persona',$post['id_persona'])->first();

        if(isset($persona)){
            try{
                $persona->deserta = true;
                $persona->save();
            }catch (\Exception $e){
                DB::rollback();
                return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
            }

            DB::commit();
            return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
        }
    }

    public function desconvocar(Request $request)
    {
        $post = $request->all();    
        //capacitaciones por cargo?
        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',
            'id_capacitacion' => 'required|int',
            'id_persona' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $capacitacionPersona = CapacitacionPersona::
                join('rrhh.capacitacion','rrhh.capacitacion.id_capacitacion','=','rrhh.capacitacion_persona.id_capacitacion')
                ->where('rrhh.capacitacion_persona.id_persona',$post['id_persona'])
                ->where('rrhh.capacitacion_persona.id_capacitacion',$post['id_capacitacion'])
                ->select('rrhh.capacitacion_persona.*','rrhh.capacitacion.fecha_hora')
                ->first();

        if(isset($capacitacionPersona)){

            $capacitacionPrueba = CapacitacionPrueba::where('id_capacitacion_persona',$capacitacionPersona->id_capacitacion_persona)->get();

            if(count($capacitacionPrueba) > 0){
                return response()->json(array("resultado"=>"error","descripcion"=>"No puede desconvocar si ya fue evaluado en la capacitación.", 422));   
            }

            if(date('Y-m-d H:i:s') > $capacitacionPersona->fecha_hora) {
                return response()->json(array("resultado"=>"error","descripcion"=>"No puede desconvocar de una capacitación que ya se realizó.", 422));   
            }

            if($capacitacionPersona->confirma_asistencia == 1) {
                return response()->json(array("resultado"=>"error","descripcion"=>"No puede desconvocar ya que confirmo su asistencia.", 422));   
            }

            try{
                $capacitacionPersona->delete();
            }catch (\Exception $e){
                DB::rollback();
                return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar desconvocar. ()'. $e->getMessage()]);
            }
           
         
            DB::commit();
            return response()->json(["resultado"=>"ok","descripcion"=>"Se ha desconvocado con exito"]);
        }
    }

    public function evaluacion(Request $request)
    {
        $post = $request->all();    
        //capacitaciones por cargo?
        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',
            'id_capacitacion' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        if(isset($post['evaluado'])){
            foreach ($post['evaluado'] as $evaluado) {
                $capacitacionPersona = CapacitacionPersona::where('id_persona',$evaluado['id_persona'])
                ->where('id_capacitacion',$evaluado['id_capacitacion'])
                ->first();
 
                if(!isset( $capacitacionPersona)){
                    return response()->json(array("resultado"=>"error","descripcion"=>"La persona no existe", 422)); 
                }

                if($evaluado['puntaje_psicologica'] != 1 && $evaluado['estado'] == 'true'){
                    return response()->json(array("resultado"=>"error","descripcion"=>"No puede Aprobar si no es recomendado en la Prueba Psicologica", 422)); 
                }

                if($evaluado['estado'] == 'true' && $evaluado['asistencia'] != 'true'){
                    return response()->json(array("resultado"=>"error","descripcion"=>"No puede Aprobar, si no registra que asistio", 422)); 
                }

                if($evaluado['estado'] == 'true' &&  $evaluado['puntaje_contenido'] < 90){
                    return response()->json(array("resultado"=>"error","descripcion"=>"No puede Aprobar, si no cumple con el puntaje de la prueba Técnica", 422));
                }

                $capacitacionPersona->asistencia  = $evaluado['asistencia'] == -1 ? null : $evaluado['asistencia'];
                $capacitacionPersona->estado  = $evaluado['estado'] == -1 ? null : $evaluado['estado'];

                $capacitacionPrueba = CapacitacionPrueba::where('id_capacitacion_persona',$evaluado['id_capacitacion_persona'])
                    ->get();
 
                try{

                    $capacitacionPersona->save();
					
					//si el estado es aprobado se marca como capacitado true
					$_p = Persona::find($evaluado['id_persona']);
					if($evaluado['estado']=='true'){
						$_p->estado_proceso = 'capacitado';	

					}else if($evaluado['puntaje_psicologica'] == 0){
                        $_p->estado_proceso = 'rechazado';

                    }else{
						$_p->estado_proceso = 'preseleccionado';	
					}
					$_p->save();

                }catch (\Exception $e){
                    DB::rollback();
                    return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar Evaluación. ()'. $e->getMessage()]);
                }
 
                if(count($capacitacionPrueba) > 0){

                    try{
                        foreach ($capacitacionPrueba as $prueba) {
                            if($prueba->prueba == 'Psicologica'){
                                /*$prueba->nota = $evaluado['nota_psicologica'];*/
                               // $prueba->estado = $evaluado['estado_psicologica'] == -1 ? null : $evaluado['estado_psicologica'] ;
                                $prueba->puntaje = $evaluado['puntaje_psicologica'];
                            }else{
                                /*$prueba->nota = $evaluado['nota_contenido'];*/
                               // $prueba->estado = $evaluado['estado_contenido'] == -1 ? null : $evaluado['estado_contenido'];
                                $prueba->puntaje = $evaluado['puntaje_contenido'];
                            }

                            $prueba->save();
                        }

                    }catch (\Exception $e){
                        DB::rollback();
                        return response()->json(['resultado'=>'error','descripcion'=>'Error al modificar la Evaluación. ()'. $e->getMessage()]);
                    }
                }else{

                    try{
                        $capacitacionPrueba = new CapacitacionPrueba;
                        //$capacitacionPrueba->nota = $evaluado['nota_psicologica'];
                        
                       // $capacitacionPrueba->estado = $evaluado['estado_psicologica'] == -1 ? null : $evaluado['estado_psicologica'] ;
                        $capacitacionPrueba->puntaje = $evaluado['puntaje_psicologica'];
                        $capacitacionPrueba->prueba = 'Psicologica';
                        $capacitacionPrueba->id_capacitacion_persona = $evaluado['id_capacitacion_persona']; 
                         
                        $capacitacionPrueba->save();
                        
                        $capacitacionPrueba = new CapacitacionPrueba;
                        //$capacitacionPrueba->nota = $evaluado['nota_contenido'];
                       // $capacitacionPrueba->estado = $evaluado['estado_contenido'] == -1 ? null : $evaluado['estado_contenido'];
                        $capacitacionPrueba->puntaje = $evaluado['puntaje_contenido'];
                        $capacitacionPrueba->prueba = 'Técnica';
                        $capacitacionPrueba->id_capacitacion_persona = $evaluado['id_capacitacion_persona'];
                        
                        $capacitacionPrueba->save();

                    }catch (\Exception $e){
                        DB::rollback();
                        return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar Evaluación. ()'. $e->getMessage()]);
                    }
                }
 
            }
            DB::commit();
            return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
        }
    }

    public function deshabilitarCapacitacion(Request $request)
    {
        $post = $request->all();    
 
        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',
            'id_capacitacion' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        try{

            $cap = Capacitacion::find($post['id_capacitacion']);

            $capacitacionPersona = CapacitacionPersona::where('id_capacitacion',$post['id_capacitacion'])
                                    ->count();

            if($capacitacionPersona > 0){
                return response()->json(['resultado'=>'error','descripcion'=>'No puede deshabilitar una capacitación que tiene personas asignadas.']);
            }

            $cap->borrado = true;
            $cap->save();


        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['resultado'=>'error','descripcion'=>'Error al deshabilitar la capacitación. ()'. $e->getMessage()]);
        }

        DB::commit();
        return response()->json(["resultado"=>"ok","descripcion"=>"Se ha deshabilitado con exito"]);
    }

    public function infoConfirmacion($encrypt)
    {
        if(is_numeric($encrypt)){
            $idCapPersona = $encrypt;
        }else{
            $idCapPersona = $this->desencriptar($encrypt);
        }
        
        $cap = CapacitacionPersona::find($idCapPersona);
        if(!isset($cap->id_capacitacion_persona)){
            return response()->json(["resultado"=>"error","descripcion"=>"Capacitación no encontrada."]);    
        }
        $pers = Persona::find($cap->id_persona);
        if(!isset($pers->id_persona)){
            return response()->json(["resultado"=>"error","descripcion"=>"Persona no encontrada."]);    
        }
        $nombre = $pers->nombres . " " . $pers->apellido_paterno;
        return response()->json(["resultado"=>"ok","descripcion"=>$nombre]);
    }

    public function guardarConfirmacion(Request $request)
    {
        $post = $request->all();    
        $validacion = Validator::make($post, [
            'id_capacitacion_persona' => 'required',
            'confirma' => 'required|int',
        ]); 
        if(is_numeric($post["id_capacitacion_persona"])){
            $idCapPers = $post["id_capacitacion_persona"];
        }else{
            $idCapPers = $this->desencriptar($post["id_capacitacion_persona"]);
        }
        $cap = CapacitacionPersona::find($idCapPers);
        if(!isset($cap->id_capacitacion_persona)){
            return response()->json(["resultado"=>"error","descripcion"=>"Capacitación no encontrada."]);    
        }
        $cap->confirma_asistencia = $post["confirma"];
        $cap->save();
        return response()->json(["resultado"=>"ok","descripcion"=>"Respuesta guardada"]);
    }

    public function testCorreo(Request $request)
    {
        if($this->enviarCorreoConfirmacion("albertopaillao@gmail.com", "BetoTest", "2019-22-11", "DireccionTest", 14, 'natyvtot@gmail.com')){
            echo "Correo Enviado";
        }else{
            echo "[ERROR] Correo no Enviado";
        }
    }

    function encriptar($dato){
        $clave  = 'Anita lava la tina';
        //Metodo de encriptación
        $method = 'aes-256-cbc';
        // Puedes generar una diferente usando la funcion $getIV()
        $iv = base64_decode("C9fBxl1EWtYTL12M8jfstw==");
        /*
        Encripta el contenido de la variable, enviada como parametro.
        */
        $encrypt = openssl_encrypt ($dato, $method, $clave, false, $iv);
        $url_safe_base64 = strtr($encrypt, "+/", "-_" );
        return $url_safe_base64;
    }

    function desencriptar($dato){
        $clave  = 'Anita lava la tina';
        //Metodo de encriptación
        $method = 'aes-256-cbc';
        // Puedes generar una diferente usando la funcion $getIV()
        $iv = base64_decode("C9fBxl1EWtYTL12M8jfstw==");
        //Desencripta
        $base64_string = strtr( $dato, "-_", "+/" );
        return openssl_decrypt($base64_string, $method, $clave, false, $iv);
    }

    function enviarCorreoConfirmacion($correo, $nombre, $fecha, $direccion, $idCapPersona, $correoCopia){
        $url = url()->current();
        $aux_ruta = explode("//", $url);
        $aux2_ruta = explode(".iie.cl", $aux_ruta[1]);
        $ruta = $aux2_ruta[0];

        $encriptado = $this->encriptar($idCapPersona);
        
        $path_files = realpath('') . '/archivos/';

        $subject = "Capacitación - Evaluación Conocimientos Específicos y Pedagógicos";
        $html = "
        <p>Estimado/a " . $nombre . " </p>
        <p>Usted ha sido preseleccionado/a para participar en la Evaluación de Conocimientos Específicos y Pedagógicos, ECEP 2019.</p>
        <p>Le informamos que está cordialmente invitado a la Capacitación de carácter obligatorio para postulantes a ECEP 2019.</p>
        <p>     Fecha/Hora: <b>" . $fecha . "</b></p>
        <p>     Lugar: <b>" . $direccion . "</b></p>
        <p>Esta tiene una duración aproximada de 4 horas y finaliza con 2 evaluaciones complementarias al proceso de selección.
        <p>Es importante que lea el manual de aplicación adjunto por si surge alguna duda respecto al proceso y pueda resolverla en la capacitación, cabe mencionar que este es de conocimiento general independiente al Rol al cual esté postulando. Adjuntamos también un acuerdo de confidencialidad a modo informativo y de lectura previa, el cual debe firmar el día de la capacitación.</p>
        <p>Le sugerimos que lleve lápiz y papel para que pueda tomar notas.</p>
        <p>Por favor, <b>confirme si puede asistir a la capacitación.</b> En el caso de no poder asistir, podrá ser convocado a una próxima instancia de capacitación.</p>
        <p>Confirme en el siguiente enlace: https://".$ruta.".iie.cl/public/web_ecep/confirma_capacitacion.html?idCapPersona=".$encriptado."</p>
		<br>
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
            $mail->Password = 'Z@@@@@@········:·;·;:·:·;··$$%%@@@;···;·;·;@@m#k1llk1ll@@@##bk1;;;####ll···:;·;·;·;3;:·######····$$%··$%%·$·%&&$$$$$$@@@@@@';
			$mail->setFrom("no-reply@ecep2019.iie.cl", "ECEP");
			$mail->Subject = $subject;
			$mail->MsgHTML($html);
            $mail->addAddress($correo, $nombre);
            if($correoCopia != null || $correoCopia != ''){
                $mail->addBCC($correoCopia, "");
            }
            $mail->addBCC("alberto.paillao@iie.cl", "Alberto Paillao");
            $mail->addAttachment($path_files."Acuerdo confidencialidad POSTULANTE ECEP s.f.pdf");
            $mail->addAttachment($path_files."Manual aplicación 2019_2410.pdf");
            if (strpos($ruta, 'ecep2019') !== false) {
                $mail->send();
            }
            //PARA DEBUG
            if ($correo == 'albertopaillao@gmail.com') {
                $mail->Username = "desarrollo@ecep2019.iie.cl";
                $mail->Password = 'dTVsNTR1NH@@@@@···;;;;;;""";";";ZyeW8w';
                $mail->setFrom("desarrollo@ecep2019.iie.cl", "ECEP");
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
