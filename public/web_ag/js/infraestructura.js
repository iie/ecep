$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')

    $('#redirect').css('display','');

    $('#redirect').on('click',redirectModulo);
    loginvalid(localStorage.getItem('user'))
 	getCentro()
    getCentroOperacion()
});



function getCentro(){



    $.ajax({

        method:'GET',

        url: webservice+'/monitoreo/infraestructura/lista',

        headers:{

          't': JSON.parse(localStorage.user).token

        },

        crossDomain: true,

        dataType:'text',

        data:{ 

            //id_usuario: JSON.parse(localStorage.user).id_usuario,

        },

        success: function(data, textStatus, jqXHR) {
            var dosobt = JSON.parse(data);
            llenarVista(dosobt.descripcion);

        },

        error: function(jqXHR, textStatus, errorThrown) {

            showFeedback("error","Error en el servidor","Datos incorrectos");

            console.log("error del servidor, datos incorrectos");

 

        }

    })



}

function getCentroOperacion(){



    $.ajax({

        method:'GET',

        url: webservice+'/monitoreo/infraestructura/centros/lista',

        headers:{

          't': JSON.parse(localStorage.user).token

        },

        crossDomain: true,

        dataType:'text',

        data:{ 

            //id_usuario: JSON.parse(localStorage.user).id_usuario,

        },

        success: function(data, textStatus, jqXHR) {
            var result = JSON.parse(data);
            llenarVista2(result.descripcion);

        },

        error: function(jqXHR, textStatus, errorThrown) {

            showFeedback("error","Error en el servidor","Datos incorrectos");

            console.log("error del servidor, datos incorrectos");

 

        }

    })



}



anfitrion=0;

function llenarVista(data){
    grafico(data.contadores.total_sedes_requeridas,data.contadores.total_sedes_confirmadas)
    //$('#limpiar-filtros').empty();
    if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-centros-aplicacion')){
            $('#table-centros-aplicacion').DataTable().destroy();
            $('#lista-centros-aplicacion').empty();
        }
    }
    var data1=Object.values(data)
    
    trData = '';
    nro = 1;
    //console.log(dataarr)
    for (var j = 0; j < data1.length-1; j++){
       
        for (var k = 0; k < data1[j].data_region.length; k++){    
            //console.log(data[j]["data_region"][0].comuna);
            for (var l = 0; l < data1[j].data_region[k].data_provincia.length; l++){  
                        //console.log(data1[j].data_region[k].data_provincia[l].data_comuna.anfitriones)
                /* 
                
                 var data3=data1[j].data_region[k].data_provincia[l].camara_operativa
                 data3=(data3 == true) ? 'Si' : 'No'

                 var data4=data1[j].data_region[k].data_provincia[l].encargado
                 data4= (data4 == null) ? '-' : ((data4 == "") ? '-' : data4);

                 var data5=data1[j].data_region[k].data_provincia[l].encargado_email
                  data5= (data5 == null) ? '-' : ((data5 == "") ? '-' : data5);*/

                //var sum= data[j]["data_region"][k].data_comuna.reclutado+data[j]["data_region"][k].data_comuna.capacitado+data[j]["data_region"][k].data_comuna.seleccionado+data[j]["data_region"][k].data_comuna.contratado
                
                var data2 =data1[j].data_region[k].data_provincia[l].data_comuna.visita_previa
                data2= (data2 == false) ? 'No' : ((data2 == true) ? 'Si' : '-');

                var data_val_sede= data1[j].data_region[k].data_provincia[l].data_comuna.id_sede
                data_val_sede= data_val_sede == null ? '-' : data_val_sede;
                 

                var data_val_sede_ecep= data1[j].data_region[k].data_provincia[l].data_comuna.id_sede_ecep
                data_val_sede_ecep = data_val_sede_ecep == null ? '-' : data_val_sede_ecep;


                var valida_sede= data1[j].data_region[k].data_provincia[l].data_comuna.id_sede == null ? 'No' :'Si';
                var valida_confirm= data1[j].data_region[k].data_provincia[l].data_comuna.salas_disponibles;
                    valida_confirm= valida_confirm==null?'-':valida_confirm;

                trData+= '<tr>';    
                trData+= '<td style="text-align:center">' + nro + '</td>'
                trData+= '<td>' + data1[j].nombre_region + '</td>'
                trData+= '<td>' + data1[j].data_region[k].nombre_provincia + '</td>'
                trData+= '<td>' + data1[j].data_region[k].data_provincia[l].nombre_comuna + '</td>'
                trData+= '<td style="text-align:center">' + data_val_sede_ecep + '</td>'
                trData+= '<td style="text-align:center">' + data1[j].data_region[k].data_provincia[l].data_comuna.dia + '</td>'
                trData+= '<td style="text-align:center">' + valida_sede + '</td>'
                trData+= '<td style="text-align:center">' + data1[j].data_region[k].data_provincia[l].data_comuna.docentes + '</td>'
                trData+= '<td style="text-align:center">' + data1[j].data_region[k].data_provincia[l].data_comuna.salas_requeridas + '</td>'
                /*trData+= '<td style="text-align:center">' + valida_confirm + '</td>'*/
                trData+= '<td style="text-align:center">' + data2 + '</td>'
               /*  trData+= '<td>' + data2 + '</td>'
                trData+= '<td>' + data3+ '</td>'
                trData+= '<td>' + data4+ '</td>'
                trData+= '<td>' + data5+ '</td>'
                //trData+= '<td style="text-align:center">' + data[j].data_region[k].data_provincia[l].data_comuna[m].confirmado + '</td>'
                /*trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.capacitado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.seleccionado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.contratado + '</td>'*/
                //trData+= '<td style="text-align:center">' + sum + '</td>'
                trData+= '</tr>';   
                nro++; 
                
            } 
        }
    }  
    
    
      
    $('#lista-centros-aplicacion').append(trData);

    var tablaD = $("#table-centros-aplicacion").DataTable({
        dom: "",
        buttons: [
            {
                extend: 'excel',
                title: 'Sedes',
                exportOptions: {
                    modifier: {
                        page: 'current'
                    },
                    columns: [ 0, 1]
                }
            }
        ],
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslation,
        lengthChange: true,
        info: false,
        /*columnDefs: [
            { targets: [0,1,2,3,5,6,7], searchable: false }
        ],*/
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
        search: true,
        data: data.sedes,
        responsive: true, 
        /*columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "region"},
            {data: "comuna"},
            {data: "centro",
                render: function(data, type, row){
                    if(row.id_centro_operaciones == null){
                        return ""
                    }else{
                        return data;
                    }
                     
                }
            },
            {data: "rbd"},
            {data: "nombre"},
            {data: "contacto_nombre"},
            {data: "contacto_email", className: "word-break"},
            {data: "contacto_fono"},
            {data: "salas_requeridas", className: "text-center"},
            {data: "salas_disponibles", className: "text-center"},
            {data: "estado", className: "text-center",
                render: function(data, type, row){
                    if(data == 0){
                        return "S/I"
                    }else if(data == 1){
                        return "NO"
                    }else if(data == 2){
                        return "SI"
                    }
                }
            },
            {data: "opciones",
                render: function(data, type, row){
                    return  '<button type="button" id="modificar_'+row.id_sede+'" onclick="modificar('+row.id_sede+')" class="btn btn-primary btn-sm _btn-item mr-1"><i class="fa fa-pencil-alt"></i></button>'
                            //'<button type="button" id="ver_'+row.id_sede+'" onclick="redireccionarSede('+row.id_sede+')" class="btn btn-primary btn-sm _btn-item"><i class="fas fa-search"></i></button>'        
                },
                className: "text-center"
            } 
        ],*/
        "initComplete": function(settings, json) {
            var placeholder = ["","Región","","Comuna","","Día"]
            this.api().columns([1,3,5]).every( function (index) {
            var column = this;
            var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectR_'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-centros-aplicacion'))
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

                        $('#selectR_'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     

                    }

                    

                } );

                 $('#selectR_'+index).niceSelect();        

            })   



            $('.dataTables_length select').addClass('nice-select small');         

        },

        "drawCallback": function(){

             var placeholder = ["","Región","","Comuna","","Día"]
            this.api().columns([1,3,5]).every( function (index) {

                var columnFiltered = this;

                var selectFiltered = $("#selectR_"+index)

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

    $("#descargar-lista").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });


    
    $('#totalSedesreq').html(data.contadores.total_sedes_requeridas)
    $('#totalSedesconf').html(data.contadores.total_sedes_confirmadas)
    $('#salasRequeridas').html(data.contadores.total_salas_requeridas)
    $('#salasConseguidas').html(data.contadores.total_salas_disponibles)
    $('#totalComunas').html(data.contadores.total_comunas)
    $('#totalProfesores').html(data.contadores.total_docentes)

    $('#limpiar-filtros').click(btnClearFilters);
    //$('#lista_items').on('click','._btn-item',redireccionarSede);
    $('#total-items').html(data.length);
    $("#table-centros-aplicacion").show(); 

    $('#inputRegion').html('')
    $('#inputRegion').append('<option value="-1" selected="">Elegir...</option>') 

    /*for(i = 0; i < data.data_region.length; i++){
        $('#inputRegion').append('<option value="'+data.regiones[i].nombre_provincia+'">'+data.regiones[i].nombre_provincia+'</option>');
    }*/

    
 

}

function grafico(data,data1){
    


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
                ['SEDES CONFIRMADAS', parseInt(data1)],
                ['SEDES REQUERIDAS', parseInt(data)],
            ]
        }]
    });

}

function llenarVista2(data){
    
    //$('#limpiar-filtros-centros-operacion').empty();
    if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-centros-operacion')){
            $('#table-centros-operacion').DataTable().destroy();
            $('#lista-centros-operacion').empty();
        }
    }
    var cam=0;
    var operativo=0;
    var data1=Object.values(data)
    console.log(data1)
    trData = '';
    nro = 1;

    //console.log(dataarr)
    var contarTue=0;
    for (var j = 0; j < data1.length-1; j++){
        for (var k = 0; k < data1[j].data_region.length; k++){    
            //console.log(data[j]["data_region"][0].comuna);
            for (var l = 0; l < data1[j].data_region[k].data_provincia.length; l++){  
                  
                 var data2 =data1[j].data_region[k].data_provincia[l].confirmado
                 data2= (data2 == 1) ? 'No' : ((data2 == 2) ? 'Si' : '-');

                 var data3=data1[j].data_region[k].data_provincia[l].servicios_basicos
                 data3=(data3 == true) ? 'Si' : 'No'

                 var data4=data1[j].data_region[k].data_provincia[l].inmobiliario
                 data4=(data4 == true) ? 'Si' : 'No'

                 var data5=data1[j].data_region[k].data_provincia[l].extintor
                 data5=(data5 == true) ? 'Si' : 'No'

                 var data6=data1[j].data_region[k].data_provincia[l].internet
                 data6=(data6 == true) ? 'Si' : 'No'

                 var data7=data1[j].data_region[k].data_provincia[l].camara_operativa
                 data7=(data7 == true) ? 'Si' : 'No'

                 var data8=data1[j].data_region[k].data_provincia[l].encargado
                 data8= (data8 == null) ? '-' : ((data8 == "") ? '-' : data8);

                 var data9=data1[j].data_region[k].data_provincia[l].encargado_email
                  data9= (data9 == null) ? '-' : ((data9 == "") ? '-' : data9);

                //var sum= data[j]["data_region"][k].data_comuna.reclutado+data[j]["data_region"][k].data_comuna.capacitado+data[j]["data_region"][k].data_comuna.seleccionado+data[j]["data_region"][k].data_comuna.contratado
                trData+= '<tr>';    
                /*trData+= '<td style="text-align:center">' + nro + '</td>'*/
                trData+= '<td>' + data1[j].region + '</td>'
                trData+= '<td>' + data1[j].data_region[k].data_provincia[l].nombre_comuna + '</td>'
                trData+= '<td style="text-align:center">' + data2 + '</td>'
                trData+= '<td style="text-align:center">' + data3+ '</td>'
                trData+= '<td style="text-align:center">' + data4+ '</td>'
                trData+= '<td style="text-align:center">' + data5+ '</td>'
                trData+= '<td style="text-align:center">' + data6+ '</td>'
                trData+= '<td style="text-align:center">' + data7+ '</td>'
                trData+= '<td>' + data8+ '</td>'
                trData+= '<td>' + data9+ '</td>'
                //trData+= '<td style="text-align:center">' + data[j].data_region[k].data_provincia[l].data_comuna[m].confirmado + '</td>'
                /*trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.capacitado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.seleccionado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.contratado + '</td>'*/
                //trData+= '<td style="text-align:center">' + sum + '</td>'
                trData+= '</tr>';   
                nro++;
               if (data2=='Si' && data3=='Si'&&data4=='Si'&&data5=='Si'&&data6=='Si'&&data7=='Si') {
                contarTue+=1
               }
            } 
        }
    }   
     console.log(contarTue,data1[16].total-contarTue)
    grafico2(data1[16].total-data1[16].habilitados,data1[16].habilitados)
    
    $('#lista-centros-operacion').append(trData);

    var tablaD = $("#table-centros-operacion").DataTable({
        dom: "",
        buttons: [
            {
                extend: 'excel',
                title: 'Sedes',
                exportOptions: {
                    modifier: {
                        page: 'current'
                    },
                    columns: [ 0, 1]
                }
            }
        ],
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslation,
        lengthChange: true,
        info: false,
        /*columnDefs: [
            { targets: [0,1,2,3,5,6,7], searchable: false }
        ],*/
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
        search: true,
        data: data.sedes,
        responsive: true, 
        /*columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "region"},
            {data: "comuna"},
            {data: "centro",
                render: function(data, type, row){
                    if(row.id_centro_operaciones == null){
                        return ""
                    }else{
                        return data;
                    }
                     
                }
            },
            {data: "rbd"},
            {data: "nombre"},
            {data: "contacto_nombre"},
            {data: "contacto_email", className: "word-break"},
            {data: "contacto_fono"},
            {data: "salas_requeridas", className: "text-center"},
            {data: "salas_disponibles", className: "text-center"},
            {data: "estado", className: "text-center",
                render: function(data, type, row){
                    if(data == 0){
                        return "S/I"
                    }else if(data == 1){
                        return "NO"
                    }else if(data == 2){
                        return "SI"
                    }
                }
            },
            {data: "opciones",
                render: function(data, type, row){
                    return  '<button type="button" id="modificar_'+row.id_sede+'" onclick="modificar('+row.id_sede+')" class="btn btn-primary btn-sm _btn-item mr-1"><i class="fa fa-pencil-alt"></i></button>'
                            //'<button type="button" id="ver_'+row.id_sede+'" onclick="redireccionarSede('+row.id_sede+')" class="btn btn-primary btn-sm _btn-item"><i class="fas fa-search"></i></button>'        
                },
                className: "text-center"
            } 
        ],*/
        "initComplete": function(settings, json) {
            var placeholder = ["Región","Comuna"]
            this.api().columns([0,1]).every( function (index) {
            var column = this;
            var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectO_'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-centros-operacion'))
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

                        $('#selectO_'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     

                    }

                    

                } );

                 $('#selectO_'+index).niceSelect();        

            })   



            $('.dataTables_length select').addClass('nice-select small');         

        },

        "drawCallback": function(){

            var placeholder = ["Región","Comuna"]

            this.api().columns([0,1]).every( function (index) {

                var columnFiltered = this;

                var selectFiltered = $("#selectO_"+index)

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

     $("#descargar-lista").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });

    $('#totalCentros').html(data1[16].total)
    $('#operativosCentros').html(data1[16].habilitados)
    $('#servicios_basicos').html(data1[16].servicios_basicos)
    $('#inmobiliario').html(data1[16].inmobiliario)
    $('#extintor').html(data1[16].extintor)
    $('#internet').html(data1[16].internet)
    $('#camaras').html(data1[16].camaras)

    $('#limpiar-filtros-centros-operacion').click(btnClearFilters);
    //$('#lista_items').on('click','._btn-item',redireccionarSede);
    $('#total-items').html(data.length);
    $("#table-centros-operacion").show(); 

    $('#inputRegion').html('')
    $('#inputRegion').append('<option value="-1" selected="">Elegir...</option>') 

    /*for(i = 0; i < data.data_region.length; i++){
        $('#inputRegion').append('<option value="'+data.regiones[i].nombre_provincia+'">'+data.regiones[i].nombre_provincia+'</option>');
    }*/

    
 

}
function grafico2(data,data1){
    


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
                ['SEDES CONFIRMADAS', parseInt(data1)],
                ['SEDES REQUERIDAS', parseInt(data)],
            ]
        }]
    });

}

function btnClearFilters(){
     

    $('#selectR_1').val("").niceSelect('update');
    $('#selectR_3').val("").niceSelect('update');
    $('#selectR_5').val("").niceSelect('update');

    $('#selectO_1').val("").niceSelect('update');
    $('#selectO_2').val("").niceSelect('update');
    
    var table = $('#table-centros-aplicacion').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();
    var table = $('#table-centros-operacion').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();
    
         

}