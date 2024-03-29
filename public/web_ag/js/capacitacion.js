$(document).ready(function(){
    loginvalid(localStorage.getItem('user'))
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectModulo);
    $('#selectCapacitacion').on('change',verPersonal);
        
    $('#guardar_asignacion').on('click',asignarCapacitacion);
    $('#guardar_persona').click(guardarPersonal);
         
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

    llenarSelects(data)

   /* if(JSON.parse(localStorage.user).id_cargo != 1003 && JSON.parse(localStorage.user).id_cargo != 1004){
        llenarVista2(data)
    }*/
     
}

function llenarVistaCapacitacion(data){

    //data = JSON.parse(data)
     
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
    $('#selectRegion').val('-1')
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

function nuevaPersona(){

    localStorage.id_persona = -1;    
    localStorage.id_persona_cargo = -1;
    localStorage.usuario_id = -1;
    
    $('#divUsuario').css('display','')
  
    $('#inputUsuario').prop('disabled',false)
    $('#inputContrasena').prop('disabled',false)
 
    limpiarPersona()
    disabledDataPersona()
    $('#inputRun').prop('disabled',false)
    $('#div-search').css('display','')
    $('#titulo_modal').html('Nueva Persona');
    $('#personalModal').modal({backdrop: 'static', keyboard: false},'show')

}

function searchRUN() {

    if($("#inputRun").val() == ""){
        showFeedback('error', 'Debe ingresar un RUN para realizar solicitud.', 'Error');
        return;
    }

    if($.validateRut($("#inputRun").val()) == false) {
        showFeedback('error', 'Debe ingresar un RUN válido.', 'Error');
        return;
    }

    var run = ($('#inputRun').val().toUpperCase()).replace(/\./g,'');
    limpiar()
    $('#inputRun').val($.formatRut(run))
    $.blockUI({
        message: '<h1>Espere por favor</h1>',
        baseZ: 2000
    });

    $.ajax({
        method: 'POST',
        url: webservice+'/personal/obtenerPersona',
        headers: {
            't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType: 'text',
        data: { 
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            run: run,
        },
        success: function(data, textStatus, jqXHR) {
            var mensaje = JSON.parse(data);
            if(typeof mensaje["resultado"] === 'undefined'){
                console.log("correcto!")
                cargarDatos(JSON.parse(data))
                enabledDataPersona()
                $.unblockUI();
            }else{
                if(mensaje["resultado"] == 'existe'){
                    console.log("correcto!")
                    showFeedback("warning", mensaje["descripcion"], "");
                    disabledDataPersona()
                    $('#inputRun').prop('disabled',false)
                    $.unblockUI();

                }else{
                    showFeedback("warning", mensaje["descripcion"], "");
                    enabledDataPersona()
                    $.unblockUI();
                    console.log("no existe!")
                }
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

function llenarSelects(data){
    
    $('#inputSexo').html('').append('<option value="-1" selected="">Elegir...</option>') 
    for(i = 0; i < data.sexo.length; i++){
        $('#inputSexo').append('<option value="'+data.sexo[i].id_tabla_maestra+'">'+data.sexo[i].descripcion_larga+'</option>') 
    }


    $('#inputEstadoCivil').html('').append('<option value="-1" selected="">Elegir...</option>') 
    for(i = 0; i < data.estadoCivil.length; i++){
        $('#inputEstadoCivil').append('<option value="'+data.estadoCivil[i].id_tabla_maestra+'">'+data.estadoCivil[i].descripcion_larga+'</option>') 
    }

    $('#inputRegionNacimiento').html('').append('<option value="-1" selected="">Elegir...</option>') 
    for(i = 0; i < data.regiones.length; i++){
        $('#inputRegionNacimiento').append('<option value="'+data.regiones[i].id_region+'">'+data.regiones[i].nombre+'</option>') 
    }

    $('#inputRegionResidencia').html('').append('<option value="-1" selected="">Elegir...</option>') 
    for(i = 0; i < data.regiones.length; i++){
        $('#inputRegionResidencia').append('<option value="'+data.regiones[i].id_region+'">'+data.regiones[i].nombre+'</option>') 
    }

    $('#inputUniversidad').html('').append('<option value="-1" selected="">Elegir...</option>') 
    for(i = 0; i < data.institucion.length; i++){
        $('#inputUniversidad').append('<option value="'+data.institucion[i].id_institucion+'">'+data.institucion[i].institucion+'</option>') 
    }

    $('#inputRegionPostulacion').html('').append('<option value="-1" selected="">Elegir...</option>') 
    for(i = 0; i < data.regiones.length; i++){
        $('#inputRegionPostulacion').append('<option value="'+data.regiones[i].id_region+'">'+data.regiones[i].nombre+'</option>') 
    }
}

function cargarDatos(data){
    $('#div-search').css('display','none')
    $('#titulo_modal').html('Modificar Persona');
    localStorage.id_persona = data.id_persona;
    localStorage.id_persona_cargo = data.id_persona_cargo == null ? -1 : data.id_persona_cargo;
    localStorage.usuario_id = data.id_usuario;
    limpiarPersona()
    enabledDataPersona()
    $('#inputRun').val($.formatRut(data.run))
    $('#inputNombres').val(data.nombres)
    $('#inputApellidoPaterno').val(data.apellido_paterno)
    $('#inputApellidoMaterno').val(data.apellido_materno)

    $('#inputSexo').val(data.id_sexo == null ? -1 : data.id_sexo)
    $('#inputEstadoCivil').val(data.id_estado_civil == null ? -1 : data.id_estado_civil)
    $('#inputFechaNacimiento').val(data.fecha_nacimiento)
    $('#inputNacionalidad').val(data.nacionalidad)
    if(/*data.nacionalidad == null || (data.nacionalidad).trim().toLowerCase() == 'chile' || (data.nacionalidad).trim().toLowerCase() == 'chilena' ||*/  data.otra_nacionalidad == null || data.otra_nacionalidad == 'No'){
        $('#inputExtranjero_no').prop('checked',true);
        $('#reginNacimiento').css('display','')
        $('#comunaNacimiento').css('display','')
    }else{
        $('#inputExtranjero_si').prop('checked',true);
        $('#reginNacimiento').css('display','none')
        $('#comunaNacimiento').css('display','none')
    }

    $('#inputRegionNacimiento').val(data.id_region_nacimiento == null ? -1 : data.id_region_nacimiento)
    cargarComunasPersona('inputComunaNacimiento', data.id_region_nacimiento)
    $('#inputComunaNacimiento').val(data.id_comuna_nacimiento == null ? -1 : data.id_comuna_nacimiento)

    $('#inputRegionResidencia').val(data.id_region_residencia == null ? -1 : data.id_region_residencia)
    cargarComunasPersona('inputComunaResidencia', data.id_region_residencia)
    $('#inputComunaResidencia').val(data.id_comuna_residencia == null ? -1 : data.id_comuna_residencia)

    $('#inputRegionPostulacion').val(data.id_region_postulacion == null ? -1 : data.id_region_postulacion)
    cargarComunasPersona('inputComunaPostulacion', data.id_region_postulacion)
    $('#inputComunaPostulacion').val(data.id_comuna_postulacion == null ? -1 : data.id_comuna_postulacion)
 

    $('#inputDireccion').val(data.domicilio)
    $('#inputSector').val(data.domicilio_sector)
    $('#inputMail').val(data.email)
    $('#inputTelefono').val(data.telefono)
    $('#inputNivelEstudios').val(data.nivel_estudios == null ? -1 : data.nivel_estudios)
    $('#inputProfesion').val(data.profesion)

    $('#inputUniversidad').val(data.id_institucion == null ? -1 : data.id_institucion)

    /*$('#inputRegionAsignada').val()*/
    $('#inputNroCuenta').val(data.banco_nro_cuenta)
    $('#inputTipoCuenta').val(data.banco_tipo_cuenta)
    $('#inputBanco').val(data.banco_nombre)

    $('#inputUsuario').val(data.usuario)
 
    $('#personalModal').modal({backdrop: 'static', keyboard: false},'show')
}

function cargarComunasPersona(input,id){
    $('#'+input).html('')
    $('#'+input).append('<option value="-1" selected="">Elegir...</option>') 
    for(h = 0; h < regiones.length; h++){
        if(regiones[h].id_region == id){
            for(i = 0; i < regiones[h].comunas.length; i++){
                $('#'+input).append('<option value="'+regiones[h].comunas[i].id_comuna+'">'+regiones[h].comunas[i].nombre+'</option>') 
            }
        }
    }
    $('#'+input).prop('disabled',false)
}

function guardarPersonal(){
    var checkbox = $('input:checkbox[name=inputRolAsignado]')
    cargos = [];

    cargos.push(1008)



    if(validarPersona() == true){
        $.ajax({
            method:'POST',
            url: webservice+'/personal/guardar',
            headers:{
               't': JSON.parse(localStorage.user).token
            },
            crossDomain: true,
            dataType:'text',
            data :{ 
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    id_persona: localStorage.id_persona,
                    id_persona_cargo: localStorage.id_persona_cargo,
                    run: ($('#inputRun').val().toUpperCase()).replace(/\./g,''),
                    nombres: $('#inputNombres').val(),
                    apellido_paterno: $('#inputApellidoPaterno').val(),
                    apellido_materno: $('#inputApellidoMaterno').val(),
                    email: $('#inputMail').val(),
                    telefono: $('#inputTelefono').val(),
                    id_comuna_nacimiento: $('#inputComunaNacimiento').val() == -1 ? null : $('#inputComunaNacimiento').val(),
                    id_cargo: cargos,
                    id_sexo: $('#inputSexo').val() == -1 ? null : $('#inputSexo').val(),
                    id_estado_civil: $('#inputEstadoCivil').val() == -1 ? null : $('#inputEstadoCivil').val(),
                    id_institucion: $('#inputUniversidad').val() == -1 ? null : $('#inputUniversidad').val(),
                    id_comuna_residencia: $('#inputComunaResidencia').val() == -1 ? null : $('#inputComunaResidencia').val(),
                    nacionalidad: $('#inputNacionalidad').val(),
                    domicilio: $('#inputDireccion').val(),
                    domicilio_sector: $('#inputSector').val(),
                    fecha_nacimiento: $('#inputFechaNacimiento').val(),
                    nivel_estudios: $('#inputNivelEstudios').val() == -1 ? null : $('#inputNivelEstudios').val(),
                    profesion: $('#inputProfesion').val(),
                    banco_nro_cuenta: $('#inputNroCuenta').val(),
                    banco_tipo_cuenta: $('#inputTipoCuenta').val(),
                    banco_nombre: $('#inputBanco').val(),
                    otra_nacionalidad: $('input:radio[name=inputExtranjero]').val(),
                    id_comuna_postulacion:$('#inputComunaPostulacion').val() == -1 ? null : $('#inputComunaPostulacion').val(),

                    usuario : $('#inputUsuario').val(),
                    contrasena : $('#inputContrasena').val(),
                    usuario_id: localStorage.usuario_id,


                },
            success: function(data, textStatus, jqXHR) {
                data = JSON.parse(data) 
                console.log(data)

                if (data.resultado != "error") {
                    showFeedback("success", data.descripcion, "Guardado");
                    $('#personalModal').modal('hide');
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

function validarPersona(){
    var input = document.getElementsByTagName("input");
    valida = true

    if($('#inputRun').val().length < 1){
        valida = false
        $('#inputRun').addClass('is-invalid')
    }else{
        $('#inputRun').removeClass('is-invalid')
    }

    if($('#inputNombres').val().length < 1){
        valida = false
        $('#inputNombres').addClass('is-invalid')
    }else{
        $('#inputNombres').removeClass('is-invalid')
    }

    if($('#inputApellidoPaterno').val().length < 1){
        valida = false
        $('#inputApellidoPaterno').addClass('is-invalid')
    }else{
        $('#inputApellidoPaterno').removeClass('is-invalid')
    }

    if($('#inputApellidoMaterno').val().length < 1){
        valida = false
        $('#inputApellidoMaterno').addClass('is-invalid')
    }else{
        $('#inputApellidoMaterno').removeClass('is-invalid')
    }

    if($('#inputRegionPostulacion').val() == -1){
        valida = false
        $('#inputRegionPostulacion').addClass('is-invalid')
    }else{
        $('#inputRegionPostulacion').removeClass('is-invalid')
    }

    if($('#inputComunaPostulacion').val() == -1){
        valida = false
        $('#inputComunaPostulacion').addClass('is-invalid')
    }else{
        $('#inputComunaPostulacion').removeClass('is-invalid')
    }

    if($('#inputUsuario').val().length < 1){
        valida = false
        $('#inputUsuario').addClass('is-invalid')
    }else{
        $('#inputUsuario').removeClass('is-invalid')
    }

    if($('#inputContrasena').val().length < 1){
        valida = false
        $('#inputContrasena').addClass('is-invalid')
    }else{
        $('#inputContrasena').removeClass('is-invalid')
    }

    return valida;
}

function disabledDataPersona(){
    $('#personalModal').find('input').each(function(){
        this.disabled = true
        $(this).removeClass('is-invalid')
    });

    $('#inputExtranjero_no').prop('checked',true);
    
    $('#personalModal').find('select').each(function(){
        this.disabled = true
        $(this).removeClass('is-invalid')
    });

 
}

function enabledDataPersona(){
    $('#personalModal').find('input').each(function(){
        this.disabled = false
        $(this).removeClass('is-invalid')
    });

    $('#inputExtranjero_no').prop('checked',true);
    var select = document.getElementsByTagName("select");

    $('#personalModal').find('select').each(function(){
        this.disabled = false
        $(this).removeClass('is-invalid')
    });

    $('#inputComunaNacimiento').prop('disabled',true)
    $('#inputComunaResidencia').prop('disabled',true)
    $('#inputComunaPostulacion').prop('disabled',true)
 
}
function limpiarPersona(){

    $('#personalModal').find('input').each(function(){
        this.disabled = false
        if(this.type != 'checkbox' && this.type != 'radio'){
            this.value = '';
            this.disabled = false;
            $(this).removeClass('is-invalid')
        }
    });


    $('#inputSexo').val('-1') 
    $('#inputNivelEstudios').val('-1') 
    $('#inputEstadoCivil').val('-1') 
    $('#inputRegionNacimiento').val('-1') 
    $('#inputRegionResidencia').val('-1') 
    $('#inputRegionPostulacion').val('-1') 
    $('#inputUniversidad').val('-1') 

    $('#inputRegionAsignada').val('-1') 
}