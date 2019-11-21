$(document).ready(function(){
    loginvalid(localStorage.getItem('user'))
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
     
    if(JSON.parse(localStorage.user).id_tipo_usuario == 1052){
        getListaRelator();

        $('#crear-capacitacion').remove();
        $('#btn-nuevaPersona').remove();
        $('#li-relator').remove();
        $('#tabRelator').remove();

    }else if(JSON.parse(localStorage.user).id_cargo == 1004){
    	$('#redirect').css('display','');
        $('#redirect').on('click',redirectModulo);
        $('#btn-nuevaPersona').remove();
        getPersonalRegional();

    }else{
        $('#redirect').css('display','');
        $('#redirect').on('click',redirectModulo);
        getPersonal();
    }
        
    $('#guardar_asignacion').on('click',asignarCapacitacion);
     
    $('#guardar_evaluacion').click(guardarEvaluacion);
    $('#guardar_persona').click(guardarPersonal);
         
    $('#guardar_capacitacion').click(guardarCapacitacion);

    $('#guardar_capacitacionR').click(guardarCapacitacionR);

    $('#divInputHora').datetimepicker({
        format: 'HH:mm'
    });
    $('#divInputFecha').datetimepicker({
        locale: 'es',
        format: 'l'
    });

    $('#selectCapacitacionAll').on('change',verPersonal)

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
            id_cargo: JSON.parse(localStorage.user).id_cargo,
            id_persona: JSON.parse(localStorage.user).id_persona,
            id_tipo_usuario: JSON.parse(localStorage.user).id_tipo_usuario
        },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)

            if (data.resultado == undefined) {
                llenarVista(data)
            }else {
                if (data.resultado == "error") {
                   showFeedback("error",data.descripcion,"Error");
                }
            }
    
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
 
        }
    })
}

function getPersonalRegional(){
     $.ajax({
        method:'POST',
        url: webservice+'/capacitacion/lista-regional',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data:{ 
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            id_cargo: JSON.parse(localStorage.user).id_cargo,
            id_persona: JSON.parse(localStorage.user).id_persona,
            id_tipo_usuario: JSON.parse(localStorage.user).id_tipo_usuario
        },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)

            if (data.resultado == undefined) {
                llenarVista(data)
            }else {
                if (data.resultado == "error") {
                   showFeedback("error",data.descripcion,"Error");
                }
            }
    
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
 
        }
    })
}
  
function getListaRelator(){
     $.ajax({
        method:'POST',
        url: webservice+'/capacitacion/listaRelator',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data:{ 
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            id_persona: JSON.parse(localStorage.user).id_persona,
        },
        success: function(data, textStatus, jqXHR) {
            llenarVistaRelator(data)
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
arrayCapacitacion = []
arrayCapacitacionD = []
arrayRelator = []
arrayRelatorD = []
function llenarVista(data){
    //data = JSON.parse(data)
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
                exportOptions: {
                    columns: [ 0,1, 2, 3, 4, 5, 6, 7, 8, 9],
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
        data: data.personal_postulacion,
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
            {data: "email"},
            {data: "telefono"},
            {data: null,
                render: function(data, type,row){
                    if(row.id_capacitacion_persona != null && row.borrado_capacitacion == false ){
                        return  row.lugar+', '+moment(row.fecha_hora).format('DD-MM-YYYY  HH:mm');
                    }else{
                        return '';
                    } 
                }      
            },
            {data: "opciones",className: "text-center",
                render: function(data, type, row){                
                    return '<button type="button" id="persona_'+row.id_persona+'"  class="btn btn-primary btn-sm _btn-item mr-1"><i class="fa fa-pencil-alt"></i></button>'   
                }
            },
        ],
        "rowCallback": function( row, data ) {
            $('td:eq(10)', row).find('#persona_'+data.id_persona).data('id_persona',data.id_persona);
            $('td:eq(10)', row).find('#persona_'+data.id_persona).data('id_comuna',data.id_comuna_postulacion);
            $('td:eq(10)', row).find('#persona_'+data.id_persona).data('id_region',data.id_region_postulacion);
            $('td:eq(10)', row).find('#persona_'+data.id_persona).data('id_capacitacion',data.id_capacitacion);
            $('td:eq(10)', row).find('#persona_'+data.id_persona).data('borrado_capacitacion',data.borrado_capacitacion);
            $('td:eq(10)', row).find('#persona_'+data.id_persona).data('nombre',data.nombres+' '+data.apellido_paterno);
            $('td:eq(10)', row).find('#persona_'+data.id_persona).data('mail',data.email);
            $('td:eq(10)', row).find('#persona_'+data.id_persona).data('telefono',data.telefono);
            $('td:eq(10)', row).find('#persona_'+data.id_persona).data('fecha_hora',data.fecha_hora);
            $('td:eq(10)', row).find('#persona_'+data.id_persona).on('click',asignar);

        },
        "initComplete": function(settings, json) {
            //$('#inputRolAsignado').prop('disabled',true)
            /*if(JSON.parse(localStorage.user).id_cargo == 1004){
                var api = new $.fn.dataTable.Api(settings);
                api.columns([1]).visible(false);
            }*/

            var checkbox = $('input:checkbox[name=inputRolAsignado]')
            for (var i = 0; i < checkbox.length; i++) {
                checkbox[i].disabled = true;
          
            }
            $('#inputUsuario').prop('disabled',true)
            $('#inputContrasena').prop('disabled',true)
            $('#divRol').css('display','none')
            $('#divUsuario').css('display','none')
             
            var placeholder = ["","Región","Comuna","","","","","","","Capacitación"]
            this.api().columns([1,2,9]).every( function (index) {
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
                            if(index != 9){
                                $('#select'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                            }else{
                                 
                                if(d.lugar != null){
                                    arrayRelator.push(d.lugar+', '+moment(d.fecha_hora).format('DD-MM-YYYY  HH:mm'));
                                }
                                 
                            }  
                        }
                        
                    } );

                    const unique = (value, index, self) => {
                        return self.indexOf(value) === index
                    }

                    capacitacionUnica = arrayRelator.filter(unique)
                     
                    capacitacionUnica.forEach(function(item){
                        $('#select'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                    });


                    $('#select'+index).niceSelect();    
                }
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(settings){
            arrayRelatorD = []
            /*if(JSON.parse(localStorage.user).id_cargo == 1004){
                var api = new $.fn.dataTable.Api(settings);
                api.columns([1]).visible(false);
            }*/
            var placeholder = ["","Región","Comuna","","","","","","","Capacitación"]
            this.api().columns([1,2,9]).every( function (index) {
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
                                if(index != 9){
                                    selectFiltered.append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )    
                                }else{
                                    if(d.lugar != null){   
                                     arrayRelatorD.push(d.lugar+', '+moment(d.fecha_hora).format('DD-MM-YYYY  HH:mm'));                                    
                                    }
                                     
                                }
                            }         

                        } );
                    } 
                }
                if(index == 9){
                    const unique = (value, index, self) => {
                        return self.indexOf(value) === index
                    }
                    capacitacionUnica = arrayRelatorD.filter(unique)
                    capacitacionUnica.forEach(function(item){                      
                        $('#select'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                    });
                }
                
                $('select').niceSelect('update');
            })
        }
    });

    $('#limpiar-filtros-postulacion').click(btnClearFilters);
    $("#descargar-lista").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });
     
    $('#total').html(data.personal_postulacion.length)

    $("#table-postulacion").show();  

    $('#selectRegion').html('').append('<option value="-1" selected="">Elegir...</option>') 
    for(i = 0; i < data.regiones_capacitacion.length; i++){
        $('#selectRegion').append('<option value="'+data.regiones_capacitacion[i].id_region+'">'+data.regiones_capacitacion[i].nombre+'</option>') 
    }
    regiones = data.regiones;
    regiones_postulante = data.regiones_postulante;
    regiones_capacitacion = data.regiones_capacitacion;
    relatores = data.lista_reladores;
    capacitaciones = data.capacitaciones;

    llenarVistaCapacitacion(data.lista_capacitacion)
    llenarListaRelatores(data.lista_reladores)
    llenarSelects(data)
    llenarVistaCapacitados(data.lista_capacitados)

   /* if(JSON.parse(localStorage.user).id_cargo != 1003 && JSON.parse(localStorage.user).id_cargo != 1004){
        llenarVista2(data)
    }*/
     
}
 
function llenarVistaCapacitacion(data){

    //data = JSON.parse(data)
    $('#filtros-capacitacion').empty();
    if($.fn.dataTable.isDataTable('#table-capacitacion')){
        $('#table-capacitacion').DataTable().destroy();
        $('#lista-capacitacion').empty();
    }

    var tablaD = $("#table-capacitacion").DataTable({
        dom: "<'search'f>",
        buttons: [
            {
                extend: 'excel',
                title: 'Capacitaciones',
                exportOptions: {
                    columns: [ 0,1, 2, 3, 4, 5, 6, 7, 8, 9],
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
            {data: "lugar"},
            {data: "fecha",
                render:function(data,type,row){
                    return moment(row.fecha_hora).format('DD-MM-YYYY   HH:mm')
                }
            },
            {data: null,
                render: function(data, type, row){  
                    return  row.nombres + ' '+row.apellido_paterno+' '+row.apellido_materno;
                }
            },
            {data: "capacidad",className: "text-center"},
            {data: "convocados",className: "text-center"},
            {data: "confirmados",className: "text-center"},
            {data: "observacion"},
            {data: "opciones",className: "text-center",
                render: function(data, type, row){ 
                  
                	if(row.borrado == false){
                		btns =  '<button type="button" id="modificarCapacitacion_'+row.id_capacitacion+'" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'+
	                    		'<button type="button" id="seleccionarPersonas_'+row.id_capacitacion+'" class="btn btn-primary btn-sm _btn-item ml-1"><i class="fas fa-users"></i></button>'
	                    		
	                	if(row.convocados == null){
	                		btns += '<button type="button" id="deshabilitarCapacitacion_'+row.id_capacitacion+'" class="btn btn-primary btn-sm _btn-item ml-1"><i class="fas fa-times"></i></button>'   
	                	}
                	}else{
                		btns = ''  
                	}          

                	return btns;
                }
            },
        ],
        "rowCallback": function( row, data ) {

            $('td:eq(10)', row).find('#modificarCapacitacion_'+data.id_capacitacion).data('id_capacitacion',data.id_capacitacion);
            $('td:eq(10)', row).find('#modificarCapacitacion_'+data.id_capacitacion).on('click',modificarCapacitacion);

            $('td:eq(10)', row).find('#seleccionarPersonas_'+data.id_capacitacion).data('id_comuna',data.id_comuna);
            $('td:eq(10)', row).find('#seleccionarPersonas_'+data.id_capacitacion).data('id_region',data.id_region);
            $('td:eq(10)', row).find('#seleccionarPersonas_'+data.id_capacitacion).data('id_capacitacion',data.id_capacitacion);
            $('td:eq(10)', row).find('#seleccionarPersonas_'+data.id_capacitacion).data('fecha_hora',data.fecha_hora);
            $('td:eq(10)', row).find('#seleccionarPersonas_'+data.id_capacitacion).on('click',asignarVarios);

            $('td:eq(10)', row).find('#deshabilitarCapacitacion_'+data.id_capacitacion).data('id_capacitacion',data.id_capacitacion);
            $('td:eq(10)', row).find('#deshabilitarCapacitacion_'+data.id_capacitacion).data('convocados',data.convocados);
            $('td:eq(10)', row).find('#deshabilitarCapacitacion_'+data.id_capacitacion).on('click',deshabilitarCapacitacion);

            if(data.borrado == true){
            	$(row).css('background-color', '#cacaca');
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
            $('#divUsuario').css('display','none')
             
            var placeholder = ["","Región","Comuna","Lugar","","Relator"]
            this.api().columns([1,2,3,5]).every( function (index) {
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
                            if(index != 5){
                                $('#selectC'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                            }else{
     
                                arrayCapacitacion.push(d.nombres+' '+d.apellido_paterno+' '+d.apellido_materno);
                            }
                            
                        }
                        
                    } );

                    const unique = (value, index, self) => {
                        return self.indexOf(value) === index
                    }

                    relatorUnico = arrayCapacitacion.filter(unique)
                     
                    relatorUnico.forEach(function(item){
                        $('#selectC'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                    });

                    $('#selectC'+index).niceSelect();    
                }
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(settings){
            arrayCapacitacionD = []
            var placeholder = ["","Región","Comuna","Lugar","","Relator"]
            this.api().columns([1,2,3,5]).every( function (index) {
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
                                if(index != 5){
                                    selectFiltered.append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )    
                                }else{
                                     arrayCapacitacionD.push(d.nombres+' '+d.apellido_paterno+' '+d.apellido_materno);        
                                }
                            }                 

                        } );
                    }
                    
                  
                }

                if(index == 5){
                    const unique = (value, index, self) => {
                        return self.indexOf(value) === index
                    }
                    capacitacionUnica = arrayCapacitacionD.filter(unique)
                    capacitacionUnica.forEach(function(item){                      
                        $('#selectC'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                    });
                }

                $('select').niceSelect('update');
            })
        }
 
 
    });

    $('#total_capacitaciones').html(data.length)
    $("#descargar-lista-capacitaciones").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });
     
    $('#limpiar-filtros-capacitacion').click(btnClearFilters);
    $("#table-capacitacion").show();  
 
}

function llenarListaRelatores(data){

    //data = JSON.parse(data)
    $('#filtros-relator').empty();
    if($.fn.dataTable.isDataTable('#table-relator')){
        $('#table-relator').DataTable().destroy();
        $('#lista-relator').empty();
    }

    var tablaD = $("#table-relator").DataTable({
        dom: "<'search'f>",
        buttons: [
            {
                extend: 'excel',
                title: 'Relatores',
                exportOptions: {
                    columns: [ 0,1, 2, 3, 4, 5, 6],
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
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "capacitaciones"},
            {data: "opciones",className: "text-center",
                render: function(data, type, row){                
                    return '<button type="button" id="persona_'+row.id_persona+'" onclick="modificar('+row.id_persona+')" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'
                        
                }
            },

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
            $('#divUsuario').css('display','none')
             
            var placeholder = ["","Región","Comuna"]
            this.api().columns([1,2]).every( function (index) {
                if(JSON.parse(localStorage.user).id_cargo == 1004 && index == 1){
                    return;
                }else{
                    var column = this;
                    var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectRE'+index+'" >'+
                        '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                        .appendTo( $('#filtros-relator'))
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
            
                                $('#selectRE'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                        }
                        
                    } );

                    $('#selectRE'+index).niceSelect();    
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
                    var selectFiltered = $("#selectRE"+index)
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
    $('#limpiar-filtros-relator').click(btnClearFilters);
    $('#total_relatores').html(data.length)
    $("#descargar-lista-relatores").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });

    $("#table-relator").show();  
 
}

function llenarVistaRelator(data){

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
                title: 'Capacitaciones',
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
        data: data.personal_capacitacion,
        responsive: true, 
        columns:[
            {data: "nro",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
           /* {data: "nombre_zona"},*/
            {data: "region"},
            {data: "comuna"},
            /*{data: "nombre_rol"},*/
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "email"},
            {data: "telefono"},
            {data: null,
                render: function(data, type,row){
                    if(row.id_capacitacion_persona != null && row.borrado_capacitacion == false ){
                        return  row.lugar+', '+moment(row.fecha_hora).format('DD-MM-YYYY  HH:mm');
                    }else{
                        return '';
                    }
                     
                }
                    
            },
            {data: null},
            /*{data: "opciones",className: "text-center",
                render: function(data, type, row){                
                    return '<button type="button" id="persona_'+row.id_persona+'"  class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'
                        
                }
            },*/
        ],
        "columnDefs": [
            {
                "targets": [10],
                "visible": false,
                "searchable": false
            }
        ],
        /*"rowCallback": function( row, data ) {

            $('td:eq(10)', row).find('button').data('id_capacitacion',data.id_capacitacion);
            $('td:eq(10)', row).find('button').data('id_persona',data.id_persona);
  
            $('td:eq(10)', row).find('button').on('click',agregarNotas);
        
        },*/

        "initComplete": function(settings, json) {
            $('#inputUsuario').prop('disabled',true)
            $('#inputContrasena').prop('disabled',true)
            $('#divRol').css('display','none')
            $('#divUsuario').css('display','none')
             
            var placeholder = ["","Región","Comuna","","","","","","","Capacitación"]
            this.api().columns([1,2,9]).every( function (index) {
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
                            if(index != 9){
                                $('#select'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                            }else{
                                 
                                if(d.lugar != null){
                                    console.log(d.lugar)
                                    arrayCapacitacion.push(d.lugar+', '+moment(d.fecha_hora).format('DD-MM-YYYY  HH:mm'));
                                }
                                 
                            }  
                        }
                        
                    } );

                    const unique = (value, index, self) => {
                        return self.indexOf(value) === index
                    }

                    capacitacionUnica = arrayCapacitacion.filter(unique)
                     
                    capacitacionUnica.forEach(function(item){
                        $('#select'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                    });


                    $('#select'+index).niceSelect();    
                }
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(settings){
            arrayCapacitacionD = []
            if(JSON.parse(localStorage.user).id_cargo == 1004){
                var api = new $.fn.dataTable.Api(settings);
                api.columns([1]).visible(false);
            }
            var placeholder = ["","Región","Comuna","","","","","","","Capacitación"]
            this.api().columns([1,2,9]).every( function (index) {
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
                                if(index != 9){
                                    selectFiltered.append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )    
                                }else{
                                    if(d.lugar != null){   
                                     arrayCapacitacionD.push(d.lugar+', '+moment(d.fecha_hora).format('DD-MM-YYYY  HH:mm'));                                    
                                    }
                                     
                                }
                            }         

                        } );
                    } 
                }
                if(index == 9){
                    const unique = (value, index, self) => {
                        return self.indexOf(value) === index
                    }
                    capacitacionUnica = arrayCapacitacionD.filter(unique)
                    capacitacionUnica.forEach(function(item){                      
                        $('#select'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                    });
                }
                
                $('select').niceSelect('update');
            })
        }
    });
 //tablaD.columns( [10] ).visible( false );
    $('#limpiar-filtros-postulacion').click(btnClearFilters);
    $("#descargar-lista").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });
    $('#total').html(data.personal_capacitacion.length) 
    $("#table-postulacion").show();  
 
    llenarVistaCapacitacionRelator(data.lista_capacitacion)
    llenarVistaCapacitados(data.lista_capacitados)
}
 
function llenarVistaCapacitacionRelator(data){

    //data = JSON.parse(data)
    $('#filtros-capacitacion').empty();
    if($.fn.dataTable.isDataTable('#table-capacitacion')){
        $('#table-capacitacion').DataTable().destroy();
        $('#lista-capacitacion').empty();
    }

    var tablaD = $("#table-capacitacion").DataTable({
        dom: "<'search'f>",
         buttons: [
            {
                extend: 'excel',
                title: 'Capacitaciones',
                exportOptions: {
                    columns: [ 0,1, 2, 3, 4, 6, 7, 8, 9],
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
            {data: "lugar"},
            {data: "fecha",
                render:function(data,type,row){
                    return moment(row.fecha_hora).format('DD-MM-YYYY   HH:mm')
                }
            },
            {data: "relator",
                render: function(data, type, row){  
                    return  row.nombres + ' '+row.apellido_paterno+' '+row.apellido_materno;
                }
            },
            {data: "capacidad",className: "text-center"},
            {data: "convocados",className: "text-center"},
            {data: "confirmados",className: "text-center"},
            {data: "observacion"},
            {data: "opciones",className: "text-center",
                render: function(data, type, row){                
                    return  '<button type="button" id="modificarCapacitacion_'+row.id_capacitacion+'" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'+
                            '<button type="button" id="notas_'+row.id_capacitacion+'"  class="ml-1 btn btn-primary btn-sm _btn-item"><i class="fas fa-users"></i></button>'
                    		
                        
                }
            }
        ],
        "columnDefs": [
            {
                "targets": [5],
                "visible": false,
                "searchable": false
            },
        ],
        "rowCallback": function( row, data ) {

            $('td:eq(9)', row).find('#modificarCapacitacion_'+data.id_capacitacion).data('id_capacitacion',data.id_capacitacion);
            $('td:eq(9)', row).find('#modificarCapacitacion_'+data.id_capacitacion).data('region',data.region);
            $('td:eq(9)', row).find('#modificarCapacitacion_'+data.id_capacitacion).data('comuna',data.comuna);
            $('td:eq(9)', row).find('#modificarCapacitacion_'+data.id_capacitacion).on('click',modificarCapacitacion);

            $('td:eq(9)', row).find('#notas_'+data.id_capacitacion).data('id_capacitacion',data.id_capacitacion);
            $('td:eq(9)', row).find('#notas_'+data.id_capacitacion).on('click',agregarNotas);

            if(data.borrado == true){
            	$(row).css('background-color', '#cacaca');
            }
           
        },
        "initComplete": function(settings, json) {
            //$('#inputRolAsignado').prop('disabled',true)
            /* if(JSON.parse(localStorage.user).id_cargo == 1004){
                var api = new $.fn.dataTable.Api(settings);
                api.columns([1]).visible(false);
            }*/

            var checkbox = $('input:checkbox[name=inputRolAsignado]')
            for (var i = 0; i < checkbox.length; i++) {
                checkbox[i].disabled = true;
          
            }
            $('#inputUsuario').prop('disabled',true)
            $('#inputContrasena').prop('disabled',true)
            $('#divRol').css('display','none')
            $('#divUsuario').css('display','none')
             
            var placeholder = ["","Región","Comuna","Lugar"]
            this.api().columns([1,2,3]).every( function (index) {
                if(JSON.parse(localStorage.user).id_cargo == 1004 && index == 1){
                    return;
                }else{
                    var column = this;
                    var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectCR'+index+'" >'+
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
                            $('#selectCR'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                        }
                        
                    } );
                    $('#selectCR'+index).niceSelect();    
                }
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(settings){
 
            var placeholder = ["","Región","Comuna","Lugar"]
            this.api().columns([1,2,3]).every( function (index) {
                if(JSON.parse(localStorage.user).id_cargo == 1004 && index == 1){
                    return;
                }else{
                    var columnFiltered = this;
                    var selectFiltered = $("#selectCR"+index)
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
    $('#total_capacitaciones').html(data.length)
    $("#descargar-lista-capacitaciones").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });

    $("#table-capacitacion").show();  
 
}

function llenarVistaCapacitados(data){

    //data = JSON.parse(data)
     
    if($.fn.dataTable.isDataTable('#table-capacitados')){
        $('#table-capacitados').DataTable().destroy();
        $('#lista-capacitados').empty();
    }

    var tablaD = $("#table-capacitados").DataTable({
        dom: "<'search'f>",
        buttons: [
            {
                extend: 'excel',
                title: 'Capacitados',
                exportOptions: {
                    columns: [ 0,1, 2, 3, 4, 5, 6, 7, 8,9],
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
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: null,
                render: function(data, type,row){
                    if(row.id_capacitacion_persona != null && row.borrado_capacitacion == false ){
                        return  row.lugar+', '+moment(row.fecha_hora).format('DD-MM-YYYY  HH:mm');
                    }else{
                        return '';
                    }
                }       
            },
            {data: null,
                render: function(data, type,row){
                    if(row.pruebas !=  null){
                        if(row.pruebas.length > 1){
                            return  row.pruebas[1].puntaje
                        }else{
                            return '';
                        }
                    }else{
                        return '';
                    }
                     
                     
                }
            },
            {data: null,
                render: function(data, type,row){
                    if(row.pruebas !=  null){
                        if(row.pruebas.length > 1){
                            return  row.pruebas[0].puntaje == 1 ? 'Recomendado' : row.pruebas[0].puntaje == 0 ? 'No Recomendado' : ''
                        }else{
                            return '';
                        }
                    }else{
                        return '';
                    }
                     
                }
            },
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
                    var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectCA'+index+'" >'+
                        '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                        .appendTo( $('#filtros-capacitados'))
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
                            $('#selectCA'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                        }
                        
                    } );
                    $('#selectCA'+index).niceSelect();    
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
                    var selectFiltered = $("#selectCA"+index)
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
    $('#limpiar-filtros-capacitados').click(btnClearFilters);
    $('#total_capacitados').html(data.length)
    $("#descargar-lista-capacitados").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });
    $("#table-capacitados").show();  
 
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

function cargarRelatores(){
 
    $('#selectRelator').html('')
    $('#selectRelator').append('<option value="-1" selected="">Elegir...</option>') 

    for(h = 0; h < relatores.length; h++){
        $('#selectRelator').append('<option value="'+relatores[h].id_persona+'">'+relatores[h].nombres+' '+relatores[h].apellido_paterno+'</option>') 
    }
    $('#selectRelator').prop('disabled',false)
      
}
 

function btnClearFilters(){
    $('#select1').val("").niceSelect('update');
    $('#select2').val("").niceSelect('update'); 
    $('#select9').val("").niceSelect('update'); 
    
    $('#selectC1').val("").niceSelect('update'); 
    $('#selectC2').val("").niceSelect('update'); 
    $('#selectC3').val("").niceSelect('update'); 
    $('#selectC5').val("").niceSelect('update'); 

    $('#selectRE1').val("").niceSelect('update'); 
    $('#selectRE2').val("").niceSelect('update'); 

    $('#selectCR1').val("").niceSelect('update'); 
    $('#selectCR2').val("").niceSelect('update');
    $('#selectCR3').val("").niceSelect('update'); 

    $('#selectCA1').val("").niceSelect('update'); 
    $('#selectCA2').val("").niceSelect('update'); 
 
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
 
    var table = $('#table-relator').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

}

function nuevaCapacitacion(){ 
    docO_b64 = '';
    doc0_name = '';
    $('#titulo_modal_capacitacion').html('Nueva Capacitación')
    localStorage.id_capacitacion = -1
    $('#selectRegion').val('-1')
    $('#selectComuna').prop('disabled',true)
    $('#selectRelator').prop('disabled',true)
    limpiar()
    $('#capacitacionModal').modal({backdrop: 'static', keyboard: false},'show')
    $("#inputDocumento").val('')
}

 
function cargarDatosCapacitacion(data){
    docO_b64 = '';
    doc0_name = '';
    $("#inputDocumento").val('')
    limpiar()
    $('#titulo_modal_capacitacion').html('Modificar Capacitación')
    localStorage.id_capacitacion = data.id_capacitacion
    $('#selectRegion').val(data.id_region)
    cargarComunas(data.id_region)
    $('#selectComuna').val(data.id_comuna)
    cargarRelatores(data.id_comuna)
    $('#selectRelator').val(data.id_relator).prop('disabled',false)
    $("#inputFecha").val(moment(data.fecha_hora, "YYYY-MM-DD HH:mm:ss").format("DD-MM-YYYY") )
    $("#inputHora").val(moment(data.fecha_hora, "YYYY-MM-DD HH:mm:ss").format("HH:mm") )
    $('#inputCapacidad').val(data.capacidad)
    $('#inputAsistentes').val(data.asistentes)
    $('#inputLugar').val(data.lugar)
    $('#inputObservacion').val(data.observacion)
 
    if(data.archivo_nombre != null){
        ext = diccionarioTipos(data.archivo_mimetype)
        $('#inputDocumento').css('display','none')
        $('#inputNombreArchivo').html('<b>'+data.archivo_nombre+'.'+ext+'</b>')
    }else{
        $('#inputDocumento').css('display','')
        $('#inputNombreArchivo').html('')
    }

    $('#capacitacionModal').modal({backdrop: 'static', keyboard: false},'show')   
}

function cargarDatosCapacitacionRelator(region,comuna,data){
    docO_b64 = '';
    doc0_name = '';
    $("#inputDocumentoR").val('')
    localStorage.id_capacitacion = data.id_capacitacion

    $('#selectRegionR').html(region)
    $('#selectComunaR').html(comuna)
    $("#inputFechaR").html(moment(data.fecha_hora, "YYYY-MM-DD HH:mm:ss").format("DD-MM-YYYY") )
    $("#inputHoraR").html(moment(data.fecha_hora, "YYYY-MM-DD HH:mm:ss").format("HH:mm") )
    $('#inputCapacidadR').html(data.capacidad)
    $('#inputAsistentesR').html(data.asistentes)
    $('#inputLugarR').html(data.lugar)
    $('#inputObservacionR').html(data.observacion)
 
    if(data.archivo_nombre != null){
        ext = diccionarioTipos(data.archivo_mimetype)
        $('#inputDocumentoR').css('display','none')
        $('#inputNombreArchivoR').html('<b>'+data.archivo_nombre+'.'+ext+'</b>')
    }else{
        $('#inputDocumentoR').css('display','')
        $('#inputNombreArchivoR').html('')
    }

    $('#capacitacionModalRelator').modal({backdrop: 'static', keyboard: false},'show')  
}

function diccionarioTipos(mimeType){
    salida = "";
    switch (mimeType) {
        case 'image/jpeg':
            salida = "jpg";
            break;
        case 'image/png':
            salida = "png";
            break;
        case 'application/pdf':
            salida = "pdf";
            break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            salida = "docx";
            break;
        case 'application/msword':
            salida = "doc";
            break;
    }
    return salida;
}

function guardarConfirmOtro() {
    console.log('guardarConfirmOtro')
    encodeDocumentoOtro();
    let esperarSubida = new Promise((resolve, reject) => {
      $.blockUI({ message: 'Procesando archivo. Espere un momento...' });  
      setTimeout(function(){

        if(docO_b64 == null){ 
            reject("Archivo 1 mal subido");
        }

        resolve(true);
      }, 2000);
    });

    esperarSubida.then((successMessage) => {
        
        if(successMessage == true){
            console.log('successMessage')
            if(JSON.parse(localStorage.user).id_tipo_usuario == 1052){
            	console.log('GuardarR')
            	guardarCapacitacionR()
            }else{
            	console.log('Guardar')
            	guardarCapacitacion()
            }
        }
        $.unblockUI();
    })
    .catch(
        function(reason) {
            $.unblockUI();
            /* TODO: En caso de fallar mostrar alerta y permitir reintentar*/
            console.log('Sin éxito: ('+reason+').');
    });
     
}
var docO_b64;
var doc0_name;
function encodeDocumentoOtro() {
    console.log('encodeDocumentoOtro')
    var reader = new FileReader();
    
    reader.onloadend = function() {
                docO_b64 = (reader.result).split("base64,")[1]
                name = JSON.parse(localStorage.user).id_tipo_usuario == 1052 ? (($("#inputDocumentoR"))[0].files[0].name).trim() :(($("#inputDocumento"))[0].files[0].name).trim();
                lastDot = name.lastIndexOf('.');
                doc0_name = name.substring(0, lastDot);
                console.log(docO_b64)
    };

    if(JSON.parse(localStorage.user).id_tipo_usuario == 1052){
    	reader.readAsDataURL(document.getElementById("inputDocumentoR").files[0]);
    }else{
    	reader.readAsDataURL(document.getElementById("inputDocumento").files[0]);
    }

    return true;

}

function guardarCapacitacion(){
 
    if(validar() == true){

        if($('#inputDocumento').val() != '' && (docO_b64 == '' || docO_b64 == null) && ($('#inputDocumento').is(":visible"))){
            guardarConfirmOtro()
        }else{
            console.log(docO_b64)
            console.log('guardarCapacitacion')
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
                    id_capacitacion : localStorage.id_capacitacion,
                    id_comuna:  $('#selectComuna').val(),
                    id_relator: $('#selectRelator').val(),
                    lugar: $('#inputLugar').val(),
                    fecha:moment($("#inputFecha").val(), "DD-MM-YYYY").format("YYYY-MM-DD") + ' ' + $("#inputHora").val(),
                    capacidad: $('#inputCapacidad').val(),
                    asistentes: $('#inputAsistentes').val(),
                    observacion: $('#inputObservacion').val(),
                    documento: docO_b64,
                    nombre_archivo: doc0_name
                },
            success: function(data, textStatus, jqXHR) {
                data = JSON.parse(data) 
                console.log(data)

                if (data.resultado != "error") {
                    showFeedback("success", data.descripcion, "Guardado");
                    $('#capacitacionModal').modal('hide');
                    if(JSON.parse(localStorage.user).id_cargo == 1004){
                        getPersonalRegional();
                    }else{
                        getPersonal()
                    }

                } else {
                    showFeedback("error","Error al guardar","Error");
                    console.log("invalidos");
                }
                $.unblockUI();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showFeedback("error","Error en el servidor","Datos incorrectos");
                console.log("error del servidor, datos incorrectos");
                $.unblockUI();
     
            }
        })
        }
         
    }
}
function guardarCapacitacionR(){

    if($('#inputDocumentoR').val() != '' && (docO_b64 == '' || docO_b64 == null) && ($('#inputDocumentoR').is(":visible"))){
        guardarConfirmOtro()
    }else{
        $.ajax({
	        method:'POST',
	        url: webservice+'/capacitacion/guardarDocumento',
	        headers:{
	           't': JSON.parse(localStorage.user).token
	        },
	        crossDomain: true,
	        dataType:'text',
	        data :{ 
	                id_usuario: JSON.parse(localStorage.user).id_usuario,
	                id_capacitacion : localStorage.id_capacitacion,
	                documento: docO_b64,
	                nombre_archivo: doc0_name
	            },
	        success: function(data, textStatus, jqXHR) {
	            data = JSON.parse(data) 
	            console.log(data)

	            if (data.resultado != "error") {
	                showFeedback("success", data.descripcion, "Guardado");
	                $('#capacitacionModalRelator').modal('hide');
	                getListaRelator();
	            } else {
	                showFeedback("error","Error al guardar","Error");
	                console.log("invalidos");
	            }
	            $.unblockUI();
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
	            showFeedback("error","Error en el servidor","Datos incorrectos");
	            console.log("error del servidor, datos incorrectos");
	            $.unblockUI();
	 
	        }
	    })
    }
         
   
}
function modificarCapacitacion(){
	region = $(this).data('region')
	comuna = $(this).data('comuna')
        $.ajax({
            method:'POST',
            url: webservice+'/capacitacion/modificarCapacitacion',
            headers:{
               't': JSON.parse(localStorage.user).token
            },
            crossDomain: true,
            dataType:'text',
            data :{ 
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    id_capacitacion : $(this).data('id_capacitacion') 
                },
            success: function(data, textStatus, jqXHR) {
                data = JSON.parse(data) 

                if (data.resultado == undefined) {
                     
                    if(JSON.parse(localStorage.user).id_tipo_usuario == 1052){
                    	cargarDatosCapacitacionRelator(region, comuna, data) 
                    }else{
                    	cargarDatosCapacitacion(data)
                    }
                }else {
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

    if($('#inputCapacidad').val().length < 1){
        valida = false
        $('#inputCapacidad').addClass('is-invalid')
    }else{
        $('#inputCapacidad').removeClass('is-invalid')
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

    localStorage.capacitacion_tipo = 1;

    $('#div-individual').css('display','')
    $('#div-varios').css('display','none')

    localStorage.id_capacitacion = $(this).data('id_capacitacion') 
    localStorage.borrado_capacitacion = $(this).data('borrado_capacitacion') 
    localStorage.comuna = $(this).data('id_comuna') 
    localStorage.region = $(this).data('id_region') 
    localStorage.id_persona = $(this).data('id_persona') 

   // $('#div_personas').html('');
    $('#selectCapacitacion').html('')
    $('#nombrePersona').html($(this).data('nombre'))
    $('#mailPersona').html($(this).data('mail'))
    $('#telefonoPersona').html($(this).data('telefono'))
    

    id =  $(this).data('id_region') 
    if(capacitaciones[id] != undefined){
        $('#selectCapacitacion').append('<option value="-1" selected="">Elegir...</option>') 
        for(h = 0; h < capacitaciones[id].length; h++){
            $('#selectCapacitacion').append('<option value="'+capacitaciones[id][h].id_capacitacion+'">'+moment(capacitaciones[id][h].fecha_hora).format('DD-MM-YYYY - HH:mm')+', '+capacitaciones[id][h].lugar+'</option>') 
        }
        if(localStorage.id_capacitacion != 'null' && localStorage.borrado_capacitacion == "false"){
            $('#selectCapacitacion').val(localStorage.id_capacitacion).prop('disabled',true) 
        }else{
            $('#selectCapacitacion').prop('disabled',false) 
        }
       /* console.log(moment().format('DD-MM-YYYY - HH:mm'))
        console.log(moment(capacitaciones[id][h].fecha_hora).format('DD-MM-YYYY - HH:mm'))
        $(this).data('fecha_hora') */
    }else{
        $('#selectCapacitacion').append('<option value="-1" selected="">Sin Capacitaciones...</option>') 
    }

    $('#asignarCapacitacion').modal({backdrop: 'static', keyboard: false},'show')   
        
}

function asignarVarios(){

    localStorage.capacitacion_tipo = 2;

    $('#div-individual').css('display','none')
    $('#div-varios').css('display','')

    localStorage.id_capacitacion = $(this).data('id_capacitacion') 
    localStorage.borrado_capacitacion = $(this).data('borrado_capacitacion') 
    localStorage.comuna = $(this).data('id_comuna')     
    localStorage.region = $(this).data('id_region') 
    localStorage.fecha_hora = $(this).data('fecha_hora') 
    console.log(localStorage.fecha_hora);
    //$('#div_personas').html('');
    $('#selectCapacitacionAll').html('')

    id =  $(this).data('id_region') 

    if(capacitaciones[id] != undefined){
        $('#selectCapacitacionAll').append('<option value="-1" selected="">Elegir...</option>') 
        for(h = 0; h < capacitaciones[id].length; h++){
            $('#selectCapacitacionAll').append('<option value="'+capacitaciones[id][h].id_capacitacion+'">'+moment(capacitaciones[id][h].fecha_hora).format('DD-MM-YYYY - HH:mm')+', '+capacitaciones[id][h].lugar+'</option>') 
        }
        $('#selectCapacitacionAll').val(localStorage.id_capacitacion)
        verPersonal()
    }else{
        $('#selectCapacitacionAll').append('<option value="-1" selected="">Sin Capacitaciones...</option>') 
    }

    $('#asignarCapacitacion').modal({backdrop: 'static', keyboard: false},'show')   
        
}
 
function deshabilitarCapacitacion(){
	Swal.fire({
      title: '¿Está seguro que desea deshabilitar la capacitación?',
      text: "Una vez deshabilitado no se podra modificar.",
      type: 'warning',
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      	if (result.value) {
        	deshabilitar($(this).data('id_capacitacion'))
      	}
    })
    function deshabilitar(id){
		if($(this).data('convocados') == null){
			$.ajax({
		        method:'POST',
		        url: webservice+'/capacitacion/deshabilitarCapacitacion',
		        headers:{
		           't': JSON.parse(localStorage.user).token
		        },
		        crossDomain: true,
		        dataType:'text',
		        data :{ 
		            id_usuario: JSON.parse(localStorage.user).id_usuario,
		            id_capacitacion: id
		        },
		        success: function(data, textStatus, jqXHR) {
		            data = JSON.parse(data) 
		            if (data.resultado == "ok") {
		            	showFeedback("success", data.descripcion, "Guardado");
		                getPersonal();
		            }else {
		                showFeedback("error",data.descripcion,"Error");
		                console.log("invalidos");
		                $.unblockUI();
		            }  
		        },
		        error: function(jqXHR, textStatus, errorThrown) {
		            showFeedback("error","Error en el servidor","Datos incorrectos");
		            console.log("error del servidor, datos incorrectos");
		            $.unblockUI();
		        }
		    })
		}
	}
		 
}

function verPersonal(){
    $.blockUI({  
        baseZ: 3000,
        message: '<img style="width: 10%;" src="images/loading.gif" />',
        css: {
            border:     'none',
            backgroundColor:'transparent',        
        } 
    });
   // $('#div_personas').html('');
    if($('#selectCapacitacionAll').val() != -1){
   
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
                    id_region:  localStorage.region,
                    //id_persona:  localStorage.id_persona,
                    id_capacitacion:  $('#selectCapacitacionAll').val()
            },
            success: function(data, textStatus, jqXHR) {
                data = JSON.parse(data) 
                if (data.resultado == undefined) {
                    cargarPeronal((data.personal_capacitacion))
                }else {
                    showFeedback("error",data.resultado,"Error");
                    console.log("invalidos");
                    $.unblockUI();
                }
                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showFeedback("error","Error en el servidor","Datos incorrectos");
                console.log("error del servidor, datos incorrectos");
                $.unblockUI();
            }
        })
    }
        
}

function cargarPeronal(data){
   // $('#div_personas').html('');

   /* if(data.length > 0){*/
  /*      for (i = 0;  i < data.length; i++) {
            check = data[i].id_capacitacion != null ?  (data[i].borrado_capacitacion == false ? "checked" : "") : "" 
            div = '<div class="form-check form-check-inline custom-checkbox col-3 mr-0 mb-3">'+
                        '<input type="checkbox" id="check-persona-'+data[i].id_persona+'" name="checkPersonalCapacitacion" value="'+data[i].id_persona+'" '+
                            'class="form-check-input custom-control-input" '+check+'>'+
                        '<label class="form-check-label custom-control-label" for="check-persona-'+data[i].id_persona+'">'+data[i].nombres+' '+data[i].apellido_paterno+'</label>'+
                    '</div>'

                    tr = '<tr>'+
                    		'<td><input type="checkbox" id="check-persona-'+data[i].id_persona+'" name="checkPersonalCapacitacion" value="'+data[i].id_persona+'" '+
                            		'class="form-check-input custom-control-input" '+check+'>'+
                            '</td>'+
	                        '<td>'+data[i].region+'</td>'+
	                        '<td>'+data[i].comuna+'</td> '+
	                        '<td>'+data[i].run+'</td>'+    
	                        '<td>'+data[i].nombres+'</td>'+
	                        '<td>'+data[i].apellido_paterno+'</td>'+
	                        '<td>'+data[i].apellido_materno+'</td>'+     
	                    '</tr>'
              

            $('#lista-personasVarias').append(tr);
        }
*/
    if($.fn.dataTable.isDataTable('#table-personasVarias')){
        $('#table-personasVarias').DataTable().destroy();
        $('#lista-personasVarias').empty();
    }

    var tablaD = $("#table-personasVarias").DataTable({
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
            {data: null,
                render: function(data, type,row){
                	/*check = data.id_capacitacion != null ?  (data.borrado_capacitacion == false ? "checked" : "") : "" 
                    disabled = data.id_capacitacion != null ?  (data.borrado_capacitacion == false ? "disabled" : "") : "" 
                    return  '<input type="checkbox" id="check-persona-'+data.id_persona+'" name="checkPersonalCapacitacion" value="'+data.id_persona+'" '+
                            		''+check+' '+disabled+'>';*/
                    if( data.id_capacitacion != null){
                        return 1;
                    }else{
                        return 0;
                    }
                }
            },
            {data: "region"},
            {data: "comuna"},
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
        ],
        "rowCallback": function( row, data ) {

            if(moment(moment().format('YYYY-MM-DD, HH:mm:ss')).isAfter(localStorage.fecha_hora)){
                disabled = "disabled"
            }else{
                disabled = data.id_capacitacion != null ?  (data.borrado_capacitacion == false ? "disabled" : "") : "" 
            }

            check = data.id_capacitacion != null ?  (data.borrado_capacitacion == false ? "checked" : "") : "" 
            
            $('td:eq(0)', row).html('<input type="checkbox" id="check-persona-'+data.id_persona+'" name="checkPersonalCapacitacion" value="'+data.id_persona+'" '+
                                    ''+check+' '+disabled+'>');


        },
        "initComplete": function(settings, json) {
             
            var placeholder = ["","Región","Comuna"]
            this.api().columns([1,2]).every( function (index) {
                if(JSON.parse(localStorage.user).id_cargo == 1004 && index == 1){
                    return;
                }else{
                    var column = this;
                    var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectCA'+index+'" >'+
                        '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                        .appendTo( $('#filtros-personasVarias'))
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
                            $('#selectCA'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                        }
                        
                    } );
                    $('#selectCA'+index).niceSelect();    
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
                    var selectFiltered = $("#selectCA"+index)
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
    /*}else{
        $('#div_personas').html('No existe personal para la Región en la que se impartira la Capacitación.')
    }*/

    $.unblockUI();                                 
    
}

function asignarCapacitacion(){
	$('#guardar_asignacion').prop('disabled',true)
    capacitacionesAsignadas = [];
    selectIdCapacitacion = 0;
    if(localStorage.capacitacion_tipo == 1){
        check = $('#selectCapacitacion').val() == -1 ? 0 : 1
        capacitacionesAsignadas.push({id_persona:localStorage.id_persona, asignar: check})
        selectIdCapacitacion = $('#selectCapacitacion').val();

    }else if(localStorage.capacitacion_tipo == 2){
        var checkbox = $('input:checkbox[name=checkPersonalCapacitacion]')
        for (var i = 0; i < checkbox.length; i++) {
            check = checkbox[i].checked == true ? 1 : 0
            capacitacionesAsignadas.push({id_persona: checkbox[i].value, asignar: check})  
        }

        selectIdCapacitacion = $('#selectCapacitacionAll').val();
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
                    id_capacitacion: selectIdCapacitacion,
                    personal_capacitacion: capacitacionesAsignadas,
                },
            success: function(data, textStatus, jqXHR) {
                data = JSON.parse(data) 
                console.log(data)

                if (data.resultado != "error") {
                    showFeedback("success", data.descripcion, "Guardado");
                    $('#asignarCapacitacion').modal('hide');
                    localStorage.id_capacitacion = 'null'
                    getPersonal()

                } else {
                    showFeedback("error","Error al guardar","Error");
                    console.log("invalidos");
                    $('#guardar_asignacion').prop('disabled',false)
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
            	$('#guardar_asignacion').prop('disabled',false)
                showFeedback("error","Error en el servidor","Datos incorrectos");
                console.log("error del servidor, datos incorrectos");
     
            }
        })
 
}

function agregarNotas(){
    localStorage.id_capacitacion =  $(this).data('id_capacitacion');
    $.ajax({
            method:'POST',
            url: webservice+'/capacitacion/modificarPersona',
            headers:{
               't': JSON.parse(localStorage.user).token
            },
            crossDomain: true,
            dataType:'text',
            data :{ 
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    id_capacitacion:  $(this).data('id_capacitacion') ,
                    //id_persona:  $(this).data('id_persona') 

            },
            success: function(data, textStatus, jqXHR) {
                data = JSON.parse(data) 
                console.log(data)

                if (data.resultado == undefined) {
                    cargarNotas(data)
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

function cargarNotas(data){
    $('#body-evaluacion').empty();
    $('#nombreCapacitacion').html(data)
    for ( var i = 0; i < data.length; i++) {
  
        tr = '<tr id="tr-'+i+'">'+
                '<td>'+data[i].nombres+' '+data[i].apellido_paterno+' '+data[i].apellido_materno+'</td>'+

                '<td><select id="asistencia_'+i+'" class="form-control">'+
                    '<option value="-1">Seleccione...</option>'+
                    '<option value="true">Presente</option>'+
                    '<option value="false">Ausente</option>'+
                '</select></td>'+
                
                '<td><input class="form-control" value="'+(data[i].capacitacion_prueba != null ? 
                    data[i].capacitacion_prueba[1].puntaje : "")+'" oninput="this.value=porcentaje(this.value)"></input></td>'+

                /*'<td><input class="form-control" value="'+(data[i].capacitacion_prueba != null ? 
                    data[i].capacitacion_prueba[0].puntaje : "" )+'" oninput="this.value=Numeros(this.value)"></input></td>'+*/

                '<td><select id="psicologica_'+i+'" class="form-control">'+
                    '<option value="-1">Seleccione...</option>'+
                    '<option value="1">Recomendado</option>'+
                    '<option value="0">No Recomendado</option>'+
                '</select></td>'+


                '<td><select id="estado_'+i+'" class="form-control">'+
                    '<option value="-1">Seleccione...</option>'+
                    '<option value="true">Aprobado</option>'+
                    '<option value="false">Rechazado</option>'+
                '</select></td>'+

            '</tr>'
        $('#body-evaluacion').append(tr);

        $('#asistencia_'+i).val(data[i].asistencia == null ? -1 : ''+data[i].asistencia+'')

        $('#psicologica_'+i).val(data[i].capacitacion_prueba == null ? -1 : ''+data[i].capacitacion_prueba[0].puntaje+'')
      
        $('#estado_'+i).val(data[i].estado == null ? -1 : ''+data[i].estado+'')

        $('#tr-'+i).data('id_persona',data[i].id_persona);
        $('#tr-'+i).data('id_persona_cargo',data[i].id_persona_cargo); 
        $('#tr-'+i).data('id_capacitacion_persona',data[i].id_capacitacion_persona); 
        $('#tr-'+i).data('id_capacitacion',data[i].id_capacitacion); 
         
    }
              

    $('#evaluarPostulante').modal({backdrop: 'static', keyboard: false},'show')   
}

function guardarEvaluacion(){
	cumple = true;
    evaluaciones = []
    $('#body-evaluacion tr').each(function() {
        var id_capacitacion  = $(this).data('id_capacitacion')
        var id_persona = $(this).data('id_persona')
        var id_capacitacion_persona = $(this).data('id_capacitacion_persona')
        var asistencia = $(this).find('td:nth-child(2) select').val() == "" ? 0 : $(this).find('td:nth-child(2) select').val()
        var puntaje_contenido = $(this).find('td:nth-child(3) input').val() == "" ? 0 : $(this).find('td:nth-child(3) input').val()
        var puntaje_psicologica = $(this).find('td:nth-child(4) select').val() == "" ? 0 : $(this).find('td:nth-child(4) select').val()
        var estado = $(this).find('td:nth-child(5) select').val() == "" ? 0 : $(this).find('td:nth-child(5) select').val()

      

        //VALIDAR QUE NO APRUEBE O REPRUEBE SIN LLENAR TODA LA INFORMACION
        /*  if(estado != -1 && (asistencia  == -1 || puntaje_contenido == 0  || puntaje_psicologica == -1)){
                console.log('VALIDAR QUE NO APRUEBE O REPRUEBE SIN LLENAR TODA LA INFORMACION')
            	if(asistencia  == -1){
    	        	$(this).find('td:nth-child(2) select').addClass('is-invalid')
    				cumple = false
    	        }else{
    	        	$(this).find('td:nth-child(2) select').removeClass('is-invalid')
    	        }

    	        if(puntaje_contenido == 0){
    	        	$(this).find('td:nth-child(3) input').addClass('is-invalid')
    				cumple = false
    	        }else{
    	        	$(this).find('td:nth-child(3) input').removeClass('is-invalid')
    	        }

    	        if(puntaje_psicologica == -1){
    	        	$(this).find('td:nth-child(4) select').addClass('is-invalid')
    				cumple = false
    	        }else{
    	        	$(this).find('td:nth-child(4) select').removeClass('is-invalid')
    	        }

            }*/


        //VALIDAR QUE SI NO ASISTE NO PUEDE LLENAR CON INFORMACION LOS DEMAS DATOS
            if(asistencia  == 'false' && (puntaje_contenido > 0 || puntaje_psicologica != -1 || estado != -1)){
                if(puntaje_contenido > 0){
                    $(this).find('td:nth-child(3) input').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(3) input').removeClass('is-invalid')
                }

                if(puntaje_psicologica != -1){
                    $(this).find('td:nth-child(4) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(4) select').removeClass('is-invalid')
                }

                if(estado != -1){
                    $(this).find('td:nth-child(5) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(5) select').removeClass('is-invalid')
                }
            }

        // VALIDAR QUE APRUEBE CUANDO NO CUMPLE CON LAS CONDICIONES
            if(estado == 'true'){
                if(asistencia  != 'true'){
                    $(this).find('td:nth-child(2) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(2) select').removeClass('is-invalid')
                }

                if(puntaje_contenido < 90){
                    $(this).find('td:nth-child(3) input').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(3) input').removeClass('is-invalid')
                }
                //VALIDAR QUE NO APRUEBE CUANDO NO CUMPLIO LA PRUEBA PSICOLOGICA
                if(puntaje_psicologica == 0){
                    $(this).find('td:nth-child(4) select').addClass('is-invalid')
                    $(this).find('td:nth-child(5) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(4) select').removeClass('is-invalid')
                    $(this).find('td:nth-child(5) select').removeClass('is-invalid')
                }
            }

        // VALIDAR QUE RECHAZE CUANDO CUMPLE CON LAS CONDICIONES
            if(estado == 'false'){
                if(asistencia  != 'true'){
                    $(this).find('td:nth-child(2) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(2) select').removeClass('is-invalid')
                }

                if(puntaje_contenido > 89){
                    $(this).find('td:nth-child(3) input').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(3) input').removeClass('is-invalid')
                }

                if(puntaje_psicologica != 0){
                    $(this).find('td:nth-child(4) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(4) select').removeClass('is-invalid')
                }
            }

        evaluaciones.push({
            id_capacitacion: id_capacitacion,
            id_persona: id_persona,
            id_capacitacion_persona: id_capacitacion_persona, 
            asistencia: asistencia,
            puntaje_psicologica: puntaje_psicologica, 
            puntaje_contenido:puntaje_contenido,
            estado: estado
        })
  

    })

	if(cumple){    
	    $.ajax({
	        method: 'POST',
	        url: webservice+'/capacitacion/evaluacion',
	        headers: {
	            't': JSON.parse(localStorage.user).token
	        },
	        crossDomain: true,
	        dataType: 'text',
	        data: { 
	            id_usuario: JSON.parse(localStorage.user).id_usuario,
	            id_capacitacion: localStorage.id_capacitacion,
	            evaluado: evaluaciones
	        },
	        success: function(data, textStatus, jqXHR) {
	                data = JSON.parse(data) 
	                console.log(data)

	            if (data.resultado != "error") {
	                showFeedback("success", data.descripcion, "Guardado");
	                getListaRelator()
	                $('#evaluarPostulante').modal('hide');
	                 
	            } else {
	                showFeedback("error",data.descripcion,"Error");
	                console.log("invalidos");
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
    for(i = 0; i < data.regiones_postulante.length; i++){
        $('#inputRegionPostulacion').append('<option value="'+data.regiones_postulante[i].id_region+'">'+data.regiones_postulante[i].nombre+'</option>') 
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
         
    $('#'+input).prop('disabled',false)
}

function guardarPersonal(){
    //var checkbox = $('input:checkbox[name=inputRolAsignado]')
    cargos = [];
    console.log('guardar')
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

    if($('#divUsuario').is(":visible")){
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

function modificar(id,idPersonaCargo){

 
    $('#inputUsuario').prop('disabled',true)
    $('#inputContrasena').prop('disabled',true)
    console.log($('#inputContrasena'))
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
                id_persona_cargo : 0
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
