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
    <link rel="stylesheet" type="text/css" href="css/clockpicker.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
          integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretty-checkbox@3.0/dist/pretty-checkbox.min.css">
    <link rel="stylesheet" type="text/css" href="css/bootstrap-datetimepicker.css">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css">
    <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script type="text/javascript" src="js/bootstrap-datetimepicker.js"></script>
    <script type="text/javascript" src="js/locales/bootstrap-datetimepicker.es.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>
    <script type="text/javascript" src="js/clockpicker.js"></script>
    <script type="text/javascript" src="js/popper.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/jquery.mask.js"></script>
    <script src="js/jquery.blockUI.js"></script>
    <script type="text/javascript"
            src="https://cdn.jsdelivr.net/npm/sweetalert2@7.29.1/dist/sweetalert2.all.min.js"></script>
    <script src="https://d3js.org/d3.v3.min.js"></script>
    <script src="js/aplicacionSupervisorComplementaria.js"></script>
    <script src="js/utils.js"></script>

    <title>ENDFID 2019</title>
</head>

<body>
<div class="container-fluid content blackout p-0" id="wad">
   <!-- NAVBAR -->
        <div class="encabezado" style="margin-right: auto!important;">
          <div class="row" style="">
              <div class="col-sm-8" style="text-align: left;">
                  Registro de Procesos - ENDFID 2019
              </div>

              <div class="col-sm-3 " style="width: 100%;white-space: nowrap;">
                <strong><span id="nombre_usuario" style="font-size: 15px;margin-left: 3px;"></span></strong>
                <a class="" href="#" onclick="redirectLogin(1)"><i class="fas fa-sign-out-alt" style="color: #fff;"></i></a>
              </div>
          </div>
        </div>
        <!--FIN NAVBAR-->
    
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
 --><div class="row mt-2 mg_top content">
            <div class="col-sm-6 pt-1 _tex_mora">
                <h2 style="width: 100%;white-space: nowrap;"><i class="fas fa-clipboard-check" ></i> Aplicación <b>Regular</b></h2>
            </div>
        </div>
    <div class="card  " id="cardSeccion1 " style="width:95%; margin:auto;">
        <div class="card-header _tex_mora sin-bordes pt-0 pb-0">
            <h5>FILTROS</h5>
        </div>

        <div class="card-body fuente-gob-regular">
            <div class="col-12 mb-2 pt-3 ">
                <div class="row mb-2 pb-3 pt-1">
                    <div class="col-sm-4 pt-2">
                        <label><b>Región</b></label>
                        <select class="form-control custom-select" name="selectRegion" id="selectRegion">
                            <option value="-1">Seleccione Región</option>
                        </select>    
                    </div>

                    <div class="col-sm-4  pt-3 paaddtop">
                        <label><b>Nombre Universidad</b></label>
                        <select class="form-control custom-select" name="universidad" id="universidad">
                            <option value="-1">Seleccione Universidad</option>
                        </select>
                    </div>

                    <div class="col-sm-4  pt-3 paaddtop">
                        <label><b>Nombre Sede</b></label>
                        <select class="form-control custom-select" name="sede" id="sede">
                            <option value="1000">Seleccione Sede</option>
                        </select>
                    </div>
                    <div class="col-sm-4  pt-3 paaddtop">
                        <label><b>Día de Aplicación</b></label>
                        <select class="form-control custom-select" name="dia" id="dia">
                            <option value="">Seleccione Día</option>
                        </select>
                    </div>
                    <div class="col-sm-4  pt-3 paaddtop">
                        <label><b>Laboratorio</b></label>
                        <select class="form-control custom-select" name="laboratorio" id="laboratorio">
                            <option value="">Seleccione Laboratorio</option>
                        </select>
                    </div>
                </div> 
            </div>

            <div id="cardSeccion2">        
                <ul class="nav nav-tabs fuente-gob-light pt-4" role="tablist" id="linkDia1">
                    

                </ul>

                <div class="tab-content pt-3">

                    <div role="tabpanel" class="container-fluid tab-pane p-0" id="dia1">
                        
                        
                        <div class="row mb-2">
                            <div class="col-sm-12 p-0">
                                <div class="panel-group">
                                    <div class="panel panel-default" id="divLabsDia1"></div>
                                </div>
                            </div>
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

                    <div role="tabpanel" class="container-fluid tab-pane fade p-0" id="diaComplementario">
                        <div class="row">
                            <div class="col-sm-12">
                                <h6 class=fuente-gob-bold>Aplicación Complemantaria (23 de Enero de 2019)</h6>
                            </div>
                        </div>
                    

                        <div class="row">
                            <div class="col-sm-12 m-0">
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