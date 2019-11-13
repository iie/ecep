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
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css">
    <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>
    <script type="text/javascript" src="js/popper.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/jquery.mask.js"></script>
    <script type="text/javascript" src="js/utils.js"></script>
    <script type="text/javascript" src="js/accesoRoles.js"></script>
    
    
    <title>ENDFID 2019</title>
</head>
<body>
<!--
<div class="container content">
    

    <div class="row ">
        <input type="hidden" id="idRol" value='<?php echo utf8_encode($_SESSION['idRol']); ?>'>
        
                      
        <div class="col-sm-6 p-0"> 
            <div class="row text-center col-sm-12 p-0" id="btnVisitaPrevia">
                <a href="visitaPrevia.php" class="btn colo-m" ><i class="fas fa-clipboard-check"></i> Visitas Previas</a>
            </div>

                     <div class="row text-center pt-4" id="btnAplicacionSupervisor">
                        <div class="col-sm-12">
                            <a href="aplicacionSupervisorComplementaria.php" class="btn btn-info btn-lg" style="white-space: inherit"><i class="fas fa-desktop"></i> Registro Aplicación Complementaria (Supervisor)</a>
                        </div>
                    </div>   
        </div>

        <div class="col-sm-6 p-0">
            <div class="row text-center col-sm-12 p-0" id="btnAplicacion">
                <a href="aplicacionSupervisorComplementaria.php" class="btn colo-m" ><i class="fas fa-clipboard-check"></i> Aplicación Regular</a>
            </div>
        </div>      
    </div> --> 

    <!-- <footer class="bg-secondary fixed-bottom">
        <div class="col-sm-12 text-center mb-2">
            
            <small><b>2018 ENDFID</b></small>
            <a class="nav-link mt-1 ml-4" href="logout.php" title="Cerrar Sesión"><i class="fas fa-sign-out-alt"></i></a>
           
        </div>
    </footer> -->
    <div class="container-fluid content blackout p-0" id="adf">
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
        <div class="_main-container _container-form content" id="containerHTML">
            <div class="pt-5 pb-5 pl-5 pr-5" style="margin-top: 5%;">
                <div class="row" id="containerCentros">
                    <div class="col-sm-6">                        
                         <div class="card-centros" >
                            <!-- <div class="card card1-aling"> -->
                                 <div class="card-body pt-0">
                                  <hr class="cardLinea"  align="left" size="2" width="40%" />
                                      <h5 style="font-size: 1.25rem;"><a class="a-cursos">Visitas Previas </a></h5>
                                      <a id="evaluador" type='button' class='btn mt-1'  style=' background: #6850C9;color: #fff;justify-content: center;display: flex;' name="evaluador" onclick="redireccionar(2)" href="#" >
                                  Visitas Previas                                  
                              </a></div>
                                  </div>
                       <!-- </div> -->
                            
                     </div>


                     <div class="col-sm-6">                        
                         <div class="card-centros">
                            <!-- <div class="card card1-aling"> -->
                             <div class="card-body pt-0">
                                    <hr class="cardLinea" align="left" size="2" width="40%" />
                                  <h5 style="font-size: 1.25rem;"><a class="a-cursos">Aplicación Regular </a></h5>
                                   <a id="supervisor" type='button' class='btn mt-1'style=' background: #6850C9;color: #fff;justify-content: center;display: flex;' name="supervisor" onclick="redireccionar(1)" href="#" >
                                  Supervisor                                 
                              </a>
                               <a id="examinador" type='button' class='btn mt-1'style=' background: #6850C9;color: #fff;justify-content: center;display: flex;' name="examinador" onclick="redireccionar(3)" href="#" >
                                Examinador                                   
                              </a>
                              </div>
                       <!-- </div> -->
                             
                            
                         </div>
                     </div>
                </div>
            </div>
        </div>

    </div>
</div>
</body>
</html>



