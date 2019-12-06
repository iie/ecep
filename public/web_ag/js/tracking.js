$(document).ready(function(){
    $.blockUI({  
        baseZ: 3000,
        message: '<img style="width: 10%;" src="img/loading.gif" />',
        css: {
            border:     'none',
            backgroundColor:'transparent',        
        } 
    }); 
    loginvalid(localStorage.getItem('user'))
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectModulo);

    $('#tipoGrafico').niceSelect();    
    $('#tipoGraficoAplicacion').niceSelect();  
    $('._selectGrafico').on('change',cambiarGrafico)
    $('._selectGraficoAplicacion').on('change',cambiarGraficoAplicacion)
    getDatosCapacitacion()
    getDatosAplicacion()
    grafico(1)
    graficoAplicacion(8)
});

function getDatosCapacitacion(){
    $.ajax({
        method:'GET',
        url: 'https://ufro.gruposentte.cl/webService/estadoCajas.php',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
        crossDomain: true,
        dataType:'json',
        success: function(data, textStatus, jqXHR) {
            //var dosobt = JSON.parse(data);
            llenarVistaCapacitacion(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
        }

    })
}
function getDatosAplicacion(){
    $.ajax({
        method:'GET',
        url: 'https://ufro.gruposentte.cl/webService/estadoCajasAplicacion.php',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
        crossDomain: true,
        dataType:'json',
        success: function(data, textStatus, jqXHR) {
            //var dosobt = JSON.parse(data);
            llenarVistaAplicacion(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
        }

    })
}

function llenarVistaCapacitacion(data){
    
    //data= JSON.parse(data)
  
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

function llenarVistaAplicacion(data){
    
    //data= JSON.parse(data)
  
    if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-trackingAplicacion')){
            $('#table-trackingAplicacion').DataTable().destroy();
            $('#lista-trackingAplicacion').empty();
        }
    }
 

    var tablaD = $("#table-trackingAplicacion").DataTable({
        //dom: "<'search'f>",
        buttons: [
            {
                extend: 'excel',
                title: 'Tracking Aplicación',
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
        scrollX: true,
        data: data,

        columns:[
            {data: "codigo"},
            {data: "region"},
            {data: "provincia"},
            {data: "comuna"},
            {data: "estado_8",className: "text-center",
                render: function(data, type, row){  
                    if(data == 'Si'){
                        return 'SI'
                    }else if(data == 'No'){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_9",className: "text-center",
                render: function(data, type, row){  
                    if(data == 'Si'){
                        return 'SI'
                    }else if(data == 'No'){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_10",className: "text-center",
                render: function(data, type, row){  
                    if(data == 'Si'){
                        return 'SI'
                    }else if(data == 'No'){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_11",className: "text-center",
                render: function(data, type, row){  
                    if(data == 'Si'){
                        return 'SI'
                    }else if(data == 'No'){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_12",className: "text-center",
                render: function(data, type, row){  
                    if(data == 'Si'){
                        return 'SI'
                    }else if(data == 'No'){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_13",className: "text-center",
                render: function(data, type, row){  
                    if(data == 'Si'){
                        return 'SI'
                    }else if(data == 'No'){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_14",className: "text-center",
                render: function(data, type, row){  
                    if(data == 'Si'){
                        return 'SI'
                    }else if(data == 'No'){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_15",className: "text-center",
                render: function(data, type, row){  
                    if(data == 'Si'){
                        return 'SI'
                    }else if(data == 'No'){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_18",className: "text-center",
                render: function(data, type, row){  
                    if(data == 'Si'){
                        return 'SI'
                    }else if(data == 'No'){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_19",className: "text-center",
                render: function(data, type, row){  
                    if(data == 'Si'){
                        return 'SI'
                    }else if(data == 'No'){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_20",className: "text-center",
                render: function(data, type, row){  
                    if(data == 'Si'){
                        return 'SI'
                    }else if(data == 'No'){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_21",className: "text-center",
                render: function(data, type, row){  
                    if(data == 'Si'){
                        return 'SI'
                    }else if(data == 'No'){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },
            {data: "estado_22",className: "text-center",
                render: function(data, type, row){  
                    if(data == 'Si'){
                        return 'SI'
                    }else if(data == 'No'){
                        return 'NO'
                    }else {
                        return '-'
                    }
                }
            },

        ],
        "rowCallback": function( row, data ) {
 
           $('td:eq(4)', row).html(data.estado_8 == 'Si' ? "<i style='color:green' class='icon-check'></i>" : data.estado_8)
           $('td:eq(5)', row).html(data.estado_9 == 'Si' ? "<i style='color:green' class='icon-check'></i>" : data.estado_9)
           $('td:eq(6)', row).html(data.estado_10 == 'Si' ? "<i style='color:green' class='icon-check'></i>" : data.estado_10)
           $('td:eq(7)', row).html(data.estado_11 == 'Si' ? "<i style='color:green' class='icon-check'></i>" : data.estado_11)
           $('td:eq(8)', row).html(data.estado_12 == 'Si' ? "<i style='color:green' class='icon-check'></i>" : data.estado_12)
           $('td:eq(9)', row).html(data.estado_13 == 'Si' ? "<i style='color:green' class='icon-check'></i>" : data.estado_13)
           $('td:eq(10)', row).html(data.estado_14 == 'Si' ? "<i style='color:green' class='icon-check'></i>" : data.estado_14)
           $('td:eq(11)', row).html(data.estado_15 == 'Si' ? "<i style='color:green' class='icon-check'></i>" : data.estado_15)
           $('td:eq(12)', row).html(data.estado_18 == 'Si' ? "<i style='color:green' class='icon-check'></i>" : data.estado_18)
           $('td:eq(13)', row).html(data.estado_19 == 'Si' ? "<i style='color:green' class='icon-check'></i>" : data.estado_19)
           $('td:eq(14)', row).html(data.estado_20 == 'Si' ? "<i style='color:green' class='icon-check'></i>" : data.estado_20)
           $('td:eq(15)', row).html(data.estado_21 == 'Si' ? "<i style='color:green' class='icon-check'></i>" : data.estado_21)
           $('td:eq(16)', row).html(data.estado_22 == 'Si' ? "<i style='color:green' class='icon-check'></i>" : data.estado_22)
        },
        "initComplete": function(settings, json) {

            var placeholder = ["","Región","Provincia","Comuna"]
            this.api().columns([1,2,3]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectA'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-trackingAplicacion'))
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
                        $('#selectA'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                    }
                } );
                $('#selectA'+index).niceSelect();    
            })   
            $('.dataTables_length select').addClass('nice-select small');         
        },

        "drawCallback": function(){
            var placeholder = ["","Región","Provincia","Comuna"]
            this.api().columns([1,2,3]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectA"+index)
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

    $('#limpiar-filtros-trackingAplicacion').click(btnClearFilters);
    $("#descargar-listaAplicacion").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });
    //PARCHE xD
 
    $('.search').css('position', 'inherit')
    $('.search').css('float', 'left')

    $('input[type=search]').css('height', 'calc(1.5em + 0.75rem + 2px)')
    $('input[type=search]').css('padding', '0.375rem 0.75rem')
    $('input[type=search]').css( 'font-size', '1rem')
    $('input[type=search]').css( 'font-weight', '400')
    $('input[type=search]').css( 'line-height', '1.5')
    $('input[type=search]').css( 'color', '#495057')
    $('input[type=search]').css( 'background-color', '#fff')
    $('input[type=search]').css( 'background-clip', 'padding-box')
    $('input[type=search]').css( 'border', '1px solid #e8e8e8')
    $('input[type=search]').css( 'border-radius',' 0.25rem')
    $('input[type=search]').css( 'transition',' border-color 0.15s ease-in-out box-shadow 0.15s ease-in-out')

    $.unblockUI()
    $("#table-trackingAplicacion").show(); 


}

function btnClearFilters(){
    $('#select1').val("").niceSelect('update');
    $('#select2').val("").niceSelect('update'); 
    $('#select3').val("").niceSelect('update'); 

    $('#selectA1').val("").niceSelect('update');
    $('#selectA2').val("").niceSelect('update'); 
    $('#selectA3').val("").niceSelect('update'); 

    var table = $('#table-tracking').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

    var table = $('#table-trackingAplicacion').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();
}

 
function cambiarGrafico (){
  
    grafico($('._selectGrafico  .selected').attr('data-value'))
}

function grafico(tipo){

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

function cambiarGraficoAplicacion (){
  
    graficoAplicacion($('._selectGraficoAplicacion  .selected').attr('data-value'))
}

function graficoAplicacion(tipo){

    $.ajax({
        method:'POST',
        url: 'https://ufro.gruposentte.cl/webService/dashboard_aplicacion.php',
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
            cargarGraficoAplicacion((data))
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
        }

    })

    tituloAplicacion = ''
    if(tipo == 8){
        tituloAplicacion = 'Porcentaje Validación Imprenta'
    }else if(tipo == 9){
        tituloAplicacion = 'Porcentaje Despacho a Centro de Operaciones'
    }else if(tipo == 10){
        tituloAplicacion = 'Porcentaje Recepción en Centro de Operaciones'
    }else if(tipo == 11){
        tituloAplicacion = 'Porcentaje Revisado en Centro de Operaciones'
    }else if(tipo == 12){
        tituloAplicacion = 'Porcentaje Despacho de Centro de Operaciones a Sede'
    }else if(tipo == 13){
        tituloAplicacion = 'Porcentaje Recepción en Sede'
    }else if(tipo == 14){
        tituloAplicacion = 'Porcentaje Revisión en Sede'
    }else if(tipo == 15){
        tituloAplicacion = 'Porcentaje Recepción de Caja en Sala'
    }else if(tipo == 18){
        tituloAplicacion = 'Porcentaje Cierre de Caja en Sede'
    }else if(tipo == 19){
        tituloAplicacion = 'Porcentaje Despacho de Sede a Centro de Operaciones'
    }else if(tipo == 20){
        tituloAplicacion = 'Porcentaje Recepción en Sede'
    }else if(tipo == 21){
        tituloAplicacion = 'Porcentaje Revisión de Pruebas Centro de Operaciones'
    }else if(tipo == 22){
        tituloAplicacion = 'Despacho de Centro de Operaciones a Central'
    }

}

function cargarGraficoAplicacion(array){
    datos = []
    datos[0] = array.slice(0,16);
    datos[1] = array[17];

    Highcharts.chart('graficoRegionAplicacion', {
        chart: {
            type: 'bar'
        },
        title: {
            text: tituloAplicacion
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

