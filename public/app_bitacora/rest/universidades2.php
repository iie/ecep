<?php
require ("conectorBD.php");

//$id = $_GET['id'];

$conn = pg_connect("host=162.216.18.16 port=5432 dbname=endfid user=postgres password=k1LL2018");
if (!$conn) {
    echo "An error occurred.\n";
    exit;
}

$sql = "SELECT id_centro_institucion, nombre_institucion FROM centro_institucion";
//print_r($sql);exit;
$result = pg_query($conn, $sql);

if (pg_fetch_array($result) > 0) {
    $arrayJson = [];
    $i = 0;
    // output data of each row
    while($row = pg_fetch_assoc($result)) {

        $arrayJson[$i]= $row;
        $i++;
    }
} else {
    echo "0 results";
}

pg_close($conn);
echo json_encode($arrayJson);
return json_encode($arrayJson);
