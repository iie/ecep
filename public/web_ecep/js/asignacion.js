$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectModulo); 
    $('#guardar_asignacion').on('click',guardar)
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
        url: webservice+'/asignacion/lista',
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

/*
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

*/
function getPersonalCoordinador(){
     $.ajax({
        method:'POST',
        url: webservice+'/asignacion/listaCoordinador',
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
sedes = '';
salas = '';
 
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
                title: 'Personal',
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
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "nombre_rol"},
            {data: "comuna"},
            {data: "opciones",className: "text-center",
                render: function(data, type, row){                
                    return ''
                }
            },
            {data: "opciones",className: "text-center",
                render: function(data, type, row){                
                     return ''
                 }
            },
            {data: "opciones",className: "text-center",
                render: function(data, type, row){                
                    return '<button type="button" id="persona_'+row.id_persona+'" onclick="asignar('+row.id_persona_cargo+','+row.id_comuna_postulacion+')" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'
                   
                }
            },
        ],
        "rowCallback": function( row, data ) {
/*            select = '<select class="form-control selectEstado" name="selectEstado">'+
                                '<option value="reclutado">Reclutado</option>'+
                                '<option value="preseleccionado">Preseleccionado</option>'+
                                '<option value="capacitado">Capacitado</option>'+
                                '<option value="seleccionado">Seleccionado</option>'
                                if(JSON.parse(localStorage.user).id_cargo != 1003 && JSON.parse(localStorage.user).id_cargo != 1004){
                                   select += '<option value="contratado">Contratado</option>'
                                }else{
                                    select += '<option value="contratado" disabled>Contratado</option>'
                                }
                    select += '<option value="rechazado">Rechazado</option>'

            select += '</select>'
            $('td:eq(10)', row).html(select)
            $('td:eq(10)', row).find('select').val(data.estado)
            if(data.estado=='contratado' || data.estado=='rechazado'){
                $('td:eq(10)', row).find('select').prop('disabled',true)
            }
            $('td:eq(10)', row).find('select').data('id_persona_cargo',data.id_persona_cargo);
            $('td:eq(10)', row).find('select').on('change',cambiarEstado);
 */
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
        /*"initComplete": function(settings, json) {
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
             
            var placeholder = ["","Zona","Región","Comuna","Cargo","","","","","","","","Estado"]
            this.api().columns([1,2,3,4,12]).every( function (index) {
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
            var placeholder = ["","Zona","Región","Comuna","Cargo","","","","","","","","Estado"]
            this.api().columns([1,2,3,4,12]).every( function (index) {
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
        }*/
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

    sedes = data.sedes;
    salas = data.salas;
}
/*
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
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
        search: true,
        data: data.coordinador_zonal,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "nombre_zona"},
            {data: "opciones",className: "text-center",
                render: function(data, type, row){
                    return '<button type="button" id="persona_'+row.id_persona+'" onclick="modificar('+row.id_persona+','+row.id_persona_cargo+',false)" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'
                               
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
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
        search: true,
        data: data.coordinador_regional,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "zona_nombre"},
            {data: "region"},
            {data: "opciones",className: "text-center",
                render: function(data, type, row){
                    return '<button type="button" id="persona_'+row.id_persona+'" onclick="modificar('+row.id_persona+','+row.id_persona_cargo+',false)" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'
                               
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
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
        search: true,
        data: data.coordinador_centro,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "region"},
            {data: "comuna"},
            {data: "nombre_rol"},
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "email",className: "word-break"},
            {data: "telefono"},
            {data: "opciones",className: "text-center",
                render: function(data, type, row){
                    return '<button type="button" id="persona_'+row.id_persona+'" onclick="modificar('+row.id_persona+','+row.id_persona_cargo+',false)" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'
                               
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
}*/


function asignar(persona, comuna){
    localStorage.id_persona_cargo = persona;
    $('#inputSede').html('').append('<option value="-1" selected="">Elegir...</option>') 
    if(sedes[comuna] != undefined){
        for(i = 0; i < sedes[comuna].sedes.length; i++){
            $('#inputSede').append('<option value="'+sedes[comuna].sedes[i].id_sede+'">'+sedes[comuna].sedes[i].nombre_sede+'</option>')   
        }
    }
    //$('#inputSala').val()
    $('#asignacionModal').modal({backdrop: 'static', keyboard: false},'show')
}

function cargarSalas(val){
    console.log(val)
    $('#inputSala').html('').append('<option value="-1" selected="">Elegir...</option>') 
    if(salas[val] != undefined){
        for(i = 0; i < salas[val].length; i++){
            $('#inputSala').append('<option value="'+salas[val][i].id_sala+'">'+salas[val][i].nro_sala+'</option>')   
        }
        $('#inputSala').prop('disabled',false)
    }
 
}

function guardar(){

    $.ajax({
        method:'POST',
        url: webservice+'/asignacion/guardar',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
                id_sede: $('#inputSede').val(),
                id_sala: $('#inputSala').val(),
                id_persona_cargo: localStorage.id_persona_cargo,
                id_aplicacion: -1,
                fecha:-1,
            },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)

            if (data.resultado != "error") {
                showFeedback("success", data.descripcion, "Guardado");
                $('#asignacionModal').modal('hide');
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
