$(document).ready(function () {
    ocultar();
    
    getRegiones();

    $("#selectRegion").change(function () {
        ocultar();
        $("#universidad").empty();
        $("#sede").empty();
        $("#universidad").append("<option value=''>SELECCIONE UNIVERSIDAD</option>")
        $("#sede").append("<option value=''>SELECCIONE SEDE</option>")
        getUniversidades();
    });

    $("#universidad").change(function () {
        ocultar();
        $("#sede").empty();
        $("#sede").append("<option value=''>SELECCIONE SEDE</option>")
        getSedes();
    });

    $("#sede").change(function () {
        ocultar();
        if($('#sede').val() > 0){
            informacionSede();
            getDependencias();
        }
    });
});

var test;
var sedes;
function getRegiones() {
    $.blockUI({ message: '<img src="img/carga.svg">' });

    $.ajax({
        method: 'GET',
        url: 'https://2019.diagnosticafid.cl/public/api/regiones/indexcomplementaria',
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
        crossDomain: true,
        dataType: 'json',
        data: {
            id_region: $("#selectRegion").val()
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

function getDependencias() {
    $.blockUI({ message: '<img src="img/carga.svg">' });
    $.ajax({
        method: 'GET',
        url: 'https://2019.diagnosticafid.cl/public/api/aplicaciones/indexcomplementariabysedeid',
        crossDomain: true,
        dataType: 'json',
        data: {
            centrosaplicacion_id: $("#sede").val()
        },
        success: function (data, textStatus, jqXHR) {
            $.unblockUI();
            listerDependencias(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    });
}

function informacionSede(){
    console.log(sedes)
    for (var i = 0; i < sedes.length; i++) {
        if (sedes[i].id == $("#sede").val()) {
            $("#region").html('<b>'+(sedes[i].nombre_region == null ? '-' : sedes[i].nombre_region)+'</b>');
            $("#comuna").html('<b>'+(sedes[i].nombre_comuna == null ? '-' : sedes[i].nombre_comuna)+'</b>');
            $("#direccion").html('<b>'+(sedes[i].direccion == null ? '-' : sedes[i].direccion)+'</b>');

            $("#encargado").html('<b>'+(sedes[i].persona_disponible_apertura == null ? '-' : sedes[i].persona_disponible_apertura)+'</b>');
            $("#telefonoEncargado").html('<b>'+(sedes[i].telefono_persona_apertura == null ? '-' : sedes[i].telefono_persona_apertura)+'</b>');
            $("#horarioApertura").html('<b>'+(sedes[i].horario_apertura == null ? '-' : sedes[i].horario_apertura.slice(0,-3))+'</b>');
            $("#observacionesLab").html('<b>'+(sedes[i].observaciones == null ? '-' : sedes[i].observaciones)+'</b>');
             
        }
    }
}

function verArray() {
    return test;
}

function saveAplicacion(id) {
   
    $.blockUI({ message: '<img src="img/carga.svg">' });
    $.ajax({
        method: 'POST',
        url: 'http://endfid2018.iie.cl/endfidws/public/aplicaciones/saveaplicacion',
        crossDomain: true,
        dataType: 'json',
        data: {
            id: id,
            observaciones_supervisor: $("#observaciones_supervisor_" + id).val()
        },
        success: function (data, textStatus, jqXHR) {
            if(data.resultado == 'ok'){

                $.blockUI({  baseZ: 2000, message: '<h1>Los datos han sido almacenados exitosamente</h1>' });
                setTimeout(function(){
                    $.unblockUI(); 
                }, 2000);

            }else{
                alert(JSON.stringify(data.descripcion))
                $.unblockUI();

            }
             
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(JSON.stringify(JSON.parse(jqXHR.responseText).descripcion))
            $.unblockUI();  
            console.log(errorThrown)

        }
    });
            
}

function listarRegiones(response) {
    for (var i = 0; i < response.length; i++) {
        $("#selectRegion").append("<option value='" + response[i].numero_region + "'>" + response[i].nombre_region + "</option>");
    }
    if(localStorage.region != 'undefined' && !isNaN(localStorage.region)){
        $('#selectRegion').val(localStorage.region);
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
    if(localStorage.sede != 'undefined' && !isNaN(localStorage.sede)){
        $('#sede').val(localStorage.sede);
        //getDependencias();
        informacionSede();
        localStorage.sede = null;
    }
    
}

function removerClases(){
    $("#linkDia1").removeClass('active show')
    $("#dia1").removeClass('active show')
    $("#linkDia2").removeClass('active show')
    $("#dia2").removeClass('active show')
    $("#linkDia3").removeClass('active show')
    $("#dia3").removeClass('active show')
    $("#linkDia4").removeClass('active show')
    $("#dia4").removeClass('active show')
    $("#linkDiaComplementario").removeClass('active show')
    $("#diaComplementario").removeClass('active show')
}


function listerDependencias(response) {
    $("#divLabsDia1").empty();
    $("#divLabsDia2").empty();
    $("#divLabsDia3").empty();
    $("#divLabsDia4").empty();

    removerClases();

    //Nombres Dependencias
    for (var i = 0; i < response.length; i++) {
        console.log(response[i])
        //Aplicaciones
        for (var j = 0; j < response[i].aplicaciones.length; j++) {

            //Día 1
            if (response[i].aplicaciones[j].fecha_agendada == "2018-12-18") {
                
                $("#linkDia1").show();
                var idAplicacion = response[i].aplicaciones[j].id;

                $("#divLabsDia1").append(
                    "<div class='panel-heading card-header'>" +
                        "<input type='hidden' id='idAplicacionDia1_" + j + "' value='" + response[i].aplicaciones[j].id + "'>" +

                        "<h5 class='panel-title'>" +
                        "<a data-toggle='collapse' id='btn" + response[i].aplicaciones[j].id + "' class='nav-link text-dark' href='#collapse" + response[i].aplicaciones[j].id + "'>" + response[i].nombre_dependencia + "  <i class='more-less fa fa-chevron-down'></i></a>" +
                        "</h5>" +

                    "</div>" +

                    "<div id='collapse" + response[i].aplicaciones[j].id + "' class='panel-collapse collapse pt-2'>" +
                        "<div class='panel-body'>" +

                            "<div class='pt-3 pb-3 col-sm-12'>"+

                                "<div class='panel-heading card-header _bg-verdeClaro' style='padding-top: 0px;padding-bottom: 0px;'>" +
                                    "<input type='hidden' id='idAplicacionDia1_" + j + "' value='" + response[i].aplicaciones[j].id + "'>" +

                                    "<h5 class='panel-title'>" +
                                    "<a data-toggle='collapse' id='btn" + response[i].aplicaciones[j].id + "' class='nav-link text-dark' href='#collapseInfoLab" + response[i].aplicaciones[j].id + "'> Información Laboratorio <i class='more-less fa fa-chevron-down'></i></a>" +
                                    "</h5>" +

                                "</div>" +

                                "<div id='collapseInfoLab" + response[i].aplicaciones[j].id + "' class='card panel-collapse collapse pt-2'>" +
                                    "<div class='panel-body'>" +
                                        "<div class='pt-3 col-sm-12'>"+
                                         
                                            "<div class='row'>" +
                                                "<div class='col-sm-4'>"+
                                                    "<label>Encargado Apertura</label>"+
                                                    "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].persona_disponible_apertura == null ? '-' : response[i].persona_disponible_apertura)+"</b></h5>"+
                                                "</div>"+
                                                "<div class='col-sm-4'>"+
                                                    "<label>Teléfono Encargado</label>"+
                                                    "<h5 id='telefonoEncargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].telefono_persona_apertura == null ? '-' : response[i].telefono_persona_apertura)+"</b></h5>"+
                                                "</div>"+
                                                
                                                "<div class='col-sm-4'>"+
                                                    "<label>Horario Apertura</label>"+
                                                    "<h5 id='horarioApertura_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].horario_apertura == null ? '-' : response[i].horario_apertura.slice(0,-3))+"</b></h5>"+
                                                "</div>"+
                                            "</div>" +
                                            "<div class='row pt-2'>" +
                                                "<div class='col-sm-6'>"+
                                                    "<label>Dirección</label>"+
                                                    "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].direccion_dep == null ? '-' : response[i].direccion_dep)+"</b></h5>"+
                                                "</div>"+
                                                "<div class='col-sm-6'>"+
                                                    "<label>Facultad</label>"+
                                                    "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].facultad_sector == null ? '-' : response[i].facultad_sector)+"</b></h5>"+
                                                "</div>"+
                                            "</div>" +
                                            "<div class='row pt-2'>" +
                                                "<div class='col-sm-12 pt-2'>" +
                                                    "<label>Observaciones Visita Previa</label>" +
                                                    "<h5 id='observacionesLab_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].observaciones == null ? '-' : response[i].observaciones)+"</b></h5>"+
                                                "</div>" +
                                            "</div>" +
                                        "</div>" +      
                                    "</div>" +
                                "</div>"+

                            "</div>"+

                            "<div class='row mt-2 mb-2'>" +
                                "<div class='col-sm-12'>" +
                                "<a class='btn _bg-red text-light' id='"+response[i].aplicaciones[j].fecha_agendada+"' onclick='verContingencias("+response[i].aplicaciones[j].id+", this.id);'><i class='fas fa-exclamation-triangle'_bg-red></i>  Registro de Contingencias</a>" +
                                "</div>" +
                            "</div>" +

                            "<div class='card'>" +
                                "<div class='card-header'>" +
                                    "<h6>Bloque 1 - Prueba de Conocimientos Pedagógicos Generales</h6>" +
                                "</div>" +

                                "<div class='card-body'>" +
                                    "<div class='row'>" +
                                        "<div class='col-sm-4'>" +
                                            "<label>Hora Inicio</label>" +
                                            "<div class='input-group clockpicker'>"+
                                                "<input type='text' class='form-control' name='horaInicioBloque1_dia1_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque1_dia1_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_inicio_b1 == null ? '' : response[i].aplicaciones[j].hora_inicio_b1.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                                                "<span class='input-group-addon'>"+
                                                "<span class='glyphicon glyphicon-time'></span>"+
                                                "</span>"+
                                            "</div>"+
                                            "<span class='error_show' id='formError_horaInicioBloque1_dia1_"+response[i].aplicaciones[j].id+"'></span>"+
                                        "</div>" +

                                        "<div class='col-sm-4'>" +
                                            "<label>Hora Termino</label>" +
                                            /*"<input type='time' name='horaTerminoBloque1_dia1_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque1_dia1_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_terminoB1 + "'>" +*/
                                            "<div class='input-group clockpicker'>"+
                                                "<input type='text' class='form-control' name='horaTerminoBloque1_dia1_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque1_dia1_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_termino_b1 == null ? '' : response[i].aplicaciones[j].hora_termino_b1.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                                                "<span class='input-group-addon'>"+
                                                "<span class='glyphicon glyphicon-time'></span>"+
                                                "</span>"+
                                            "</div>"+
                                            "<span class='error_show' id='formError_horaTerminoBloque1_dia1_"+response[i].aplicaciones[j].id+"'></span>"+
                                                            
                                        "</div>" +

                                        "<div class='col-sm-4'>" +
                                            "<label>Estudiantes Presentes</label>" +
                                            "<input type='text' oninput='this.value=cantidadEstudiantes(this.value)' oninput='this.value=cantidadEstudiantes(this.value)' name='estudiantesPresentesBloque1_dia1_" + response[i].aplicaciones[j].id + "' id='estudiantesPresentesBloque1_dia1_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + (response[i].aplicaciones[j].presentes_b1 == null ? '' :response[i].aplicaciones[j].presentes_b1) + "'>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='row'>" +
                                        "<div class='col-sm-12 pt-2'>" +
                                            "<label>Observaciones Examinador</label>" +
                                            "<textarea rows='4' class='form-control' name='observacionesBloque1_dia1_"+response[i].aplicaciones[j].id+"' id='observacionesBloque1_dia1_"+response[i].aplicaciones[j].id+"'>"+(response[i].aplicaciones[j].observaciones_b1 == null ? '' : response[i].aplicaciones[j].observaciones_b1)+"</textarea>" +
                                        "</div>" +
                                    "</div>" +  
                                "</div>" +
                            "</div>" +

                            "<hr class='separador-novisible'>" +

                            "<div class='card mb-2'>" +
                                "<div class='card-header'>" +
                                    "<h6>Bloque 2 - Prueba de Conocimientos Disciplinarios y Didácticos</h6>" +
                                "</div>" +

                                "<div class='card-body'>" +
                                    "<div class='row'>" +
                                        "<div class='col-sm-4'>" +
                                            "<label>Hora Inicio</label>" +
                                            /*"<input type='time' name='horaInicioBloque2_dia1_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque2_dia1_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_inicioB2 + "'>" +*/
                                            "<div class='input-group clockpicker'>"+
                                                "<input type='text' class='form-control' name='horaInicioBloque2_dia1_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque2_dia1_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_inicio_b2 == null ? '' : response[i].aplicaciones[j].hora_inicio_b2.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                                                "<span class='input-group-addon'>"+
                                                "<span class='glyphicon glyphicon-time'></span>"+
                                                "</span>"+
                                            "</div>"+
                                            "<span class='error_show' id='formError_horaInicioBloque2_dia1_"+response[i].aplicaciones[j].id+"'></span>"+
                                        "</div>" +

                                        "<div class='col-sm-4'>" +
                                            "<label>Hora Termino</label>" +
                                            /*"<input type='time' name='horaTerminoBloque2_dia1_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque2_dia1_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_terminoB2 + "'>" +*/
                                            "<div class='input-group clockpicker'>"+
                                                "<input type='text' class='form-control' name='horaTerminoBloque2_dia1_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque2_dia1_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_termino_b2 == null ? '' : response[i].aplicaciones[j].hora_termino_b2.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                                                "<span class='input-group-addon'>"+
                                                "<span class='glyphicon glyphicon-time'></span>"+
                                                "</span>"+
                                            "</div>"+
                                            "<span class='error_show' id='formError_horaTerminoBloque2_dia1_"+response[i].aplicaciones[j].id+"'></span>"+
                                        "</div>" +

                                        "<div class='col-sm-4'>" +
                                            "<label>Estudiantes Presentes</label>" +
                                            "<input type='text' oninput='this.value=cantidadEstudiantes(this.value)' oninput='this.value=cantidadEstudiantes(this.value)' name='estudiantesPresentesBloque2_dia1_" + response[i].aplicaciones[j].id + "' id='estudiantesPresentesBloque2_dia1_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + (response[i].aplicaciones[j].presentes_b2 == null ? '' : response[i].aplicaciones[j].presentes_b2) + "'>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='row'>" +
                                        "<div class='col-sm-12 pt-2'>" +
                                            "<label>Observaciones Examinador</label>" +
                                            "<textarea rows='4' class='form-control' name='observacionesBloque2_dia1_"+response[i].aplicaciones[j].id+"' id='observacionesBloque2_dia1_"+response[i].aplicaciones[j].id+"'>"+(response[i].aplicaciones[j].observaciones_b2 == null ? '' : response[i].aplicaciones[j].observaciones_b2)+"</textarea>" +
                                        "</div>" +
                                    "</div>" +  
                                "</div>" +
                        
                            "</div>" +

                            "<div class='col-sm-12 pt-2' style='padding-left: 0px;padding-right: 0px;'>" +
                                "<label>Observaciones</label>" +
                                "<textarea rows='4' class='form-control' name='observaciones_"+response[i].aplicaciones[j].id+"' id='observaciones_"+response[i].aplicaciones[j].id+"'>"+(response[i].aplicaciones[j].observaciones == null ? '' : response[i].aplicaciones[j].observaciones)+"</textarea>" +
                            "</div>" +

                            /*"<div class='card-footer text-right sin-bordes bg-white'>"+
                                "<button type='button' class='btn btn-success' onclick='saveAplicacion( 1,"+response[i].aplicaciones[j].id+");'><i class='fas fa-save'></i>Guardar</button>"+
                            "</div>"+*/

                        "</div>" +
                    "</div>");

                    $(".clockpicker").clockpicker({
                        placement: 'top',
                        autoclose: true,
                        donetext: 'Listo',

                    });
            }else

            //Día 2
            if (response[i].aplicaciones[j].fecha_agendada == "2018-12-19") {
                $("#linkDia2").show();

                $("#divLabsDia2").append(
                    "<div class='panel-heading card-header'>" +
                    "<input type='hidden' id='idAplicacionDia2_" + j + "' value='" + response[i].aplicaciones[j].id + "'>" +
                    "<h5 class='panel-title'>" +
                    "<a data-toggle='collapse' id='btn" + response[i].aplicaciones[j].id + "' class='nav-link text-dark' href='#collapse" + response[i].aplicaciones[j].id + "'>" + response[i].nombre_dependencia + "<i class='more-less fa fa-chevron-down'></i></a>" +
                    "</h5>" +
                    "</div>" +

                    "<div id='collapse" + response[i].aplicaciones[j].id + "' class='panel-collapse collapse pt-2'>" +
                    "<div class='panel-body'>" +
                        "<div class='pt-3 pb-3 col-sm-12'>"+
                            
                            "<div class='panel-heading card-header _bg-verdeClaro' style='padding-top: 0px;padding-bottom: 0px;'>" +
                                "<input type='hidden' id='idAplicacionDia1_" + j + "' value='" + response[i].aplicaciones[j].id + "'>" +

                                "<h5 class='panel-title'>" +
                                "<a data-toggle='collapse' id='btn" + response[i].aplicaciones[j].id + "' class='nav-link text-dark' href='#collapseInfoLab" + response[i].aplicaciones[j].id + "'> Información Laboratorio <i class='more-less fa fa-chevron-down'></i></a>" +
                                "</h5>" +

                            "</div>" +

                            "<div id='collapseInfoLab" + response[i].aplicaciones[j].id + "' class='card panel-collapse collapse pt-2'>" +
                                "<div class='panel-body'>" +
                                    "<div class='pt-3 col-sm-12'>"+
                                     
                                        "<div class='row'>" +
                                            "<div class='col-sm-4'>"+
                                                "<label>Encargado Apertura</label>"+
                                                "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].persona_disponible_apertura == null ? '-' : response[i].persona_disponible_apertura)+"</b></h5>"+
                                            "</div>"+
                                            "<div class='col-sm-4'>"+
                                                "<label>Teléfono Encargado</label>"+
                                                "<h5 id='telefonoEncargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].telefono_persona_apertura == null ? '-' : response[i].telefono_persona_apertura)+"</b></h5>"+
                                            "</div>"+
                                            
                                            "<div class='col-sm-4'>"+
                                                "<label>Horario Apertura</label>"+
                                                "<h5 id='horarioApertura_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].horario_apertura == null ? '-' : response[i].horario_apertura.slice(0,-3))+"</b></h5>"+
                                            "</div>"+
                                        "</div>" +
                                        "<div class='row pt-2'>" +
                                            "<div class='col-sm-6'>"+
                                                "<label>Dirección</label>"+
                                                "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].direccion_dep == null ? '-' : response[i].direccion_dep)+"</b></h5>"+
                                            "</div>"+
                                            "<div class='col-sm-6'>"+
                                                "<label>Facultad</label>"+
                                                "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].facultad_sector == null ? '-' : response[i].facultad_sector)+"</b></h5>"+
                                            "</div>"+
                                        "</div>" +
                                        "<div class='row pt-2'>" +
                                            "<div class='col-sm-12 pt-2'>" +
                                                "<label>Observaciones Visita Previa</label>" +
                                                "<h5 id='observacionesLab_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].observaciones == null ? '-' : response[i].observaciones)+"</b></h5>"+
                                            "</div>" +
                                        "</div>" +
                                    "</div>" +      
                                "</div>" +
                            "</div>"+

                        "</div>"+

                    "<div class='row mt-2 mb-2'>" +
                        "<div class='col-sm-12'>" +
                        "<a class='btn _bg-red text-light' id='"+response[i].aplicaciones[j].fecha_agendada+"' onclick='verContingencias("+response[i].aplicaciones[j].id+", this.id);'><i class='fas fa-exclamation-triangle'_bg-red></i>  Registro de Contingencias</a>" +
                        "</div>" +
                    "</div>" +

                    "<div class='card'>" +
                    "<div class='card-header'>" +
                    "<h6>Bloque 1 - Prueba de Conocimientos Pedagógicos Generales</h6>" +
                    "</div>" +

                    "<div class='card-body'>" +
                    "<div class='row'>" +
                    "<div class='col-sm-4'>" +
                        "<label>Hora Inicio</label>" +
                        /*"<input type='time' name='horaInicioBloque1_dia2_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque1_dia2_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_inicioB1 + "'>" +*/
                            "<div class='input-group clockpicker'>"+
                                "<input type='text' class='form-control' name='horaInicioBloque1_dia2_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque1_dia2_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_inicio_b1 == null ? '' : response[i].aplicaciones[j].hora_inicio_b1.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                                "<span class='input-group-addon'>"+
                                "<span class='glyphicon glyphicon-time'></span>"+
                                "</span>"+
                            "</div>"+
                            "<span class='error_show' id='formError_horaInicioBloque1_dia2_"+response[i].aplicaciones[j].id+"'></span>"+
                    "</div>" +

                    "<div class='col-sm-4'>" +
                    "<label>Hora Termino</label>" +
                    /*"<input type='time' name='horaTerminoBloque1_dia2_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque1_dia2_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_terminoB1 + "'>" +*/
                        "<div class='input-group clockpicker'>"+
                            "<input type='text' class='form-control' name='horaTerminoBloque1_dia2_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque1_dia2_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_termino_b1 == null ? '' : response[i].aplicaciones[j].hora_termino_b1.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                            "<span class='input-group-addon'>"+
                            "<span class='glyphicon glyphicon-time'></span>"+
                            "</span>"+
                        "</div>"+
                        "<span class='error_show' id='formError_horaTerminoBloque1_dia2_"+response[i].aplicaciones[j].id+"'></span>"+
                    "</div>" +

                        "<div class='col-sm-4'>" +
                            "<label>Estudiantes Presentes</label>" +
                            "<input type='text' oninput='this.value=cantidadEstudiantes(this.value)' name='estudiantesPresentesBloque1_dia2_" + response[i].aplicaciones[j].id + "' id='estudiantesPresentesBloque1_dia2_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + (response[i].aplicaciones[j].presentes_b1 == null ? '' : response[i].aplicaciones[j].presentes_b1) + "'>" +
                        "</div>" +
                    "</div>" +
                    "<div class='row'>" +
                        "<div class='col-sm-12 pt-2'>" +
                            "<label>Observaciones Examinador</label>" +
                            "<textarea rows='4' class='form-control' name='observacionesBloque1_dia2_"+response[i].aplicaciones[j].id+"' id='observacionesBloque1_dia2_"+response[i].aplicaciones[j].id+"'>"+(response[i].aplicaciones[j].observaciones_b1 == null ? '' : response[i].aplicaciones[j].observaciones_b1)+"</textarea>" +
                        "</div>" +
                    "</div>" + 
                    "</div>" +
                    "</div>" +

                    "<hr class='separador-novisible'>" +

                    "<div class='card'>" +
                    "<div class='card-header'>" +
                    "<h6>Bloque 2 - Prueba de Conocimientos Disciplinarios y Didácticos</h6>" +
                    "</div>" +

                    "<div class='card-body'>" +
                    "<div class='row'>" +
                    "<div class='col-sm-4'>" +
                    "<label>Hora Inicio</label>" +
                    /*"<input type='time' name='horaInicioBloque2_dia2_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque2_dia2_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_inicioB2 + "'>" +*/
                        "<div class='input-group clockpicker'>"+
                            "<input type='text' class='form-control' name='horaInicioBloque2_dia2_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque2_dia2_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_inicio_b2 == null ? '' : response[i].aplicaciones[j].hora_inicio_b2.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                            "<span class='input-group-addon'>"+
                            "<span class='glyphicon glyphicon-time'></span>"+
                            "</span>"+
                        "</div>"+
                        "<span class='error_show' id='formError_horaInicioBloque2_dia2_"+response[i].aplicaciones[j].id+"'></span>"+
                    "</div>" +

                    "<div class='col-sm-4'>" +
                    "<label>Hora Termino</label>" +
                    /*"<input type='time' name='horaTerminoBloque2_dia2_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque2_dia2_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_terminoB2 + "'>" +*/
                        "<div class='input-group clockpicker'>"+
                            "<input type='text' class='form-control' name='horaTerminoBloque2_dia2_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque2_dia2_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_termino_b2 == null ? '' : response[i].aplicaciones[j].hora_termino_b2.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                            "<span class='input-group-addon'>"+
                            "<span class='glyphicon glyphicon-time'></span>"+
                            "</span>"+
                        "</div>"+
                        "<span class='error_show' id='formError_horaTerminoBloque2_dia2_"+response[i].aplicaciones[j].id+"'></span>"+
                    "</div>" +

                        "<div class='col-sm-4'>" +
                            "<label>Estudiantes Presentes</label>" +
                            "<input type='text' oninput='this.value=cantidadEstudiantes(this.value)' name='estudiantesPresentesBloque2_dia2_" + response[i].aplicaciones[j].id + "' id='estudiantesPresentesBloque2_dia2_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + (response[i].aplicaciones[j].presentes_b2 == null ? '' : response[i].aplicaciones[j].presentes_b2) + "'>" +
                        "</div>" +
                    "</div>" +
                    "<div class='row'>" +
                        "<div class='col-sm-12 pt-2'>" +
                            "<label>Observaciones Examinador</label>" +
                            "<textarea rows='4' class='form-control' name='observacionesBloque2_dia2_"+response[i].aplicaciones[j].id+"' id='observacionesBloque2_dia2_"+response[i].aplicaciones[j].id+"'>"+(response[i].aplicaciones[j].observaciones_b2 == null ? '' : response[i].aplicaciones[j].observaciones_b2)+"</textarea>" +
                        "</div>" +
                    "</div>" +  

                    "</div>" +
                    "</div>" +
                        "<div class='col-sm-12 pt-2' style='padding-left: 0px;padding-right: 0px;'>" +
                            "<label>Observaciones</label>" +
                            "<textarea rows='4' class='form-control' name='observaciones_"+response[i].aplicaciones[j].id+"' id='observaciones_"+response[i].aplicaciones[j].id+"'>"+(response[i].aplicaciones[j].observaciones == null ? '' : response[i].aplicaciones[j].observaciones)+"</textarea>" +
                        "</div>" +
                        /*"<div class='card-footer text-right sin-bordes bg-white'>"+
                            "<button type='button' class='btn btn-success' onclick='saveAplicacion( 2,"+response[i].aplicaciones[j].id+");'><i class='fas fa-save'></i>Guardar</button>"+
                        "</div>"+*/
                    "</div>" +
                    "</div>");
                
                $(".clockpicker").clockpicker({
                    placement: 'top',
                    autoclose: true,
                    donetext: 'Listo',

                });

            }else

            //Día 3
            if (response[i].aplicaciones[j].fecha_agendada == "2018-12-20") {

                $("#linkDia3").show();

                $("#divLabsDia3").append(
                    "<div class='panel-heading card-header'>" +
                    "<input type='hidden' id='idAplicacionDia3_" + j + "' value='" + response[i].aplicaciones[j].id + "'>" +
                    "<h5 class='panel-title'>" +
                    "<a data-toggle='collapse' id='btn" + response[i].aplicaciones[j].id + "' class='nav-link text-dark' href='#collapse" + response[i].aplicaciones[j].id + "'>" + response[i].nombre_dependencia + "<i class='more-less fa fa-chevron-down'></i></a>" +
                    "</h5>" +
                    "</div>" +

                    "<div id='collapse" + response[i].aplicaciones[j].id + "' class='panel-collapse collapse pt-2'>" +
                    "<div class='panel-body'>" +
                        "<div class='pt-3 pb-3 col-sm-12'>"+
                            
                            "<div class='panel-heading card-header _bg-verdeClaro' style='padding-top: 0px;padding-bottom: 0px;'>" +
                                "<input type='hidden' id='idAplicacionDia1_" + j + "' value='" + response[i].aplicaciones[j].id + "'>" +

                                "<h5 class='panel-title'>" +
                                "<a data-toggle='collapse' id='btn" + response[i].aplicaciones[j].id + "' class='nav-link text-dark' href='#collapseInfoLab" + response[i].aplicaciones[j].id + "'> Información Laboratorio <i class='more-less fa fa-chevron-down'></i></a>" +
                                "</h5>" +

                            "</div>" +

                            "<div id='collapseInfoLab" + response[i].aplicaciones[j].id + "' class='card panel-collapse collapse pt-2'>" +
                                "<div class='panel-body'>" +
                                    "<div class='pt-3 col-sm-12'>"+
                                     
                                        "<div class='row'>" +
                                            "<div class='col-sm-4'>"+
                                                "<label>Encargado Apertura</label>"+
                                                "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].persona_disponible_apertura == null ? '-' : response[i].persona_disponible_apertura)+"</b></h5>"+
                                            "</div>"+
                                            "<div class='col-sm-4'>"+
                                                "<label>Teléfono Encargado</label>"+
                                                "<h5 id='telefonoEncargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].telefono_persona_apertura == null ? '-' : response[i].telefono_persona_apertura)+"</b></h5>"+
                                            "</div>"+
                                            
                                            "<div class='col-sm-4'>"+
                                                "<label>Horario Apertura</label>"+
                                                "<h5 id='horarioApertura_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].horario_apertura == null ? '-' : response[i].horario_apertura.slice(0,-3))+"</b></h5>"+
                                            "</div>"+
                                        "</div>" +
                                        "<div class='row pt-2'>" +
                                            "<div class='col-sm-6'>"+
                                                "<label>Dirección</label>"+
                                                "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].direccion_dep == null ? '-' : response[i].direccion_dep)+"</b></h5>"+
                                            "</div>"+
                                            "<div class='col-sm-6'>"+
                                                "<label>Facultad</label>"+
                                                "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].facultad_sector == null ? '-' : response[i].facultad_sector)+"</b></h5>"+
                                            "</div>"+
                                        "</div>" +
                                        "<div class='row pt-2'>" +
                                            "<div class='col-sm-12 pt-2'>" +
                                                "<label>Observaciones Visita Previa</label>" +
                                                "<h5 id='observacionesLab_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].observaciones == null ? '-' : response[i].observaciones)+"</b></h5>"+
                                            "</div>" +
                                        "</div>" +
                                    "</div>" +      
                                "</div>" +
                            "</div>"+

                        "</div>"+

                    "<div class='row mt-2 mb-2'>" +
                        "<div class='col-sm-12'>" +
                        "<a class='btn _bg-red text-light' id='"+response[i].aplicaciones[j].fecha_agendada+"' onclick='verContingencias("+response[i].aplicaciones[j].id+", this.id);'><i class='fas fa-exclamation-triangle'_bg-red></i>  Registro de Contingencias</a>" +
                        "</div>" +
                    "</div>" +

                    "<div class='card'>" +
                    "<div class='card-header'>" +
                    "<h6>Bloque 1 - Prueba de Conocimientos Pedagógicos Generales</h6>" +
                    "</div>" +

                    "<div class='card-body'>" +
                    "<div class='row'>" +
                    "<div class='col-sm-4'>" +
                    "<label>Hora Inicio</label>" +
                    /*"<input type='time' name='horaInicioBloque1_dia3_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque1_dia3_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_inicioB1 + "'>" +*/
                        "<div class='input-group clockpicker'>"+
                            "<input type='text' class='form-control' name='horaInicioBloque1_dia3_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque1_dia3_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_inicio_b1 == null ? '' : response[i].aplicaciones[j].hora_inicio_b1.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                            "<span class='input-group-addon'>"+
                            "<span class='glyphicon glyphicon-time'></span>"+
                            "</span>"+
                        "</div>"+
                        "<span class='error_show' id='formError_horaInicioBloque1_dia3_"+response[i].aplicaciones[j].id+"'></span>"+
                    "</div>" +

                    "<div class='col-sm-4'>" +
                    "<label>Hora Termino</label>" +
                    /*"<input type='time' name='horaTerminoBloque1_dia3_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque1_dia3_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_terminoB1 + "'>" +*/
                        "<div class='input-group clockpicker'>"+
                            "<input type='text' class='form-control' name='horaTerminoBloque1_dia3_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque1_dia3_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_termino_b1 == null ? '' : response[i].aplicaciones[j].hora_termino_b1.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                            "<span class='input-group-addon'>"+
                            "<span class='glyphicon glyphicon-time'></span>"+
                            "</span>"+
                        "</div>"+
                        "<span class='error_show' id='formError_horaTerminoBloque1_dia3_"+response[i].aplicaciones[j].id+"'></span>"+
                    "</div>" +

                        "<div class='col-sm-4'>" +
                            "<label>Estudiantes Presentes</label>" +
                            "<input type='text' oninput='this.value=cantidadEstudiantes(this.value)' name='estudiantesPresentesBloque1_dia3_" + response[i].aplicaciones[j].id + "' id='estudiantesPresentesBloque1_dia3_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + (response[i].aplicaciones[j].presentes_b1 == null ? '' : response[i].aplicaciones[j].presentes_b1)+ "'>" +
                        "</div>" +
                    "</div>" +
                    "<div class='row'>" +
                        "<div class='col-sm-12 pt-2'>" +
                            "<label>Observaciones Examinador</label>" +
                            "<textarea rows='4' class='form-control' name='observacionesBloque1_dia3_"+response[i].aplicaciones[j].id+"' id='observacionesBloque1_dia3_"+response[i].aplicaciones[j].id+"'>"+(response[i].aplicaciones[j].observaciones_b1 == null ? '' : response[i].aplicaciones[j].observaciones_b1)+"</textarea>" +
                        "</div>" +
                    "</div>" +  

                    "</div>" +
                    "</div>" +

                    "<hr class='separador-novisible'>" +

                    "<div class='card'>" +
                    "<div class='card-header'>" +
                    "<h6>Bloque 2 - Prueba de Conocimientos Disciplinarios y Didácticos</h6>" +
                    "</div>" +

                    "<div class='card-body'>" +
                    "<div class='row'>" +
                    "<div class='col-sm-4'>" +
                    "<label>Hora Inicio</label>" +
                    /*"<input type='time' name='horaInicioBloque2_dia3_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque2_dia3_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_inicioB2 + "'>" +*/
                        "<div class='input-group clockpicker'>"+
                            "<input type='text' class='form-control' name='horaInicioBloque2_dia3_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque2_dia3_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_inicio_b2 == null ? '' : response[i].aplicaciones[j].hora_inicio_b2.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                            "<span class='input-group-addon'>"+
                            "<span class='glyphicon glyphicon-time'></span>"+
                            "</span>"+
                        "</div>"+
                        "<span class='error_show' id='formError_horaInicioBloque2_dia3_"+response[i].aplicaciones[j].id+"'></span>"+
                    "</div>" +

                    "<div class='col-sm-4'>" +
                    "<label>Hora Termino</label>" +
                    /*"<input type='time' name='horaTerminoBloque2_dia3_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque2_dia3_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_terminoB2 + "'>" +*/
                        "<div class='input-group clockpicker'>"+
                            "<input type='text' class='form-control' name='horaTerminoBloque2_dia3_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque2_dia3_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_termino_b2 == null ? '' : response[i].aplicaciones[j].hora_termino_b2.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                            "<span class='input-group-addon'>"+
                            "<span class='glyphicon glyphicon-time'></span>"+
                            "</span>"+
                        "</div>"+
                        "<span class='error_show' id='formError_horaTerminoBloque2_dia3_"+response[i].aplicaciones[j].id+"'></span>"+
                    "</div>" +

                        "<div class='col-sm-4'>" +
                            "<label>Estudiantes Presentes</label>" +
                            "<input type='text' oninput='this.value=cantidadEstudiantes(this.value)' name='estudiantesPresentesBloque2_dia3_" + response[i].aplicaciones[j].id + "' id='estudiantesPresentesBloque2_dia3_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + (response[i].aplicaciones[j].presentes_b2 == null ? '' : response[i].aplicaciones[j].presentes_b2) + "'>" +
                        "</div>" +
                    "</div>" +
                    "<div class='row'>" +
                        "<div class='col-sm-12 pt-2'>" +
                            "<label>Observaciones Examinador</label>" +
                            "<textarea rows='4' class='form-control' name='observacionesBloque2_dia3_"+response[i].aplicaciones[j].id+"' id='observacionesBloque2_dia3_"+response[i].aplicaciones[j].id+"'>"+(response[i].aplicaciones[j].observaciones_b2 == null ? '' : response[i].aplicaciones[j].observaciones_b2)+"</textarea>" +
                        "</div>" +
                    "</div>" +  

                    "</div>" +
                    "</div>" +
                        "<div class='col-sm-12 pt-2' style='padding-left: 0px;padding-right: 0px;'>" +
                            "<label>Observaciones</label>" +
                            "<textarea rows='4' class='form-control' name='observaciones_"+response[i].aplicaciones[j].id+"' id='observaciones_"+response[i].aplicaciones[j].id+"'>"+(response[i].aplicaciones[j].observaciones == null ? '' : response[i].aplicaciones[j].observaciones)+"</textarea>" +
                        "</div>" +
                        /*"<div class='card-footer text-right sin-bordes bg-white'>"+
                            "<button type='button' class='btn btn-success' onclick='saveAplicacion( 3,"+response[i].aplicaciones[j].id+");'><i class='fas fa-save'></i>Guardar</button>"+
                        "</div>"+*/
                    "</div>" +
                    "</div>");
                
                $(".clockpicker").clockpicker({
                    placement: 'top',
                    autoclose: true,
                    donetext: 'Listo',

                });
            }else

            //Día 4
            if (response[i].aplicaciones[j].fecha_agendada == "2018-12-21") {
                $("#linkDia4").show();    

                $("#divLabsDia4").append(
                    "<div class='panel-heading card-header'>" +
                    "<input type='hidden' id='idAplicacionDia4_" + j + "' value='" + response[i].aplicaciones[j].id + "'>" +
                    "<h5 class='panel-title'>" +
                    "<a data-toggle='collapse' id='btn" + response[i].aplicaciones[j].id + "' class='nav-link text-dark' href='#collapse" + response[i].aplicaciones[j].id + "'>" + response[i].nombre_dependencia + "<i class='more-less fa fa-chevron-down'></i></a>" +
                    "</h5>" +
                    "</div>" +

                    "<div id='collapse" + response[i].aplicaciones[j].id + "' class='panel-collapse collapse pt-2'>" +
                    "<div class='panel-body'>" +
                        "<div class='pt-3 pb-3 col-sm-12'>"+
                            
                            "<div class='panel-heading card-header _bg-verdeClaro' style='padding-top: 0px;padding-bottom: 0px;'>" +
                                "<input type='hidden' id='idAplicacionDia1_" + j + "' value='" + response[i].aplicaciones[j].id + "'>" +

                                "<h5 class='panel-title'>" +
                                "<a data-toggle='collapse' id='btn" + response[i].aplicaciones[j].id + "' class='nav-link text-dark' href='#collapseInfoLab" + response[i].aplicaciones[j].id + "'> Información Laboratorio <i class='more-less fa fa-chevron-down'></i></a>" +
                                "</h5>" +

                            "</div>" +

                            "<div id='collapseInfoLab" + response[i].aplicaciones[j].id + "' class='card panel-collapse collapse pt-2'>" +
                                "<div class='panel-body'>" +
                                    "<div class='pt-3 col-sm-12'>"+
                                     
                                        "<div class='row'>" +
                                            "<div class='col-sm-4'>"+
                                                "<label>Encargado Apertura</label>"+
                                                "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].persona_disponible_apertura == null ? '-' : response[i].persona_disponible_apertura)+"</b></h5>"+
                                            "</div>"+
                                            "<div class='col-sm-4'>"+
                                                "<label>Teléfono Encargado</label>"+
                                                "<h5 id='telefonoEncargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].telefono_persona_apertura == null ? '-' : response[i].telefono_persona_apertura)+"</b></h5>"+
                                            "</div>"+
                                            
                                            "<div class='col-sm-4'>"+
                                                "<label>Horario Apertura</label>"+
                                                "<h5 id='horarioApertura_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].horario_apertura == null ? '-' : response[i].horario_apertura.slice(0,-3))+"</b></h5>"+
                                            "</div>"+
                                        "</div>" +
                                        "<div class='row pt-2'>" +
                                            "<div class='col-sm-6'>"+
                                                "<label>Dirección</label>"+
                                                "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].direccion_dep == null ? '-' : response[i].direccion_dep)+"</b></h5>"+
                                            "</div>"+
                                            "<div class='col-sm-6'>"+
                                                "<label>Facultad</label>"+
                                                "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].facultad_sector == null ? '-' : response[i].facultad_sector)+"</b></h5>"+
                                            "</div>"+
                                        "</div>" +
                                        "<div class='row pt-2'>" +
                                            "<div class='col-sm-12 pt-2'>" +
                                                "<label>Observaciones Visita Previa</label>" +
                                                "<h5 id='observacionesLab_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].observaciones == null ? '-' : response[i].observaciones)+"</b></h5>"+
                                            "</div>" +
                                        "</div>" +
                                    "</div>" +      
                                "</div>" +
                            "</div>"+

                        "</div>"+

                    "<div class='row mt-2 mb-2'>" +
                        "<div class='col-sm-12'>" +
                        "<a class='btn _bg-red text-light' id='"+response[i].aplicaciones[j].fecha_agendada+"' onclick='verContingencias("+response[i].aplicaciones[j].id+", this.id);'><i class='fas fa-exclamation-triangle'_bg-red></i>  Registro de Contingencias</a>" +
                        "</div>" +
                    "</div>" +
                    
                    "<div class='card'>" +
                    "<div class='card-header'>" +
                    "<h6>Bloque 1 - Prueba de Conocimientos Pedagógicos Generales</h6>" +
                    "</div>" +

                    "<div class='card-body'>" +
                    "<div class='row'>" +
                    "<div class='col-sm-4'>" +
                    "<label>Hora Inicio</label>" +
                    /*"<input type='time' name='horaInicioBloque1_dia4_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque1_dia4_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_inicioB1 + "'>" +*/
                        "<div class='input-group clockpicker'>"+
                            "<input type='text' class='form-control' name='horaInicioBloque1_dia4_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque1_dia4_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_inicio_b1 == null ? '' : response[i].aplicaciones[j].hora_inicio_b1.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                            "<span class='input-group-addon'>"+
                            "<span class='glyphicon glyphicon-time'></span>"+
                            "</span>"+
                        "</div>"+
                        "<span class='error_show' id='formError_horaInicioBloque1_dia4_"+response[i].aplicaciones[j].id+"'></span>"+
                    "</div>" +

                    "<div class='col-sm-4'>" +
                    "<label>Hora Termino</label>" +
                    /*"<input type='time' name='horaTerminoBloque1_dia4_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque1_dia4_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_terminoB1 + "'>" +*/
                        "<div class='input-group clockpicker'>"+
                            "<input type='text' class='form-control' name='horaTerminoBloque1_dia4_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque1_dia4_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_termino_b1 == null ? '' : response[i].aplicaciones[j].hora_termino_b1.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                            "<span class='input-group-addon'>"+
                            "<span class='glyphicon glyphicon-time'></span>"+
                            "</span>"+
                        "</div>"+
                        "<span class='error_show' id='formError_horaTerminoBloque1_dia4_"+response[i].aplicaciones[j].id+"'></span>"+
                    "</div>" +

                        "<div class='col-sm-4'>" +
                            "<label>Estudiantes Presentes</label>" +
                            "<input type='text' oninput='this.value=cantidadEstudiantes(this.value)' name='estudiantesPresentesBloque1_dia4_" + response[i].aplicaciones[j].id + "' id='estudiantesPresentesBloque1_dia4_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + (response[i].aplicaciones[j].presentes_b1 == null ? '' : response[i].aplicaciones[j].presentes_b1) + "'>" +
                        "</div>" +
                    "</div>" +
                    "<div class='row'>" +
                        "<div class='col-sm-12 pt-2'>" +
                            "<label>Observaciones Examinador</label>" +
                            "<textarea rows='4' class='form-control' name='observacionesBloque1_dia4_"+response[i].aplicaciones[j].id+"' id='observacionesBloque1_dia4_"+response[i].aplicaciones[j].id+"'>"+(response[i].aplicaciones[j].observaciones_b1 == null ? '' : response[i].aplicaciones[j].observaciones_b1)+"</textarea>" +
                        "</div>" +
                    "</div>" +  

                    "</div>" +
                    "</div>" +

                    "<hr class='separador-novisible'>" +

                    "<div class='card'>" +
                    "<div class='card-header'>" +
                    "<h6>Bloque 2 - Prueba de Conocimientos Disciplinarios y Didácticos</h6>" +
                    "</div>" +

                    "<div class='card-body'>" +
                    "<div class='row'>" +
                    "<div class='col-sm-4'>" +
                    "<label>Hora Inicio</label>" +
                    /*"<input type='time' name='horaInicioBloque2_dia4_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque2_dia4_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_inicioB2 + "'>" +*/
                        "<div class='input-group clockpicker'>"+
                            "<input type='text' class='form-control' name='horaInicioBloque2_dia4_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque2_dia4_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_inicio_b2 == null ? '' : response[i].aplicaciones[j].hora_inicio_b2.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                            "<span class='input-group-addon'>"+
                            "<span class='glyphicon glyphicon-time'></span>"+
                            "</span>"+
                        "</div>"+
                        "<span class='error_show' id='formError_horaInicioBloque2_dia4_"+response[i].aplicaciones[j].id+"'></span>"+
                    "</div>" +

                    "<div class='col-sm-4'>" +
                    "<label>Hora Termino</label>" +
                    /*"<input type='time' name='horaTerminoBloque2_dia4_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque2_dia4_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_terminoB2 + "'>" +*/
                        "<div class='input-group clockpicker'>"+
                            "<input type='text' class='form-control' name='horaTerminoBloque2_dia4_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque2_dia4_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_termino_b2 == null ? '' : response[i].aplicaciones[j].hora_termino_b2.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                            "<span class='input-group-addon'>"+
                            "<span class='glyphicon glyphicon-time'></span>"+
                            "</span>"+
                        "</div>"+
                        "<span class='error_show' id='formError_horaTerminoBloque2_dia4_"+response[i].aplicaciones[j].id+"'></span>"+
                    "</div>" +

                        "<div class='col-sm-4'>" +
                            "<label>Estudiantes Presentes</label>" +
                            "<input type='text' oninput='this.value=cantidadEstudiantes(this.value)' name='estudiantesPresentesBloque2_dia4_" + response[i].aplicaciones[j].id + "' id='estudiantesPresentesBloque2_dia4_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + (response[i].aplicaciones[j].presentes_b2 == null ? '' : response[i].aplicaciones[j].presentes_b2) + "'>" +
                        "</div>" +
                    "</div>" +
                    "<div class='row'>" +
                        "<div class='col-sm-12 pt-2'>" +
                            "<label>Observaciones Examinador</label>" +
                            "<textarea rows='4' class='form-control' name='observacionesBloque2_dia4_"+response[i].aplicaciones[j].id+"' id='observacionesBloque2_dia4_"+response[i].aplicaciones[j].id+"'>"+(response[i].aplicaciones[j].observaciones_b2 == null ? '' : response[i].aplicaciones[j].observaciones_b2)+"</textarea>" +
                        "</div>" +
                    "</div>" + 

                    "</div>" +
                    "</div>" +
                        "<div class='col-sm-12 pt-2' style='padding-left: 0px;padding-right: 0px;'>" +
                            "<label>Observaciones</label>" +
                            "<textarea rows='4' class='form-control' name='observaciones_"+response[i].aplicaciones[j].id+"' id='observaciones_"+response[i].aplicaciones[j].id+"'>"+(response[i].aplicaciones[j].observaciones == null ? '' : response[i].aplicaciones[j].observaciones)+"</textarea>" +
                        "</div>" +
                        /*"<div class='card-footer text-right sin-bordes bg-white'>"+
                            "<button type='button' class='btn btn-success' onclick='saveAplicacion( 4,"+response[i].aplicaciones[j].id+");'><i class='fas fa-save'></i>Guardar</button>"+
                        "</div>"+*/
                    "</div>" +
                    "</div>");

                $(".clockpicker").clockpicker({
                    placement: 'top',
                    autoclose: true,
                    donetext: 'Listo',

                });
            }else{
                $("#linkDiaComplementario").show();
                var idAplicacion = response[i].aplicaciones[j].id;

                $("#divLabsDiaComplementario").append(
                    "<div class='panel-heading card-header'>" +
                        "<input type='hidden' id='idAplicacionDia1_" + j + "' value='" + response[i].aplicaciones[j].id + "'>" +

                        "<h5 class='panel-title'>" +
                        "<a data-toggle='collapse' id='btn" + response[i].aplicaciones[j].id + "' class='nav-link text-dark' href='#collapse" + response[i].aplicaciones[j].id + "'>" + response[i].nombre_dependencia + "  <i class='more-less fa fa-chevron-down'></i></a>" +
                        "</h5>" +

                    "</div>" +

                    "<div id='collapse" + response[i].aplicaciones[j].id + "' class='panel-collapse collapse pt-2'>" +
                        "<div class='panel-body'>" +

                            "<div class='pt-3 pb-3 col-sm-12'>"+

                                "<div class='panel-heading card-header _bg-verdeClaro' style='padding-top: 0px;padding-bottom: 0px;'>" +
                                    "<input type='hidden' id='idAplicacionDia1_" + j + "' value='" + response[i].aplicaciones[j].id + "'>" +

                                    "<h5 class='panel-title'>" +
                                    "<a data-toggle='collapse' id='btn" + response[i].aplicaciones[j].id + "' class='nav-link text-dark' href='#collapseInfoLab" + response[i].aplicaciones[j].id + "'> Información Laboratorio <i class='more-less fa fa-chevron-down'></i></a>" +
                                    "</h5>" +

                                "</div>" +

                                "<div id='collapseInfoLab" + response[i].aplicaciones[j].id + "' class='card panel-collapse collapse pt-2'>" +
                                    "<div class='panel-body'>" +
                                        "<div class='pt-3 col-sm-12'>"+
                                         
                                            "<div class='row'>" +
                                                "<div class='col-sm-4'>"+
                                                    "<label>Encargado Apertura</label>"+
                                                    "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].persona_disponible_apertura == null ? '-' : response[i].persona_disponible_apertura)+"</b></h5>"+
                                                "</div>"+
                                                "<div class='col-sm-4'>"+
                                                    "<label>Teléfono Encargado</label>"+
                                                    "<h5 id='telefonoEncargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].telefono_persona_apertura == null ? '-' : response[i].telefono_persona_apertura)+"</b></h5>"+
                                                "</div>"+
                                                
                                                "<div class='col-sm-4'>"+
                                                    "<label>Horario Apertura</label>"+
                                                    "<h5 id='horarioApertura_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].horario_apertura == null ? '-' : response[i].horario_apertura.slice(0,-3))+"</b></h5>"+
                                                "</div>"+
                                            "</div>" +
                                            "<div class='row pt-2'>" +
                                                "<div class='col-sm-6'>"+
                                                    "<label>Dirección</label>"+
                                                    "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].direccion_dep == null ? '-' : response[i].direccion_dep)+"</b></h5>"+
                                                "</div>"+
                                                "<div class='col-sm-6'>"+
                                                    "<label>Facultad</label>"+
                                                    "<h5 id='encargado_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].facultad_sector == null ? '-' : response[i].facultad_sector)+"</b></h5>"+
                                                "</div>"+
                                            "</div>" +
                                            "<div class='row pt-2'>" +
                                                "<div class='col-sm-12 pt-2'>" +
                                                    "<label>Observaciones Visita Previa</label>" +
                                                    "<h5 id='observacionesLab_"+response[i].aplicaciones[j].id +"'><b>"+(response[i].observaciones == null ? '-' : response[i].observaciones)+"</b></h5>"+
                                                "</div>" +
                                            "</div>" +
                                        "</div>" +      
                                    "</div>" +
                                "</div>"+

                            "</div>"+

                            "<div class='row mt-2 mb-2'>" +
                                "<div class='col-sm-12'>" +
                                "<a class='btn _bg-red text-light' id='"+response[i].aplicaciones[j].fecha_agendada+"' onclick='verContingencias("+response[i].aplicaciones[j].id+", this.id);'><i class='fas fa-exclamation-triangle'_bg-red></i>  Registro de Contingencias</a>" +
                                "</div>" +
                            "</div>" +

                            "<div class='card'>" +
                                "<div class='card-header'>" +
                                    "<h6>Bloque 1 - Prueba de Conocimientos Pedagógicos Generales</h6>" +
                                "</div>" +

                                "<div class='card-body'>" +
                                    "<div class='row'>" +
                                        "<div class='col-sm-4'>" +
                                            "<label>Hora Inicio</label>" +
                                            "<div class='input-group clockpicker'>"+
                                                "<input disabled type='text' class='form-control' name='horaInicioBloque1_dia1_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque1_dia1_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_inicio_b1 == null ? '' : response[i].aplicaciones[j].hora_inicio_b1.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)' disabled>"+
                                                "<span class='input-group-addon'>"+
                                                "<span class='glyphicon glyphicon-time'></span>"+
                                                "</span>"+
                                            "</div>"+
                                            "<span class='error_show' id='formError_horaInicioBloque1_dia1_"+response[i].aplicaciones[j].id+"'></span>"+
                                        "</div>" +

                                        "<div class='col-sm-4'>" +
                                            "<label>Hora Termino</label>" +
                                            /*"<input type='time' name='horaTerminoBloque1_dia1_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque1_dia1_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_terminoB1 + "'>" +*/
                                            "<div class='input-group clockpicker'>"+
                                                "<input  disabled type='text' class='form-control' name='horaTerminoBloque1_dia1_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque1_dia1_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_termino_b1 == null ? '' : response[i].aplicaciones[j].hora_termino_b1.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)' disabled>"+
                                                "<span class='input-group-addon'>"+
                                                "<span class='glyphicon glyphicon-time'></span>"+
                                                "</span>"+
                                            "</div>"+
                                            "<span class='error_show' id='formError_horaTerminoBloque1_dia1_"+response[i].aplicaciones[j].id+"'></span>"+
                                                            
                                        "</div>" +

                                        "<div class='col-sm-4'>" +
                                            "<label>Estudiantes Presentes</label>" +
                                            "<input disabled type='text' oninput='this.value=cantidadEstudiantes(this.value)' oninput='this.value=cantidadEstudiantes(this.value)' name='estudiantesPresentesBloque1_dia1_" + response[i].aplicaciones[j].id + "' id='estudiantesPresentesBloque1_dia1_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + (response[i].aplicaciones[j].presentes_b1 == null ? '' :response[i].aplicaciones[j].presentes_b1) + "'  disabled>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='row'>" +
                                        "<div class='col-sm-12 pt-2'>" +
                                            "<label>Observaciones Examinador</label>" +
                                            "<textarea disabled rows='4' class='form-control' name='observacionesBloque1_dia1_"+response[i].aplicaciones[j].id+"' id='observacionesBloque1_dia1_"+response[i].aplicaciones[j].id+"'  disabled>"+(response[i].aplicaciones[j].observaciones_b1 == null ? '' : response[i].aplicaciones[j].observaciones_b1)+"</textarea>" +
                                        "</div>" +
                                    "</div>" +  
                                "</div>" +
                            "</div>" +

                            "<hr class='separador-novisible'>" +

                            "<div class='card mb-2'>" +
                                "<div class='card-header'>" +
                                    "<h6>Bloque 2 - Prueba de Conocimientos Disciplinarios y Didácticos</h6>" +
                                "</div>" +

                                "<div class='card-body'>" +
                                    "<div class='row'>" +
                                        "<div class='col-sm-4'>" +
                                            "<label>Hora Inicio</label>" +
                                            /*"<input type='time' name='horaInicioBloque2_dia1_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque2_dia1_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_inicioB2 + "'>" +*/
                                            "<div class='input-group clockpicker'>"+
                                                "<input disabled type='text' class='form-control' name='horaInicioBloque2_dia1_" + response[i].aplicaciones[j].id + "' id='horaInicioBloque2_dia1_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_inicio_b2 == null ? '' : response[i].aplicaciones[j].hora_inicio_b2.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'  disabled>"+
                                                "<span class='input-group-addon'>"+
                                                "<span class='glyphicon glyphicon-time'></span>"+
                                                "</span>"+
                                            "</div>"+
                                            "<span class='error_show' id='formError_horaInicioBloque2_dia1_"+response[i].aplicaciones[j].id+"'></span>"+
                                        "</div>" +

                                        "<div class='col-sm-4'>" +
                                            "<label>Hora Termino</label>" +
                                            /*"<input type='time' name='horaTerminoBloque2_dia1_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque2_dia1_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + response[i].aplicaciones[j].hora_terminoB2 + "'>" +*/
                                            "<div class='input-group clockpicker'>"+
                                                "<input disabled type='text' class='form-control' name='horaTerminoBloque2_dia1_" + response[i].aplicaciones[j].id + "' id='horaTerminoBloque2_dia1_" + response[i].aplicaciones[j].id + "'  value='" + (response[i].aplicaciones[j].hora_termino_b2 == null ? '' : response[i].aplicaciones[j].hora_termino_b2.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'  disabled>"+
                                                "<span class='input-group-addon'>"+
                                                "<span class='glyphicon glyphicon-time'></span>"+
                                                "</span>"+
                                            "</div>"+
                                            "<span class='error_show' id='formError_horaTerminoBloque2_dia1_"+response[i].aplicaciones[j].id+"'></span>"+
                                        "</div>" +

                                        "<div class='col-sm-4'>" +
                                            "<label>Estudiantes Presentes</label>" +
                                            "<input disabled type='text' oninput='this.value=cantidadEstudiantes(this.value)' oninput='this.value=cantidadEstudiantes(this.value)' name='estudiantesPresentesBloque2_dia1_" + response[i].aplicaciones[j].id + "' id='estudiantesPresentesBloque2_dia1_" + response[i].aplicaciones[j].id + "' class='form-control' value='" + (response[i].aplicaciones[j].presentes_b2 == null ? '' : response[i].aplicaciones[j].presentes_b2) + "'  disabled>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='row'>" +
                                        "<div class='col-sm-12 pt-2'>" +
                                            "<label>Observaciones Examinador</label>" +
                                            "<textarea disabled rows='4' class='form-control' name='observacionesBloque2_dia1_"+response[i].aplicaciones[j].id+"' id='observacionesBloque2_dia1_"+response[i].aplicaciones[j].id+"'  disabled>"+(response[i].aplicaciones[j].observaciones_b2 == null ? '' : response[i].aplicaciones[j].observaciones_b2)+"</textarea>" +
                                        "</div>" +
                                    "</div>" +  
                                "</div>" +
                        
                            "</div>" +
/*
                            "<div class='col-sm-12 pt-2' style='padding-left: 0px;padding-right: 0px;'>" +
                                "<label>Observaciones Laboratorio</label>" +
                                "<textarea rows='4' disabled class='form-control' name='observaciones_"+response[i].aplicaciones[j].id+"' id='observaciones_"+response[i].aplicaciones[j].id+"'  disabled>"+(response[i].aplicaciones[j].observaciones == null ? '' : response[i].aplicaciones[j].observaciones)+"</textarea>" +
                            "</div>" +*/

                            "<div class='col-sm-12 pt-2' style='padding-left: 0px;padding-right: 0px;'>" +
                                "<label>Observaciones Supervisor</label>" +
                                "<textarea rows='4' class='form-control' name='observaciones_supervisor_"+response[i].aplicaciones[j].id+"' id='observaciones_supervisor_"+response[i].aplicaciones[j].id+"' >"+(response[i].aplicaciones[j].observaciones_supervisor == null ? '' : response[i].aplicaciones[j].observaciones_supervisor)+"</textarea>" +
                            "</div>" +

                            "<div class='card-footer text-right sin-bordes bg-white'>"+
                                "<button type='button' class='btn btn-success' onclick='saveAplicacion("+response[i].aplicaciones[j].id+");'><i class='fas fa-save'></i>Guardar</button>"+
                            "</div>"+

                        "</div>" +
                    "</div>");

                    $(".clockpicker").clockpicker({
                        placement: 'top',
                        autoclose: true,
                        donetext: 'Listo',

                    });
            

            }

        }
    }

    if($('#linkDia1').css('display') == 'none'){

        if($('#linkDia2').css('display') == 'none'){

            if($('#linkDia3').css('display') == 'none'){

                if($('#linkDia4').css('display') == 'none'){
                    $('#linkDiaComplementario').addClass('active show');
                    $('#diaComplementario').addClass('active show');
                }else{
                    $('#linkDia4').addClass('active show');
                    $('#dia4').addClass('active show');
                }

            }else{
                $('#linkDia3').addClass('active show');
                $('#dia3').addClass('active show');
             
            }
        }else{
            console.log('dwede')
            $('#linkDia2').addClass('active show');
            $('#dia2').addClass('active show');
         
        }

    }else{
        $('#linkDia1').addClass('active show');
        $('#dia1').addClass('active show');
     
    }

    $("#direccionSede").show();
    $("#cardSeccion2").show();
}

function verContingencias(idAplicacion,fechaAgendada) {
    localStorage.region = $('#selectRegion').val();
    localStorage.universidad = $('#universidad').val();
    localStorage.sede = $('#sede').val();

    location.href = 'contingenciasSupervisorComplementaria.php?idaplicacion='+idAplicacion+'&fecha='+fechaAgendada
}


function ocultar(){
 
    $("#direccionSede").hide();
    $("#cardSeccion2").hide();
    $("#linkDia1").hide();
    $("#linkDia2").hide();
    $("#linkDia3").hide();
    $("#linkDia4").hide();   
    $("#linkDiaComplementario").hide();   
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

function cantidadEstudiantes(string){
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