$(document).ready(function(){
    location.href = 'https://ecep2019.iie.cl/'
/*    $("#ingresar").on('click',loginSubmit)
    var input = document.getElementById("password");

    input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("ingresar").click();
        }
    });*/
});

/*function loginSubmit(){
    var user = $("#username").val()
    var passw = $("#password").val()
    var captcha = $("#g-recaptcha-response").val()
    
    if(user != "" && passw != ""){
        $.ajax({
            method:'GET',
            url: webservice+'/login',
            headers:{
               't':''
            },
            crossDomain: true,
            dataType:'text',
            data:{mail:user,password:passw},
            success: function(data, textStatus, jqXHR) {
                 if(!isJSON(data)){
                    showFeedback("error","Error en los datos ingresados","Datos incorrectos");
                    console.log("error en los datos ingresados");
                 }else{
                    if (JSON.parse(data).token != "token invalido") {
                        if(JSON.parse(data).token == "no existe"){
                            showFeedback("error","Usuario o Contraseña no validos","Error en ingreso");
                            console.log("no usuario o contraseña o validos");
                        }else if(JSON.parse(data).respuesta == "error"){
                            console.log(JSON.parse(data).descripcion);
                            showFeedback("error",JSON.parse(data).descripcion,"Datos incorrectos");
                        }else{
                            console.log('redireccionar');
                            localStorage.user = data
                            redireccionar()
                        }
                    } else {
                        showFeedback("error","El servidor no responde correctamente","Error en el servidor");
                         console.log("invalidos")
                     }  
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showFeedback("error","Error en el servidor","Datos incorrectos");
                //console.log(jqXHR);
                console.log("error del servidor, datos incorrectos");
                console.log(JSON.parse(data));
                console.log(JSON.parse(data).id_tipo_usuario);
            }
        })
    }else{
        showFeedback("error","Error en los campos ingresados, hay campos vacios","Datos incorrectos");
        //console.log(jqXHR);
        console.log("campos vacios");
    }
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

function redireccionar(){
    
    location.href = serverRedirect+'/modulos.html'
    
 }


*/