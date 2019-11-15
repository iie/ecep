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
use App\Models\Core\Usuario;
use App\Models\RRHH\Cargo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PersonalController extends Controller
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
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_postulacion','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->leftJoin('infraestructura.zona_region' , 'core.region.id_region','=','infraestructura.zona_region.id_region')
            ->leftJoin('infraestructura.zona' , 'infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
            ->select('rrhh.persona.*','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona.estado_proceso as estado',
                    'infraestructura.zona.nombre as nombre_zona')
            //->where('rrhh.cargo.id_cargo','!=',1003)
            //->where('rrhh.cargo.id_cargo','!=',1004)
            //->where('rrhh.cargo.id_cargo','!=',13)
            ->where('rrhh.persona.borrado','=', false)
            ->where('rrhh.persona.modificado','=',true)
            //->where('rrhh.persona_cargo.borrado','=', false)
            ->orderBy('infraestructura.zona.nombre','asc')
            ->orderBy('core.region.orden_geografico','asc')
            ->orderBy('core.comuna.nombre','asc')
            ->get();

        foreach ($personaP as $index => $per) {
            $personaP[$index]->id_institucion = $personaP[$index]->id_institucion == null ? null : $inst[$personaP[$index]->id_institucion];
            $personaP[$index]->id_estado_civil = $personaP[$index]->id_estado_civil == null ? null : $civil[$personaP[$index]->id_estado_civil];
            $personaP[$index]->id_sexo = $personaP[$index]->id_sexo == null ? null : $sexos[$personaP[$index]->id_sexo];
            $personaP[$index]->id_comuna_nacimiento =  $personaP[$index]->id_comuna_nacimiento == null ? null : $comuna[$personaP[$index]->id_comuna_nacimiento];
            $personaP[$index]->id_comuna_residencia =  $personaP[$index]->id_comuna_residencia == null ? null : $comuna[$personaP[$index]->id_comuna_residencia];
        }

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

        $datos['personal_postulacion'] = $personaP;
        $datos['coordinador_zonal'] = $cZonal;
        $datos['coordinador_regional'] = $cRegional;
        $datos['coordinador_centro'] = $cCentro;
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
                foreach ($post['id_cargo'] as $cargo) {
 
                    if($cargo == 1008){
                        //Tipo Relator
                        $usuario->id_tipo_usuario = 1052;
                    }else{
                        $usuario->id_tipo_usuario = 28;
                    }                     
                }
                $usuario->save(); 
            }else{
                $usuario = new Usuario;
                $usuario->usuario = isset($post['usuario']) ? $post['usuario'] : null;
                $usuario->contrasena = isset($post['contrasena']) ? md5($post['contrasena']) : null;
                 
                foreach ($post['id_cargo'] as $cargo) {
                    if($cargo == 1008){
                        //Tipo Relator
                        $usuario->id_tipo_usuario = 1052;
                    }else{
                        $usuario->id_tipo_usuario = 28;
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
        
        $persona = Persona::where('id_persona',$post['id_persona'])->first();
        $persona->estado_proceso =  $persona->estado_proceso  == 'contratado' ? $persona->estado_proceso : 
                                    $persona->estado_proceso == 'rechazado' ? $persona->estado_proceso : $post['estado'];

        DB::beginTransaction();
        try{
            $persona->save(); 
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

        $docs = PersonaArchivo::select('id_persona_archivo','id_persona','nombre_archivo','tipo','token_descarga','extension')
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

        $personaP = DB::select("select rrhh.persona.*,rrhh.persona.estado_proceso as estado, persona_cargo.*,cargo.*,comuna.nombre as comuna,region.nombre as region, zona.nombre as nombre_zona 
			from infraestructura.zona_region as zona_region, rrhh.persona, rrhh.persona_cargo as persona_cargo, rrhh.cargo as cargo, core.comuna as comuna, core.region as region , infraestructura.zona as zona where persona.borrado = false and persona.modificado = true and id_comuna_postulacion in (
            select id_comuna from infraestructura.zona as zona, infraestructura.zona_region as zona_region, core.region as region , core.comuna as comuna
            where zona.id_zona = zona_region.id_zona
            and zona_region.id_region =  region.id_region
            and region.id_region =  comuna.id_region
            and zona.id_zona in (".implode($zonas,",").") ) and persona_cargo.id_persona = persona.id_persona and persona_cargo.id_cargo = cargo.id_cargo
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
			$personaP = DB::select("select rrhh.persona.*,rrhh.persona.estado_proceso as estado, persona_cargo.*,cargo.*,comuna.nombre as comuna,region.nombre as region , zona.nombre as nombre_zona 
            from rrhh.persona, rrhh.persona_cargo as persona_cargo, rrhh.cargo as cargo, core.comuna as comuna, core.region as region, infraestructura.zona as zona , infraestructura.zona_region as zona_region 
            where persona.borrado = false and persona.modificado = true and id_comuna_postulacion in (
            select id_comuna from infraestructura.zona as zona, infraestructura.zona_region as zona_region, core.region as region , core.comuna as comuna
            where zona.id_zona = zona_region.id_zona
            and zona_region.id_region =  region.id_region
            and region.id_region =  comuna.id_region
            and zona.id_zona in (".implode($zonas,",").") ) 
            and persona_cargo.id_persona = persona.id_persona 
            and persona_cargo.id_cargo = cargo.id_cargo
            and id_comuna_postulacion = comuna.id_comuna
            and region.id_region = comuna.id_region
            and zona_region.id_region =  region.id_region
            and zona.id_zona = zona_region.id_zona
            and zona_region.id_coordinador = ". $cargo[0]->id_persona_cargo."
            ");
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

}


