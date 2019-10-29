<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Infraestructura\Centro;
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

        $encargadoRegional = DB::table('rrhh.persona')
			->join('core.usuario', 'rrhh.persona.id_usuario','=','core.usuario.id_usuario')
			->join('core.rol_usuario', 'core.usuario.id_usuario','=','core.rol_usuario.id_usuario')
			->select('rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.id_persona','rrhh.persona.id_usuario')
			->where('core.rol_usuario.id_rol_proceso','=', 1004)
			->orderBy('rrhh.persona.nombres','asc')
			->get();

        foreach ($encargadoRegional as $reg) {
        	 
        	$encRegional[$reg->id_persona] = $reg->nombres.' '.$reg->apellido_paterno;
        }

        $encargadoZonal = DB::table('rrhh.persona')
        			->join('core.usuario', 'rrhh.persona.id_usuario','=','core.usuario.id_usuario')
        			->join('core.rol_usuario', 'core.usuario.id_usuario','=','core.rol_usuario.id_usuario')
        			->select('rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.id_persona','rrhh.persona.id_usuario')
        			->where('core.rol_usuario.id_rol_proceso','=', 1003)
        			->orderBy('rrhh.persona.nombres','asc')
        			->get();

        foreach ($encargadoZonal as $reg) {
        	 
        	$encZonal[$reg->id_persona] = $reg->nombres.' '.$reg->apellido_paterno;
        }

        $encargadoCentro = DB::table('rrhh.persona')
        			->join('core.usuario', 'rrhh.persona.id_usuario','=','core.usuario.id_usuario')
        			->join('core.rol_usuario', 'core.usuario.id_usuario','=','core.rol_usuario.id_usuario')
        			->select('rrhh.persona.nombres','rrhh.persona.apellido_paterno','rrhh.persona.apellido_materno','rrhh.persona.id_persona','rrhh.persona.id_usuario')
        			->where('core.rol_usuario.id_rol_proceso','=', 13)
        			->orderBy('rrhh.persona.nombres','asc')
        			->get();

        foreach ($encargadoCentro as $reg) {
        	 
        	$enc[$reg->id_persona] = $reg->nombres.' '.$reg->apellido_paterno;
        }

		$centrosC = DB::table('infraestructura.centro_operaciones')
            ->join('core.comuna', 'infraestructura.centro_operaciones.id_comuna', '=', 'core.comuna.id_comuna')
            ->join('core.provincia', 'core.comuna.id_provincia', '=', 'core.provincia.id_provincia')
            ->join('core.region', 'core.provincia.id_region', '=', 'core.region.id_region')
          	->select('infraestructura.centro_operaciones.*','core.region.id_region','core.region.nombre as region','core.comuna.nombre as comuna','core.comuna.id_comuna','core.provincia.id_provincia','core.provincia.nombre as provincia')
            ->where('infraestructura.centro_operaciones.confirmado','=',2)
            ->orderBy('core.region.orden_geografico','asc')
            ->get();

        $centroC = array();
        foreach ($centrosC as $centro) {
        	$_centro['id_centro_operaciones'] = $centro->id_centro_operaciones; 
        	$_centro['camara_operativa'] = $centro->camara_operativa; 
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
        	$_centro['nombre'] = $centro->nombre; 
        	$_centro['provincia'] = $centro->provincia; 
        	$_centro['region'] = $centro->region; 

        	$_centro['id_coordinador_zonal'] = $centro->id_coordinador_zonal;
        	$_centro['id_coordinador_regional'] = $centro->id_coordinador_regional;
        	$_centro['id_encargado'] = $centro->id_encargado;

        	$_centro['coordinador_zonal'] = $centro->id_coordinador_zonal == -1 ? null : $encZonal[$centro->id_coordinador_zonal];
        	$_centro['coordinador_regional'] = $centro->id_coordinador_regional == -1 ? null : $encRegional[$centro->id_coordinador_regional];
        	$_centro['encargado'] = $centro->id_encargado == -1 ? null : $enc[$centro->id_encargado];

        	$centroC[] = $_centro;        	 
        }

        $centroN = DB::table('infraestructura.centro_operaciones')
            ->join('core.comuna', 'infraestructura.centro_operaciones.id_comuna', '=', 'core.comuna.id_comuna')
            ->join('core.provincia', 'core.comuna.id_provincia', '=', 'core.provincia.id_provincia')
            ->join('core.region', 'core.provincia.id_region', '=', 'core.region.id_region')
            ->select('infraestructura.centro_operaciones.*','core.region.id_region','core.region.nombre as region','core.comuna.nombre as comuna','core.comuna.id_comuna','core.provincia.id_provincia','core.provincia.nombre as provincia')
            ->where('infraestructura.centro_operaciones.confirmado','!=',2)
            ->orderBy('core.region.orden_geografico','asc')
            ->get();

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


        $datos['centros_confirmados'] = $centroC;
		$datos['centros_no_confirmados'] = $centroN;
		$datos['regiones'] = $listaFinal;
		$datos['encargadoRegional']=$encargadoRegional; 
		$datos['encargadoZonal']=$encargadoZonal; 
		$datos['encargadoCentro']=$encargadoCentro; 

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
    	 
    	$centro->id_coordinador_zonal = $post['id_coordinador_zonal'];
		$centro->id_coordinador_regional = $post['id_coordinador_regional'];
		$centro->id_encargado = $post['id_encargado'];
		$centro->direccion = $post['direccion'];
		$centro->contacto_nombre = $post['contacto_nombre'];
		$centro->contacto_cargo = $post['contacto_cargo'];
		$centro->contacto_fono = $post['contacto_fono'];
		$centro->contacto_email = $post['contacto_email'];
		$centro->confirmado = $post['confirmado'];
		$centro->contacto_otro = $post['contacto_otro'];
		$centro->comentario = $post['comentario'];
		$centro->nombre = $post['nombre'];
		$centro->id_comuna = $post['id_comuna'];
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

}