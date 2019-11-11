$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectModulo);
    $('#selectCapacitacion').on('change',verPersonal);
        
    $('#guardar_asignacion').on('click',asignarCapacitacion);
         
    $('#guardar_capacitacion').click(guardarCapacitacion);
    $('#divInputHora').datetimepicker({
        format: 'HH:mm'
    });
    $('#divInputFecha').datetimepicker({
        locale: 'es',
        format: 'l'
    });
    //$("#inputFecha").datetimepicker({format: 'hh:ii',locale: 'es' }); 
    
    if(JSON.parse(localStorage.user).id_cargo == 1004){
        getPersonalCoordinador();

        $('#liZonal').remove();
        $('#liRegion').remove();
        $('#liCentro').remove();
        $('#tabZonal').remove();
        $('#tabRegional').remove();
        $('#tabCentro').remove();

        $('#btn-zonas').remove();
        $('#btn-zonas-nuevaPersona').remove();
        $('#btn-zonasRegion').remove();
        $('#btn-region-nuevaPersona').remove();

    }else if(JSON.parse(localStorage.user).id_cargo == 1003){
        getPersonalCoordinadorZonal();
        $('#liZonal').remove();
        $('#liCentro').remove();
        $('#tabZonal').remove();
        $('#tabCentro').remove();
        
        $('#btn-zonas').remove();
        $('#btn-zonas-nuevaPersona').remove();
        /*$('#btn-zonasRegion').remove();*/
        /*$('#btn-region-nuevaPersona').remove();*/

    }else{
        getPersonal();
    }

});

function getPersonal(){
     $.ajax({
        method:'POST',
        url: webservice+'/capacitacion/lista',
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


function getPersonalCoordinadorZonal(){
     $.ajax({
        method:'POST',
        url: webservice+'/personal/listaCoordinadorZonal',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data:{ 
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            id_cargo: JSON.parse(localStorage.user).id_cargo,
            id_persona: JSON.parse(localStorage.user).id_persona
        },
        success: function(data, textStatus, jqXHR) {
            llenarVista(data)
            llenarVista3(JSON.parse(data))
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
 
        }
    })
}

function getPersonalCoordinador(){
     $.ajax({
        method:'POST',
        url: webservice+'/personal/listaCoordinador',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data:{ 
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            id_cargo: JSON.parse(localStorage.user).id_cargo,
            id_persona: JSON.parse(localStorage.user).id_persona
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

anfitrion = 0;
examinador = 0;
eApoyo = 0;
supervisor = 0;
 
regiones = ''
relatores = ''
function llenarVista(data){

    data = JSON.parse(data)
    $('#filtros-postulacion').empty();
    if($.fn.dataTable.isDataTable('#table-postulacion')){
        $('#table-postulacion').DataTable().destroy();
        $('#lista-postulacion').empty();
    }

    var tablaD = $("#table-postulacion").DataTable({
        dom: "<'search'f>",
         
        buttons: [
            {
                extend: 'excel',
                title: 'Postulantes',
                // exportOptions: {
                //     columns: [ 0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10,12,14,15,16,17,18,19,20,21,22,11,23,24,25,26],
                // }
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
        data: data.personal_postulacion,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "nombre_zona"},
            {data: "region"},
            {data: "comuna"},
            {data: "nombre_rol"},
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "capacitacion",
                render: function(data, type,row){

                    if(row.id_capacitacion_persona != null && row.borrado_capacitacion == false ){
                        return  moment(row.fecha_hora).format('DD-MM-YYYY  HH:mm')+', '+row.lugar;
                    }else{
                        return '';
                    }
                     
                }
                    
            },
            {data: "opciones",className: "text-center",
                render: function(data, type, row){                
                    return '<button type="button" id="persona_'+row.id_persona+'"  class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'
                        
                }
            },
        ],
        // "columnDefs": [
        //     {
        //         "targets": [ 9,10,14,15,16,17,18,19,20,21,22,23,24,25,26 ],
        //         "visible": false,
        //         "searchable": false
        //     },
        // ],
        "rowCallback": function( row, data ) {
            $('td:eq(10)', row).find('button').data('id_cargo',data.id_cargo);
            $('td:eq(10)', row).find('button').data('id_comuna',data.id_comuna_postulacion);
            $('td:eq(10)', row).find('button').on('click',asignar);
        
            if(data.id_cargo == 1006){
                anfitrion++; 
            }else if(data.id_cargo == 8){
                examinador++;
            }else if(data.id_cargo == 1007){
                eApoyo++;
            }else if(data.id_cargo == 9){
                supervisor++;
            }
        },
        "initComplete": function(settings, json) {
            //$('#inputRolAsignado').prop('disabled',true)
            if(JSON.parse(localStorage.user).id_cargo == 1004){
                var api = new $.fn.dataTable.Api(settings);
                api.columns([1]).visible(false);
            }

            var checkbox = $('input:checkbox[name=inputRolAsignado]')
            for (var i = 0; i < checkbox.length; i++) {
                checkbox[i].disabled = true;
          
            }
            $('#inputUsuario').prop('disabled',true)
            $('#inputContrasena').prop('disabled',true)
            $('#divRol').css('display','none')
            $('#divUsuario').css('display','none')
             
            var placeholder = ["","Zona","Región","Comuna","Cargo"]
            this.api().columns([1,2,3,4]).every( function (index) {
                if(JSON.parse(localStorage.user).id_cargo == 1004 && index == 1){
                    return;
                }else{
                    var column = this;
                    var select = $('<select class="form-control col-sm-2 small _filtros"  id="select'+index+'" >'+
                        '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                        .appendTo( $('#filtros-postulacion'))
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
                }
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(settings){
            if(JSON.parse(localStorage.user).id_cargo == 1004){
                var api = new $.fn.dataTable.Api(settings);
                api.columns([1]).visible(false);
            }
            var placeholder = ["","Zona","Región","Comuna","Cargo"]
            this.api().columns([1,2,3,4]).every( function (index) {
                if(JSON.parse(localStorage.user).id_cargo == 1004 && index == 1){
                    return;
                }else{
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
                }
            })
        }
    });
 //tablaD.columns( [10] ).visible( false );
    $('#limpiar-filtros-postulacion').click(btnClearFilters);
    $("#descargar-lista").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });
    $('#total_anfitrion').html(anfitrion+'/-')
    $('#total_examinador').html(examinador+'/-')
    $('#total_examinador_apoyo').html(eApoyo+'/-')
    $('#tatal_supervisor').html(supervisor+'/-')
       
    $("#table-postulacion").show();  

    $('#selectRegion').html('').append('<option value="-1" selected="">Elegir...</option>') 
    for(i = 0; i < data.regiones.length; i++){
        $('#selectRegion').append('<option value="'+data.regiones[i].id_region+'">'+data.regiones[i].nombre+'</option>') 
    }
    regiones = data.regiones;
    relatores = data.relatores;
    capacitaciones = data.capacitaciones;

    llenarVistaCapacitacion(data.lista_capacitacion)
   /* if(JSON.parse(localStorage.user).id_cargo != 1003 && JSON.parse(localStorage.user).id_cargo != 1004){
        llenarVista2(data)
    }*/
     
}

function llenarVistaCapacitacion(data){

    //data = JSON.parse(data)
    data = JSON.parse(data)
    $('#filtros-capacitacion').empty();
    if($.fn.dataTable.isDataTable('#table-capacitacion')){
        $('#table-capacitacion').DataTable().destroy();
        $('#lista-capacitacion').empty();
    }

    var tablaD = $("#table-capacitacion").DataTable({
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
        data: data,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "region"},
            {data: "comuna"},
            {data: "relator",
                render: function(data, type, row){  
                    return  row.nombres + ' '+row.apellido_paterno+' '+row.apellido_materno;
                }
            },
            {data: "fecha",
                render:function(data,type,row){
                    return moment(row.fecha_hora).format('DD-MM-YYYY   HH:mm')
                }
            },
            {data: "lugar"},
            {data: "observacion"}
        ],
        "initComplete": function(settings, json) {
            //$('#inputRolAsignado').prop('disabled',true)
            if(JSON.parse(localStorage.user).id_cargo == 1004){
                var api = new $.fn.dataTable.Api(settings);
                api.columns([1]).visible(false);
            }

            var checkbox = $('input:checkbox[name=inputRolAsignado]')
            for (var i = 0; i < checkbox.length; i++) {
                checkbox[i].disabled = true;
          
            }
            $('#inputUsuario').prop('disabled',true)
            $('#inputContrasena').prop('disabled',true)
            $('#divRol').css('display','none')
            $('#divUsuario').css('display','none')
             
            var placeholder = ["","Región","Comuna"]
            this.api().columns([1,2]).every( function (index) {
                if(JSON.parse(localStorage.user).id_cargo == 1004 && index == 1){
                    return;
                }else{
                    var column = this;
                    var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectC'+index+'" >'+
                        '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                        .appendTo( $('#filtros-capacitacion'))
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
                }
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(settings){
 
            var placeholder = ["","Región","Comuna"]
            this.api().columns([1,2]).every( function (index) {
                if(JSON.parse(localStorage.user).id_cargo == 1004 && index == 1){
                    return;
                }else{
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
                }
            })
        }
 
 
    });
    $('#limpiar-filtros-capacitacion').click(btnClearFilters);
    $("#table-capacitacion").show();  
 
}
 
 
function cargarComunas(id){
 
    $('#selectComuna').html('')
    $('#selectComuna').append('<option value="-1" selected="">Elegir...</option>') 
    for(h = 0; h < regiones.length; h++){
        if(regiones[h].id_region == id){
            for(i = 0; i < regiones[h].comunas.length; i++){
                $('#selectComuna').append('<option value="'+regiones[h].comunas[i].id_comuna+'">'+regiones[h].comunas[i].nombre+'</option>') 
            }
        }
    }
    $('#selectComuna').prop('disabled',false)
}

function cargarRelatores(id){
 
    $('#selectRelator').html('')
    $('#selectRelator').append('<option value="-1" selected="">Elegir...</option>') 
    if(relatores[id] != undefined){
        for(h = 0; h < relatores[id].length; h++){
            $('#selectRelator').append('<option value="'+relatores[id][h].id_persona_cargo+'">'+relatores[id][h].nombres+' '+relatores[id][h].apellido_paterno+'</option>') 
        }
        $('#selectRelator').prop('disabled',false)
    }       
}
 

function btnClearFilters(){
    $('#select1').val("").niceSelect('update');
    $('#select2').val("").niceSelect('update'); 
    $('#select3').val("").niceSelect('update'); 
    $('#select4').val("").niceSelect('update'); 
    
    $('#selectC1').val("").niceSelect('update'); 
    $('#selectC2').val("").niceSelect('update'); 
    $('#selectC3').val("").niceSelect('update'); 
 
    var table = $('#table-postulacion').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

    var table = $('#table-capacitacion').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();
 

}

function nuevaCapacitacion(){ 

    $('#selectComuna').prop('disabled',true)
    $('#selectRelator').prop('disabled',true)
    limpiar()
    $('#capacitacionModal').modal({backdrop: 'static', keyboard: false},'show')
}

 

function guardarCapacitacion(){

    if(validar() == true){
        $.ajax({
            method:'POST',
            url: webservice+'/capacitacion/guardar',
            headers:{
               't': JSON.parse(localStorage.user).token
            },
            crossDomain: true,
            dataType:'text',
            data :{ 
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    id_comuna:  $('#selectComuna').val(),
                    id_relator: $('#selectRelator').val(),
                    lugar: $('#inputLugar').val(),
                    fecha:moment($("#inputFecha").val(), "DD-MM-YYYY").format("YYYY-MM-DD") + ' ' + $("#inputHora").val()
 
                },
            success: function(data, textStatus, jqXHR) {
                data = JSON.parse(data) 
                console.log(data)

                if (data.resultado != "error") {
                    showFeedback("success", data.descripcion, "Guardado");
                    $('#capacitacionModal').modal('hide');
                    getPersonal()
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

function validar(){ 
    valida = true
    if($('#selectRegion').val() == -1){
        valida = false
        $('#selectRegion').addClass('is-invalid')
    }else{
        $('#selectRegion').removeClass('is-invalid')
    }

    if($('#selectComuna').val() == -1){
        valida = false
        $('#selectComuna').addClass('is-invalid')
    }else{
        $('#selectComuna').removeClass('is-invalid')
    }

    if($('#selectRelator').val() == -1){
        valida = false
        $('#selectRelator').addClass('is-invalid')
    }else{
        $('#selectRelator').removeClass('is-invalid')
    }

    if($('#inputLugar').val().length < 1){
        valida = false
        $('#inputLugar').addClass('is-invalid')
    }else{
        $('#inputLugar').removeClass('is-invalid')
    }
    if($('#inputHora').val().length < 1){
        valida = false
        $('#inputHora').addClass('is-invalid')
    }else{
        $('#inputHora').removeClass('is-invalid')
    }

    if($('#inputFecha').val().length < 1){
        valida = false
        $('#inputFecha').addClass('is-invalid')
    }else{
        $('#inputFecha').removeClass('is-invalid')
    }

 
    
    return valida;
}

function limpiar(){
    var input = document.getElementsByTagName("input");    
    for (var i = 0; i < input.length; i++) {
        if(input[i].type != 'checkbox' && input[i].type != 'radio'){
            input[i].value = '';
            $(input[i]).removeClass('is-invalid')
        }
    }  
    $('#inputObservacion').val('')
    $('#selectComuna').val('-1') 
    $('#selectRelator').val('-1') 
}

function disabledData(){
    var input = document.getElementsByTagName("input");    
    for (var i = 0; i < input.length; i++) {
        input[i].disabled = true  
    }  

    $('#inputObservacion').prop('disabled',true)

    $('#personalModal').find('select').each(function(){
        this.disabled = true
    });
}

function enabledData(){
    var input = document.getElementsByTagName("input");    
    for (var i = 0; i < input.length; i++) {
        input[i].disabled = false
    }

    $('#inputObservacion').prop('disabled',true)
    
    $('#personalModal').find('select').each(function(){
        this.disabled = false
    });
}

function asignar(){

    localStorage.id_cargo = $(this).data('id_cargo') 
    localStorage.comuna = $(this).data('id_comuna') 
    $('#div_personas').html('');
    $('#selectCapacitacion').html('')
    id =  $(this).data('id_comuna') 
    if(capacitaciones[id] != undefined){
        $('#selectCapacitacion').append('<option value="-1" selected="">Elegir...</option>') 
        for(h = 0; h < capacitaciones[id].length; h++){
            $('#selectCapacitacion').append('<option value="'+capacitaciones[id][h].id_capacitacion+'">'+moment(capacitaciones[id][h].fecha_hora).format('DD-MM-YYYY - HH:mm')+', '+capacitaciones[id][h].lugar+'</option>') 
        }
    }else{
        $('#selectCapacitacion').append('<option value="-1" selected="">Sin Capacitaciones...</option>') 
    }

    $('#asignarCapacitacion').modal({backdrop: 'static', keyboard: false},'show')   
        
}

function verPersonal(){
    $('#div_personas').html('');
    if($(this).val() != -1){
        console.log($(this))
        $.ajax({
            method:'POST',
            url: webservice+'/capacitacion/obtenerPersonal',
            headers:{
               't': JSON.parse(localStorage.user).token
            },
            crossDomain: true,
            dataType:'text',
            data :{ 
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    id_comuna:  localStorage.comuna,
                    id_cargo:  localStorage.id_cargo,
                    id_capacitacion:  $('#selectCapacitacion').val()
            },
            success: function(data, textStatus, jqXHR) {
                data = JSON.parse(data) 
                console.log(data)

                if (data.resultado == undefined) {
                    cargarPeronal((data.personal_capacitacion))
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
        
}

function cargarPeronal(data){
    $('#div_personas').html('');

    if(data.length > 0){
        for (i = 0;  i < data.length; i++) {
            check = data[i].id_capacitacion != null ?  (data[i].borrado_capacitacion == false ? "checked" : "") : "" 
            div = '<div class="form-check form-check-inline custom-checkbox col-3 mr-0 mb-3">'+
                        '<input type="checkbox" id="check-persona-'+data[i].id_persona_cargo+'" name="checkPersonalCapacitacion" value="'+data[i].id_persona_cargo+'" '+
                            'class="form-check-input custom-control-input" '+check+'>'+
                        '<label class="form-check-label custom-control-label" value="'+data[i].id_persona_cargo+'" for="check-persona-'+data[i].id_persona_cargo+'">'+data[i].nombres+' '+data[i].apellido_paterno+'</label>'+
                    '</div>'
              
            $('#div_personas').append(div);
        }
    }else{
        $('#div_personas').html('No existe personal para el tipo de Rol seleccionado en la Comuna en la que se impartira la Capacitación.')
    }
                                      
    
}

function asignarCapacitacion(){
    capacitacionesAsignadas = [];
 
    var checkbox = $('input:checkbox[name=checkPersonalCapacitacion]')
    for (var i = 0; i < checkbox.length; i++) {
        check = checkbox[i].checked == true ? 1 : 0
        capacitacionesAsignadas.push({id_persona_cargo: checkbox[i].value, asignar: check})  
    }

    $.ajax({
            method:'POST',
            url: webservice+'/capacitacion/asignarCapacitacion',
            headers:{
               't': JSON.parse(localStorage.user).token
            },
            crossDomain: true,
            dataType:'text',
            data :{ 
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    id_capacitacion: $('#selectCapacitacion').val(),
                    personal_capacitacion:capacitacionesAsignadas,


                },
            success: function(data, textStatus, jqXHR) {
                data = JSON.parse(data) 
                console.log(data)

                if (data.resultado != "error") {
                    showFeedback("success", data.descripcion, "Guardado");
                    $('#asignarCapacitacion').modal('hide');
                    getPersonal()
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



function btnClearFiltersModal(){
    $('#selectModalR0').val("").niceSelect('update');
    $('#selectModalR1').val("").niceSelect('update'); 

    $('#selectModalC0').val("").niceSelect('update');
    $('#selectModalC1').val("").niceSelect('update');
    $('#selectModalC2').val("").niceSelect('update'); 
 
    var table = $('#table-zonasRegion').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

    var table = $('#table-centros').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw(); 
}