$(document).ready(function () {
    $('#nombre_usuario').html(localStorage.getItem('nombre_tecnico')+' ')
    ocultar();
    loginvalid(localStorage.getItem('nombre_tecnico'))
    

});

function loginvalid(id_tec){
    
    if (id_tec==null) {
        console.log("uwu"+"ño");
         showFeedback("error","Debes iniciar sesion con la cuenta vinculada al sistema","Datos incorrectos");
         redirectLogin(2)
    } else {
        $("#asw").removeClass('blackout');
        $('#nombre_tecnico').html(localStorage.nombre_tecnico)
        getRegiones();

    $("#region").change(function () {
        ocultar();
        $("#universidad").empty();
        $("#sede").empty();
        $("#universidad").append("<option value=''>Seleccione UNIVERSIDAD</option>")
        $("#sede").append("<option value=''>Seleccione SEDE</option>")
        getUniversidades();
    });

    $("#guardar").attr('disabled', true);

    $("#universidad").change(function () {
        ocultar();
        $("#sede").empty();
        $("#sede").append("<option value=''>Seleccione SEDE</option>")
        getSedes();
    });

    $("#sede").change(function () {
        ocultar();
        var sedegt=$('#sede').val()
        console.log($('#sede').val())
        if(sedegt > 0){

            getDependencias(sedegt);
        }
     
        $("#encargado").attr('disabled', false);
        $("#email").attr('disabled', false);
        $("#contacto").attr('disabled', false);
        $("#email").attr('disabled', false);
        $("#encargadoApertura").attr('disabled', false);
        $("#contactoEncargadoApertura").attr('disabled', false);
        $("#horario").attr('disabled', false);
        $("#observaciones").attr('disabled', false);
        $("#guardar").attr('disabled', false);
        
    });

    
    
    }
}

var test;
var sedes;
var dependencias;
function blockPage() {
  $('#divBlock').show();
  setTimeout(function() {
    $('#divBlock').hide();
  }, 3000);
}
function getRegiones() {
    
    $.blockUI({ message: '<img src="img/carga.svg">' });

    $.ajax({
        method: 'GET',
        url: server+'api/regiones/indexcomplementaria',
        //url: 'http://endfidws.test/regiones/indexcomplementaria',
        crossDomain: true,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            $.unblockUI();
            listarRegiones(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    });
}

function getUniversidades() {
    $.blockUI({ message: '<img src="img/carga.svg">' });

    $.ajax({
        method: 'GET',
        url: server+'api/universidades/indexbyidregion',
        //url: 'http://endfidws.test/universidades/indexbyidregion',
        crossDomain: true,
        dataType: 'json',
        data: {
            id_region: $("#region").val()
        },
        success: function (data, textStatus, jqXHR) {
            $.unblockUI();
            listarUniversidades(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    });
}

function getSedes() {
    $.blockUI({ message: '<img src="img/carga.svg">' });
    $.ajax({
        method: 'GET',
        url: server+'api/sedes/indexbyid',
        //url: 'http://endfidws.test/sedes/indexbyid',
        crossDomain: true,
        dataType: 'json',
        data: {
            centro_institucion_id: $("#universidad").val()
        },
        success: function (data, textStatus, jqXHR) {
            $.unblockUI();
            sedes = data;

            listarSedes(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    });
}

function getDependencias(id) {
    console.log(id)
    $.blockUI({ message: '<img src="img/carga.svg">' });
    $.ajax({
        method: 'GET',
        url: server+'api/aplicaciones/indexcomplementariabysedeid',
        //url: 'http://endfidws.test/aplicaciones/indexcomplementariabysedeid',
        crossDomain: true,
        dataType: 'json',
        data: {
            centrosaplicacion_id: id
        },
        success: function (data, textStatus, jqXHR) {
            $.unblockUI();
            dependencias = data;
            console.log(data)
            numPickr(data)
            listarDependencias(data);
            //informacionSede(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown+textStatus)
        }
    });
}

function listarRegiones(response) {
    for (var i = 0; i < response.length; i++) {
        $("#region").append("<option value='" + response[i].numero_region + "'>" + response[i].nombre_region + "</option>");
    }

    if(localStorage.region != 'undefined' && !isNaN(localStorage.region)){
        $('#region').val(localStorage.region);
        getUniversidades();
        localStorage.region = null;
    }
}

function listarUniversidades(response) {
    for (var i = 0; i < response.length; i++) {
        $("#universidad").append("<option value='" + response[i].id_centro_institucion + "'>" + response[i].nombre_institucion + "</option>");
    }

    if(localStorage.universidad != 'undefined' && !isNaN(localStorage.universidad)){
        $('#universidad').val(localStorage.universidad);
        getSedes();
        localStorage.universidad = null;
    }
}

function listarSedes(response) {
    for (var i = 0; i < response.length; i++) {
        $("#sede").append("<option value='" + response[i].id_sede + "'>" + response[i].nombre_sede + "</option>");
    }
}

/*function informacionSede(response){
    console.log(dependencias[0])
        

            $("#regionInfo").html(dependencias[0].nombre_region);
            $("#comuna").html(dependencias[0].nombre_comuna);
            $("#direccion").html(dependencias[0].direccion_lab);
            $("#encargado").val(dependencias[0].encargado_sede);
            $("#email").val(dependencias[0].email_encargado_sede);
            $("#contacto").val(dependencias[0].contacto_telefono_sede);
            $("#observaciones").val(dependencias[0].observacion_sede);
}*/

function showmod(id){
    console.log(id.id)
    $("#"+id.id).modal('show');
}  

function listarDependencias(response) {
    $("#laboratorios").empty();

    var letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M" , "N", "Ñ", "O", "P"];
    //Nombres Dependencias
    if(response.length > 0){
        for (var i = 0; i < response.length; i++) {
     	console.log(response[i])
            $("#laboratorios").append(
                "<div class=' card-header w3-border-0 ' style='margin-bottom: 20px;'>" +
    	            "<h5 class='panel-title' style='line-height: 27px !important;'>" +
    	            "<a id='btn" + response[i].id_laboratorio + "' "+ "onclick='showmod(confirmar_"+ response[i].id_laboratorio +");'"+" class='nav-link _tex_mora' type='button'><i class='fas fa-desktop mr-1 _tex_mora'></i> <span class='_tex_mora'>Laboratorio:</span> <br> <b class='pt-2 _tex_mora'>"+response[i].nombre_laboratorio + "</b></a>" +
    	            "</h5>" +
                "</div>" +

                 "<div class='modal fade modbody' id='confirmar_"+ response[i].id_laboratorio +"' tabindex='0' role='dialog' aria-labelledby='confirmar' aria-hidden='true'>"+
                  "<div class='modal-md modal-dialog' role='document'>"+
                    "<div class='modal-content'>"+
                      "<div class='modal-header'>"+

                        "<h5 class='modal-title _tex_mora' id='exampleModalLabel'><i class='fas fa-desktop mr-1'></i>" +' '+response[i].nombre_laboratorio +"</h5>"+
                        "<label class='_tex_mora'></label><button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
                          "<span aria-hidden='true'>&times;</span>"+
                        "</button>"+
                      "</div>"+
                      "<div class='panel-body'>" +
                        "<div class='card sin-bordes pt-0'>" +
                           /* "<label class='card _tex_mora text-center pt-1 pb-1'>Datos del laboratorio (Actualizar o agregar datos según corresponda)</label>"+*/
                            "<div class='card-body pt-0'>" +
                                "<div class='row mb-2'>" +
                                    "<div class='col-sm-12' style='font-size: 12px;'>"+
                                            
                                        "<div class='row card-header sin-bordes pt-0' style='margin:0.5%; border-radius: 5px;'>"+
                                            "<div class='col-sm-6 mt-1' style='padding-left: 0px;'>" +
                                                "<label class='input-group' for='cantidadPCs_"+response[i].id_laboratorio+"'><a class='_tex_mora mt-1 mb-1' style='color:#6850C9;'><i class='fas fa-laptop'> </i> PC's operativos visita técnica</a></label>" +
                                                "<input type='text' disabled class='form-control sin-bordes' style='border-radius: 5px !important;' name='cantidadPCs_"+response[i].id_laboratorio+"' id='cantidadPCs_"+response[i].id_laboratorio+"' value='"+ (response[i].nro_equipos_operativos == null ? "" : response[i].nro_equipos_operativos) +"' oninput='this.value=cantidadPC(this.value)'>"+
                                            "</div>" +
                                            "<div class='col-sm-6 mt-1' style='padding-left: 0px;'>" +
                                                "<label class='input-group' for='cantidadPCsvp_"+response[i].id_laboratorio+"'><a class='_tex_mora mt-1 mb-1' style=';color:#6850C9;'><i class='fas fa-laptop'> </i> PC's operativos visita previa</a> </label>" +
                                                "<input type='text' class='form-control sin-bordes' style='border-radius: 5px !important;' name='cantidadPCsvp_"+response[i].id_laboratorio+"' id='cantidadPCs_"+response[i].id_laboratorio+"' value='"+ (response[i].nro_equip_vistp == null ? "" : response[i].nro_equip_vistp) +"' oninput='this.value=cantidadPC(this.value)'></label>"+
                                            "</div>" +
                                            "<div class='col-sm-6 mt-1' style='padding-left: 0px;'>" +
                                                "<label class='_tex_mora mt-1 mb-1'><i class='fas fa-user'> </i> Encargado Laboratorio</label>" +
                                                "<input type='text' name='encargadoLaboratorio_"+response[i].id_laboratorio+"' id='encargadoLaboratorio_"+response[i].id_laboratorio+"' class='form-control sin-bordes' value='" + (response[i].encargado_apertura == null ? "" : response[i].encargado_apertura) + "'>" +
                                            "</div>" +
                                            "<div class='col-sm-6 mt-1' style='padding-left: 0px;'>" +
                                                "<label class='_tex_mora mt-1 mb-1'><i class='fas fa-envelope'> </i> E-Mail Encargado</label>" +
                                                "<input type='email' name='emailEncargado_"+response[i].id_laboratorio+"' id='emailEncargado_"+response[i].id_laboratorio+"' class='form-control sin-bordes' value='" + (response[i].email_encargado_lab == null ? "" : response[i].email_encargado_lab) + "'>" +
                                            "</div>" +
                                            "<div class='col-sm-6 mt-1' style='padding-left: 0px;'>" +
                                                "<label class='_tex_mora mt-1 mb-1'><i class='fas fa-phone'> </i> Teléfono Encargado</label>" +
                                                "<input type='text' name='telefonoEncargado_"+response[i].id_laboratorio+"' id='telefonoEncargado_"+response[i].id_laboratorio+"' class='form-control sin-bordes' value='" + (response[i].telefono_encargado_apertura == null ? "" : response[i].telefono_encargado_apertura) + "'>" +
                                            "</div>" +
                                            "<div class='col-sm-6 mt-1' style='padding-left: 0px;'>" +
                                                "<label class='_tex_mora mt-1 mb-1' style='margin-right: -9%;'><i class='fas fa-clock'> </i> ¿Disponibilidad desde las 7:30?</label>" +
                                                "<div class='input-group'>"+
                                                    "<div class='input-group-prepend'>"+
                                                    "<select class='form-control custom-select sin-bordes' name='horarioApertura_"+response[i].id_laboratorio+"' id='horarioApertura_"+response[i].id_laboratorio+"' class='form-control custom-select' value='" + (response[i].acceso_desde_0730 == null ? "" : ((response[i].acceso_desde_0730 == true) ? "1" : "2")) + "'>"+
                                                    "<option value=''>Seleccionar disponibilidad</option>"+
                                                    "<option value='1'>Si</option>"+
                                                    "<option value='0'>No</option>"+
                                                    "</select>"+   
                                                "</div>"+
                                                "<span class='error_show' id='formError_horarioApertura_"+response[i].id_laboratorio+"'></span>"+
                                                //"<input type='time' name='horarioApertura_"+response[i].id+"' id='horarioApertura_"+response[i].id+"' class='form-control' value='" + (response[i].horario_apertura == null ? "" : response[i].horario_apertura) + "'>" +
                                            "</div>" +

                                        "</div>"+
                                    "</div>"+
                                "</div>"+    

                                "<div class='row mb-2'>" +
                                    
                                    
                                    "</div>" +
                                "</div>" +
                                "<div class='row mb-2'>" +
                                    "<div class='col-sm-12' style='font-size: 12px; margin-top: -6%;'>" +
                                        "<label class='_tex_mora mt-1 mb-1'><i class='fas fa-comments'> </i> Observaciones visita técnica</label>" +
                                        "<textarea rows='4' disabled class='form-control' name='observaciones_"+response[i].id_laboratorio+"' id='observaciones_"+response[i].id_laboratorio+"'>"+(response[i].observacion_visita == null ? "" : response[i].observacion_visita)+"</textarea>" +
                                    "</div>" +
                                    "<div class='col-sm-12' style='font-size: 12px; margin-top: 2%;'>" +
                                        "<label class='_tex_mora mt-1 mb-1'><i class='fas fa-comments'> </i> Observaciones visita previa</label>" +
                                        "<textarea rows='4' class='form-control' name='observacionesvp_"+response[i].id_laboratorio+"' id='observacionesvp_"+response[i].id_laboratorio+"'>"+(response[i].obs_vistp == null ? "" : response[i].obs_vistp)+"</textarea>" +
                                    "</div>" +
                                "</div>" +
                               
                            "</div>" +

                            "<div class='card-footer text-right sin-bordes bg-white pt-0'>"+
                                    `<button type="button" class="btn btn-secondary" style='margin-right: 11px;' data-dismiss="modal">Cancelar</button>`+
                                    "<button type='button' id='guardar' class='btn 'style=' background: #6850C9;color: #fff;' onclick='validar();numPick("+i+")'><i class='fas fa-save'></i>  Guardar</button>"+
                                "</div>"+
                                "<div class='row mb-2' style='display: none;' id='mensajeGuardado'>"+
                                    "<div class='col-sm-4'></div>"+

                                    "<div class='col-sm-4' id='divMensaje' style='border-radius: 5px 5px 5px 5px;'>"+
                                        "<p id='mensaje' class='mt-1 text-wit font-weight-bold'></p>"+
                                    "</div>"+
                                "</div>"+

                                "</div>" +
                    "</div>" +
                    "</div>"+
                  "</div>"+
                "</div>"); 
                $("#horarioApertura_"+response[i].id_laboratorio).val(response[i].acceso_desde_0730 == null ? "" : ((response[i].acceso_desde_0730 == true) ? "1" : "2"))
               
                $(".clockpicker").clockpicker({
			        placement: 'top',
			        autoclose: true,
			        donetext: 'Listo',

			    }); 

        }
        
    }else{
        $("#laboratorios").append(
            "<div class='panel-heading card-header'>" +
                "<h5 class='panel-title'>" +
                "Sin laboratorios con aplicaciones" +
                "</h5>" +
            "</div>" )
    }
    
    $("#direccionSede").show();
    $("#cardSeccion2").show();
    $("#cardSeccion3").show();
    $.unblockUI();
}
var picke=0;
function numPick(id){
    picke=id;
}
var picker=0;
function numPickr(id){
    picker=id;
}

/*function guardarInformacionSede(){
    $('#confirmar').modal('hide');
	//$.blockUI({  baseZ: 2000, message: '<h1>Guardando...</h1>' });
    $.blockUI({ baseZ: 2000, message: '<img src="img/carga.svg">' });
    var encargado = $("#encargado").val();
    var email = $("#email").val();
    var telefono = $("#contacto").val();
    var observaciones = $("#observaciones").val();

    $.ajax({
        method: 'POST',
        url: 'https://2019.diagnosticafid.cl/public/api/sedes/saveSede',
        crossDomain: true,
        dataType: 'json',
        data: {
            id: $('#sede').val(),
            nombre_contacto_inicial : encargado,
            correo_contacto_inicial : email,
            telefono_movil_contacto_inicial: telefono,
            observaciones : observaciones,
            usuario : $('#usuario').text()
  

        },
        success: function (data, textStatus, jqXHR) {
        	
            if(data.resultado == 'ok'){
                guardarInformacionLaboratorio();
            }else{
                alert(JSON.stringify(data.descripcion))
                $.unblockUI();
            }
        },

        error: function (jqXHR, textStatus, errorThrown) {
             console.log(errorThrown+textStatus+jqXHR)
            alert(JSON.stringify(JSON.parse(jqXHR.responseText).descripcion))
            $.unblockUI(); 
        }
    });
}*/

function guardarInformacionLaboratorio (){
    $('#confirmar').modal('hide'); 
     console.log(picker[picke].nro_equipos_operativos)
     console.log(picker[picke].telefono_encargado_apertura)
    function guardar(){
        return new Promise(function (resolve,reject){
            saveLaboratorio(0);

            function saveLaboratorio(i){

                var id = dependencias[picke].id_laboratorio
                console.log(id)
                console.log(dependencias)
                var cantidadPC = $('#cantidadPCs_'+dependencias[picke].id_laboratorio).val()
                var cantidadPCVP = $('#cantidadPCsvp_'+dependencias[picke].id_laboratorio).val()

                var encargado = $('#encargadoLaboratorio_'+dependencias[picke].id_laboratorio).val()
                var emailEncargado = $('#emailEncargado_'+dependencias[picke].id_laboratorio).val()
                var telefonoEncargado = $('#telefonoEncargado_'+dependencias[picke].id_laboratorio).val()
                var encargadoApertura = $('#encargadoApertura_'+dependencias[picke].id_laboratorio).val()
                var telefonoEncargadoApertura = $('#telefonoEncargadoApertura_'+dependencias[picke].id_laboratorio).val()
                var horarioApertura = $('#horarioApertura_'+dependencias[picke].id_laboratorio).val()
                var observaciones = $('#observaciones_'+dependencias[picke].id_laboratorio).val()
                var observaciones_vp = $('#observacionesvp_'+dependencias[picke].id_laboratorio).val()
                var acceso_730 = picker[picke].acceso_desde_0730;
                var email_resp = picker[picke].email_encargado_lab;
                var encargado_resp= picker[picke].encargado_apertura;
                var nro_equip_resp= picker[picke].nro_equipos_operativos;
                var tel_enc_resp= picker[picke].telefono_encargado_apertura;
                $.ajax({
                    method: 'POST',
                    url: server+'api/laboratorio/saveLaboratorio',
                    crossDomain: true,
                    dataType: 'json',
                    data: {
                        id: id,
                        //nombre_dependencia : nombreDependencia,
                        equipos_disponibles : cantidadPC,
                        equipos_disponibles_vp : cantidadPCVP,
                        nombre_encargado: encargado,
                        correo_dependencia : emailEncargado,
                        telefono_dependencia : telefonoEncargado,
                        persona_disponible_apertura : encargadoApertura,
                        telefono_persona_apertura : telefonoEncargadoApertura,
                        horario_apertura : horarioApertura,
                        observaciones_dependencia : observaciones,
                        observaciones_dependencia_vp : observaciones_vp,
                        resp_encargado : encargado_resp,
                        resp_encargado_email : email_resp,
                        resp_encargado_fono : tel_enc_resp,
                        resp_apertura : acceso_730,
                        resp_pcs_operativos : nro_equip_resp,
                        usuario : $('#usuario').text()

                    },
                    success: function (data, textStatus, jqXHR) {
                        test = data
                        if(data.resultado == 'ok'){
                           /* if(i < dependencias.length-1){
                                saveLaboratorio(i+1)
                            }else{*/
                                resolve()
                            /*}*/
                        }else{
                            alert(JSON.stringify(data.descripcion))
                            $.unblockUI();
                        }

                       
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(JSON.stringify(JSON.parse(jqXHR.responseText).descripcion))
                        reject()
                        console.log(errorThrown)
                        $.unblockUI();                        
                    }
                });
                

            }


        })
     
    }

    guardar().then(function(){
        $.blockUI({  baseZ: 2000, message: '<h1>Los datos han sido almacenados exitosamente</h1>' });
        setTimeout(function(){
            
            $.unblockUI(); 
        }, 3000);
     
    }).catch(function(){
        $.blockUI({  baseZ: 2000, message: '<h1>Error al guardar</h1>' });
        setTimeout(function(){
            
            $.unblockUI(); 
        }, 3000);
    })
}

function validar(){
    var resultado = true;
    $("input").each(function() {
        if ($(this).hasClass('invalid')){
            resultado = false;
        } 
    })
    
    if (resultado == false) {
        alert("Corregir el formato del horario de apertura");
    }  
    if(resultado){
        guardarInformacionLaboratorio();
    }
}

function limpiarSede(){
    $("#encargado").val('')
    $("#email").val('')
    $("#contacto").val('')
    $("#email").val('')
    $("#encargadoApertura").val('')
    $("#contactoEncargadoApertura").val('')
    $("#horario").val('')
    $("#observaciones").val('')
    $("#guardar").val('')
}

function hora(string){
    var out = '';
    var filtro = '1234567890:';
    
    for (var i=0; i<string.length; i++){
        if (filtro.indexOf(string.charAt(i)) != -1) {
            if(out.length<5){
                out += string.charAt(i);
            }
        }
    }

    return out;
}

function validateHhMm(inputField) {
    if(inputField.value != ''){
        var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputField.value);

        if (isValid) {
            $('#'+inputField.id).removeClass('invalid')
            $('#formError_'+inputField.id).removeClass('error_show')
            $('#formError_'+inputField.id).html("")

        } else {
            $('#'+inputField.id).addClass('invalid')
            $('#formError_'+inputField.id).addClass('error_show')
            $('#formError_'+inputField.id).html("Ingrese horario válido")
        }

        return isValid;
    }else{
        $('#'+inputField.id).removeClass('invalid')
        $('#formError_'+inputField.id).removeClass('error_show')
        $('#formError_'+inputField.id).html("")
    }
}

function ocultar(){
    $("#direccionSede").hide();
    $("#cardSeccion2").hide();
    $("#cardSeccion3").hide();
}

function cantidadPC(string){
    var out = '';
    var filtro = '1234567890';
    
    for (var i=0; i<string.length; i++){
        if (filtro.indexOf(string.charAt(i)) != -1) {
            if(out.length<3){
                out += string.charAt(i);
            }
        }
    }

    return out;
}