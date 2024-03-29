<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Infraestructura\Sede;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class SedeController extends Controller
{
	 
	public function __construct()
    {
		$this->fields = array();	
    }	

    public function lista(Request $request)
    {
		
		$post = $request->all();	

		$validacion = Validator::make($post, [
			'id_usuario' => 'int|required',
		]);

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$sede = DB::table('infraestructura.sede')
            ->join('core.comuna', 'infraestructura.sede.id_comuna', '=', 'core.comuna.id_comuna')
            ->join('core.provincia', 'core.comuna.id_provincia', '=', 'core.provincia.id_provincia')
            ->join('core.region', 'core.comuna.id_region', '=', 'core.region.id_region')
            ->leftJoin('infraestructura.sala', 'infraestructura.sede.id_sede', '=', 'infraestructura.sala.id_sede')
            ->leftJoin('infraestructura.centro_operaciones', 'infraestructura.sede.id_centro_operaciones', '=', 'infraestructura.centro_operaciones.id_centro_operaciones')
            ->select('infraestructura.sede.*', 'core.region.nombre as region', 'core.region.id_region','core.provincia.id_provincia','core.provincia.nombre as provincia','core.comuna.nombre as comuna', 'core.comuna.id_comuna','infraestructura.centro_operaciones.id_centro_operaciones','infraestructura.centro_operaciones.nombre as centro',
        		DB::raw("count(infraestructura.sala.id_sala) as salas"))
            ->orderBy('core.region.orden_geografico', 'asc')
            ->orderBy('core.comuna.nombre', 'asc')
            ->groupBy('infraestructura.sede.id_sede','core.region.id_region','core.comuna.nombre','core.provincia.id_provincia','core.comuna.id_comuna','infraestructura.centro_operaciones.id_centro_operaciones')
            ->get();

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

		$centros = DB::table('infraestructura.centro_operaciones')
					->select('infraestructura.centro_operaciones.id_centro_operaciones','infraestructura.centro_operaciones.nombre')
					->where('infraestructura.centro_operaciones.confirmado','=',2)
					->orderBy('infraestructura.centro_operaciones.nombre', 'asc')
					->get();

		$datos['sedes'] = $sede;
		$datos['regiones'] = $listaFinal;
		$datos['centros'] = $centros;
 
		return response()->json($datos);	
    }

    public function obtenerDataLiceo(Request $request){
		$post = $request->all();		

		$validator = Validator::make($request->all(), [
            'id_usuario' => 'required|int',
            'rbd' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(array("respuesta"=>"error","descripcion"=>$validator->errors()), 422);
        }

		$curl = curl_init();

		curl_setopt_array($curl, array(
		CURLOPT_URL => "http://api.datos.mineduc.cl/api/v2/datastreams/DIREC-DE-ESTAB-PRELI-2018/data.ajson/?auth_key=ead255281d8c4197bdb46aaf6c010a276cdd2375&filter0=column1[==]" . $post["rbd"],
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => "GET",
		CURLOPT_HTTPHEADER => array(
			"cache-control: no-cache"
		),
		));

		$response = curl_exec($curl);
		$err = curl_error($curl);

		curl_close($curl);
		$datos = json_decode($response);
		//arreglo($datos);exit();
		if(isset($datos->result[1])){
			$data = $datos->result[1];
			$arr["nombre"] = $data[3];
			$arr["id_region"] = $data[7];
			$arr["id_comuna"] = $data[9];
			$arr["comuna"] = $data[10];
		}else{
			return response()->json(array("respuesta"=>"error","descripcion"=>"No se encontraron datos para el RBD ingresado"));
		}
		return response()->json($arr);
	}

    public function guardar(Request $request){

    	$post = $request->all();

    	$validacion = Validator::make($post, [
    		'id_usuario' => 'required|int',
			'id_sede' => 'required',	
		]);	

		if ($validacion->fails()) {
			return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		if($post['id_sede'] == -1){
    		$sede = new Sede;
    	}else{
    		$sede = Sede::where("id_sede", $post["id_sede"])->first();
    	}

    	$sede->rbd = $post['rbd'];
    	$sede->nombre = $post['nombre'];
    	$sede->direccion = $post['direccion'];
    	$sede->nro_direccion = $post['nro'];
    	$sede->id_comuna = $post['comuna'];
    	$sede->estado = $post['estado'];

    	$sede->contacto_nombre = $post['contacto_nombre'];
    	$sede->contacto_email = $post['contacto_email'];
    	$sede->contacto_fono = $post['contacto_fono'];
    	$sede->contacto_cargo = $post['contacto_cargo'];
    	$sede->contacto_otro = $post['contacto_otro'];

    	$sede->salas_disponibles = $post['salas_disponibles'];
    	$sede->salas_requeridas = $post['salas_requeridas'];

    	$sede->id_centro_operaciones = $post['id_centro_operaciones'];
    	
		DB::beginTransaction();
		try{
			$sede->save(); 
		}catch (\Exception $e){
			DB::rollback();
			return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
		}

		DB::commit();
		return response()->json(["respuesta"=>"ok","descripcion"=>"Se ha guardado con exito"]);
    }

    public function modificar(Request $request){

    	$post = $request->all();	

		$validacion = Validator::make($post, [
			'id_usuario' => 'required|int',
			'id_sede' => 'required|int',	
		]);	

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$sede = DB::table('infraestructura.sede')
            ->join('core.comuna', 'infraestructura.sede.id_comuna', '=', 'core.comuna.id_comuna')
            ->join('core.region', 'core.comuna.id_region', '=', 'core.region.id_region')
            ->select('infraestructura.sede.*', 'core.region.nombre as region', 'core.region.id_region','core.comuna.nombre as comuna', 'core.comuna.id_comuna')
            ->where('id_sede', '=',  $post["id_sede"])
            ->first();

		if (empty($sede)) {
            return response()->json(['resultado'=>'error','descripcion'=>'No se encuentra la Sede']);
        }else{
        	$datos['sede'] = $sede;
			//$datos['centros'] = $centros;
        	return response()->json($datos);	
        }
    }
}