<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Material\MP3;
use App\Models\Evaluado\Asignatura;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MonitoreoMP3Controller extends Controller
{
     
    public function __construct()
    {
        $this->fields = array();    
    }   

    public function lista(Request $request){
        
        $post = $request->all(); 

        $mp3 = MP3::leftJoin('evaluado.asignatura','material.grabado_mp3.id_asignatura','=','evaluado.asignatura.id_asignatura')
            ->select('material.grabado_mp3.*','evaluado.asignatura.asignatura as asignatura')
            ->orderBy('evaluado.asignatura.asignatura')
            ->get();

 
        $datos['mp3'] = $mp3;

        return response()->json($datos);
    }

    public function guardar(Request $request){

        $post = $request->all();
         
        foreach ($post['dispositivos'] as $mp3) {  
             
            $dispositivo = MP3::where('id_grabado_mp3',$mp3['id'])->first();
            if(isset($dispositivo->id_grabado_mp3)){
                $dispositivo->grabado = $mp3['grabado'];
                $dispositivo->revisado = $mp3['revisados'];
                $dispositivo->etiquetado = $mp3['etiquetados'];

                try {
                    $dispositivo->save();
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
                }
                
            }
        }

        return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);
        
        /*DB::beginTransaction();
        try{

            $dispositivo->save(); 
            
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar. ()'. $e->getMessage()]);
        }

        DB::commit();
        return response()->json(["resultado"=>"ok","descripcion"=>"Se ha guardado con exito"]);*/
    }
 
}