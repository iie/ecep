<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Evaluado\Evaluado;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class EvaluadoController extends Controller
{
	 
	public function __construct()
    {
		$this->fields = array();	
    }

    public function index()
    {
    	$evaluado = Evaluado::paginate(10);

        return response()->json($evaluado); 
    }	

    public function lista(Request $request)
    {
		
		$post = $request->all();	

		$validacion = Validator::make($post, [
			'id_usuario' => 'int|required',
		]);	

		if ($validacion->fails()) {
			return response()->json(array("resultado"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		
		/*$evaluado = DB::table('evaluado.evaluado')
            ->leftJoin('evaluado.aplicacion', 'evaluado.evaluado.id_aplicacion', '=', 'evaluado.aplicacion.id_aplicacion')
            ->leftJoin('evaluado.prueba', 'evaluado.evaluado.id_prueba', '=', 'evaluado.prueba.id_prueba')
            ->leftJoin('evaluado.asignatura', 'evaluado.prueba.id_asignatura', '=', 'evaluado.asignatura.id_asignatura')
            ->leftJoin('infraestructura.sala', 'evaluado.aplicacion.id_sala', '=', 'infraestructura.sala.id_sala')
            ->leftJoin('infraestructura.sede', 'infraestructura.sala.id_sede', '=', 'infraestructura.sede.id_sede')
            ->select('evaluado.evaluado.id_evaluado','evaluado.evaluado.rut','evaluado.evaluado.nombres','evaluado.evaluado.apellido_paterno','evaluado.evaluado.apellido_materno', 'infraestructura.sede.nombre as sede', 'infraestructura.sede.id_sede','infraestructura.sala.id_sala', 'evaluado.asignatura.asignatura','evaluado.prueba.forma')
            ->orderBy('evaluado.id_evaluado','asc')
            ->limit(1000)
            ->get();*/

        $columns=array(
            0=> "id_evaluado",
            1=> "sede",
            2=> "asignatura",
            3=> "forma",
            4=> "rut",
            5=> "nombres",
            6=> "apellido_paterno",
            7=> "apellido_materno",
        );

        $totalData = Evaluado::count();
        $limit = $request->input('length');
        $start = $request->input('start');
        $order = $columns[$request->input('order.0.column')];
        $dir = $request->input('order.0.dir');


        if(empty($request->input('search.value'))){
            $post = Evaluado::leftJoin('evaluado.aplicacion', 'evaluado.evaluado.id_aplicacion', '=', 'evaluado.aplicacion.id_aplicacion')
                ->leftJoin('evaluado.prueba', 'evaluado.evaluado.id_prueba', '=', 'evaluado.prueba.id_prueba')
                ->leftJoin('evaluado.asignatura', 'evaluado.prueba.id_asignatura', '=', 'evaluado.asignatura.id_asignatura')
                ->leftJoin('infraestructura.sala', 'evaluado.aplicacion.id_sala', '=', 'infraestructura.sala.id_sala')
                ->leftJoin('infraestructura.sede', 'infraestructura.sala.id_sede', '=', 'infraestructura.sede.id_sede')
                ->select('evaluado.evaluado.id_evaluado','evaluado.evaluado.rut','evaluado.evaluado.nombres','evaluado.evaluado.apellido_paterno','evaluado.evaluado.apellido_materno', 'infraestructura.sede.nombre as sede', 'infraestructura.sede.id_sede','infraestructura.sala.id_sala', 'evaluado.asignatura.asignatura','evaluado.prueba.forma')
                ->offset($start)
                ->limit($limit)
                ->orderBy($order,$dir)
                ->get();
            $totalFiltered = Evaluado::count();
        }else{
            $search = $request->input('search.value');
            $post = Evaluado::leftJoin('evaluado.aplicacion', 'evaluado.evaluado.id_aplicacion', '=', 'evaluado.aplicacion.id_aplicacion')
                ->leftJoin('evaluado.prueba', 'evaluado.evaluado.id_prueba', '=', 'evaluado.prueba.id_prueba')
                ->leftJoin('evaluado.asignatura', 'evaluado.prueba.id_asignatura', '=', 'evaluado.asignatura.id_asignatura')
                ->leftJoin('infraestructura.sala', 'evaluado.aplicacion.id_sala', '=', 'infraestructura.sala.id_sala')
                ->leftJoin('infraestructura.sede', 'infraestructura.sala.id_sede', '=', 'infraestructura.sede.id_sede')
                ->select('evaluado.evaluado.id_evaluado','evaluado.evaluado.rut','evaluado.evaluado.nombres','evaluado.evaluado.apellido_paterno','evaluado.evaluado.apellido_materno', 'infraestructura.sede.nombre as sede', 'infraestructura.sede.id_sede','infraestructura.sala.id_sala', 'evaluado.asignatura.asignatura','evaluado.prueba.forma')
                ->where('nombres','ilike',"%{$search}%")
                ->orWhere('apellido_paterno','ilike',"%{$search}%")
                ->orWhere('apellido_materno','ilike',"%{$search}%")
                ->orWhere('rut','ilike',"%{$search}%")
                ->offset($start)
                ->limit($limit)
                ->orderBy($order,$dir)
                ->get();

            $totalFiltered = Evaluado::leftJoin('evaluado.aplicacion', 'evaluado.evaluado.id_aplicacion', '=', 'evaluado.aplicacion.id_aplicacion')
                ->leftJoin('evaluado.prueba', 'evaluado.evaluado.id_prueba', '=', 'evaluado.prueba.id_prueba')
                ->leftJoin('evaluado.asignatura', 'evaluado.prueba.id_asignatura', '=', 'evaluado.asignatura.id_asignatura')
                ->leftJoin('infraestructura.sala', 'evaluado.aplicacion.id_sala', '=', 'infraestructura.sala.id_sala')
                ->leftJoin('infraestructura.sede', 'infraestructura.sala.id_sede', '=', 'infraestructura.sede.id_sede')
                ->select('evaluado.evaluado.id_evaluado','evaluado.evaluado.rut','evaluado.evaluado.nombres','evaluado.evaluado.apellido_paterno','evaluado.evaluado.apellido_materno', 'infraestructura.sede.nombre as sede', 'infraestructura.sede.id_sede','infraestructura.sala.id_sala', 'evaluado.asignatura.asignatura','evaluado.prueba.forma')
                ->where('nombres','ilike',"%{$search}%")
                ->orWhere('apellido_paterno','ilike',"%{$search}%")
                ->orWhere('apellido_materno','ilike',"%{$search}%")
                ->orWhere('rut','ilike',"%{$search}%")
                ->count();

        }

        
		//$evaluado = Evaluado::paginate(10);
                $data = array();

                if($post ){
                    foreach ($post as $r) {
                        $nestedData['id_evaluado'] = $r->id_evaluado;
     
                        $nestedData['sede'] = $r->sede;
                        $nestedData['asignatura'] = $r->asignatura;
                        $nestedData['forma'] = $r->forma;

                        $nestedData['rut'] = $r->rut;
                        $nestedData['nombres'] = $r->nombres;
                        $nestedData['apellido_paterno'] = $r->apellido_paterno;
                        $nestedData['apellido_materno'] = $r->apellido_materno;
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

		//return response()->json($evaluado);	
    }

    

}