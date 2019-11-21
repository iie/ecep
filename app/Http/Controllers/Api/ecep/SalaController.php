<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Infraestructura\Sala;
use App\Models\Core\Comuna;
use App\Models\RRHH\Persona;
use App\Models\Infraestructura\Estimacion;
use App\Models\Infraestructura\Sede;
use App\Models\Evaluado\Asignatura;
use App\Models\Evaluado\Prueba;
use App\Models\Evaluado\Evaluado;

use App\Models\Infraestructura\_Estimacion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class SalaController extends Controller
{
	 
	public function __construct()
    {
		$this->fields = array();	
    }	

    public function sincronizaEstimacion(Request $request){
		
		
		$evaluadosSede = DB::select("select p.run, p.id_persona, pc.id_cargo, pc.estado from rrhh.persona as p, rrhh.persona_cargo as pc 
				where p.id_persona = pc.id_persona and p.borrado = false and pc.borrado = false order by pc.estado desc");
		
		// contratado						
		// capacitado
		// seleccionado
		// preseleccionado
		// reclutado
		// rechazado

		foreach($evaluadosSede as $evaluadosSedeAux){
			if($evaluadosSedeAux->estado == 'contratado'){
				$c = 1;
			}
			elseif($evaluadosSedeAux->estado == 'capacitado'){
				$c = 2;
			}	
			elseif($evaluadosSedeAux->estado == 'seleccionado'){
				$c = 3;
			}	
			elseif($evaluadosSedeAux->estado == 'preseleccionado'){
				$c = 4;
			}	
			elseif($evaluadosSedeAux->estado == 'rechazado'){
				$c = 5;
			}				
			elseif($evaluadosSedeAux->estado == 'reclutado'){
				$c = 6;
			}	
			
			$cargoFinal[$evaluadosSedeAux->run][] = $c."_".$evaluadosSedeAux->estado;
		}		
		
		foreach($cargoFinal as $idPersona=>$cargos){
			
			sort($cargos);
			
			foreach($cargos as $id_cargo=>$estado){
				
				if($estado == '1_contratado'){
					$estadoFinal[$idPersona] = $estado;
					$estadoFinal2[$idPersona] = "contratado";
				}
				elseif($estado == '2_capacitado'){
					$estadoFinal[$idPersona] = $estado;
					$estadoFinal2[$idPersona] = "capacitado";
				}	
				elseif($estado == '3_seleccionado'){
					$estadoFinal[$idPersona] = $estado;
					$estadoFinal2[$idPersona] = "seleccionado";
				}	
				elseif($estado == '4_preseleccionado'){
					$estadoFinal[$idPersona] = $estado;
					$estadoFinal2[$idPersona] = "preseleccionado";
				}	
				elseif($estado == '5_rechazado'){
					$estadoFinal[$idPersona] = $estado;
					$estadoFinal2[$idPersona] = "rechazado";
				}	
				elseif($estado == '6_reclutado'){
					$estadoFinal[$idPersona] = $estado;
					$estadoFinal2[$idPersona] = "reclutado";
				}	
				
				break;
			}
		}
		
		
		foreach($estadoFinal2 as $id_persona => $estado){
			$p = Persona::find($id_persona);
			$p->_estado = $estado;
			//$p->save();
		}
		//arreglo($estadoFinal2); 
		arreglo($cargoFinal);
		
		
		
		exit;
		// $evaluadosSede = DB::select("SELECT _estimacion.id_estimacion,id_sede_ecep, count(id_evaluado) as total FROM infraestructura.sala, infraestructura._estimacion, evaluado.evaluado where 
		// infraestructura.sala.id_estimacion = infraestructura._estimacion.id_estimacion
		// and evaluado.evaluado.id_sala = infraestructura.sala.id_sala
		// and infraestructura.sala.nro_sala <> 0
		// group by infraestructura._estimacion.id_estimacion, id_sede_ecep");
		
		// foreach($evaluadosSede as $Aux){
			// $tEv[$Aux->id_estimacion]  = $Aux->total;
		// }
		
		// $_estimacion = _Estimacion::get();
		// foreach($_estimacion as $_estimacionAux){
			// $_estimacionAux->docentes = $tEv[$_estimacionAux->id_estimacion];
			// $_estimacionAux->examinadores = $_estimacionAux->salas;
			// $_estimacionAux->anfitriones = 	round($_estimacionAux->salas*0.5,0);
			// $_estimacionAux->supervisores = round($_estimacionAux->salas/7,0);	
			// $_estimacionAux->jefes_sede = 1;				
			// $_estimacionAux->save();
		// }
		// exit;

		$sede = Sede::get();
		foreach($sede as $sedeAux){
			if($sedeAux->id_estimacion!=""){
				$datosAntiguos[$sedeAux->id_sede] = $sedeAux->id_estimacion;
			}
			
		}
		foreach($datosAntiguos as $idSede=>$datosAntiguosAux){
			
			$estimacion = Estimacion::find($datosAntiguosAux);	
			if(isset($estimacion->id_comuna)){
				$_estimacion = DB::select("select * from infraestructura._estimacion where id_comuna = ".$estimacion->id_comuna." and salas = ".$estimacion->salas." and dia = 1");
				if(isset($_estimacion[0]->id_estimacion)){
					$sede = Sede::find($idSede);
					$sede->id_estimacion = $_estimacion[0]->id_estimacion;
					$sede->save();
					//echo "si tiene<br/>";
				}
				else{
					$sede = Sede::find($idSede);
					$sede->id_estimacion = null;
					$sede->save();				
					//echo "no tiene<br/>";
				}
			}
			else{
				$sede = Sede::find($idSede);
				$sede->id_estimacion = null;
				$sede->save();	
			}
			
		}
		//arreglo($datosAntiguos);
		//$estimacion = Estimacion::get();
		//foreach()
		
	}	
	public function sqlToTable(Request $request){

		$sql = "
			SELECT 
			_estimacion.dia , id_sede_ecep as idSede, nombre as comuna, nro_sala, id_sala_ecep as CodigoSala, serie_desde, serie_hasta, cantidad, codigo_caja, codigo_sobre,

			CASE
			   WHEN caja_contingencia is true THEN 'SI' ELSE 'NO'
			END 
			 AS \"cajaContingencia\", 
			 
			 sala.dispositivo as sala_dispositivo, aplicador, nro_lista, serie, rut, nombres, apellido_paterno, apellido_materno, genero, forma, asignatura, evaluado.dispositivo as evaluado_dispositivo, evaluado.contingencia as evaluado_contingencia, adecuacion, 
			 
			CASE
			   WHEN ayuda_tecnica is true THEN 'SI' ELSE 'NO'
			END 
			 AS \"ayudaTecnica\"		 

			FROM evaluado.evaluado as evaluado, infraestructura._estimacion as _estimacion, infraestructura.sala as sala, evaluado.prueba as prueba, evaluado.asignatura as asignatura, core.comuna as comuna where 
			_estimacion.id_comuna = comuna.id_comuna 
			and sala.id_estimacion = _estimacion.id_estimacion
			and evaluado.id_sala = sala.id_sala
			and evaluado.id_prueba = prueba.id_prueba
			and prueba.id_asignatura = asignatura.id_asignatura
			order by _estimacion.dia, id_sede_ecep , id_sala_ecep , nro_lista";
		
		$listadoCompleto = DB::select($sql);		
		$cols = json_decode(json_encode($listadoCompleto[0]),1);

		$file = "ECEP_planillaEvaluados-".date("Y-m-d_H_i_s").".xls";			

		header("Content-type: application/vnd.ms-excel");
		header("Content-Disposition: attachment; filename=".$file);
		header("Pragma: no-cache");
		header("Expires: 0");



		
		$t= "<table>";
		$t.= "<tr>";
		foreach($cols as $index=>$colsAux){
			$t.= "<td>".trim($index)."</td>";
			$colsArr[] = trim($index);
		}
		$t.= "</tr>";

		foreach($listadoCompleto as $listadoCompletoAux){
			$t.= "<tr>";
			foreach($listadoCompletoAux as $valor){
				$t.= "<td>".trim(str_replace(".",",",$valor))."</td>";
			}	
			$t.= "</tr>";
		}
		$t.= "</table>";
		
		echo utf8_decode($t);	

		
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

	// public function importaSedes(Request $request){
		// $x = file("/home/ecep2019/public_html/app/Http/Controllers/Api/ecep/txt/salas_d2.txt");
		// foreach($x as $xAux){
			// $l[] = explode("\t", trim($xAux));
		// }
		// foreach($l as $lAux){
			// if($lAux[6]!=0){
				// $ll[$lAux[5]][$lAux[0]] = $lAux;	
			// }
			
		// }
		// foreach($ll as $comuna =>$sedes){
			// foreach($sedes as $sede){
				// $ctdSalas = $sede[6];
				
				// $com = DB::select("SELECT * FROM core.comuna where nombre ilike '".str_replace("'","''",$comuna)."';");
				// if(isset($com[0]->id_comuna)){
					// $est = new _Estimacion();
					// $est->id_comuna = $com[0]->id_comuna;
					// $est->id_sede_ecep = $sede[0];
					// $est->salas = $ctdSalas;
					// $est->dia = 2;
					// $est->save();
					
				// }
				// else{
					// echo $comuna;exit;
				// }
			// }
		// }
	// }	
	
	// public function importaSalas(Request $request){
		// $x = file("/home/ecep2019/public_html/app/Http/Controllers/Api/ecep/txt/salas_d2.txt");
		// foreach($x as $xAux){
			// $l[] = explode("\t", trim($xAux));
		// }
		// foreach($l as $lAux){
			// $_estimacion = _Estimacion::where('id_sede_ecep', $lAux[0])->first();
			// $sala = new Sala(); 
			// $sala->nro_sala	 = $lAux[6];
			// $sala->serie_desde	= $lAux[8];
			// $sala->serie_hasta	= $lAux[9];
			// $sala->cantidad	=  $lAux[10];
			// $sala->codigo_caja = $lAux[11];	
			// $sala->codigo_sobre	 = $lAux[12];
			// $sala->contingencia	= ($lAux[13]=='SI')?true:false;
			// $sala->dispositivo	= $lAux[14];
			// $sala->aplicador	= $lAux[15];
			// $sala->id_sala_ecep	= $lAux[7];
			// $sala->id_estimacion = $_estimacion->id_estimacion;	
			// $sala->save();
			
			// //arreglo($lAux);exit;
			// //if($lAux[6]!=0){
				// //$ll[$lAux[5]][$lAux[0]] = $lAux;	
			// //}
		// }
		
	
	// }	

	public function importaEvaluados(Request $request){
		exit;
		//pruebas
		$pruebas = DB::select("select id_prueba,forma, asignatura.id_asignatura, asignatura.asignatura from evaluado.prueba as prueba, evaluado.asignatura as asignatura where prueba.id_asignatura = asignatura.id_asignatura");
		foreach($pruebas as $pruebasAux){
			$_prueba[$pruebasAux->forma."__".$pruebasAux->asignatura] = $pruebasAux->id_prueba;	
		}
		
		//salas
		$sala = Sala::where("nro_sala","!=","0")->get();
		foreach($sala as $salaAux){
			$_sala[$salaAux->id_sala_ecep] =  $salaAux->id_sala;
		}

		$x = file("/home/ecep2019/public_html/app/Http/Controllers/Api/ecep/txt/evaluados_d2.txt");
		foreach($x as $xAux){
			$l[] = explode("\t", trim($xAux));
		}
	    // [0] => IdSede
		// [1] => nroSala
		// [2] => CodigoSala
		// [3] => NroLista
		// [4] => serie
		// [5] => RUN
		// [6] => DvRun
		// [7] => nombres
		// [8] => APaterno
		// [9] => AMaterno
		// [10] => sexo
		// [11] => forma
		// [12] => id_cat_prueba
		// [13] => Asignatura
		// [14] => dispositivo
		// [15] => Contingencia
		// [16] => Adecuacion
		// [17] => AyudaTecnica
		// [18] => DiaAplicacion	
		foreach($l as $lAux){
			$evaluado = new Evaluado();
			$evaluado->id_prueba = $_prueba[$lAux[11]."__".$lAux[13]];
			$evaluado->rut = $lAux[5]."-".$lAux[6];
			$evaluado->nombres = $lAux[7];
			$evaluado->apellido_paterno =  $lAux[8];
		    $evaluado->apellido_materno  =  $lAux[9]; 
			$evaluado->genero  =  $lAux[10]; 
			$evaluado->id_sala = $_sala[$lAux[2]];
			$evaluado->nro_lista = $lAux[3];
			$evaluado->serie = $lAux[4];
			$evaluado->dispositivo  = $lAux[14];
			$evaluado->contingencia = ($lAux[15]=='SI')?true:false;
			$evaluado->adecuacion = $lAux[16];
			$evaluado->ayuda_tecnica = ($lAux[17]=='SI')?true:false;
			$evaluado->dia = 2;
			$evaluado->save();
		}
	}	
    
	public function importaAsignaturas(Request $request){
		exit;
		// $x = file("/home/ecep2019/public_html/app/Http/Controllers/Api/ecep/asignaturas.txt");
		// foreach($x as $xAux){
			// $l[] = explode("\t", trim($xAux));
		// }
		
		// foreach($l as $lAux){
			// $enTXT[] = 	$lAux[1];
		// }
	
		$asignatura = Asignatura::get();
		foreach($asignatura as $asignaturaAux){
			$prueba = new Prueba();
			$prueba->id_asignatura = $asignaturaAux->id_asignatura;
			$prueba->forma = 'A';
			$prueba->save();
			
			$prueba = new Prueba();
			$prueba->id_asignatura = $asignaturaAux->id_asignatura;
			$prueba->forma = 'B';
			$prueba->save();
			// if(in_array($asignaturaAux->asignatura, $enTXT)){
				
			// }
			// else{
				// echo "rtgs<br>";
				// $aa = Asignatura::where("asignatura", $asignaturaAux->asignatura)->first();
				// $aa->delete();
		
			// }
			//$enBD[] = $asignaturaAux->asignatura;	
		}	
		
		// foreach($l as $lAux){
			// $Asignatura = Asignatura::where('asignatura', $lAux[1])->first();
			// if(isset($Asignatura->id_asignatura)){
				
			// }
			// else{
				// // $as = new Asignatura;
				// // $as->asignatura	 = 	trim($lAux[1]);
				// // $as->save();
			// }
		// }
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
