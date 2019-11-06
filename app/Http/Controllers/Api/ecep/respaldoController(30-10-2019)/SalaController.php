<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Infraestructura\Sala;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class SalaController extends Controller
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
			'id_sede' => 'required|int',
		]);	

		if ($validacion->fails()) {
			return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$sala = Sala::where("id_sede", $post["id_sede"])->get();

		return response()->json($sala);	
    }

    public function guardar(Request $request){

    	$post = $request->all();

    	$validacion = Validator::make($post, [
    		'id_usuario' => 'required|int',	
			'id_sede' => 'required|int',
			'id_sala' => 'required|int',	
		]);	

		if ($validacion->fails()) {
			return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
		}
   	 
    	if($post['id_sala'] == -1){
    		$sala = new Sala;
    	}else{
    		$sala = Sala::where("id_sala", $post["id_sala"])->first();
    	}
    	 
    	$sala->id_sede = $post['id_sede'];
    	$sala->serie_desde = $post['serieDesde'];
    	$sala->serie_hasta = $post['serieHasta'];
    	$sala->cantidad = $post['cantidad'];
    	$sala->codigo_caja = $post['codCaja'];
    	$sala->codigo_sobre = $post['codSobre'];
    	$sala->contingencia = $post['contingencia'];
    	$sala->dispositivo = $post['dispositivo'];
    	$sala->aplicador = $post['aplicador'];

		DB::beginTransaction();
		try{
			$sala->save(); 
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
			'id_sala' => 'required|integer',	
		]);	

		if ($validacion->fails()) {
			return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$sala = Sala::where("id_sala", $post["id_sala"])->first();
		if (empty($sala)) {
            return response()->json(['resultado'=>'error','descripcion'=>'No se encuentra la Sala']);
        }else{
        	return response()->json($sala);	
        }
    }

}