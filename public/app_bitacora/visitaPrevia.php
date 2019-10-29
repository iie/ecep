<?php
session_start();
if (empty($_SESSION['usuario'])) {
    header("Location: login.php");
    exit();
}

/*
if($_SESSION['idRol'] != '10' || $_SESSION['idRol'] != '1'){
    header("Location: index.php");
    exit();
    //print_r($_SESSION['idRol']);exit;
}*/

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
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretty-checkbox@3.0/dist/pretty-checkbox.min.css">
    <link rel="stylesheet" type="text/css" href="css/bootstrap-datetimepicker.css">
    <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="js/bootstrap-datetimepicker.js"></script>
    <script type="text/javascript" src="js/locales/bootstrap-datetimepicker.es.js"></script>
    <script type="text/javascript" src="js/clockpicker.js"></script>
    <script type="text/javascript" src="js/popper.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/jquery.mask.js"></script>
    <script type="text/javascript" src="js/visitaPrevia.js"></script>   
    <script src="js/jquery.blockUI.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/sweetalert2@7.29.1/dist/sweetalert2.all.min.js"></script>
    <script src="https://d3js.org/d3.v3.min.js"></script>

    <title>ENDFID 2019</title>
</head>

<body>
<div class="container-fluid">
    <nav class="row _nav navbar-expand-lg position-static">
        <div class="_nav-left text-wit">
            <a href="/app_bitacora/index.php" class="nav-link text-wit mt-3 ml-2 h3"><i class="fa fw fa-arrow-left"></i></a>
        </div>

        <div class="_nav-center text-wit fuente-gob-regular">
            <h3 class="mb-3">Visita Previa</h3>
        </div>

        <div class="_nav-right text-wit"></div>

        <div class="_nav-right text-wit ml-auto">
            <div class="row">
                <div class="col-sm-8">
                    <p class="text-wit"><?php echo utf8_encode(utf8_decode($_SESSION['nombres'] . " " . $_SESSION['apellidos'])); ?></p>

                    <p hidden id="usuario"><?php echo utf8_encode(utf8_decode($_SESSION['id_usuario'])); ?></p>
                </div>

                <div class="col-sm-4">
                    <a class="nav-link text-wit" href="logout.php" title="Cerrar Sesión"><i class="fas fa-sign-out-alt"></i></a>
                </div> 
            </div>
        </div>
    </nav>

    <form id="form_endfid" name="submit-to-google-sheet" method="post">
        <div class="card mt-3" id="cardSeccion1">
            <div class="card-header fuente-gob-bold">
                <div class="row">
                    <div class="col-sm-6 pt-3">
                        <h5>1. Identificación de la Sede</h5>
                    </div>
                </div>
            </div>

            <div class="card-body fuente-gob-regular">
                <div class="col-12 mb-2 pb-3 pt-3 _bg-verdeClaro">
                    <div class="row mb-2 pb-3 pt-3">
                        <div class="col-sm-4">
                            <label>Región</label>
                            <select class="form-control custom-select" name="region" id="region">
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
                    <div class="row mb-2 pb-3 pt-3" id="direccionSede">
                        <div class="col-sm-4">
                            <label>Región</label>
                            <h5 id="regionInfo"></h5>
                        </div>

                        <div class="col-sm-4">
                            <label>Comuna</label>
                            <h5 id="comuna"></h5>
                        </div>

                        <div class="col-sm-4">
                            <label>Dirección</label>
                            <h5 id="direccion"></h5>
                        </div> 
                    </div> 
                </div>
                <br>
                <div class="mt-3" id="cardSeccion2">
                    <div class="row mb-2">
                        <div class="col-sm-4">
                            <label>Encargado sede</label>
                            <input type="text" class="form-control" name="encargado" id="encargado" disabled>
                        </div>

                        <div class="col-sm-4">
                            <label>E-Mail</label>
                            <input type="email" class="form-control" name="email" id="email" disabled>
                        </div>

                        <div class="col-sm-4">
                            <label>Teléfono</label>
                            <input type="text" class="form-control" name="contacto" id="contacto" disabled>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-sm-12">
                            <label>Observaciones de la sede</label>
                            <textarea rows="4" class="form-control" name="observaciones" id="observaciones" disabled></textarea>
                        </div>
                    </div>
                </div>  
            </div>
        </div>
        <div class="card mt-3" id="cardSeccion3">
            <div class="card-header fuente-gob-bold">
                <div class="row">
                    <div class="col-sm-6 pt-3">
                        <h5>2. Laboratorios</h5>
                    </div>
                </div>
            </div>

            <div class="card-body fuente-gob-regular">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="panel-group">
                            <div class="panel panel-default" id="laboratorios"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>   
        <hr class="separador-novisible">


 

       <!--  <div class="card" id="cardSeccion3">
            <div class="card-footer text-right fixed-bottom sin-bordes bg-white">
                <button type="button" class="btn btn-success" onclick="guardarRespuestas()"><i class="fas fa-save"></i>  Guardar</button>
            </div>
        </div> -->

        <hr class="separador-novisible">
        <div class="card-footer text-right fixed-bottom sin-bordes bg-white">
            <button type="button" id="guardar" class="btn btn-success" onclick="validar()" disabled="disabled"><i class="fas fa-save"></i>  Guardar Cambios</button>
        </div>
        <div class="row mb-2" style="display: none;" id="mensajeGuardado">
            <div class="col-sm-4"></div>

            <div class="col-sm-4" id="divMensaje" style="border-radius: 5px 5px 5px 5px;">
                <p id="mensaje" class="mt-1 text-wit font-weight-bold"></p>
            </div>

            <div class="col-sm-4"></div>
        </div>
    </form>
</div>


<!-- Modal -->
<div class="modal fade" id="confirmar" tabindex="-1" role="dialog" aria-labelledby="confirmar" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Guardar</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ¿Está seguro de que desea guardar?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary"  onclick="guardarInformacionSede();">Confirmar</button>
      </div>
    </div>
  </div>
</div>

</body>