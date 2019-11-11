var server = "https://ecep2019.iie.cl/public/";

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

function redirectLogin(id){
    localStorage.setItem("array", "");
    localStorage.setItem("nombre_tecnico", "");
    localStorage.setItem("run", "");
    localStorage.setItem("token", "");
    
    //localStorage.clear()
    localStorage.salida=id;
    location.href = server + 'app_bitacora/'
}

function redirectVista(){
    location.href = server + 'app_bitacora/selectMenu.php'
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