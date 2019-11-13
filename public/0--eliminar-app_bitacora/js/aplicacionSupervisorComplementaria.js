$(document).ready(function () {
    ocultar();
     $('#nombre_usuario').html(localStorage.getItem('nombre_tecnico')+' ')
     loginvalid(localStorage.getItem('nombre_tecnico'))
    

});

function loginvalid(id_tec){
    
    if (id_tec==null) {
         showFeedback("error","Debes iniciar sesion con la cuenta vinculada al sistema","Datos incorrectos");
         redirectLogin(2)
    } else {
        $("#wad").removeClass('blackout');
        $('#nombre_tecnico').html(localStorage.nombre_tecnico)
       getRegiones();

    $("#selectRegion").change(function () {
        cleanLabdia()
        ocultar();
        $("#universidad").empty();
        $("#sede").empty();
         $("#sede").append("<option value=''>Seleccione Sede</option>")
        $("#universidad").append("<option value=''>Seleccione UNIVERSIDAD</option>")
        getUniversidades();
    });

    $("#universidad").change(function () {
        cleanLabdia()
        ocultar();
        $("#sede").empty();
        $("#sede").append("<option value=''>Seleccione Sede</option>")
        getSedes();
    });

    $("#sede").change(function () {
        cleanLabdia()
        ocultar();
        if($('#sede').val() > 0){
            //informacionSede();
            getDependencias();
        }
    });
    $("#dia").change(function () {
       
         getDependencias()
        ocultar();
        $("#laboratorio").empty();
        $("#laboratorio").append("<option value=''>Seleccione Laboratorio</option>")
        listarLaboratorios($('#dia').val())

       
    });

    $("#laboratorio").change(function () {
        
        ocultar();
         getDependencias()
       if($('#sede').val() > 0){
            //informacionSede();

            listerDependencias(dep);
        }
      
    });
    


    
    
    }
}

function cleanLabdia(){
    $("#dia").empty();
    $("#dia").append("<option value=''>Selecione Día</option>")
    $("#laboratorio").empty();
    $("#laboratorio").append("<option value=''>Selecione Laboratorio</option>")
}



var test;
var sedes;
function getRegiones() {
    $.blockUI({ message: '<img src="img/carga.svg">' });

    $.ajax({
        method: 'GET',
        url: 'https://dev.diagnosticafid.cl/public/api/regiones/indexcomplementaria',
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
        url: 'https://dev.diagnosticafid.cl/public/api/universidades/indexbyidregion',
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
        url: 'https://dev.diagnosticafid.cl/public/api/sedes/indexbyid',
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
var dep;
function getDependencias() {
    $.blockUI({ message: '<img src="img/carga.svg">' });
    $.ajax({
        method: 'GET',
        url: 'https://dev.diagnosticafid.cl/public/api/aplicaciones/indexcomplementariabysedeid',
        crossDomain: true,
        dataType: 'json',
        data: {
            centrosaplicacion_id: $("#sede").val()
        },
        success: function (data, textStatus, jqXHR) {
            $.unblockUI();
            dep=data;
            
            listarDias(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    });
}

/*function informacionSede(){
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
}*/

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
        
        localStorage.sede = null;
    }
    
}

function removeDuplicateOptions(selectNode) {
    if (typeof selectNode === "string") {
    selectNode = document.getElementById(selectNode);
    }

    var seen = {},
    options = [].slice.call(selectNode.options),
    length = options.length,
    previous,
    option,
    value,
    text,
    i;

    for (i = 0; i < length; i += 1) {
    option = options[i];
    value = option.value,
    text = option.firstChild.nodeValue;
    previous = seen[value];
        if (typeof previous === "string" && text === previous) {
        selectNode.removeChild(option);
        } else {
        seen[value] = text;

        }
    }
}



function listarDias(response){
    
    for (var i = 0; i < response.length; i++) {
        var e= i+1;
        console.log(e)
        for (var j = 0; j < response[i].aplicacion.length; j++) {
            
            var fecha = "Día: "+moment(response[i].aplicacion[j].fecha_agendada).format("DD-MM-YYYY");
            
            
            $("#dia").append("<option value='" + fecha + "'>"+fecha + "</option>");
            removeDuplicateOptions("dia");

        }
    }
    if(localStorage.dia != 'undefined' && !isNaN(localStorage.dia)){
        $('#dia').val(localStorage.dia);
        //getDependencias();
        listarLaboratorios(response);
        localStorage.dia = null;
    }

}
function listarLaboratorios(response){
    
    

    for (var i = 0; i < dep.length; i++) {

        for (var j = 0; j < dep[i].aplicacion.length; j++) {
           
             if (response=="Día: "+moment(dep[i].aplicacion[j].fecha_agendada).format("DD-MM-YYYY")) {
                
                 $("#laboratorio").append("<option value='" + dep[i].id_laboratorio + "'>" +dep[i].nombre_laboratorio + "</option>");

             }
        }
    }
    if(localStorage.lab != 'undefined' && !isNaN(localStorage.lab)){
        $('#sede').val(localStorage.lab);
        //getDependencias();
        //listarLaboratorios(response);
        localStorage.lab = null;
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

function showmod(id){
    console.log(id.id)
    $("#"+id.id).modal('show');

}  

var respse;

function listerDependencias(response) {
    $("#divLabsDia1").empty();
    $("#divLabsDia2").empty();
    $("#divLabsDia3").empty();
    $("#divLabsDia4").empty();

    removerClases();

    //Nombres Dependencias
    for (var i = 0; i < response.length; i++) {
        
        //Aplicaciones
        for (var j = 0; j < response[i].aplicacion.length; j++) {
            console.log($("#laboratorio").val())
            //Día 
            var dia1=$("#dia").val();
            var dia2="Día: "+moment(response[i].aplicacion[j].fecha_agendada).format("DD-MM-YYYY");
            console.log(dia1+dia2)
            if($("#laboratorio").val()== response[i].id_laboratorio){
            if (dia1 == dia2) {
                console.log(response[i])
                $("#linkDia1").show();
                var idAplicacion = response[i].aplicacion[j].id_aplicacion;
                respse= response[i].aplicacion[j].id_aplicacion;
                getContingencias();
                getTipoContingencia();
                $("#divLabsDia1").append(
                    "<div class='panel-heading card-header sin-bordes'>" +
                        "<input type='hidden' id='idAplicacionDia1_" + j + "' value='" + response[i].aplicacion[j].id_aplicacion + "'>" +

                        "<h5 class='panel-title '>" +
                        "<a id='btn" + response[i].aplicacion[j].id_aplicacion + "' ><b class='_tex_mora'><i class='fas fa-desktop mr-1'></i> " + response[i].nombre_laboratorio + "  </b><button id='laboratorio_btn' type='button' class='btn btn-default _tex_mora' style='float: right; margin-top:-10px; border: 1px solid #715BCC;'onclick='showmod(confirmar_"+ response[i].aplicacion[j].id_aplicacion +");'><i class='fas fa-info-circle'></i></button></a>" +
                        "</h5>" +
                    "</div>" +

                            

                     "<div class='panel-body card sin-bordes' style='padding:10px;'>" +
                            "<div class='row mt-2 mb-2'>" +
                                "<div class='col-sm-12'>" +
                                
                                "</div>" +
                            "</div>" +

                             "<div class=''>" +
                                    `<select style='margin-top: -50px;text-align: center;margin-bottom: 54px;' class="form-control custom-select _tex_mora" name="selectbloque" id="selectbloque">
                                        <option class="_tex_mora" value="">Seleccione Bloque</option>
                                        <option class="_tex_mora" value="1">Bloque 1 - Prueba de Conocimientos Pedagógicos Generales</option>
                                        <option class="_tex_mora" value="2">Bloque 2 - Prueba de Conocimientos Disciplinarios y Didácticos</option>
                                    </select>`+
                                "</div>" +

                            "<div class='' hidden id='bloqueuno'>" +
                                "<div class=''>" +
                                    "<div class='row card-header sin-bordes' style='margin:0%; border-radius: 5px;'>" +
                                        "<div class='col-sm-4  pt-3'>" +
                                            "<label class='_tex_mora'><i class='fas fa-clock'> </i> Hora Inicio</label>" +
                                            "<div class='input-group clockpicker'>"+
                                                "<input type='text' class='form-control' disabled name='horaInicioBloque1_dia1_" + response[i].aplicacion[j].id_aplicacion + "' id='horaInicioBloque1_dia1_" + response[i].aplicacion[j].id_aplicacion + "'  value='" + (response[i].aplicacion[j].b1_hora_inicio == null ? '' : response[i].aplicacion[j].b1_hora_inicio.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                                                "<span class='input-group-addon'>"+
                                                "<span class='glyphicon glyphicon-time'></span>"+
                                                "</span>"+
                                            "</div>"+
                                            "<span class='error_show' id='formError_horaInicioBloque1_dia1_"+response[i].aplicacion[j].id_aplicacion+"'></span>"+
                                        "</div>" +

                                        "<div class='col-sm-4 pt-3'>" +
                                            "<label class='_tex_mora'><i class='fas fa-clock'> </i> Hora Termino</label>" +
                                            /*"<input type='time' name='horaTerminoBloque1_dia1_" + response[i].aplicacion[j].id + "' id='horaTerminoBloque1_dia1_" + response[i].aplicacion[j].id + "' class='form-control' value='" + response[i].aplicacion[j].hora_terminoB1 + "'>" +*/
                                            "<div class='input-group clockpicker'>"+
                                                "<input type='text' class='form-control' disabled name='horaTerminoBloque1_dia1_" + response[i].aplicacion[j].id_aplicacion + "' id='horaTerminoBloque1_dia1_" + response[i].aplicacion[j].id_aplicacion + "'  value='" + (response[i].aplicacion[j].b1_hora_termino == null ? '' : response[i].aplicacion[j].b1_hora_termino.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                                                "<span class='input-group-addon'>"+
                                                "<span class='glyphicon glyphicon-time'></span>"+
                                                "</span>"+
                                            "</div>"+
                                            "<span class='error_show' id='formError_horaTerminoBloque1_dia1_"+response[i].aplicacion[j].id_aplicacion+"'></span>"+
                                                            
                                        "</div>" +

                                        "<div class='col-sm-4 pt-3'>" +
                                            "<label class='_tex_mora' style='white-space: nowrap;'><i class='fas fa-user' > </i> Estudiantes Presentes</label>" +
                                            "<input type='text' disabled oninput='this.value=cantidadEstudiantes(this.value)' oninput='this.value=cantidadEstudiantes(this.value)' name='estudiantesPresentesBloque1_dia1_" + response[i].aplicacion[j].id_aplicacion + "' id='estudiantesPresentesBloque1_dia1_" + response[i].aplicacion[j].id_aplicacion + "' class='form-control' value='" + (response[i].aplicacion[j].b1_presentes == null ? '' :response[i].aplicacion[j].b1_presentes) + "'>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='row'>" +
                                        "<div class='col-sm-12 pt-4'>" +
                                            "<label class='_tex_mora'><i class='fas fa-comments'> </i> Observaciones Examinador</label>" +
                                            "<textarea rows='4' disabled class='form-control' name='observacionesBloque1_dia1_"+response[i].aplicacion[j].id_aplicacion+"' id='observacionesBloque1_dia1_"+response[i].aplicacion[j].id_aplicacion+"'>"+(response[i].aplicacion[j].b1_observaciones == null ? '' : response[i].aplicacion[j].b1_observaciones)+"</textarea>" +
                                            "<button hidden disabled id='laboratorio_btn1_"+response[i].aplicacion[j].id_aplicacion+"' type='button' class='btn ' style='float: right; margin-top:15px; background: #6850C9;color: #fff;'onclick='guardabloque(1);'><i class='fas fa-save'></i> Guardar Bloque 1</button>"+
                                        "</div>" +
                                    "</div>" +  
                                "</div>" +
                            "</div>" +

                            

                            "<div class='' hidden disabled id='bloquedos'>" +
                                "<div class=''>" +
                                    "<div class='row card-header sin-bordes' style='margin:2%; border-radius: 5px;'>" +
                                        "<div class='col-sm-4'>" +
                                            "<label class='_tex_mora'><i class='fas fa-clock'> </i> Hora Inicio</label>" +
                                            /*"<input type='time' name='horaInicioBloque2_dia1_" + response[i].aplicacion[j].id + "' id='horaInicioBloque2_dia1_" + response[i].aplicacion[j].id + "' class='form-control' value='" + response[i].aplicacion[j].hora_inicioB2 + "'>" +*/
                                            "<div class='input-group clockpicker'>"+
                                                "<input disabled type='text' class='form-control' name='horaInicioBloque2_dia1_" + response[i].aplicacion[j].id_aplicacion + "' id='horaInicioBloque2_dia1_" + response[i].aplicacion[j].id_aplicacion + "'  value='" + (response[i].aplicacion[j].b2_hora_inicio == null ? '' : response[i].aplicacion[j].b2_hora_inicio.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                                                "<span class='input-group-addon'>"+
                                                "<span class='glyphicon glyphicon-time'></span>"+
                                                "</span>"+
                                            "</div>"+
                                            "<span class='error_show' id='formError_horaInicioBloque2_dia1_"+response[i].aplicacion[j].id_aplicacion+"'></span>"+
                                        "</div>" +

                                        "<div class='col-sm-4'>" +
                                            "<label class='_tex_mora'><i class='fas fa-clock'> </i> Hora Termino</label>" +
                                            /*"<input type='time' name='horaTerminoBloque2_dia1_" + response[i].aplicacion[j].id + "' id='horaTerminoBloque2_dia1_" + response[i].aplicacion[j].id + "' class='form-control' value='" + response[i].aplicacion[j].hora_terminoB2 + "'>" +*/
                                            "<div class='input-group clockpicker'>"+
                                                "<input disabled type='text' class='form-control' name='horaTerminoBloque2_dia1_" + response[i].aplicacion[j].id_aplicacion + "' id='horaTerminoBloque2_dia1_" + response[i].aplicacion[j].id_aplicacion + "'  value='" + (response[i].aplicacion[j].b2_hora_termino == null ? '' : response[i].aplicacion[j].b2_hora_termino.slice(0,-3)) + "' onchange='validateHhMm(this);' oninput='this.value=hora(this.value)'>"+
                                                "<span class='input-group-addon'>"+
                                                "<span class='glyphicon glyphicon-time'></span>"+
                                                "</span>"+
                                            "</div>"+
                                            "<span class='error_show' id='formError_horaTerminoBloque2_dia1_"+response[i].aplicacion[j].id_aplicacion+"'></span>"+
                                        "</div>" +

                                        "<div class='col-sm-4'>" +
                                            "<label class='_tex_mora' style='white-space: nowrap;'><i class='fas fa-user' > </i> Estudiantes Presentes</label>" +
                                            "<input disabled type='text' oninput='this.value=cantidadEstudiantes(this.value)' oninput='this.value=cantidadEstudiantes(this.value)' name='estudiantesPresentesBloque2_dia1_" + response[i].aplicacion[j].id_aplicacion + "' id='estudiantesPresentesBloque2_dia1_" + response[i].aplicacion[j].id_aplicacion + "' class='form-control' value='" + (response[i].aplicacion[j].b2_presentes == null ? '' : response[i].aplicacion[j].b2_presentes) + "'>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='row'>" +
                                        "<div class='col-sm-12 pt-2'>" +
                                            "<label class='_tex_mora'><i class='fas fa-comments'> </i> Observaciones Examinador</label>" +
                                            "<textarea disabled rows='4' class='form-control' name='observacionesBloque2_dia1_"+response[i].aplicacion[j].id_aplicacion+"' id='observacionesBloque2_dia1_"+response[i].aplicacion[j].id_aplicacion+"'>"+(response[i].aplicacion[j].b2_observaciones == null ? '' : response[i].aplicacion[j].b2_observaciones)+"</textarea>" +
                                            "<button hidden disabled id='laboratorio_btn2_"+response[i].aplicacion[j].id_aplicacion+"' type='button' class='btn ' style='float: right; margin-top:15px; background: #6850C9;color: #fff;'onclick='guardabloque(2);'><i class='fas fa-save'></i> Guardar Bloque 2</button>"+
                                        "</div>" +
                                    "</div>" +  
                                "</div>" +
                        
                            "</div>" +

                            "<div id='superobs' class='col-sm-12 pt-2'  style='padding-left: 0px;padding-right: 0px;'>" +
                                "<label class='_tex_mora'><i class='fas fa-comments'> </i> Observaciones Supervisor</label>" +
                                "<textarea rows='4' class='form-control' name='observaciones_"+response[i].aplicacion[j].id_aplicacion+"' id='observaciones_"+response[i].aplicacion[j].id_aplicacion+"'>"+(response[i].aplicacion[j].observaciones_supervisor == null ? '' : response[i].aplicacion[j].observaciones_supervisor)+"</textarea>" +
                                "<button id='laboratorio_btn3_"+response[i].aplicacion[j].id_aplicacion+"' type='button' class='btn ' style='float: right; margin-top:15px; background: #6850C9;color: #fff;'onclick='guardabloque(3);'><i class='fas fa-save'></i> Guardar Observaciones</button>"+
                            "</div>" +
                            
                            /*"<div class='card-footer text-right sin-bordes bg-white'>"+
                                "<button type='button' class='btn btn-success' onclick='saveAplicacion( 1,"+response[i].aplicacion[j].id+");'><i class='fas fa-save'></i>Guardar</button>"+
                            "</div>"+*/
                            `<div class="modal fade" id="confirmar_`+response[i].aplicacion[j].id_aplicacion+`" tabindex="-1" role="dialog" aria-labelledby="confirmar" aria-hidden="true">
                              <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <h5 class="modal-title _tex_mora" id="exampleModalLabel"><i class="fas fa-desktop mr-1"></i>`+ response[i].nombre_laboratorio +`</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>
                                  <div class="modal-body">
                                       <div class='pt-3 pb-3 col-sm-12'>
                                            <div class='panel-body'>
                                                    <div class='pt-3 col-sm-12'>
                                                          <div class='row'>
                                                        <div class='col-sm-4'>
                                                            <label class='_tex_mora'><i class="fas fa-user"> </i> Encargado Apertura</label>
                                                            <h5 id='encargado_`+response[i].aplicacion[j].id_aplicacion +`'>`+(response[i].encargado_apertura == null ? '-' : response[i].encargado_apertura)+`</h5>
                                                        </div>
                                                        <div class='col-sm-4'>
                                                            <label class='_tex_mora'><i class="fas fa-phone"> </i> Teléfono Encargado</label>
                                                            <h5 id='telefonoEncargado_`+response[i].aplicacion[j].id_aplicacion +`'>`+(response[i].telefono_encargado_apertura == null ? '-' : response[i].telefono_encargado_apertura)+`</h5>
                                                        </div>
                                                        
                                                        <div class='col-sm-4'>
                                                            <label class='_tex_mora'><i class="fas fa-clock"> </i> Horario Apertura</label>
                                                            <h5 id='horarioApertura_`+response[i].aplicacion[j].id_aplicacion +`'>`+(response[i].acceso_desde_0730 == null ? '-' : response[i].acceso_desde_0730)+`</h5>
                                                        </div>
                                                    </div>
                                                    <div class='row pt-2'>
                                                        <div class='col-sm-6'>
                                                            <label class='_tex_mora'>Dirección</label>
                                                            <h5 id='encargado_`+response[i].aplicacion[j].id_aplicacion +`'>`+(response[i].direccion_lab == null ? '-' : response[i].direccion_lab)+`</h5>
                                                        </div>
                                                        
                                                    </div>
                                                    <div class='row pt-2'>
                                                        <div class='col-sm-12 pt-2'>
                                                            <label class='_tex_mora'><i class="fas fa-comments"> </i> Observaciones Visita Previa</label>
                                                            <h5 id='observacionesLab_`+response[i].aplicacion[j].id_aplicacion +`'>`+(response[i].observacion_visita == null ? '-' : response[i].observacion_visita)+`</h5>
                                                        </div>
                                                    </div>

                                                </div>    
                                            </div>
                                        </div>
                                  </div>
                                  <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                  </div>
                                </div>
                              </div>
                            </div>`+
                        "</div>"+
                        `<div  class="card sin-bordes mt-2 " hidden disabled id="cardSeccion1_`+response[i].aplicacion[j].id_aplicacion+`">
                                    <div class="card-body sin-bordes">
                                        <div class="row card-header sin-bordes  pr-0" id="infoLab_`+response[i].aplicacion[j].id_aplicacion+`">
                                            <div class="col-sm-12 text-right" style="display: flex;justify-content: right;">
                                             <label class='_tex_mora mr-2 pt-2' style="white-space: nowrap;">REGISTRO DE CONTINGENCIAS</label>   
                                             <a  type="button" class="btn btn-default no_separar" style="border: 1px solid #715BCC; color:#6850C9!important; justify-content: center;"  onclick="crearContingencia(`+response[i].aplicacion[j].id_aplicacion+`)"><i class="fas fa-plus"></i></a>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-12 p-0" style="overflow-x:auto;">
                                                <table class="table table-sm">
                                                    <thead class="text-left">
                                                    <tr style="background: #6850C9;color: #fff;">
                                                        <th style="width: 10%;">Hora</th>
                                                        <th>Contingencia</th>
                                                        <th>Descripción</th>
                                                        
                                                    </tr>
                                                    </thead>

                                                    <tbody class="table-bordered" style="background: #F6F5FB;" id="listaContingencias_`+response[i].aplicacion[j].id_aplicacion+`"></tbody>
                                                </table>
                                            </div>
                                        </div>

                                    </div>

                                    <div class="row mb-2" style="display: none;" id="mensajeGuardado_`+response[i].aplicacion[j].id_aplicacion+`">
                                        <div class="col-sm-4"></div>

                                        <div class="col-sm-4" id="divMensaj_`+response[i].aplicacion[j].id_aplicacion+`e" style="border-radius: 5px 5px 5px 5px;">
                                            <p id="mensaje" class="mt-1 text-white font-weight-bold"></p>
                                        </div>

                                        <div class="col-sm-4"></div>
                                    </div>
                                </div>

                                <div class="modal fade" id="modalContingencia_`+response[i].aplicacion[j].id_aplicacion+`" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel_`+response[i].aplicacion[j].id_aplicacion+`">Nueva Contingencia</h5>
                                                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>

                                            <div class="modal-body">
                                                <div class="row">
                                                    <div class="col-sm-12">
                                                        <label>Tipo</label>
                                                        <select class="form-control custom-select" id="tipoContingencia_`+response[i].aplicacion[j].id_aplicacion+`" name="tipoContingencia_`+response[i].aplicacion[j].id_aplicacion+`">
                                                            <option value="-1">Seleccione Tipo</option>
                                                            
                                                        </select>
                                                    </div>
                                                </div>


                                                <div class="row pt-2">
                                                    <div class="col-sm-12">
                                                        <label>Descripción</label>
                                                        <textarea class="form-control" rows="3" id="descripcionContingencia_`+response[i].aplicacion[j].id_aplicacion+`" name="descripcionContingencia_`+response[i].aplicacion[j].id_aplicacion+`"></textarea>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="modal-footer">
                                                <button class="btn btn-info" type="button" data-dismiss="modal"><i class="fas fa-times"></i>  Cancelar</button>
                                                <a class="btn btn-success" style="color:#fff;" onclick="nuevaContingencia()"><i class="fas fa-save"></i>  Guardar</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>`);
                        $("#superobs").attr("disabled", true);
                        $("#superobs").attr("hidden", true);

                     $("#selectbloque").change(function () {
                           if($('#selectbloque').val() == 1){
                                
                                $('#bloqueuno').removeAttr('hidden');
                                $('#bloqueuno').show();
                                $('#bloquedos').hide();
                            }
                            
                           if($('#selectbloque').val() == 2){
                                
                                $('#bloquedos').removeAttr('hidden');
                                $('#bloquedos').show();
                                $('#bloqueuno').hide();
                            } 
                        });
                     if(localStorage.getItem('supervisa')=="true"){
                        $("#superobs").attr("disabled", false);
                        $("#superobs").attr("hidden", false);
                        $("#cardSeccion1_" + response[i].aplicacion[j].id_aplicacion).prop('disabled', false);
                        $("#cardSeccion1_" + response[i].aplicacion[j].id_aplicacion).prop('hidden', false);
                     }

                     if(localStorage.getItem('examina')=="true"){
                        $("#horaInicioBloque1_dia1_" + response[i].aplicacion[j].id_aplicacion).prop('disabled', false);
                        $("#horaTerminoBloque1_dia1_" + response[i].aplicacion[j].id_aplicacion).prop('disabled', false);
                        $("#estudiantesPresentesBloque1_dia1_" + response[i].aplicacion[j].id_aplicacion).prop('disabled', false);
                        $("#observacionesBloque1_dia1_" + response[i].aplicacion[j].id_aplicacion).prop('disabled', false);
                        $("#laboratorio_btn1_" + response[i].aplicacion[j].id_aplicacion).prop('disabled', false);
                        $("#laboratorio_btn1_" + response[i].aplicacion[j].id_aplicacion).prop('hidden', false);

                        $("#horaInicioBloque2_dia1_" + response[i].aplicacion[j].id_aplicacion).prop('disabled', false);
                        $("#horaTerminoBloque2_dia1_" + response[i].aplicacion[j].id_aplicacion).prop('disabled', false);
                        $("#estudiantesPresentesBloque2_dia1_" + response[i].aplicacion[j].id_aplicacion).prop('disabled', false);
                        $("#observacionesBloque2_dia1_" + response[i].aplicacion[j].id_aplicacion).prop('disabled', false);
                        $("#laboratorio_btn2_" + response[i].aplicacion[j].id_aplicacion).prop('disabled', false);
                        $("#laboratorio_btn2_" + response[i].aplicacion[j].id_aplicacion).prop('hidden', false);
                       
                     }

                    $(".clockpicker").clockpicker({
                        placement: 'top',
                        autoclose: true,
                        donetext: 'Listo',

                    });
            }
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

var contin;

function getContingencias() {
    for (var i = 0; i < dep.length; i++) {
        
        //Aplicaciones
        for (var j = 0; j < dep[i].aplicacion.length; j++) {
            var dia1=$("#dia").val();
            var dia2="Día: "+moment(dep[i].aplicacion[j].fecha_agendada).format("DD-MM-YYYY");
            console.log(dia1+dia2)
             if (dia1 == dia2 ) {
                $.ajax({
                    method: 'GET',
                    url: 'https://dev.diagnosticafid.cl/public/api/laboratorio/indexlab',
                    crossDomain: true,
                    dataType: 'json',
                    data:{
                        idaplicacion: respse,
                        fechaaplicacion: dep[i].aplicacion[j].fecha_agendada
                    },
                    success: function (data, textStatus, jqXHR) {
                        console.log(data);
                        contin=data
                        listarContingencias(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                         $.unblockUI();
                        console.log(errorThrown)
                    }
                }); 
             }
        }
    }
   
}

function listarContingencias(response) {
 
    

    $("#listaContingencias_"+respse).empty();

    if (response['contingencias'].length > 0){
      
        for(var i = 0; i < response['contingencias'].length; i++){
            console.log(response['contingencias'])
            $("#listaContingencias_"+respse).append(
                "<tr>" +
                "<td>"+ moment(response['contingencias'][i].created_at).format("HH:MM") +" </td>" +
                "<td>"+ response['contingencias'][i].tipo_contingencia +" </td>" +
                "<td>"+ response['contingencias'][i].contingencia +"</td>" +
                
                "</tr>"
            );
 
        //$('#estado_'+i).val(response['contingencias'][i].id_tabla_maestra)
    }
    }else{

        $("#listaContingencias_"+respse).append(
            "<tr>" +
            "<td colspan='4'>No existen contigencias</td>" +
            "</tr>");
    }
    $('#infoLab').show();

    $.unblockUI();
    
}

function getTipoContingencia() {
    $.ajax({
        method: 'GET',
        url: 'https://dev.diagnosticafid.cl/public/api/laboratorio/indexbydiscriminador',
        crossDomain: true,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            console.log(data);
            listarTiposContingencia(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    });
}

function crearContingencia(response){
    console.log(response)
    $('#tipoContingencia_'+respse).val('-1')
    $('#descripcionContingencia_'+respse).val('')
    $('#modalContingencia_'+respse).modal('show');
}


function listarTiposContingencia(response) {
    for(var i = 0; i < response.length; i++){
        $("#tipoContingencia_"+respse).append("<option value='" + response[i].id_tabla_maestra + "'>" + response[i].descripcion_larga + "</option>");
    }
}

function verContingencias(idAplicacion,fechaAgendada) {
    localStorage.region = $('#selectRegion').val();
    localStorage.universidad = $('#universidad').val();
    localStorage.sede = $('#sede').val();

    location.href = 'contingenciasSupervisorComplementaria.php?idaplicacion='+idAplicacion+'&fecha='+fechaAgendada
}


function nuevaContingencia(){
    console.log(respse)
    $.blockUI({ message: '<img src="img/carga.svg">' });
    $('#modalContingencia_'+respse).modal('hide');
    var tipo = $('#tipoContingencia_'+respse).val()
    var descripcion = $('#descripcionContingencia_'+respse).val()
    var aplicaciones_id = respse
    
    $.ajax({
        method: 'POST',
        url: 'https://dev.diagnosticafid.cl/public/api/laboratorio/saveContingencia',
        crossDomain: true,
        dataType: 'json',
        data: {
            aplicaciones_id : aplicaciones_id,
            tipos_contingencia_id : tipo,
            contingencia : descripcion
        },
        success: function (data, textStatus, jqXHR) {
            getContingencias();
            console.log(data)
            $.blockUI({  baseZ: 2000, message: '<h5>La contingencia se almaceno exitosamente</h5>' });
            
        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    });

}

function guardabloque(id){
   var b1_h_i;
   var b1_h_t;
   var b1_p;
   var b1_ob;
   var b2_h_i;
   var b2_h_t;
   var b2_p;
   var b2_ob;
   if(id==1){
    var b1_h_i= $("#horaInicioBloque1_dia1_"+respse).val();
    var b1_h_t= $("#horaTerminoBloque1_dia1_"+respse).val();
    var b1_p= $("#estudiantesPresentesBloque1_dia1_"+respse).val();
    var b1_ob= $("#observacionesBloque1_dia1_"+respse).val();
    
   }
    if(id==2){
        
    var b2_h_i= $("#horaInicioBloque2_dia1_"+respse).val();
    var b2_h_t= $("#horaTerminoBloque2_dia1_"+respse).val();
    var b2_p= $("#estudiantesPresentesBloque2_dia1_"+respse).val();
    var b2_ob= $("#observacionesBloque2_dia1_"+respse).val();
    
    }
       
        
   

    $.blockUI({ message: '<img src="img/carga.svg">' });
    $.ajax({
        method: 'POST',
        url: 'https://dev.diagnosticafid.cl/public/api/laboratorio/saveBlock',
        crossDomain: true,
        dataType: 'json',
        data: {
            id: respse,
            b1_hora_inicio: b1_h_i,                 
            b1_hora_termino: b1_h_t,                    
            b1_presentes: b1_p,            
            b1_observaciones: b1_ob,

            b2_hora_inicio: b2_h_i,                  
            b2_hora_termino: b2_h_t,                    
            b2_presentes: b2_p,            
            b2_observaciones: b2_ob,

            observaciones_supervisor: $("#observaciones_" + respse).val()
        },
        success: function (data, textStatus, jqXHR) {
            if(data.resultado == 'ok'){

                $.blockUI({  baseZ: 2000, message: '<h5>Los datos han sido almacenados exitosamente</h5>' });
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