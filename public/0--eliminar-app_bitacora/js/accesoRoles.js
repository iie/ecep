$(document).ready(function () {
	$('#nombre_usuario').html(localStorage.getItem('nombre_tecnico')+' ')
    ocultarBotones();
    loginvalid(localStorage.getItem('nombre_tecnico'))
    
     /*$.confirm({
       title: 'Alerta!',
        content: 'La sesión esta por expirar.',
        autoClose: 'logoutUser|10000',
        buttons: {
            logoutUser: {
                text: 'cerrar sesión',
                action: function () {
                    $.alert('La sesión ha expirado');
                    redirectLogin(1);                  
                }
            },
            cancelar: function () {
                $.alert('cancelado');
            }
        }
    },2000);*/

});

function loginvalid(id_tec){
    
    if (id_tec==null) {
        
         showFeedback("error","Debes iniciar sesion con la cuenta vinculada al sistema","Datos incorrectos");
         redirectLogin(2)
    } else {
        $("#adf").removeClass('blackout');
        $('#nombre_tecnico').html(localStorage.nombre_tecnico)
        validarRoles();
        //$('#rut_tecnico').html($.formatRut(localStorage.run))
    //datos()

    
    
    }
}

$(".custom-file-input").on("change", function() {
  var fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

function redireccionar(perfil){
    
    switch(perfil){
        case 1:
            localStorage.examina = false;
            localStorage.supervisa = true;
            location.href = server+'app_bitacora/aplicacionRegular.php'
        break;
        case 2:
            
            location.href = server+'app_bitacora/visitaPrevia.php'
        break;
        case 3:
            localStorage.supervisa = false;
            localStorage.examina = true;
            location.href = server+'app_bitacora/aplicacionRegular.php'
        break;
    }
    
 }

function ocultarBotones() {
    $("#evaluador").attr("disabled", true);
    $("#supervisor").attr("disabled", true);
    $("#examinador").attr("disabled", true);
    $("#evaluador").attr("hidden", true);
    $("#supervisor").attr("hidden", true);
    $("#examinador").attr("hidden", true);
    $("#evaluador").addClass('isDisabled');
    $("#supervisor").addClass('isDisabled');
    $("#examinador").addClass('isDisabled');
    
}

function validarRoles() {

    var txt = localStorage.getItem("array")
    var obj = JSON.parse(txt);
    
         if (obj.supervisor==true) {
            $("#evaluador").attr("disabled", false);
            $("#evaluador").attr("hidden", false);
            $("#evaluador").removeClass('isDisabled');
            $("#supervisor").attr("disabled", false);
            $("#supervisor").attr("hidden", false);
            $("#supervisor").removeClass('isDisabled');
        }

        //Si es Admin, Examinador, Supervisor o Ejecutivo
        if (obj.examinador) {
            $("#examinador").attr("disabled", false);
            $("#examinador").attr("hidden", false);
            $("#examinador").removeClass('isDisabled');
        }
        /*
        //Si es Admin o Técnico
        if(JSON.parse($("#idRol").val()).idRol[i] == 1 || JSON.parse($("#idRol").val()).idRol[i] == 10){
            $("#btnVisitaTecnica").show();
        }

        //Si es Admin, Supervisor o Ejecutivo
        if (JSON.parse($("#idRol").val()).idRol[i] == 1 || JSON.parse($("#idRol").val()).idRol[i] == 9 || JSON.parse($("#idRol").val()).idRol[i] == 3) {
            $("#btnVisitaPrevia").removeClass('isDisabled');
            $("#btnAplicacionSupervisor").removeClass('isDisabled');
        }

        //Si es Admin, Examinador, Supervisor o Ejecutivo
        if (JSON.parse($("#idRol").val()).idRol[i] == 1 || JSON.parse($("#idRol").val()).idRol[i] == 8 || JSON.parse($("#idRol").val()).idRol[i] == 9 || JSON.parse($("#idRol").val()).idRol[i] == 3) {
            $("#btnAplicacion").removeClass('isDisabled');
        }*/
    
}






