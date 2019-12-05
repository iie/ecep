$(document).ready(function() {


});

function login() {
    $.ajax({
        method: 'GET',
        url: 'php/login.php',
        crossDomain: true,
        dataType: 'json',
        data: {
            usuario: $("#MainContent_lgnIngreso_UserName").val(),
            contrasena: $("#MainContent_lgnIngreso_Password").val(),
        },
        success: function(data, textStatus, jqXHR) {
            console.log(data)
            if (data.respuesta == "ok"){
                var datos = data.descripcion;
                localStorage.setItem("nombre_jardin", datos.nombre_jardin);
                localStorage.setItem("usuario", datos.usuario);
                localStorage.setItem("programa", datos.programa);
                localStorage.setItem("id_usuario", datos.id_usuario);
                location.href = '/inicio.html';
            }else{
                alert("Error: " + data.descripcion);
            }
            // alert("Usuario encontrado");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // alert("Usuario no encontrado");
            // console.log(errorThrown);
        }
    });
}