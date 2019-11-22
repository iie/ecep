$(document).ready(function(){
    loginvalid(localStorage.getItem('user'))
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectModulo);
    $('#btn-zonas').click(verZonas);
    $('#btn-zonasRegion').click(verZonasRegion);
    $('#btn-centros').click(verCentros);
     
        
    $('#guardar_persona').click(guardarPersonal);
    $('input:radio[name=inputExtranjero]').on('change',extranjero)

    $.blockUI({  
        baseZ: 3000,
        message: '<img style="width: 10%;" src="images/loading.gif" />',
        css: {
            border:     'none',
            backgroundColor:'transparent',        
        } 
    });

     $("#inputRun").rut({
        formatOn: 'keyup',
        minimunLength: 8,
        validateOn: 'change'
    });

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
        $('#btn-zonasRegion').remove();
        $('#btn-region-nuevaPersona').remove();
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
        url: webservice+'/personal/lista',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data:{ 
            id_usuario: JSON.parse(localStorage.user).id_usuario,
        },
        success: function(data, textStatus, jqXHR) {
            if(JSON.parse(data).resultado != undefined) {
  
                if(JSON.parse(data).resultado == "error"){            
                    showFeedback("error",JSON.parse(data).descripcion,"Datos incorrectos");
                }
                $.unblockUI();
            }else{
                llenarVista(data)
            } 
             
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
            $.unblockUI();
 
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

            if(JSON.parse(data).resultado != undefined) {
  
                if(JSON.parse(data).resultado == "error"){
                   
                    showFeedback("error",JSON.parse(data).descripcion,"Datos incorrectos");
                }
                $.unblockUI();
            }else{
                llenarVista(data)
                llenarVista3(JSON.parse(data))
            }  

        },
        error: function(jqXHR, textStatus, errorThrown) {
            $.unblockUI();
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
            if(JSON.parse(data).resultado != undefined) {
  
                if(JSON.parse(data).resultado == "error"){

                    showFeedback("error",JSON.parse(data).descripcion,"Datos incorrectos");
                }
                $.unblockUI();
            }else{
                llenarVista(data)
            } 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
            $.unblockUI();
 
        }
    })
}

anfitrion = 0;
examinador = 0;
eApoyo = 0;
supervisor = 0;
var strg;

validarTabla = 0;
var rutss = new Object();
function llenarVista(data){
    strg=JSON.parse(data).personal_postulacion
            
    
        
     
    
            
    data = JSON.parse(data)
    console.log(data.personal_postulacion)
    $('#filtros-postulacion').empty();
    if($.fn.dataTable.isDataTable('#table-postulacion')){
        $('#table-postulacion').DataTable().destroy();
        $('#lista-postulacion').empty();
    }

    var tablaD = $("#table-postulacion").DataTable({
        dom: "<'search'f>",
         
        /*buttons: [
            {
                extend: 'excel',
                title: 'Postulantes',
                exportOptions: {
                    columns: [ 0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10,12,14,15,16,17,18,19,20,21,22,11,23,24,25,26],
                }
            }
        ],*/
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
        data: data.personal_postulacion,
        responsive: true, 
        /*columnDefs: [{
            targets: 9,
            orderable: false
        }],*/
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "nombre_zona"},
            {data: "region"},
            {data: "comuna"},
            /*{data: "nombre_rol"},*/
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "email"},
            {data: "telefono"},
            {data: "titulo",className: "text-center",
                render: function(data, type, row){  
                    data
                    if (data=='') {
                        return '-'
                    }else if(data==null){
                        return '-'
                    }else{
                       return data 
                    }
                    
                    
                    
                 
                }
            },
            {data: "nivel_estudios"},
            {data: "estado"},
            {data: "opciones",className: "text-center",
                render: function(data, type, row){  
                    return ''
                    //console.log(strg)
                  /*  return '<button type="button" id="persona_'+row.id_persona+'" onclick="modificar('+row.id_persona+','+row.id_persona_cargo+',true)" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'+
                        '<button type="button" id="docPersona_'+row.id_persona+'"  class="ml-2 btn btn-primary btn-sm _btn-item"><i class="fas fa-file-alt"></i></button>'       */ 
                }
            },
            {data: "id_sexo"},
            {data: "id_estado_civil"},
            {data: "fecha_nacimiento"},
            {data: "otra_nacionalidad"},
            {data: "nacionalidad"},
            {data: "id_comuna_nacimiento"},
            {data: "id_comuna_residencia"},
            {data: "domicilio"},
            {data: "domicilio_sector"},

            {data: "profesion"},
            {data: "id_institucion"},
            {data: "banco_nro_cuenta"},
            {data: "banco_tipo_cuenta"},
            {data: "banco_nombre"},
        ],
        "columnDefs": [
            {
                "targets": [ 8,9,14,15,16,17,18,19,20,21,22,23,24,25,26,27],
                "visible": false,
                "searchable": false
            },
        ],
        "rowCallback": function( row, data ) {
            select = '<select class="form-control selectEstado" name="selectEstado">'
                        if(data.estado == 'reclutado'){
                            select +=   '<option value="reclutado">Reclutado</option>'+
                                        '<option value="preseleccionado">Preseleccionado</option>'+
                                        '<option value="rechazado">Rechazado</option>'
                        }

                        if(data.estado == 'preseleccionado'){
                            select +=   '<option value="preseleccionado">Preseleccionado</option>'+
                                        '<option value="rechazado">Rechazado</option>'
                        }

                        if(data.estado == 'capacitado'){
                            select +=   '<option value="capacitado" disabled>Capacitado</option>'+
                                        '<option value="seleccionado">Seleccionado</option>'
                                        if(JSON.parse(localStorage.user).id_cargo != 1003 && JSON.parse(localStorage.user).id_cargo != 1004){
                                           select += '<option value="contratado">Contratado</option>'
                                        }else{
                                            select += '<option value="contratado" disabled>Contratado</option>'
                                        }
                            select += '<option value="rechazado">Rechazado</option>'
                        }

                        if(data.estado == 'seleccionado'){
                            select +=   '<option value="seleccionado">Seleccionado</option>'
                                        if(JSON.parse(localStorage.user).id_cargo != 1003 && JSON.parse(localStorage.user).id_cargo != 1004){
                                           select += '<option value="contratado">Contratado</option>'
                                        }else{
                                            select += '<option value="contratado" disabled>Contratado</option>'
                                        }
                            select +=   '<option value="rechazado">Rechazado</option>'
                        }

                        if(data.estado == 'contratado'){
                            if(JSON.parse(localStorage.user).id_cargo != 1003 && JSON.parse(localStorage.user).id_cargo != 1004){
                               select += '<option value="contratado">Contratado</option>'
                            }else{
                                select += '<option value="contratado" disabled>Contratado</option>'
                            }
                        }

                        if(data.estado == 'rechazado'){
                            select +=   '<option value="rechazado">Rechazado</option>'
                        }


/*                                '<option value="reclutado">Reclutado</option>'+
                                '<option value="preseleccionado">Preseleccionado</option>'+
                                '<option value="capacitado" disabled>Capacitado</option>'+
                                '<option value="seleccionado">Seleccionado</option>'
                                if(JSON.parse(localStorage.user).id_cargo != 1003 && JSON.parse(localStorage.user).id_cargo != 1004){
                                   select += '<option value="contratado">Contratado</option>'
                                }else{
                                    select += '<option value="contratado" disabled>Contratado</option>'
                                }
                    select += '<option value="rechazado">Rechazado</option>'+*/
                    select += '</select>'


            acciones='<button type="button" id="persona_'+data.id_persona+'" onclick="modificar('+data.id_persona+',true)" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'+
                         '<button type="button" id="docPersona_'+data.id_persona+'"  class="ml-2 btn btn-primary btn-sm _btn-item"><i class="fas fa-file-alt"></i></button>'  
                        $('td:eq(11)', row).html(acciones)



            if(JSON.parse(localStorage.user).id_cargo != 1004){
                $('td:eq(10)', row).html(select)
                $('td:eq(10)', row).find('select').val(data.estado)
                if(data.estado=='contratado' || data.estado=='rechazado'){
                    $('td:eq(10)', row).find('select').prop('disabled',true)
                }
                $('td:eq(10)', row).find('select').data('id_persona',data.id_persona);

                $('td:eq(10)', row).find('select').on('change',cambiarEstado);

                $('td:eq(11)', row).find('#docPersona_'+data.id_persona).data('run',data.run);
                $('td:eq(11)', row).find('#docPersona_'+data.id_persona).data('id_persona',data.id_persona);
                $('td:eq(11)', row).find('#docPersona_'+data.id_persona).on('click',verDocs);
   
            }else{
                if(validarTabla ==  0){
                    col = 10
                    col2 = 11
                } else{
                    col = 9
                    col2 = 10
                }

                $('td:eq('+col+')', row).html(select)
                $('td:eq('+col+')', row).find('select').val(data.estado)
                if(data.estado=='contratado' || data.estado=='rechazado'){
                    $('td:eq('+col+')', row).find('select').prop('disabled',true)
                }
                $('td:eq('+col+')', row).find('select').data('id_persona',data.id_persona);
                $('td:eq('+col+')', row).find('select').on('change',cambiarEstado);

                $('td:eq('+col2+')', row).find('#docPersona_'+data.id_persona).data('run',data.run);
                $('td:eq('+col2+')', row).find('#docPersona_'+data.id_persona).data('id_persona',data.id_persona);
                $('td:eq('+col2+')', row).find('#docPersona_'+data.id_persona).on('click',verDocs);

            }

         /*   if(data.id_cargo == 1006){
                anfitrion++; 
            }else if(data.id_cargo == 8){
                examinador++;
            }else if(data.id_cargo == 1007){
                eApoyo++;
            }else if(data.id_cargo == 9){
                supervisor++;
            }*/
        },
        "initComplete": function(settings, json) {
            validarTabla++;

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
             
            var placeholder = ["","Zona","Región","Comuna","","","","","","","","","Estado"]
            this.api().columns([1,2,3,12]).every( function (index) {
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
            var placeholder = ["","Zona","Región","Comuna","","","","","","","","","Estado"]
            this.api().columns([1,2,3,12]).every( function (index) {
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
    
    $("#descargar-listado").on("click", function() {
         window.location='https://ecep2019.iie.cl/public/api/web/personal/descarga-listado';
    });
/*    $('#total_anfitrion').html(anfitrion+'/-')
    $('#total_examinador').html(examinador+'/-')
    $('#total_examinador_apoyo').html(eApoyo+'/-')
    $('#tatal_supervisor').html(supervisor+'/-')*/
            
    $('#total_personal').html(data.personal_postulacion.length)
    $("#table-postulacion").show();  

    llenarSelects(data)
    if(JSON.parse(localStorage.user).id_cargo != 1003 && JSON.parse(localStorage.user).id_cargo != 1004){
        llenarVista2(data)
    }

    $.unblockUI();
     
}

function llenarVista2(data){
     
    $('#filtros-zonal').empty();
    if($.fn.dataTable.isDataTable('#table-zonal')){
        $('#table-zonal').DataTable().destroy();
        $('#lista-zonal').empty();
    }
 
    var tablaD = $("#table-zonal").DataTable({
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
        data: data.coordinador_zonal,
        responsive: true, 
        /*columnDefs: [{
            targets: 9,
            orderable: false
        }],*/
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            /*{data: "region"},*/
            /*{data: "nombre_rol"},*/
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "nombre_zona"},
            /*{data: "email",className: "word-break"},
            {data: "telefono"},*/
            {data: "opciones",className: "text-center",
                render: function(data, type, row){
                    return '<button type="button" id="persona_'+row.id_persona+'" onclick="modificar('+row.id_persona+',false)" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'
                               
                }
            }
        ],
        "initComplete": function(settings, json) {
            var placeholder = ["","","","","","Zona"]
            this.api().columns([5]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectZ_'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-zonal'))
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
                        $('#selectZ_'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                    }
                    
                } );
                 $('#selectZ_'+index).niceSelect();        
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(){
            var placeholder = ["","","","","","Zona"]
            this.api().columns([5]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectZ_"+index)
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
 
 
    $('#limpiar-filtros-zonal').click(btnClearFilters);
    $('#total_zonal').html(data.coordinador_zonal.length+'/-');
    $("#table-zonal").show();  

    if(JSON.parse(localStorage.user).id_cargo != 1003 && JSON.parse(localStorage.user).id_cargo != 1004){
        llenarVista3(data)
    }
 
}
var idusr;
function llenarVista3(data){
     
    $('#filtros-regional').empty();
    if($.fn.dataTable.isDataTable('#table-regional')){
        $('#table-regional').DataTable().destroy();
        $('#lista-regional').empty();
    }

    var tablaD = $("#table-regional").DataTable({
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
        data: data.coordinador_regional,
        responsive: true, 
        /*columnDefs: [{
            targets: 9,
            orderable: false
        }],*/
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            /*{data: "comuna"},*/
            /*{data: "nombre_rol"},*/
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "zona_nombre"},
            {data: "region"},
            /*{data: "email",className: "word-break"},
            {data: "telefono"},*/
            {data: "opciones",className: "text-center",
                render: function(data, type, row){
                    return '<button type="button" id="persona_'+row.id_persona+'" onclick="modificar('+row.id_persona+',false)" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'
                               
                }
            }
        ],
        "initComplete": function(settings, json) {
            if(JSON.parse(localStorage.user).id_cargo == 1004){
                var api = new $.fn.dataTable.Api(settings);
                api.columns([5]).visible(false);
            }

            var placeholder = ["","","","","","Zona","Región"]
            this.api().columns([5,6]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectR_'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-regional'))
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
        "drawCallback": function(settings){
            if(JSON.parse(localStorage.user).id_cargo == 1004){
                var api = new $.fn.dataTable.Api(settings);
                api.columns([5]).visible(false);
            }

            var placeholder = ["","","","","","Zona","Región"]
            this.api().columns([5,6]).every( function (index) {
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
 
 
    $('#limpiar-filtros-regional').click(btnClearFilters);     
    $('#total_regional').html(data.coordinador_regional.length+'/-');
    $("#table-regional").show(); 

    if(JSON.parse(localStorage.user).id_cargo != 1003 && JSON.parse(localStorage.user).id_cargo != 1004){
        llenarVista4(data)
    }  
}

function llenarVista4(data){
     
    $('#filtros-centro').empty();
    if($.fn.dataTable.isDataTable('#table-centro')){
        $('#table-centro').DataTable().destroy();
        $('#lista-centro').empty();
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
        data: data.coordinador_centro,
        responsive: true, 
        /*columnDefs: [{
            targets: 9,
            orderable: false
        }],*/
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "region"},
            {data: "comuna"},
      /*      {data: "nombre_rol"},*/
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "email",className: "word-break"},
            {data: "telefono"},
            {data: "opciones",className: "text-center",
                render: function(data, type, row){
                    return '<button type="button" id="persona_'+row.id_persona+'" onclick="modificar('+row.id_persona+',false)" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'
                               
                }
            }
        ],
        "initComplete": function(settings, json) {
            var placeholder = ["","Región","Comuna","Cargo"]
            this.api().columns([1,2,3]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectC_'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-centro'))
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
                        $('#selectC_'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                    }
                    
                } );
                 $('#selectC_'+index).niceSelect();        
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(){
            var placeholder = ["","Región","Comuna","Cargo"]
            this.api().columns([1,2,3]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectC_"+index)
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
 
 
    $('#limpiar-filtros-centro').click(btnClearFilters);
    $('#total_centro').html(data.coordinador_centro.length+'/-');
    $("#table-centro").show();  
}

function cambiarEstado(){

    if($(this).val() == 'contratado'){
        Swal.fire({
          title: '¿Está seguro que desea contratar?',
          text: "Una vez seleccionado no se podra modificar.",
          type: 'warning',
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar'
        }).then((result) => {
          if (result.value) {
            cambiar($(this).data('id_persona'), $(this).val())

          }
        })
    }else if($(this).val() == 'rechazado'){
        Swal.fire({
          title: '¿Está seguro que desea rechazar?',
          text: "Una vez seleccionado no se podra modificar.",
          type: 'warning',
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar'
        }).then((result) => {
          if (result.value) {
            cambiar($(this).data('id_persona'), $(this).val())
          }
        })
    }else{
        cambiar($(this).data('id_persona'), $(this).val())
    }
    select = $(this);
    function cambiar(persona, option){
        $.ajax({
            method:'POST',
            url: webservice+'/personal/cambiarEstado',
            headers:{
               't': JSON.parse(localStorage.user).token
            },
            crossDomain: true,
            dataType:'text',
            data :{ 
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    id_cargo: JSON.parse(localStorage.user).id_cargo,
                    id_persona: persona,
                    estado: option
                },
            success: function(data, textStatus, jqXHR) {
                data = JSON.parse(data) 
                console.log(data)

                if (data.resultado != "error") {
                    showFeedback("success", data.descripcion, "Guardado");
                    if(option == 'contratado' || option == 'rechazado'){
                        select.prop('disabled',true)
                    }

                    if(JSON.parse(localStorage.user).id_cargo == 1004){
                        getPersonalCoordinador();
                    }else if(JSON.parse(localStorage.user).id_cargo == 1003){
                        getPersonalCoordinadorZonal();
                    }else{
                        getPersonal();
                    }
                } else {
                    showFeedback("error",data.descripcion,"Error");
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
var regiones = ''
function llenarSelects(data){
    
    regiones = data.regiones;
    regiones_postulante = data.regiones_postulante;
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
    for(i = 0; i < data.regiones_postulante.length; i++){
        $('#inputRegionPostulacion').append('<option value="'+data.regiones_postulante[i].id_region+'">'+data.regiones_postulante[i].nombre+'</option>') 
    }
}

function cargarComunas(input,id){
    $('#'+input).html('')
    $('#'+input).append('<option value="-1" selected="">Elegir...</option>') 
    if(input =='inputComunaPostulacion'){
        for(h = 0; h < regiones_postulante.length; h++){
            if(regiones_postulante[h].id_region == id){
                for(i = 0; i < regiones_postulante[h].comunas.length; i++){
                    $('#'+input).append('<option value="'+regiones_postulante[h].comunas[i].id_comuna+'">'+regiones_postulante[h].comunas[i].nombre+'</option>') 
                }
            }
        }
 
    }else{
        for(h = 0; h < regiones.length; h++){
            if(regiones[h].id_region == id){
                for(i = 0; i < regiones[h].comunas.length; i++){
                    $('#'+input).append('<option value="'+regiones[h].comunas[i].id_comuna+'">'+regiones[h].comunas[i].nombre+'</option>') 
                }
            }
        }

    }
}

function btnClearFilters(){
    $('#select1').val("").niceSelect('update');
    $('#select2').val("").niceSelect('update'); 
    $('#select3').val("").niceSelect('update'); 
    $('#select4').val("").niceSelect('update'); 
    $('#select12').val("").niceSelect('update'); 

    $('#selectZ_1').val("").niceSelect('update');
    $('#selectZ_2').val("").niceSelect('update'); 
    $('#selectZ_3').val("").niceSelect('update');

    $('#selectR_1').val("").niceSelect('update');
    $('#selectR_2').val("").niceSelect('update'); 
    $('#selectR_3').val("").niceSelect('update');

    $('#selectC_1').val("").niceSelect('update');
    $('#selectC_2').val("").niceSelect('update'); 
    $('#selectC_3').val("").niceSelect('update'); 
    var table = $('#table-postulacion').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

    var table = $('#table-zonal').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

    var table = $('#table-regional').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

    var table = $('#table-centro').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

}

function nuevaPersona(){

    localStorage.id_persona = -1;    
    localStorage.id_persona_cargo = -1;
    localStorage.usuario_id = -1;
    $('#divRol').css('display','')
    $('#divUsuario').css('display','')
    var checkbox = $('input:checkbox[name=inputRolAsignado]')
    for (var i = 0; i < checkbox.length; i++) {
        checkbox[i].disabled = false;
  
    }

    $('#divRolPostulante').css('display','none')
    var checkbox = $('input:checkbox[name=inputRolAsignadoPostulante]')
    for (var i = 0; i < checkbox.length; i++) {
        checkbox[i].disabled = true;
  
    }

    $('#inputUsuario').prop('disabled',false)
    $('#inputContrasena').prop('disabled',false)
 
    limpiar()
    disabledData()
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
                enabledData()
                $.unblockUI();
            }else{
                if(mensaje["resultado"] == 'existe'){
                    console.log("correcto!")
                    showFeedback("warning", mensaje["descripcion"], "");
                    disabledData()
                    $('#inputRun').prop('disabled',false)
                    $.unblockUI();

                }else{
                    showFeedback("warning", mensaje["descripcion"], "");
                    enabledData()
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

function modificar(id,postula){

    if(postula == true){
        $('#divRegionPostulacion').css('display','')
        $('#divComunaPostulacion').css('display','')
        $('#inputRegionPostulacion').prop('disabled',false)
        $('#inputComunaPostulacion').prop('disabled',false)

        $('#divRolPostulante').css('display','')
        var checkbox = $('input:checkbox[name=inputRolAsignadoPostulante]')
        for (var i = 0; i < checkbox.length; i++) {
            checkbox[i].disabled = false;
      
        }
    }else{
        $('#divRegionPostulacion').css('display','none')
        $('#divComunaPostulacion').css('display','none')
        $('#inputRegionPostulacion').prop('disabled',true)
        $('#inputComunaPostulacion').prop('disabled',true)

        $('#divRolPostulante').css('display','none')
        var checkbox = $('input:checkbox[name=inputRolAsignadoPostulante]')
        for (var i = 0; i < checkbox.length; i++) {
            checkbox[i].disabled = true;
      
        }
    }

    var checkbox = $('input:checkbox[name=inputRolAsignado]')
    for (var i = 0; i < checkbox.length; i++) {
        checkbox[i].disabled = true;
  
    }
    $('#inputUsuario').prop('disabled',true)
    $('#inputContrasena').prop('disabled',true)
    $('#divRol').css('display','none')
    $('#divUsuario').css('display','none')
    $.ajax({
        method:'POST',
        url: webservice+'/personal/modificar',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
                id_persona : id,
               // id_persona_cargo : idPersonaCargo
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

var run;

var consultadc;
function verDocs(){
    console.log( ($(this).data('run')))
    console.log( ($(this).data('id_persona')))
    
    
    console.log(strg);
    if($(this).data('id_persona')==null){
        idusr = gidUser
    }else{
        idusr= $(this).data('id_persona')
        gidUser=idusr
        console.log( gidUser)
    }
    

    found = strg.find(function(element) {
        return element.id_persona ==idusr;
        });
    run=found.run;
    console.log(found.run);
    $.ajax({
        method:'POST',
        url: webservice+'/personal/documentos',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
                id_persona : idusr,
        },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)
            

            if (data.resultado == undefined) {
                
                cargarDocs(data)
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

function cargarDocs(data){

    if($.fn.dataTable.isDataTable('#table-documentos')){
        $('#table-documentos').DataTable().destroy();
        $('#lista-documentos').empty();
    }
    console.log(data)
    var tablaD = $("#table-documentos").DataTable({
        //dom: "<'search'f>",
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslation,
        lengthChange: true,
        info: false,
        paging: false,
        displayLength: -1,
        ordering: false, 
        order: [],
        searching: false,
        data: data,
        responsive: true, 
        columns:[
            {data: "doc",
                render: function(data, type, row){ 

                    
                    
                    return  row.tipo+row.nombre_archivo;
                }
            },
            {data: "created_at",
                render: function(data, type, row){ 

                    
                    
                    return  row.created_at;
                }
            },
            {data: "descargar",
                render: function(data, type, row){ 
                    
                    
                    return '<button type="button" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'
                    
                }
            },
        ],
        "rowCallback": function( row, data ) {
            console.log($('td:eq(2)', row).find('button'))
            $('td:eq(2)', row).find('button').data('doc_nombre',data.tipo+data.nombre_archivo);
            $('td:eq(2)', row).find('button').data('t_descarga',data.token_descarga);
            $('td:eq(2)', row).find('button').data('extension',data.extension);
            $('td:eq(2)', row).find('button').on('click',verDocumento);
        },
  });
    
    var found1=''
    var found2=''
    var found3=''
    var found4=''
    for (var j = 0; j < data.length; j++){
        data[j].tipo!=null?found1 = data.find(function(element1) {

        return element1.tipo =='certificado_titulo';
        }):''
        data[j].tipo!=null?found2 = data.find(function(element2) {
        return element2.tipo =='cedula_identidad';
        }):''
        data[j].tipo!=null?found3 = data.find(function(element3) {
        return element3.tipo =='certificado_antecedentes';
        }):'-'
        data[j].tipo!=null?found4 = data.find(function(element4) {
        return element4.tipo =='curriculum';
        }):''

    }
   
    found1=found1==null?'':found1.tipo;
    found2=found2==null?'':found2.tipo;
    found3=found3==null?'':found3.tipo;
    found4=found4==null?'':found4.tipo;
    
    console.log(found1,found2,found3,found4)
    trData= ''; 
    
    trData+= (found1!='certificado_titulo') ? '<tr><td style="">Certificado titulo</td>'+`<td colspan="3"><div class="input-group"><input type="hidden" id="_token" value="{{ csrf_token() }}">
<input type="file" class="form-control documento" id="documento_4" onchange="guardarConfirm(4);" accept=".doc, .docx, .pdf, .png, .jpg"></div></td></tr>` : ''
    
    trData+= (found2!='cedula_identidad') ? '<tr><td style="">Cédula identidad</td>'+`<td colspan="3"><div class="input-group"><input type="hidden" id="_token" value="{{ csrf_token() }}">
<input type="file" class="form-control documento" id="documento_1" onchange="guardarConfirm(1);" accept=".doc, .docx, .pdf, .png, .jpg"></div></td></tr>` : ''
    
    trData+= (found3!='certificado_antecedentes') ? '<tr><td style="">Certificado antecedentes</td>'+`<td colspan="3"><div class="input-group"><input type="hidden" id="_token" value="{{ csrf_token() }}">
<input type="file" class="form-control documento" id="documento_3" onchange="guardarConfirm(3);" accept=".doc, .docx, .pdf, .png, .jpg"></div></td></tr>` : ''
    
    trData+= (found4!='curriculum') ? '<tr><td style="">Curriculum</td>'+`<td colspan="3"><div class="input-group"><input type="hidden" id="_token" value="{{ csrf_token() }}">
<input type="file" class="form-control documento" id="documento_2" onchange="guardarConfirm(2);" accept=".doc, .docx, .pdf, .png, .jpg"></div></td></tr>` :''  

    trData+= `<tr><th colspan="3">Actualizar Documento</th></tr>
            <tr><td style=""><select class="form-control custom-select tipoDocumento" onchange="cargarTipoDoc()" id="tipoDocumento" style="max-width: 233px;">
            <option value="">Seleccione Tipo de Documento</option>
            <option value="1">Cédula Identidad</option>
            <option value="2">Curriculum</option>
            <option value="3">Certificado antecedentes</option>
            <option value="4">Certificado titulo</option>
            

        </select></td>`+`<td colspan="3"><div class="input-group"><input type="hidden" id="_token" value="{{ csrf_token() }}">
<input type="file" class="form-control documento" id="documento_otro" onchange="guardarConfirmOtro();" accept=".doc, .docx, .pdf, .png, .jpg"></div></td></tr>`
        $('#lista-documentos').append(trData); 
    $('#docsModal').modal({ keyboard: false},'show') 
     
}

function verDocumento(){
    $('#titulo_modal_doc').html('Documento: ' +$(this).data('doc_nombre'))
    if($(this).data('extension') == 'png' || $(this).data('extension') == 'jpg'){
        $('#content-doc').html('<img class="ver-docs" src="'+webservice2+'personas/descarga/archivo/'+$(this).data('t_descarga')+'">')
    }else{
        $('#content-doc').html('<iframe id="iframeDoc" class="ver-docs" src="https://docs.google.com/viewer?url='+webservice2+'personas/descarga/archivo/'+$(this).data('t_descarga')+'&embedded=true"></iframe>')
         //$('#iframeDoc').attr('src','https://docs.google.com/viewer?url=https://ecep2019.iie.cl/public/api/personas/descarga/archivo/'+ $(this).data('t_descarga')+'&embedded=true')
    }
    
    //window.open('https://docs.google.com/viewer?url=https://ecep2019.iie.cl/public/api/personas/descarga/archivo/'+ $(this).data('t_descarga'), '_blank');
    $('#verDocModal').modal('show')  
}
function cerrarDoc(){
  $('#verDocModal').modal('hide')    
}
var numDoc;
function cargarTipoDoc(){
console.log($('#tipoDocumento').val())
numDoc=$('#tipoDocumento').val()
}
 
function extranjero(){
    if(this.value == 'No'){
        $('#inputExtranjero_no').prop('checked',true);
        $('#reginNacimiento').css('display','')
        $('#comunaNacimiento').css('display','')
    }else{
        $('#inputExtranjero_si').prop('checked',true);
        $('#reginNacimiento').css('display','none')
        $('#comunaNacimiento').css('display','none')
    }


}
var doc1_b64=null;
var doc2_b64=null;
var doc3_b64=null;
var doc4_b64=null;

var doc1_ext=null;
var doc2_ext=null;
var doc3_ext=null;
var doc4_ext=null;
function guardarConfirm(contador) {
       
        
        contador == null ? null : encodeDocumento(contador);
        
        let esperarSubida = new Promise((resolve, reject) => {
          $.blockUI({ message: 'Procesando archivos. Espere un momento...' });  
          setTimeout(function(){
            if(contador == 1){
                if(doc1_b64 == null){
                    reject("Archivo 1 mal subido");
                }
                if(contador == 2){
                     if(doc2_b64 == null){
                        reject("Archivo 2 mal subido");
                    }
                }
                if(contador ==3){
                    if(doc3_b64 == null){
                        reject("Archivo 3 mal subido");
                    }
                }
                if(contador == 4){
                 if(doc4_b64 == null){
                    reject("Archivo 4 mal subido");
                }
                }
            }
            resolve(true);
          }, 3000);
        });

        esperarSubida.then((successMessage) => {
            $.unblockUI();
            if(successMessage == true){
                subirDocumentox(contador)
            }
        })
        .catch(
            function(reason) {
                $.unblockUI();
                /* TODO: En caso de fallar mostrar alerta y permitir reintentar*/
                console.log('Sin éxito: ('+reason+').');
        });
}
function encodeDocumento(contador) {
    if (contador == null){
        return false;
    }
    //localStorage.removeItem($('.documento')[0].files[0].name+"_64");
    //var file = document.getElementById("documento_"+contador).files[0];
    //var file = $("#documento_" + contador)[0].files[0];
    //console.log(contador)

    var reader = new FileReader();
    
    reader.onloadend = function() {
        switch (contador) {
            case 1:
                doc1_b64 = (reader.result).split("base64,")[1]
                doc1_ext = (($("#documento_1"))[0].files[0].name + "_64").trim()
                break;
            case 2:
                doc2_b64 = (reader.result).split("base64,")[1]
                doc2_ext = (($("#documento_2"))[0].files[0].name + "_64").trim()
                break;
            case 3:
                doc3_b64 = (reader.result).split("base64,")[1]
                doc3_ext = (($("#documento_3"))[0].files[0].name + "_64").trim()
                break;
            case 4:
                doc4_b64 = (reader.result).split("base64,")[1]
                doc4_ext = (($("#documento_4"))[0].files[0].name + "_64").trim()
                break;
        }
        // console.log("ENTRO");
        // localStorage.setItem((contador +"_64").trim(), (reader.result).split("base64,")[1]);
        // subirDocumento(contador);
    };
    reader.readAsDataURL(document.getElementById("documento_" + contador).files[0]);
    return true;
}
function subirDocumentox(contador) {
    $('#docsModal').modal('hide') 
    
    
   
    var doctype= contador;
        doctype= (doctype==1) ? doctype="cedula_identidad"  : (doctype==2) ? doctype="curriculum"  : (doctype==3) ? doctype="certificado_antecedentes": doctype="certificado_titulo" ;
    var unno="";
        unno= (contador==1) ? unno=regs : (contador==2) ? unno=regs1 : (contador==3) ?  unno=regs2: unno=regs3;
    var nomdoc="";
        nomdoc= (contador==1) ? doc1_b64 : (contador==2) ?doc2_b64 : (contador==3) ?  doc3_b64: doc4_b64;
    var ext="";
        ext= (contador==1) ?  ($("#documento_1")[0].files[0].name).split(".")[1] : (contador==2) ?($("#documento_2")[0].files[0].name).split(".")[1] : (contador==3) ?  ($("#documento_3")[0].files[0].name).split(".")[1]: ($("#documento_4")[0].files[0].name).split(".")[1];
   
        console.log(ext)
        
    $.ajax({
        method: 'POST',
        
        url: webservice2+'personas/subirarchivos',
        crossDomain: true,
        headers: {
            't': JSON.parse(localStorage.user).token
        },
        data: {

            id_persona_archivo: unno,
            run: run,
            documento: nomdoc,
            nombreArchivo: "_" + run + "." + ext,
            tipo:doctype
        },
        success: function(data, textStatus, jqXHR) {
            
            showFeedback("success", data.descripcion, "Guardado");
            
            gidUser=idusr;
            
            verDocs()
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error", errorThrown, "No guardado");
            console.log(errorThrown);
        }
    });
}

var docO_b64;
var docO_ext;
function guardarConfirmOtro() {
        if (numDoc==null) {
            showFeedback("error", "Debes selecionar el tipo de documento", "No guardado");
        }else{
            numDoc == null ? null : encodeDocumentoOtro(numDoc);
            let esperarSubida = new Promise((resolve, reject) => {
              $.blockUI({ message: 'Procesando archivos. Espere un momento...' });  
              setTimeout(function(){
                if(numDoc == 1){
                    if(docO_b64 == null){
                        reject("Archivo 1 mal subido");
                    }
                    if(numDoc == 2){
                         if(docO_b64 == null){
                            reject("Archivo 2 mal subido");
                        }
                    }
                    if(numDoc ==3){
                        if(docO_b64 == null){
                            reject("Archivo 3 mal subido");
                        }
                    }
                    if(numDoc == 4){
                     if(docO_b64 == null){
                        reject("Archivo 4 mal subido");
                    }
                    }
                }
                resolve(true);
              }, 3000);
            });

            esperarSubida.then((successMessage) => {
                $.unblockUI();
                if(successMessage == true){
                    subirDocumentoOtro(numDoc)
                }
            })
            .catch(
                function(reason) {
                    $.unblockUI();
                    /* TODO: En caso de fallar mostrar alerta y permitir reintentar*/
                    console.log('Sin éxito: ('+reason+').');
            });
        }
}
function encodeDocumentoOtro() {
    //localStorage.removeItem($('.documento')[0].files[0].name+"_64");
    //var file = document.getElementById("documento_"+contador).files[0];
   var reader = new FileReader();
    
    reader.onloadend = function() {
        
                docO_b64 = (reader.result).split("base64,")[1]
                docO_ext = (($("#documento_otro"))[0].files[0].name + "_64").trim()
             
        
        // console.log("ENTRO");
        // localStorage.setItem((contador +"_64").trim(), (reader.result).split("base64,")[1]);
        // subirDocumento(contador);
    };
    reader.readAsDataURL(document.getElementById("documento_otro").files[0]);
    return true;

}


var contador = 0;
var regs=-1;
var regs1=-1;
var regs2=-1;
var regs3=-1;
var gidUser;
function subirDocumentoOtro(contador) {
    $('#docsModal').modal('hide') 
    
    var doctype= contador;
        doctype= (doctype==1) ? doctype="cedula_identidad"  : (doctype==2) ? doctype="curriculum"  : (doctype==3) ? doctype="certificado_antecedentes": doctype="certificado_titulo" ;
    var unno="";
        unno= (contador==1) ? unno=regs : (contador==2) ? unno=regs1 : (contador==3) ?  unno=regs2: unno=regs3;
    var ext=($("#documento_otro")[0].files[0].name).split(".")[1] ;
   
        console.log(ext)
        
    $.ajax({
        method: 'POST',
        
        url: webservice2+'personas/subirarchivos',
        crossDomain: true,
        headers: {
            't': JSON.parse(localStorage.user).token
        },
        data: {

            id_persona_archivo: unno,
            run: run,
            documento: docO_b64,
            nombreArchivo: "_" + run + "." + ext,
            tipo:doctype
        },
        success: function(data, textStatus, jqXHR) {
            
            showFeedback("success", data.descripcion, "Guardado");
            
            gidUser=idusr;
            
            verDocs()
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error", errorThrown, "No guardado");
            console.log(errorThrown);
        }
    });
}

function cargarDatos(data){
    $('#div-search').css('display','none')
    $('#titulo_modal').html('Modificar Persona');
    localStorage.id_persona = data.id_persona;
    localStorage.id_persona_cargo = data.id_persona_cargo == null ? -1 : data.id_persona_cargo;
    localStorage.usuario_id = data.id_usuario;
    limpiar()
    enabledData()
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
    cargarComunas('inputComunaNacimiento', data.id_region_nacimiento)
    $('#inputComunaNacimiento').val(data.id_comuna_nacimiento == null ? -1 : data.id_comuna_nacimiento)

    $('#inputRegionResidencia').val(data.id_region_residencia == null ? -1 : data.id_region_residencia)
    cargarComunas('inputComunaResidencia', data.id_region_residencia)
    $('#inputComunaResidencia').val(data.id_comuna_residencia == null ? -1 : data.id_comuna_residencia)

    $('#inputRegionPostulacion').val(data.id_region_postulacion == null ? -1 : data.id_region_postulacion)
    cargarComunas('inputComunaPostulacion', data.id_region_postulacion)
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

    var checkbox = $('input:checkbox[name=inputRolAsignadoPostulante]') 
    for (var j = 0; j < checkbox.length; j++) {               
        checkbox[j].checked = false;                
    }             

    if(data.cargos != undefined){
        var checkbox = $('input:checkbox[name=inputRolAsignadoPostulante]') 
        for (var i = 0; i < data.cargos.length; i++) {
            for (var j = 0; j < checkbox.length; j++) {                 
                if(checkbox[j].value == data.cargos[i].id_cargo){
                    checkbox[j].checked = true;
                    if(data.cargos[i].estado == 'contratado'){
                        checkbox[j].disabled = true;
                    }
                }                 
            }             
        }
    }
 

   /* if(JSON.parse(localStorage.user).id_cargo == 1003){
        var checkbox = $('input:checkbox[name=inputRolAsignado]')
        for (var i = 0; i < checkbox.length; i++) {
            checkbox[i].disabled = true
            console.log(checkbox[i])
             
        }
        $('#encargadoRegional').checked = true;


    }*/
    $('#inputUsuario').val(data.usuario)
 
    $('#personalModal').modal({backdrop: 'static', keyboard: false},'show')
}

function guardarPersonal(){
    var checkbox = $('input:checkbox[name=inputRolAsignado]')
    cargos = [];
    if($('#divRol').is(":visible")){
        for (var i = 0; i < checkbox.length; i++) {
            if(checkbox[i].checked == true){
                cargos.push(checkbox[i].value)
            }
             
        }
    }

    cargosPostulante = [];
    if($('#divRolPostulante').is(":visible")){
        var checkbox = $('input:checkbox[name=inputRolAsignadoPostulante]')
        for (var i = 0; i < checkbox.length; i++) {
            check = checkbox[i].checked == true ? 1 : 0
            cargosPostulante.push({id_cargo: checkbox[i].value, cargo: check})  
        }
    }

    if(validar() == true){
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
                    //id_cargo: $('#inputRolAsignado').attr('disabled') == true ? null : $('#inputRolAsignado').val(),
                    //estado:   $('#inputEstado').val(),
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

                    cargos_postulante: cargosPostulante


                },
            success: function(data, textStatus, jqXHR) {
                data = JSON.parse(data) 
                console.log(data)

                if (data.resultado != "error") {
                    showFeedback("success", data.descripcion, "Guardado");
                    $('#personalModal').modal('hide');
                        if(JSON.parse(localStorage.user).id_cargo == 1004){
                            getPersonalCoordinador();
                        }else if(JSON.parse(localStorage.user).id_cargo == 1003){
                            getPersonalCoordinadorZonal();
                        }else{
                            getPersonal();
                        }

                }else {
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

    if($('#divRol').is(":visible")){

        if($('input:checkbox[name=inputRolAsignado]').is(':checked') == false){
            $("#rol-no-select").show()
            valida = false
        }else{
            $("#rol-no-select").hide()

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
    }
    
    return valida;
}

function limpiar(){
    var input = document.getElementsByTagName("input");
    
    for (var i = 0; i < input.length; i++) {
        if(input[i].type != 'checkbox' && input[i].type != 'radio'){
            input[i].value = '';
            input[i].disabled = false;
            $(input[i]).removeClass('is-invalid')
        }
    }
    $("#rol-no-select").hide()
    $('#inputSexo').val('-1') 
    $('#inputNivelEstudios').val('-1') 
    $('#inputEstadoCivil').val('-1') 
    $('#inputRegionNacimiento').val('-1') 
    $('#inputRegionResidencia').val('-1') 
    $('#inputRegionPostulacion').val('-1') 
    $('#inputUniversidad').val('-1') 
    //$('#inputRolAsignado').val('-1') 
    var checkbox = $('input:checkbox[name=inputRolAsignado]')
    for (var i = 0; i < checkbox.length; i++) {
        checkbox[i].checked = false;
  
    }
    $('#inputRegionAsignada').val('-1') 
}

function disabledData(){
    var input = document.getElementsByTagName("input");
    
    for (var i = 0; i < input.length; i++) {
        input[i].disabled = true
  
    }
    $('#inputExtranjero_no').prop('checked',true);
    
    $('#personalModal').find('select').each(function(){
        this.disabled = true
    });

 
}

function enabledData(){
    var input = document.getElementsByTagName("input");
    
    for (var i = 0; i < input.length; i++) {
        input[i].disabled = false
  
    }
    $('#inputExtranjero_no').prop('checked',true);
    var select = document.getElementsByTagName("select");

    $('#personalModal').find('select').each(function(){
        this.disabled = false
    });

    if(JSON.parse(localStorage.user).id_cargo == 1003){
        var checkbox = $('input:checkbox[name=inputRolAsignado]')
        for (var i = 0; i < checkbox.length; i++) {
            checkbox[i].disabled = true             
        }
        $('#encargadoRegional').prop('checked',true)
    }
 
}


function verZonas(){
    $.ajax({
        method:'POST',
        url: webservice+'/centro/zonas',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
        },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)

            if (data.resultado == undefined) {
                mostrarZonas(data)
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

function mostrarZonas(data){

    if($.fn.dataTable.isDataTable('#table-zonas')){
        $('#table-zonas').DataTable().destroy();
        $('#lista-zonas').empty();
    }
    encargado_zonal = data.encargado_zonal
    var tablaD = $("#table-zonas").DataTable({
        //dom: "<'search'f>",
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslation,
        lengthChange: true,
        info: false,
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
        searching: false,
        data: data.zona,
        responsive: true, 
        columns:[
            {data: "nombre"},
            {data: "id_coordinador"},
        ],
        "rowCallback": function( row, data ) {
 
            select = '<select class="form-control" name="selectEncargado"><option value="-1">Elegir...</option>'
            for(i=0;i<encargado_zonal.length;i++){
                //select+= '<option value="reclutado">Reclutado</option>'
                select+= '<option value="'+encargado_zonal[i].id_persona_cargo+'">'+encargado_zonal[i].nombres+' '+encargado_zonal[i].apellido_paterno+'</option>'
            }
            select+='</select>';
            $('td:eq(1)', row).html(select)
            $('td:eq(1)', row).find('select').val(data.id_coordinador == null ? -1 : data.id_coordinador)
            $('td:eq(1)', row).find('select').data('id_zona',data.id_zona);
            $('td:eq(1)', row).find('select').on('change',cambiarCoordinador);
        },
    });
 
    $('#zonaModal').modal({backdrop: 'static', keyboard: false},'show') 
}

function cambiarCoordinador(){


    $.ajax({
        method:'POST',
        url: webservice+'/centro/modificarZona',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
                id_zona: $(this).data('id_zona'),
                id_coordinador: $(this).val() == -1 ? null : $(this).val()
            },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)

            if (data.resultado != "error") {
                showFeedback("success", data.descripcion, "Guardado");
                getPersonal();
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

function verZonasRegion(){
    $.ajax({
        method:'POST',
        url: webservice+'/centro/zonasRegion',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
                id_cargo: JSON.parse(localStorage.user).id_cargo,
                id_persona: JSON.parse(localStorage.user).id_persona
        },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)

            if (data.resultado == undefined) {
                mostrarZonasRegion(data)
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

function mostrarZonasRegion(data){

    $('#filtros-modalRegion').empty();
    if($.fn.dataTable.isDataTable('#table-zonasRegion')){
        $('#table-zonasRegion').DataTable().destroy();
        $('#lista-zonasRegion').empty();
    }
    encargadoRegional = data.encargado_regional
    var tablaD = $("#table-zonasRegion").DataTable({
        dom: "<'search'f>",
             /*lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],*/
        language:spanishTranslation,
        lengthChange: true,
        info: false,
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
        search: true,
        /*filter:false,*/
        data: data.zona,
        responsive: true,
        columns:[
            {data: "nombre"},
            {data: "region"},
            {data: "id_coordinador"},
        ],
        "rowCallback": function( row, data ) {

            select = '<select class="form-control"><option value="-1">Elegir...</option>'
            for(i=0;i<encargadoRegional.length;i++){
                //select+= '<option value="reclutado">Reclutado</option>'
                select+= '<option value="'+encargadoRegional[i].id_persona_cargo+'">'+encargadoRegional[i].nombres+' '+encargadoRegional[i].apellido_paterno+'</option>'
            }
            select+='</select>';
            $('td:eq(2)', row).html(select)
            $('td:eq(2)', row).find('select').val(data.id_coordinador == null ? -1 : data.id_coordinador)
            $('td:eq(2)', row).find('select').data('id_zona_region',data.id_zona_region);
            $('td:eq(2)', row).find('select').on('change',cambiarCoordinadorRegional);
        },
        "initComplete": function(settings, json) {
            var placeholder = ["Zona","Región"]
            this.api().columns([0,1]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectModalR'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-modalRegion'))
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
                        $('#selectModalR'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                    }
                    
                } );
                $('#selectModalR'+index).niceSelect();    
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(){
            var placeholder = ["Zona","Región"]
            this.api().columns([0,1]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectModalR"+index)
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
    $('#limpiar-filtros-modalRegion').click(btnClearFiltersModal);
 
    $('#zonaRegionModal').modal({backdrop: 'static', keyboard: false},'show') 
}

function cambiarCoordinadorRegional(){


    $.ajax({
        method:'POST',
        url: webservice+'/centro/modificarZonaRegion',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
                id_zona_region: $(this).data('id_zona_region'),
                id_coordinador: $(this).val() == -1 ? null : $(this).val()
            },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            if (data.resultado != "error") {
                showFeedback("success", data.descripcion, "Guardado");
                if(JSON.parse(localStorage.user).id_cargo == 1003){
                    getPersonalCoordinadorZonal();
                }else{
                    getPersonal();
                }
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

function verCentros(){
    $.ajax({
        method:'POST',
        url: webservice+'/centro/centros',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
        },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)

            if (data.resultado == undefined) {
                mostrarCentros(data)
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

function mostrarCentros(data){
    $('#filtros-modalCentro').empty();
    if($.fn.dataTable.isDataTable('#table-centros')){
        $('#table-centros').DataTable().destroy();
        $('#lista-centros').empty();
    }
    encargado_centro = data.encargado_centro;
    var tablaD = $("#table-centros").DataTable({
        dom: "<'search'f>",
             /*lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],*/
        language:spanishTranslation,
        lengthChange: true,
        info: false,
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
        search: true,
        /*filter:false,*/
        data: data.centros,
        responsive: true,
        columns:[
            {data: "nombre"},
            {data: "region"},
            {data: "comuna"},
            {data: "id_encargado"},
        ],
        "rowCallback": function( row, data ) {

            select = '<select class="form-control"><option value="-1">Elegir...</option>'
            for(i=0;i<encargado_centro.length;i++){
                //select+= '<option value="reclutado">Reclutado</option>'
                select+= '<option value="'+encargado_centro[i].id_persona_cargo+'">'+encargado_centro[i].nombres+' '+encargado_centro[i].apellido_paterno+'</option>'
            }
            select+='</select>';
            $('td:eq(3)', row).html(select)
            $('td:eq(3)', row).find('select').val(data.id_encargado == null ? -1 : data.id_encargado)
            $('td:eq(3)', row).find('select').data('id_centro_operaciones',data.id_centro_operaciones);
            $('td:eq(3)', row).find('select').data('id_zona_region',data.id_zona_region);
            $('td:eq(3)', row).find('select').on('change',cambiarEncargadoCentro);
        },
        "initComplete": function(settings, json) {
            var placeholder = ["Zona","Región","Comuna"]
            this.api().columns([0,1,2]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectModalC'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-modalCentro'))
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
                        $('#selectModalC'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                    }
                    
                } );
                $('#selectModalC'+index).niceSelect();    
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(){
            var placeholder = ["Zona","Región","Comuna"]
            this.api().columns([0,1,2]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectModalC"+index)
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
    $('#limpiar-filtros-modalCentro').click(btnClearFiltersModal);
    $('#centrosModal').modal({backdrop: 'static', keyboard: false},'show') 
}

function cambiarEncargadoCentro(){


    $.ajax({
        method:'POST',
        url: webservice+'/centro/modificarEncargadoCentro',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
                id_centro_operaciones: $(this).data('id_centro_operaciones'),
                id_zona_region: $(this).data('id_zona_region'),
                id_encargado: $(this).val() == -1 ? null : $(this).val()
            },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)

            if (data.resultado != "error") {
                showFeedback("success", data.descripcion, "Guardado");
                getPersonal();
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