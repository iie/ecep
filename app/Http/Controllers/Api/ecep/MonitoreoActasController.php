<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MonitoreoActasController extends Controller
{
     
    public function __construct()
    {
        $this->fields = array();    
    }   

	public function lista(Request $request){
        require realpath('../') . '/vendor/autoload.php';
        $ruta_conex = realpath('../') . '/app/Http/Controllers/Api/ecep/conexion_drive/';

        $secretPath = $ruta_conex . "client_secret.json";
        $credentialsPath = $ruta_conex . "credentials.json";
        $tokenPath = $ruta_conex . "token.json";
        if (!file_exists($secretPath)) exit("Client secret file not found");
        $client = new \Google_Client();
        $client->setAuthConfig($secretPath);
        $client->addScope(\Google_Service_Drive::DRIVE);
        if (file_exists($credentialsPath)) {
            $access_token = file_get_contents($credentialsPath);
            $client->setAccessToken($access_token);
            //Refresh the token if it's expired.
            if ($client->isAccessTokenExpired()) {
                $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
                file_put_contents($credentialsPath, json_encode($client->getAccessToken()));
            }
            $drive_service = new \Google_Service_Drive($client);
            $folders_ID = [
                "coordinacion" => "1t8L-HT4oFQjW5tXo8O15Aeoh_bT8stP-", //Actas Coordinación
                "impresion" => "1xlxX0Ll10i3FbzTcM8dJuXdExqMSqryu", //Impresión
                "callcenter" => "1EwAoULiLQA0uXmbbfhe5bMpx9NHOBrmE", //CallCenter
                "sistema_monitoreo" => "1C6DQvEQNu2IoIxhE-uAjQSIqezmC8DR4", //Sistema Monitoreo
                "aplicacion" => "1jpb2BOw_qpzczb-YxyUGzMZXWJ3tsh5h", //Aplicación
                "captura" => "1xijp9FTY6RC4ZmlffAlBJFeUnofeTsj_", //Captura
                "pregunta_abierta" => "1A_W8FvH6ZNldrajGM0r_Rt904Mdapr3k", //Pregunta abierta
            ]; 
            $final = [];
            foreach ($folders_ID as $key => $id) {
                $arr = [];
                $optParams = array(
                    'q' => "'$id' in parents",
                    'pageSize' => 1000 ,
                    'fields' => 'nextPageToken, files(id, name, webViewLink, mimeType, size, modifiedTime)'
                );
                $results = $drive_service->files->listFiles($optParams)->getFiles();
                foreach ($results as $result) {
                    $aux["id"] = $result["id"];
                    $aux["name"] = $result["name"];
                    $aux["size"] = $result["size"];
                    $aux["webViewLink"] = $result["webViewLink"];
                    $aux["mimeType"] = $result["mimeType"];
                    $aux["modifiedTime"] = $result["modifiedTime"];
                    $arr[] = $aux;
                }
                $final[$key] = $arr;
                unset($arr);
            }
            return response()->json(array("respuesta"=>"OK", "descripcion" => $final));
        } else {
            $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/oauth2callback.php';
            header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
            return response()->json(array("respuesta"=>"error", "descripcion" => "Sin credenciales"));
        }
	}
}