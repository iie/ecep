<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\RRHH\Persona;
use App\Models\RRHH\PersonaCargo;
use App\Models\RRHH\PersonaArchivo;
use App\Models\RRHH\PersonaAsignacion;
use App\Models\Infraestructura\Institucion;
use App\Models\Infraestructura\Zona;
use App\Models\Core\TablaMaestra;
use App\Models\Core\Comuna;
use App\Models\Core\Usuario;
use App\Models\RRHH\Cargo;
use App\Models\Evaluado\Aplicacion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AsignacionController extends Controller
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
        $estado = 'seleccionado';
        $comunas = Comuna::get();
        foreach ($comunas as $com) {             
            $comuna[$com->id_comuna] = $com->nombre;
        }
        $personaP = DB::table('rrhh.persona')
            ->select('rrhh.persona.*','core.comuna.nombre as comuna','core.region.nombre as region',
            'infraestructura.zona.nombre as nombre_zona')
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_postulacion','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->leftJoin('infraestructura.zona_region' , 'core.region.id_region','=','infraestructura.zona_region.id_region')
            ->leftJoin('infraestructura.zona' , 'infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
            ->where('rrhh.persona.borrado','=', false)
            ->where('rrhh.persona.estado_proceso', '=', ''$estado'') 
            ->orderBy('infraestructura.zona.nombre','asc')
            ->orderBy('core.region.orden_geografico','asc')
            ->orderBy('core.comuna.nombre','asc')
            ->get();

        $datos['personal_postulacion'] = $personaP;

        $datos['regiones'] = $listaFinal;
        
        return response()->json($datos);    
    }

   /* public function listaCoordinadorZonal(Request $request)
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

        $personaP = DB::select("select rrhh.persona.*,persona_cargo.*,cargo.*,comuna.nombre as comuna,region.nombre as region, zona.nombre as nombre_zona 
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
            ->select('rrhh.persona.id_persona', 'rrhh.persona.id_comuna_residencia','rrhh.persona.run','rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.email','rrhh.persona.telefono','core.comuna.nombre as comuna','core.region.nombre as region','rrhh.persona_cargo.id_persona_cargo','rrhh.persona_cargo.estado','rrhh.cargo.nombre_rol','infraestructura.zona.id_zona','infraestructura.zona.nombre as zona_nombre')
            ->where('rrhh.persona_cargo.id_cargo','=',1004)
            ->whereIn('infraestructura.zona.id_zona', $zonas)
            ->orderBy('core.region.orden_geografico','asc')
            ->get();  
            

        $datos['personal_postulacion'] = $personaP;
        $datos['coordinador_regional'] = $cRegional;
        $datos['sexo'] = $sexo;
        $datos['estadoCivil'] = $estadoCivil;
        $datos['rol'] = $rol;
        $datos['regiones'] = $listaFinal;
        $datos['institucion'] = $institucion ;
        return response()->json($datos);    
    }

     */
/*     public function listaCoordinador(Request $request){
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',
            'id_cargo' => 'required|int',
            'id_persona' => 'required|int',
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $cargo = DB::table('rrhh.persona_cargo')
                ->leftJoin('infraestructura.zona_region','rrhh.persona_cargo.id_persona_cargo','=','infraestructura.zona_region.id_coordinador')
                ->leftJoin('infraestructura.zona','infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
                ->where('rrhh.persona_cargo.id_persona',$post['id_persona'])
                ->where('rrhh.persona_cargo.id_cargo',$post['id_cargo'])
                ->get();
                
 
        $zonas = array();
        $regiones = array();
        $listaFinal = array();
		$listaSede = array();
        $listaAsignaciones = array();
        foreach($cargo as $cargoAux){
            $zonas[] = $cargoAux->id_zona;
            $regiones[] = $cargoAux->id_region;
        }
       
        $reg = DB::select("SELECT r.numero as numero_region, r.nombre as nombre_region , co.id_comuna, co.nombre, se.id_sede, se.nombre as nombre_sede
                        from core.region r
                        INNER JOIN core.comuna co ON (r.id_region = co.id_region)
                        INNER JOIN infraestructura.sede se ON (co.id_comuna = se.id_comuna)
                        where r.numero != '-1' and se.estado = 2 and  r.id_region in (".implode($regiones,",").")

                       order by r.orden_geografico, co.nombre");
 
        if(!empty($reg)){
        	foreach ($reg as $key => $value) {
	            $listaAnidada[$value->id_comuna][] = $value;
	        }

	        foreach ($listaAnidada as $id_comuna => $sede) {
	            $comuna["id_comuna"]  = $sede[0]->id_comuna;
	            $comuna["nombre"]  = $sede[0]->nombre;
	            $_sede = array();
	            foreach ($sede as $value) {
	                $_sede[] = $value;
	            }
	            $comuna["sedes"]  = $_sede;
	            $listaFinal[$sede[0]->id_comuna] = $comuna;
	        }
        }

        $salas = DB::select("SELECT sa.id_sala ,sa.nro_sala, se.id_sede
                        from infraestructura.sede se
                        LEFT JOIN infraestructura.sala sa ON (se.id_sede = sa.id_sede)
                        LEFT JOIN core.comuna co ON (se.id_comuna = co.id_comuna)
                        where  se.estado = 2 and co.id_region in (".implode($regiones,",").")
                       order by sa.nro_sala, co.nombre");
        if(!empty($salas)){

	        foreach ($salas as $key => $value) {
	         	if($value->id_sala != null){

	         		$listaSede[$value->id_sede][] = $value;
	         	}
	         	/*if($value->id_sala != null){
	         		$listaSede[$value->id_sede][] = $value;
	         	}else{
	         		$listaSede[$value->id_sede][$value->id_sala] = $value;
	         	}*/ /*
	           
	        }
        }
        $asignaciones = DB::select("SELECT se.id_sede, se.nombre as nombre_sede, sa.id_sala,
                                    apli.id_aplicacion, asig.id_persona_asignacion,asig.id_persona_cargo, apli.fecha
                        from core.region r
                        INNER JOIN core.comuna co ON (r.id_region = co.id_region)
                        INNER JOIN infraestructura.sede se ON (co.id_comuna = se.id_comuna)
                        INNER JOIN infraestructura.sala sa ON (se.id_sede = sa.id_sede)
                        INNER JOIN evaluado.aplicacion apli ON (sa.id_sala = apli.id_sala)
                        INNER JOIN rrhh.persona_asignacion asig ON (apli.id_aplicacion = asig.id_aplicacion)
                        where r.numero != '-1' and se.estado = 2 and  r.id_region in (".implode($regiones,",").")
                       order by r.orden_geografico, se.id_sede");

        if(!empty($asignaciones)){
            foreach ($asignaciones as $key => $value) {
                if($value->id_persona_cargo != null){

                    $listaAsignaciones[$value->id_persona_cargo][] = $value;
                }               
            }
        }
 
                
        $personaP = array();

        if($zonas[0] != ""){
            $personaP = DB::select("select rrhh.persona.*,persona_cargo.*,cargo.*,comuna.nombre as comuna,region.nombre as region , zona.nombre as nombre_zona 
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
            and persona_cargo.estado = 'contratado'
            ");

            foreach ($personaP as $index => $per) {
                $personaP[$index]->aplicacion = isset($listaAsignaciones[$per->id_persona_cargo])? $listaAsignaciones[$per->id_persona_cargo] : null;
            }

        }   


        $datos['personal_postulacion'] = $personaP;
        $datos['sedes'] = $listaFinal;
        $datos['salas'] = $listaSede;
        return response()->json($datos);    
    } */

     public function guardar(Request $request){

        $post = $request->all();

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int',           
            'id_persona_cargo' => 'required|int',
            'id_sede' => 'required|int',
            'id_sala' => 'required|int',
            'id_aplicacion' => 'required|int',
            'fecha' => 'required'
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }
     
 
        $cargo = PersonaCargo::where("id_persona_cargo", $post["id_persona_cargo"])->first();
 		
        if (empty($cargo)) {
            return response()->json(['resultado'=>'error','descripcion'=>'No esta asignado al cargo']);
        }
 
 		$asignacion = PersonaAsignacion::where('id_persona_cargo',$cargo->id_persona_cargo)->where('id_aplicacion',$post['id_aplicacion'])->first();

 		if(empty($asignacion)) {
 			$aplicacion = new Aplicacion;
 			$aplicacion->id_sala = $post['id_sala'];
 			$aplicacion->save();


            $asignacion = new PersonaAsignacion;
            $asignacion->id_persona_cargo = $cargo->id_persona_cargo;
            $asignacion->id_aplicacion = $aplicacion->id_aplicacion;
            DB::beginTransaction();
	        try{
	            $asignacion->save();
	        }catch (\Exception $e){
	            DB::rollback();
	            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
	        }

        }else{
        	arreglo('else');exit();
        }
            
         

        DB::commit();
        return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
    }
}