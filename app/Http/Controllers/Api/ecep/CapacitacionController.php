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
                 ->select('rrhh.capacitacion.*')
                 ->orderBy('core.comuna.nombre','asc')
                 ->get();

        foreach ($cap as $key => $value) {
            $listaAnidadaC[$value->id_comuna][] = $value;
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
	                    and rrhh.persona.estado_proceso = 'preseleccionado'
                        and rrhh.persona.id_persona not in (select id_persona from rrhh.capacitacion_persona where estado != false)
	                    and rrhh.persona_cargo.borrado = false
					and zona.id_zona in (".implode($zonas,",").")
	                GROUP BY rrhh.persona.id_persona,core.comuna.nombre,core.region.nombre, infraestructura.zona.nombre, rrhh.capacitacion_persona.id_capacitacion_persona, rrhh.capacitacion.lugar,
	                rrhh.capacitacion.fecha_hora,core.region.orden_geografico
	                ORDER BY infraestructura.zona.nombre asc, 
	                    core.region.orden_geografico asc, 
	                    core.comuna.nombre asc");

	        $listaCapacitaciones = DB::select("select rrhh.capacitacion.*, core.comuna.nombre as comuna, core.region.nombre as region, rrhh.persona.nombres,
        				 rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno 
					from rrhh.capacitacion 
					left join rrhh.persona on rrhh.capacitacion.id_relator = rrhh.persona.id_persona 
					left join core.comuna on rrhh.capacitacion.id_comuna = core.comuna.id_comuna 
					left join core.region on core.comuna.id_region = core.region.id_region 
				    left join infraestructura.zona_region on core.region.id_region = infraestructura.zona_region.id_region 
					left join infraestructura.zona on infraestructura.zona_region.id_zona = infraestructura.zona.id_zona 
					where zona.id_zona in (".implode($zonas,",").")
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


	        $relatores = DB::select("select rrhh.persona.nombres, rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno, rrhh.persona.id_persona, core.comuna.id_comuna, 
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
       //  arreglo($capacitacion);exit();
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
 
 
        $listaCapacitaciones = DB::table('rrhh.capacitacion')
            ->leftJoin('rrhh.persona_cargo' , 'rrhh.capacitacion.id_relator','=','rrhh.persona_cargo.id_persona_cargo')
            ->leftJoin('rrhh.persona' , 'rrhh.persona_cargo.id_persona','=','rrhh.persona.id_persona')
            ->leftJoin('core.comuna' , 'rrhh.capacitacion.id_comuna','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->select('rrhh.capacitacion.*','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno')
            ->where('rrhh.capacitacion.id_relator','=', $post['id_persona'])
            ->orderBy('core.region.orden_geografico','asc')
            ->orderBy('core.comuna.nombre','asc')
            ->get();

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
            'id_comuna' => 'required|int',
           // 'id_cargo' => 'required|int',
            'id_capacitacion' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $personaP = DB::select("select DISTINCT rrhh.persona.nombres, rrhh.persona.apellido_paterno, rrhh.persona.apellido_materno, 
            rrhh.persona.id_persona, core.comuna.nombre as comuna,
            rrhh.capacitacion_persona.id_capacitacion, rrhh.capacitacion_persona.borrado as borrado_capacitacion, rrhh.persona.estado_proceso
        from rrhh.persona 
        left join rrhh.persona_cargo on rrhh.persona.id_persona = rrhh.persona_cargo.id_persona 
        left join rrhh.cargo on rrhh.persona_cargo.id_cargo = rrhh.cargo.id_cargo 
        left join core.comuna on rrhh.persona.id_comuna_postulacion = core.comuna.id_comuna 
        left join rrhh.capacitacion_persona on rrhh.persona.id_persona = rrhh.capacitacion_persona.id_persona 
        left join rrhh.capacitacion on rrhh.capacitacion_persona.id_capacitacion = rrhh.capacitacion.id_capacitacion 
        where rrhh.persona.id_comuna_postulacion = ".$post['id_comuna']."
            and rrhh.persona.borrado = false
            and rrhh.persona.modificado = true
            and rrhh.persona.estado_proceso = 'preseleccionado'
            and rrhh.persona_cargo.borrado = false
            and (rrhh.capacitacion_persona.borrado is null or rrhh.capacitacion_persona.borrado = false)
            and (rrhh.capacitacion_persona.id_capacitacion is null 
            or rrhh.capacitacion_persona.id_capacitacion = ".$post['id_capacitacion'].")
        GROUP BY rrhh.persona.id_persona, rrhh.capacitacion_persona.id_capacitacion, comuna, borrado_capacitacion 
        order by comuna asc");

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
          				
                        if($personal['asignar'] == 1){
                            $capacitacionPersona->borrado = false;
                        }else{
                            $capacitacionPersona->borrado = true;
                        }

                        try{
                            $capacitacionPersona->save();
                            //arreglo($capacitacionPersona);exit();
                        }catch (\Exception $e){
                            DB::rollback();
                            return response()->json(['resultado'=>'error','descripcion'=>'Error al modificar la asignación. ()'. $e->getMessage()]);
                        }
               
                    }else if($personal['asignar'] == 1){
                        $newCapacitacionPersona = new CapacitacionPersona;
                        $newCapacitacionPersona->id_capacitacion = $post['id_capacitacion'];
                        $newCapacitacionPersona->id_persona = $personal['id_persona'];

                        try{
                            $newCapacitacionPersona->save();
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
}


