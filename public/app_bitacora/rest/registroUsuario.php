<?php
session_start();
if (empty($_SESSION['email'])) {
    header("Location: ../login.php");
    exit();
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="refresh" content="1; url=../index.php">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" type="text/css" href="../css/bootstrap.min.css"/>
    <link rel="stylesheet" type="text/css" href="../css/Estilo.css"/>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
    <script type="text/javascript" src="../js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="../js/popper.min.js"></script>
    <script type="text/javascript" src="../js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../js/jquery.mask.js"></script>
    <title>PISA 2018</title>
</head>

<body>
<div class="container-fluid">
    <nav class="row _nav navbar-expand-lg position-static">
        <div class="_nav-left text-white">
            <a href="javascript:history.back();" class="nav-link text-white mt-3 ml-2 h3"><i class="fa fw fa-arrow-left"></i></a>

        </div>

        <div class="_nav-center text-white">
            <h3 class="mb-3">Registro Nuevo Usuario</h3>
        </div>

        <div class="_nav-right text-white"></div>

        <div class="_nav-right text-white ml-auto dropdown">
            <btn class="btn btn-info dropdown-toggle" id="menu1" type="button" data-toggle="dropdown">
                <i class="fa fa-fw fa-user"></i>
            </btn>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="margin-right: 180px;">
                <p class="dropdown-item small font-weight-bold"><?php echo utf8_encode($_SESSION['nombre']); ?></p>
                <p class="dropdown-item small text-center"><?php echo utf8_encode($_SESSION['rolDescripcion']) .", ". utf8_encode($_SESSION['comuna']); ?></p>
                <a class="dropdown-item nav-link text-right" href="../logout.php"><i class="fa fa-fw fa-sign-out-alt"></i>Salir</a>
            </div>
        </div>
    </nav>
</div>
</body>

<?php
require ("conectorBD.php");
$rut = $_POST["rut"];
$nombre = $_POST["nombre"];
$correo = $_POST["correo"];
$telefono = $_POST["telefono"];
$region = $_POST["region"];
$comuna = $_POST["ciudad"];
$idRol = $_POST["idRol"];
$clave = $_POST["clave"];

$sql = "CALL registrarUsuario('". $rut ."', '". $nombre ."', '". $correo ."', '". $telefono ."', ". $region .", '". $comuna ."', ". $idRol .", '". $clave ."')";
if (mysqli_query($conn, $sql)) {
    echo "<div class='row'>";
    echo    "<div class='col-sm-2'></div>";

    echo    "<div class='col-sm-8 mt-2 mb-5'>";
    echo        "<div class='card'>";
    echo            "<div class='card-header _bg_gris2'>";
    echo                "<h4>Datos del Usuario</h4>";
    echo            "</div>";

    echo        "<div class='card-body text-center'>";
    echo            "<h3>Registro Exitoso</h3>";
    echo        "</div>";
    echo    "</div>";
    echo "</div>";

    echo    "<div class='col-sm-2'></div>";
    echo "</div>";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}
mysqli_close($conn);
?>

</html>
