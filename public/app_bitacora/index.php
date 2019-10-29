<?php
session_start();
if (empty($_SESSION['usuario'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="icon" type="image/png" href="img/mineduc.png">
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/Estilo.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
          integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
    <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="js/popper.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/jquery.mask.js"></script>
    <script type="text/javascript" src="js/accesoRoles.js"></script>
    <title>ENDFID 2019</title>
</head>
<body>

<div class="container">
    

    <div class="row ">
        <input type="hidden" id="idRol" value='<?php echo utf8_encode($_SESSION['idRol']); ?>'>
        
                      
        <div class="col-sm-4 p-0"> 
            <div class="row text-center col-sm-12 p-0" id="btnVisitaPrevia">
                <a href="visitaPrevia.php" class="btn colo-m" ><i class="fas fa-clipboard-check"></i> Visitas Previas</a>
            </div>

                    <!-- <div class="row text-center pt-4" id="btnAplicacionSupervisor">
                        <div class="col-sm-12">
                            <a href="aplicacionSupervisorComplementaria.php" class="btn btn-info btn-lg" style="white-space: inherit"><i class="fas fa-desktop"></i> Registro Aplicación Complementaria (Supervisor)</a>
                        </div>
                    </div> -->  
        </div>

        <div class="col-sm-4 p-0">
            <div class="row text-center col-sm-12 p-0" id="btnAplicacion">
                <a href="aplicacionComplementaria.php" class="btn colo-m" ><i class="fas fa-clipboard-check"></i> Aplicación Regular</a>
            </div>
        </div>

        <div class="col-sm-4 p-0">
            <div class="row text-center col-sm-12 p-0" id="btnVisitaTecnica">
                <a href="visitaTecnica.php" class="btn colo-m"><i class="fas fa-clipboard-check"></i> Aplicación Complementaria</a>
            </div>
        </div>
    </div>

    <!-- <footer class="bg-secondary fixed-bottom">
        <div class="col-sm-12 text-center mb-2">
            
            <small><b>2018 ENDFID</b></small>
            <a class="nav-link mt-1 ml-4" href="logout.php" title="Cerrar Sesión"><i class="fas fa-sign-out-alt"></i></a>
           
        </div>
    </footer> -->
</div>
</body>
</html>



