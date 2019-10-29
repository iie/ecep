
var server = "https://informes.diagnosticafid.cl/public/";

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

function redirectLogin(){
    localStorage.clear()
    location.href = server + 'app_infra/'
}

function redirectVista(){
    location.href = server + 'app_infra/seleccion_lab.html'
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
