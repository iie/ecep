$(document).ready(function(){
 
    loginvalid(localStorage.getItem('user'))
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectModulo);
    //graficoRegular1()
    //graficoRegular2()
    getDatos()

 
});

function getDatos(){
    $.ajax({
        method:'GET',
        url: webservice + '/monitoreo/aplicacion/lista',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
        crossDomain: true,
        dataType:'json',
        success: function(data, textStatus, jqXHR) {
            //var dosobt = JSON.parse(data);
            llenarVistaRegular1(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
        }

    })
}
 

function llenarVistaRegular1(data){
    graficoRegular1(data.sumas_regular1[0])

    if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-regular1')){
            $('#table-regular1').DataTable().destroy();
            $('#lista-regular1').empty();
        }
    }
 

    var tablaD = $("#table-regular1").DataTable({
        dom: "",
        buttons: [
            {
                extend: 'excel',
                title: 'Regular',
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
        data: data.regular1,
        responsive: true, 
        columns:[
            {data: "id_sede_ecep"},
            {data: "region"},
            {data: "provincia"},
            {data: "comuna"},
            {data: "docentes", class:"text-center"},
            {data: "salas", class:"text-center"},
            {data: null, class:"text-center",
                render: function(data, type, row){  
                    return 0;
                }
            },
            {data: null, class:"text-center",
                render: function(data, type, row){  
                    return 0;
                }
            },
            {data: null, class:"text-center",
                render: function(data, type, row){  
                    return 0;
                }
            },
            {data: null, class:"text-center",
                render: function(data, type, row){  
                    return 0;
                }
            },
            {data: null, class:"text-center",
                render: function(data, type, row){  
                    return 0;
                }
            },
            {data: null, class:"text-center",
                render: function(data, type, row){ 
                    return data.docentes - 0;
                }
            },
            {data: null, class:"text-center",
                render: function(data, type, row){  
                    return 0;
                }
            },

        ],
        "initComplete": function(settings, json) {

            var placeholder = ["","Región","Provincia","Comuna"]
            this.api().columns([1,2,3]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectR1-'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-regular1'))
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
                        $('#selectR1-'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                    }
                } );
                $('#selectR1-'+index).niceSelect();    
            })   
            $('.dataTables_length select').addClass('nice-select small');         
        },

        "drawCallback": function(){
            var placeholder = ["","Región","Provincia","Comuna"]
            this.api().columns([1,2,3]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectR1-"+index)
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

    $('#limpiar-filtros-regular1').click(btnClearFilters);
    $("#descargar-lista-regular1").on("click", function() {
        //tablaD.button( '.buttons-excel' ).trigger();
    });
     
    $("#table-regular1").show(); 
    llenarVistaRegular2(data.regular2)
    graficoRegular2(data.sumas_regular2[0])
}

function llenarVistaRegular2(data){
    

    if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-regular2')){
            $('#table-regular2').DataTable().destroy();
            $('#lista-regular2').empty();
        }
    }
 

    var tablaD = $("#table-regular2").DataTable({
        dom: " ",
        buttons: [
            {
                extend: 'excel',
                title: 'Regular',
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
            {data: "id_sede_ecep"},
            {data: "region"},
            {data: "provincia"},
            {data: "comuna"},
            {data: "docentes", class:"text-center"},
            {data: "salas", class:"text-center"},
            {data: null, class:"text-center",
                render: function(data, type, row){  
                    return 0;
                }
            },
            {data: null, class:"text-center",
                render: function(data, type, row){  
                    return 0;
                }
            },
            {data: null, class:"text-center",
                render: function(data, type, row){  
                    return 0;
                }
            },
            {data: null, class:"text-center",
                render: function(data, type, row){  
                    return 0;
                }
            },
            {data: null, class:"text-center",
                render: function(data, type, row){  
                    return 0;
                }
            },
            {data: null, class:"text-center",
                render: function(data, type, row){ 
                    return data.docentes - 0;
                }
            },
            {data: null, class:"text-center",
                render: function(data, type, row){  
                    return 0;
                }
            },

        ],
        "initComplete": function(settings, json) {

            var placeholder = ["","Región","Provincia","Comuna"]
            this.api().columns([1,2,3]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectR2-'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-regular2'))
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
                        $('#selectR2-'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                    }
                } );
                $('#selectR2-'+index).niceSelect();    
            })   
            $('.dataTables_length select').addClass('nice-select small');         
        },

        "drawCallback": function(){
            var placeholder = ["","Región","Provincia","Comuna"]
            this.api().columns([1,2,3]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectR2-"+index)
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

    $('#limpiar-filtros-regular2').click(btnClearFilters);
    $("#descargar-lista-regular2").on("click", function() {
        //tablaD.button( '.buttons-excel' ).trigger();
    });
     
    $("#table-regular2").show(); 
}

function llenarVistaComplementaria(data){
    
    //data= JSON.parse(data)
  
    if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-complementaria')){
            $('#table-complementaria').DataTable().destroy();
            $('#lista-complementaria').empty();
        }
    }
 

    var tablaD = $("#table-complementaria").DataTable({
        dom: "<'search'f>",
        buttons: [
            {
                extend: 'excel',
                title: 'Regular',
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
            {data: "id_sede"},
            {data: "region"},
            {data: "provincia"},
            {data: "comuna"},
            {data: "profesores"},
            {data: "salas"},
            {data: "comuna"},
            {data: "comuna"},
            {data: "comuna"},
            {data: "ausentes"},
            {data: "asistencia"},

        ],
        "initComplete": function(settings, json) {

            var placeholder = ["","Región","Provincia","Comuna"]
            this.api().columns([1,2,3]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectC-'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-complementaria'))
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
                        $('#selectC'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                    }
                } );
                $('#selectC'+index).niceSelect();    
            })   
            $('.dataTables_length select').addClass('nice-select small');         
        },

        "drawCallback": function(){
            var placeholder = ["","Región","Provincia","Comuna"]
            this.api().columns([1,2,3]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectC"+index)
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

    $('#limpiar-filtros-centros').click(btnClearFilters);
    $("#descargar-lista").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });
     
    $("#table-complementaria").show(); 
}

function btnClearFilters(){
    $('#selectR1-1').val("").niceSelect('update');
    $('#selectR1-2').val("").niceSelect('update'); 
    $('#selectR1-3').val("").niceSelect('update'); 

    $('#selectR2-1').val("").niceSelect('update');
    $('#selectR2-2').val("").niceSelect('update'); 
    $('#selectR3-3').val("").niceSelect('update'); 

    var table = $('#table-regular1').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

    var table = $('#table-regular2').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();
}

function graficoRegular1(data){   
    salas = data.salas
    docentes = data.docentes
  
    Highcharts.chart('regular1-container1', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false, 
            spacingBottom: 0,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'REPORTES OPERATIVOS 9:00',
            align: 'center',
            verticalAlign: 'middle',
            y: 20,
            x:-30,
            style: {
                fontWeight: 'normal',
                fontSize: '13px',
                color:'#8c8992'
            }
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
                center: ['30%', '55%'],
                size: '100%',
                colors: ['#9270e5', '#9ea4bb']
            }

        },
        legend: {
            itemMarginTop: 20, 
            itemStyle:{
                fontSize: '8PX',
                fontWeight: 'normal',
                color:'#8c8992'
            },   
            x: -32,
            y: 17
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['SALAS CON EXAMINADOR', parseInt(14)],
                ['TOTAL', salas],
            ]
        }]
    });

    Highcharts.chart('regular1-container2', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false, 
            spacingBottom: 0,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'REPORTES OPERATIVOS 10:00',
            align: 'center',
            verticalAlign: 'middle',
            y: 20,
            x:-30,
            style: {
                fontWeight: 'normal',
                fontSize: '13px',
                color:'#8c8992'
            }
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
                center: ['30%', '55%'],
                size: '100%',
                colors: ['#9270e5', '#9ea4bb']
            }

        },
        legend: {
            itemMarginTop: 20, 
            itemStyle:{
                fontSize: '8px',
                fontWeight: 'normal',
                color:'#8c8992'
            },   
            x: -29,
            y: 17
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['SALAS IMPLEMENTADAS', parseInt(14)],
                ['TOTAL', salas],
            ]
        }]
    });

    Highcharts.chart('regular1-container3', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false, 
            spacingBottom: 0,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'REPORTES OPERATIVOS 11:30',
            align: 'center',
            verticalAlign: 'middle',
            y: 20,
            x:-30,
            style: {
                fontWeight: 'normal',
                fontSize: '13px',
                color:'#8c8992'
            }
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
                center: ['30%', '55%'],
                size: '100%',
                colors: ['#9270e5', '#9ea4bb']
            }

        },
        legend: {
            itemMarginTop: 20, 
            itemStyle:{
                fontSize: '8px',
                fontWeight: 'normal',
                color:'#8c8992',
                textOverflow: "ellipsis",
             
            },   
            x: -22,
            y: 17
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['SALAS CON APLICACION INICIADA', parseInt(14)],
                ['TOTAL', salas],
            ]
        }]
    });

    Highcharts.chart('regular1-container4', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false, 
        /*  spacingBottom: 0,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,*/
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'REPORTES OPERATIVOS 14:00',
            align: 'center',
            verticalAlign: 'middle',
            y: 20,
            x:-30,
            style: {
                fontWeight: 'normal',
                fontSize: '13px',
                color:'#8c8992'
            }
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
                center: ['30%', '55%'],
                size: '100%',
                colors: ['#9270e5', '#9ea4bb']
            }

        },
        legend: {
            x: -7,
            y: 32,
            width:150,
            itemMarginTop: 20, 
            itemStyle:{
                fontSize: '8px',
                fontWeight: 'normal',
                color:'#8c8992'
            },   
             
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['SALAS APLICADAS', parseInt(14)],
                ['TOTAL', salas],
            ]
        }]
    });

    Highcharts.chart('regular1-container5', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false, 
            spacingBottom: 0,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'REPORTES OPERATIVOS 15:00',
            align: 'center',
            verticalAlign: 'middle',
            y: 20,
            x:-30,
            style: {
                fontWeight: 'normal',
                fontSize: '13px',
                color:'#8c8992'
            }
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
                center: ['30%', '55%'],
                size: '100%',
                colors: ['#9270e5', '#9ea4bb']
            }

        },
        legend: {
            itemMarginTop: 20, 
            itemStyle:{
                fontSize: '8px',
                fontWeight: 'normal',
                color:'#8c8992'
            },   
            x: -30,
            y: 17
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['SALAS DESPACHO MATERIAL', parseInt(14)],
                ['TOTAL', salas],
            ]
        }]
    });

    Highcharts.chart('regular1-container6', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false, 
            spacingBottom: 0,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'ASISTENCIA <br>TOTAL',
            align: 'center',
            verticalAlign: 'middle',
            y: 20,
            x:-30,
            style: {
                fontWeight: 'normal',
                fontSize: '13px',
                color:'#8c8992'
            }
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
                center: ['30%', '55%'],
                size: '100%',
                colors: ['#4d8be6', '#eb0054']
            }

        },
        legend: {
            width: 50,
            itemMarginTop: 20, 
            itemStyle:{
                fontSize: '8px',
                fontWeight: 'normal',
                color:'#8c8992',
                width: 130
            },   
            x: -46,
            y: 17
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['ASISTENCIA', parseInt(14)],
                ['TOTAL', docentes],
            ]
        }]
    });

}

function graficoRegular2(data){   
    salas = data.salas
    docentes = data.docentes

    Highcharts.chart('regular2-container1', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false, 
            spacingBottom: 0,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'REPORTES OPERATIVOS 9:00',
            align: 'center',
            verticalAlign: 'middle',
            y: 20,
            x:-30,
            style: {
                fontWeight: 'normal',
                fontSize: '13px',
                color:'#8c8992'
            }
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
                center: ['30%', '55%'],
                size: '100%',
                colors: ['#9270e5', '#9ea4bb']
            }

        },
        legend: {
            itemMarginTop: 20, 
            itemStyle:{
                fontSize: '8PX',
                fontWeight: 'normal',
                color:'#8c8992'
            },   
            x: -32,
            y: 17
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['SALAS CON EXAMINADOR', parseInt(14)],
                ['TOTAL', salas],
            ]
        }]
    });

    Highcharts.chart('regular2-container2', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false, 
            spacingBottom: 0,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'REPORTES OPERATIVOS 10:00',
            align: 'center',
            verticalAlign: 'middle',
            y: 20,
            x:-30,
            style: {
                fontWeight: 'normal',
                fontSize: '13px',
                color:'#8c8992'
            }
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
                center: ['30%', '55%'],
                size: '100%',
                colors: ['#9270e5', '#9ea4bb']
            }

        },
        legend: {
            itemMarginTop: 20, 
            itemStyle:{
                fontSize: '8px',
                fontWeight: 'normal',
                color:'#8c8992'
            },   
            x: -29,
            y: 17
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['SALAS IMPLEMENTADAS', parseInt(14)],
                ['TOTAL', salas],
            ]
        }]
    });

    Highcharts.chart('regular2-container3', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false, 
            spacingBottom: 0,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'REPORTES OPERATIVOS 11:30',
            align: 'center',
            verticalAlign: 'middle',
            y: 20,
            x:-30,
            style: {
                fontWeight: 'normal',
                fontSize: '13px',
                color:'#8c8992'
            }
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
                center: ['30%', '55%'],
                size: '100%',
                colors: ['#9270e5', '#9ea4bb']
            }

        },
        legend: {
            itemMarginTop: 20, 
            itemStyle:{
                fontSize: '8px',
                fontWeight: 'normal',
                color:'#8c8992',
                textOverflow: "ellipsis",
             
            },   
            x: -22,
            y: 17
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['SALAS CON APLICACION INICIADA', parseInt(14)],
                ['TOTAL', salas],
            ]
        }]
    });

    Highcharts.chart('regular2-container4', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false, 
        /*  spacingBottom: 0,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,*/
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'REPORTES OPERATIVOS 14:00',
            align: 'center',
            verticalAlign: 'middle',
            y: 20,
            x:-30,
            style: {
                fontWeight: 'normal',
                fontSize: '13px',
                color:'#8c8992'
            }
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
                center: ['30%', '55%'],
                size: '100%',
                colors: ['#9270e5', '#9ea4bb']
            }

        },
        legend: {
            x: -7,
            y: 32,
            width:150,
            itemMarginTop: 20, 
            itemStyle:{
                fontSize: '8px',
                fontWeight: 'normal',
                color:'#8c8992'
            },   
             
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['SALAS APLICADAS', parseInt(14)],
                ['TOTAL', salas],
            ]
        }]
    });

    Highcharts.chart('regular2-container5', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false, 
            spacingBottom: 0,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'REPORTES OPERATIVOS 15:00',
            align: 'center',
            verticalAlign: 'middle',
            y: 20,
            x:-30,
            style: {
                fontWeight: 'normal',
                fontSize: '13px',
                color:'#8c8992'
            }
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
                center: ['30%', '55%'],
                size: '100%',
                colors: ['#9270e5', '#9ea4bb']
            }

        },
        legend: {
            itemMarginTop: 20, 
            itemStyle:{
                fontSize: '8px',
                fontWeight: 'normal',
                color:'#8c8992'
            },   
            x: -30,
            y: 17
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['SALAS DESPACHO MATERIAL', parseInt(14)],
                ['TOTAL', salas],
            ]
        }]
    });

    Highcharts.chart('regular2-container6', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false, 
            spacingBottom: 0,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'ASISTENCIA <br>TOTAL',
            align: 'center',
            verticalAlign: 'middle',
            y: 20,
            x:-30,
            style: {
                fontWeight: 'normal',
                fontSize: '13px',
                color:'#8c8992'
            }
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
                center: ['30%', '55%'],
                size: '100%',
                colors: ['#4d8be6', '#eb0054']
            }

        },
        legend: {
            width: 50,
            itemMarginTop: 20, 
            itemStyle:{
                fontSize: '8px',
                fontWeight: 'normal',
                color:'#8c8992',
                width: 130
            },   
            x: -46,
            y: 17
        },
        
        series: [{
            type: 'pie',
            name: 'Total',
            innerSize: '70%',
            data: [
                ['ASISTENCIA', parseInt(14)],
                ['TOTAL', docentes],
            ]
        }]
    });

}