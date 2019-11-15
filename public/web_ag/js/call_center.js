$(document).ready(function () {
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres + ' ' + JSON.parse(localStorage.user).apellidos + ' ')

    // $('#redirect').css('display', '');

    $('#redirect').on('click', redirectModulo);
    // $('#inscritosDia').on('click', verInscritos);
    loginvalid(localStorage.getItem('user'))
    cargaLista()
    // autoload2()
});
var data_cc = "";
function cargaLista() {
    console.log("WNTRO");
    $.ajax({
        method: 'GET',
        url: webservice + '/monitoreo/call-center/lista',
        headers: {
            't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType: 'text',
        data: {
            id_usuario: JSON.parse(localStorage.user).id_usuario,
        },
        success: function (data, textStatus, jqXHR) {
            data_check = JSON.parse(data);
            if(data_check.respuesta == "OK"){
                data_cc = data_check.descripcion;
                llenarTabla(data_cc);
            }else{
                showFeedback("error", "Error en el servidor", data_check.descripcion);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showFeedback("error", "Error en el servidor", "Error cargando información.");
        }
    })
}

function llenarTabla(data) {
    
    if ($.fn.dataTable.isDataTable('#table-postulacion')) {
        $('#table-call-center').DataTable().destroy();
        $('#lista-call-center').empty();
    }

    trData = '';
    nro = 1;
    for (var j = 0; j < data_cc.length; j++) {
        var fecha = new Date(data[j]["modifiedTime"]);

        trData += '<tr>';
        trData += '<td style="text-align:center">' + nro + '</td>'
        trData += '<td> <a href="' + data[j]["webViewLink"] + '" target="_blank">' + data[j]["name"] + '</a></td>'
        trData += '<td>' + formatDate(fecha) + '</td>'
        trData += '<td>' + formatBytes(data[j]["size"]) + '</td>'
        trData += '</tr>';
        nro++;
    }

    $('#lista-call-center').append(trData);

    var tablaD = $("#table-call-center").DataTable({
        dom: "",
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language: spanishTranslation,
        lengthChange: true,
        info: false,
        paging: false,
        displayLength: -1,
        ordering: true,
        order: [],
        search: true,
        data: data.personal_postulacion,
        responsive: true,
    });

    $("#table-call-center").show();
}

function formatBytes(bytes,decimals) {
    if(bytes == 0) return '0 Bytes';
    var k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
 }

 function formatDate(date) {
    var monthNames = [
      "Enero", "Febrero", "Marzo",
      "Abril", "Mayo", "Junio", "Julio",
      "Agosto", "Septiembre", "Octubre",
      "Noviembre", "Diciembre"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
  
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }
