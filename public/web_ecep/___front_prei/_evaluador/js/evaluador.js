$(document).ready(function(){

	listarItems();
 
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')

    // $("#table-lista").page( 'next' ).draw( 'page' );
    // $("#table-lista").order( [[ 1, 'asc' ]] )
    //             .draw( false );

    //             $('#table-lista').DataTable( {
    //     "order": [[ 1, "desc" ]]
    // } );

    // $("#table-lista").rows( {page:'current'} ).data();

});

function listarItems(){

    //if (JSON.parse(localStorage.user).id_tipo_usuario == 54) {
        $.ajax({
                method: 'POST',
                "url": webservice+"/evaluador/item/lista",
                headers: {
                    't': JSON.parse(localStorage.user).token,
                },
                crossDomain: true,
                dataType: 'text',
                data: {

                },
                success: function(data, textStatus, jqXHR) {
                    if (data != "token invalido") {
                        datos = JSON.parse(data);
                        creaListaItems(JSON.parse(data));
                        cargarGraficos(JSON.parse(data));
                    } 
                    else {
                        console.log("invalidos");
                    }
                    ocultarLoading()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    ocultarLoading()
                }
        });
    //}
}

function creaListaItems(data) {
    // console.log(data.lista_items.subprueba);

    
    
    if(data["lista_items"].length != 0){

    $('#asignatura').html(data.lista_items[0].subprueba.toUpperCase())
    $('#area').html(data.lista_items[0].tipo_prueba.toUpperCase())

        if($.fn.dataTable.isDataTable('#table-lista')){

            $('#table-lista').DataTable().destroy();
            $('#lista_items').empty();
        }
    }
    else{
         $('#asignatura').html("-")
    $('#area').html("-")

    }

    var tablaD = $("#table-lista").DataTable({

        dom: '<"top row _info-dataTable"il>rt<"bottom"p><"clear"> ',
        buttons:[{
                extend: 'collection',
                text: 'Export',
                buttons: [
                    'copy',
                    'excel',
                    'csv',
                    'pdf',
                    'print'
                ]
            }],
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslatioCasos,
        lengthChange: true,
        info: true,
        // aaSorting: [],
        paging: true,
        ordering: true,
        // order:  'current',  // 'current', 'applied', 'index',  'original'
        // page:   'all', 
        searching: false,
        data: data.lista_items,
        responsive: true,
        columnDefs: [
            {   
                orderable: false, 
                targets: 8 
            }
        ],
          columns:[
          {data: "nro"},
          {data: "item"},
          {data: "tema"},
          {data: "estandar"},
          {data: "fecha_asignada",
            render:function(data,type,row){
                 if (data == null || data =="") {
                        return "-"
                    }else{
                        return moment(data).format("DD-MM-YYYY")
                    }
            }
          },
          {data: "fecha_limite",
              render:function(data,type,row){
                 if (data == null || data =="") {
                        return "-"
                    }else{
                        return moment(data).format("DD-MM-YYYY")
                    }
                }
        },
          {data: "avance",
              render:function(data,type,row){
                   if (data == null) {
                        return "-"
                    }else{
                        return '<label class="text-'+data.replace(/ /g, "")+'">'+data + '</label>'
                    }
                }
          },
          {data: "evaluacion",
            render:function(data,type,row){
                   if (data == null) {
                        return "-"
                    }else{
                        return '<label class="text-'+data+'">'+data + '</label>'
                    }
                }
          },
          {data: "opciones",
          render:function(data,type,row){
                if (data == "Evaluar" ) {
                    return '<button type="button" class="btn _btn-item" id="item_'+row.item+'"><i class="fas fa-binoculars"></i> Evaluar</button'
                }else{
                    return '<button type="button" class="btn _btn-item" id="item_'+row.item+'"><i class="fas fa-search"></i> Ver</button'
                }

              }
            }
          ],
           "rowCallback": function( row, data ) {
                // if (data.evaluacion == "Aprobado con observación") {
                //     $('td:eq(7)', row).html( "Observado").css({"color": "#7b58c2"});
                // }

               

            }        
  });

    // tablaD.rows({page:'current'} ).data();
    localStorage.cantidadItems = data["lista_items"].length;   
    
     $('#lista_items').on('click','._btn-item',redireccionarItem); 
     

     // $('.sorting').on('click', function(){
        // var table = $('#myTable').DataTable();
        
     // })
// $("#table-lista").page( 'next' ).draw( 'page' );
      // $("#table-lista").order( [[ 1, 'asc' ]] )
      //           .draw( false );

   $("#table-lista").show();  
}


function redireccionarItem() {

    var td = $(this).parent();
    var tr = td.parent();
    var children = tr.children().length;
    var tdIndex = td.index() + 1;
    var trIndex = tr.index();
    localStorage.itemsSelected = trIndex;

    var idItem = $(this).attr('id')
    items=[];
    $("#lista_items tr").each(function() {
        var nro = $(this).find('td:nth-child(1)').text() == undefined ? "" : $(this).find('td:nth-child(1)').text()
        var id = $(this).find('td:nth-child(2)').text() == undefined ? "" : $(this).find('td:nth-child(2)').text()
        var evaluacion = $(this).find('td:nth-child(7)').text() == undefined ? "" : $(this).find('td:nth-child(7)').text()
        items.push({id_item: id,evaluacion: evaluacion,nro: nro})

    })
    localStorage.item = items[trIndex].id_item;

    localStorage.items = JSON.stringify(items); 

    redirect()

    function redirect()    {        
        location.href = serverRedirect + '/_evaluador/correccion-evaluador.php';
    }
}

function cargarGraficos(data){

    Highcharts.chart('graficoAvance', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: 'Avance: '+(data["grafico"]["avance"].pendientes+data["grafico"]["avance"].en_proceso+data["grafico"]["avance"].finalizados),
            align: 'center',
            verticalAlign: 'middle',
            y: -10,
            style: {
                fontSize: '14px'
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>Items</b><br>' + 
                        this.point.name +': <b>' + this.point.y + '</b> ('+Highcharts.numberFormat(this.point.percentage, 1)+'%)';
            },
            positioner: function(labelWidth, labelHeight, point) {
                var tooltipX = point.plotX + 1;
                var tooltipY = point.plotY + 30;
                return {
                    x: tooltipX,
                    y: tooltipY
                };
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false,    
                },
                colors: ['#ffc400', '#ef8963', '#7e2161'],

                startAngle: -90,
                endAngle: 90,                
                size: '45%'
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            type: 'pie',
            name: 'Avance',
            innerSize: '65%',
            data: [
                ['Pendientes', data["grafico"]["avance"].pendientes],
                ['En Proceso', data["grafico"]["avance"].en_proceso],
                ['Finalizados', data["grafico"]["avance"].finalizados]
            ]
        }]
    });

    Highcharts.chart('graficoEvaluacion', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
        },
        title: {
            text: 'Resultado: '+(data["grafico"]["evaluacion"].aprobados+data["grafico"]["evaluacion"].rechazados+data["grafico"]["evaluacion"].observados),
            align: 'center',
            verticalAlign: 'middle',
            y: -10,
            style: {
                fontSize: '14px'
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>Evaluación</b><br>' + 
                        this.point.name +': <b>' + this.point.y + '</b> ('+Highcharts.numberFormat(this.point.percentage, 1)+'%)';
                         
            },
            positioner: function(labelWidth, labelHeight, point) {
                var tooltipX = point.plotX - 100;
                var tooltipY = point.plotY + 30;
                return {
                    x: tooltipX,
                    y: tooltipY
                };
            },
            style:{
                whiteSpace: "nowrap"
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false,    
                },
                colors: ['#32c2a0', '#7b58c2', '#e9215e'],
                startAngle: -90,
                endAngle: 90,
                size: '45%'
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            type: 'pie',
            name: 'Evaluación',
            innerSize: '65%',
            data: [
                ['Aprobados', data["grafico"]["evaluacion"].aprobados],
                ['Observados', data["grafico"]["evaluacion"].observados],
                ['Rechazados', data["grafico"]["evaluacion"].rechazados],
            ]
        }]
    });
}
