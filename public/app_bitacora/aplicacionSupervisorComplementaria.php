<?php
session_start();
if (empty($_SESSION['usuario'])) {
    header("Location: login.php");
    exit();
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('content-type: json; charset=utf-8');
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
    <link rel="stylesheet" type="text/css" href="css/clockpicker.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
          integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretty-checkbox@3.0/dist/pretty-checkbox.min.css">
    <link rel="stylesheet" type="text/css" href="css/bootstrap-datetimepicker.css">
    <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="js/bootstrap-datetimepicker.js"></script>
    <script type="text/javascript" src="js/locales/bootstrap-datetimepicker.es.js"></script>
    <script type="text/javascript" src="js/clockpicker.js"></script>
    <script type="text/javascript" src="js/popper.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/jquery.mask.js"></script>
    <script src="js/jquery.blockUI.js"></script>
    <script type="text/javascript"
            src="https://cdn.jsdelivr.net/npm/sweetalert2@7.29.1/dist/sweetalert2.all.min.js"></script>
    <script src="https://d3js.org/d3.v3.min.js"></script>
    <script src="js/aplicacionSupervisorComplementaria.js"></script>


    <title>ENDFID 2018</title>
</head>

<body>
<div class="container-fluid">
    <nav class="row navbar navbar-expand-lg navbar-dark" style="background-color: #3d51b5;">
        <form class="form-inline text-white fuente-gob-regular">
            <h3 class="mt-4 ml-4"><a href="index.php" class="text-white mt-3 h3"><i class="fa fw fa-arrow-left"></i></a>&nbsp;&nbsp;  Registro Aplicación Complementaria</h3>
        </form>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation" style="border: 2px solid;">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav mr-auto">
            </ul>
            <span class="navbar-text text-white">
                 <ul class="navbar-nav mr-auto">
                  <li class="nav-item active">
                    <p class="fuente-gob-bold mt-3 mr-4 ml-4"><?php echo utf8_encode(utf8_decode($_SESSION['nombres']. " " .$_SESSION['apellidos'])); ?></p>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link text-white mt-1 ml-4" href="logout.php" title="Cerrar Sesión"><i class="fas fa-sign-out-alt"></i></a>
                  </li>

                </ul>
            </span>
        </div>
    </nav>
    
    <!-- <nav class="row _nav navbar-expand-lg position-static">
        <div class="_nav-left text-white">
            <a href="index.php" class="nav-link text-white mt-3 ml-2 h3"><i class="fa fw fa-arrow-left"></i></a>
        </div>

        <div class="_nav-center text-white fuente-gob-regular">
            <h3 class="mb-3">Registro Aplicación Complementaria</h3>
        </div>

        <div class="_nav-right text-white"></div>

        <div class="_nav-right text-white ml-auto">
            <div class="row">
                <div class="col-sm-10">
                    <p class="fuente-gob-bold"><?php echo utf8_encode(utf8_decode($_SESSION['nombres'] . " " . $_SESSION['apellidos'])); ?></p>
                </div>

                <div class="col-sm-2">
                    <a class="nav-linkt text-white" href="logout.php" title="Cerrar Sesión"><i
                                class="fas fa-sign-out-alt"></i></a>
                </div>
            </div>
        </div>
    </nav>
 -->
    <div class="card mt-3" id="cardSeccion1">
        <div class="card-header fuente-gob-bold">
            <h5>1. Identificación de la Sede</h5>
        </div>

        <div class="card-body fuente-gob-regular">
            <div class="col-12 mb-2 pb-3 pt-3 _bg-verdeClaro">
                <div class="row mb-2 pb-3 pt-3">
                    <div class="col-sm-4">
                        <label>Región</label>
                        <select class="form-control custom-select" name="selectRegion" id="selectRegion">
                            <option value="-1">SELECCIONE REGION</option>
                        </select>    
                    </div>

                    <div class="col-sm-4">
                        <label>Nombre Universidad</label>
                        <select class="form-control custom-select" name="universidad" id="universidad">
                            <option value="-1">SELECCIONE UNIVERSIDAD</option>
                        </select>
                    </div>

                    <div class="col-sm-4">
                        <label>Nombre Sede</label>
                        <select class="form-control custom-select" name="sede" id="sede">
                            <option value="1000">SELECCIONE SEDE</option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-12 mb-2 pb-3 pt-3" id="direccionSede">
                        <div class='row'>
                            <div class="col-sm-3">
                                <label>Región Sede</label>
                                <h5 id="region"></h5>
                            </div>

                            <div class="col-sm-2">
                                <label>Comuna Sede</label>
                                <h5 id="comuna"></h5>
                            </div>
                            <div class='col-sm-3'>
                                <label>Encargado Apertura Sede</label>
                                <h5 id='encargado'></h5>
                            </div>
                            <div class='col-sm-2'>
                                <label>Teléfono Encargado Sede</label>
                                <h5 id='telefonoEncargado'></h5>
                            </div>
                            <div class='col-sm-2'>
                                <label>Horario Apertura Sede</label>
                                <h5 id='horarioApertura'></h5>
                            </div>

                            <!-- <div class="col-sm-4">
                                <label>Dirección Sede</label>
                                <h5 id="direccion"></h5>
                            </div> -->
                        </div>    
                        <div class='row pt-2'>
                            
                        </div>
                        <div class='row pt-2'>
                            <div class='col-sm-12 pt-2'>
                                <label>Observaciones Visita Previa</label>
                                <h5 id='observacionesLab'></h5>
                            </div>
                        </div> 
                </div> 
            </div>
            <div id="cardSeccion2">        
                <ul class="nav nav-tabs fuente-gob-light pt-4" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link" id="linkDia1" href="#dia1" role="tab" data-toggle="tab">Día 1</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" id="linkDia2" href="#dia2" role="tab" data-toggle="tab">Día 2</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" id="linkDia3" href="#dia3" role="tab" data-toggle="tab">Día 3</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" id="linkDia4" href="#dia4" role="tab" data-toggle="tab">Día 4</a>
                    </li>

                     <li class="nav-item">
                        <a class="nav-link" id="linkDiaComplementario" href="#diaComplementario" role="tab" data-toggle="tab">Día 1</a>
                    </li>
                </ul>

                <div class="tab-content pt-3">

                    <div role="tabpanel" class="container-fluid tab-pane" id="dia1">
                        <div class="row">
                            <div class="col-sm-12">
                                <h6 class=fuente-gob-bold>Día 1 (18 de Diciembre de 2018)</h6>
                            </div>
                        </div>
                        
                        <div class="row mb-2">
                            <div class="col-sm-12">
                                <div class="panel-group">
                                    <div class="panel panel-default" id="divLabsDia1"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div role="tabpanel" class="container-fluid tab-pane fade" id="dia2">
                        <div class="row">
                            <div class="col-sm-12">
                                <h6 class=fuente-gob-bold>Día 2 (19 de Diciembre de 2018)</h6>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-12">
                                <div class="panel-group">
                                    <div class="panel panel-default" id="divLabsDia2"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div role="tabpanel" class="container-fluid tab-pane fade" id="dia3">
                        <div class="row">
                            <div class="col-sm-12">
                                <h6 class=fuente-gob-bold>Día 3 (20 de Diciembre de 2018)</h6>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-12">
                                <div class="panel-group">
                                    <div class="panel panel-default" id="divLabsDia3"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div role="tabpanel" class="container-fluid tab-pane fade" id="dia4">
                        <div class="row">
                            <div class="col-sm-12">
                                <h6 class=fuente-gob-bold>Día 4 (21 de Diciembre de 2018)</h6>
                            </div>
                        </div>
                    

                        <div class="row">
                            <div class="col-sm-12">
                                <div class="panel-group">
                                    <div class="panel panel-default" id="divLabsDia4"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div role="tabpanel" class="container-fluid tab-pane fade" id="diaComplementario">
                        <div class="row">
                            <div class="col-sm-12">
                                <h6 class=fuente-gob-bold>Aplicación Complemantaria (23 de Enero de 2019)</h6>
                            </div>
                        </div>
                    

                        <div class="row">
                            <div class="col-sm-12">
                                <div class="panel-group">
                                    <div class="panel panel-default" id="divLabsDiaComplementario"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <hr class="separador-novisible">

        <div class="row mb-2" style="display: none;" id="mensajeGuardado">
            <div class="col-sm-4"></div>

            <div class="col-sm-4" id="divMensaje" style="border-radius: 5px 5px 5px 5px;">
                <p id="mensaje" class="mt-1 text-white font-weight-bold"></p>
            </div>

            <div class="col-sm-4"></div>
        </div>
    </div>
</div>
</body>