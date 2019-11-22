<?php
namespace App\Http\Controllers\Api\ecep;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MonitoreoCallCenterController extends Controller
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
                "call_center" => "1ntKq11mGkFda4xCK3BqgUhz_ryTPwaWr", // Call Center
                "casos_especiales" => "1gk_G4AqsjUHpzuQdYeiX8-3WWaH5a4i1", // Casos Especiales
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