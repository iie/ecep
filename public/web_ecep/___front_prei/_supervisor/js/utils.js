//var serverUrl = "";
//var webservice = "";
var serverRedirect = "http://devprei.iie.cl/front/_editor";
// var spanishTranslation = {
    // "sProcessing": "Procesando...",
    // "sLengthMenu": "Mostrar _MENU_ registros",
    // "sZeroRecords": "No se encontraron resultados",
    // "sEmptyTable": "Ningún dato disponible en esta tabla",
    // "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    // "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    // "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    // "sInfoPostFix": "",
    // "sSearch": "Buscar:",
    // "sUrl": "",
    // "sInfoThousands": ",",
    // "sLoadingRecords": "Cargando...",
    // "oPaginate": {
        // "sFirst": "Primero",
        // "sLast": "Último",
        // "sNext": "Siguiente",
        // "sPrevious": "Anterior"
    // },
    // "oAria": {
        // "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        // "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    // }
// };


//var server = "dev";
var webservice = "http://devprei.iie.cl/ws/public/api";

function redirectLogin() {
    localStorage.clear()
    location.href = serverRedirect + '/'
}
// switch (server) {
    // case "staging":
        // serverUrl = "http://192.168.88.100/sename/ws";
        // webservice = serverUrl + "/public/api";
        // serverRedirect = "http://192.168.88.100/sename/web"
        // break;
    // case "production":
        // serverUrl = "https://sigid.iie.cl/mmida/ws";
        // webservice = serverUrl + "/public/api";
        // serverRedirect = "https://sigid.iie.cl/mmida/web"
        // break;
    // case "dev":
        // serverUrl = "https://devsigid.iie.cl/mmida/ws";
        // webservice = serverUrl + "/public/api";
        // serverRedirect = "https://devsigid.iie.cl/mmida/web"
        // break;
// }


// function onlyAlph(event) {
    // if ((event.originalEvent.code == 'ArrowLeft') || (event.originalEvent.code == 'ArrowRight') ||
        // (event.originalEvent.code == 'ArrowUp') || (event.originalEvent.code == 'ArrowDown') ||
        // (event.originalEvent.code == 'Delete') || (event.originalEvent.code == 'Backspace') || event.originalEvent.code == "Space") {
        // return;
    // } else if (event.key.search(/[a-zA-Z\s\u002C\u002D\u002E\u0022\u003F\u00BF\u0021\u00A1\u00F1\u00D1\u00B4\u00CD\u00C1\u00C9\u00D3\u00DA\u00E1\u00E9\u00ED\u00F3\u00FA\u0024\u0025\u0028\u0029\u003A\u003B\u003D\u0040]/) == -1) {
        // event.preventDefault();
    // }
// }

// function onlyAlphNumber(event) {
    // if ((event.originalEvent.code == 'ArrowLeft') || (event.originalEvent.code == 'ArrowRight') ||
        // (event.originalEvent.code == 'ArrowUp') || (event.originalEvent.code == 'ArrowDown') ||
        // (event.originalEvent.code == 'Delete') || (event.originalEvent.code == 'Backspace') || event.originalEvent.code == "Space") {
        // return;
    // } else if (event.key.search(/[a-zA-Z0-9\s\u002C\u002D\u002E\u0022\u003F\u00BF\u0021\u00A1\u00F1\u00D1\u00B4\u00CD\u00C1\u00C9\u00D3\u00DA\u00E1\u00E9\u00ED\u00F3\u00FA\u0024\u0025\u0028\u0029\u003A\u003B\u003D\u0040]/) == -1) {
        // event.preventDefault();
    // }
// }

// function onlyGrade(event) {
    // if ((event.originalEvent.code == 'ArrowLeft') || (event.originalEvent.code == 'ArrowRight') ||
        // (event.originalEvent.code == 'ArrowUp') || (event.originalEvent.code == 'ArrowDown') ||
        // (event.originalEvent.code == 'Delete') || (event.originalEvent.code == 'Backspace') || event.originalEvent.code == "Space") {
        // return;
    // } else if (event.key.search(/[a-zA-Z0-9\s°]/) == -1) {
        // event.preventDefault();
    // }
// }

// function addressValidation(event) {
    // if ((event.originalEvent.code == 'ArrowLeft') || (event.originalEvent.code == 'ArrowRight') ||
        // (event.originalEvent.code == 'ArrowUp') || (event.originalEvent.code == 'ArrowDown') ||
        // (event.originalEvent.code == 'Delete') || (event.originalEvent.code == 'Backspace') || event.originalEvent.code == "Space") {
        // return;
    // } else if (event.key.search(/[a-zA-Z0-9#\s]/) == -1) {
        // event.preventDefault();
    // }
// }

// function rucValidation(event) {
    // if ((event.originalEvent.code == 'ArrowLeft') || (event.originalEvent.code == 'ArrowRight') ||
        // (event.originalEvent.code == 'ArrowUp') || (event.originalEvent.code == 'ArrowDown') ||
        // (event.originalEvent.code == 'Delete') || (event.originalEvent.code == 'Backspace')) {
        // return;
    // } else if (event.key.search(/[0-9-]/) == -1) {
        // event.preventDefault();
    // }
// }

// function onlyNumbers(event) {
    // if ((event.originalEvent.code == 'ArrowLeft') || (event.originalEvent.code == 'ArrowRight') ||
        // (event.originalEvent.code == 'ArrowUp') || (event.originalEvent.code == 'ArrowDown') ||
        // (event.originalEvent.code == 'Delete') || (event.originalEvent.code == 'Backspace')) {
        // return;
    // } else if (event.key.search(/\d/) == -1) {
        // event.preventDefault();
    // }
// }

// function ORDNumbers(event) {
    // if ((event.originalEvent.code == 'ArrowLeft') || (event.originalEvent.code == 'ArrowRight') ||
        // (event.originalEvent.code == 'ArrowUp') || (event.originalEvent.code == 'ArrowDown') ||
        // (event.originalEvent.code == 'Delete') || (event.originalEvent.code == 'Backspace')) {
        // return;
    // } else if (event.key.search(/[0-9\u005C\u002F\u002E\u002D]/) == -1) {
        // event.preventDefault();
    // }
// }

// function getTodayDateFormat() {
    // var date = new Date()
    // var day = date.getDate()
    // var month = date.getMonth() + 1
    // var year = date.getFullYear()

    // if (day < 10) {
        // day = '0' + day
    // }

    // if (month < 10) {
        // month = '0' + month
    // }

    // return day + '-' + month + '-' + year
// }

// function getTodayDate() {
    // var date = new Date()
    // var day = date.getDate()
    // var month = date.getMonth() + 1
    // var year = date.getFullYear()

    // if (day < 10) {
        // day = '0' + day
    // }

    // if (month < 10) {
        // month = '0' + month
    // }

    // return year + '-' + month + '-' + day
// }

// function verificarEmail(mail) {
    // var reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // if (reg.test(mail)) {
        // return true
    // } else {
        // return false
    // }
// }

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

/*
    type
        success (green)
        info (light blue)
        warning (yellow)
        error (red)
*/
function showFeedback(type, message, title) {

    toastr[type](message, title);
}

// function kickOut() {
    // if (localStorage.user == undefined || JSON.parse(localStorage.user).token == null) {
        // localStorage.clear()
        // location.href = serverRedirect + '/index.html'
    // }
// }

// function goBackInstrumento() {
    // if (!searchSigid(document.referrer)) {
        // location.href = serverRedirect + '/caso.html'
    // } else {
        // window.history.back();
    // }
// }
// function goBackInstrumentoCaja() {
    // window.history.back();
// }
 
// function searchSigid(busca) {
    // var patt = new RegExp('https://sigid.iie.cl/mmida/web/')
    // return patt.test(busca)
// }

// function returnEtapa() {
    // switch (localStorage.id_fase_actual) {
        // case "1":
            // return "diferenciacion"
        // case "2":
            // return "profundizacion"
        // case "3":
            // return "integracion"
        // case "4":
            // return "intervencion"
        // case "5":
            // return "reevaluacion"
        // case "6":
            // return "egreso"
        // case "7":
            // return "seguimiento"
    // }
// }

// function editDate(dateNoFormat) {
    // if (dateNoFormat == null || dateNoFormat == undefined || dateNoFormat == "") {
        // return null
    // } else {
        // var datos = dateNoFormat.split("-")

        // return datos[2] + "-" + datos[1] + "-" + datos[0]
    // }
// }


// function getElemento(documento) {
    // var doc = documento.split("_")
    // var docEnviar;
    // for (var i = 2; i < doc.length; i++) {
        // if (i == 2) {
            // docEnviar = doc[i]
        // } else {
            // docEnviar += " " + doc[i]
        // }
    // }
    // return docEnviar
// }

// function checkToken() {
//      console.log('aqui '+localStorage.length)
//     if(localStorage.length > 0){
//         $.ajax({
//             method: 'POST',
//             url: webservice + '/token-check',
//             headers: {
//                 't': JSON.parse(localStorage.user).token,
//             },
//             crossDomain: true,
//             dataType: 'text',
//             data: {
//                 // token: JSON.parse(localStorage.user).token
//             },
//             success: function(data, textStatus, jqXHR) {
//                 var mensaje= JSON.parse(data)
//                 console.log(mensaje['descripcion'])
//                 if (mensaje['descripcion'] != "token invalido") {
//                     if (mensaje['descripcion'] == "sesion expirada") {
//                         localStorage.expirada = true
//                         location.href = serverRedirect + '/index.html'
//                     }else if (mensaje['descripcion'] != true) {
//                         localStorage.kick = true
//                         location.href = serverRedirect + '/index.html'
//                     }
//                 } else {
                
//                     localStorage.clear()
//                     location.href = serverRedirect + '/index.html'
//                     console.log("invalidos")
//                 }
//             },
//             error: function(jqXHR, textStatus, errorThrown) {
//                 //feedback
//                 console.log(errorThrown)
//             }
//         })
//     }else{
//         localStorage.autentificar = true
//         location.href = serverRedirect + '/index.html'
//         console.log("invalidos")
//     }
// }

// function base64Encode(str) {
    // var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    // var out = "",
        // i = 0,
        // len = str.length,
        // c1, c2, c3;
    // while (i < len) {
        // c1 = str.charCodeAt(i++) & 0xff;
        // if (i == len) {
            // out += CHARS.charAt(c1 >> 2);
            // out += CHARS.charAt((c1 & 0x3) << 4);
            // out += "==";
            // break;
        // }
        // c2 = str.charCodeAt(i++);
        // if (i == len) {
            // out += CHARS.charAt(c1 >> 2);
            // out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            // out += CHARS.charAt((c2 & 0xF) << 2);
            // out += "=";
            // break;
        // }
        // c3 = str.charCodeAt(i++);
        // out += CHARS.charAt(c1 >> 2);
        // out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        // out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        // out += CHARS.charAt(c3 & 0x3F);
    // }
    // return out;
// }


// function Rut(string){
    // var out = '';
    // var filtro = '1234567890kK';
    
    // for (var i=0; i<string.length; i++){
        // if (filtro.indexOf(string.charAt(i)) != -1){ 
            // if(out.length < 10){
                // out += string.charAt(i);
            // }
        // }
    // }
    
    // return out;
// } 

// function Text(string){
    // var out = '';
    // var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóúÁÉÍÓÚüÜ´"-,.°!#$%(){}@;: ';
    // for (var i=0; i<string.length; i++){
       // if (filtro.indexOf(string.charAt(i)) != -1 || string.charAt(i) == "\n" || string.charAt(i) == "\r" || string.charAt(i) == "'"){ 
            // if(out.length<5000){
                // out += string.charAt(i);
            // }
        // }
    // }
    // return out;
// }

// function nameText(string){
    // var out = '';
    // var filtro = "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóúÁÉÍÓÚüÜ´-' ";
    // for (var i=0; i<string.length; i++){
       // if (filtro.indexOf(string.charAt(i)) != -1 || string.charAt(i) == "\n" || string.charAt(i) == "\r" || string.charAt(i) == "'"){ 
            // if(out.length<5000){
                // out += string.charAt(i);
            // }
        // }
    // }
    // return out;
// } 

// function NumText(string){
    // var out = '';
    // var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890-áéíóúÁÉÍÓÚüÜ´",.°!#$%(){}@;: ';
    
    // for (var i=0; i<string.length; i++){
        // if (filtro.indexOf(string.charAt(i)) != -1 || string.charAt(i) == "\n" || string.charAt(i) == "\r" || string.charAt(i) == "'") {
            // out += string.charAt(i);
        // }
    // }
    // return out;
// }

// function address(string){
    // var out = '';
    // var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890-áéíóúÁÉÍÓÚüÜ´",.°# ';
    
    // for (var i=0; i<string.length; i++){
        // if (filtro.indexOf(string.charAt(i)) != -1 || string.charAt(i) == "\n" || string.charAt(i) == "\r" || string.charAt(i) == "'") {
            // if(out.length<5000){
                // out += string.charAt(i);
            // }
        // }
    // }
    // return out;
// }

// function Numeros(string){
    // var out = '';
    // var filtro = '1234567890 ';
    
    // for (var i=0; i<string.length; i++){
        // if (filtro.indexOf(string.charAt(i)) != -1) {
            // if(out.length<15){
                // out += string.charAt(i);
            // }
        // }
    // }

    // return out;
// }

// function numeroTelefono(string){
    // var out = '';
    // var filtro = '1234567890()+-,';
    
    // for (var i=0; i<string.length; i++){
        // if (filtro.indexOf(string.charAt(i)) != -1) {
                // out += string.charAt(i);
        // }
    // }

    // return out;
// }

// function RucRit(string){
    // var out = '';
    // var filtro = '-1234567890-kK';
    
    // for (var i=0; i<string.length; i++){
        // if (filtro.indexOf(string.charAt(i)) != -1) {
            // //if(out.length<15){
                // out += string.charAt(i);
            // //}
        // }
    // }

    // return out;
// }

// function duracionSancion(string){
    // var out = '';
    // var filtro = '1234567890';
    
    // for (var i=0; i<string.length; i++){
        // if (filtro.indexOf(string.charAt(i)) != -1) {
            // if(out.length<4){
                // out += string.charAt(i);
            // }
        // }
    // }

    // return out;
// }

// function edad(string){
    // var out = '';
    // var filtro = '1234567890';
    
    // for (var i=0; i<string.length; i++){
        // if (filtro.indexOf(string.charAt(i)) != -1) {
            // if(out.length<3){
                // out += string.charAt(i);
            // }
        // }
    // }

    // return out;
// }

// function hora(string){
    // var out = '';
    // var filtro = '1234567890:';
    
    // for (var i=0; i<string.length; i++){
        // if (filtro.indexOf(string.charAt(i)) != -1) {
            // if(out.length<5){
                // out += string.charAt(i);
            // }
        // }
    // }

    // return out;
// }


// function NumerosDecimales(string){
    // var out = '';
    // var filtro = '1234567890,';
    
    // for (var i=0; i<string.length; i++){
        // if (filtro.indexOf(string.charAt(i)) != -1) {
            // if(out.length<4){
                // out += string.charAt(i);
            // }
        // }
    // }

    // return out;
// }

// function anios(string){
    // var out = '';
    // var filtro = '1234567890';
    
    // for (var i=0; i<string.length; i++){
        // if (filtro.indexOf(string.charAt(i)) != -1) {
            // if(out.length<4){
                // out += string.charAt(i);
            // }
        // }
    // }

    // return out;
// }

// function porcentaje(string){
    // var out = '';
    // var filtro = '1234567890';

    // for (var i=0; i<string.length; i++){
        // if (filtro.indexOf(string.charAt(i)) != -1) {
            // if(out.length<2){
                // out += string.charAt(i);
            // }
        // }
    // }

    // return out;
       
// }

// /*function notasPG(string){
    // var out = '';
    // var filtro = '1234567890,';
    // //var cadena = "^([1-7]{1})(\.?)([0-9]{1})?$"; 
    // var cadena = "^([1-7])([.]([0-9]?))?$"; 
    
    // var re = new RegExp(cadena);

   // for (var i=0; i<string.length; i++){
        // if (string.match(re)) {
            // if(out.length<3){
                // out += string.charAt(i);
            // }
        // }
    // }

    // return out;
// }*/

// function validarAnio(string){
    // var out = '';
    // var filtro = '1234567890';   

    // if(string.charAt(0) == 1){
        // out += string.charAt(0)
        // if(string.charAt(1) == 9){
            // out += string.charAt(1)
            // if(string.charAt(2) >= 5 && string.charAt(2) <= 9){
                // out += string.charAt(2)
                // if(string.charAt(3) >= 0 && string.charAt(3) <= 9){
                    // out += string.charAt(3)
                // }
            // }
        // }
    // }else if (string.charAt(0) == 2){
        // out += string.charAt(0)
        // for (var i=1; i<string.length; i++){
            // if (filtro.indexOf(string.charAt(i)) != -1) {
                // if(out.length<4){
                    // out += string.charAt(i);
                // }
            // }
        // }

    // }
      
 
    // return out;
    
// }

// function notasPG(string){
    // var out = '';

    // if(string.charAt(0) >= 1 && string.charAt(0) <= 7){
        // out += string.charAt(0)
        // if(string.charAt(1) == '.'){
            // out += string.charAt(1)
            // if(string.charAt(0) != 7){
                // if(string.charAt(2) >= 0 && string.charAt(3) <= 9){
                    // out += string.charAt(2)
                // }
            // }else{
                // if(string.charAt(2) == 0 ){
                    // out += string.charAt(2)
                // }

            // }
        // }
    // }

    // return out;
// }

/*Devuelve el input correspondiente para cada tipo recurso con el recurso cargado*/
function seleccionarTipoRecurso(tipo, ruta){

    switch(tipo){
        case "imagen":
            return '<img src=".'+ruta+'" alt="estimulo" height="85%" width="85%">';
        break;
        case "video":
            return '<video width="320" height="240" controls><source src=".'+ruta+'" type="video/mp4">El navegador no soporta video.</video>';
        break;
        case "audio":
            return '<audio controls><source src=".'+ruta+'" type="audio/ogg">El navegador no soporta audio.</audio>';
        break;
        default:
            return '';
        break;
    }
}