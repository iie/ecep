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

        $listaAnidadaR=[];
        $relatores = DB::table('rrhh.persona')
            ->leftJoin('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')           
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_postulacion','=','core.comuna.id_comuna')
            ->select('rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.id_persona','core.comuna.id_comuna','core.comuna.nombre as comuna','rrhh.persona_cargo.id_persona_cargo','rrhh.persona_cargo.id_cargo')
            ->where('rrhh.cargo.id_cargo','=',1008)
            ->where('rrhh.persona.borrado','=', false)
      /*      ->where('rrhh.persona.modificado','=',true)*/
            ->where('rrhh.persona_cargo.borrado','=', false)
            ->orderBy('core.comuna.nombre','asc')
            ->get();

        foreach ($relatores as $key => $value) {
            $listaAnidadaR[$value->id_comuna][] = $value;
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

        $personaP = DB::table('rrhh.persona')
            ->join('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_postulacion','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->leftJoin('infraestructura.zona_region' , 'core.region.id_region','=','infraestructura.zona_region.id_region')
            ->leftJoin('infraestructura.zona' , 'infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
            ->leftJoin('rrhh.capacitacion_persona', 'rrhh.persona_cargo.id_persona_cargo','=','rrhh.capacitacion_persona.id_persona_cargo')
            ->leftJoin('rrhh.capacitacion', 'rrhh.capacitacion_persona.id_capacitacion','=','rrhh.capacitacion.id_capacitacion')
            ->select('rrhh.persona.*','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona_cargo.id_persona_cargo','rrhh.persona_cargo.estado','rrhh.cargo.nombre_rol','rrhh.cargo.id_cargo','infraestructura.zona.nombre as nombre_zona','rrhh.capacitacion_persona.id_capacitacion_persona', 'rrhh.capacitacion.lugar','rrhh.capacitacion.fecha_hora','rrhh.capacitacion_persona.borrado as borrado_capacitacion')
            ->where('rrhh.cargo.id_cargo','!=',1003)
            ->where('rrhh.cargo.id_cargo','!=',1004)
            ->where('rrhh.cargo.id_cargo','!=',13)
            ->where('rrhh.persona.borrado','=', false)
            ->where('rrhh.persona.modificado','=',true)
            ->where('rrhh.persona_cargo.estado','=','preseleccionado')
            ->where('rrhh.persona_cargo.borrado','=', false)
            ->orderBy('infraestructura.zona.nombre','asc')
            ->orderBy('core.region.orden_geografico','asc')
            ->orderBy('core.comuna.nombre','asc')
            ->get();

        $listaCapacitaciones = DB::table('rrhh.capacitacion')
            ->leftJoin('rrhh.persona_cargo' , 'rrhh.capacitacion.id_relator','=','rrhh.persona_cargo.id_persona_cargo')
            ->leftJoin('rrhh.persona' , 'rrhh.persona_cargo.id_persona','=','rrhh.persona.id_persona')
            ->leftJoin('core.comuna' , 'rrhh.capacitacion.id_comuna','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->select('rrhh.capacitacion.*','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno')
            ->orderBy('core.region.orden_geografico','asc')
            ->orderBy('core.comuna.nombre','asc')
            ->get();

        $datos['personal_postulacion'] = $personaP;
        $datos['regiones'] = $listaFinal;
        $datos['relatores'] = $listaAnidadaR;
        $datos['capacitaciones'] = $listaAnidadaC;
        $datos['lista_capacitacion'] = $listaCapacitaciones;
        $datos['sexo'] = $sexo;
        $datos['estadoCivil'] = $estadoCivil;
        $datos['institucion'] = $institucion ;
        return response()->json($datos);    
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
     
        $capacitacion = new Capacitacion;
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
            'id_cargo' => 'required|integer',   
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $persona = DB::table('rrhh.persona')
                    ->join('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
                    ->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
                    ->leftJoin('rrhh.capacitacion_persona', 'rrhh.persona_cargo.id_persona_cargo','=','rrhh.capacitacion_persona.id_persona_cargo')
                    ->leftJoin('rrhh.capacitacion', 'rrhh.capacitacion_persona.id_capacitacion','=','rrhh.capacitacion.id_capacitacion')
                    ->select('rrhh.persona.id_persona','rrhh.persona.nombres','rrhh.persona.apellido_paterno',
                        'rrhh.persona.apellido_materno','rrhh.persona_cargo.id_persona_cargo','rrhh.cargo.nombre_rol',
                        'rrhh.capacitacion_persona.id_capacitacion_persona')
                    ->where('rrhh.persona_cargo.id_cargo','=',$post['id_cargo'])
                    ->where('rrhh.capacitacion_persona.id_capacitacion','=',$post['id_capacitacion'])
                    ->get();

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
      
        $personaCargo = PersonaCargo::where('id_persona',$post['id_persona'])->where('id_cargo',1008)->first();

        $personaP = DB::table('rrhh.persona')
            ->join('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_postulacion','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->leftJoin('infraestructura.zona_region' , 'core.region.id_region','=','infraestructura.zona_region.id_region')
            ->leftJoin('infraestructura.zona' , 'infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
            ->leftJoin('rrhh.capacitacion_persona', 'rrhh.persona_cargo.id_persona_cargo','=','rrhh.capacitacion_persona.id_persona_cargo')
            ->leftJoin('rrhh.capacitacion', 'rrhh.capacitacion_persona.id_capacitacion','=','rrhh.capacitacion.id_capacitacion')
            ->select('rrhh.persona.*','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona_cargo.id_persona_cargo','rrhh.persona_cargo.estado','rrhh.cargo.nombre_rol','rrhh.cargo.id_cargo','infraestructura.zona.nombre as nombre_zona','rrhh.capacitacion_persona.id_capacitacion_persona','rrhh.capacitacion_persona.id_capacitacion', 'rrhh.capacitacion.lugar','rrhh.capacitacion.fecha_hora','rrhh.capacitacion_persona.borrado as borrado_capacitacion')
            ->where('rrhh.cargo.id_cargo','!=',1003)
            ->where('rrhh.cargo.id_cargo','!=',1004)
            ->where('rrhh.cargo.id_cargo','!=',13)
            ->where('rrhh.persona.borrado','=', false)
            ->where('rrhh.persona.modificado','=',true)
            ->where('rrhh.persona_cargo.estado','=','preseleccionado')
            ->where('rrhh.persona_cargo.borrado','=', false)
            ->where('rrhh.capacitacion.id_relator','=', $personaCargo->id_persona_cargo)
            ->orderBy('infraestructura.zona.nombre','asc')
            ->orderBy('core.region.orden_geografico','asc')
            ->orderBy('core.comuna.nombre','asc')
            ->get();
 
 
        $listaCapacitaciones = DB::table('rrhh.capacitacion')
            ->leftJoin('rrhh.persona_cargo' , 'rrhh.capacitacion.id_relator','=','rrhh.persona_cargo.id_persona_cargo')
            ->leftJoin('rrhh.persona' , 'rrhh.persona_cargo.id_persona','=','rrhh.persona.id_persona')
            ->leftJoin('core.comuna' , 'rrhh.capacitacion.id_comuna','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->select('rrhh.capacitacion.*','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno')
            ->where('rrhh.capacitacion.id_relator','=', $personaCargo->id_persona_cargo)
            ->orderBy('core.region.orden_geografico','asc')
            ->orderBy('core.comuna.nombre','asc')
            ->get();

        $datos['personal_capacitacion'] = $personaP;
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
            'id_cargo' => 'required|int',
            'id_capacitacion' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $personaP = DB::table('rrhh.persona')
            ->leftJoin('rrhh.persona_cargo' , 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo' , 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_postulacion','=','core.comuna.id_comuna')
            ->leftJoin('rrhh.capacitacion_persona', 'rrhh.persona_cargo.id_persona_cargo','=','rrhh.capacitacion_persona.id_persona_cargo')
            ->leftJoin('rrhh.capacitacion', 'rrhh.capacitacion_persona.id_capacitacion','=','rrhh.capacitacion.id_capacitacion')
            ->select('rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.id_persona','rrhh.persona_cargo.id_persona_cargo',
                    'rrhh.cargo.nombre_rol','rrhh.capacitacion_persona.id_capacitacion','rrhh.capacitacion_persona.borrado as borrado_capacitacion')
            ->where('rrhh.persona.id_comuna_postulacion','=', $post['id_comuna'])
            ->where('rrhh.persona_cargo.id_cargo','=',$post['id_cargo'])
            ->where('rrhh.persona.borrado','=', false)
            ->where('rrhh.persona.modificado','=',true)
            ->where('rrhh.persona_cargo.estado','=','preseleccionado')
            ->where('rrhh.persona_cargo.borrado','=', false)
            ->whereNull('rrhh.capacitacion_persona.id_capacitacion') 
            ->orWhere('rrhh.capacitacion_persona.id_capacitacion','=', $post['id_capacitacion'])    
            ->where('rrhh.capacitacion_persona.borrado','=', true)    
            ->orderBy('core.comuna.nombre','asc')
            ->get();

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
                $capacitacionPersona = CapacitacionPersona::where('id_capacitacion',$post['id_capacitacion'])
                                ->where('id_persona_cargo',$personal['id_persona_cargo'])
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
                    $newCapacitacionPersona->id_persona_cargo = $personal['id_persona_cargo'];

                    try{
                        $newCapacitacionPersona->save();
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
                $capacitacionPrueba = CapacitacionPrueba::where('id_capacitacion_persona',$evaluado->id_capacitacion)
                                ->get();
         
                if(isset($capacitacionPrueba)){
                    
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
           
                }else{ 

                    try{
                        $capacitacionPrueba = new CapacitacionPrueba;
                        $capacitacionPrueba->nota = $evaluado->nota_psicologica;
                        $capacitacionPrueba->puntaje = $evaluado->puntaje_psicologica;
                        $capacitacionPrueba->prueba = 'Psicologica';

                        $capacitacionPrueba->save();
                        
                        $capacitacionPrueba = new CapacitacionPrueba;
                        $capacitacionPrueba->nota = $evaluado->nota_contenido;
                        $capacitacionPrueba->puntaje = $evaluado->puntaje_contenido;
                        $capacitacionPrueba->prueba = 'Contenido';

                        $capacitacionPrueba->save();
                        
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
}


