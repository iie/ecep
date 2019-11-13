<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\RRHH\Persona;
use App\Models\RRHH\Cargo;
use App\Models\RRHH\PersonaCargo;
use App\Models\RRHH\PersonaArchivo;
use App\Models\Infraestructura\Institucion;
use App\Models\Core\TablaMaestra;
use App\Models\Core\Comuna;
use App\Models\Core\Region;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MonitoreoInfraestructuraController extends Controller
{
     
    public function __construct()
    {
        $this->fields = array();    
    }   

    public function listaSedes(Request $request){
        
        $post = $request->all();    

        $sql = DB::select("SELECT DISTINCT
                            infraestructura.estimacion.id_estimacion,
                            core.region.orden_geografico,
                            core.region.nombre as region,
                            core.provincia.nombre as provincia,
                            core.comuna.nombre as comuna,
                            infraestructura.estimacion.docentes,
                            infraestructura.estimacion.salas,
                            infraestructura.estimacion.examinadores,
                            infraestructura.estimacion.anfitriones,
                            infraestructura.estimacion.supervisores,
                            infraestructura.estimacion.jefes_sede,
                            infraestructura.estimacion.dia,
                            infraestructura.estimacion.id_sede_ecep,
                            infraestructura.sede.id_sede,
                            SUM(infraestructura.sede.salas_disponibles) as salas_disponibles
                            FROM
                            infraestructura.estimacion
                            INNER JOIN core.comuna ON infraestructura.estimacion.id_comuna = core.comuna.id_comuna
                            INNER JOIN core.provincia ON core.comuna.id_provincia = core.provincia.id_provincia
                            INNER JOIN core.region ON core.provincia.id_region = core.region.id_region
                            LEFT JOIN infraestructura.sede ON infraestructura.sede.id_estimacion = infraestructura.estimacion.id_estimacion
                            GROUP BY infraestructura.estimacion.id_estimacion,
                            core.region.orden_geografico,
                            core.region.nombre,
                            core.provincia.nombre,
                            core.comuna.nombre,
                            infraestructura.estimacion.docentes,
                            infraestructura.estimacion.salas,
                            infraestructura.estimacion.examinadores,
                            infraestructura.estimacion.anfitriones,
                            infraestructura.estimacion.supervisores,
                            infraestructura.estimacion.jefes_sede,
                            infraestructura.sede.id_sede
                            ORDER BY core.region.orden_geografico");

        $total_sedes_req = sizeof($sql);
        foreach ($sql as $value) {
            $arr[$value->id_estimacion][$value->region][$value->provincia][$value->comuna]["docentes"] = $value->docentes;
            $arr[$value->id_estimacion][$value->region][$value->provincia][$value->comuna]["salas_requeridas"] = $value->salas;
            $arr[$value->id_estimacion][$value->region][$value->provincia][$value->comuna]["examinadores"] = $value->examinadores;
            $arr[$value->id_estimacion][$value->region][$value->provincia][$value->comuna]["anfitriones"] = $value->anfitriones;
            $arr[$value->id_estimacion][$value->region][$value->provincia][$value->comuna]["supervisores"] = $value->supervisores;
            $arr[$value->id_estimacion][$value->region][$value->provincia][$value->comuna]["jefes_sede"] = $value->jefes_sede;
            $arr[$value->id_estimacion][$value->region][$value->provincia][$value->comuna]["salas_disponibles"] = $value->salas_disponibles;
            $arr[$value->id_estimacion][$value->region][$value->provincia][$value->comuna]["id_sede"] = $value->id_sede;
            $arr[$value->id_estimacion][$value->region][$value->provincia][$value->comuna]["dia"] = $value->dia;
            $arr[$value->id_estimacion][$value->region][$value->provincia][$value->comuna]["id_sede_ecep"] = $value->id_sede_ecep;
        }

        $arrFinal = [];
        $cont_docentes = 0;
        $cont_salas_disponibles = 0;
        $cont_salas_requeridas = 0;
        $cont_sedes_confirmadas = 0;
        foreach ($arr as $estimacion => $data_estimacion){
            foreach ($data_estimacion as $region => $data_region) {
                foreach ($data_region as $provincia => $data_provincia) {
                    $arrComuna = [];
                    foreach ($data_provincia as $comuna => $data_comuna) {
                        if($data_comuna["id_sede"] != null){
                            $cont_sedes_confirmadas++;
                        }
                        if($data_comuna["salas_disponibles"] != null){
                            $cont_salas_disponibles++;
                        }
                        $data_comuna["visita_previa"] = false;
                        $cont_docentes += $data_comuna["docentes"];
                        $cont_salas_requeridas += $data_comuna["salas_requeridas"];
                        $aux["nombre_comuna"] = $comuna;
                        $aux["data_comuna"] = $data_comuna;
                        $arrComuna[] = $aux;
                    }
                    $auxProv["nombre_provincia"] = $provincia;
                    $auxProv["data_provincia"] = $arrComuna;
                    unset($arrComuna);
                    $arrProv[] = $auxProv;
                }
                $auxRegion["nombre_region"] = $region;
                $auxRegion["data_region"] = $arrProv;
                unset($arrProv);
                $arrFinal[] = $auxRegion;
            }
        }
        $arrFinal["contadores"]["total_sedes_confirmadas"] = $cont_sedes_confirmadas;
        $arrFinal["contadores"]["total_sedes_requeridas"] = $total_sedes_req;
        $arrFinal["contadores"]["total_docentes"] = $cont_docentes;
        $arrFinal["contadores"]["total_salas_requeridas"] = $cont_salas_requeridas;
        $arrFinal["contadores"]["total_salas_disponibles"] = $cont_salas_disponibles;
        return response()->json(array("resultado"=>"ok","descripcion"=>$arrFinal)); 
    }

    public function listaCentroOperaciones(Request $request){
        
        $post = $request->all();    
        
		$sql = DB::select("SELECT
                        core.region.orden_geografico,
                        core.region.nombre AS region,
                        core.provincia.nombre AS provincia,
                        core.comuna.nombre AS comuna,
                        infraestructura.centro_operaciones.confirmado,
                        infraestructura.centro_operaciones.camara_operativa,
                        infraestructura.centro_operaciones.contacto_nombre,
                        infraestructura.centro_operaciones.contacto_email,
                        infraestructura.centro_operaciones.encargado_nombre,
                        infraestructura.centro_operaciones.encargado_mail
                        FROM
                        infraestructura.centro_operaciones
                        INNER JOIN core.comuna ON infraestructura.centro_operaciones.id_comuna = core.comuna.id_comuna
                        INNER JOIN core.provincia ON core.comuna.id_provincia = core.provincia.id_provincia
                        INNER JOIN core.region ON core.provincia.id_region = core.region.id_region
                        ORDER BY
                        core.region.orden_geografico ASC");
        $total = sizeof($sql);
        
        foreach ($sql as $value) {
            $arr[$value->region][$value->provincia][$value->comuna]["confirmado"] = $value->confirmado;
            $arr[$value->region][$value->provincia][$value->comuna]["camara_operativa"] = $value->camara_operativa;
            $arr[$value->region][$value->provincia][$value->comuna]["encargado"] = $value->contacto_nombre;
            $arr[$value->region][$value->provincia][$value->comuna]["encargado_email"] = $value->contacto_email;
        }

		$arrFinal = [];
        $cont_camaras = 0;
        $cont_habilitados = 0;
        foreach ($arr as $region => $data_region) {
            foreach ($data_region as $provincia => $data_provincia) {
                foreach ($data_provincia as $comuna => $data_comuna) {
                    if($data_comuna["confirmado"] == 2){
                        $cont_habilitados++;
                    }
                    if($data_comuna["camara_operativa"] == true){
                        $cont_camaras++;
                    }
                    $auxComuna["nombre_comuna"] = $comuna;
                    $auxComuna["confirmado"] = $data_comuna["confirmado"];
                    $auxComuna["camara_operativa"] = $data_comuna["camara_operativa"];
                    $auxComuna["encargado"] = $data_comuna["encargado"];
                    $auxComuna["encargado_email"] = $data_comuna["encargado_email"];
                    $arrComuna[] = $auxComuna;
                }
                $auxProv["nombre"] = $provincia;
                $auxProv["data_provincia"] = $arrComuna;
                unset($arrComuna);
                $arrProv[] = $auxProv;
            }
            $auxRegion["region"] = $region;
            $auxRegion["data_region"] = $arrProv;
            unset($arrProv);
            $arrFinal[] = $auxRegion;
        }
        $arrFinal["contadores"]["total"] = $total;
        $arrFinal["contadores"]["habilitados"] = $cont_habilitados; 
        $arrFinal["contadores"]["camaras"] = $cont_camaras; 
		
        return response()->json(array("resultado"=>"ok","descripcion"=>$arrFinal)); 
    }
}

