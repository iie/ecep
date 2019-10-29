$(document).ready(function () {
    ocultar();

    getRegiones();

    $("#region").change(function () {
        ocultar();
        $("#universidad").empty();
        $("#sede").empty();
        $("#universidad").append("<option value=''>SELECCIONE UNIVERSIDAD</option>")
        $("#sede").append("<option value=''>SELECCIONE SEDE</option>")
        getUniversidades();
    });

    $("#guardar").attr('disabled', true);

    $("#universidad").change(function () {
        ocultar();
        $("#sede").empty();
        $("#sede").append("<option value=''>SELECCIONE SEDE</option>")
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

});

var test;
var sedes;
var dependencias;

function getRegiones() {
    $.blockUI({ message: '<img src="img/carga.svg">' });

    $.ajax({
        method: 'GET',
        url: 'https://2019.diagnosticafid.cl/public/api/regiones/indexcomplementaria',
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
        url: 'https://2019.diagnosticafid.cl/public/api/universidades/indexbyidregion',
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
        url: 'https://2019.diagnosticafid.cl/public/api/sedes/indexbyid',
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
        url: 'https://2019.diagnosticafid.cl/public/api/aplicaciones/indexcomplementariabysedeid',
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
            listarDependencias(data);
            informacionSede(data);
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

function informacionSede(response){
    console.log(dependencias[0])
        

            $("#regionInfo").html(dependencias[0].nombre_region);
            $("#comuna").html(dependencias[0].nombre_comuna);
            $("#direccion").html(dependencias[0].direccion_lab);
            $("#encargado").val(dependencias[0].encargado_sede);
            $("#email").val(dependencias[0].email_encargado_sede);
            $("#contacto").val(dependencias[0].contacto_telefono_sede);
            $("#observaciones").val(dependencias[0].observacion_sede);
}

function listarDependencias(response) {
    $("#laboratorios").empty();

    var letras = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m" , "n", "ñ", "o"];
    //Nombres Dependencias
    if(response.length > 0){
        for (var i = 0; i < response.length; i++) {
     	console.log(response[i])
            $("#laboratorios").append(
                "<div class='panel-heading card-header'>" +
    	            "<h5 class='panel-title'>" +
    	            "<a data-toggle='collapse' id='btn" + response[i].id_laboratorio + "' class='nav-link text-dark' href='#collapse" + response[i].id_laboratorio + "'>" + letras[i] +'. '+response[i].nombre_laboratorio + "<i class='more-less fa fa-chevron-down'></i></a>" +
    	            "</h5>" +
                "</div>" +
                
               

                "<div id='collapse" + response[i].id_laboratorio + "' class='panel-collapse collapse pt-2'>" +
                    "<div class='panel-body'>" +
                        "<div class='card'>" +
                            "<div class='card-header'>" +                           
                                "<div class='row'>"+
                                	"<div class='col-sm-6' style='padding-left: 10px;'>"+
                                		"<h5>Datos del laboratorio (Actualizar o agregar datos según corresponda)</h5>"+
                                	"</div>"+                               
                                "</div>"+
                            "</div>" +

                            "<div class='card-body'>" +

                            	"<div class='row mb-2'>" +
	                            	"<div class='col-sm-6'>"+
                                        "<div class='row'>"+
                                            "<div class='col-sm-4'>"+  
                                                "<div class='form-group'>"+
                                                    "<label class='_margin-label' for='cantidadPCs_"+response[i].id_laboratorio+"'><b>PCs operativos</b></label>"+                                        
                                                "</div>"+
                                            "</div>"+
                                            "<div class='col-sm-4'>"+  
                                                "<div class='form-group'>"+
                                                    "<input type='text' class='form-control' name='cantidadPCs_"+response[i].id_laboratorio+"' id='cantidadPCs_"+response[i].id_laboratorio+"' value='"+ (response[i].nro_equipos_operativos == null ? "" : response[i].nro_equipos_operativos) +"' oninput='this.value=cantidadPC(this.value)'>"+
                                                "</div>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+    

                                "<div class='row mb-2'>" +
                                    "<div class='col-sm-4'>" +
                                        "<label>Encargado Laboratorio</label>" +
                                        "<input type='text' name='encargadoLaboratorio_"+response[i].id_laboratorio+"' id='encargadoLaboratorio_"+response[i].id_laboratorio+"' class='form-control' value='" + (response[i].encargado_apertura == null ? "" : response[i].encargado_apertura) + "'>" +
                                    "</div>" +

                                    "<div class='col-sm-4'>" +
                                        "<label>E-Mail Encargado</label>" +
                                        "<input type='email' name='emailEncargado_"+response[i].id_laboratorio+"' id='emailEncargado_"+response[i].id_laboratorio+"' class='form-control' value='" + (response[i].email_encargado_lab == null ? "" : response[i].email_encargado_lab) + "'>" +
                                    "</div>" +

                                    "<div class='col-sm-4'>" +
                                        "<label>Teléfono Encargado</label>" +
                                        "<input type='text' name='telefonoEncargado_"+response[i].id_laboratorio+"' id='telefonoEncargado_"+response[i].id_laboratorio+"' class='form-control' value='" + (response[i].telefono_encargado_apertura == null ? "" : response[i].telefono_encargado_apertura) + "'>" +
                                    "</div>" +
                                "</div>" +
                                "<div class='row mb-2 col-sm-4'>" +
                                        "<label class=''>¿Disponibilidad a partir de las  7:30?</label>" +
                                        "<div class='input-group'>"+
                                            "<div class='input-group-prepend'>"+
                                            "<select name='horarioApertura_"+response[i].id_laboratorio+"' id='horarioApertura_"+response[i].id_laboratorio+"' class='form-control custom-select' value='" + (response[i].acceso_desde_0730 == null ? "" : ((response[i].acceso_desde_0730 == true) ? "1" : "2")) + "'>"+
                                            "<option value=''>Seleccionar disponibilidad</option>"+
                                            "<option value='1'>Si</option>"+
                                            "<option value='2'>No</option>"+
                                            "</select>"+   
                                        "</div>"+
                                        "<span class='error_show' id='formError_horarioApertura_"+response[i].id_laboratorio+"'></span>"+
                                        //"<input type='time' name='horarioApertura_"+response[i].id+"' id='horarioApertura_"+response[i].id+"' class='form-control' value='" + (response[i].horario_apertura == null ? "" : response[i].horario_apertura) + "'>" +
                                    "</div>" +
                                "</div>" +

                                "<div class='row mb-2'>" +
                                    "<div class='col-sm-12'>" +
                                        "<label>Observaciones</label>" +
                                        "<textarea rows='4' class='form-control' name='observaciones_"+response[i].id_laboratorio+"' id='observaciones_"+response[i].id_laboratorio+"'>"+(response[i].observacion_visita == null ? "" : response[i].observacion_visita)+"</textarea>" +
                                    "</div>" +
                                "</div>" +
                                "<br>"+
                            "</div>" +
                        "</div>" +

                        "<hr class='separador-novisible'>" +
                    "</div>" +
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

function guardarInformacionSede(){
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
}

function guardarInformacionLaboratorio (){

    function guardar(){
        return new Promise(function (resolve,reject){
            saveLaboratorio(0);

            function saveLaboratorio(i){

                var id = dependencias[i].id_laboratorio
                console.log(id)
                var cantidadPC = $('#cantidadPCs_'+dependencias[i].id_laboratorio).val()
                var encargado = $('#encargadoLaboratorio_'+dependencias[i].id_laboratorio).val()
                var emailEncargado = $('#emailEncargado_'+dependencias[i].id_laboratorio).val()
                var telefonoEncargado = $('#telefonoEncargado_'+dependencias[i].id_laboratorio).val()
                var encargadoApertura = $('#encargadoApertura_'+dependencias[i].id_laboratorio).val()
                var telefonoEncargadoApertura = $('#telefonoEncargadoApertura_'+dependencias[i].id_laboratorio).val()
                var horarioApertura = $('#horarioApertura_'+dependencias[i].id_laboratorio).val()
                var observaciones = $('#observaciones_'+dependencias[i].id_laboratorio).val()

                $.ajax({
                    method: 'POST',
                    url: 'https://2019.diagnosticafid.cl/public/api/laboratorio/saveLaboratorio',
                    crossDomain: true,
                    dataType: 'json',
                    data: {
                        id: id,
                        //nombre_dependencia : nombreDependencia,
                        equipos_disponibles : cantidadPC,
                        nombre_encargado: encargado,
                        correo_dependencia : emailEncargado,
                        telefono_dependencia : telefonoEncargado,
                        persona_disponible_apertura : encargadoApertura,
                        telefono_persona_apertura : telefonoEncargadoApertura,
                        horario_apertura : horarioApertura,
                        observaciones_dependencia : observaciones,
                        usuario : $('#usuario').text()

                    },
                    success: function (data, textStatus, jqXHR) {
                        test = data
                        if(data.resultado == 'ok'){
                            if(i < dependencias.length-1){
                                saveLaboratorio(i+1)
                            }else{
                                resolve()
                            }
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
        $('#confirmar').modal('show')
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