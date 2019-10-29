<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
/**************CONEXION A BD*******************/
$path = realpath('../../../');
$env = file($path . "/.env");
$exp = '(DB_DATABASE)';
$bd_key = preg_grep("/".$exp."/is", $env);
$arr_val = array_values($bd_key);
$db_name = explode("DB_DATABASE=",$arr_val[0]);

$bd = $db_name[1];
$username = "prcon2019_prcon2019";
$host  = "localhost";
$password = "k1LL2018@iieEnd2009Fid";
try{
    $dbX = new PDO('pgsql:host='.$host.';dbname='.$bd, $username, $password);
}
catch(PDOException $ex){
    arreglo(array("error"=>$ex));
}
/**************FIN CONEXION A BD*******************/
?>