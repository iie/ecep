$(document).ready(function(){
    var confirmacion = 0;
    obtenerid()
    var idPers = getParameterByName('idCapPersona');
    obtenerDataPersona(idPers)
    $("#confirm-btn").on("click", function() {
        confirmacion = 1
        guardarConfirmacion(idPers, confirmacion)
    });

    $("#rechazar-btn").on("click", function() {
        confirmacion = 2
        guardarConfirmacion(idPers, confirmacion)
    });
});
var datosPersona = "";
function obtenerid(){
    const url = new URL(document.location.href)
    const searchParams = url.searchParams
    const keys = [...searchParams.keys()]
    
    const object1 = keys

    .reduce((obj, key) =>({...obj, [key]: searchParams.get(key) }), {})
    return object1
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// AJAX
function obtenerDataPersona(idPersona) {
    $.ajax({
        method:'GET',
        url: webservice+'/capacitacion/confirma/'+idPersona,
        headers:{
        },
        crossDomain: true,
        dataType:'text',
        success: function(data, textStatus, jqXHR) {
            if(JSON.parse(data).resultado == 'error'){
                $('#main-div').html("<h1>" + JSON.parse(data).descripcion + "</h1>");
            }
            nombrePersona = JSON.parse(data).descripcion
            $('#nombre_persona').html(nombrePersona);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("error del servidor, datos incorrectos");

        }
    })
}

function guardarConfirmacion(idPers, confirmacion) {
    $.ajax({
        method:'POST',
        url: webservice+'/capacitacion/guarda-confirmacion',
        headers:{
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
            id_capacitacion_persona: idPers,
            confirma: confirmacion,
        },
        success: function(data, textStatus, jqXHR) {
            alert("Respuesta enviada correctamente.")
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("error del servidor, datos incorrectos");
        }
    })
}