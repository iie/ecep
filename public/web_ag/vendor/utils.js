var serverRedirect = "https://ecep2019.iie.cl/public/web_ag";
var serverRedirectSistema = "https://ecep2019.iie.cl/public/web_ecep"; 
//var webservice = "https://pruebadeconocimientos.iie.cl/routes/api/ecep";
var webservice = "https://ecep2019.iie.cl/api/web";



function loginvalid(id_usr){
    
    if (id_usr==null) {
        
         showFeedback("error","Debes iniciar sesion con la cuenta vinculada al sistema","Datos incorrectos");
         redirectLogin()
    } else {
       
    }
}

function checkToken() {
     console.log('aqui '+localStorage.length)
    if(localStorage.length > 0){
        $.ajax({
            method: 'POST',
            url: webservice + '/token-check',
            headers: {
                't': JSON.parse(localStorage.user).token,
            },
            crossDomain: true,
            dataType: 'text',
            data: {
                // token: JSON.parse(localStorage.user).token
            },
            success: function(data, textStatus, jqXHR) {
                var mensaje= JSON.parse(data)
                console.log(mensaje['descripcion'])
                if (mensaje['descripcion'] != "token invalido") {
                    if (mensaje['descripcion'] == "sesion expirada") {
                        localStorage.expirada = true
                        location.href = serverRedirect + '/index.html'
                    }else if (mensaje['descripcion'] != true) {
                        localStorage.kick = true
                        location.href = serverRedirect + '/index.html'
                    }
                } else {
                
                    localStorage.clear()
                    location.href = serverRedirect + '/index.html'
                    console.log("invalidos")
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //feedback
                console.log(errorThrown)
            }
        })
    }else{
        localStorage.autentificar = true
        location.href = serverRedirect + '/index.html'
        console.log("invalidos")
    }
}

function redirectLogin() {
    localStorage.clear()
    location.href = serverRedirect + '/'
}

function redirectModulo() {
    location.href = serverRedirect + '/modulos.html'
}

function redirectInfraestructura() {
    location.href = serverRedirect + '/infraestructura.html'
}

function redirectMateriales() {
    location.href = serverRedirect + '/material.html'
}

function redirectPersonal() {
    location.href = serverRedirect + '/personal.html'
}

function redirectCallCenter() {
    location.href = serverRedirect + '/callCenter.html'
}

function redirectTracking() {
    location.href = serverRedirect + '/tracking.html'
}

function redirectAplicacion() {
    location.href = serverRedirect + '/aplicacion.html'
}

function redirectDigitalizacion() {
    location.href = serverRedirect + '/digitalizacion.html'
}

function redirectMP3() {
    location.href = serverRedirect + '/dispositivo.html'
}

function redirectSistema() {
    location.href = serverRedirectSistema + '/modulos.html'
}

function redirectSistemaInfraestructura() {
    location.href = serverRedirectSistema + '/infraestructura.html'
}

function ocultarLoading(){
    $(".loader-page").css({visibility:"hidden",opacity:"0"})
}

var spanishTranslation = {
    "sProcessing": "Procesando...",
    "sLengthMenu": "Registros por página _MENU_",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún dato disponible en esta tabla",
    "sInfo": "Mostrando  _END_ registros de un total de _TOTAL_",
    "sInfoEmpty": "No hay registros disponibles",
    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    "searchPlaceholder": "",
    "sInfoPostFix": "",
    "sSearch": "Buscar",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": ">>",
        "sPrevious": "<<"
    },
    "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
};

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

function showFeedback(type, message, title) {

    toastr[type](message, title);
}


function NumText(string){
    var out = '';
    var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890-áéíóúÁÉÍÓÚüÜ´",.°!#$%(){}@;: ';
    
    for (var i=0; i<string.length; i++){
        if (filtro.indexOf(string.charAt(i)) != -1 || string.charAt(i) == "\n" || string.charAt(i) == "\r" || string.charAt(i) == "'") {
            out += string.charAt(i);
        }
    }
    return out;
}

function Numeros(string){
    var out = '';
    var filtro = '1234567890 ';
    
    for (var i=0; i<string.length; i++){
        if (filtro.indexOf(string.charAt(i)) != -1) {
            if(out.length<15){
                out += string.charAt(i);
            }
        }
    }

    return out;
}