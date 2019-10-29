<?php
namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Evaluado\Evaluado;
use App\Models\RRHH\Persona;
use App\Models\Core\Usuario;
use App\Models\Core\RolUsuario;
use App\Models\Core\RolProceso;
use App\Models\Infraestructura\Laboratorio;
use App\Models\Infraestructura\LaboratorioVisita;
use App\Models\Infraestructura\LaboratorioRevision;
use App\Models\Infraestructura\LaboratorioEquipo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class TestLabController extends Controller
{
	 
	public function __construct()
    {
		$this->fields = array();	
    }	
	
	function corsAccept(){
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Methods: OPTIONS, POST");
		header("Access-Control-Allow-Headers: t");
	}
    
	public function index()
    {

    }
	
	public function infoPorId(Request $request){
		$this->corsAccept();
		$post = $request->all();	
		
		$validacion = Validator::make($post, [
			'id_laboratorio' => 'int|required',
		]);	

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$lab = Laboratorio::find($post["id_laboratorio"]);
		if(!isset($lab->id_laboratorio)){
			return response()->json(array("respuesta"=>"error","descripcion"=>"no existe laboratorio asociado a ese id")); 
		}else{
			return response()->json(array("respuesta"=>"ok","descripcion"=>$lab));
		}
	}
	
	
	public function infoPorIdPlaca(Request $request){
		$this->corsAccept();
		$post = $request->all();

		$validacion = Validator::make($post, [
			'id_placa' => 'required',
		]);	

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$pc = LaboratorioEquipo::where("id_placa", $post["id_placa"])->first();

		if(isset($pc->id_laboratorio_equipo)){
			return response()->json(array("respuesta"=>"ok","descripcion"=>$pc));
		}else{
			return response()->json(array("respuesta"=>"error","descripcion"=>"PC no encontrado."));
		}
	}

	public function guardaIdPlaca(Request $request){
		$this->corsAccept();
		$post = $request->all();

		$validacion = Validator::make($post, [
			'id_placa' => 'required',
			'id_visita' => 'int|required',
		]);	

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$per = Persona::where("id_usuario", $post["id_usuario"])->first();
		if(!isset($per->id_persona)){
			return response()->json(array("respuesta"=>"error","descripcion"=>"Usuario no encontrado."));
		}
		$lab_rev = LaboratorioRevision::where("id_persona", $per->id_persona)->where("id_laboratorio_visita", $post["id_visita"])->first();
		if(!isset($lab_rev->id_laboratorio_revision)){
			return response()->json(array("respuesta"=>"error","descripcion"=>"Visita no encontrada."));
		}

		$equipo = LaboratorioEquipo::where("id_placa", $post["id_placa"])->first();
		if(isset($equipo->id_laboratorio_equipo)){
			return response()->json(array("respuesta" => "error",
				"descripcion" => "Ya existe un equipo con ese id de placa.", 
				"id_equipo" => $equipo->id_laboratorio_equipo));
		}
		$equipo = new LaboratorioEquipo();
		$equipo->id_laboratorio_revision = $lab_rev->id_laboratorio_revision;
		$equipo->id_placa = $post["id_placa"];
		if($equipo->save()){
			$arr = [];
			$arr["id_equipo"] = $equipo->id_laboratorio_equipo;
			return response()->json(array("respuesta"=>"ok","descripcion"=>$arr));
		}else{
			return response()->json(array("respuesta"=>"error","descripcion"=>"error al guardar."));
		}
	}

	// version anterior de servicio validado para primera version del json enviado
	public function oldGuardaInfo(Request $request){
		$this->corsAccept();
		$post = $request->all();	

		$validacion = Validator::make($post, [
			'id_equipo' => 'required',
			'datos' => 'json|required',
		]);	

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}
   
		$data_pc = json_decode($post["datos"], 1);
	
		$equipo = LaboratorioEquipo::find($post["id_equipo"]);
		$equipo->sistema_operativo = $data_pc["SystemSpecs"]["OSVersionName"];

		$total_ram = 0;
		foreach($data_pc["SystemSpecs"]["RAMCards"] as $ram){
			$total_ram += $ram["PhysicalMemory"];
		}
		function convert_bytes_to_specified($bytes, $to, $decimal_places = 0) {
			$formulas = array(
				'K' => round($bytes / 1024, $decimal_places),
				'M' => round($bytes / 1048576, $decimal_places),
				'G' => round($bytes / 1073741824, $decimal_places)
			);
			return isset($formulas[$to]) ? $formulas[$to] : 0;
		}
		
		$equipo->ram = convert_bytes_to_specified($total_ram, "M"); //Memoria RAM en MB
		$equipo->antivirus = $data_pc["Antivirus"];
		$equipo->resolucion_pantalla = $data_pc["SystemSpecs"]["GPUCurrentResolution"];
		$equipo->datos_test_lab = $post["datos"];
		$bajada = explode(" ", $data_pc["Network"]["SpeedTestDownload"]);
		$subida = explode(" ", $data_pc["Network"]["SpeedTestUpload"]);
		$equipo->velocidad_bajada = $bajada[0];
		$equipo->unidad_medida_bajada = $bajada[1];
		$equipo->velocidad_subida = $subida[0];
		$equipo->unidad_medida_subida = $subida[1];

		DB::beginTransaction();
		try{
			$equipo->save();
		}catch (\Exception $e){
			DB::rollback();
			return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar datos. ('.$e->getMessage().')']);
		}
		DB::commit();
		
		return response()->json(array("respuesta"=>"ok","descripcion"=>"Se ha guardado correctamente."));
	}

	public function guardaInfo(Request $request){
		$this->corsAccept();
		$post = $request->all();	

		$validacion = Validator::make($post, [
			'id_equipo' => 'required',
			'datos' => 'json|required',
		]);	
			
		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}
		$data_pc = json_decode($post["datos"], 1);
		
		$equipo = LaboratorioEquipo::find($post["id_equipo"]);
		$equipo->log = $post["datos"];
		$equipo->save();
		$equipo->sistema_operativo = $data_pc["diagnostico"]["SystemSpecs"]["OSVersionName"];
		
		$total_ram = 0;
		foreach($data_pc["diagnostico"]["SystemSpecs"]["RAMCards"] as $ram){
			$total_ram += $ram["PhysicalMemory"];
		}
		function convert_bytes_to_specified($bytes, $to, $decimal_places = 0) {
			$formulas = array(
				'K' => round($bytes / 1024, $decimal_places),
				'M' => round($bytes / 1048576, $decimal_places),
				'G' => round($bytes / 1073741824, $decimal_places)
			);
			return isset($formulas[$to]) ? $formulas[$to] : 0;
		}
		
		$equipo->tipo_equipo = $data_pc["diagnostico"]["systemType"];
		$equipo->ram = convert_bytes_to_specified($total_ram, "M"); //Memoria RAM en MB
		$equipo->antivirus = $data_pc["diagnostico"]["Antivirus"];
		$equipo->resolucion_pantalla = $data_pc["diagnostico"]["SystemSpecs"]["GPUCurrentResolution"];
		$equipo->datos_test_lab = $post["datos"];
		$bajada = $data_pc["velocidad"]["SpeedTestDownload"] != null ? explode(" ", $data_pc["velocidad"]["SpeedTestDownload"]) : null;
		$subida = $data_pc["velocidad"]["SpeedTestUpload"] != null ? explode(" ", $data_pc["velocidad"]["SpeedTestUpload"]) : null;
		$equipo->velocidad_bajada = $bajada[0] ?? null;
		$equipo->unidad_medida_bajada = $bajada[1] ?? null;
		$equipo->velocidad_subida = $subida[0] ?? null;
		$equipo->unidad_medida_subida = $subida[1] ?? null;
		$equipo->audifonos = $data_pc["cuestionario"]["audifonos"];
		$equipo->observaciones = $data_pc["cuestionario"]["comentarios"];
		
		DB::beginTransaction();
		try{
			$equipo->save();
		}catch (\Exception $e){
			DB::rollback();
			return response()->json(['resultado'=>'error','descripcion'=>'Error al guardar datos. ('.$e->getMessage().')']);
		}
		DB::commit();
		
		return response()->json(array("respuesta"=>"ok","descripcion"=>"Se ha guardado correctamente."));
	}

	// El siguiente metodo se reemplaza por el anterior ya que viene el dato 
	// del test velocidad de Internet
	public function testVelocidadGuarda(Request $request){
		$this->corsAccept();
		$post = $request->all();

		$validacion = Validator::make($post, [
			'id_equipo' => 'int|required',
			'velocidad_bajada' => 'int|required',
			'velocidad_subida' => 'int|required',
		]);	

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$equipo = LaboratorioEquipo::find($post["id_equipo"]);
		if(!isset($equipo->id_laboratorio_equipo)){
			return response()->json(array("respuesta"=>"error","descripcion"=>"no se encuentra el equipo")); 
		}
		$lab_rev = LaboratorioRevision::find($equipo->id_laboratorio_revision);
		$id_lab_visita = $lab_rev->id_laboratorio_visita;

		$cant_equipos_test_velocidad = $equipo->obtenerCantEquiposTestVelocidad($id_lab_visita);
		
		if($cant_equipos_test_velocidad > 5){
			/* Considerar cambiar el mensaje de respuesta */
			return response()->json(array("respuesta"=>"ok","descripcion"=>"Limite de pruebas de velocidad por laboratorio alcanzado"));
		}

		$equipo->velocidad_bajada = $post["velocidad_bajada"];
		$equipo->velocidad_subida = $post["velocidad_subida"];
		if($equipo->save()){
			return response()->json(array("respuesta"=>"ok","descripcion"=>"Se ha guardado correctamente"));
		}else{
			return response()->json(array("respuesta"=>"error","descripcion"=>"Error al guardar"));
		}
		
	}

	public function testVelocidadPorLab(Request $request){
		$this->corsAccept();
		$post = $request->all();

		$validacion = Validator::make($post, [
			'id_visita' => 'int|required',
		]);	

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		
		$pers = Persona::where("id_usuario", $post["id_usuario"])->first();
		if(!isset($pers->id_persona)){
			return response()->json(array("respuesta"=>"error","descripcion"=>"El técnico actual no existe")); 
		}

		$lab_visita = LaboratorioVisita::where("id_laboratorio_visita", $post["id_visita"])->where("id_tecnico_encargado", $pers->id_persona)->first();

		if(!isset($lab_visita->id_laboratorio_visita)){
			return response()->json(array("respuesta"=>"error","descripcion"=>"El id_visita no corresponde al técnico actual")); 
		}
		$cant_equipos_test_velocidad = $lab_visita->obtenerCantEquiposTestVelocidad($lab_visita->id_laboratorio_visita);
		
		$arr = [];
		$arr["cantidad_equipos_testeados"] = $cant_equipos_test_velocidad;

		return response()->json(array("respuesta"=>"ok","descripcion"=>$arr));
	}

	public function testDemoGuarda(Request $request){
		/* PENDIENTE: Aun no se implementa la demo. Se deberán agregar en BD campos de tiempo de ejecución y si se ejecutó correctamente o no */
		$this->corsAccept();
		$post = $request->all();	
		$arr = array();
		
		return response()->json(array("respuesta"=>"ok","descripcion"=>$arr));
	}

	public function resultadoTest(Request $request){
		$this->corsAccept();
		$post = $request->all();
		
		$validacion = Validator::make($post, [
			'id_equipo' => 'int|required',
		]);	

		if ($validacion->fails()) {
			return response()->json(array("respuesta"=>"error","descripcion"=>$validacion->errors()), 422); 
		}

		$equipo = LaboratorioEquipo::find($post["id_equipo"]);
		if(!isset($equipo->id_laboratorio_equipo)) {
			return response()->json(array("respuesta"=>"error","descripcion"=>"Equipo no encontrado")); 
		}

		if(!isset($equipo->datos_test_lab)) {
			return response()->json(array("respuesta"=>"error","descripcion"=>"Equipo sin datos de TestLab")); 
		}

		$aprueba["OSVersionName"] = false;
		$aprueba["RAMTotalmemory"] = false;
		$aprueba["CPUClockSpeed"] = false;
		$aprueba["SpeedTestUpload"] = false;
		$aprueba["testTimeDuration"] = false;
		$aprueba["usb"] = false;
		$aprueba["pantalla"] = false;
		$aprueba["audifonos"] = false;

		$s_o = $equipo->sistema_operativo;
		$win10 = strpos($s_o, 'Windows 10');
		$win8_1 = strpos($s_o, 'Windows 8.1');
		$win8 = strpos($s_o, 'Windows 8');
		$win7 = strpos($s_o, 'Windows 7');

		if($win10 !== false || $win8_1 !== false || $win8 !== false || $win7 !== false){
			$aprueba["OSVersionName"] = true;
		}

		if($equipo->ram > 1024){ //Valor en MB
			$aprueba["RAMTotalmemory"] = true;
		}

		$data_pc = json_decode($equipo->datos_test_lab, 1);
		
		if($data_pc["diagnostico"]["SystemSpecs"]["CPUClockSpeed"] > 1000){
			$aprueba["CPUClockSpeed"] = true;
		} 

		//if($equipo->unidad_medida_subida == "Mbit/s" && $equipo->velocidad_subida > 8){
		if($equipo->velocidad_subida >= 1){
		    $aprueba["SpeedTestUpload"] = true;
		} 

		$tiempo_demo = $data_pc["demo"]["testTimeDuration"] != null ? explode(":", $data_pc["demo"]["testTimeDuration"]) : null;
		if($tiempo_demo != null && $tiempo_demo[1] <= 5){//Tiempo en minutos. La ejecucion de la prueba demo debe ser menor o igual a 5min
			$aprueba["testTimeDuration"] = true;
		}

		if($data_pc["cuestionario"]["usb"] == true){
			$aprueba["usb"] = true;
		}

		if($data_pc["cuestionario"]["pantalla"] == true){
			$aprueba["pantalla"] = true;
		}

		if($data_pc["cuestionario"]["audifonos"] == true){
			$aprueba["audifonos"] = true;
		}

		if($aprueba["RAMTotalmemory"] == true && $aprueba["CPUClockSpeed"] == true && 
				$aprueba["SpeedTestUpload"] == true && $aprueba["testTimeDuration"] == true){
				$equipo->cumple_hardware = 1;
		}else{
			$equipo->cumple_hardware = 0;
		}
		$equipo->save();

        $respuestaOK = array(
            'ram' => $aprueba["RAMTotalmemory"],
            'cpu' => $aprueba["CPUClockSpeed"],
            'st' => $aprueba["SpeedTestUpload"],
            'pruebademo' => $aprueba["testTimeDuration"]
        );
		
		return response()->json($respuestaOK);
		
		//return response()->json(array("respuesta"=>$respuestaOK,"descripcion"=>$aprueba));
	}

	public function cuestionarioGuarda(Request $request){
		$this->corsAccept();
		$post = $request->all();	
		$arr = array();
		
		return response()->json(array("respuesta"=>"ok","descripcion"=>$arr));
	}

	public function jsonInfoGuarda(Request $request){
		$this->corsAccept();
		$post = $request->all();	

		//Se imprime por pantalla todos los parámetros de entrada
		arreglo($post);exit;
		$arr = array();
		
		return response()->json(array("respuesta"=>"ok","descripcion"=>$arr));
	}


}
