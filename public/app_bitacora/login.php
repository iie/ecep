<?php
session_start();

if(!empty($_SESSION['usuario'])) {
    header("Location: index.php");
    exit();
}

if(isset($_GET['error'])){
    if($_GET['error']==1){
        echo '<script type="text/javascript">$("#mensajeError").html("Contraseña incorrecta");</script>';
    }else if($_GET['error']==2){
        echo '<script type="text/javascript">$("#mensajeError").html("Usuario y contraseña incorrecta");</script>';
    }
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
    <link rel="stylesheet" type="text/css" href="css/w3.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
    <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="js/jquery.mask.js"></script>
    <title>ENDFID 2019</title>
</head>

<body>
<div class="container">
    <div class="row ml-3 mr-4">
        <div class="col-sm-12 fondo">
            <div class="row">
                <div class="col-sm-1 ">
                    <a href="https://www.mineduc.cl"><img src="img/logo_mineduc2.png"></a>
                </div>
            </div>

            <hr class="separador-novisible">

            
                <div class="col-sm-12">
                    <h1 class="text-white">Evaluación Nacional Diagnóstica de la Formación Inicial Docente END FID</h1>
                </div>
            
        </div>
    </div>
    <div class="row  mr-4">
        
        <div class="col-sm-6 login">
            <form action="rest/validarLogin.php" method="POST">
                <div class="card-title mb-2">
                        <h1>Inicio de Sesión</h1>
                    </div>
                <div class="card sin-bordes w3-padding-24">
                    <div class="card-body ">
                        <div class="row">
                            <div class="col-sm-12">
                                <input id="usuario" name="usuario" class="required form-control w3-input " tabindex="1" accesskey="n" type="text" placeholder="Usuario"autocomplete="false">
                                
                            </div>
                        </div>

                        <hr class="separador-novisible">

                        <div class="row">
                            <div class="col-sm-12">
                                
                                <input id="clave" name="clave" class="required form-control w3-input" tabindex="2" accesskey="c" type="password" placeholder="Password" autocomplete="off">
                                
                            </div>
                        </div>

                        <hr class="separador-novisible">

                        <div class="row">
                            <div class="col-sm-12">
                                <button class="btn btn-loginn" type="submit" name="submit" accesskey="l" tabindex="4">Ingresar</button>

                                <span id="mensajeError" class="small _text-red"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<div class="container">
        <div class="footer_content">
            <p>Ministerio de Educación - Teléfono <a href="tel:+56224066000" class="">+56 2 24066000</a></p>
            <p><a href="http://www.mineduc.cl/politicas-de-privacidad/" class="">Políticas de Privacidad</a> | <a href="http://www.gob.cl/visualizadores/" class="">Visualizadores &amp; Plug-ins</a> | <a href="https://creativecommons.org/licenses/by/2.0/cl/" class="">CC</a></p>
            <div class="footer_barra"></div>
        </div>      
    </div>
</body>
</html>