<?php
$usuario = trim($_POST['usuario']);
$clave = md5(trim($_POST['clave']));

if (empty($usuario) || empty($clave)) {
    header("Location: ../login.php");
    exit();
}

$sql = "SELECT u.id, p.nombres, p.apellidos, p.run, p.correo_electronico_principal, p.telefono_principal,
        u.usuario, u.contrasena,
        r.idrol from personas p
        INNER JOIN usuarios u ON (u.id = p.id_usuario)
        INNER JOIN rolusuario r ON (r.id_usuario = u.id)
        WHERE usuario = '" . $usuario . "'";

$conn = pg_connect("host=162.216.18.16 port=5432 dbname=endfid user=postgres password=k1LL2018");

if (!$conn) {
    echo "An error occurred.\n";
    exit;
}

$result = pg_query($conn, $sql);
$rolArray = [];

if ($row = pg_fetch_array($result)) {
    //print_r(pg_fetch_all($result));exit;

    if ($row['contrasena'] == $clave) {
        session_start();
        $_SESSION['id_usuario'] = $row['id'];
        $_SESSION['nombres'] = $row['nombres'];
        $_SESSION['apellidos'] = $row['apellidos'];
        $_SESSION['run'] = $row['run'];
        $_SESSION['correo'] = $row['correo_electronico_principal'];
        $_SESSION['telefono'] = $row['telefono_principal'];
        $_SESSION['usuario'] = $row['usuario'];
        $_SESSION['clave'] = $row['contrasena'];
        //$_SESSION['idRol'] = $row['idrol'];

        foreach(pg_fetch_all($result) as $fila){
            array_push($rolArray, $fila['idrol']);
        }

        $_SESSION['idRol'] = json_encode(["idRol" => $rolArray]);
        //print_r(json_encode(["idRol" => $rolArray]));exit;

        header("Location: ../index.php");
    } else {
        header("location:../login.php?error=1");
        exit();
    }
} else {
    header("location:../login.php?error=2");
    exit();
}