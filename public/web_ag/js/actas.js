$(document).ready(function () {
    // $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')

    $('#redirect').css('display', '');

    $('#redirect').on('click', redirectModulo);
    loginvalid(localStorage.getItem('user'))
    getCarpetas()
});



function getCarpetas() {
    $.ajax({
        method: 'GET',
        url: webservice + '/monitoreo/actas/lista',
        headers: {
        },
        crossDomain: true,
        dataType: 'text',
        data: {
        },
        success: function (data, textStatus, jqXHR) {
            var dosobt = JSON.parse(data);
            llenarVista(dosobt.descripcion);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showFeedback("error", "Error en el servidor", "Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
        }
    })
}

function llenarVista(data) {
    if (data.coordinacion != 0) {
        if ($.fn.dataTable.isDataTable('#table-coordinacion')) {
            $('#table-coordinacion').DataTable().destroy();
            $('#lista-coordinacion').empty();
        }
        console.log(data.coordinacion)

        trData = '';
        nro = 1;
        console.log(nro)
        for (var j = 0; j < data.coordinacion.length ; j++) {
            var fecha = new Date(data.coordinacion[j]["modifiedTime"]);
            trData += '<tr>';
            trData += '<td style="text-align:center">' + nro + '</td>'
            trData += '<td><a href="' + data.coordinacion[j].webViewLink + '" target="_blank">' + data.coordinacion[j].name + '</a></td>'
            trData += '<td>' + formatDate(fecha) + '</td>'
            trData += '<td>' + formatBytes(data.coordinacion[j].size) + '</td>'
            trData += '</tr>';
            nro++;
        }
        $('#lista-coordinacion').html(trData);
        $("#table-coordinacion").DataTable({
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
        $("#table-coordinacion").show();
    }

    if (data.impresion != 0) {
        if ($.fn.dataTable.isDataTable('#table-impresion')) {
            $('#table-impresion').DataTable().destroy();
            $('#lista-impresion').empty();
        }
        console.log(data.impresion)

        trData = '';
        nro = 1;
        console.log(nro)
        for (var j = 0; j < data.impresion.length ; j++) {
            var fecha = new Date(data.impresion[j]["modifiedTime"]);
            trData += '<tr>';
            trData += '<td style="text-align:center">' + nro + '</td>'
            trData += '<td><a href="' + data.impresion[j].webViewLink + '" target="_blank">' + data.impresion[j].name + '</a></td>'
            trData += '<td>' + formatDate(fecha) + '</td>'
            trData += '<td>' + formatBytes(data.impresion[j].size) + '</td>'
            trData += '</tr>';
            nro++;
        }
        $('#lista-impresion').html(trData);
        $("#table-impresion").DataTable({
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
        $("#table-impresion").show();
    }

    if (data.callcenter != 0) {
        if ($.fn.dataTable.isDataTable('#table-callcenter')) {
            $('#table-callcenter').DataTable().destroy();
            $('#lista-callcenter').empty();
        }
        console.log(data.callcenter)

        trData = '';
        nro = 1;
        console.log(nro)
        for (var j = 0; j < data.callcenter.length ; j++) {
            var fecha = new Date(data.callcenter[j]["modifiedTime"]);
            trData += '<tr>';
            trData += '<td style="text-align:center">' + nro + '</td>'
            trData += '<td><a href="' + data.callcenter[j].webViewLink + '" target="_blank">' + data.callcenter[j].name + '</a></td>'
            trData += '<td>' + formatDate(fecha) + '</td>'
            trData += '<td>' + formatBytes(data.callcenter[j].size) + '</td>'
            trData += '</tr>';
            nro++;
        }
        $('#lista-callcenter').html(trData);
        $("#table-callcenter").DataTable({
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
        $("#table-callcenter").show();
    }

    if (data.sistema_monitoreo != 0) {
        if ($.fn.dataTable.isDataTable('#table-sistema-monitoreo')) {
            $('#table-sistema-monitoreo').DataTable().destroy();
            $('#lista-sistema-monitoreo').empty();
        }
        console.log(data.sistema_monitoreo)

        trData = '';
        nro = 1;
        console.log(nro)
        for (var j = 0; j < data.sistema_monitoreo.length ; j++) {
            var fecha = new Date(data.sistema_monitoreo[j]["modifiedTime"]);
            trData += '<tr>';
            trData += '<td style="text-align:center">' + nro + '</td>'
            trData += '<td><a href="' + data.sistema_monitoreo[j].webViewLink + '" target="_blank">' + data.sistema_monitoreo[j].name + '</a></td>'
            trData += '<td>' + formatDate(fecha) + '</td>'
            trData += '<td>' + formatBytes(data.sistema_monitoreo[j].size) + '</td>'
            trData += '</tr>';
            nro++;
        }
        $('#lista-sistema-monitoreo').html(trData);
        $("#table-sistema-monitoreo").DataTable({
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
        $("#table-sistema-monitoreo").show();
    }

    if (data.aplicacion != 0) {
        if ($.fn.dataTable.isDataTable('#table-aplicacion')) {
            $('#table-aplicacion').DataTable().destroy();
            $('#lista-aplicacion').empty();
        }
        console.log(data.aplicacion)

        trData = '';
        nro = 1;
        console.log(nro)
        for (var j = 0; j < data.aplicacion.length ; j++) {
            var fecha = new Date(data.aplicacion[j]["modifiedTime"]);
            trData += '<tr>';
            trData += '<td style="text-align:center">' + nro + '</td>'
            trData += '<td><a href="' + data.aplicacion[j].webViewLink + '" target="_blank">' + data.aplicacion[j].name + '</a></td>'
            trData += '<td>' + formatDate(fecha) + '</td>'
            trData += '<td>' + formatBytes(data.aplicacion[j].size) + '</td>'
            trData += '</tr>';
            nro++;
        }
        $('#lista-aplicacion').html(trData);
        $("#table-aplicacion").DataTable({
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
        $("#table-aplicacion").show();
    }

    if (data.captura != 0) {
        if ($.fn.dataTable.isDataTable('#table-captura')) {
            $('#table-captura').DataTable().destroy();
            $('#lista-captura').empty();
        }
        console.log(data.captura)

        trData = '';
        nro = 1;
        console.log(nro)
        for (var j = 0; j < data.captura.length ; j++) {
            var fecha = new Date(data.captura[j]["modifiedTime"]);
            trData += '<tr>';
            trData += '<td style="text-align:center">' + nro + '</td>'
            trData += '<td><a href="' + data.captura[j].webViewLink + '" target="_blank">' + data.captura[j].name + '</a></td>'
            trData += '<td>' + formatDate(fecha) + '</td>'
            trData += '<td>' + formatBytes(data.captura[j].size) + '</td>'
            trData += '</tr>';
            nro++;
        }
        $('#lista-captura').html(trData);
        $("#table-captura").DataTable({
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
        $("#table-captura").show();
    }

    if (data.pregunta_abierta != 0) {
        if ($.fn.dataTable.isDataTable('#table-pregunta-abierta')) {
            $('#table-pregunta-abierta').DataTable().destroy();
            $('#lista-pregunta-abierta').empty();
        }
        console.log(data.pregunta_abierta)

        trData = '';
        nro = 1;
        console.log(nro)
        for (var j = 0; j < data.pregunta_abierta.length ; j++) {
            var fecha = new Date(data.pregunta_abierta[j]["modifiedTime"]);
            trData += '<tr>';
            trData += '<td style="text-align:center">' + nro + '</td>'
            trData += '<td><a href="' + data.pregunta_abierta[j].webViewLink + '" target="_blank">' + data.pregunta_abierta[j].name + '</a></td>'
            trData += '<td>' + formatDate(fecha) + '</td>'
            trData += '<td>' + formatBytes(data.pregunta_abierta[j].size) + '</td>'
            trData += '</tr>';
            nro++;
        }
        $('#lista-pregunta-abierta').html(trData);
        $("#table-pregunta-abierta").DataTable({
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
        $("#table-pregunta-abierta").show();
    }
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