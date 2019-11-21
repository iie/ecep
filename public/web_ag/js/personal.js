$(document).ready(function () {
    localStorage.setItem('firsload', false);
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres + ' ' + JSON.parse(localStorage.user).apellidos + ' ')

    $('#redirect').css('display', '');

    $('#redirect').on('click', redirectModulo);
    $('#inscritosDia').on('click', verInscritos);
    loginvalid(localStorage.getItem('user'))
    autoload1()
    autoload2()

    $("#select-view").change(function () {
        if ($("#select-view").val() == 1) {
            getPersonal(unoobt);
        }
        if ($("#select-view").val() == 2) {
            getpostula(dosobt);
        }
    });
});

var unoobt;
var dosobt;
function autoload1() {
    $.ajax({
        method: 'GET',
        url: webservice + '/monitoreo/personal/lista',
        headers: {
            't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType: 'text',
        data: {
            id_usuario: JSON.parse(localStorage.user).id_usuario,
        },
        success: function (data, textStatus, jqXHR) {
            unoobt = JSON.parse(data);
            if (localStorage.getItem('firsload') == "false") {
                if ($("#select-view").val() == 1) {
                    getPersonal(unoobt);
                    localStorage.setItem('firsload', true);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showFeedback("error", "Error en el servidor", "Datos incorrectos");
        }
    })
}

function autoload2() {
    $.ajax({
        method: 'GET',
        url: webservice + '/monitoreo/personal-por-estado/lista',
        headers: {
            't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType: 'text',
        data: {
            id_usuario: JSON.parse(localStorage.user).id_usuario,
        },

        success: function (data, textStatus, jqXHR) {
            dosobt = JSON.parse(data);
            if (localStorage.getItem('firsload') == "false") {
                if ($("#select-view").val() == 2) {
                    getpostula(dosobt);
                    localStorage.setItem('firsload', true);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showFeedback("error", "Error en el servidor", "Datos incorrectos");
        }
    })
}

function getpostula(response) {
    //attr preselect
    $("#tab-preseleccionado").show()
    //tabs
    $("#tab-postulacion").html("Postulación")
    $("#tab-zonal").html("Capacitación")
    $("#tab-regional").html("Selección")
    $("#tab-centro").html("Contratación")
    //vista 1
    $("#ttotal_supervisor").html("SUPERVISORES")
    $("#ttotal_capacitados").html("EXAMINADORES")
    $("#ttotal_seleccionados").html("EXAM. DE APOYO")
    $("#ttotal_contratados").html("ANFITRION")
    $("#change_post").html("SUPERVISORES")
    $("#change_capa").html("EXAMINADORES")
    $("#change_sele").html("EXAM. DE APOYO")
    $("#change_contr").html("ANFITRION")
    $("#ratiototal").html("POSTULANTES")
    //vista 2
    $("#ttotal_supervisor2").html("SUPERVISORES")
    $("#ttotal_capacitados2").html("EXAMINADORES")
    $("#ttotal_seleccionados2").html("EXAM. DE APOYO")
    $("#ttotal_contratados2").html("ANFITRION")
    $("#change_post2").html("SUPERVISORES")
    $("#change_capa2").html("EXAMINADORES")
    $("#change_sele2").html("EXAM. DE APOYO")
    $("#change_contr2").html("ANFITRION")
    $("#ratiototal2").html("CAPACITADOS")
    $("#change_tota2").html("CAPACITADOS")

    //vista 3
    $("#ttotal_supervisor3").html("SUPERVISORES")
    $("#ttotal_capacitados3").html("EXAMINADORES")
    $("#ttotal_seleccionados3").html("EXAM. DE APOYO")
    $("#ttotal_contratados3").html("ANFITRION")
    $("#change_post3").html("SUPERVISORES")
    $("#change_capa3").html("EXAMINADORES")
    $("#change_sele3").html("EXAM. DE APOYO")
    $("#change_contr3").html("ANFITRION")
    $("#ratiototal3").html("SELECCIONADOS")
    $("#change_tota3").html("SELECCIONADOS")
    //vista 4
    $("#ttotal_supervisor4").html("SUPERVISORES")
    $("#ttotal_capacitados4").html("EXAMINADORES")
    $("#ttotal_seleccionados4").html("EXAM. DE APOYO")
    $("#ttotal_contratados4").html("ANFITRION")
    $("#change_pos4").html("SUPERVISORES")
    $("#change_cap4").html("EXAMINADORES")
    $("#change_sel4").html("EXAM. DE APOYO")
    $("#change_cont4").html("ANFITRION")
    $("#ratiototal4").html("CONTRATADOS")
    $("#change_tota4").html("CONTRATADOS")

    llenarVista(response["descripcion"]["0"]["data_estado"], response["descripcion"]["contador"]["reclutado"], response["descripcion"]["contador"].totalWns);
    llenarVista2(response["descripcion"]["2"]["data_estado"], response["descripcion"]["contador"]["capacitado"], response["descripcion"]["contador"].total_capacitado);
    llenarVista3(response["descripcion"]["3"]["data_estado"], response["descripcion"]["contador"]["seleccionado"], response["descripcion"]["contador"].total_seleccionado);
    llenarVista4(response["descripcion"]["4"]["data_estado"], response["descripcion"]["contador"]["contratado"], response["descripcion"]["contador"].total_contratado);
}

function getPersonal(response) {
    //attr presele
    $("#tab-preseleccionado").hide()
    //tabs
    $("#tab-postulacion").html("Supervisores")
    $("#tab-zonal").html("Examinadores")
    $("#tab-regional").html("Examinadores de Apoyo")
    $("#tab-centro").html("Anfitrión")
    //vista 1
    $("#ttotal_supervisor").html("POSTULANTES")
    $("#ttotal_capacitados").html("CAPACITADOS")
    $("#ttotal_seleccionados").html("SELECCIONADOS")
    $("#ttotal_contratados").html("CONTRATADOS")
    $("#change_post").html("POSTULANTES")
    $("#change_capa").html("CAPACITADOS")
    $("#change_sele").html("SELECCIONADOS")
    $("#change_contr").html("CONTRATADOS")
    $("#ratiototal").html("TOTAL")

    //vista 2
    $("#ttotal_supervisor2").html("POSTULANTES")
    $("#ttotal_capacitados2").html("CAPACITADOS")
    $("#ttotal_seleccionados2").html("SELECCIONADOS")
    $("#ttotal_contratados2").html("CONTRATADOS")
    $("#change_post2").html("POSTULANTES")
    $("#change_capa2").html("CAPACITADOS")
    $("#change_sele2").html("SELECCIONADOS")
    $("#change_contr2").html("CONTRATADOS")
    $("#ratiototal2").html("TOTAL")
    $("#change_tota2").html("POSTULANTES")
    //vista 3
    $("#ttotal_supervisor3").html("POSTULANTES")
    $("#ttotal_capacitados3").html("CAPACITADOS")
    $("#ttotal_seleccionados3").html("SELECCIONADOS")
    $("#ttotal_contratados3").html("CONTRATADOS")
    $("#change_post3").html("POSTULANTES")
    $("#change_capa3").html("CAPACITADOS")
    $("#change_sele3").html("SELECCIONADOS")
    $("#change_contr3").html("CONTRATADOS")
    $("#ratiototal3").html("TOTAL")
    $("#change_tota3").html("POSTULANTES")
    //vista 4
    $("#ttotal_supervisor4").html("POSTULANTES")
    $("#ttotal_capacitados4").html("CAPACITADOS")
    $("#ttotal_seleccionados4").html("SELECCIONADOS")
    $("#ttotal_contratados4").html("CONTRATADOS")
    $("#change_pos4").html("POSTULANTES")
    $("#change_cap4").html("CAPACITADOS")
    $("#change_sel4").html("SELECCIONADOS")
    $("#change_cont4").html("CONTRATADOS")
    $("#ratiototal4").html("TOTAL")
    $("#change_tota4").html("POSTULANTES")

    llenarVista(response["descripcion"]["1"]["data_rol"], response["descripcion"]["contador"]["Supervisor"], response);
    llenarVista2(response["descripcion"]["0"]["data_rol"], response["descripcion"]["contador"]["Examinador"], response);
    llenarVista3(response["descripcion"]["4"]["data_rol"], response["descripcion"]["contador"]["examinador_de_apoyo"], response);
    llenarVista4(response["descripcion"]["3"]["data_rol"], response["descripcion"]["contador"]["anfitrion"], response);
}

supervisor = 0;
examinador = 0;
examinadorap = 0;
anfitrion = 0;



function llenarVista(data, data2, data3) {
    
    $('#filtros-postulacion').empty();
    if ($.fn.dataTable.isDataTable('#table-postulacion')) {
        $('#table-postulacion').DataTable().destroy();
        $('#lista-postulacion').empty();
    }

    trData = '';
    nro = 1;
    var requeridos_totales=0;
    var requeridos_totalesPer=0;
    for (var j = 0; j < data.length; j++) {
        for (var k = 0; k < data[j]["data_region"].length; k++) {
            if ($("#select-view").val() == 1) {
                var comunaP= data[j]["data_region"][k];
                var req = data[j]["data_region"][k].data_comuna.requeridos != null ? data[j]["data_region"][k].data_comuna.requeridos : 0
                var sum = data[j]["data_region"][k].data_comuna.reclutado + data[j]["data_region"][k].data_comuna.capacitado + data[j]["data_region"][k].data_comuna.seleccionado + data[j]["data_region"][k].data_comuna.contratado
                var porcentaje = data[j]["data_region"][k].data_comuna.postulante * 100;
                porcentaje = req == 0 ? 0 : porcentaje / req;
                var conDecimal = porcentaje.toFixed(0);
                requeridos_totalesPer+= req

                arrayFinal = {detalle: "string", fechaDoc: "date", fechaPag: "date", montoDecl: "number", montoTotDoc: "number"}

                //console.log(comunaP);

                //document.getElementsByTagName("body")[0].innerHTML="<button onclick='modal("+ JSON.stringify(arrayFinal) +")'>funcion modal()</button>";

                trData += '<tr>';
                trData += '<td style="text-align:center">' + nro + '</td>'
                trData += '<td>' + data[j]["region"] + '</td>'
                trData += '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData += '<td id="requeridos_' + nro + '" style="text-align:center">' + req + '</td>'
                trData += '<td id="preselected_' + nro + '" style="text-align:center">' + data[j]["data_region"][k].data_comuna.postulante + '</td>'
                trData += '<td id="tototalcol_' + nro + '" style="text-align:center">' + conDecimal + '%</td>'
                trData += '<td id="supervisor_' + nro + '" style="text-align:center">' + data[j]["data_region"][k].data_comuna.reclutado + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.capacitado + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.seleccionado + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.contratado + '</td>'
                //trData += "<td style='text-align:center' id='buttonComuna_"+nro+"'><button type='button' id='comuna_"+data[j]["data_region"][k].comuna+"' onclick='verComuna("+ JSON.stringify(comunaP) +")'  class='btn btn-volver' style='min-width: 89px;''>Ver</button></td>"
                trData += '</tr>';
                nro++;
            }
            if ($("#select-view").val() == 2) {
                var sum = data[j]["data_region"][k].data_comuna.wnsUnicos
                var one = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                one = one.Supervisor == null ? 0 : one.Supervisor;
                var two = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                two = two.Examinador == null ? 0 : two.Examinador
                var three = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                three = three.examinador_de_apoyo == null ? 0 : three.examinador_de_apoyor
                var four = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                four = four.anfitrion == null ? 0 : four.anfitrion;
                var sumrquerido = parseInt(one) + parseInt(two) + parseInt(three) + parseInt(four)
                var porcentaje = sum * 100;
                porcentaje = sumrquerido == 0 ? 0 : porcentaje / sumrquerido;
                var conDecimal = porcentaje.toFixed(0);
                var comuna1= data[j]["data_region"][k];
                requeridos_totales+=sumrquerido
                trData += '<tr>';
                trData += '<td style="text-align:center">' + nro + '</td>'
                trData += '<td>' + data[j]["region"] + '</td>'
                trData += '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData += '<td id="1requeridos_' + nro + '" style="text-align:center">' + sumrquerido + '</td>'
                trData += '<td id="preselected_' + nro + '" style="text-align:center">' + sum + '</td>'
                trData += '<td id="tototalcol_' + nro + '" style="text-align:center">' + conDecimal + '%</td>'
                trData += '<td id="supervisor_' + nro + '" style="text-align:center">' + data[j]["data_region"][k].data_comuna.Supervisor + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.Examinador + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.examinador_de_apoyo + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.anfitrion + '</td>'
                //trData += "<td style='text-align:center' id='buttonComuna1_"+nro+"'><button type='button' id='comuna_"+data[j]["data_region"][k].comuna+"' onclick='verComuna("+ JSON.stringify(comuna1) +")'  class='btn btn-volver' style='min-width: 89px;''>Ver</button></td>"
                trData += '</tr>';
                nro++;
            }
        }
    }
    

    $('#lista-postulacion').append(trData);
    console.log(requeridos_totales)
    var tablaD = $("#table-postulacion").DataTable({
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

        "rowCallback": function (row, data) {

            supervisor++;
        },

        "initComplete": function (settings, json) {
            var checkbox = $('input:checkbox[name=inputRolAsignado]')
            for (var i = 0; i < checkbox.length; i++) {
                checkbox[i].disabled = true;
            }
            $('#divRol').css('display', 'none')
            var placeholder = ["", "Región", "Comuna"]
            this.api().columns([1, 2]).every(function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="select' + index + '" >' +
                    '<option value="" selected="selected">' + placeholder[index] + '</option></select>')
                    .appendTo($('#filtros-postulacion'))
                    .on('change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );

                        column
                            .search(val ? '^' + val + '$' : '', true, false)
                            .draw();
                    });
                column.data().unique().each(function (d, j) {
                    if (d != null) {
                        $('#select' + index).append('<option value="' + d.charAt(0).toUpperCase() + d.slice(1) + '">' + d.charAt(0).toUpperCase() + d.slice(1) + '</option>')
                    }
                });
                $('#select' + index).niceSelect();
            })
            $('.dataTables_length select').addClass('nice-select small');
        },

        "drawCallback": function () {
            var placeholder = ["", "Región", "Comuna"]
            this.api().columns([1, 2]).every(function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#select" + index)
                if (selectFiltered.val() === '') {
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">' + placeholder[index] + '</option>')
                    columnFiltered.column(index, { search: 'applied' }).data().unique().each(function (d, j) {
                        if (d != null) {
                            selectFiltered.append('<option value="' + d.charAt(0).toUpperCase() + d.slice(1) + '">' + d.charAt(0).toUpperCase() + d.slice(1) + '</option>')
                        }
                    });
                }
                $('select').niceSelect('update');
            })
        }
    });

    if ($("#select-view").val() == 1) {
        $('#graficofig1').addClass('highcharts-figure2')
        $('#graficopar1').addClass('highcharts-description2')
        $('#graficofig1').removeClass('highcharts-figure')
        $('#graficopar1').removeClass('highcharts-description')
        
        //grafico(requeridos_totalesPer,data2.reclutado + data2.seleccionado + data2.capacitado + data2.contratado)
        grafico1Barras(requeridos_totalesPer,data2.postulante,data2.capacitado,data2.seleccionado,data2.contratado)
        //$("#change_accion").hide();
        $("#clear-filtros1").hide();
        $("#change_post").hide();
        for (var az = 0; az < nro; az++) {
            $("#supervisor_" + az).hide();
            //$("#buttonComuna_" + az).hide();
        }
        $('#total_supervisor').html(data2.postulante)
        $('#total_capacitados').html(data2.capacitado)
        $('#total_seleccionados').html(data2.seleccionado)
        $('#total_contratados').html(data2.contratado)
        $('#ttotal').html(data2.reclutado + data2.seleccionado + data2.capacitado + data2.contratado)
    }
    if ($("#select-view").val() == 2) {
        $('#graficofig1').addClass('highcharts-figure')
        $('#graficopar1').addClass('highcharts-description')
        $('#graficofig1').removeClass('highcharts-figure2')
        $('#graficopar1').removeClass('highcharts-description2')
        //grafico(requeridos_totales,data3)
        graficoBarras(requeridos_totales,data3)
        //$("#change_accion").hide();
        $("#clear-filtros1").show();
        $("#change_post").show();
        for (var bz = 0; bz < nro; bz++) {
            $("#supervisor_" + bz).show();
            //$("#buttonComuna1_" + az).hide();
            
        }

        $("#clear-filtros1").show();
        $('#total_supervisor').html(data2.Supervisor)
        $('#total_capacitados').html(data2.Examinador)
        $('#total_seleccionados').html(data2.examinador_de_apoyo)
        $('#total_contratados').html(data2.anfitrion)
        $('#ttotal').html(data3)
    }
    $('#limpiar-filtros-postulacion').click(btnClearFilters);
    $("#descargar-lista").on("click", function () {
        tablaD.button('.buttons-excel').trigger();
    });
    $("#table-postulacion").show();


}

function grafico1Barras(data,data1,data2,data3,data4){
    //$("highcharts-credits").removeClass('highcharts-credits')
    console.log(data3)
    Highcharts.chart('containerTest', {
    chart: {
        type: 'bar',
        marginBottom: '70',
        marginLeft:'50'
    },
    title: {
        text: 'Avance Total'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [''],
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' Personas'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true

            }
        }
    },
    legend: {
        itemStyle: {
            
            color: '#000000',
            fontSize: "9px",
            textOverflow: "ellipsis",
            itemWidth: '2',
            margin:'1'
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'REQUERIDOS',
        data: [ parseInt(data)]
    }, {
        name: 'POSTULANTES',
        data: [parseInt(data1)]

    }
    , {
        name: 'CAPACITADOS',
        data: [parseInt(data2)]
    
    }
    , {
        name: 'SELECCIONADOS',
        data: [parseInt(data3)]
    
    }
    , {
        name: 'CONTRATADOS',
        data: [parseInt(data4)]
    
    }]
});
}

function graficoBarras(data,data1){
    //$("highcharts-credits").removeClass('highcharts-credits')
    Highcharts.chart('containerTest', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Avance Total'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [''],
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' Personas'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    
    credits: {
        enabled: false
    },
    series: [{
        name: 'POSTULANTES',
        data: [ parseInt(data1)]
    }, {
        name: 'REQUERIDOS',
        data: [parseInt(data)]
    }]
});
}

/*function grafico(data,data1){
    


    Highcharts.chart('container', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'Avance Total',
            align: 'center',
            verticalAlign: 'middle',
            y: 30
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            pie: {
                showInLegend: true,
                dataLabels: {
                     enabled: false
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '150%'
            }
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['POSTULANTES', parseInt(data1)],
                ['REQUERIDOS', parseInt(data)],
            ]
        }]
    });

}*/

 function verComuna(data){
    /*console.log(typeof(data));
    console.log(data);*/
    if($.fn.dataTable.isDataTable('#table-capacitados')){
        $('#table-capacitados').DataTable().destroy();
        $('#lista-capacitados').empty();
    }
    
    //console.log(data.data_comuna)
    console.log(Object.entries(data.data_comuna))
    var data1=Object.entries(data.data_comuna);
        data1=data1[11][1]
    console.log(data1)
    var tablaD = $("#table-capacitados").DataTable({
        dom: "<'search'f>",
        buttons: [
            {
                extend: 'excel',
                title: 'Postulantes',
                 exportOptions: {
                    columns: [ 0,1, 2, 3, 4, 5, 6],
                }
            }
        ],
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslation,
        lengthChange: true,
        info: false,
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
        searching: true,
        data: data1,
        responsive: true, 
        columns:[
            {data: "rut"},
            {data: "nombre"},
            {data: "apellido"},
            {data: "asistencia",className: "text-center"},
            {data: "tecnica_pts",className: "text-center"},
            {data: "psicologica_pts",className: "text-center"},
            {data: "estado",className: "text-center",
                render: function(data, type, row){  
                    if (data==true) {
                        return 'Aprobado'
                    } else {
                         return 'Reprobado'
                    }
                    
                   
                }
            }
        ],
        "rowCallback": function( row, data ) {
           
        },
  });
    
    $("#descargar-listado").on("click", function () {
        tablaD.button('.buttons-excel').trigger();
    });
  
    $('#confirmaAsistencia').modal({ keyboard: false},'show') 


    }


function verCapComuna(data){
    console.log(data)
    if($.fn.dataTable.isDataTable('#table-capacitaciones')){
        $('#table-capacitaciones').DataTable().destroy();
        $('#lista-capacitaciones').empty();
    }
    

    var tablaD = $("#table-capacitaciones").DataTable({
        dom: "<'search'f>",
        buttons: [
            {
                extend: 'excel',
                title: 'Postulantes',
                    exportOptions: {
                    columns: [ 0,1, 2, 3, 4, 5, 6],
                }
            }
        ],
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslation,
        lengthChange: true,
        info: false,
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
        searching: true,
        data: data,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "lugar"},
            {data: "fecha_hora"},
            {data: "nombre"},
            {data: "run",className: "text-center"},
            {data: "archivo",
                render: function(data, type, full, meta){
                    if(data != null){
                        var url = webservice + "/monitoreo/capacitaciones/descarga-archivo/" + data;
                        return "<a href='" + url + "'>DESCARGAR</a>";
                    }else{
                        return "Sin archivo"
                    }
                    
                }
            },
        ],
        "rowCallback": function( row, data ) {
            
        },
    });
    
    // $("#descargar-listado").on("click", function () {
    //     tablaD.button('.buttons-excel').trigger();
    // });
    
    $('#modal_caps').modal({ keyboard: false},'show') 
}
    
function obtenerCapacitaciones(nombreComuna){
    console.log(nombreComuna)
    $.ajax({
        method: 'POST',
        url: webservice + '/monitoreo/capacitaciones-por-comuna',
        headers: {
        },
        crossDomain: true,
        dataType: 'text',
        data: {
            nombre_comuna: nombreComuna,
        },
        success: function (data, textStatus, jqXHR) {
            dataCap = JSON.parse(data);
            console.log(dataCap.resultado)
            if(dataCap.resultado != "error"){
                verCapComuna(dataCap.descripcion)
            }else{
                showFeedback("warning", dataCap.descripcion, "Sin capacitaciones");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showFeedback("error", "Error en el servidor", "Datos incorrectos");
        }
    })
}


function llenarVista2(data, data2, data3) {
    $('#filtros-zonal').empty();
    if ($.fn.dataTable.isDataTable('#table-zonal')) {
        $('#table-zonal').DataTable().destroy();
        $('#lista-zonal').empty();
    }
    trData = '';
    nro = 1;
    var requeridos_totales = 0;
    var requeridos_totalesPer = 0;
    for (var j = 0; j < data.length; j++) {
        for (var k = 0; k < data[j]["data_region"].length; k++) {
            if ($("#select-view").val() == 1) {
                var comunaP= data[j]["data_region"][k];
                var req = data[j]["data_region"][k].data_comuna.requeridos != null ? data[j]["data_region"][k].data_comuna.requeridos : 0
                var sum = data[j]["data_region"][k].data_comuna.reclutado + data[j]["data_region"][k].data_comuna.capacitado + data[j]["data_region"][k].data_comuna.seleccionado + data[j]["data_region"][k].data_comuna.contratado
                var porcentaje = data[j]["data_region"][k].data_comuna.postulante * 100;
                porcentaje = sum == 0 ? 0 : porcentaje / sum;
                var conDecimal = porcentaje.toFixed(0);
                requeridos_totalesPer += req;
                trData += '<tr>';
                trData += '<td style="text-align:center">' + nro + '</td>'
                trData += '<td>' + data[j]["region"] + '</td>'
                trData += '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData += '<td id="requeridos2_' + nro + '" style="text-align:center">' + req + '</td>'
                trData += '<td id="preselected2_' + nro + '" style="text-align:center">' + data[j]["data_region"][k].data_comuna.postulante + '</td>'
                trData += '<td id="tototalcol2_' + nro + '" style="text-align:center">' + conDecimal + '%</td>'
                trData += '<td id="supervisor2_' + nro + '" style="text-align:center">' + data[j]["data_region"][k].data_comuna.reclutado + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.capacitado + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.seleccionado + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.contratado + '</td>'
                trData += "<td style='text-align:center' id='btnHiden_"+nro+"'><button type='button' id='comuna_"+nro+"' onclick='verComuna("+ JSON.stringify(comunaP) +")'  class='btn btn-volver' style='min-width: 89px;''>Ver</button></td>"
                trData += '</tr>';
                nro++;
            }
            if ($("#select-view").val() == 2) {
                var comunaP= data[j]["data_region"][k];
                var nombre_comuna = comunaP.data_comuna.nombre_comuna;
                var sum = data[j]["data_region"][k].data_comuna.wnsUnicos
                var one = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                one = one.Supervisor == null ? 0 : one.Supervisor;
                var two = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                two = two.Examinador == null ? 0 : two.Examinador
                var three = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                three = three.examinador_de_apoyor == null ? 0 : three.examinador_de_apoyor
                var four = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                four = four.anfitrion == null ? 0 : four.anfitrion;
                var sumrquerido = parseInt(one) + parseInt(two) + parseInt(three) + parseInt(four)
                var porcentaje = sum * 100;
                porcentaje = sumrquerido == 0 ? 0 : porcentaje / sumrquerido;
                var conDecimal = porcentaje.toFixed(0);
                requeridos_totales += sumrquerido;
                trData += '<tr>';
                trData += '<td style="text-align:center">' + nro + '</td>'
                trData += '<td>' + data[j]["region"] + '</td>'
                trData += '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData += '<td id="1requeridos2_' + nro + '" style="text-align:center">' + sumrquerido + '</td>'
                trData += '<td id="preselected2_' + nro + '" style="text-align:center">' + sum + '</td>'
                trData += '<td id="tototalcol2_' + nro + '" style="text-align:center">' + conDecimal + '%</td>'
                trData += '<td id="supervisor2_' + nro + '" style="text-align:center">' + data[j]["data_region"][k].data_comuna.Supervisor + '</td>'
                trData += '<td style="text-align:center">' + sum + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.examinador_de_apoyo + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.anfitrion + '</td>'
                trData += sum==0?"<td style='text-align:center' ><button type='button' id='comuna1_"+nro+"' onclick='verComuna("+ JSON.stringify(comunaP) +")' class='btn btn-volver btn-volver1' style='min-width: 40px;max-height: 29px;border: none !important;' title='Capacitados' disabled><i class='fa fa-user'></i></button>" +
                            "<button type='button'  id = 'caps_comuna_"+nro+"' onclick=obtenerCapacitaciones(\'"+ nombre_comuna +"\') class='btn btn-volver btn-volver1' style='min-width: 40px;max-height: 29px;border: none !important;' title='Capacitaciones' disabled><i class='fa fa-briefcase'></i></button></td>":"<td style='text-align:center' ><button type='button' id='comuna1_"+nro+"' onclick='verComuna("+ JSON.stringify(comunaP) +")' class='btn btn-volver' style='min-width: 40px;max-height: 29px;border: none !important;' title='Capacitados'><i class='fa fa-user'></i></button>" +
                            "<button type='button' id = 'caps_comuna_"+nro+"' onclick=obtenerCapacitaciones(\'"+ nombre_comuna +"\') class='btn btn-volver' style='min-width: 40px;max-height: 29px;border: none !important;' title='Capacitaciones'><i class='fa fa-briefcase'></i></button></td>";
                trData += '</tr>';
                nro++;

                
                //data[j]["data_region"][k].data_comuna.Examinador
            }
        }
    }
    
    $('#lista-zonal').append(trData);

    var tablaD = $("#table-zonal").DataTable({
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
        data: data.coordinador_zonal,
        responsive: true,
        "rowCallback": function (row, data) {
            examinador++;
        },
        "initComplete": function (settings, json) {
            var placeholder = ["", "Región", "Comuna"]
            this.api().columns([1, 2]).every(function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectZ_' + index + '" >' +
                    '<option value="" selected="selected">' + placeholder[index] + '</option></select>')
                    .appendTo($('#filtros-zonal'))
                    .on('change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
                        column
                            .search(val ? '^' + val + '$' : '', true, false)
                            .draw();
                    });
                column.data().unique().each(function (d, j) {
                    if (d != null) {
                        $('#selectZ_' + index).append('<option value="' + d.charAt(0).toUpperCase() + d.slice(1) + '">' + d.charAt(0).toUpperCase() + d.slice(1) + '</option>')
                    }
                });
                $('#selectZ_' + index).niceSelect();
            })
            $('.dataTables_length select').addClass('nice-select small');
        },

        "drawCallback": function () {
            var placeholder = ["", "Región", "Comuna"]
            this.api().columns([1, 2]).every(function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectZ_" + index)
                if (selectFiltered.val() === '') {
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">' + placeholder[index] + '</option>')
                    columnFiltered.column(index, { search: 'applied' }).data().unique().each(function (d, j) {
                        if (d != null) {
                            selectFiltered.append('<option value="' + d.charAt(0).toUpperCase() + d.slice(1) + '">' + d.charAt(0).toUpperCase() + d.slice(1) + '</option>')
                        }
                    });
                }
                $('select').niceSelect('update');
            })
        }
    });

    if ($("#select-view").val() == 1) {
        $('#graficofig2').addClass('highcharts-figure2')
        $('#graficopar2').addClass('highcharts-description2')
        $('#graficofig2').removeClass('highcharts-figure')
        $('#graficopar2').removeClass('highcharts-description')
        grafico2Barras2(requeridos_totalesPer,data2.postulante,data2.capacitado,data2.seleccionado,data2.contratado)
        //grafico2(requeridos_totalesPer,data2.reclutado + data2.seleccionado + data2.capacitado + data2.contratado)
        $("#change_accion2").hide();
        $("#clear-filtros2").hide();
        $("#change_post2").hide();
        for (var w = 0; w < nro; w++) {
            $("#supervisor2_" + w).hide();
            $('#btnHiden_' + w).hide();
            $('#comuna_' + w).hide();
        }
        $('#total_supervisor2').html(data2.postulante)
        $('#total_capacitados2').html(data2.capacitado)
        $('#total_seleccionados2').html(data2.seleccionado)
        $('#total_contratados2').html(data2.contratado)
        $('#ttotal2').html(data2.reclutado + data2.seleccionado + data2.capacitado + data2.contratado)
    }
    if ($("#select-view").val() == 2) {
        $('#graficofig2').addClass('highcharts-figure')
        $('#graficopar2').addClass('highcharts-description')
        $('#graficofig2').removeClass('highcharts-figure2')
        $('#graficopar2').removeClass('highcharts-description2')
        graficoBarras2(requeridos_totales,data3)
        //grafico2(requeridos_totales,data3)
        $("#change_accion2").show();
        for (var w = 0; w < nro; w++) {
            $("#supervisor2_" + w).show();
            $("#preselected2_" + w).show();
        }
        $("#clear-filtros2").show();
        $("#change_post2").show();
        $("#change_aventg2").show()
        $('#total_supervisor2').html(data2.Supervisor)
        $('#total_capacitados2').html(data2.Examinador)
        $('#total_seleccionados2').html(data2.examinador_de_apoyo)
        $('#total_contratados2').html(data2.anfitrion)
        $('#ttotal2').html(data3)
    }

    $('#limpiar-filtros-zonal').click(btnClearFilters);
    $("#table-zonal").show();
}

function grafico2Barras2(data,data1,data2,data3,data4){
    //$("highcharts-credits").removeClass('highcharts-credits')
    Highcharts.chart('containerTest2', {
    chart: {
        type: 'bar',
        marginBottom: '70',
        marginLeft:'50'
    },
    title: {
        text: 'Avance Total'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [''],
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' Personas'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true

            }
        }
    },
    legend: {
        itemStyle: {
            
            color: '#000000',
            fontSize: "9px",
            textOverflow: "ellipsis",
            itemWidth: '2',
            margin:'1'
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'REQUERIDOS',
        data: [ parseInt(data)]
    }, {
        name: 'POSTULANTES',
        data: [parseInt(data1)]

    }
    , {
        name: 'CAPACITADOS',
        data: [parseInt(data2)]
    
    }
    , {
        name: 'SELECCIONADOS',
        data: [parseInt(data3)]
    
    }
    , {
        name: 'CONTRATADOS',
        data: [parseInt(data4)]
    
    }]
});
}

function graficoBarras2(data,data1){
    //$("highcharts-credits").removeClass('highcharts-credits')
    Highcharts.chart('containerTest2', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Avance Total'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [''],
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' Personas'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    
    credits: {
        enabled: false
    },
    series: [{
        name: 'CAPACITADOS',
        data: [ parseInt(data1)]
    }, {
        name: 'REQUERIDOS',
        data: [parseInt(data)]
    }]
});
}

/*function grafico2(data,data1){
    


    Highcharts.chart('container2', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'Avance Total',
            align: 'center',
            verticalAlign: 'middle',
            y: 30
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            pie: {
                showInLegend: true,
                dataLabels: {
                     enabled: false
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '150%'
            }
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['CAPACITADOS', parseInt(data1)],
                ['REQUERIDOS', parseInt(data)],
            ]
        }]
    });

}*/

function llenarVista3(data, data2, data3) {
    $('#filtros-regional').empty();
    if ($.fn.dataTable.isDataTable('#table-regional')) {
        $('#table-regional').DataTable().destroy();
        $('#lista-regional').empty();
    }

    trData = '';
    nro = 1;
    var requeridos_totales =0;
    var requeridos_totalesPer =0;
    for (var j = 0; j < data.length; j++) {
        for (var k = 0; k < data[j]["data_region"].length; k++) {
            if ($("#select-view").val() == 1) {
                var req = data[j]["data_region"][k].data_comuna.requeridos != null ? data[j]["data_region"][k].data_comuna.requeridos : 0
                var sum = data[j]["data_region"][k].data_comuna.reclutado + data[j]["data_region"][k].data_comuna.capacitado + data[j]["data_region"][k].data_comuna.seleccionado + data[j]["data_region"][k].data_comuna.contratado
                var porcentaje = data[j]["data_region"][k].data_comuna.postulante * 100;
                porcentaje = sum == 0 ? 0 : porcentaje / sum;
                var conDecimal = porcentaje.toFixed(0);
                requeridos_totalesPer += req;
                trData += '<tr>';
                trData += '<td style="text-align:center">' + nro + '</td>'
                trData += '<td>' + data[j]["region"] + '</td>'
                trData += '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData += '<td id="requeridos3_' + nro + '" style="text-align:center">' + req + '</td>'
                trData += '<td id="preselected3_' + nro + '" style="text-align:center">' + data[j]["data_region"][k].data_comuna.postulante + '</td>'
                trData += '<td id="tototalcol3_' + nro + '" style="text-align:center">' + conDecimal + '%</td>'
                trData += '<td id="supervisor3_' + nro + '" style="text-align:center">' + data[j]["data_region"][k].data_comuna.reclutado + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.capacitado + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.seleccionado + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.contratado + '</td>'
                //trData += '<td style="text-align:center">THE FAKING BUTTON</td>'
                trData += '</tr>';
                nro++;
            }
            if ($("#select-view").val() == 2) {
                var sum = data[j]["data_region"][k].data_comuna.wnsUnicos
                var one = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                one = one.Supervisor == null ? 0 : one.Supervisor;
                var two = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                two = two.Examinador == null ? 0 : two.Examinador
                var three = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                three = three.examinador_de_apoyor == null ? 0 : three.examinador_de_apoyor
                var four = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                four = four.anfitrion == null ? 0 : four.anfitrion;
                var sumrquerido = parseInt(one) + parseInt(two) + parseInt(three) + parseInt(four)
                var porcentaje = sum * 100;
                porcentaje = sumrquerido == 0 ? 0 : porcentaje / sumrquerido;
                var conDecimal = porcentaje.toFixed(0);
                requeridos_totales += sumrquerido;
                trData += '<tr>';
                trData += '<td style="text-align:center">' + nro + '</td>'
                trData += '<td>' + data[j]["region"] + '</td>'
                trData += '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData += '<td id="1requeridos3_' + nro + '" style="text-align:center">' + sumrquerido + '</td>'
                trData += '<td id="preselected3_' + nro + '" style="text-align:center">' + sum + '</td>'
                trData += '<td id="tototalcol3_' + nro + '" style="text-align:center">' + conDecimal + '%</td>'
                trData += '<td id="supervisor3_' + nro + '" style="text-align:center">' + data[j]["data_region"][k].data_comuna.Supervisor + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.Examinador + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.examinador_de_apoyo + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.anfitrion + '</td>'
                //trData += '<td style="text-align:center">THE FAKING BUTTON</td>'
                trData += '</tr>';
                nro++;
            }
        }
    }
    
    $('#lista-regional').append(trData);

    var tablaD = $("#table-regional").DataTable({
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
        data: data.coordinador_regional,
        responsive: true,
        "rowCallback": function (row, data) {
            examinadorap++;
        },

        "initComplete": function (settings, json) {
            var placeholder = ["", "Región", "Comuna"]
            this.api().columns([1, 2]).every(function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectR_' + index + '" >' +
                    '<option value="" selected="selected">' + placeholder[index] + '</option></select>')
                    .appendTo($('#filtros-regional'))
                    .on('change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
                        column
                            .search(val ? '^' + val + '$' : '', true, false)
                            .draw();
                    });

                column.data().unique().each(function (d, j) {
                    if (d != null) {
                        $('#selectR_' + index).append('<option value="' + d.charAt(0).toUpperCase() + d.slice(1) + '">' + d.charAt(0).toUpperCase() + d.slice(1) + '</option>')
                    }
                });
                $('#selectR_' + index).niceSelect();
            })
            $('.dataTables_length select').addClass('nice-select small');
        },

        "drawCallback": function () {
            var placeholder = ["", "Región", "Comuna"]
            this.api().columns([1, 2]).every(function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectR_" + index)
                if (selectFiltered.val() === '') {
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">' + placeholder[index] + '</option>')
                    columnFiltered.column(index, { search: 'applied' }).data().unique().each(function (d, j) {
                        if (d != null) {
                            selectFiltered.append('<option value="' + d.charAt(0).toUpperCase() + d.slice(1) + '">' + d.charAt(0).toUpperCase() + d.slice(1) + '</option>')
                        }
                    });
                }
                $('select').niceSelect('update');
            })
        }
    });

    if ($("#select-view").val() == 1) {
        $('#graficofig3').addClass('highcharts-figure2')
        $('#graficopar3').addClass('highcharts-description2')
        $('#graficofig3').removeClass('highcharts-figure')
        $('#graficopar3').removeClass('highcharts-description')
        grafico3Barras3(requeridos_totalesPer,data2.postulante,data2.capacitado,data2.seleccionado,data2.contratado)
        //grafico3(requeridos_totalesPer,data2.reclutado + data2.seleccionado + data2.capacitado + data2.contratado)
        $("#clear-filtros3").hide();
        $("#change_post3").hide();
        for (var w = 0; w < nro; w++) {
            $("#supervisor3_" + w).hide();
        }
        $('#total_supervisor3').html(data2.postulante)
        $('#total_capacitados3').html(data2.capacitado)
        $('#total_seleccionados3').html(data2.seleccionado)
        $('#total_contratados3').html(data2.contratado)
        $('#ttotal3').html(data2.reclutado + data2.seleccionado + data2.capacitado + data2.contratado)
    }
    if ($("#select-view").val() == 2) {
        $('#graficofig3').addClass('highcharts-figure')
        $('#graficopar3').addClass('highcharts-description')
        $('#graficofig3').removeClass('highcharts-figure2')
        $('#graficopar3').removeClass('highcharts-description2')
        graficoBarras3(requeridos_totales,data3)
        //grafico3(requeridos_totales,data3)
        for (var w = 0; w < nro; w++) {
            $("#supervisor3_" + w).show();
            $("#preselected3_" + w).show();
        }
        $("#clear-filtros3").show();
        $("#change_post3").show();
        $("#change_aventg3").show()
        $('#total_supervisor3').html(data2.Supervisor)
        $('#total_capacitados3').html(data2.Examinador)
        $('#total_seleccionados3').html(data2.examinador_de_apoyo)
        $('#total_contratados3').html(data2.anfitrion)
        $('#ttotal3').html(data3)
    }
    $('#limpiar-filtros-examinadorap').click(btnClearFilters);
    $("#table-regional").show();
}
function grafico3Barras3(data,data1,data2,data3,data4){
    //$("highcharts-credits").removeClass('highcharts-credits')
    Highcharts.chart('containerTest3', {
    chart: {
        type: 'bar',
        marginBottom: '70',
        marginLeft:'50'
    },
    title: {
        text: 'Avance Total'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [''],
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' Personas'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true

            }
        }
    },
    legend: {
        itemStyle: {
            
            color: '#000000',
            fontSize: "9px",
            textOverflow: "ellipsis",
            itemWidth: '2',
            margin:'1'
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'REQUERIDOS',
        data: [ parseInt(data)]
    }, {
        name: 'POSTULANTES',
        data: [parseInt(data1)]

    }
    , {
        name: 'CAPACITADOS',
        data: [parseInt(data2)]
    
    }
    , {
        name: 'SELECCIONADOS',
        data: [parseInt(data3)]
    
    }
    , {
        name: 'CONTRATADOS',
        data: [parseInt(data4)]
    
    }]
});
}
function graficoBarras3(data,data1){
    //$("highcharts-credits").removeClass('highcharts-credits')
    Highcharts.chart('containerTest3', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Avance Total'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [''],
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' Personas'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    
    credits: {
        enabled: false
    },
    series: [{
        name: 'SELECCIONADOS',
        data: [ parseInt(data1)]
    }, {
        name: 'REQUERIDOS',
        data: [parseInt(data)]
    }]
});
}
/*function grafico3(data,data1){
    


    Highcharts.chart('container3', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'Avance Total',
            align: 'center',
            verticalAlign: 'middle',
            y: 30
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            pie: {
                showInLegend: true,
                dataLabels: {
                     enabled: false
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '150%'
            }
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['SELECCIONADOS', parseInt(data1)],
                ['REQUERIDOS', parseInt(data)],
            ]
        }]
    });

}*/


function llenarVista4(data, data2, data3) {
    $('#filtros-centro').empty();
    if ($.fn.dataTable.isDataTable('#table-centro')) {
        $('#table-centro').DataTable().destroy();
        $('#lista-centro').empty();
    }

    trData = '';
    nro = 1;
    var requeridos_totales=0;
    var requeridos_totalesPer=0;
    for (var j = 0; j < data.length; j++) {
        for (var k = 0; k < data[j]["data_region"].length; k++) {
            if ($("#select-view").val() == 1) {
                var req = data[j]["data_region"][k].data_comuna.requeridos != null ? data[j]["data_region"][k].data_comuna.requeridos : 0
                var sum = data[j]["data_region"][k].data_comuna.reclutado + data[j]["data_region"][k].data_comuna.capacitado + data[j]["data_region"][k].data_comuna.seleccionado + data[j]["data_region"][k].data_comuna.contratado
                var porcentaje = data[j]["data_region"][k].data_comuna.postulante * 100;
                porcentaje = sum == 0 ? 0 : porcentaje / sum;
                var conDecimal = porcentaje.toFixed(0);
                requeridos_totalesPer += req;
                trData += '<tr>';
                trData += '<td style="text-align:center">' + nro + '</td>'
                trData += '<td>' + data[j]["region"] + '</td>'
                trData += '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData += '<td id="requeridos4_' + nro + '" style="text-align:center">' + req + '</td>'
                trData += '<td id="preselected4_' + nro + '" style="text-align:center">' + data[j]["data_region"][k].data_comuna.postulante + '</td>'
                trData += '<td id="tototalcol4_' + nro + '" style="text-align:center">' + conDecimal + '%</td>'
                trData += '<td id="supervisor4_' + nro + '" style="text-align:center">' + data[j]["data_region"][k].data_comuna.reclutado + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.capacitado + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.seleccionado + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.contratado + '</td>'
                //trData += '<td style="text-align:center">THE FAKING BUTTON</td>'
                trData += '</tr>';
                nro++;
            }
            if ($("#select-view").val() == 2) {
                var sum = data[j]["data_region"][k].data_comuna.wnsUnicos
                var one = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                one = one.Supervisor == null ? 0 : one.Supervisor;
                var two = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                two = two.Examinador == null ? 0 : two.Examinador
                var three = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                three = three.examinador_de_apoyor == null ? 0 : three.examinador_de_apoyor
                var four = data[j]["data_region"][k].data_comuna.requeridos == null ? 0 : data[j]["data_region"][k].data_comuna.requeridos;
                four = four.anfitrion == null ? 0 : four.anfitrion;
                var sumrquerido = parseInt(one) + parseInt(two) + parseInt(three) + parseInt(four)
                var porcentaje = sum * 100;
                porcentaje = sumrquerido == 0 ? 0 : porcentaje / sumrquerido;
                var conDecimal = porcentaje.toFixed(0);
                requeridos_totales += sumrquerido
                trData += '<tr>';
                trData += '<td style="text-align:center">' + nro + '</td>'
                trData += '<td>' + data[j]["region"] + '</td>'
                trData += '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData += '<td id="1requeridos4_' + nro + '" style="text-align:center">' + sumrquerido + '</td>'
                trData += '<td id="preselected4_' + nro + '" style="text-align:center">' + sum + '</td>'
                trData += '<td id="tototalcol4_' + nro + '" style="text-align:center">' + conDecimal + '%</td>'
                trData += '<td id="supervisor4_' + nro + '" style="text-align:center">' + data[j]["data_region"][k].data_comuna.Supervisor + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.Examinador + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.examinador_de_apoyo + '</td>'
                trData += '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.anfitrion + '</td>'
                //trData += '<td style="text-align:center">THE FAKING BUTTON</td>'
                trData += '</tr>';
                nro++;
            }
        }
    }
    
    $('#lista-centro').append(trData);
    var tablaD = $("#table-centro").DataTable({
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
        data: data.coordinador_centro,
        responsive: true,
        "rowCallback": function (row, data) {
            

            anfitrion++;
        },

        "initComplete": function (settings, json) {
            var placeholder = ["", "Región", "Comuna"]
            this.api().columns([1, 2]).every(function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectC_' + index + '" >' +
                    '<option value="" selected="selected">' + placeholder[index] + '</option></select>')
                    .appendTo($('#filtros-centro'))
                    .on('change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
                        column
                            .search(val ? '^' + val + '$' : '', true, false)
                            .draw();
                    });
                column.data().unique().each(function (d, j) {
                    if (d != null) {
                        $('#selectC_' + index).append('<option value="' + d.charAt(0).toUpperCase() + d.slice(1) + '">' + d.charAt(0).toUpperCase() + d.slice(1) + '</option>')
                    }
                });
                $('#selectC_' + index).niceSelect();
            })
            $('.dataTables_length select').addClass('nice-select small');
        },

        "drawCallback": function () {
            var placeholder = ["", "Región", "Comuna"]
            this.api().columns([1, 2]).every(function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectC_" + index)
                if (selectFiltered.val() === '') {
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">' + placeholder[index] + '</option>')
                    columnFiltered.column(index, { search: 'applied' }).data().unique().each(function (d, j) {
                        if (d != null) {
                            selectFiltered.append('<option value="' + d.charAt(0).toUpperCase() + d.slice(1) + '">' + d.charAt(0).toUpperCase() + d.slice(1) + '</option>')
                        }
                    });
                }
                $('select').niceSelect('update');
            })
        }
    });

    if ($("#select-view").val() == 1) {
        $('#graficofig4').addClass('highcharts-figure2')
        $('#graficopar4').addClass('highcharts-description2')
        $('#graficofig4').removeClass('highcharts-figure')
        $('#graficopar4').removeClass('highcharts-description')
        grafico4Barras4(requeridos_totalesPer,data2.postulante,data2.capacitado,data2.seleccionado,data2.contratado)
        //graficoBarras4(requeridos_totalesPer,data2.postulante)
        //grafico4(requeridos_totalesPer,data2.reclutado + data2.seleccionado + data2.capacitado + data2.contratado)
        
        $("#clear-filtros4").hide();
        $("#change_pos4").hide();
        for (var w = 0; w < nro; w++) {
            $("#supervisor4_" + w).hide();
        }
        $('#total_supervisor4').html(data2.postulante)
        $('#total_capacitados4').html(data2.capacitado)
        $('#total_seleccionados4').html(data2.seleccionado)
        $('#total_contratados4').html(data2.contratado)
        $('#ttotal4').html(data2.reclutado + data2.seleccionado + data2.capacitado + data2.contratado)
    }
    if ($("#select-view").val() == 2) {
        $('#graficofig4').addClass('highcharts-figure')
        $('#graficopar4').addClass('highcharts-description')
        $('#graficofig4').removeClass('highcharts-figure2')
        $('#graficopar4').removeClass('highcharts-description2')
        graficoBarras4(requeridos_totales,data3)
        //grafico4(requeridos_totales,data3)
       
        for (var w = 0; w < nro; w++) {
            $("#supervisor4_" + w).show();
            $("#preselected4_" + w).show();
        }
        $("#clear-filtros4").show();
        $("#change_pos4").show();
        $("#change_aventg4").show()
        $('#total_supervisor4').html(data2.Supervisor)
        $('#total_capacitados4').html(data2.Examinador)
        $('#total_seleccionados4').html(data2.examinador_de_apoyo)
        $('#total_contratados4').html(data2.anfitrion)
        $('#ttotal4').html(data3)
    }
    $('#limpiar-filtros-anfitrion').click(btnClearFilters);
    $("#table-centro").show();
}

function grafico4Barras4(data,data1,data2,data3,data4){
    //$("highcharts-credits").removeClass('highcharts-credits')
    Highcharts.chart('containerTest4', {
    chart: {
        type: 'bar',
        marginBottom: '70',
        marginLeft:'50'
    },
    title: {
        text: 'Avance Total'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [''],
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' Personas'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true

            }
        }
    },
    legend: {
        itemStyle: {
            
            color: '#000000',
            fontSize: "9px",
            textOverflow: "ellipsis",
            itemWidth: '2',
            margin:'1'
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'REQUERIDOS',
        data: [ parseInt(data)]
    }, {
        name: 'POSTULANTES',
        data: [parseInt(data1)]

    }
    , {
        name: 'CAPACITADOS',
        data: [parseInt(data2)]
    
    }
    , {
        name: 'SELECCIONADOS',
        data: [parseInt(data3)]
    
    }
    , {
        name: 'CONTRATADOS',
        data: [parseInt(data4)]
    
    }]
});
}

function graficoBarras4(data,data1){
    //$("highcharts-credits").removeClass('highcharts-credits')
    Highcharts.chart('containerTest4', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Avance Total'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [''],
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' Personas'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    
    credits: {
        enabled: false
    },
    series: [{
        name: 'CONTRATADOS',
        data: [ parseInt(data1)]
    }, {
        name: 'REQUERIDOS',
        data: [parseInt(data)]
    }]
});
}
/*function grafico4(data,data1){
    


    Highcharts.chart('container4', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'Avance Total',
            align: 'center',
            verticalAlign: 'middle',
            y: 30
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            pie: {
                showInLegend: true,
                dataLabels: {
                     enabled: false
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '150%'
            }
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['CONTRATADOS', parseInt(data1)],
                ['REQUERIDOS', parseInt(data)],
            ]
        }]
    });

}*/

function btnClearFilters() {
    $('#select1').val("").niceSelect('update');
    $('#select2').val("").niceSelect('update');
    $('#selectZ_1').val("").niceSelect('update');
    $('#selectZ_2').val("").niceSelect('update');
    $('#selectR_1').val("").niceSelect('update');
    $('#selectR_2').val("").niceSelect('update');
    $('#selectC_1').val("").niceSelect('update');
    $('#selectC_2').val("").niceSelect('update');

    var table = $('#table-postulacion').DataTable();
    table
        .search('')
        .columns().search('')
        .draw();
    var table = $('#table-zonal').DataTable();
    table
        .search('')
        .columns().search('')
        .draw();
    var table = $('#table-regional').DataTable();
    table
        .search('')
        .columns().search('')
        .draw();
    var table = $('#table-centro').DataTable();
    table
        .search('')
        .columns().search('')
        .draw();
}

function verInscritos() {
    $.ajax({
        method: 'GET',
        url: webservice + '/monitoreo/inscritos-dia',
        headers: {
            't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType: 'text',
        data: {
            id_usuario: JSON.parse(localStorage.user).id_usuario,
        },
        success: function (data, textStatus, jqXHR) {
            data = JSON.parse(data);
            llenarInscritos(data)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showFeedback("error", "Error en el servidor", "Datos incorrectos");
        }
    })
}

function llenarInscritos(data) {
    $('#lista-inscritos').empty()
    for (i = 0; i < data.length; i++) {
        tr = '<tr class="text-center"><td>' + moment(data[i].fecha).format('DD-MM-YYYY') + '</td><td>' + data[i].inscritos + '</td></tr>'
        $('#lista-inscritos').append(tr)
    }
    $('#modalInscritos').modal({ backdrop: 'static', keyboard: false }, 'show')

}
