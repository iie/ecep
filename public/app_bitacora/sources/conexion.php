<?php
/**************CONEXION A BD*******************/
$bd = 'endfid2019Oficial';
$username = "postgres";
$host  = "162.216.18.16";
$password = "k1LL2018";
try{
    $dbX = new PDO('pgsql:host='.$host.';dbname='.$bd, $username, $password);
}
catch(PDOException $ex){
    arreglo(array("error"=>$ex));
}
/**************FIN CONEXION A BD*******************/
?>