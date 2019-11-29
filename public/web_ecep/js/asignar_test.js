$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    if(JSON.parse(localStorage.user).id_tipo_usuario != 1042){
        $('#redirect').css('display','');
        $('#redirect').on('click',redirectModulo);
    }
    
    getDatosSede()
    $('#guardar_sede').click(validarCantidad); 
    //$('#guardar_asignacion').click(guardarAsignacion);

   /* $('#tab-supervisor').click(loadPostulantes); 
    $('#tab-examinador').click(loadPostulantes);
    $('#tab-ExaminadorAP').click(loadPostulantes);
    $('#tab-anfitrion').click(loadPostulantes);*/
     
    
    
});

var region = '';
function getDatosSede(){

    $.ajax({
        method:'POST',
        url: webservice+'/sede/obtenerDatosSede',
        headers: {
                't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data: {
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            id_sede: localStorage.getItem("id_sede")

        },
        success: function(data, textStatus, jqXHR) {
        data = JSON.parse(data)
        localStorage.setItem("id_comuna", data.id_comuna);
        console.log(data)
        $('#nombre_lab').html(data.nombre)
        sup_req=data.supervisores_requeridos==null?0:data.supervisores_requeridos
        exa_req=data.examinadores_requeridos==null?0:data.examinadores_requeridos
        exap_req=data.examinadores_apoyo_requeridos==null?0:data.examinadores_apoyo_requeridos
        anf_req=data.anfitriones_requeridos==null?0:data.anfitriones_requeridos
        $('#total_reqSupervisor').html(sup_req)
        $('#total_reqExaminador').html(exa_req)
        $('#total_reqExaAP').html(exap_req)
        $('#total_reqAnfitrion').html(anf_req)
        $('#total_cantSupervisor').html(data.supervisores_asignados)
        $('#total_cantExaminador').html(data.examinadores_asignados)
        $('#total_cantExaAP').html(data.examinadores_apoyo_asignados)
        $('#total_cantAnfitrion').html(data.anfitriones_asignados)
        reloadPostulantes()

           // llenarVista(data)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
 
        }
    })

}







function llenarVista(data){

    data = JSON.parse(data)
    
    array1=[]
    for(h = 0; h < data.length; h++){
    	
		if(data[h].nombre_rol == localStorage.getItem("nom_cargo")){
			
        	if (data[h].id_estimacion == localStorage.getItem("id_estimacion")) {
        		array1.push(data[h])	
        	}
        }
    }
   
    $('#filtros-dia1').empty();
    //if(array1.length != 0){
        if($.fn.dataTable.isDataTable('#table-supervisor')){
            $('#table-supervisor').DataTable().destroy();
            $('#lista_supervisor').empty();
        }
    //}

    var tablaD = $("#table-supervisor").DataTable({
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
        data: array1,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "region"},
            {data: "comuna"},
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "puntaje", className: "text-center",
                render: function(data, type, row){
                    if (data==null) {
                        return  '-' 
                    }else{
                       return  data  
                    }
                   
                }
            },
            {data: "asignar",
                render: function(data, type, row){
                    //console.log(row.id_persona_asignacion);
                    return  '<button type="button" id="quitar_'+row.id_persona+'" onclick="quitarAsignacion('+row.id_persona_asignacion+')" class="btn btn-primary btn-sm _btn-item"><i class="fas fa-minus"></i></button>'
                            //'<button type="button" id="ver_'+row.id_sede+'" onclick="redireccionarSede('+row.id_sede+')" class="btn btn-primary btn-sm _btn-item"><i class="fas fa-search"></i></button>'        
                },
                className: "text-center"
            } 
        ],
        "rowCallback": function( row, data ) {

        
        },
        "initComplete": function(settings, json) {
           /* var placeholder = ["","","Región","Comuna"]
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

            $('.dataTables_length select').addClass('nice-select small'); */        
        },
        "drawCallback": function(){
            /*var placeholder = ["","","Región","Comuna"]
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
            })*/
        }
    });

    
    $("#table-supervisor").show(); 

}
function llenarVista2(data){

    data = JSON.parse(data)
    
    
    array1=[]
    for(h = 0; h < data.length; h++){
		if(data[h].nombre_rol == localStorage.getItem("nom_cargo")){
        	if (data[h].id_estimacion == localStorage.getItem("id_estimacion")) {
        		array1.push(data[h])	
        	}
        }
    }
    console.log(data)
    $('#filtros-dia1').empty();
    //if(array1.length != 0){
        if($.fn.dataTable.isDataTable('#table-examinador')){
            $('#table-examinador').DataTable().destroy();
            $('#lista_examinador').empty();
        }
    //}

    var tablaD = $("#table-examinador").DataTable({
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
        data: array1,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "region"},
            {data: "comuna"},
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "puntaje", className: "text-center",
                render: function(data, type, row){
                    if (data==null) {
                        return  '-' 
                    }else{
                       return  data  
                    }
                   
                }
            },
            {data: "asignar",
                render: function(data, type, row){
                    
                    return  '<button type="button" id="quitar_'+row.id_persona+'" onclick="quitarAsignacion('+row.id_persona_asignacion+')" class="btn btn-primary btn-sm _btn-item"><i class="fas fa-minus"></i></button>'
                            //'        
                },
                className: "text-center"
            } 
        ],
        "rowCallback": function( row, data ) {

        
        },
        "initComplete": function(settings, json) {
           /* var placeholder = ["","","Región","Comuna"]
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

            $('.dataTables_length select').addClass('nice-select small'); */        
        },
        "drawCallback": function(){
            /*var placeholder = ["","","Región","Comuna"]
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
            })*/
        }
    });

    
    $("#table-examinador").show(); 

}
function llenarVista3(data){

    data = JSON.parse(data)
    
   array1=[]
    for(h = 0; h < data.length; h++){
		if(data[h].nombre_rol == localStorage.getItem("nom_cargo")){
        	if (data[h].id_estimacion == localStorage.getItem("id_estimacion")) {
        		array1.push(data[h])	
        	}
        }
    }
    
    $('#filtros-dia1').empty();
    //if(array1.length != 0){
        if($.fn.dataTable.isDataTable('#table-examap')){
            $('#table-examap').DataTable().destroy();
            $('#lista_examap').empty();
        }
    //}

    var tablaD = $("#table-examap").DataTable({
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
        data: array1,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "region"},
            {data: "comuna"},
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "puntaje", className: "text-center",
                render: function(data, type, row){
                    if (data==null) {
                        return  '-' 
                    }else{
                       return  data  
                    }
                   
                }
            },
            {data: "asignar",
                render: function(data, type, row){
                    
                    return  '<button type="button" id="quitar_'+row.id_persona+'" onclick="quitarAsignacion('+row.id_persona_asignacion+')" class="btn btn-primary btn-sm _btn-item"><i class="fas fa-minus"></i></button>'
                            //'<button type="button" id="ver_'+row.id_sede+'" onclick="redireccionarSede('+row.id_sede+')" class="btn btn-primary btn-sm _btn-item"><i class="fas fa-search"></i></button>'        
                },
                className: "text-center"
            } 
        ],
        "rowCallback": function( row, data ) {

        
        },
        "initComplete": function(settings, json) {
           /* var placeholder = ["","","Región","Comuna"]
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

            $('.dataTables_length select').addClass('nice-select small'); */        
        },
        "drawCallback": function(){
            /*var placeholder = ["","","Región","Comuna"]
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
            })*/
        }
    });

    
    $("#table-examap").show(); 

}
function llenarVista4(data){

    data = JSON.parse(data)
    
   	array1=[]
    for(h = 0; h < data.length; h++){
		if(data[h].nombre_rol == localStorage.getItem("nom_cargo")){
        	if (data[h].id_estimacion == localStorage.getItem("id_estimacion")) {
        		array1.push(data[h])	
        	}
        }
    }
    
    $('#filtros-dia1').empty();
    //if(array1.length != 0){
        if($.fn.dataTable.isDataTable('#table-anfitrion')){
            $('#table-anfitrion').DataTable().destroy();
            $('#lista_anfitrion').empty();
        }
    //}

    var tablaD = $("#table-anfitrion").DataTable({
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
        data: array1,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "region"},
            {data: "comuna"},
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "puntaje", className: "text-center",
                render: function(data, type, row){
                    if (data==null) {
                        return  '-' 
                    }else{
                       return  data  
                    }
                   
                }
            },
            {data: "asignar",
                render: function(data, type, row){
                    
                    return  '<button type="button" id="quitar_'+row.id_persona+'" onclick="quitarAsignacion('+row.id_persona_asignacion+')" class="btn btn-primary btn-sm _btn-item"><i class="fas fa-minus"></i></button>'
                            //'<button type="button" id="ver_'+row.id_sede+'" onclick="redireccionarSede('+row.id_sede+')" class="btn btn-primary btn-sm _btn-item"><i class="fas fa-search"></i></button>'        
                },
                className: "text-center"
            } 
        ],
        "rowCallback": function( row, data ) {

        
        },
        "initComplete": function(settings, json) {
           /* var placeholder = ["","","Región","Comuna"]
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

            $('.dataTables_length select').addClass('nice-select small'); */        
        },
        "drawCallback": function(){
            /*var placeholder = ["","","Región","Comuna"]
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
            })*/
        }
    });

    
    $("#table-anfitrion").show(); 

}
function llenarVistaPostulantes(data){
    data = JSON.parse(data)

    $('#filtros-dia1').empty();
    //if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-dia1')){
            $('#table-dia1').DataTable().destroy();
            $('#lista_dia1').empty();
        }
    //}

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
            {data: "rbd"},
            {data: "salas", className: "text-center"},
            {data: "opciones",
                render: function(data, type, row){
                    return  '<button type="button" id="modificar_'+row.id_sede+'" class="btn btn-primary btn-sm _btn-item mr-1"><i class="fa fa-pencil-alt"></i></button>'
                            //'<button type="button" id="ver_'+row.id_sede+'" onclick="redireccionarSede('+row.id_sede+')" class="btn btn-primary btn-sm _btn-item"><i class="fas fa-search"></i></button>'        
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
function asignarDesplegar(){
    
    limpiarNueva()
   
    loadPostulantes()
    //$('#divInputCupo').css('display','none')
    $('#nuevaSedeModal').modal({backdrop: 'static', keyboard: false},'show')
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

function reloadPostulantes() {
    
    $.ajax({
        method:'POST',
        url: webservice+'/asignacion/obtenerCapacitados',
        headers: {
                't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data: {
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            id_comuna: localStorage.getItem("id_comuna")
        },
        success: function(data, textStatus, jqXHR) {
           // $('#guardar_sede').prop('disabled',false)
            
            
            
            
            if ($(".active").attr('id')=='tab-supervisor') {
                $('#titulo_modal').html('Asignar Supervisor');
                localStorage.setItem("nom_cargo", "Supervisor");
                localStorage.setItem("id_cargo", "9");
                llenarVista(data)
                
            }else if ($(".active").attr('id')=='tab-examinador') {
                $('#titulo_modal').html('Asignar Examinador');
                localStorage.setItem("nom_cargo", "Examinador");
                localStorage.setItem("id_cargo", "8");
                llenarVista2(data)
            }else if ($(".active").attr('id')=='tab-ExaminadorAP') {
                $('#titulo_modal').html('Asignar Examinador Apoyo');
               localStorage.setItem("nom_cargo", "Examinador de Apoyo");
               localStorage.setItem("id_cargo", "1007");
               llenarVista3(data)
            }else if ($(".active").attr('id')=='tab-anfitrion') {
                $('#titulo_modal').html('Asignar Anfitrión');
                localStorage.setItem("nom_cargo", "Anfitrión");
                localStorage.setItem("id_cargo", "1006");
                llenarVista4(data)
            }else {
                
            }
            
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
 
        }
    })
}

function loadPostulantes() {
    
    $.ajax({
        method:'POST',
        url: webservice+'/asignacion/obtenerCapacitados',
        headers: {
                't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data: {
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            id_comuna: localStorage.getItem("id_comuna")
        },
        success: function(data, textStatus, jqXHR) {
           // $('#guardar_sede').prop('disabled',false)

            if ($(".active").attr('id')=='tab-supervisor') {
            	$('#titulo_modal').html('Asignar Supervisor');
                localStorage.setItem("nom_cargo", "Supervisor");
                localStorage.setItem("id_cargo", "9");
                llenarVista(data)
                
            }else if ($(".active").attr('id')=='tab-examinador') {
            	$('#titulo_modal').html('Asignar Examinador');
                localStorage.setItem("nom_cargo", "Examinador");
                localStorage.setItem("id_cargo", "8");
                llenarVista2(data)
            }else if ($(".active").attr('id')=='tab-ExaminadorAP') {
            	$('#titulo_modal').html('Asignar Examinador Apoyo');
               localStorage.setItem("nom_cargo", "Examinador de Apoyo");
               localStorage.setItem("id_cargo", "1007");
               llenarVista3(data)
            }else if ($(".active").attr('id')=='tab-anfitrion') {
            	$('#titulo_modal').html('Asignar Anfitrión');
                localStorage.setItem("nom_cargo", "Anfitrión");
                localStorage.setItem("id_cargo", "1006");
                llenarVista4(data)
            }else {
                
            }
            
            llenarTablaAsignacion(data)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
 
        }
    })
}

function llenarTablaAsignacion(data){
        
    
    data = JSON.parse(data)
    array1=[]
    for(h = 0; h < data.length; h++){

        if(data[h].id_persona_asignacion == null){
            array1.push(data[h])
           
        }
    }
    console.log(array1)
    $('#filtros-dia1').empty();
    //if(array1.length != 0){
        if($.fn.dataTable.isDataTable('#table-postulados')){
            $('#table-postulados').DataTable().destroy();
            $('#lista_postulados').empty();
        }
    //}

    var tablaD = $("#table-postulados").DataTable({
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
        data: array1,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "region"},
            {data: "comuna"},
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "puntaje", className: "text-center",
                render: function(data, type, row){
                    if (data==null) {
                        return  '-' 
                    }else{
                       return  data  
                    }
                   
                }
            },
            {data: "asignar",
                render: function(data, type, row){
                    
                    return  '<input id="modificar_'+row.id_persona+'" name="'+row.nombres+'" value="'+row.id_persona+'"  type="checkbox">'
                            //'<button type="button" id="ver_'+row.id_sede+'" onclick="redireccionarSede('+row.id_sede+')" class="btn btn-primary btn-sm _btn-item"><i class="fas fa-search"></i></button>'        
                },
                className: "text-center"
            } 
        ],
        "rowCallback": function( row, data ) {

        
        },
        "initComplete": function(settings, json) {
           /* var placeholder = ["","","Región","Comuna"]
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

            $('.dataTables_length select').addClass('nice-select small'); */        
        },
        "drawCallback": function(){
            /*var placeholder = ["","","Región","Comuna"]
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
            })*/
        }
    });

    
    $("#table-postulados").show(); 
 
}

function llenarTablaAsignacion1(data){

 
}
function quitarAsignacion(data){
	$.ajax({
            method:'POST',
            url: webservice+'/asignacion/desasignar',
            headers:{
               't': JSON.parse(localStorage.user).token
            },
            crossDomain: true,
            dataType:'text',
            data :{ 

                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    
                    id_persona_asignacion: data,
                    
                },
            success: function(data, textStatus, jqXHR) {
                console.log(data)
                data = JSON.parse(data)
                if (data.resultado == "ok") {
                    showFeedback("success", data.descripcion, "OK");
                    
                    getDatosSede()
                } else {
                    showFeedback("error","Error al eliminar","Error");
                    console.log("invalidos");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showFeedback("error","Error en el servidor","Datos incorrectos");
                console.log("error del servidor, datos incorrectos");
     
            }
        })
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
   
    
    //$('#guardar_sede').prop('disabled',false)
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
function validarCantidad(){
       array =[]
      $("input[type=checkbox]:checked").each(function(){
        //cada elemento seleccionado
        
        array.push({id_persona:$(this).val()})
        });
        var cantidad_requeridos=parseInt($('#total_reqSupervisor').text());
        var cantidad_asignados=parseInt($('#total_cantSupervisor').text());
        
        var cupo=cantidad_requeridos-cantidad_asignados
        console.log(cupo)
        /*$('#total_reqExaminador').html(data.examinadores_requeridos)
        $('#total_reqExaAP').html(data.examinadores_apoyo_requeridos)
        $('#total_reqAnfitrion').html(data.anfitriones_requeridos)*/
    if (localStorage.nom_cargo=="Supervisor") {
        if (cantidad_asignados<=cantidad_requeridos) {

            if (array.length<=cantidad_requeridos) {
            	if (array.length<=cupo) {
            		guardarSede(array)
            	}else{
            		showFeedback("error","la cantidad selecionada exede a los necesitados", "No es posible asignar")
            	}
            	
            } else {
            	showFeedback("error","la cantidad selecionada exede a los necesitados", "No es posible asignar")	
            }
                //console.log($('#total_reqSupervisor').text())
                
            

        } else {
            showFeedback("error","la cantidad de supervisores actuales ya se encuentra con todas las asignaciones necesarias", "No es posible asignar")
        }
    }
}

function guardarSede(data){
    
  array =data
     
  
    
        $.ajax({
            method:'POST',
            url: webservice+'/asignacion/asignarCargoSede',
            headers:{
               't': JSON.parse(localStorage.user).token
            },
            crossDomain: true,
            dataType:'text',
            data :{ 

                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    
                    id_estimacion: localStorage.id_estimacion,
                    id_cargo:localStorage.id_cargo,
                    personal: array,
                    
                },
            success: function(data, textStatus, jqXHR) {
                console.log(data)
                data = JSON.parse(data)
                if (data.resultado == "ok") {
                    showFeedback("success", data.descripcion, "OK");
                    $('#nuevaSedeModal').modal('hide');
                    getDatosSede()
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
    //$('#guardar_sede').prop('disabled',false)
}

function cargarCentros(data){
    $('#inputCentro').html('')
    $('#inputCentro').append('<option value="-1" selected="">Elegir...</option>') 

    for(i = 0; i < data.length; i++){
        $('#inputCentro').append('<option value="'+data[i].id_centro_operaciones+'">Centro '+data[i].nombre+'</option>') 
    }
     
}

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

   // $('#guardar_sede').prop('disabled',true)
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
    //$('#guardar_sede').prop('disabled',true)
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

