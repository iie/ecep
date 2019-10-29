$(document).ready(function () {
    ocultarBotones();
    validarRoles();
});

function ocultarBotones() {
    $("#btnVisitaTecnica").addClass('isDisabled');
    $("#btnAplicacion").addClass('isDisabled');
    $("#btnVisitaPrevia").addClass('isDisabled');
    $("#btnAplicacionSupervisor").addClass('isDisabled');
}

function validarRoles() {
    for (var i = 0; i < JSON.parse($("#idRol").val()).idRol.length; i++) {
        /*
        //Si es Admin o Técnico
        if(JSON.parse($("#idRol").val()).idRol[i] == 1 || JSON.parse($("#idRol").val()).idRol[i] == 10){
            $("#btnVisitaTecnica").show();
        }*/

        //Si es Admin, Supervisor o Ejecutivo
        if (JSON.parse($("#idRol").val()).idRol[i] == 1 || JSON.parse($("#idRol").val()).idRol[i] == 9 || JSON.parse($("#idRol").val()).idRol[i] == 3) {
            $("#btnVisitaPrevia").removeClass('isDisabled');
            $("#btnAplicacionSupervisor").removeClass('isDisabled');
        }

        //Si es Admin, Examinador, Supervisor o Ejecutivo
        if (JSON.parse($("#idRol").val()).idRol[i] == 1 || JSON.parse($("#idRol").val()).idRol[i] == 8 || JSON.parse($("#idRol").val()).idRol[i] == 9 || JSON.parse($("#idRol").val()).idRol[i] == 3) {
            $("#btnAplicacion").removeClass('isDisabled');
        }
    }
}






