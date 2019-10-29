$(document).ready(function(){
    /*localStorage.clear();*/
    $("input#InputRun").rut({
        formatOn: 'keyup',
        minimunLength: 8,
        validateOn: 'change'
    })


    var input = document.getElementById("InputRun");

    input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            loginSubmit();
        }
    });
});

var respuesta;
function loginSubmit(){
    var run = $("#InputRun").val()
    
    if(run != ""){
        $.ajax({
            method: 'POST',
            url: server+'api/login-tecnico',
            /*headers: {
                    't' : JSON.parse(localStorage.user).token,
            },*/
            crossDomain: true,
            dataType: 'text',
            data:{
                run,
                infralab : 1,
            },

            success: function(data, textStatus, jqXHR) {
                    if(!isJSON(data)){

                        showFeedback("error","Error en los datos ingresados","Datos incorrectos");

                    }else{

                        if (JSON.parse(data).respuesta == "ok") {
                            respuesta = JSON.parse(data).descripcion
                            redirectVistaLabs();
                        }else {
                            console.log("ENtro acá");
                            showFeedback("error",JSON.parse(data).descripcion,"Error");                           
                            console.log("invalidos")
                        }
                    }
            },
            error: function(jqXHR, textStatus, errorThrown) {   
                    showFeedback("error","El servidor no responde correctamente","Error en el servidor");
                        //feedback
                    console.log("error");

            }
        })

    }else{
        showFeedback("error","Ingrese el RUN","Campo vacío");
    }
}

function redirectVistaLabs(){
    localStorage.nombre_tecnico = respuesta.nombre_tecnico;
    localStorage.token = respuesta.token;
    localStorage.run = respuesta.run_tecnico;
    location.href = server+"app_infra/seleccion_lab.html"
}


function isJSON (something) {
    if (typeof something != 'string')
        something = JSON.stringify(something);
    try {
        JSON.parse(something);
        return true;
    } catch (e) {
        return false;
    }
}
