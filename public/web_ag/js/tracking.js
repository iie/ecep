$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectModulo);

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "https://ufro.gruposentte.cl/index.php/CReportes/cargarTablaEstados"; // site that doesn’t send Access-Control-*
    fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
    .then(response => response.text())
    .then(contents => llenarVista(contents))
    .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))

    $('#tipoGrafico').niceSelect();    
    $('._selectGrafico').on('change',cambiarGrafico)
    //getDatos()
    grafico(1)
});

function getDatos(){
    $.ajax({
        method:'GET',
        url: 'https://ufro.gruposentte.cl/index.php/CReportes/cargarTablaEstados',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
        crossDomain: true,
        dataType:'json',
        success: function(data, textStatus, jqXHR) {
            var dosobt = JSON.parse(data);
            llenarVista(dosobt);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
        }

    })
}

function llenarVista(data){
    
    data= JSON.parse(data)
  
    if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-tracking')){
            $('#table-tracking').DataTable().destroy();
            $('#lista-tracking').empty();
        }
    }
 

    var tablaD = $("#table-tracking").DataTable({
        dom: "<'search'f>",
        buttons: [
            {
                extend: 'excel',
                title: 'Tracking',
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
        search: true,
        data: data,
        responsive: true, 
        columns:[
            {data: "codigo"},
            {data: "region"},
            {data: "provincia"},
            {data: "comuna"},
            {data: "estado_1",className: "text-center",
                render: function(data, type, row){  
                    if(data.includes('check')){
                        return 'SI'
                    }else if(data.includes('cross')){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_2",className: "text-center",
                render: function(data, type, row){  
                    if(data.includes('check')){
                        return 'SI'
                    }else if(data.includes('cross')){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_3",className: "text-center",
                render: function(data, type, row){  
                    if(data.includes('check')){
                        return 'SI'
                    }else if(data.includes('cross')){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_4",className: "text-center",
                render: function(data, type, row){  
                    if(data.includes('check')){
                        return 'SI'
                    }else if(data.includes('cross')){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_5",className: "text-center",
                render: function(data, type, row){  
                    if(data.includes('check')){
                        return 'SI'
                    }else if(data.includes('cross')){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_6",className: "text-center",
                render: function(data, type, row){  
                    if(data.includes('check')){
                        return 'SI'
                    }else if(data.includes('cross')){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_7",className: "text-center",
                render: function(data, type, row){  
                    if(data.includes('check')){
                        return 'SI'
                    }else if(data.includes('cross')){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },

        ],
        "rowCallback": function( row, data ) {
 
           $('td:eq(4)', row).html(data.estado_1)
           $('td:eq(5)', row).html(data.estado_2)
           $('td:eq(6)', row).html(data.estado_3)
           $('td:eq(7)', row).html(data.estado_4)
           $('td:eq(8)', row).html(data.estado_5)
           $('td:eq(9)', row).html(data.estado_6)
           $('td:eq(10)', row).html(data.estado_7)


        },
        "initComplete": function(settings, json) {

            var placeholder = ["","Región","Provincia","Comuna"]
            this.api().columns([1,2,3]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="select'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-tracking'))
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );

                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
                column.data().unique().each( function ( d, j ) {
                    if(d != null){
                        $('#select'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                    }
                } );
                $('#select'+index).niceSelect();    
            })   
            $('.dataTables_length select').addClass('nice-select small');         
        },

        "drawCallback": function(){
            var placeholder = ["","Región","Provincia","Comuna"]
            this.api().columns([1,2,3]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#select"+index)
                if(selectFiltered.val()===''){
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">'+placeholder[index]+'</option>')
                    columnFiltered.column(index,{search:'applied'}).data().unique().each( function ( d, j ) {
                        if(d != null){
                            selectFiltered.append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )    
                        }                 
                    } );
                }
                $('select').niceSelect('update');
            })
        }
    });

    $('#limpiar-filtros-tracking').click(btnClearFilters);
    $("#descargar-lista").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });
     
    $("#table-tracking").show(); 


}

function btnClearFilters(){
    $('#select1').val("").niceSelect('update');
    $('#select2').val("").niceSelect('update'); 
    $('#select3').val("").niceSelect('update'); 
    var table = $('#table-tracking').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();
}

 
function cambiarGrafico (){
  
    grafico($('._selectGrafico  .selected').attr('data-value'))
}

function grafico(tipo){

    // Valores:
    //  ->      1: Entregado Por Imprenta
    //  2: Despachado a Centro de Operaciones
    //  ->      3: Recepcionado por Centro de Operaciones
    //  4: Revisado en Centro de Operaciones
    //  5: Despacho de CO a CCA
    //  ->      6: Recepción en Centro de Capacitación
    //  7: Despachado a Bodega Central
    $.ajax({
        method:'POST',
        url: 'https://ufro.gruposentte.cl/webService/dashboard.php',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        crossDomain: true,
        data:{ 
            id_estado: tipo,
        },
        dataType:'json',
        success: function(data, textStatus, jqXHR) {
            console.log(data)
            cargarGrafico((data))
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
        }

    })

    titulo = ''
    if(tipo == 1){
        titulo = 'Porcentaje Validación Imprenta'
    }else if(tipo == 2){
        titulo = 'Porcentaje Despacho a Centro de Operaciones'
    }else if(tipo == 3){
        titulo = 'Porcentaje Recepción en Centro de Operaciones'
    }else if(tipo == 4){
        titulo = 'Porcentaje Revisado en Centro de Operaciones'
    }else if(tipo == 5){
        titulo = 'Porcentaje Despacho de Centro de Operaciones a Centro de Capacitación'
    }else if(tipo == 6){
        titulo = 'Porcentaje Recepción en Centro de Capacitación'
    }else if(tipo == 7){
        titulo = 'Porcentaje Despacho a Bodega Central'
    }
}

function cargarGrafico(array){
    datos = []
    datos[0] = array.slice(0,16);
    datos[1] = array[17];

    Highcharts.chart('graficoRegion', {
        chart: {
            type: 'bar'
        },
        title: {
            text: titulo
        },
        xAxis: {
            categories: datos[0],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            tickInterval: 10,
            title: {
                text: 'Porcentaje',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: '%'
        },
        plotOptions: {
            bar: {
              dataLabels: {
                enabled: true,
                format: '{y}%'
              }
          }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Porcentajes',
            data: datos[1]
        }]
    });
}