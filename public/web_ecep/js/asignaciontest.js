$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    if(JSON.parse(localStorage.user).id_tipo_usuario != 1042){
        $('#redirect').css('display','');
        $('#redirect').on('click',redirectModulo);
    }
    getSede()
    getListaEstimacion1()
    getListaEstimacion2()
   
    $('#guardar_sede').click(guardarSede); 
    $('#guardar_asignacion').click(guardarAsignacion); 
});

var region = '';
function getSede(){

    $.ajax({
        method:'POST',
        url: webservice+'/sede/lista',
        headers: {
                't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data: {
            id_usuario: JSON.parse(localStorage.user).id_usuario,
        },
        success: function(data, textStatus, jqXHR) {
            //llenarVista(data)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
 
        }
    })

}

function getListaEstimacion1(){

    $.ajax({
        method:'POST',
        url: webservice+'/asignacion/lista-estimacion',
        headers: {
                't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data: {
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            dia: 1,
        },
        success: function(data, textStatus, jqXHR) {
             
            llenarVistaEstamacion1(data)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
 
        }
    })

}

function getListaEstimacion2(){

    $.ajax({
        method:'POST',
        url: webservice+'/sede/lista-estimacion',
        headers: {
                't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data: {
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            dia: 2,
        },
        success: function(data, textStatus, jqXHR) {
            llenarVistaEstamacion2(data)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
 
        }
    })

}



function llenarVistaEstamacion1(data){
    data = JSON.parse(data)
    var contadores = data.contadores;
    delete data.contadores;
    var data_table;
    data_table = Object.values(data);
    $('#filtros-dia1').empty();
    if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-dia1')){
            $('#table-dia1').DataTable().destroy();
            $('#lista_dia1').empty();
        }
    }

    var tablaD = $("#table-dia1").DataTable({
        dom: "<'search'f>",
        buttons: [
            {
                extend: 'excel',
                title: 'Aplicación día 1',
                exportOptions: {
                    modifier: {
                        page: 'current'
                    },
                    columns: [ 0, 1, 2, 3, 4, 5, 6]
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
        data: data_table,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "id_sede_ecep",className: "text-center"},
            {data: "region"},
            {data: "comuna"},
            {data: "nombre"},
            {data: "rbd", className: "text-center"},
            {data: "salas", className: "text-center"},
            {data: "examinadores",
                render: function(data, type, row){
                    return  row.examinadores_asignados + " / " + row.examinadores;
                }, 
                className: "text-center"
            },
            {data: "supervisores",
                render: function(data, type, row){
                    return  row.supervisores_asignados + " / " + row.supervisores;
                }, 
                className: "text-center"
            },
            {data: "anfitriones",
                render: function(data, type, row){
                    return  row.anfitriones_asignados + " / " + row.anfitriones;
                }, 
                className: "text-center"
            },
            {data: "opciones",
                render: function(data, type, row){
                    console.log(row.dia+","+row.id_sede+","+row.id_estimacion +","+row.id_comuna);
                    // var idSede = row.id_sede != null ? row.id_sede : -1;
                    return  "<a type='button' id='modificar_"+row.id_sede_ecep+"' class='btn btn-primary btn-sm _btn-item mr-1' title='Asignar'  onclick='redirectAsignacionTest("+ row.dia+","+row.id_sede+","+row.id_estimacion +","+row.id_comuna+")' href='#'><i class='fas fa-plus'></i></a>"
                },
                className: "text-center"
            } 
        ],
        "rowCallback": function( row, data ) {

            /*$('td:eq(7)', row).find('button').data('id_estimacion',data.id_estimacion);
            $('td:eq(7)', row).find('button').data('id_comuna',data.id_comuna);
            $('td:eq(7)', row).find('button').data('id_sede',data.id_sede);
            $('td:eq(7)', row).find('button').data('comuna',data.comuna);
            $('td:eq(7)', row).find('button').data('dia',1);
            $('td:eq(7)', row).find('button').on('click',asignar);*/
        
 
        },
        "initComplete": function(settings, json) {
            var placeholder = ["","","Región","Comuna"]
            this.api().columns([2,3]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectD1'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-dia1'))
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
                column.data().unique().each( function ( d, j ) {

                    $('#selectD1'+index).append( '<option value="'+d+'">'+d+'</option>' )
                    
                } );
                 $('#selectD1'+index).niceSelect();        
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(){
            var placeholder = ["","","Región","Comuna"]
            this.api().columns([2,3]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectD1"+index)
                if(selectFiltered.val()===''){
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">'+placeholder[index]+'</option>')
                    columnFiltered.column(index,{search:'applied'}).data().unique().each( function ( d, j ) {

                        selectFiltered.append( '<option value="'+d+'">'+d+'</option>' )
                        

                    } );
                }
                $('select').niceSelect('update');
            })
        }
    });

    $("#descargar-lista-dia1").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });

    $('#total_cantSupervisor_d1').html(contadores.sup_asignados)
    $('#total_reqSupervisor_d1').html(contadores.sup_requeridos)
    $('#total_cantExaminador_d1').html(contadores.exa_asignados)
    $('#total_reqExaminador_d1').html(contadores.exa_requeridos)
    $('#total_cantAnfitrion_d1').html(contadores.anf_asignados)
    $('#total_reqAnfitrion_d1').html(contadores.anf_requeridos)

    $('#limpiar-filtros-dia1').click(btnClearFilters);
    console.log("Aquí");
    $('#lista_items-dia1').on('click','._btn-item',redireccionarSede);
    $('#total-items-dia1').html(data.length);
    $("#table-dia1").show(); 
 
}



function llenarVistaAsignar(data){
    data = JSON.parse(data)
    console.log(data)
    $('#filtros-dia1').empty();
    if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-dia1')){
            $('#table-dia1').DataTable().destroy();
            $('#lista_dia1').empty();
        }
    }

    var tablaD = $("#table-dia1").DataTable({
        dom: "<'search'f>",
        buttons: [
            {
                extend: 'excel',
                title: 'Aplicación día 1',
                exportOptions: {
                    modifier: {
                        page: 'current'
                    },
                    columns: [ 0, 1, 2, 3, 4, 5, 6]
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
        data: data,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "id_sede_ecep",className: "text-center"},
            {data: "region"},
            {data: "comuna"},
            {data: "nombre"},
            {data: "rbd", className: "text-center"},
            {data: "salas", className: "text-center"},
            {data: "opciones",
                render: function(data, type, row){
                    console.log(row.dia+","+row.id_sede+","+row.id_estimacion +","+row.id_comuna);
                     if (row.id_sede!=null) {
                        return  "<a type='button' id='modificar_"+row.id_sede_ecep+"' class='btn btn-primary btn-sm _btn-item mr-1' title='Asignar'  onclick='redirectAsignacionTest("+ row.dia+","+row.id_sede+","+row.id_estimacion +")' href='#'><i class='fas fa-plus'></i></a>"
                    } else {
                        return  "<button disabled type='button' id='modificar_"+row.id_sede_ecep+"' class='btn btn-primary btn-sm _btn-item mr-1' title='Asignar'  href='#'><i class='fas fa-plus'></i></button>"
                    }
                },
                className: "text-center"
            } 
        ],
        "rowCallback": function( row, data ) {

            $('td:eq(7)', row).find('button').data('id_estimacion',data.id_estimacion);
            $('td:eq(7)', row).find('button').data('id_comuna',data.id_comuna);
            $('td:eq(7)', row).find('button').data('id_sede',data.id_sede);
            $('td:eq(7)', row).find('button').data('comuna',data.comuna);
            $('td:eq(7)', row).find('button').data('dia',1);
            $('td:eq(7)', row).find('button').on('click',asignar);
        
 
        },
        "initComplete": function(settings, json) {
            var placeholder = ["","","Región","Comuna"]
            this.api().columns([2,3]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectD1'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-dia1'))
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
                column.data().unique().each( function ( d, j ) {

                    $('#selectD1'+index).append( '<option value="'+d+'">'+d+'</option>' )
                    
                } );
                 $('#selectD1'+index).niceSelect();        
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(){
            var placeholder = ["","","Región","Comuna"]
            this.api().columns([2,3]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectD1"+index)
                if(selectFiltered.val()===''){
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">'+placeholder[index]+'</option>')
                    columnFiltered.column(index,{search:'applied'}).data().unique().each( function ( d, j ) {

                        selectFiltered.append( '<option value="'+d+'">'+d+'</option>' )
                        

                    } );
                }
                $('select').niceSelect('update');
            })
        }
    });

    $("#descargar-lista-dia1").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });

    $('#limpiar-filtros-dia1').click(btnClearFilters);
    $('#lista_items-dia1').on('click','._btn-item',redireccionarSede);
    $('#total-items-dia1').html(data.length);
    $("#table-dia1").show(); 
}



function llenarVistaEstamacion2(data){
    data = JSON.parse(data)
    var contadores = data.contadores;
    delete data.contadores;
    var data_table;
    data_table = Object.values(data);
    $('#filtros').empty();
    if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-dia2')){
            $('#table-dia2').DataTable().destroy();
            $('#lista_dia2').empty();
        }
    }

    var tablaD = $("#table-dia2").DataTable({
        dom: "<'search'f>",
        buttons: [
            {
                extend: 'excel',
                title: 'Aplicación día 2',
                exportOptions: {
                    modifier: {
                        page: 'current'
                    },
                    columns: [ 0, 1, 2, 3, 4, 5, 6]
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
        data: data_table,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "id_sede_ecep",className: "text-center"},
            {data: "region"},
            {data: "comuna"},
            {data: "nombre"},
            {data: "rbd"},
            {data: "salas", className: "text-center"},
            {data: "examinadores",
                render: function(data, type, row){
                    return  row.examinadores_asignados + " / " + (row.examinadores != null ? row.examinadores : 0);
                }, 
                className: "text-center"
            },
            {data: "supervisores",
                render: function(data, type, row){
                    return  row.supervisores_asignados + " / " + (row.supervisores != null ? row.supervisores : 0);
                }, 
                className: "text-center"
            },
            {data: "anfitriones",
                render: function(data, type, row){
                    return  row.anfitriones_asignados + " / " + (row.anfitriones != null ? row.anfitriones : 0);
                }, 
                className: "text-center"
            },
           /*  {data: "opciones",
                render: function(data, type, row){
                    console.log(row);
                    if (row.id_sede!=null) {
                        return  "<a type='button' id='modificar_"+row.id_sede_ecep+"' class='btn btn-primary btn-sm _btn-item mr-1' title='Asignar'  onclick='redirectAsignacionTest("+ row.dia+","+row.id_sede+","+row.id_estimacion +")' href='#'><i class='fas fa-plus'></i></a>"
                    } else {
                        return  "<button disabled type='button' id='modificar_"+row.id_sede_ecep+"' class='btn btn-primary btn-sm _btn-item mr-1' title='Asignar'  href='#'><i class='fas fa-plus'></i></button>"
                    }
                   
                            //'<button type="button" id="ver_'+row.id_sede+'" onclick="redireccionarSede('+row.id_sede+')" class="btn btn-primary btn-sm _btn-item"><i class="fas fa-search"></i></button>'        
                },
                className: "text-center"
            } */
            {data: "opciones",
            
            render: function(data, type, row){
                console.log(row.dia+","+row.id_sede+","+row.id_estimacion +","+row.id_comuna);
                // var idSede = row.id_sede != null ? row.id_sede : -1;
                return  "<a type='button' id='modificar_"+row.id_sede_ecep+"' class='btn btn-primary btn-sm _btn-item mr-1' title='Asignar'  onclick='redirectAsignacionTest("+ row.dia+","+row.id_sede+","+row.id_estimacion +","+row.id_comuna+")' href='#'><i class='fas fa-plus'></i></a>"
            },
            className: "text-center"
        } 
        ],
        "rowCallback": function( row, data ) {

            $('td:eq(7)', row).find('button').data('id_estimacion',data.id_estimacion);
            $('td:eq(7)', row).find('button').data('id_comuna',data.id_comuna);
            $('td:eq(7)', row).find('button').data('id_sede',data.id_sede);
            $('td:eq(7)', row).find('button').data('comuna',data.comuna);
            $('td:eq(7)', row).find('button').data('dia',2)
            $('td:eq(7)', row).find('button').on('click',asignar);
        
 
        },
        "initComplete": function(settings, json) {
            var placeholder = ["","","Región","Comuna"]
            this.api().columns([2,3]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectD2'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-dia2'))
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
                column.data().unique().each( function ( d, j ) {
                    $('#selectD2'+index).append( '<option value="'+d+'">'+d+'</option>' )
                    
                } );
                 $('#selectD2'+index).niceSelect();        
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(){
            var placeholder = ["","","Región","Comuna"]
            this.api().columns([2,3]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectD2"+index)
                if(selectFiltered.val()===''){
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">'+placeholder[index]+'</option>')
                    columnFiltered.column(index,{search:'applied'}).data().unique().each( function ( d, j ) {
                        
                        selectFiltered.append( '<option value="'+d+'">'+d+'</option>' )                    

                    } );
                }
                $('select').niceSelect('update');
            })
        }
    });

    $("#descargar-lista-dia2").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });

    $('#total_cantSupervisor_d2').html(contadores.sup_asignados)
    $('#total_reqSupervisor_d2').html(contadores.sup_requeridos)
    $('#total_cantExaminador_d2').html(contadores.exa_asignados)
    $('#total_reqExaminador_d2').html(contadores.exa_requeridos)
    $('#total_cantAnfitrion_d2').html(contadores.anf_asignados)
    $('#total_reqAnfitrion_d2').html(contadores.anf_requeridos)

    $('#limpiar-filtros-dia2').click(btnClearFilters);
    $('#lista_items-dia2').on('click','._btn-item',redireccionarSede);
    $('#total-items-dia2').html(data.length);
    $("#table-dia2").show(); 
}
 
function cargarComunas(id){
    $('#inputComuna').html('')
    $('#inputComuna').append('<option value="-1" selected="">Elegir...</option>') 
    for(h = 0; h < region.length; h++){
        if(region[h].id_region == id){
            for(i = 0; i < region[h].comunas.length; i++){
                $('#inputComuna').append('<option value="'+region[h].comunas[i].id_comuna+'">'+region[h].comunas[i].nombre+'</option>') 
            }
        }
    }
}

function btnClearFilters(){
    console.log("Entro");
    $('#select1').val("").niceSelect('update');
    $('#select2').val("").niceSelect('update');
    $('#select8').val("").niceSelect('update');
    
    $('#selectD12').val("").niceSelect('update');
    $('#selectD13').val("").niceSelect('update');
   // $('#selectD13').val("").niceSelect('update');

    $('#selectD22').val("").niceSelect('update');
    $('#selectD23').val("").niceSelect('update');
    //$('#selectD23').val("").niceSelect('update');

    var table = $('#table-sede').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();
    var table = $('#table-dia1').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();
    var table = $('#table-dia2').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

}

function nuevaSede(){
    localStorage.id_sede = -1;
    limpiarNueva()
    $('#titulo_modal').html('Nueva Sede');
    $('#btn-search-rbd').prop('disabled',false)
    //$('#divInputCupo').css('display','none')
    $('#nuevaSedeModal').modal({backdrop: 'static', keyboard: false},'show')
}

function searchRBD() {
    if($("#inputRBD").val() == ""){
        showFeedback('error', 'Debe ingresar un RBD para realizar solicitud.', 'Error');
        return;
    }

    limpiar()

    $.blockUI({
        message: '<h1>Espere por favor</h1>',
        baseZ: 2000
    });
    var sRBD = $("#inputRBD").val();
    $.ajax({
        method: 'POST',
        url: webservice+'/sede/obtenerDataLiceo',
        headers: {
            't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType: 'text',
        data: { 
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            rbd: sRBD,
        },
        success: function(data, textStatus, jqXHR) {
            var mensaje = JSON.parse(data);
            if(typeof mensaje["respuesta"] === 'undefined'){
                console.log("correcto!")
                completarDatos(mensaje)
            }else{
                showFeedback("warning", mensaje["descripcion"], "");
                // limpiarInputs()
                $.unblockUI();
                console.log("incorrecto!")
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //feedback
            console.log(textStatus)
            showFeedback("error","Error en el servidor","Error");
            $.unblockUI();
            console.log(textStatus);
        }
    });
}


function completarDatos(datos) {

    disabledData()

    $("#inputNombreEstablecimiento").val(datos.nombre);
    $("#inputRegion").val(datos.id_region);
    cargarComunas(datos.id_region)
    $("#inputComuna").val(datos.id_comuna);
   
    $('#guardar_sede').prop('disabled',false)
    $.unblockUI();
}

/*function estadoSede(){
    if($(this).val() == 2){
        $('#inputCupo').prop('disabled',false)
    }else{
        $('#inputCupo').val(-1)
        $('#inputCupo').prop('disabled',true)
    }
}*/

function guardarSede(){

    rbd = $('#inputRBD').val()
    nombre = $('#inputNombreEstablecimiento').val()
    direccion = $('#inputDireccionEstablecimiento').val()
    nro = $('#inputNroEstablecimiento').val()
    estado = $('#inputEstado').val() == 'null' ? 0 : $('#inputEstado').val()
    comuna = $('#inputComuna').val()

    nombreContacto = $('#inputNombreContacto').val()
    mail = $('#inputMail').val()
    telefono = $('#inputTelefono').val()
    cargo = $('#inputCargo').val()
    otros = $('#inputOtros').val()

    disponibles = $('#inputDisponibles').val()
    requeridas = $('#inputRequeridas').val()

    centro = $('#inputCentro').val() == -1 ? null : $('#inputCentro').val()
    //cupo = $('#inputCupo').val() == -1 ? null : $('#inputCupo').val()

    if(validar() == true){
        $.ajax({
            method:'POST',
            url: webservice+'/sede/guardar',
            headers:{
               't': JSON.parse(localStorage.user).token
            },
            crossDomain: true,
            dataType:'text',
            data :{ 
                    id_sede: localStorage.id_sede,
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    rbd: rbd,
                    nombre: nombre,
                    direccion: direccion,
                    nro: nro,
                    comuna: comuna,
                    estado: estado,
                    contacto_nombre: nombreContacto,
                    contacto_email: mail,
                    contacto_fono: telefono,
                    contacto_cargo: cargo,
                    contacto_otro: otros,
                    salas_disponibles:disponibles,
                    salas_requeridas:requeridas,
                    id_centro_operaciones: centro,
                    //cupo: cupo
                },
            success: function(data, textStatus, jqXHR) {
                console.log(data)
                data = JSON.parse(data)
                if (data.respuesta == "ok") {
                    showFeedback("success", data.descripcion, "OK");
                    getSede();
                    $('#nuevaSedeModal').modal('hide');
                } else {
                    showFeedback("error","Error al guardar","Error");
                    console.log("invalidos");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showFeedback("error","Error en el servidor","Datos incorrectos");
                console.log("error del servidor, datos incorrectos");
     
            }
        })
    }

} 

function modificar(id){
    $.ajax({
        method:'POST',
        url: webservice+'/sede/modificar',
        headers: {
            't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            id_sede : id
        },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)

            if (data.resultado == undefined) {
                cargarDatos(data)
            }else {
                showFeedback("error",data.resultado,"Error");
                console.log("invalidos");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
 
        }
    })
 
}

function cargarDatos(data){
    localStorage.id_sede = data.sede.id_sede;
    limpiar()
    $('#titulo_modal').html('Modificar Sede')
    $('#div-search').css('display','none')
    $('#inputRBD').val(data.sede.rbd).prop('disabled',true);
    $('#inputNombreEstablecimiento').val(data.sede.nombre).prop('disabled',false);
    $('#inputEstado').val(data.sede.estado).prop('disabled',false);
 
    if(data.sede.id_estimacion != null){
    	$('#inputEstado').prop('disabled',true);
    }
    $('#inputDireccionEstablecimiento').val(data.sede.direccion).prop('disabled',false);
    $('#inputNroEstablecimiento').val(data.sede.nro_direccion).prop('disabled',false);
    $('#inputRegion').val(data.sede.id_region).prop('disabled',false);
    cargarComunas(data.sede.id_region)
    $("#inputComuna").val(data.sede.id_comuna).prop('disabled',false);

    $('#inputNombreContacto').val(data.sede.contacto_nombre).prop('disabled',false);
    $('#inputMail').val(data.sede.contacto_email).prop('disabled',false);
    $('#inputTelefono').val(data.sede.contacto_fono).prop('disabled',false);
    $('#inputCargo').val(data.sede.contacto_cargo).prop('disabled',false);
    $('#inputOtros').val(data.sede.contacto_otro).prop('disabled',false);

    $('#inputDisponibles').val(data.sede.salas_disponibles).prop('disabled',false);
    $('#inputRequeridas').val(data.sede.salas_requeridas).prop('disabled',false);

    //cargarCentros(data.centros);
    $('#inputCentro').val(data.sede.id_centro_operaciones == null ? -1 : data.sede.id_centro_operaciones).prop('disabled',false);

    //$('#divInputCupo').css('display','') 
    //$('#inputCupo').html('')
    //$('#inputCupo').append('<option value="-1" selected="">Elegir...</option>') 

    // for(i = 0; i < data.estimacion.length; i++){
    //     $('#inputCupo').append('<option value="'+data.estimacion[i].id_estimacion+'">Docentes: '+data.estimacion[i].docentes+', Salas: '+data.estimacion[i].salas+'</option>') 
    // }
    // if(data.sede.estado == 2){
    //     $('#inputCupo').prop('disabled',false)
    // }else{
    //     $('#inputCupo').prop('disabled',true)
    // }
    // $('#inputCupo').val(data.sede.id_estimacion == null ? -1 : data.sede.id_estimacion)
    $('#btn-search-rbd').prop('disabled',true)
    $('#nuevaSedeModal').modal({backdrop: 'static', keyboard: false},'show')
    $('#guardar_sede').prop('disabled',false)
}

/*function cargarCentros(data){
    $('#inputCentro').html('')
    $('#inputCentro').append('<option value="-1" selected="">Elegir...</option>') 

    for(i = 0; i < data.length; i++){
        $('#inputCentro').append('<option value="'+data[i].id_centro_operaciones+'">Centro '+data[i].nombre+'</option>') 
    }
     
}*/

function validar(){

    valida = true

    if($('#inputRBD').val().length < 1){
        valida = false
        $('#inputRBD').addClass('is-invalid')
    }else{
        $('#inputRBD').removeClass('is-invalid')
    }

    if($('#inputNombreEstablecimiento').val().length < 1){
        valida = false
        $('#inputNombreEstablecimiento').addClass('is-invalid')
    }else{
        $('#inputNombreEstablecimiento').removeClass('is-invalid')
    }

    if($('#inputDisponibles').val().length < 1){
        valida = false
        $('#inputDisponibles').addClass('is-invalid')
    }else{
        $('#inputDisponibles').removeClass('is-invalid')
    }

    if($('#inputRequeridas').val().length < 1){
        valida = false
        $('#inputRequeridas').addClass('is-invalid')
    }else{
        $('#inputRequeridas').removeClass('is-invalid')
    }

    if($('#inputRegion').val() == -1){
        valida = false
        $('#inputRegion').addClass('is-invalid')
    }else{
        $('#inputRegion').removeClass('is-invalid')
    }

    if($('#inputComuna').val() == -1){
        valida = false
        $('#inputComuna').addClass('is-invalid')
    }else{
        $('#inputComuna').removeClass('is-invalid')
    }


    return valida;
}

function disabledData(){
    var input = document.getElementsByTagName("input");
    
    for (var i = 0; i < input.length; i++) {
        input[i].disabled = false;
    }
    $('#inputOtros').prop('disabled',false)
    $('#inputEstado').prop('disabled',false)
    $('#inputRegion').prop('disabled',false)
    $('#inputComuna').prop('disabled',false)
    $('#inputCentro').prop('disabled',false)
    //$('#inputCupo').prop('disabled',false)
}

function limpiar(){

    $('#guardar_sede').prop('disabled',true)
    var input = document.getElementsByTagName("input");
    
    for (var i = 0; i < input.length; i++) {
        if(input[i].id != 'inputRBD'){
            input[i].value = '';
        }
        $(input[i]).removeClass('is-invalid')
    }

    $('#inputOtros').val('')

}

function limpiarNueva(){
    $('#guardar_sede').prop('disabled',true)
    $('#div-search').css('display','')
    var input = document.getElementsByTagName("input");
    
    for (var i = 0; i < input.length; i++) {
        input[i].value = '';
        if(input[i].id != 'inputRBD'){
            $(input[i]).removeClass('is-invalid').prop('disabled',true)
        }else{
            $(input[i]).removeClass('is-invalid').prop('disabled',false)
        }
    }

    $('#inputEstado').val('null').prop('disabled',true)
    $('#inputRegion').val('-1').prop('disabled',true)
    $('#inputComuna').val('-1').prop('disabled',true)
    $('#inputCentro').val('-1').prop('disabled',true)
    //$('#inputCupo').val('-1').prop('disabled',true)

    $('#inputOtros').val('').prop('disabled',true)


}

function redireccionarSede(id){
    localStorage.id_sede = id;
    redirectInfraestructuraSala()
}


function asignar(){
	localStorage.id_estimacion = $(this).data('id_estimacion')
	localStorage.id_sede = $(this).data('id_sede')
	 
	$('#nombreComuna').html($(this).data('comuna'))
    $.ajax({
        method:'POST',
        url: webservice+'/sede/lista-sedes-comuna',
        headers: {
            't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            id_comuna :  $(this).data('id_comuna'),
            dia:$(this).data('dia'),
        },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)

            if (data.resultado == undefined) {
                cargarCupo(data)
            }else {
                showFeedback("error",data.resultado,"Error");
                console.log("invalidos");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
 
        }
    })
 
}

function cargarCupo(data){
	$('#footer-asignar').css('display','')
 	$('#mensajeSede').css('display','none')
    $('#inputSede').html('')
	    $('#inputSede').append('<option value="-1" selected="">Sin Sede...</option>') 
	    if( data.length > 0){
	    	$('#inputSede').css('display','')
	    	for(i = 0; i < data.length; i++){
		        $('#inputSede').append('<option value="'+data[i].id_sede+'">'+data[i].nombre+'</option>') 
		    }
            console.log(localStorage.id_sede)
		    $('#inputSede').val(localStorage.id_sede == 'null' ? '-1' : localStorage.id_sede)	
		     
	    }else{
	    	$('#inputSede').css('display','none')
	    	$('#mensajeSede').css('display','')
	    	$('#footer-asignar').css('display','none')
	    	 
	    	
	    }

	     

    $('#asignarModal').modal({backdrop: 'static', keyboard: false},'show')
    
}

function guardarAsignacion(){

	$('#inputSede').removeClass('is-invalid')
	$.ajax({
        method:'POST',
        url: webservice+'/sede/guarda-liceo-cupo',
        headers: {
            't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            id_sede :  $('#inputSede').val() == '-1' ? localStorage.id_sede : $('#inputSede').val() ,
            id_estimacion: $('#inputSede').val() == '-1' ? '-1' : localStorage.id_estimacion 
        },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)

            if (data.respuesta == undefined) {
                getListaEstimacion1()
				getListaEstimacion2()
                $('#asignarModal').modal({backdrop: 'static', keyboard: false},'hide')
            }else if(data.respuesta == 'error'){
                 showFeedback("error",data.descripcion,"Error");
            }else {
                showFeedback("error",data.resultado,"Error");
                console.log("invalidos");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
 
        }
    })

 
 
}