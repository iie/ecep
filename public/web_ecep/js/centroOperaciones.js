$(document).ready(function(){
    loginvalid(localStorage.getItem('user'))
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectModulo);
    $('#guardar_centro').click(guardarCentro);
    
   
    getCentro()  
});
var region = '';
function getCentro(){

    $.ajax({
        method:'POST',
        url: webservice+'/centro/lista',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data:{ 
            id_usuario: JSON.parse(localStorage.user).id_usuario,
        },
        success: function(data, textStatus, jqXHR) {
            llenarVista(data)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
 
        }
    })

}

var encargadoZonal = ''
function llenarVista(data){
    
    data = JSON.parse(data)
    //console.log(data)
    region = data.regiones;
    $('#filtros').empty();
    if($.fn.dataTable.isDataTable('#table-centro')){
        $('#table-centro').DataTable().destroy();
        $('#lista_centro').empty();
    }

    var tablaD = $("#table-centro").DataTable({
        dom: "<'search'f>",
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
        data: data.centros,
        responsive: true, 
        columnDefs: [{
            targets: 6,
            orderable: false
        }],
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "region"},
            {data: "provincia"},
            {data: "comuna"},
           /* {data: "nombre"},*/
            /*{data: "coordinador_zonal"},*/
            /*{data: "coordinador_regional"},*/
            {data: "encargado"},
            {data: "confirmado", className: "text-center",
                render: function(data, type, row){
                    if(data == 2){
                        return 'Si';
                    }else{
                        return 'No';
                    }

                }
            },
            {data: "servicios_basicos", className: "text-center",
                render: function(data, type, row){
                    
                    if(data == false){
                        return 'No';
                    }else{
                        return 'Si';
                    }

                }
            },
            {data: "inmobiliario", className: "text-center",
                render: function(data, type, row){
                    console.log(data);
                    if(data == false){
                        return 'No';
                    }else{
                        return 'Si';
                    }

                }
            },
            {data: "extintor", className: "text-center",
                render: function(data, type, row){
                    if(data == false){
                        return 'No';
                    }else{
                        return 'Si';
                    }

                }
            },
            {data: "internet", className: "text-center",
                render: function(data, type, row){
                    if(data == false){
                        return 'No';
                    }else{
                        return 'Si';
                    }

                }
            },
            {data: "camara_operativa", className: "text-center",
                render: function(data, type, row){
                    if(data == false){
                        return 'No';
                    }else{
                        return 'Si';
                    }

                }
            },
            {data: "opciones",className: "text-center",
                render: function(data, type, row){
                    return '<button type="button" id="centro_'+row.id_centro_operaciones+'" onclick="modificar('+row.id_centro_operaciones+')" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button'        
                }
            }
        ],
        "initComplete": function(settings, json) {
            var placeholder = ["","Región","Provincia","Comuna","","Confirmado"]
            this.api().columns([1,2,3,5]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="select'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros'))
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
                column.data().unique().each( function ( d, j ) {
                    if(index == 5 ){
                        d = (d == 2 ? 'SI' : 'NO')
                    }  
                    $('#select'+index).append( '<option value="'+d+'">'+d+'</option>' )  

                        
                } );
                 $('#select'+index).niceSelect();        
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(){
            var placeholder = ["","Región","Provincia","Comuna","","Confirmado"]
            this.api().columns([1,2,3,5]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#select"+index)
                if(selectFiltered.val()===''){
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">'+placeholder[index]+'</option>')
                    columnFiltered.column(index,{search:'applied'}).data().unique().each( function ( d, j ) {
                         
                        if(index == 5 ){
                            d = (d == 2 ? 'SI' : 'NO')
                        }
                        selectFiltered.append( '<option value="'+d+'">'+d+'</option>' )

                    } );
                }
                $('select').niceSelect('update');
            })
        }
    });

    $("#descargar-lista").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });

    $('#limpiar-filtros').click(btnClearFilters);
    $('#total-centro').html(data.centros.length);
    $("#table-centro").show(); 

    //llenarVista2(data)

    $('#inputRegion').html('')
    $('#inputRegion').append('<option value="-1" selected="">Elegir...</option>') 
    for(i = 0; i < data.regiones.length; i++){
        $('#inputRegion').append('<option value="'+data.regiones[i].id_region+'">'+data.regiones[i].nombre+'</option>');
    }

    $('#inputZona').html('')
    $('#inputZona').append('<option value="-1" selected="">Elegir...</option>') 
    for(i = 0; i < data.zonas.length; i++){
        $('#inputZona').append('<option value="'+data.zonas[i].id_zona_region+'">'+data.zonas[i].zona_nombre+', '+data.zonas[i].region+'</option>');
    }

    /*$('#inputCoordinadorRegional').html('')
    $('#inputCoordinadorRegional').append('<option value="-1" selected="">Elegir...</option>') 
    for(i = 0; i < data.encargadoRegional.length; i++){
        $('#inputCoordinadorRegional').append('<option value="'+data.encargadoRegional[i].id_persona+'">'+data.encargadoRegional[i].nombres+' '+data.encargadoRegional[i].apellido_paterno+'</option>');
    }

    $('#inputEncargado').html('')
    $('#inputEncargado').append('<option value="-1" selected="">Elegir...</option>') 
    for(i = 0; i < data.encargadoCentro.length; i++){
        $('#inputEncargado').append('<option value="'+data.encargadoCentro[i].id_persona+'">'+data.encargadoCentro[i].nombres+' '+data.encargadoCentro[i].apellido_paterno+'</option>');
    }
    encargadoZonal = data.encargadoZonal*/
}

function llenarVista2(data){
    $('#filtros_pendiente').empty();
    //if(data.centros_no_confirmados.length != 0){
        if($.fn.dataTable.isDataTable('#table-centro-pendiente')){
            $('#table-centro-pendiente').DataTable().destroy();
            $('#lista_centro_pendiente').empty();
        }
    //}

    var tablaD = $("#table-centro-pendiente").DataTable({
        dom: "<'search'f>",
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslation,
        lengthChange: true,
        info: false,
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
        search: true,
        data: data.centros_no_confirmados,
        responsive: true, 
        columnDefs: [{
            targets: 7,
            orderable: false
        }],
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "region"},
            {data: "provincia"},
            {data: "comuna"},
            /*{data: "nombre"},*/
            {data: "contacto_nombre"},
            {data: "contacto_fono"},
            {data: "contacto_email"},
            {data: "opciones",className: "text-center",
                render: function(data, type, row){
                    return '<button type="button" id="centro_'+row.id_centro_operaciones+'" onclick="modificar('+row.id_centro_operaciones+')" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button'        
                }
            }
        ],
        "initComplete": function(settings, json) {
            var placeholder = ["","Región","Provincia","Comuna"]
            this.api().columns([1,2,3]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="select2_'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros_pendiente'))
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
                column.data().unique().each( function ( d, j ) {
                    $('#select2_'+index).append( '<option value="'+d+'">'+d+'</option>' )
                     
                } );
                 $('#select2_'+index).niceSelect();        
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(){
            var placeholder = ["","Región","Provincia","Comuna"]
            this.api().columns([1,2,3]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#select2_"+index)
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

    $("#descargar-lista").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });

    $('#limpiar-filtros-pendiente').click(btnClearFilters);
    $('#total-centro-pendiente').html(data.centros_no_confirmados.length);
    $("#table-centro-pendiente").show(); 
}

function btnClearFilters(){
    $('#select1').val("").niceSelect('update');
    $('#select2').val("").niceSelect('update');
    $('#select3').val("").niceSelect('update');
    $('#select5').val("").niceSelect('update');

  /*  $('#select2_1').val("").niceSelect('update');
    $('#select2_2').val("").niceSelect('update');
    $('#select2_3').val("").niceSelect('update');*/
 
    var table = $('#table-centro').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();
/*
    var table = $('#table-centro-pendiente').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();*/

}

function nuevoCentro(){
	$('#titulo_modal').html('Nuevo Centro');
    localStorage.id_centro_operaciones = -1;
    limpiar()
    $('#nuevoCentroModal').modal({backdrop: 'static', keyboard: false},'show')
}


function limpiar(){

    var input = document.getElementsByTagName("input"); 
    for (var i = 0; i < input.length; i++) {
        input[i].value = '';

    }
    //$('#inputNombre').removeClass('is-invalid')
    $('#inputRegion').val(-1)
    $('#inputComuna').val(-1).prop('disabled',true)
 
    $('#inputZona').val(-1)
    /*$('#inputCoordinadorZonal').val(-1)
    $('#inputCoordinadorRegional').val(-1)
    $('#inputEncargado').val(-1)*/
    $('#inputConfirmado').val(0)
    $('#inputCamara').val(-1)
    
}

function guardarCentro(){
    
    if(validar() == true){
        $.ajax({
            method:'POST',
            url: webservice+'/centro/guardar',
            headers:{
               't': JSON.parse(localStorage.user).token
            },
            crossDomain: true,
            dataType:'text',
            data :{ 
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    id_centro_operaciones: localStorage.id_centro_operaciones,
                    id_zona_region: $('#inputZona').val() == -1 ? null : $('#inputZona').val(),
                    /*id_coordinador_zonal: $('#inputCoordinadorZonal').val(),
                    id_coordinador_regional: $('#inputCoordinadorRegional').val(),
                    id_encargado: $('#inputEncargado').val(),*/
                    direccion: $('#inputDireccion').val(),
                    contacto_nombre: $('#inputNombreContacto').val(),
                    contacto_cargo: $('#inputCargoContacto').val(),
                    contacto_fono: $('#inputFonoContacto').val(),
                    contacto_email: $('#inputMailContacto').val(),
                    confirmado: $('#inputConfirmado').val(),
                    contacto_otro: $('#inputOtroContacto').val(),
                    comentario: $('#inputComentarios').val(),
                    //nombre: $('#inputNombre').val(),
                    id_comuna: $("#inputComuna").val(),
                    servicios_basicos: $('#inputSBasicos').val() == -1 ? false : $('#inputSBasicos').val(),
                    inmobiliario: $('#inputInmobiliario').val() == -1 ? false : $('#inputInmobiliario').val(),
                    extintor: $('#inputExtintor').val() == -1 ? false : $('#inputExtintor').val(),
                    internet: $('#inputInternet').val() == -1 ? false : $('#inputInternet').val(),
                    camara_operativa: $('#inputCamara').val() == -1 ? false : $('#inputCamara').val()

                },
            success: function(data, textStatus, jqXHR) {
                data = JSON.parse(data) 
                console.log(data)

                if (data.resultado != "error") {
                    showFeedback("success", data.descripcion, "Guardado");
                    $('#nuevoCentroModal').modal('hide');
                    getCentro()
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
        url: webservice+'/centro/modificar',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
                id_centro_operaciones : id
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
	$('#titulo_modal').html('Modificar Centro');
    localStorage.id_centro_operaciones = data.id_centro_operaciones;
    limpiar()
    $('#inputZona').val(data.id_zona_region == null ? -1 : data.id_zona_region)
   /* $('#inputCoordinadorZonal').val(data.id_coordinador_zonal == null ? -1 : data.id_coordinador_zonal)
    $('#inputCoordinadorRegional').val(data.id_coordinador_regional == null ? -1 : data.id_coordinador_regional)
    $('#inputEncargado').val(data.id_encargado == null ? -1 :data.id_encargado)*/
    //$('#inputNombre').val(data.nombre)
    $('#inputDireccion').val(data.direccion)
    $('#inputNombreContacto').val(data.contacto_nombre)
    $('#inputCargoContacto').val(data.contacto_cargo)
    $('#inputFonoContacto').val(data.contacto_fono)
    $('#inputMailContacto').val(data.contacto_email)
    $('#inputConfirmado').val(data.confirmado)
    $('#inputOtroContacto').val(data.contacto_otro)
    $('#inputComentarios').val(data.comentario)
    $("#inputRegion").val(data.id_region);
    cargarComunas(data.id_region)
    $("#inputComuna").val(data.id_comuna);
    $('#inputSBasicos').val(''+data.servicios_basicos+'')
    $('#inputInmobiliario').val(''+data.inmobiliario+'')
    $('#inputExtintor').val(''+data.extintor+'')
    $('#inputInternet').val(''+data.internet+'')
    $('#inputCamara').val(''+data.camara_operativa+'')

    $('#nuevoCentroModal').modal({backdrop: 'static', keyboard: false},'show')
}

function cargarComunas(id){
    $('#inputComuna').html('').prop('disabled',false)
    $('#inputComuna').append('<option value="-1" selected="">Elegir...</option>') 
    for(h = 0; h < region.length; h++){
        if(region[h].id_region == id){
            for(i = 0; i < region[h].comunas.length; i++){
                $('#inputComuna').append('<option value="'+region[h].comunas[i].id_comuna+'">'+region[h].comunas[i].nombre+'</option>') 
            }
        }
    }
}
function validar(){
    var input = document.getElementsByTagName("input");
    valida = true
   /* if($('#inputNombre').val().length < 1){
        valida = false
        $('#inputNombre').addClass('is-invalid')
    }else{
        $('#inputNombre').removeClass('is-invalid')
    }*/

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
/*    for (var i = 0; i < input.length; i++) {
        if($(input[i]).attr('id') != undefined && input[i].id != "inputOtroContacto" && input[i].id != "inputComentarios"){
            if(input[i].value.length < 1){
                valida = false
                $(input[i]).addClass('is-invalid')
            }else{
                $(input[i]).removeClass('is-invalid')
            }
        }
         
    }

    var select = document.getElementsByTagName("select");
    for (var i = 0; i < select.length; i++) {
        if(select[i].value == -1){
            valida = false
            $(select[i]).addClass('is-invalid')
        }else{
            $(select[i]).removeClass('is-invalid')
        }
    }*/
    return valida;
}
