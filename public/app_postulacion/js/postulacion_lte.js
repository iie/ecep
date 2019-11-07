var contador = 0;
var regs=-1;
var regs1=-1;
var regs2=-1;
var regs3=-1;
var region_n = "";
var region_r = "";
var comunas_r = "";
var comunas_n = "";
var datosPost = "";
var valdoc1=null;
var valdoc2=null;
var valdoc3=null;
var valdoc4=null;
var doc1_b64=null;
var doc2_b64=null;
var doc3_b64=null;
var doc4_b64=null;
var usuario_global = null;

$(document).ready(function() {

    $("#loadRun").hide();
    $("#load_" + contador).hide();
    $("#otraInstitucionDiv").hide();
    $("#run").keypress(function(e) {
        if(e.which == 13) {
           
          comprobarRun();
          $( "#nombres" ).focus();
        }
      });
    $("#run").rut({
        formatOn:'input',
        minimunLength: 8,
        validateOn: 'change'
    })
    
    localStorage.clear();
    $("#cargoPostulacion").attr("disabled", true);
    $("#nombres").attr("disabled", true);
    $("#apellidoPaterno").attr("disabled", true);
    $("#apellidoMaterno").attr("disabled", true);
    $("#fecha_nacimiento").attr("disabled", true);
    $("#ciudadNacimiento").attr("disabled", true);
    $("#direccion_residencia").attr("disabled", true);
    $("#nacionalidad").attr("disabled", true);
    $("#sector_residencia").attr("disabled", true);
    $("#otraInstitucion").attr("disabled", true);
	$("#postula_examinador_apoyo").attr("disabled",true);
    $("#postulaExaminador").attr("disabled",true);
    $("#postulaSupervisor").attr("disabled",true);
    $("#postula_anfitrion").attr("disabled",true);
    $("#regionNacimiento").attr("disabled", true);
    $("#regionResidencia").attr("disabled", true);
    $("#comunaNacimiento").attr("disabled", true);
    $("#comuna_residencia").attr("disabled", true);
    $("#sexo").attr("disabled", true);
    $("#estadoCivil").attr("disabled", true);
    $("#correo_electronico_principal").attr("disabled", true);
    $("#telefono_principal").attr("disabled", true);
    $("#disponibilidad_horaria").attr("disabled",true);

    $("#nivel_estudios").attr("disabled", true);
    $("#universidad").attr("disabled", true);
    $("#profesion").attr("disabled", true);
    $("#region_Postulacion").attr("disabled",true);
    $("#comuna_postulacion").attr("disabled",true);
    /*$("#juevesChk").attr("disabled",true);
    $("#viernesChk").attr("disabled",true);*/
    $("#auto").attr("disabled", true);
    $("#licencia").attr("disabled", true);
    $("#claseLicencia").attr("disabled", true);
    $("#banco").attr("disabled", true);
    $("#tipoCuenta").attr("disabled", true);
    $("#numeroCuenta").attr("disabled", true);
    $("#documento_1").attr("disabled",true);
    $("#documento_2").attr("disabled",true);
    $("#documento_3").attr("disabled",true);
    $("#documento_4").attr("disabled",true);
    $("#btnGuardar").attr("disabled", true);
    $("#examinadorDVT").attr("disabled", true);
    $("#examinadorDA").attr("disabled", true);
    $("#btnPreGuardar").attr("disabled", true);
    //$("input").on('blur', verificarCamposVacios);
    //$("select").on('blur', verificarCamposVacios);
    getBancos();
    getRegionesNacimiento();
    getRegionesResidencia();
    getRegionesPostulacion();
    getUniversidades();

    $("#region_Postulacion").change(function() {
        $("#comuna_postulacion").empty();
        $("#comuna_postulacion").append("<option value=''>Seleccione Comuna</option>");
        getComunasPostulacion();
    });

    $("#regionNacimiento").change(function() {
        $("#comunaNacimiento").empty();
        $("#comunaNacimiento").append("<option value=''>Seleccione Comuna</option>");
        getComunasNacimiento();
    });

    $("#regionResidencia").change(function() {
        $("#comuna_residencia").empty();
        $("#comuna_residencia").append("<option value=''>Seleccione Comuna</option>");
        getComunasResidencia();
    });

    $("#universidad").change(function() {
        mostrarOtraInstitucion();
    });

    $("#nivel_estudios").change(function() {
        habilitarInstitucionTitulo();
    });
    
    $("#postula_examinador_apoyo").change(function() {
        $("#postula_examinador_apoyo").is(":checked") ? ($("#cardExamapp").attr("hidden", false),$("#examinadorDVT").attr("disabled", false),$("#examinadorDA").attr("disabled", false)) : ($("#cardExamapp").attr("hidden", true),$("#examinadorDVT").attr("disabled", true),$("#examinadorDA").attr("disabled", true));

    });
   // mostrarInstrucciones();

});



function mostrarInstrucciones() {
    var html =
        "<h4 class=''>Instrucciones</h4>" +
        "<ul class='list-group small'>" +
        "<li>Completa el siguiente formulario para postular.</li>" +
        "<li>Debes completar toda la información requerida antes de enviar tu postulación.</li>" +
        "</ul>";

    swal({
        title: '<p class="">Formulario de Postulación</p>',
        type: 'info',
        html: html,
        focusConfirm: false,
        confirmButtonText: 'Aceptar',
    });
}


function validate2(evt) {
  var theEvent = evt || window.event;

  // Handle paste
  if (theEvent.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
  } else {
  // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
  }

  var id = $(theEvent.target).attr("id");
  
  var regex ="";
  id=="profesion"? regex =  /[A-Za-zÁÉÍÓÚñáéíóúÑ\’\'\´\-\s]|\./ : regex =  /[A-Za-zÁÉÍÓÚñáéíóúÑ\’\'\´\-\s]|\./;
  
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}

function validate1(evt) {
  var theEvent = evt || window.event;

  // Handle paste
  if (theEvent.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
  } else {
  // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
  }
  var id = $(theEvent.target).attr("id");
  var regex ="";
  id=="telefono_principal"? regex = /[0-9]|\./ : regex =/[0-9--]|\./;
  
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}

function ValidateEmail() {
		var mailState=true
        var email = document.getElementById("correo_electronico_principal").value;
        var lblError = document.getElementById("lblError");
        lblError.innerHTML = "";
        var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (!expr.test(email)) {
            lblError.innerHTML = "";
            return mailState=false
        }else{
        	return mailState=true}
    }
var lblError1;
var comunas_postulacion=null;
function comunasNR(idComunaN, idComunaR, idcomunaPostula) {
    $.ajax({
        method: 'POST',
        url: webservice+'/regiones/idregionbyidcomuna',
        crossDomain: true,
        data: {
            id_comuna_n: idcomunaPostula,
            id_comuna_r: idComunaR,
        },
        success: function(data, textStatus, jqXHR) {
            
            //getRegionesNacimiento(data.descripcion.id_region_nacimiento);
            getRegionesResidencia(data.descripcion.id_region_residencia);
            getRegionesPostulacion(data.descripcion.id_region_nacimiento)
            comunas_n=idComunaN
            comunas_r=idComunaR
            comunas_postulacion=idcomunaPostula;
            llenarFormulario(datosPost)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //console.log(errorThrown);
            showFeedback("error","Server Error","Datos incorrectos");
            
        }
    });
}

function sub(){ 
    valdoc1=$("#documento_1").val() == "" ? null : 1;
    valdoc2=$("#documento_2").val() == "" ? null : 2;
    valdoc3=$("#documento_3").val() == "" ? null : 3;
    valdoc4=$("#documento_4").val() == "" ? null : 4;
    return  valdoc1, valdoc2, valdoc3, valdoc4
};

/*
const myPromise = new Promise(function(resolve, reject) {
  // Resolve with "Done!" after 5 seconds
  setTimeout(() => {
    // Doing some work here instead of resolving...
  }, 5000);
  resolve();
}).then(data => {
  //console.log(data); // This would be "undefined"
});*/

function ocultarCombo(){
    if($("#nacionalidad").val()=="Chilena"){
        $("#regionNacimiento").attr("hidden", false);
        $("#regionNacimientoTxt").attr("hidden", false);
        $("#comunaNacimiento").attr("hidden", false);

        $("#regionNacimiento").attr("disabled", false);
        $("#regionNacimientoTxt").attr("disabled", false);
        $("#comunaNacimiento").attr("disabled", false);
        
        
        $("#comunaNacimientotxt").text("Comuna de Nacimiento");
        $("#nacionalidadNacimientoTxt").attr("hidden", true);
        $("#nacionalidadNacimiento").attr("hidden", true);
        $("#comunaNacimientoOtra").attr("hidden", true);

        $("#nacionalidadNacimiento").attr("disabled", true);
        $("#comunaNacimientoOtra").attr("disabled", true);
    }else if($("#nacionalidad").val()=="Otra"){
        $("#regionNacimiento").attr("hidden", true);
        $("#regionNacimientoTxt").attr("hidden", true);
        $("#comunaNacimiento").attr("hidden", true);

        $("#regionNacimiento").attr("disabled", true);
        $("#regionNacimientoTxt").attr("disabled", true);
        $("#comunaNacimiento").attr("disabled", true);


        $("#comunaNacimientotxt").text("Lugar de Nacimiento");
        $("#nacionalidadNacimientoTxt").attr("hidden", false);
        $("#nacionalidadNacimiento").attr("hidden", false);
        $("#comunaNacimientoOtra").attr("hidden", false);

        $("#nacionalidadNacimiento").attr("disabled", false);
        $("#comunaNacimientoOtra").attr("disabled", false);
    }else{}
}

function comprobarRun() {
    

    
    localStorage.getItem("Run")==null? localStorage.setItem("Run", $("#run").val()):'';

    var runtest=$("#run").val()
    $("#four").removeAttr("onchange")
    if($.validateRut($("#run").val())){
        $("#loadRun").show();
            $("#compRun").html("Comprobando RUN");
            $("#compRun").addClass("small text-info");
            $("#compRun").html("");

        if ($("#run").val() == "" || $("#run").val() == null) {
           	
        } else {
            $.ajax({
                method: 'GET',
                url: './sources/personas.php',
                crossDomain: true,
                dataType: 'json',
                data: {
                    run: $("#run").val()
                },
                success: function(data, textStatus, jqXHR) {
                    $("#loadRun").hide();
                    $("#compRun").html("");
                    $("#nacionalidad").val("")
                    if (data[0] == undefined) {
                        localStorage.getItem("Run")==null? localStorage.setItem("Run", $("#run").val()):'';
                        if(document.getElementById('nombres').getAttribute('disabled')!=null){
                            cleandat()
                        }
                        $("#nacionalidad").val("");
                        rutNuevo()
                        
                        
                   
                    } else {
                        if (data[0].modificado==true) {
                            $('#noupdate1').modal('show');
                            disableds()
                            cleandat()
                        } else {
                            usuario_global = data[0].usuario;
                            if(datosch==true){
                                rutIngresado()
                            }else{ datosPost = data;
                                $("#nacionalidad").val(data[0].nacionalidad)

                                comunasNR(data[0].id_comuna_nacimiento, data[0].id_comuna_residencia, data[0].id_comuna_postulacion);
                                getUniversidades(data[0].id_institucion) }
                        }   
                       

                        

                    }
                   
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    //console.log(errorThrown);
                }
            });
        }
    }else{
        showFeedback("error","Favor ingresar run valido","Datos incorrectos");
        datosch=false
        cleandat() 
        disableds()
    }
    
}



var datosch=false;
var datoscambiados=false;
function validarCambiodatos(evt) {
  var theEvent = evt || window.event;

  // Handle paste
  if (theEvent.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
  } else {
  // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
  }
  var id = $(theEvent.target).attr("id");
  
  id=="run"? "" :  (datosch =true, datoscambiados=true);
  
  return datosch,datoscambiados;
}

var idcambiado="";
function validarCambiodatos2(evt) {
  var theEvent = evt || window.event;

  // Handle paste
  if (theEvent.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
  } else {
  // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
  }
  var id = $(theEvent.target).attr("id");
  datoscambiados==true?(idcambiado=id,guardaUsuarioPrev()):idcambiado=null;
  console.log(idcambiado);
   
}
function guardaUsuarioPrev(){
    // var arc1 = doc1_b64 != null ? doc1_b64 : null;
    // var arc2 = doc2_b64 != null ? doc2_b64 : null;
    // var arc3 = doc3_b64 != null ? doc3_b64 : null;
    var arc4 = doc4_b64 != null ? doc4_b64 : null;
    
    var t_json = '{"cedula_identidad" : null,' +
                '"curriculum" : null,' +
                '"certificado_antecedentes" : null,' +
                '"certificado_titulo" : "' + arc4 + '"' +
                '}';
    
    var runp= $("#run").val()

    runp= runp.replace(/\./g,'')
    $.blockUI({ message: 'Enviando datos al servidor. Espere un momento...' });  
    $.ajax({
    method: 'POST',
    url: webservice+'/usuarios/saveusuariolites',
    crossDomain: true,
    headers: {
        '_token': $("#_token")
    },

    data: {
        idcambiado:$('#'+idcambiado).val()
    },
            
    
    
    success: function(data, textStatus, jqXHR) {
        $.unblockUI();
        datoscambiados=false;
        showFeedback("success","Postulación enviada con éxito.");
        
        },
    error: function(jqXHR, textStatus, errorThrown) {
        $.unblockUI();
        //console.log(errorThrown);
        showFeedback("error",errorThrown,"Error al realizar el envío de informacion");
    }
    });
   
}

function rutNuevo(){
    $("#compRun").removeClass();
    $("#compRun").html("El RUN ingresado no se encuentra en el sistema de postulación. Por favor complete sus datos para postular.");
    $("#compRun").addClass("small _text-green");
    enableds()
    var runguardado = localStorage.getItem("Run");
    var runguardado1 = localStorage.getItem("segrun");
    if (runguardado==$("#run").val()){
        datosch==true?$('#consultarrut2').modal('show'):''
        if(runguardado1!=null){if(runguardado1==$("#run").val()) {
            //console.log("")
        } else {  
            if (datosch==true) {$('#consultarrut2').modal('show'); }else{ cleandat()}
        }
            }

    } else {

        //console.log("")
          if (datosch==true) {$('#consultarrut2').modal('show'); }else{ cleandat()}
        
    }

}

function rutIngresado(){
   
    enableds()
    var runguardado = localStorage.getItem("Run");
    var runguardado1 = localStorage.getItem("segrun");
    if (runguardado1==$("#run").val()){
        
        if(runguardado!=null){if(runguardado==$("#run").val()) {} else {  
            //datosch==true?$('#consultarrut2').modal('show'):cleandat()
             if (datosch==true) {$('#consultarrut3').modal('show'); }else{ cleandat()}
        }}

    } else {

            if (datosch==true) {$('#consultarrut3').modal('show'); }else{ cleandat()}
          //datosch==true?$('#consultarrut2').modal('show'):cleandat()
        
    }

}

function cancell() {
    var runguardado = localStorage.getItem("Run");
    var runguardado1 = localStorage.getItem("segrun");
    if(runguardado1==null){
        $("#run").val(runguardado) 
    }else{ $("#run").val(runguardado1)}

}

function rlimpiar(){
        datosch=false;
        cleandat();
         $('#consultarrut2').modal('hide')
        localStorage.setItem("Run", $("#run").val());      
}

function llimpiaar() {
    datosch=false;
    localStorage.setItem("Run", ""); 
   comprobarRun();
    $('#consultarrut3').modal('hide')
}

function llenarFormulario(data){

        localStorage.getItem("segrun")==null? localStorage.setItem("segrun", $("#run").val()):'';
        
       
        var dispob = data[0].disponibilidad_horaria==null?"nope":JSON.parse(data[0].disponibilidad_horaria);
        
        enableds()
        ocultarCombo()
        $("#compRun").removeClass();
        $("#compRun").html("El RUN ingresado ya se encuentra en el sistema de postulación. Si es necesario actualice sus datos y envíe su postulación.");
        $("#compRun").addClass("small _text-red");
        $("#nombres").val(data[0].nombres);
        $("#apellidoPaterno").val(data[0].apellido_paterno);
        $("#apellidoMaterno").val(data[0].apellido_materno);
        $("#fecha_nacimiento").val(data[0].fecha_nacimiento);
        $("#direccion_residencia").val(data[0].domicilio);
        $("#nacionalidad").val(data[0].nacionalidad);

        $("#nacionalidadNacimiento").val(data[0].otra_nacionalidad);
        $("#comunaNacimientoOtra").val(data[0].otro_lugar_nacimiento);
        
        lblError1=data[0].edicion;

        $("#sector_residencia").val(data[0].domicilio_sector);
        $("#sexo").val(data[0].id_sexo);
        $("#estadoCivil").val(data[0].id_estado_civil);
        $("#correo_electronico_principal").val(data[0].email);
        $("#telefono_principal").val(data[0].telefono);
        if ($("#universidad").val()==1000) {
            $("#otraInstitucionDiv").show(), $("#otraInstitucion").attr("disabled", false)
            getUniversidades(data[0].id_institucion)
            $("#otraInstitucion").val(data[0].universidad)
        } else {

        }
        var estlvl= data[0].nivel_estudios;
            if (estlvl =="Estudiante Educación Media") {$("#nivel_estudios").val(1)}
                else if(estlvl =="Educación Media Incompleta") {$("#nivel_estudios").val(2)}
                    else if (estlvl=="Educación Media Completa"){$("#nivel_estudios").val(3)}
                        else if(estlvl=="Estudiante Educación Superior") {$("#nivel_estudios").val(4); habilitarInstitucionTitulo();getUniversidades(data[0].id_institucion) }
                            else if(estlvl=="Educación Superior Incompleta") {$("#nivel_estudios").val(5); habilitarInstitucionTitulo();getUniversidades(data[0].id_institucion)}
                                else if(estlvl=="Educación Superior Completa"){$("#nivel_estudios").val(6); habilitarInstitucionTitulo();getUniversidades(data[0].id_institucion)}
                                    else if(estlvl=="Estudiante Postgrado"){$("#nivel_estudios").val(7); habilitarInstitucionTitulo();getUniversidades(data[0].id_institucion)}
                                        else if(estlvl=="Postgrado Incompleto"){$("#nivel_estudios").val(8); habilitarInstitucionTitulo();getUniversidades(data[0].id_institucion)}
                                            else if(estlvl=="Postgrado Completo"){$("#nivel_estudios").val(9); habilitarInstitucionTitulo();getUniversidades(data[0].id_institucion)}
                                                else{}    
        $("#profesion").val(data[0].profesion);
        data[0].id_institucion==1000?getUniversidades(data[0].id_institucion):getUniversidades()
        data[0].postula_examinador_apoyo ==true ? document.getElementById("postula_examinador_apoyo").checked = true : document.getElementById("postula_examinador_apoyo").checked = false
        data[0].postula_examinador ==true ? document.getElementById("postulaExaminador").checked = true :  document.getElementById("postulaExaminador").checked = false
        data[0].postula_supervisor ==true ? document.getElementById("postulaSupervisor").checked = true :  document.getElementById("postulaSupervisor").checked = false
        data[0].postula_anfitrion ==true ? document.getElementById("postula_anfitrion").checked = true :  document.getElementById("postula_anfitrion").checked = false
        
        $("#postula_examinador_apoyo").is(":checked") ? ($("#cardExamapp").attr("hidden", false),$("#examinadorDVT").attr("disabled", false),$("#examinadorDA").attr("disabled", false)) : ($("#cardExamapp").attr("hidden", true),$("#examinadorDVT").attr("disabled", true),$("#examinadorDA").attr("disabled", true));

        data[0].apoyo_discapacidad_visual == true ? $('#examinadorDVT').prop('checked', true) : $('#examinadorDVT').prop('checked', false);
        data[0].apoyo_discapacidad_auditiva == true ? $('#examinadorDA').prop('checked', true): $('#examinadorDA').prop('checked', false);
        //data[0].licencia_clase==true ? (document.getElementById("licencia").checked = true,  habilitarConduccion(), $("#claseLicencia").val(data[0].licencia_clase))   : document.getElementById("licencia").checked = false
        //data[0].automovil==true?document.getElementById("auto").checked = true: document.getElementById("auto").checked = false
        getBancos(data[0].banco_nombre);
        var tipCuenta = data[0].banco_tipo_cuenta
        if (tipCuenta=="Cuenta Corriente") {$("#tipoCuenta").val(1)} 
            else if(tipCuenta=="Cuenta Vista/Rut"){$("#tipoCuenta").val(2)}
                else if(tipCuenta=="Cuenta de Ahorro"){$("#tipoCuenta").val(3)}
                    else if(tipCuenta=="Chequera Electrónica"){$("#tipoCuenta").val(4)}
                        else{}
        $("#numeroCuenta").val(data[0].banco_nro_cuenta);
        regs = data[0].archivos.cedula_identidad
        regs1 = data[0].archivos.curriculum
        regs2 = data[0].archivos.certificado_antecedentes
        regs3 = data[0].archivos.certificado_titulo 
        console.log("UNO   :"+regs+"DOS  :"+regs1+"TRES  :"+regs2+"CUAtRO  :"+regs3)
       	regs==null?($("#mensajeUpload_1").text("") , regs=-1) : $("#mensajeUpload_1").text("Cédula de Identidad Ingresada")
        regs1==null?($("#mensajeUpload_2").text("") , regs1=-1) : $("#mensajeUpload_2").text("Currículum Vitae  Ingresado")
        regs2==null?($("#mensajeUpload_3").text("") , regs2=-1) : $("#mensajeUpload_3").text("Certificado de Antecedentes  Ingresado")
        regs3==null?($("#mensajeUpload_4").text("") , regs3=-1) : $("#mensajeUpload_4").text("Certificado de Título Ingresado")
        datosch=false;
        return regs, regs1 , regs2, regs3, lblError1;
    
}


function enableds() {

    $("#btnPreGuardar").attr("disabled", false);
    $("#region_Postulacion").attr("disabled",false);
    $("#comuna_postulacion").attr("disabled",false);
	$("#cargoPostulacion").attr("disabled", false);
    $("#nombres").attr("disabled", false);
    $("#apellidoPaterno").attr("disabled", false);
    $("#apellidoMaterno").attr("disabled", false);
    $("#fecha_nacimiento").attr("disabled", false);
    $("#ciudadNacimiento").attr("disabled", false);
    $("#direccion_residencia").attr("disabled", false);
    $("#nacionalidad").attr("disabled", false);
    $("#regionNacimiento").attr("disabled", false);
    $("#regionResidencia").attr("disabled", false);
	$("#sector_residencia").attr("disabled", false);
	$("#comunaNacimiento").attr("disabled", false);
    $("#comuna_residencia").attr("disabled", false);
    $("#sexo").attr("disabled", false);
    $("#estadoCivil").attr("disabled", false);
    $("#correo_electronico_principal").attr("disabled", false);
    $("#telefono_principal").attr("disabled", false);
    $("#nivel_estudios").attr("disabled", false);
    $("#postula_examinador_apoyo").attr("disabled",false);
    $("#postulaExaminador").attr("disabled",false);
    $("#postulaSupervisor").attr("disabled",false);
    $("#postula_anfitrion").attr("disabled",false);
    $("#licencia").attr("disabled", false);
    $("#banco").attr("disabled", false);
    $("#tipoCuenta").attr("disabled", false);
    $("#numeroCuenta").attr("disabled", false);
    $("#disponibilidad_horaria").attr("disabled",false);
	$("#btnGuardar").attr("disabled", false);
    $("#documento_1").attr("disabled",false);
    $("#documento_2").attr("disabled",false);
    $("#documento_3").attr("disabled",false);
    $("#documento_4").attr("disabled",false);
    $("#mensajeUpload_1").attr("hidden",false)
    $("#mensajeUpload_2").attr("hidden",false)
    $("#mensajeUpload_3").attr("hidden",false)
    $("#mensajeUpload_4").attr("hidden",false)
   /* $("#martesChk").attr("disabled",false);
    $("#miercolesChk").attr("disabled",false);
    $("#juevesChk").attr("disabled",false);
    $("#viernesChk").attr("disabled",false);*/
}

function cleandat() {
    valdoc4=null;
    regs3=-1;
    $("#region_Postulacion").val("");
    $("#comuna_postulacion").val("");
    $("#nombres").val("");
    $("#apellidoPaterno").val("");
    $("#apellidoMaterno").val("");
    $("#fecha_nacimiento").val("");
    $("#direccion_residencia").val("");
    $("#nacionalidad").val("");
    $("#sector_residencia").val("");
    $("#sexo").val("");
    $("#estadoCivil").val("");
    $("#correo_electronico_principal").val("");
    $("#telefono_principal").val("");
    $("#nivel_estudios").val("")
    $("#profesion").val("");
    document.getElementById("postula_examinador_apoyo").checked = false
    document.getElementById("postulaExaminador").checked = false
    document.getElementById("postulaSupervisor").checked = false
    document.getElementById("postula_anfitrion").checked = false
    /*document.getElementById("martesChk").checked = false
    document.getElementById("miercolesChk").checked = false
    document.getElementById("juevesChk").checked = false
    document.getElementById("viernesChk").checked = false*/
    habilitarConduccion()
    $("#claseLicencia").val("")
    // document.getElementById("licencia").checked = false
    // document.getElementById("auto").checked = false
    $("#universidad").val(1)
    $("#otraInstitucionDiv").hide()
    $("#otraInstitucion").attr("disabled", true) 
    $("#otraInstitucion").val("")
    $("#profesion").attr("disabled", true);
    $("#banco").val("")
    $("#tipoCuenta").val("")
    $("#numeroCuenta").val("");
    $("#disponibilidad_horaria").val("");
    $("#regionNacimiento").val("")
    $("#regionResidencia").val("")
    $("#comunaNacimiento").empty().append('Seleccionar Comuna');
    $("#comuna_residencia").empty().append('Seleccionar Comuna');
    $("#documento_1").val("")
    $("#documento_2").val("")
    $("#documento_3").val("")
    $("#documento_4").val("")
    $("#comunaNacimientoOtra").val("")
    $("#nacionalidadNacimiento").val("")
    habilitarInstitucionTitulo()
    habilitarConduccion()
    localStorage.clear();
    $("#mensajeUpload_1").attr("hidden",true)
    $("#mensajeUpload_1").val("")
    $("#mensajeUpload_2").attr("hidden",true)
    $("#mensajeUpload_2").val("")
    $("#mensajeUpload_3").attr("hidden",true)
    $("#mensajeUpload_3").val("")
    $("#mensajeUpload_4").attr("hidden",true)
    $("#mensajeUpload_4").val("")
}

function disableds() {
    $("#btnPreGuardar").attr("disabled", true);
    $("#region_Postulacion").attr("disabled",true);
    $("#comuna_postulacion").attr("disabled",true);
	$("#cargoPostulacion").attr("disabled", true);
	$("#nombres").attr("disabled", true);
	$("#apellidoPaterno").attr("disabled", true);
	$("#apellidoMaterno").attr("disabled", true);
	$("#fecha_nacimiento").attr("disabled", true);
	$("#ciudadNacimiento").attr("disabled", true);
	$("#direccion_residencia").attr("disabled", true);
	$("#nacionalidad").attr("disabled", true);
	$("#sector_residencia").attr("disabled", true);
    $("#regionNacimiento").attr("disabled", true);
	$("#regionResidencia").attr("disabled", true);
	$("#comunaNacimiento").attr("disabled", true);
	$("#comuna_residencia").attr("disabled", true);
	$("#sexo").attr("disabled", true);
	$("#estadoCivil").attr("disabled", true);
	$("#correo_electronico_principal").attr("disabled", true);
	$("#telefono_principal").attr("disabled", true);
	$("#nivel_estudios").attr("disabled", true);
	$("#universidad").attr("disabled", true);
	$("#profesion").attr("disabled", true);
	$("#licencia").attr("disabled", true);
	$("#banco").attr("disabled", true);
	$("#tipoCuenta").attr("disabled", true);
	$("#numeroCuenta").attr("disabled", true);
	$("#disponibilidad_horaria").attr("disabled",true);
	$("#btnGuardar").attr("disabled", true);
	$("#postula_examinador_apoyo").attr("disabled",true);
	$("#postulaExaminador").attr("disabled",true);
	$("#postulaSupervisor").attr("disabled",true);
	$("#postula_anfitrion").attr("disabled",true);
    $("#documento_1").attr("disabled",true);
    $("#documento_2").attr("disabled",true);
    $("#documento_3").attr("disabled",true);
    $("#documento_4").attr("disabled",true);
    /*$("#martesChk").attr("disabled",true);
    $("#miercolesChk").attr("disabled",true);
    $("#juevesChk").attr("disabled",true);
    $("#viernesChk").attr("disabled",true);*/
    $("#comunaNacimientoOtra").attr("disabled",true);
    $("#nacionalidadNacimiento").attr("disabled",true);
}

function Rut(string){
    var out = '';
    var filtro = '1234567890kK';
    
    for (var i=0; i<string.length; i++){
        if (filtro.indexOf(string.charAt(i)) != -1){ 
            if(out.length < 9){
                out += string.charAt(i);
            }
        }
    }
    return out;
}

function showFeedback(type, message, title) {

    toastr[type](message, title);
}



//toastr
function initToastr() {

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
}

function validar() {
        //obteniendo el valor que se puso en el campo text del formulario
       var resultado = true;
    	var infra = 0;
    	texto_infra = "";
        var mails=ValidateEmail()
       

        $("input[id='nombres']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            resultado = false
            
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
            
        }
        })

        $("input[id='apellidoPaterno']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            resultado = false
           
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
            
        }
        })

        $("input[id='apellidoMaterno']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            resultado = false
           
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
            
        }
        })

        

        $("input[id='direccion_residencia']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            resultado = false
            
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
            
        }
        })

        $("input[id='sector_residencia']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            resultado = false
           
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
            
        }
        })

        $("input[id='telefono_principal']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            resultado = false
            
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
            
        }
        })

        $("input[id='fecha_nacimiento']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined )) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            resultado = false
            
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
            
        }
        })


    	$("select").each(function() {
        if (this.id!="banco"&&this.id!="tipoCuenta"&&this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            
            resultado = false
            //this.id=="banco"?$(this).removeClass('div_is-invalid'):this.id=="tipoCuenta"?$(this).removeClass('div_is-invalid'):resultado = false;
        }else{
        	$(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
           
            
        }
    	})
        /*$("select[id='universidad']").each(function() {
        if (this.disabled == false && (this.value == "1" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            resultado = false
           
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
            
        }
        })*/
    	
    	if (mails==false) {
            $("#correo_electronico_principal").addClass('div_is-invalid')
    		resultado = false
            console.log("correo_electronico_principal")
    	}else{
            $("#correo_electronico_principal").removeClass('div_is-invalid')  
    	}

    	

        if ($("input[id='postula_examinador_apoyo']:checked").length == 0 && $("input[id='postulaExaminador']:checked").length == 0 && $("input[id='postulaSupervisor']:checked").length == 0 && $("input[id='postula_anfitrion']:checked").length == 0) {
            //$("button[name='b_r2']").addClass('is-invalid_check')
             $("#chkpostu").addClass('div_is-invalid')
            resultado = false
            infra++;
            texto_infra += "<li>A 2</li>"
            
        }else{
            $("#chkpostu").removeClass('div_is-invalid') 
            
            
        }
        if(!$("#examinadorDVT").is(":hidden")){
        if ($("input[id='examinadorDVT']:checked").length == 0 && $("input[id='examinadorDA']:checked").length == 0) {
            //$("button[name='b_r2']").addClass('is-invalid_check')
             $("#chkexamap").addClass('div_is-invalid')
            resultado = false
            infra++;
            texto_infra += "<li>A 2</li>"
            
        }else{
            $("#chkexamap").removeClass('div_is-invalid') 
            
            
        }
        }
        /*if ($("input[id='martesChk']:checked").length == 0 && $("input[id='miercolesChk']:checked").length == 0 && $("input[id='juevesChk']:checked").length == 0 && $("input[id='viernesChk']:checked").length == 0) {
            //$("button[name='b_r2']").addClass('is-invalid_check')
             $("#chkdispo").addClass('div_is-invalid')
            resultado = false
            infra++;
            texto_infra += "<li>A 2</li>"
            
        }else{
            $("#chkdispo").removeClass('div_is-invalid') 
            
            
        }*/

        /* licencia req
        if ($("input[id='licencia']:checked").length == 0) {
            //$("button[name='b_r2']").addClass('is-invalid_check')
             $("#missLC").addClass('div_is-invalid')
            resultado = false
            infra++;
            texto_infra += "<li>A 2</li>"
            //console.log("funcionomal")
        }else{
            $("#missLC").removeClass('div_is-invalid') 
            //console.log("licencia fail")
        }
        $("textarea").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.id+"</li>"
            resultado = false
           
        }else{
        	$(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
            
        }
    	})*/

        
       /* $("input[id='documento_1']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
           if(regs==-1){ $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            resultado = false}else{ $(this).removeClass('div_is-invalid')}
           
           
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
            
        }
        })

        $("input[id='documento_2']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            if(regs1==-1){ $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            resultado = false}else{ $(this).removeClass('div_is-invalid')}
             
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
           
        }
        })

        $("input[id='documento_3']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            if(regs2==-1){ $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            resultado = false}else{ $(this).removeClass('div_is-invalid')}
             
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
           
        }
        })*/

        $("input[id='documento_4']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            if(regs3==-1){ $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            resultado = false}else{ $(this).removeClass('div_is-invalid')}
             console.log("doc 4")
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
           
        }
        })

        /*$("input[id='nacionalidadNacimiento']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            resultado = false;
             
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
           
        }
        })

       $("input[id='comunaNacimientoOtra']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            texto_infra += "<li>"+this.name+"</li>"
            resultado = false;
             
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
           
        }
        })*/

        if (resultado==false){
        	showFeedback("error"," Complete los datos marcados en rojo","Favor completar datos");
        	
        }else{
        	

        }

        return resultado;
    }


function saveUsuario() {
 var testv = validar()
    //$.blockUI({ message: '<img src="img/carga2.svg"><br><span class="fuente-gob-bold">Enviando Postulación, espere...</span>' });
    if (testv==true) {
    	$('#datosFaltantes').modal('show')
    	} else {
        $('#datosFaltantes').modal('hide')
    }
}

function guardarConfirm() {
       /* var ma=$("#martesChk").is(":checked") ? "true" : "false" 
        var mi=$("#miercolesChk").is(":checked") ? "true" : "false"
        var ju=$("#juevesChk").is(":checked") ? "true" : "false"
        var vi=$("#viernesChk").is(":checked") ? "true" : "false"*/
        
        $('#datosFaltantes').modal('hide')
/*        valdoc1 == null ? null : encodeDocumento(valdoc1);
        valdoc2 == null ? null : encodeDocumento(valdoc2);
        valdoc3 == null ? null : encodeDocumento(valdoc3);*/
        console.log(regs3)
        console.log(valdoc4)
        valdoc4 == null ? null : encodeDocumento(valdoc4);
         
        //valdoc4 == null ? null : encodeDocumento(valdoc4);
        
        let esperarSubida = new Promise((resolve, reject) => {
          $.blockUI({ message: 'Procesando archivos. Espere un momento...' });  
          setTimeout(function(){
            if(valdoc4 != null){
                if(doc4_b64 == null){
                    reject("Archivo 4 mal subido");
                }
            }
            resolve(true);
          }, 3000);
        });

        esperarSubida.then((successMessage) => {
            $.unblockUI();
            if(successMessage == true){
                guardaUsuario();
            }
        })
        .catch(
            function(reason) {
                $.unblockUI();
                /* TODO: En caso de fallar mostrar alerta y permitir reintentar*/
                console.log('Sin éxito: ('+reason+').');
        });
}

function guardaUsuario(){
    // var arc1 = doc1_b64 != null ? doc1_b64 : null;
    // var arc2 = doc2_b64 != null ? doc2_b64 : null;
    // var arc3 = doc3_b64 != null ? doc3_b64 : null;
    var arc4 = doc4_b64 != null ? doc4_b64 : null;
    
    arc4 ==null?arc4 =':' + null:arc4 =':"' + arc4 + '"';
            
    var t_json = '{"cedula_identidad" : null,' +
                        '"curriculum" : null,' +
                        '"certificado_antecedentes" : null,' +
                        '"certificado_titulo" ' + arc4  +
                        '}';
    
    var runp= $("#run").val()
    runp= runp.replace(/\./g,'')
    $.blockUI({ message: 'Enviando datos al servidor. Espere un momento...' });  
    $.ajax({
    method: 'POST',
    url: webservice+'/usuarios/saveusuariolite',
    crossDomain: true,
    headers: {
        '_token': $("#_token")
    },

    data: {
        usuario: usuario_global,
        run: runp || null,
        postula_examinador: $("#postulaExaminador").is(":checked") ? true : false,
        postula_supervisor: $("#postulaSupervisor").is(":checked") ? true : false,
        postula_anfitrion: $("#postula_anfitrion").is(":checked") ? true : false,
        postula_examinador_apoyo: $("#postula_examinador_apoyo").is(":checked") ? true : false,
        modificado: 1,

        nombres: $("#nombres").val(),
        apellido_paterno: $("#apellidoPaterno").val(),
        apellido_materno: $("#apellidoMaterno").val(),
        fecha_nacimiento: moment($("#fecha_nacimiento").val()).format('DD/MM/YYYY'),
        id_comuna_nacimiento: $("#nacionalidad").val()=="Chilena"?$("#comunaNacimiento").val():null,
        id_comuna_residencia: $("#comuna_residencia").val(),
        id_comuna_postulacion: $("#comuna_postulacion").val(),
        id_sexo: $("#sexo").val(),
        correo_electronico_principal: $("#correo_electronico_principal").val(),
        telefono_principal: $("#telefono_principal").val(),
        id_usuario: $("#idUsuario").val(),
        nivel_estudios: $("#nivel_estudios :selected").text(),
        profesion: $("#profesion").val(),
        apoyo_visual: $("#examinadorDVT").is(":checked") ? true : false,
        apoyo_auditivo: $("#examinadorDA").is(":checked") ? true : false,
        json_archivos: t_json
    },
            
    
    
    success: function(data, textStatus, jqXHR) {
        $.unblockUI();
        datosch=false;
        if (data.respuesta == "ok") {
            showFeedback("success","Postulación enviada con éxito.");
            usuario_global = null;
        disableds()
        } else {
            showFeedback("error", data.descripcion, "Datos no enviados: ");enableds();
            if (data.descripcion=="Ya existe un usuario registrado con el correo enviado.") {
                $("#correo_electronico_principal").addClass('div_is-invalid')}
            }
        },
    error: function(jqXHR, textStatus, errorThrown) {
        $.unblockUI();
        //console.log(errorThrown);
        showFeedback("error",errorThrown,"Error al realizar el envío de informacion");
    }
    });
   disableds()
}

function validaGuardaPrev(){
    var resultado2=true;
        var mails=ValidateEmail()
        $("input[id='nombres']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            
            resultado = false
             
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
            
        }
        })

        $("input[id='apellidoPaterno']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            
            resultado2 = false
            
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
            
        }
        })

        $("input[id='apellidoMaterno']").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).addClass('div_is-invalid')
            
            resultado2 = false
            
        }else{
            $(this).removeClass('div_is-invalid')
            //$(this).removeClass('is-invalid')
            
        }
        })
        
        if (mails==false) {
            $("#correo_electronico_principal").addClass('div_is-invalid')
            resultado2 = false
             
        }else{
            $("#correo_electronico_principal").removeClass('div_is-invalid')  
        }
        console.log(resultado2)
        if (resultado2==false){
            showFeedback("error"," Complete los datos marcados en rojo","Favor completar datos");
            
        }else{
            guardarConfirm2()
        }
}

function guardarConfirm2() {
    console.log(valdoc4)
       /* var ma=$("#martesChk").is(":checked") ? "true" : "false" 
        var mi=$("#miercolesChk").is(":checked") ? "true" : "false"
        var ju=$("#juevesChk").is(":checked") ? "true" : "false"
        var vi=$("#viernesChk").is(":checked") ? "true" : "false"*/
        
        $('#datosFaltantes').modal('hide')
/*        valdoc1 == null ? null : encodeDocumento(valdoc1);
        valdoc2 == null ? null : encodeDocumento(valdoc2);
        valdoc3 == null ? null : encodeDocumento(valdoc3);*/
        valdoc4 == null ? null : encodeDocumento(valdoc4);
        
        let esperarSubida = new Promise((resolve, reject) => {
          $.blockUI({ message: 'Procesando archivos. Espere un momento...' });  
          setTimeout(function(){
            if(valdoc4 != null){
                if(doc4_b64 == null){
                    reject("Archivo 4 mal subido");
                }
            }
            resolve(true);
          }, 3000);
        });

        esperarSubida.then((successMessage) => {
            $.unblockUI();
            if(successMessage == true){
                guardaUsuario2();
            }
        })
        .catch(
            function(reason) {
                $.unblockUI();
                /* TODO: En caso de fallar mostrar alerta y permitir reintentar*/
                console.log('Sin éxito: ('+reason+').');
        });
}

function guardaUsuario2(){
        
            var arc4 = doc4_b64 != null ? doc4_b64 : null;
                arc4 ==null?arc4 =':' + null:arc4 =':"' + arc4 + '"';
            var t_json = '{"cedula_identidad" : null,' +
                        '"curriculum" : null,' +
                        '"certificado_antecedentes" : null,' +
                        '"certificado_titulo" ' + arc4  +
                        '}';
            
            var runp= $("#run").val()
            runp= runp.replace(/\./g,'')
            $.blockUI({ message: 'Enviando datos al servidor. Espere un momento...' });  
            $.ajax({
            method: 'POST',
            url: webservice+'/usuarios/saveusuariolite',
            crossDomain: true,
            headers: {
                '_token': $("#_token")
            },

            data: {
                usuario: usuario_global,
                run: runp || null,
                postula_examinador: $("#postulaExaminador").is(":checked") ? true : false,
                postula_supervisor: $("#postulaSupervisor").is(":checked") ? true : false,
                postula_anfitrion: $("#postula_anfitrion").is(":checked") ? true : false,
                postula_examinador_apoyo: $("#postula_examinador_apoyo").is(":checked") ? true : false,
                modificado: 0,

                nombres: $("#nombres").val(),
                apellido_paterno: $("#apellidoPaterno").val(),
                apellido_materno: $("#apellidoMaterno").val(),
                fecha_nacimiento: moment($("#fecha_nacimiento").val()).format('DD/MM/YYYY'),
                id_comuna_nacimiento: $("#nacionalidad").val()=="Chilena"?$("#comunaNacimiento").val():null,
                id_comuna_residencia: $("#comuna_residencia").val(),
                id_comuna_postulacion: $("#comuna_postulacion").val(),
                id_sexo: $("#sexo").val(),
                correo_electronico_principal: $("#correo_electronico_principal").val(),
                telefono_principal: $("#telefono_principal").val(),
                id_usuario: $("#idUsuario").val(),
                nivel_estudios: $("#nivel_estudios :selected").text(),
                profesion: $("#profesion").val(),
                apoyo_visual: $("#examinadorDVT").is(":checked") ? true : false,
                apoyo_auditivo: $("#examinadorDA").is(":checked") ? true : false,
                json_archivos: t_json
            },
                    
            
            
            success: function(data, textStatus, jqXHR) {
                $.unblockUI();
                //datosch=false;
                if (data.respuesta == "ok") {
                    showFeedback("success","Postulación guardada con éxito.");
                    usuario_global = null;
                disableds()//
                } else {
                    showFeedback("error", data.descripcion, "Datos no enviados: ");enableds();
                    if (data.descripcion=="Ya existe un usuario registrado con el correo enviado.") {
                        $("#correo_electronico_principal").addClass('div_is-invalid')}
                    }
                },
            error: function(jqXHR, textStatus, errorThrown) {
                $.unblockUI();
                //console.log(errorThrown);
                showFeedback("error",errorThrown,"Error al realizar el envío de informacion");
            }
            });
           disableds()
        
    // var arc1 = doc1_b64 != null ? doc1_b64 : null;
    // var arc2 = doc2_b64 != null ? doc2_b64 : null;
    // var arc3 = doc3_b64 != null ? doc3_b64 : null;
    
}
// function saveUsuarioRol() {

    // $.ajax({
        // method: 'GET',
        // url: 'http://endfid2018.iie.cl/endfidws/public/rolusuario/asignarrol',
        // //url: 'http://endfidws.test/rolusuario/asignarrol',
        // crossDomain: true,
        // dataType: 'json',
        // data: {
            // id_usuario: $("#idUsuario").val(),
            // idrol: 1000
        // },
        // success: function(data, textStatus, jqXHR) {
            // //console.log(data);
        // },
        // error: function(jqXHR, textStatus, errorThrown) {
            // //console.log(errorThrown)
        // }
    // });
// }

// function savePersona() {
    // // if ($("#universidad").val() == 1000) {
        // // $.ajax({
            // // method: 'GET',
            // // url: 'http://endfid2018.iie.cl/endfidws/public/personas/savepersona',
            // // crossDomain: true,
            // // dataType: 'json',
            // // data: {
                // // run: $("#run").val() || null,
                // // postula_examinador: $("#postulaExaminador").is(":checked") ? true : false,
                // // postula_supervisor: $("#postulaSupervisor").is(":checked") ? true : false,
                // // postula_tecnico: $("#postula_anfitrion").is(":checked") ? true : false,
                // // nombres: $("#nombres").val(),
                // // apellidos: $("#apellidoPaterno").val() + "  " + $("#apellidoMaterno").val(),
                // // fecha_nacimiento: $("#fecha_nacimiento").val(),
                // // id_comuna_nacimiento: $("#comunaNacimiento").val(),
                // // direccion_residencia: $("#direccion_residencia").val(),
                // // nacionalidad: $("#nacionalidad").val(),
                // // comuna_residencia: $("#comuna_residencia").val(),
                // // id_sexo: $("#sexo").val(),
                // // id_estado_civil: $("#estadoCivil").val(),
                // // correo_electronico_principal: $("#correo_electronico_principal").val(),
                // // telefono_principal: $("#telefono_principal").val(),
                // // id_usuario: $("#idUsuario").val(),
                // // disponibilidad_horaria: $("#disponibilidad_horaria").val(),

                // // nivel_estudios: $("#nivel_estudios :selected").text(),
                // // universidad: $("#otraInstitucion").val(),
                // // profesion: $("#profesion").val(),

                // // licencia_conducir: $("#licencia").is(":checked") ? true : false,
                // // automovil: $("#auto").is(":checked") ? true : false,
                // // clase_licencia: $("#claseLicencia").val(),
                // // datos_bancarios: '{"banco": "' + $("#banco :selected").text() + '",' +
                    // // '"tipo_cuenta" : "' + $("#tipoCuenta :selected").text() + '",' +
                    // // '"numero_cuenta" : "' + $("#numeroCuenta").val() + '"}'
            // // },
            // // success: function(data, textStatus, jqXHR) {
                // // //console.log(data);
                // // getPersonaXRut();
            // // },
            // // error: function(jqXHR, textStatus, errorThrown) {
                // // //console.log(errorThrown);
            // // }
        // // });
    // // } else {
        // $.ajax({
            // method: 'GET',
            // url: 'http://endfid2018.iie.cl/endfidws/public/personas/savepersona',
            // crossDomain: true,
            // dataType: 'json',
            // data: {
                // run: $("#run").val() || null,
                // postula_examinador: $("#postulaExaminador").is(":checked") ? true : false,
                // postula_supervisor: $("#postulaSupervisor").is(":checked") ? true : false,
                // postula_tecnico: $("#postula_anfitrion").is(":checked") ? true : false,
                // nombres: $("#nombres").val(),
                // apellidos: $("#apellidoPaterno").val() + "  " + $("#apellidoMaterno").val(),
                // fecha_nacimiento: $("#fecha_nacimiento").val(),
                // id_comuna_nacimiento: $("#ciudadNacimiento").val(),
                // direccion_residencia: $("#direccion_residencia").val(),
                // nacionalidad: $("#nacionalidad").val(),
                // comuna_residencia: $("#comuna_residencia").val(),
                // id_sexo: $("#sexo").val(),
                // id_estado_civil: $("#estadoCivil").val(),
                // correo_electronico_principal: $("#correo_electronico_principal").val(),
                // telefono_principal: $("#telefono_principal").val(),
                // id_usuario: $("#idUsuario").val(),

                // nivel_estudios: $("#nivel_estudios :selected").text(),
                // universidad: $("#universidad :selected").text(),
                // profesion: $("#profesion").val(),

                // licencia_conducir: $("#licencia").is(":checked") ? true : false,
                // automovil: $("#auto").is(":checked") ? true : false,
                // clase_licencia: $("#claseLicencia").val(),
                // datos_bancarios: '{"banco": "' + $("#banco :selected").text() + '",' +
                    // '"tipo_cuenta" : "' + $("#tipoCuenta :selected").text() + '",' +
                    // '"numero_cuenta" : "' + $("#numeroCuenta").val() + '"}'
            // },
            // success: function(data, textStatus, jqXHR) {
                // //console.log(data);
                // getPersonaXRut();
            // },
            // error: function(jqXHR, textStatus, errorThrown) {
                // //console.log(errorThrown);
            // }
        // });
    // //}
// }

// function savePersonaProyecto() {

    // $.ajax({
        // method: 'GET',
        // url: 'http://endfid2018.iie.cl/endfidws/public/personaproyecto/asignarproyecto',
        // //url: 'http://endfidws.test/personaproyecto/asignarproyecto',
        // crossDomain: true,
        // dataType: 'json',
        // data: {
            // persona_id: $("#idPersona").val(),
            // proyecto_id: 79
        // },
        // success: function(data, textStatus, jqXHR) {
            // //console.log(data);
            // $.unblockUI();
            // swal({
                // position: 'center',
                // type: 'success',
                // title: '<small class="fuente-gob-regular">Postulación Ingresada Correctamente.</small>',
                // showConfirmButton: false,
                // timer: 3000
            // });
            // setTimeout(function() {
                // window.location = "login.php";
            // }, 3000);
        // },
        // error: function(jqXHR, textStatus, errorThrown) {
            // //console.log(errorThrown)
        // }
    // });
// }

function listarBancos(response) {
    for (var i = 0; i < response.length; i++) {
        $("#banco").append("<option value='" + response[i].id + "'>" + response[i].nombre_banco + "</option>");
    }
}

function listarRegionesNacimiento(response) {
    for (var i = 0; i < response.length; i++) {
        $("#regionNacimiento").append("<option value='" + response[i].numero_region + "'>" + response[i].nombre_region + "</option>");
    }
}

function listarRegionesResidencia(response) {
    for (var i = 0; i < response.length; i++) {
        $("#regionResidencia").append("<option value='" + response[i].numero_region + "'>" + response[i].nombre_region + "</option>");
    }
}

function listarRegionesPostulacion(response) {
    for (var i = 0; i < response.length; i++) {
        $("#region_Postulacion").append("<option value='" + response[i].numero_region + "'>" + response[i].nombre_region + "</option>");
    }
}

function listarComunasNacimiento(response) {
    for (var i = 0; i < response.length; i++) {
        $("#comunaNacimiento").append("<option value='" + response[i].id + "'>" + response[i].nombre_comuna + "</option>");
    }
}

function listarComunasResidencia(response) {
    for (var i = 0; i < response.length; i++) {
        $("#comuna_residencia").append("<option value='" + response[i].id + "'>" + response[i].nombre_comuna + "</option>");
    }
}

function listarComunasPostulacion(response) {

    for (var i = 0; i < response.descripcion.length; i++) {
            
        $("#comuna_postulacion").append("<option value='" + response.descripcion[i].id_comuna + "'>" + response.descripcion[i].nombre + "</option>");
    }
}

function listarUniversidades(response) {
    for (var i = 0; i < response.length; i++) {
        $("#universidad").append("<option value='" + response[i].id + "'>" + response[i].nombre_institucion + "</option>");
    }

    $("#universidad").append("<option value='1000'>Otro (Especifique en el campo que aparecerá abajo)</option>");
}

function mostrarOtraInstitucion() {
    $("#universidad").val() == 1000 ? ($("#otraInstitucionDiv").show(), $("#otraInstitucion").attr("disabled", false)): ($("#otraInstitucionDiv").hide(), $("#otraInstitucion").attr("disabled", true),  $("#otraInstitucion").val(""));
}

function habilitarConduccion() {
    licencia_conducir: $("#licencia").is(":checked") ? $("#claseLicencia").attr("disabled", false) : $("#claseLicencia").attr("disabled", true) && $("#claseLicencia").val("");
    licencia_conducir: $("#licencia").is(":checked") ? $("#auto").attr("disabled", false) : $("#auto").attr("disabled", true) && $("#auto").prop("checked", false);
}

function habilitarInstitucionTitulo() {
    $("#nivel_estudios").val() > 3 ? ($("#universidad").attr("disabled", false), $("#profesion").attr("disabled", false)): ($("#universidad").attr("disabled", true), $("#profesion").attr("disabled", true), $("#profesion").val(""), $("#universidad").val("1"), mostrarOtraInstitucion())
    //$("#nivel_estudios").val() > 5 ? $("#documento_4").attr("disabled",false ) : ($("#documento_4").attr("disabled",true), $("#documento_4").val(""))
}

function encodeDocumento(contador) {
    if (contador == null){
        return false;
    }
    //localStorage.removeItem($('.documento')[0].files[0].name+"_64");
    //var file = document.getElementById("documento_"+contador).files[0];
    //var file = $("#documento_" + contador)[0].files[0];
    //console.log(contador)

    var reader = new FileReader();
    
    reader.onloadend = function() {
        switch (contador) {
            case 1:
                doc1_b64 = (reader.result).split("base64,")[1]
                break;
            case 2:
                doc2_b64 = (reader.result).split("base64,")[1]
                break;
            case 3:
                doc3_b64 = (reader.result).split("base64,")[1]
                break;
            case 4:
                doc4_b64 = (reader.result).split("base64,")[1]
                break;
        }
        // console.log("ENTRO");
        // localStorage.setItem((contador +"_64").trim(), (reader.result).split("base64,")[1]);
        // subirDocumento(contador);
    };
    reader.readAsDataURL(document.getElementById("documento_" + contador).files[0]);
    return true;
}

// function agregarDocumento() {

    // contador = contador + 1;

    // $("#tbodyDocs").append(
        // "<tr>" +
        // "<td class='small'>" +
        // "<select class='form-control custom-select tipoDocumento' id='tipoDocumento_" + contador + "'>" +
        // "<option value=''>Seleccione Tipo de Documento</option>" +
        // "<option value='1'>Cédula de Identidad</option>" +
        // "<option value='2'>Curriculum Vitae</option>" +
        // "<option value='3'>Certificado de Título</option>" +
        // "<option value='4'>Certificado de Antecedentes</option>" +
        // "</select>" +
        // "</td>" +

        // "<td>" +
        // "<div class='input-group'>" +
        // "<input type='hidden' id='_token' value='{{ csrf_token() }}'>" +
        // "<input type='file' class='form-control documento' id='documento_" + contador + "' onchange='encodeDocumento();' accept='.doc, .docx, .pdf'>" +
        // "</div>" +
        // "</td>" +

        // "<td>" +
        // "<div class='row'>" +
        // "<div class='col-sm-6'>" +
        // //"<img src='img/load.gif' width='100' class='pt-2 load' id='load_" + contador + "'>" +
        // "<button type='button' class='btn btn-primary' onclick='encodeDocumento();'><i class='fas fa-file-upload'></i> Subir Documento</button>" +
        // "</div>" +

        // "<div class='col-sm-6 text-left'>" +
        // "<p id='mensajeUpload_" + contador + "' class='mensajeUpload'></p>" +
        // "</div>" +
        // "</div>" +
        // "</td>" +
        // "</tr>");
// }

function subirDocumento(contador) {
    
    $("#load_" + contador).show();
    $("#mensajeUpload_" + contador).html("Subiendo Documento");
    $("#mensajeUpload_" + contador).addClass("text-dark");
    var unno="";
    var doctype= contador;
	doctype = (doctype==1) ? doctype="cedula_identidad"  : (doctype==2) ? doctype="curriculum"  : (doctype==3) ? doctype="certificado_antecedentes": doctype="certificado_titulo" ;
    	unno= (contador==1) ? unno=regs : (contador==2) ? unno=regs1 : (contador==3) ?  unno=regs2: unno=regs3;
    	
   
    
    $.ajax({
        method: 'POST',
		
        url: webservice+'/personas/subirarchivos',
        crossDomain: true,
        headers: {
            '_token': $("#_token")
        },
        data: {

        	id_persona_archivo: unno,
            run: $("#run").val(),
            documento: localStorage.getItem(($('#documento_' + contador)[0].files[0].name + "_64").trim()),
            nombreArchivo: $("#tipoDocumento_" + contador + " :selected").text() + "_" + $("#run").val() + "." + ($("#documento_" + contador)[0].files[0].name).split(".")[1],
        	tipo:doctype
        },
        success: function(data, textStatus, jqXHR) {
            $("#load" + contador).hide();
            $("#mensajeUpload_" + contador).html("<i class='fas fa-check'></i> Documento almacenado con Exito");
            $("#mensajeUpload_" + contador).addClass("_text-green");
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //console.log(errorThrown);
        }
    });
}



function getBancos(id) {
    //$.blockUI({ message: '<img src="img/carga.svg">' });

    $.ajax({
        method: 'GET',
        url: './sources/bancos.php',
        crossDomain: true,
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
           // $.unblockUI();
            
             
            var  found1= data.find(function(element1) {
             if (element1.nombre_banco == id) {
                   return element1.nombre_banco ; 
                } else {}
            });
             found1==null? listarBancos(data) : $("#banco").val(found1.id);
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //console.log(errorThrown);
        }
    });

}

function getRegionesNacimiento(id) {
    id== null?$.blockUI({ message: '<img src="img/carga2.svg"><br><span class="">Cargando datos, espere...</span>' }):id;

    $.ajax({
        method: 'GET',
        url: './sources/regiones.php',
        crossDomain: true,
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
            id== null?$.unblockUI():id;
            
            if(id==null){listarRegionesNacimiento(data);}else{$("#regionNacimiento").val(id);getComunasNacimiento();}
            
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //console.log(errorThrown);
        }
    });
}

function getRegionesResidencia(id) {
    id == null ? $.blockUI({ message: '<img src="img/carga2.svg"><br><span class="">Cargando datos, espere...</span>' }) : id;

    $.ajax({
        method: 'GET',
        url: './sources/regiones.php',
        crossDomain: true,
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
            id== null?$.unblockUI():id;
            
            if(id==null){listarRegionesResidencia(data);}else{$("#regionResidencia").val(id);getComunasResidencia();}
           
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //console.log(errorThrown);
        }
    });
}

function getRegionesPostulacion(id) {
    id == null ? $.blockUI({ message: '<img src="img/carga2.svg"><br><span class="">Cargando datos, espere...</span>' }) : id;

    $.ajax({
        method: 'GET',
        url: './sources/regiones.php',
        crossDomain: true,
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
            id== null?$.unblockUI():id;
            console.log(id);
            if(id==null){listarRegionesPostulacion(data);}else{$("#region_Postulacion").val(id);getComunasPostulacion();console.log(id);}
           
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //console.log(errorThrown);
        }
    });
}

function getComunasNacimiento() {
    $.blockUI({ message: '<img src="img/carga2.svg"><br><span class="">Cargando datos, espere...</span>' });
    $("#regionNacimiento").val()==""? $.unblockUI() :
    $.ajax({
        method: 'GET',
        url: './sources/comunas.php',
        crossDomain: true,
        dataType: 'json',
        data: {
            region_id: $("#regionNacimiento").val()
        },
        success: function(data, textStatus, jqXHR) {
            $.unblockUI();
            listarComunasNacimiento(data);
            var found5= data.find(function(element2) {
                if (element2.id==comunas_n) {return element2} else {}
            });
            found5==null? found5==null : $("#comunaNacimiento").val(found5.id); 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //console.log(errorThrown)
        }
    });
}


function getComunasResidencia() {
    $.blockUI({ message: '<img src="img/carga2.svg"><br><span class="">Cargando datos, espere...</span>' });
    $("#regionResidencia").val()==""? $.unblockUI() :
    $.ajax({
        method: 'GET',
        url: './sources/comunas.php',
        crossDomain: true,
        dataType: 'json',
        data: {
            region_id: $("#regionResidencia").val()
        },
        success: function(data, textStatus, jqXHR) {
            $.unblockUI();
            listarComunasResidencia(data);
            var found5= data.find(function(element2) {
                //console.log(element2)
                if (element2.id==comunas_r) {return element2} else {}
            });
            found5==null? found5==null : $("#comuna_residencia").val(found5.id); 

        },
        error: function(jqXHR, textStatus, errorThrown) {
            //console.log(errorThrown)
        }
    });
}
function getComunasPostulacion() {
    $.blockUI({ message: '<img src="img/carga2.svg"><br><span class="">Cargando datos, espere...</span>' });
    $("#region_Postulacion").val()==""? $.unblockUI() :
    $.ajax({
        method: 'POST',
        url: webservice+'/comunas/comunas-aplicacion',
        crossDomain: true,
        dataType: 'json',
        data: {
            region_id: $("#region_Postulacion").val()
        },
        success: function(data, textStatus, jqXHR) {
            $.unblockUI();
            listarComunasPostulacion(data);
            //console.log(data.descripcion)
            var found6= data.descripcion.find(function(element3) {
               
                if (element3.id_comuna==comunas_postulacion) {return element3} else {}
            });
             console.log(found6)
            found6==null? found6==null : $("#comuna_postulacion").val(found6.id_comuna); 

        },
        error: function(jqXHR, textStatus, errorThrown) {
            //console.log(errorThrown)
        }
    });
}
var idgl=0;
function getUniversidades(id) {
    id== null?$.blockUI({ message: '<img src="img/carga2.svg"><br><span class="">Cargando datos, espere...</span>' }):id;

    $.ajax({
        method: 'GET',
        url: './sources/instituciones.php',
        crossDomain: true,
        dataType: 'json',
        data: {
            servicio: 'instituciones'
        },
        success: function(data, textStatus, jqXHR) {
            id== null?$.unblockUI():id;
            //console.log(data)
            if (id==1000) {

                $("#otraInstitucionDiv").show()
                $("#otraInstitucion").attr("disabled", false)
                $("#universidad").val(id);

            } else {
                var found2= data.find(function(element2) {
                
                if (element2.id == id) {
                   return element2.id ; 
                } else {}
            
            });
            found2==null? '' : $("#universidad").val(found2.id);}
            idgl++;
              
            if (idgl<2) {listarUniversidades(data)}
         
        
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //console.log(errorThrown);
        }
    });



}