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
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretty-checkbox@3.0/dist/pretty-checkbox.min.css">
    <link rel="stylesheet" type="text/css" href="css/bootstrap-datetimepicker.css">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css">
    <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script type="text/javascript" src="js/bootstrap-datetimepicker.js"></script>
    <script type="text/javascript" src="js/locales/bootstrap-datetimepicker.es.js"></script>
    <script type="text/javascript" src="js/clockpicker.js"></script>
    <script type="text/javascript" src="js/popper.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/jquery.mask.js"></script>
    <script type="text/javascript" src="js/visitaPrevia.js"></script> 
    <script type="text/javascript" src="js/utils.js"></script>   
    <script src="js/jquery.blockUI.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/sweetalert2@7.29.1/dist/sweetalert2.all.min.js"></script>
    <script src="https://d3js.org/d3.v3.min.js"></script>

    <title>ENDFID 2019</title>
</head>

<body>
    <!--<div id="divBlock" class="block" style="display: none;"></div>-->
<div class="container content blackout p-0" id="asw">
    
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

    <form id="form_endfid" name="submit-to-google-sheet" method="post" style="margin-top:50px;">

        <div class="row mg_top">
            <div class="col-sm-6  _tex_mora">
                <h2 class="ml-3"><i class="fas fa-clipboard-check" ></i> Visita <b>Previa</b></h2>
            </div>
        </div>
        <div class="card " id="cardSeccion1" style="width:95%; margin:auto; margin-top:10px;">
            <div class="card-header pt-0 pb-0 sin-bordes">
                <div class="row">
                    <div class="col-sm-6 pt-0 _tex_mora">
                        <h6>FILTROS</h6>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <div class="col-12 ">
                    <div class="row   pt-3">
                        <div class="col-sm-4">
                            <label class="font-weight-bold">Región</label>
                            <select class="form-control custom-select" name="region" id="region">
                                <option value="-1">Seleccionar Región</option>
                            </select>
                        </div>

                        <div class="col-sm-4 paaddtop">
                            <label class="font-weight-bold" style="white-space: nowrap;">Nombre Universidad</label>
                            <select class="form-control custom-select" name="universidad" id="universidad">
                                <option value="-1">Seleccionar Universidad</option>
                            </select>
                        </div>

                        <div class="col-sm-4 paaddtop">
                            <label class="font-weight-bold">Nombre Sede</label>
                            <select class="form-control custom-select" name="sede" id="sede">
                                <option value="1000">Seleccionar Sede</option>
                            </select>
                        </div>
                    </div>
                    <!-- <div class="row mb-2 pb-3 pt-3" id="direccionSede">
                        <div class="col-sm-4">
                            <label>Región</label>
                            <h6 id="regionInfo"></h6>
                        </div>

                        <div class="col-sm-4">
                            <label>Comuna</label>
                            <h6 id="comuna"></h6>
                        </div>

                        <div class="col-sm-4">
                            <label>Dirección</label>
                            <h6 id="direccion"></h6>
                        </div> 
                    </div>  -->
                </div>
                <br>
               <!--  <div class="mt-3" id="cardSeccion2">
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
                </div>   -->
            </div>
        </div>
        <div class="card" id="cardSeccion3" style="width:95%; margin:auto; margin-top:10px;">
            <div class="card-header pb-0 pt-0 sin-bordes">
                <div class="row">
                    <div class="col-sm-6 pt-0 _tex_mora">
                        <h5>LABORATORIOS</h5>
                    </div>
                </div>
            </div>

            <div class="card-body">
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
        <!-- <div class="card-footer text-right fixed-bottom sin-bordes bg-white content">
            <button type="button" id="guardar" class="btn btn-success" onclick="validar()" disabled="disabled"><i class="fas fa-save"></i>  Guardar Cambios</button>
        </div>
        <div class="row mb-2" style="display: none;" id="mensajeGuardado">
            <div class="col-sm-4"></div>

            <div class="col-sm-4" id="divMensaje" style="border-radius: 5px 5px 5px 5px;">
                <p id="mensaje" class="mt-1 text-wit font-weight-bold"></p>
            </div>

            <div class="col-sm-4"></div>
        </div> -->
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
        <button type="button" class="btn" style=" background: #6850C9;color: #fff;"  onclick="guardarInformacionLaboratorio();">Confirmar</button>
      </div>
    </div>
  </div>
</div>

</body>