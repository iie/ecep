<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Infraestructura\Centro;
use App\Models\Infraestructura\Zona;
use App\Models\Infraestructura\ZonaRegion;
use App\Models\Infraestructura\Estimacion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CentroController extends Controller
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

        $zonaRegion = DB::table('infraestructura.zona_region')
            ->leftJoin('infraestructura.zona', 'infraestructura.zona_region.id_zona','=','infraestructura.zona.id_zona')
            ->leftJoin('core.region', 'infraestructura.zona_region.id_region','=','core.region.id_region')
            ->select('infraestructura.zona.nombre as zona_nombre','infraestructura.zona_region.id_zona_region','infraestructura.zona_region.id_zona','core.region.nombre as region')
            ->orderBy('infraestructura.zona.id_zona','asc')
            ->get();

/*        foreach ($encargadoRegional as $reg) {
             
            $encRegional[$reg->id_persona] = $reg->nombres.' '.$reg->apellido_paterno;
        }
*/

        $encargadoRegional = DB::table('rrhh.persona')
			->leftJoin('rrhh.persona_cargo', 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
			->leftJoin('rrhh.cargo', 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
			->select('rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.id_persona','rrhh.persona.id_usuario',
                'rrhh.persona_cargo.id_persona_cargo')
			->where('rrhh.cargo.id_cargo','=', 1004)
			->orderBy('rrhh.persona.nombres','asc')
			->get();

        foreach ($encargadoRegional as $reg) {
        	 
        	$encRegional[$reg->id_persona_cargo] = $reg->nombres.' '.$reg->apellido_paterno;
        }

        $encargadoZonal = DB::table('rrhh.persona')
        	->leftJoin('rrhh.persona_cargo', 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo', 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->select('rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.id_persona','rrhh.persona.id_usuario',
                'rrhh.persona_cargo.id_persona_cargo')
            ->where('rrhh.cargo.id_cargo','=', 1003)
        	->orderBy('rrhh.persona.nombres','asc')
        	->get();

        foreach ($encargadoZonal as $reg) {
        	 
        	$encZonal[$reg->id_persona_cargo] = $reg->nombres.' '.$reg->apellido_paterno;
        }

        $encargadoCentro = DB::table('rrhh.persona')
        	->leftJoin('rrhh.persona_cargo', 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo', 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->select('rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.id_persona','rrhh.persona.id_usuario','rrhh.persona_cargo.id_persona_cargo')
            ->where('rrhh.cargo.id_cargo','=',13)
        	->orderBy('rrhh.persona.nombres','asc')
        	->get();

        foreach ($encargadoCentro as $reg) {
        	 
        	$enc[$reg->id_persona_cargo] = $reg->nombres.' '.$reg->apellido_paterno;
        }

		$centrosC = DB::table('infraestructura.centro_operaciones')
            ->join('core.comuna', 'infraestructura.centro_operaciones.id_comuna', '=', 'core.comuna.id_comuna')
            ->join('core.provincia', 'core.comuna.id_provincia', '=', 'core.provincia.id_provincia')
            ->join('core.region', 'core.provincia.id_region', '=', 'core.region.id_region')
          	->select('infraestructura.centro_operaciones.*','core.region.id_region','core.region.nombre as region','core.comuna.nombre as comuna','core.comuna.id_comuna','core.provincia.id_provincia','core.provincia.nombre as provincia')
           /* ->where('infraestructura.centro_operaciones.confirmado','=',2)*/
            ->orderBy('core.region.orden_geografico','asc')
            ->orderBy('core.provincia.nombre','asc')
            ->get();

        $centros = array();
        foreach ($centrosC as $centro) {
        	$_centro['id_centro_operaciones'] = $centro->id_centro_operaciones; 
        	$_centro['camara_operativa'] = $centro->camara_operativa; 
            $_centro['servicios_basicos'] = $centro->servicios_basicos; 
            $_centro['inmobiliario'] = $centro->camara_operativa; 
            $_centro['extintor'] = $centro->extintor; 
            $_centro['internet'] = $centro->internet; 
        	$_centro['comentario'] = $centro->comentario; 
        	$_centro['comuna'] = $centro->comuna; 
        	$_centro['confirmado'] = $centro->confirmado; 
        	$_centro['contacto_cargo'] = $centro->contacto_cargo; 
        	$_centro['contacto_email'] = $centro->contacto_email; 
        	$_centro['contacto_fono'] = $centro->contacto_fono; 
        	$_centro['contacto_nombre'] = $centro->contacto_nombre; 
        	$_centro['contacto_otro'] = $centro->contacto_otro; 
        	$_centro['id_comuna'] = $centro->id_comuna; 
        	$_centro['id_provincia'] = $centro->id_provincia; 
        	$_centro['id_region'] = $centro->id_region; 
        	//$_centro['nombre'] = $centro->nombre; 
        	$_centro['provincia'] = $centro->provincia; 
        	$_centro['region'] = $centro->region; 

        	//$_centro['id_coordinador_zonal'] = $centro->id_coordinador_zonal;
        	//$_centro['id_coordinador_regional'] = $centro->id_coordinador_regional;
        	$_centro['id_encargado'] = $centro->id_encargado;
            $_centro['id_zona_region'] = $centro->id_zona_region;
        	//$_centro['coordinador_zonal'] = $centro->id_coordinador_zonal == -1 ? null : $encZonal[$centro->id_coordinador_zonal];
        	//$_centro['coordinador_regional'] = $centro->id_coordinador_regional == -1 ? null : $encRegional[$centro->id_coordinador_regional];
        	$_centro['encargado'] = $centro->id_encargado == null ? null : $enc[$centro->id_encargado];

        	$centros[] = $_centro;        	 
        }

       /* $centroN = DB::table('infraestructura.centro_operaciones')
            ->join('core.comuna', 'infraestructura.centro_operaciones.id_comuna', '=', 'core.comuna.id_comuna')
            ->join('core.provincia', 'core.comuna.id_provincia', '=', 'core.provincia.id_provincia')
            ->join('core.region', 'core.provincia.id_region', '=', 'core.region.id_region')
            ->select('infraestructura.centro_operaciones.*','core.region.id_region','core.region.nombre as region','core.comuna.nombre as comuna','core.comuna.id_comuna','core.provincia.id_provincia','core.provincia.nombre as provincia')
            ->where('infraestructura.centro_operaciones.confirmado','!=',2)
            ->orderBy('core.region.orden_geografico','asc')
            ->get();*/

        $reg = DB::select("SELECT r.numero as numero_region, r.nombre as nombre_region , co.id_comuna, co.nombre
                        from core.region r
                        INNER JOIN core.comuna co ON (r.id_region = co.id_region)
                        where r.numero != '-1'
                       order by r.orden_geografico , co.nombre");

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


        $datos['centros'] = $centros;
		//$datos['centros_no_confirmados'] = $centroN;
		$datos['regiones'] = $listaFinal;
		$datos['encargadoRegional']=$encargadoRegional; 
		$datos['encargadoZonal']=$encargadoZonal; 
		$datos['encargadoCentro']=$encargadoCentro; 
        $datos['zonas'] = $zonaRegion;

		return response()->json($datos);	
    }

    public function guardar(Request $request){

    	$post = $request->all();

    	$validacion = Validator::make($post, [
    		'id_usuario' => 'required|int',	
			'id_centro_operaciones' => 'required|int',
		]);	

		if ($validacion->fails()) {
			return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
		}
   	 
    	if($post['id_centro_operaciones'] == -1){
    		$centro = new Centro;
    	}else{
    		$centro = Centro::where("id_centro_operaciones", $post["id_centro_operaciones"])->first();
    	}
    	 
    	/*$centro->id_coordinador_zonal = $post['id_coordinador_zonal'];
		$centro->id_coordinador_regional = $post['id_coordinador_regional'];
		$centro->id_encargado = $post['id_encargado'];*/
        $centro->id_zona_region = $post['id_zona_region'];
		$centro->direccion = $post['direccion'];
		$centro->contacto_nombre = $post['contacto_nombre'];
		$centro->contacto_cargo = $post['contacto_cargo'];
		$centro->contacto_fono = $post['contacto_fono'];
		$centro->contacto_email = $post['contacto_email'];
		$centro->confirmado = $post['confirmado'];
		$centro->contacto_otro = $post['contacto_otro'];
		$centro->comentario = $post['comentario'];
		//$centro->nombre = $post['nombre'];
		$centro->id_comuna = $post['id_comuna'];
        $centro->servicios_basicos = $post['servicios_basicos'];
        $centro->inmobiliario = $post['inmobiliario'];
        $centro->extintor = $post['extintor'];
        $centro->internet = $post['internet'];
		$centro->camara_operativa = $post['camara_operativa'];

		DB::beginTransaction();
		try{
			$centro->save(); 
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
			'id_centro_operaciones' => 'required|int',	
		]);	

		if ($validacion->fails()) {
			return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$centro = Centro::join('core.comuna', 'infraestructura.centro_operaciones.id_comuna', '=', 'core.comuna.id_comuna')
				->join('core.region', 'core.comuna.id_region', '=', 'core.region.id_region')
    			->select('infraestructura.centro_operaciones.*','core.region.id_region')
    			->where("id_centro_operaciones", $post["id_centro_operaciones"])->first();

		if (empty($centro)) {
            return response()->json(['resultado'=>'error','descripcion'=>'No se encuentra el Centro']);
        }else{
        	return response()->json($centro);	
        }
    }

    public function zonas(Request $request)
    {
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $zona = Zona::orderBy('infraestructura.zona.nombre','asc')->get();

        $encargadoZonal = DB::table('rrhh.persona')
            ->leftJoin('rrhh.persona_cargo', 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo', 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_residencia','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->select('rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.id_persona','rrhh.persona.id_usuario','core.comuna.id_comuna as comuna','rrhh.persona_cargo.id_persona_cargo','core.comuna.nombre as comuna','core.region.nombre as region')
            ->where('rrhh.cargo.id_cargo','=', 1003)
            ->where('rrhh.persona.borrado','=', false)
            ->orderBy('rrhh.persona.nombres','asc')
            ->get();


        $datos['zona'] = $zona;
        $datos['encargado_zonal'] = $encargadoZonal;
        return response()->json($datos);    
    }

    public function modificarZona(Request $request)
    {
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_zona' => 'required|int', 
            /*'id_coordinador' => 'required', */
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $zona = Zona::where('id_zona',$post['id_zona'])->first();
        $zona->id_coordinador = $post['id_coordinador'];
        DB::beginTransaction();
        try{
            $zona->save(); 
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
        }

        DB::commit();
        return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
    }


    public function zonasRegion(Request $request)
    {
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_cargo' => 'required|int'
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        if($post['id_cargo'] == 1003){
            $zona = Zona::leftJoin('infraestructura.zona_region','infraestructura.zona.id_zona','=','infraestructura.zona_region.id_zona')
            ->leftJoin('core.region','infraestructura.zona_region.id_region','=','core.region.id_region')
            ->leftJoin('rrhh.persona_cargo','infraestructura.zona.id_coordinador','=','rrhh.persona_cargo.id_persona_cargo')
            ->where('rrhh.persona_cargo.id_persona',$post['id_persona'])
            ->where('rrhh.persona_cargo.id_cargo',$post['id_cargo'])
            ->select('infraestructura.zona.id_zona','infraestructura.zona.nombre','infraestructura.zona_region.id_zona_region','infraestructura.zona_region.id_region','core.region.nombre as region','infraestructura.zona_region.id_coordinador')            
            ->orderBy('infraestructura.zona.nombre','asc')
            ->get();
        }else{
            $zona = Zona::leftJoin('infraestructura.zona_region','infraestructura.zona.id_zona','=','infraestructura.zona_region.id_zona')
            ->leftJoin('core.region','infraestructura.zona_region.id_region','=','core.region.id_region')
            ->select('infraestructura.zona.id_zona','infraestructura.zona.nombre','infraestructura.zona_region.id_zona_region','infraestructura.zona_region.id_region','core.region.nombre as region','infraestructura.zona_region.id_coordinador')            
            ->orderBy('infraestructura.zona.nombre','asc')
            ->get();
        }

        $encargadoRegional = DB::table('rrhh.persona')
            ->leftJoin('rrhh.persona_cargo', 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo', 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_residencia','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->select('rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.id_persona','rrhh.persona.id_usuario',
                'core.comuna.id_comuna as comuna','rrhh.persona_cargo.id_persona_cargo','core.comuna.nombre as comuna','core.region.nombre as region')
            ->where('rrhh.cargo.id_cargo','=', 1004)
            ->where('rrhh.persona.borrado','=', false)
            ->orderBy('rrhh.persona.nombres','asc')
            ->get();


        $datos['zona'] = $zona;
        $datos['encargado_regional'] = $encargadoRegional;
        return response()->json($datos);    
    }

    public function modificarZonaRegion(Request $request)
    {
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_zona_region' => 'required|int', 
            /*'id_coordinador' => 'required', */
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $zonaRegion = ZonaRegion::where('id_zona_region',$post['id_zona_region'])->first();
        $zonaRegion->id_coordinador = $post['id_coordinador'];
        DB::beginTransaction();
        try{
            $zonaRegion->save(); 
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
        }

        DB::commit();
        return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
    }

    public function centros(Request $request)
    {
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $centros = Centro::leftJoin('infraestructura.zona_region','infraestructura.centro_operaciones.id_zona_region','=','infraestructura.zona_region.id_zona_region')
            ->leftJoin('infraestructura.zona','infraestructura.zona_region.id_zona','=','infraestructura.zona_region.id_zona')
            ->leftJoin('core.comuna','infraestructura.centro_operaciones.id_comuna','=','core.comuna.id_comuna')
            ->leftJoin('core.region','core.comuna.id_region','=','core.region.id_region')
            ->select('infraestructura.centro_operaciones.id_zona_region','infraestructura.centro_operaciones.id_centro_operaciones','infraestructura.centro_operaciones.id_encargado',
                'core.region.nombre as region','core.comuna.nombre as comuna','infraestructura.zona.id_zona','infraestructura.zona.nombre')
            ->orderBy('core.region.orden_geografico','asc')
            ->get();

        $encargadoCentro = DB::table('rrhh.persona')
            ->leftJoin('rrhh.persona_cargo', 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo', 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_residencia','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->select('rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.id_persona','rrhh.persona.id_usuario',
                'core.comuna.id_comuna as comuna','rrhh.persona_cargo.id_persona_cargo','core.comuna.nombre as comuna','core.region.nombre as region')
            ->where('rrhh.cargo.id_cargo','=', 13)
            ->where('rrhh.persona.borrado','=', false)
            ->orderBy('rrhh.persona.nombres','asc')
            ->get();

        $datos['centros'] = $centros;
        $datos['encargado_centro'] = $encargadoCentro;
        return response()->json($datos);    
    }

    public function modificarEncargadoCentro(Request $request)
    {
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_centro_operaciones' => 'required|int', 
            /*'id_coordinador' => 'required', */
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $centro = Centro::where('id_centro_operaciones',$post['id_centro_operaciones'])->first();
        $centro->id_zona_region = $post['id_zona_region'];
        $centro->id_encargado = $post['id_encargado'];
        DB::beginTransaction();
        try{
            $centro->save(); 
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
        }

        DB::commit();
        return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
    }

    public function sedes(Request $request)
    {
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $sedes = DB::select('SELECT comuna.id_comuna,  
                estimacion.id_estimacion, region.nombre as region, comuna.nombre as comuna, sede.rbd, 
                sede.nombre as establecimiento, estimacion.id_sede_ecep, estimacion.id_sede,                            
                infraestructura.zona.nombre as zona, infraestructura.zona.id_zona, estimacion.id_jefe_sede
                FROM infraestructura.estimacion as estimacion
                inner join infraestructura.sede on (estimacion.id_sede = sede.id_sede), core.comuna as comuna, core.region as region
                inner join infraestructura.zona_region ON (infraestructura.zona_region.id_region = region.id_region)
                inner join infraestructura.zona ON (infraestructura.zona_region.id_zona = infraestructura.zona.id_zona)
                where estimacion.id_comuna = comuna.id_comuna 
                and comuna.id_region = region.id_region
                order by infraestructura.zona.id_zona, region.orden_geografico, comuna, establecimiento');

        $jefeSede = DB::table('rrhh.persona')
            ->leftJoin('rrhh.persona_cargo', 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo', 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->leftJoin('core.comuna' , 'rrhh.persona.id_comuna_residencia','=','core.comuna.id_comuna')
            ->leftJoin('core.region' , 'core.comuna.id_region','=','core.region.id_region')
            ->select('rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.id_persona','rrhh.persona.id_usuario',
                'core.comuna.id_comuna as comuna','rrhh.persona_cargo.id_persona_cargo','core.comuna.nombre as comuna','core.region.nombre as region')
            ->where('rrhh.cargo.id_cargo','=', 1010)
            ->where('rrhh.persona.borrado','=', false)
            ->orderBy('rrhh.persona.nombres','asc')
            ->get();

        $datos['sedes'] = $sedes;
        $datos['jefe_sede'] = $jefeSede;
        return response()->json($datos);    
    }

    public function modificarJefeSede(Request $request)
    {
        
        $post = $request->all();    

        $validacion = Validator::make($post, [
            'id_usuario' => 'required|int', 
            'id_estimacion' => 'required|int', 
            /*'id_coordinador' => 'required', */
        ]); 

        if ($validacion->fails()) {
            return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
        }

        $estimacion = Estimacion::where('id_estimacion',$post['id_estimacion'])->first();
        $estimacion->id_jefe_sede = $post['id_jefe_sede'];
        DB::beginTransaction();
        try{
            $estimacion->save(); 
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
        }

        DB::commit();
        return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
    }

    public function listaMonitoreo(Request $request)
    {
		
		$post = $request->all();	

		$validacion = Validator::make($post, [
			'id_usuario' => 'required|int',	
		]);	

		if ($validacion->fails()) {
			return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

        $encargadoCentro = DB::table('rrhh.persona')
        	->leftJoin('rrhh.persona_cargo', 'rrhh.persona.id_persona','=','rrhh.persona_cargo.id_persona')
            ->leftJoin('rrhh.cargo', 'rrhh.persona_cargo.id_cargo','=','rrhh.cargo.id_cargo')
            ->select('rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.email','rrhh.persona.id_persona','rrhh.persona.id_usuario')
            ->where('rrhh.cargo.id_cargo','=',13)
            ->where('rrhh.persona.borrado','=', false)
        	->orderBy('rrhh.persona.nombres','asc')
        	->get();

		$enc = array();
        foreach ($encargadoCentro as $reg) {
        	 
        	$enc[$reg->id_persona]['nombre'] = $reg->nombres.' '.$reg->apellido_paterno;
        	$enc[$reg->id_persona]['mail'] = $reg->email;
        }

		$centrosC = DB::table('infraestructura.centro_operaciones')
            ->join('core.comuna', 'infraestructura.centro_operaciones.id_comuna', '=', 'core.comuna.id_comuna')
            ->join('core.provincia', 'core.comuna.id_provincia', '=', 'core.provincia.id_provincia')
            ->join('core.region', 'core.provincia.id_region', '=', 'core.region.id_region')
          	->select('infraestructura.centro_operaciones.*','core.region.id_region','core.region.nombre as region','core.comuna.nombre as comuna','core.comuna.id_comuna','core.provincia.id_provincia','core.provincia.nombre as provincia')
            ->orderBy('core.region.orden_geografico','asc')
            ->orderBy('core.provincia.nombre', 'asc')
            ->get();


        $operativos = DB::table('infraestructura.centro_operaciones')->where('confirmado', 2)->count();
        $camaras = DB::table('infraestructura.centro_operaciones')->where('camara_operativa', true)->count();
        $centroC = array();
        foreach ($centrosC as $centro) {
        	$_centro['id_centro_operaciones'] = $centro->id_centro_operaciones; 
        	$_centro['camara_operativa'] = $centro->camara_operativa; 
        	$_centro['confirmado'] = $centro->confirmado; 
        	$_centro['id_comuna'] = $centro->id_comuna; 
        	$_centro['id_provincia'] = $centro->id_provincia; 
        	$_centro['id_region'] = $centro->id_region; 
        	//$_centro['nombre'] = $centro->nombre; 
        	$_centro['provincia'] = $centro->provincia; 
        	$_centro['region'] = $centro->region; 
        	$_centro['comuna'] = $centro->comuna; 

        	$_centro['id_encargado'] = $centro->id_encargado;
  
        	$_centro['encargado'] = $centro->id_encargado == '-1' ? null : ($centro->id_encargado == null ? null : (empty($enc)== true ? null : $enc[$centro->id_encargado]));

        	$centroC[] = $_centro;        	 
        }


        $datos['centros'] = $centroC;
        $datos['operativos'] = $operativos;
        $datos['camaras'] = $camaras;

		return response()->json($datos);	
    }

}
