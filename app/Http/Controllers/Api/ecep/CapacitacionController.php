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
                 ->select('rrhh.capacitacion.*','core.region.id_region')
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
	                rrhh.persona.*, core.comuna.nombre as comuna, core.region.nombre as region, 
	                infraestructura.zona.nombre as nombre_zona, core.region.orden_geografico,
	                rrhh.capacitacion_persona.id_capacitacion_persona,rrhh.capacitacion_persona.id_capacitacion, rrhh.capacitacion.lugar, core.region.id_region as id_region_postulacion,
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

	        $listaCapacitaciones = DB::select("select rrhh_c.*, rrhh_c.id_capacitacion ,core.comuna.nombre as comuna, core.region.nombre as region, core.region.id_region, rrhh.persona.nombres,
                rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno, 
                    (select count(p.id_capacitacion) from rrhh.capacitacion_persona as p
                        where p.id_capacitacion = rrhh_c.id_capacitacion
                        group by p.id_capacitacion) as convocados, 
                    (select count(p.id_persona) as confirmados from rrhh.capacitacion as c left join rrhh.capacitacion_persona as p
                        on (c.id_capacitacion = p.id_capacitacion) where confirma_asistencia = 1
                        and c.id_capacitacion = rrhh_c.id_capacitacion
                        group by c.id_capacitacion) as confirmados
            from rrhh.capacitacion as rrhh_c
            left join rrhh.persona on rrhh_c.id_relator = rrhh.persona.id_persona
            left join core.comuna on rrhh_c.id_comuna = core.comuna.id_comuna
            left join core.region on core.comuna.id_region = core.region.id_region
            left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region
            left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona
            where infraestructura.zona.id_zona in (".implode($zonas,",").")
            order by core.region.orden_geografico asc, core.comuna.nombre asc");


            $pruebas = DB::select("SELECT rrhh.capacitacion_prueba.*,rrhh.capacitacion_persona.id_capacitacion_persona,rrhh.capacitacion.id_relator
                    FROM rrhh.capacitacion_prueba,rrhh.capacitacion,rrhh.capacitacion_persona
                    where rrhh.capacitacion_prueba.id_capacitacion_persona = rrhh.capacitacion_persona.id_capacitacion_persona
                    and rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
                    order by rrhh.capacitacion_prueba.prueba asc");

            foreach ($pruebas as $key => $value) {
                    $listaAnidadaPruebas[$value->id_capacitacion_persona][] = $value;
            }

            $personaCapacitadas = DB::select("select DISTINCT 
                    rrhh.persona.*, core.comuna.nombre as comuna, core.region.nombre as region, 
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
                   and zona.id_zona in (".implode($zonas,",").")
               order by core.region.orden_geografico asc, core.comuna.nombre asc");

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
                 ->select('rrhh.capacitacion.*','core.region.id_region')
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
                    rrhh.capacitacion_persona.id_capacitacion_persona,rrhh.capacitacion_persona.id_capacitacion, rrhh.capacitacion.lugar, core.region.id_region as id_region_postulacion,
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

    /*        $listaCapacitaciones = DB::select("select rrhh.capacitacion.*, core.comuna.nombre as comuna, core.region.nombre as region, core.region.id_region, rrhh.persona.nombres,
                         rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno 
                    from rrhh.capacitacion 
                    left join rrhh.persona on rrhh.capacitacion.id_relator = rrhh.persona.id_persona 
                    left join core.comuna on rrhh.capacitacion.id_comuna = core.comuna.id_comuna 
                    left join core.region on core.comuna.id_region = core.region.id_region 
                    left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region 
                    left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona 
                    where zona.id_zona in (".implode($zonas,",").")
                    order by core.region.orden_geografico asc, core.comuna.nombre asc");*/

            $listaCapacitaciones = DB::select("select rrhh_c.*, rrhh_c.id_capacitacion ,core.comuna.nombre as comuna, core.region.nombre as region, core.region.id_region, rrhh.persona.nombres,
                rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno, 
                    (select count(p.id_capacitacion) from rrhh.capacitacion_persona as p
                        where p.id_capacitacion = rrhh_c.id_capacitacion
                        group by p.id_capacitacion) as convocados, 
                    (select count(p.id_persona) as confirmados from rrhh.capacitacion as c left join rrhh.capacitacion_persona as p
                        on (c.id_capacitacion = p.id_capacitacion) where confirma_asistencia = 1
                        and c.id_capacitacion = rrhh_c.id_capacitacion
                        group by c.id_capacitacion) as confirmados
            from rrhh.capacitacion as rrhh_c
            left join rrhh.persona on rrhh_c.id_relator = rrhh.persona.id_persona
            left join core.comuna on rrhh_c.id_comuna = core.comuna.id_comuna
            left join core.region on core.comuna.id_region = core.region.id_region
            left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region
            left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona
            where infraestructura.zona.id_zona in (".implode($zonas,",").")
            order by core.region.orden_geografico asc, core.comuna.nombre asc");




            $pruebas = DB::select("SELECT rrhh.capacitacion_prueba.*,rrhh.capacitacion_persona.id_capacitacion_persona,rrhh.capacitacion.id_relator
                    FROM rrhh.capacitacion_prueba,rrhh.capacitacion,rrhh.capacitacion_persona
                    where rrhh.capacitacion_prueba.id_capacitacion_persona = rrhh.capacitacion_persona.id_capacitacion_persona
                    and rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
                    order by rrhh.capacitacion_prueba.prueba asc");

            foreach ($pruebas as $key => $value) {
                    $listaAnidadaPruebas[$value->id_capacitacion_persona][] = $value;
            }

            $personaCapacitadas = DB::select("select DISTINCT 
                    rrhh.persona.*, core.comuna.nombre as comuna, core.region.nombre as region, 
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
            ->select('rrhh.capacitacion.*','core.region.id_region','core.comuna.id_comuna')
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

        $capacitacion->id_relator = $post['id_relator'];
        $capacitacion->id_comuna = $post['id_comuna'];
        $capacitacion->lugar = $post['lugar'];
        $capacitacion->fecha_hora = $post['fecha'];
        $capacitacion->observacion = isset($post['observacion']) ? $post['observacion'] : null;
        $capacitacion->capacidad = $post['capacidad'];

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

                    ->select('rrhh.persona.id_persona','rrhh.persona.nombres','rrhh.persona.apellido_paterno',
                        'rrhh.persona.apellido_materno','rrhh.capacitacion_persona.asistencia','rrhh.capacitacion_persona.estado',
                        'rrhh.capacitacion_persona.id_capacitacion_persona')
                    //->where('rrhh.persona_cargo.id_cargo','=',$post['id_cargo'])
                    ->where('rrhh.capacitacion_persona.id_capacitacion','=',$post['id_capacitacion'])
                    ->where('rrhh.persona.estado_proceso','=', 'preseleccionado')
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

            $listaCapacitaciones = DB::select("select rrhh_c.*, rrhh_c.id_capacitacion ,core.comuna.nombre as comuna, core.region.nombre as region, core.region.id_region, rrhh.persona.nombres,
                rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno, 
                    (select count(p.id_capacitacion) from rrhh.capacitacion_persona as p
                        where p.id_capacitacion = rrhh_c.id_capacitacion
                        group by p.id_capacitacion) as convocados, 
                    (select count(p.id_persona) as confirmados from rrhh.capacitacion as c left join rrhh.capacitacion_persona as p
                        on (c.id_capacitacion = p.id_capacitacion) where confirma_asistencia = 1
                        and c.id_capacitacion = rrhh_c.id_capacitacion
                        group by c.id_capacitacion) as confirmados
            from rrhh.capacitacion as rrhh_c
            left join rrhh.persona on rrhh_c.id_relator = rrhh.persona.id_persona
            left join core.comuna on rrhh_c.id_comuna = core.comuna.id_comuna
            left join core.region on core.comuna.id_region = core.region.id_region
            left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region
            left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona
            where rrhh_c.id_relator =  ".$post['id_persona']."
            order by core.region.orden_geografico asc, core.comuna.nombre asc");

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

        // rrhh.persona.id_comuna_postulacion = ".$post['id_comuna']."
        $personaP = DB::select("select DISTINCT rrhh.persona.run, rrhh.persona.nombres, rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno, 
            rrhh.persona.id_persona, core.comuna.nombre as comuna, core.region.id_region,core.region.nombre as region, core.region.orden_geografico,
            rrhh.capacitacion_persona.id_capacitacion, rrhh.capacitacion_persona.borrado as borrado_capacitacion, rrhh.persona.estado_proceso
        from rrhh.persona 
        left join rrhh.persona_cargo on rrhh.persona.id_persona = rrhh.persona_cargo.id_persona 
        left join rrhh.cargo on rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo 
        left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
        left join core.region on core.comuna.id_region = core.region.id_region 
        left join rrhh.capacitacion_persona on rrhh.persona.id_persona = rrhh.capacitacion_persona.id_persona 
        left join rrhh.capacitacion on rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
        where core.region.id_region = ".$post['id_region']."
            and rrhh.persona.borrado = false
            and rrhh.persona.modificado = true
            and rrhh.persona.estado_proceso = 'preseleccionado'
            and rrhh.persona_cargo.borrado = false
            and (rrhh.capacitacion_persona.borrado is null or rrhh.capacitacion_persona.borrado = false)
            and (rrhh.capacitacion_persona.id_capacitacion is null 
            or rrhh.capacitacion_persona.id_capacitacion = ".$post['id_capacitacion'].")
        GROUP BY rrhh.persona.id_persona, rrhh.capacitacion_persona.id_capacitacion, comuna, borrado_capacitacion ,core.region.id_region 
        order by core.region.orden_geografico asc,core.comuna.nombre asc, rrhh.persona.nombres asc,rrhh.persona.apellido_paterno asc");

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
                    $capacitacionPersona = CapacitacionPersona::where('id_capacitacion',$post['id_capacitacion'])
                                    ->where('id_persona',$personal['id_persona'])
                                    ->first();
             
                    if(isset($capacitacionPersona)){
                        $cap = Capacitacion::find($post['id_capacitacion']);
                        $persona = Persona::find($capacitacionPersona->id_persona);
                        $nombre_completo = $persona->nombres . " " . $persona->apellido_paterno;
                        $correo = $persona->email;
                        $lugar = $cap->lugar;
                        $fecha_hora = $cap->fecha_hora;
                        if($personal['asignar'] == 1){
                            $capacitacionPersona->borrado = false;
                        }else{
                            $capacitacionPersona->borrado = true;
                        }

                        try{
                            $capacitacionPersona->save();
                            $this->enviarCorreoConfirmacion($correo, $nombre_completo, $fecha_hora, $lugar, $capacitacionPersona->id_capacitacion_persona);
                        }catch (\Exception $e){
                            DB::rollback();
                            return response()->json(['resultado'=>'error','descripcion'=>'Error al modificar la asignación. ()'. $e->getMessage()]);
                        }
               
                    }else if($personal['asignar'] == 1){
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
                            $this->enviarCorreoConfirmacion($correo, $nombre_completo, $fecha_hora, $lugar, $newCapacitacionPersona->id_capacitacion_persona);
                        }catch (\Exception $e){
                            DB::rollback();
                            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar asignación. ()'. $e->getMessage()]);
                        }
                    }
                }else{
                    $capacitacionPersona = CapacitacionPersona::where('id_persona',$personal['id_persona'])
                                    ->first();
                    try{
                        $capacitacionPersona->borrado = true;
                        $capacitacionPersona->save();
                    }catch (\Exception $e){
                        DB::rollback();
                        return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar asignación. ()'. $e->getMessage()]);
                    }

                }
 
            }
            DB::commit();
        	return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
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
                $capacitacionPersona = CapacitacionPersona::where('id_persona',$evaluado['id_persona'])->first();
 
                if(!isset( $capacitacionPersona)){
                    return response()->json(array("resultado"=>"error","descripcion"=>"La persona no existe", 422)); 
                }

                $capacitacionPersona->asistencia  = $evaluado['asistencia'] == -1 ? null : $evaluado['asistencia'];
                $capacitacionPersona->estado  = $evaluado['estado'] == -1 ? null : $evaluado['estado'];

                if($capacitacionPersona->estado == 'Aprobado'){
                    $persona = Persona::where('id_persona',$evaluado['id_persona'])->first();
                    $persona->estado_proceso = 'capacitado';
                  
                    try{
                        $persona->save();

                    }catch (\Exception $e){
                        DB::rollback();
                        return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar Estado Proceso. ()'. $e->getMessage()]);
                    }
                }

                $capacitacionPrueba = CapacitacionPrueba::where('id_capacitacion_persona',$evaluado['id_capacitacion_persona'])
                    ->get();
 
                try{

                    $capacitacionPersona->save();
					
					//si el estado es aprobado se marca como capacitado true
					$_p = Persona::find($evaluado['id_persona']);
					if($evaluado['estado']=='true'){
						$_p->estado_proceso = 'capacitado';	
					}
					else{
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

    public function infoConfirmacion($idCapPersona)
    {
        $cap = CapacitacionPersona::find($idCapPersona);
        $pers = Persona::find($cap->id_persona);
        $nombre = $pers->nombres . " " . $pers->apellido_paterno;
        return response()->json(["resultado"=>"ok","descripcion"=>$nombre]);
    }

    public function guardarConfirmacion(Request $request)
    {
        // web/capacitacion/guarda-confirmacion
        $post = $request->all();    
        $validacion = Validator::make($post, [
            'id_capacitacion_persona' => 'required|int',
            'confirma' => 'required|int',
        ]); 

        $cap = CapacitacionPersona::find($post["id_capacitacion_persona"]);
        $cap->confirma_asistencia = $post["confirma"];
        $cap->save();
        return response()->json(["resultado"=>"ok","descripcion"=>"Respuesta guardada"]);
    }

    function enviarCorreoConfirmacion($correo, $nombre, $fecha, $direccion, $idCapPersona){
        $url = url()->current();
        $aux_ruta = explode("//", $url);
        $aux2_ruta = explode(".iie.cl", $aux_ruta[1]);
        $ruta = $aux2_ruta[0];

        $hoy = getdate();
        if($fecha < $hoy){
            $correo = 'mesa_endfid_2019@iie.cl';
        }
        $path_files = realpath('') . '/archivos/';

        $subject = "Preselección - Evaluación Conocimientos Específicos y Pedagógicos";
        $html = "
        <p>Estimado/a " . $nombre . " </p>
        <p>Usted ha sido preseleccionado/a para participar en la Evaluación de Conocimientos Específicos y Pedagógicos, ECEP 2019.</p>
        <p>Le informamos que está cordialmente invitado a la Capacitación de carácter obligatorio para postulantes a ECEP 2019.</p>
        <p>     Fecha/Hora: <b>" . $fecha . "</b></p>
        <p>     Lugar: <b>" . $direccion . "</b></p>
        <p>Esta tiene una duración aproximada de 4 horas y finaliza con 2 evaluaciones complementarias al proceso de selección.
        <p>Es importante que lea el manual de aplicación adjunto por si surge alguna duda respecto al proceso y pueda resolverla en la capacitación, cabe mencionar que este es de conocimiento general independiente al Rol al cual esté postulando. Adjuntamos también un acuerdo de confidencialidad a modo informativo y de lectura previa, el cual debe firmar el día de la capacitación.</p>
        <p>Le sugerimos que lleve lápiz y papel para que pueda tomar notas.</p>
        <p>Por favor, confirme su asistencia en el siguiente enlace: https://".$ruta.".iie.cl/public/web_ecep/confirma_capacitacion.html?idCapPersona=".$idCapPersona."</p>
		<br>
		<p><b>Atentamente</b></p>
        <p><b>Equipo de Aplicación ECEP 2019</b></p>";
        
        $mail = new PHPMailer(true); 

		try {
			$mail->isSMTP(); // tell to use smtp
			$mail->CharSet = "utf-8"; // set charset to utf8
			$mail->SMTPDebug = 3;
			$mail->Debugoutput = 'html';

			$mail->SMTPSecure = "tls"; // tls or ssl
			$mail->SMTPAuth = true;  // use smpt auth
			$mail->Host = "mail.smtp2go.com"; 
			$mail->Port = 2525;//2525; //443; 
			$mail->Username = "reclutamiento@ecep2019.iie.cl";
			$mail->Password = "b2MxemNmczk2MzAw@@@#";
			$mail->setFrom("reclutamiento@ecep2019.iie.cl", "ECEP");
			$mail->Subject = $subject;
			$mail->MsgHTML($html);
			$mail->addAddress($correo, $nombre);
            $mail->addBCC("alberto.paillao@iie.cl", "Alberto Paillao");
            $mail->addAttachment($path_files."Acuerdo confidencialidad POSTULANTE ECEP s.f.pdf");
            $mail->addAttachment($path_files."Manual aplicación 2019_2410.pdf");
			$mail->send();
		} catch (phpmailerException $e) {
			return;
		} catch (Exception $e) {
			return;			
		}
		return true;
    }

}


