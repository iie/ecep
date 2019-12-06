$(document).ready(function(){
    loginvalid(localStorage.getItem('user'))
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
     
    $.blockUI({  
        baseZ: 3000,
        message: '<img style="width: 10%;" src="images/loading.gif" />',
        css: {
            border:     'none',
            backgroundColor:'transparent',        
        } 
    });   
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
    $('#guardar_asignacion_correo').on('click',notificarCapacitacion);
    $('#guardar_evaluacion').click(guardarEvaluacion);
    $('#guardar_persona').click(guardarPersonal);
         
    $('#guardar_capacitacion').click(guardarCapacitacion);

    $('#guardar_capacitacionR').click(guardarCapacitacionR);
    $('#guardar_nueva_nota').click(guardarNota);
     

    $('#eliminar_asignacion').css('display','none')
    $('#eliminar_asignacion').click(desconvocar);

    $('#divInputHora').datetimepicker({
        format: 'HH:mm'
    });
    $('#divInputFecha').datetimepicker({
        locale: 'es',
        format: 'l'
    });

    //$('#selectCapacitacionAll').on('change',verPersonal)

    localStorage.c_region = ""
    localStorage.c_comuna = ""
    localStorage.c_lugar = ""
    localStorage.c_relator = ""

    localStorage.p_region = ""
    localStorage.p_comuna = ""
    localStorage.p_capacitacion = ""
    localStorage.p_estado = ""

    localStorage.r_region = ""
    localStorage.r_comuna = ""

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
arrayEstado = []
arrayFechas = []
function llenarVista(data){
    //data = JSON.parse(data)
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
                    columns: [ 0,1, 2, 3, 4, 5, 6, 7, 8, 9],
                },
                action  : function ( e, dt, node, config ){
                        console.log('arruba')
 

                    $.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, node, config);    
                    
                    console.log('abajo')

                   
                },

            }
        ],*/
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
            /*{data: "email"},*/
            {data: "telefono"},
            {data: "id_capacitacion",
                render: function(data, type,row){
                    if(row.borrado_capacitacion == false){
                        return  data;
                    }else{
                        return '';
                    } 
                } 
            },
            {data: "lugar",
                render: function(data, type,row){
                    if(row.borrado_capacitacion == false){
                        return  data;
                    }else{
                        return '';
                    } 
                } 
            },
            {data: null,
                render: function(data, type,row){
                    if(row.id_capacitacion_persona != null && data.borrado_capacitacion == false){
                        return moment(row.fecha_hora).format('DD-MM-YYYY');
                    }else{
                        return '';
                    } 
                }      
            },
            {data: null,
                render: function(data, type,row){
                    if(row.id_capacitacion_persona != null && data.borrado_capacitacion == false){
                        return moment(row.fecha_hora).format('HH:mm');
                    }else{
                        return '';
                    } 
                }      
            },
            {data: null,
                render: function(data, type,row){
                    if(row.deserta == true){
                        return 'Desertó'
                    }else if(row.estado == null && row.id_capacitacion != null && row.borrado_capacitacion == false){
                        var hoy = moment().format('YYYY-MM-DD');
                        var fecha = moment(row.fecha_hora).format('YYYY-MM-DD');
                        if(moment(fecha).isAfter(hoy)){
                            return 'Capacitación pendiente'
                        }else{
                            return 'Evaluación pendiente'
                        }
                         
                    }else if(row.asistencia == true && row.estado == false){
                        return 'Reprobado';
                    }else if(row.asistencia == false && row.estado == false){
                        return 'No Asistió';
                    }else{
                        return ''
                    }
                }      
            },
            {data: "opciones",className: "text-center",
                render: function(data, type, row){  
                    if(row.deserta == false){
                        btns = ''
                        if(row.id_capacitacion_persona != null && row.borrado_capacitacion == false){
                            btns += '<button type="button" id="persona_'+row.id_persona+'"  class="btn btn-primary btn-sm _btn-item mr-1"><i class="fa fa-pencil-alt"></i></button>'   
                        }
                        btns += '<button type="button" id="desertar_'+row.id_persona+'"  class="btn btn-danger btn-sm _btn-item mr-1"><i class="fas fa-times"></i></button>'                          
                        return btns;
                    }else{
                        return '';
                    }
                }   
            },
        ],
        "rowCallback": function( row, data ) {
            $('td:eq(13)', row).find('#persona_'+data.id_persona).data('id_persona',data.id_persona);
            $('td:eq(13)', row).find('#persona_'+data.id_persona).data('id_comuna',data.id_comuna_postulacion);
            $('td:eq(13)', row).find('#persona_'+data.id_persona).data('id_region',data.id_region_postulacion);
            $('td:eq(13)', row).find('#persona_'+data.id_persona).data('id_capacitacion',data.id_capacitacion);
            $('td:eq(13)', row).find('#persona_'+data.id_persona).data('borrado_capacitacion',data.borrado_capacitacion);
            $('td:eq(13)', row).find('#persona_'+data.id_persona).data('nombre',data.nombres+' '+data.apellido_paterno);
            $('td:eq(13)', row).find('#persona_'+data.id_persona).data('mail',data.email);
            $('td:eq(13)', row).find('#persona_'+data.id_persona).data('telefono',data.telefono);
            $('td:eq(13)', row).find('#persona_'+data.id_persona).data('fecha_hora',data.fecha_hora);
            $('td:eq(13)', row).find('#persona_'+data.id_persona).on('click',asignar);

            $('td:eq(13)', row).find('#desertar_'+data.id_persona).data('nombre',data.nombres+' '+data.apellido_paterno);
            $('td:eq(13)', row).find('#desertar_'+data.id_persona).data('id_persona',data.id_persona);
            $('td:eq(13)', row).find('#desertar_'+data.id_persona).on('click',desertar);

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
             
            var placeholder = ["","Región","Comuna","","","","","","","Lugar","Fecha","","Estado"]
            this.api().columns([1,2,9,10,12]).every( function (index) {
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
                            if(index == 12){
                                 
                                if(d.deserta == true){
                                    valor = 'Desertó'
                                }else if(d.estado == null && d.id_capacitacion != null && d.borrado_capacitacion == false){
                                    valor = 'Evaluación pendiente'
                                }else if(d.asistencia == true && d.estado == false){
                                    valor = 'Reprobado';
                                }else if(d.asistencia == false && d.estado == false){
                                    valor = 'No Asistió';
                                }else{
                                    valor = ''
                                }

                                if(valor != ''){     
                                    arrayEstado.push(valor);
                                }
                            }else if(index < 10){
                                $('#select'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                            }else{
                                 
                                if(d.lugar != null){
                                    arrayRelator.push(moment(d.fecha_hora).format('DD-MM-YYYY'));
                                }
                                 
                            }  
                        }
                        
                    } );

                    const unique = (value, index, self) => {
                        return self.indexOf(value) === index
                    }
                    if(index == 10){
                        capacitacionUnica = arrayRelator.filter(unique)
                         
                        capacitacionUnica.forEach(function(item){
                            $('#select'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                        });
                    }

                    if(index == 12){
                        capacitacionUnica = arrayEstado.filter(unique)
                         
                        capacitacionUnica.forEach(function(item){
                            $('#select'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                        });
                    }

                    $('#select'+index).niceSelect();   

                    /*$(tablaD).ready(function() {
                        console.log(lastCat)
                        tablaD.column(2).search( lastCat ? '^'+lastCat+'$' : '', true, false ).draw();
                       
                    }); */
                }
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(settings){

            arrayRelatorD = []
            arrayEstadoD = []
            /*if(JSON.parse(localStorage.user).id_cargo == 1004){
                var api = new $.fn.dataTable.Api(settings);
                api.columns([1]).visible(false);
            }*/
            var placeholder = ["","Región","Comuna","","","","","","","Lugar","Fecha","","Estado"]
            this.api().columns([1,2,9,10,12]).every( function (index) {
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
                                if(index == 12){
                                    if(d.deserta == true){
                                        valor = 'Desertó'
                                    }else if(d.estado == null && d.id_capacitacion != null && d.borrado_capacitacion == false){
                                        var hoy = moment().format('YYYY-MM-DD');
                                        var fecha = moment(d.fecha_hora).format('YYYY-MM-DD');
                                        if(moment(fecha).isAfter(hoy)){
                                            valor = 'Capacitación pendiente'
                                        }else{
                                            valor = 'Evaluación pendiente'
                                        }
                                  
                                    }else if(d.asistencia == true && d.estado == false){
                                        valor = 'Reprobado';
                                    }else if(d.asistencia == false && d.estado == false){
                                        valor = 'No Asistió';
                                    }else{
                                        valor = ''
                                    }
                                    if(valor != ''){   
                                     arrayEstadoD.push(valor);                                    
                                    }
                                    //selectFiltered.append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )    
                                }else if(index < 10){
                                    //CARGAR PAGINA MANTENIENDO LOS FILTROS
                                   /* if(index == 1 && localStorage.c_region === d) {
                                        $('#selectC'+index).append( '<option SELECTED value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                                    }else if(index == 2 && localStorage.c_comuna === d) {
                                        $('#selectC'+index).append( '<option SELECTED value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                                    }else if(index == 3 && localStorage.c_lugar === d) {
                                        $('#selectC'+index).append( '<option SELECTED value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                                    }else{
                                        $('#selectC'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                                    }
                */


                                    
                                    selectFiltered.append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )    
                                }else{
                                    if(d.lugar != null){   
                                     arrayRelatorD.push(moment(d.fecha_hora).format('DD-MM-YYYY'));                                    
                                    }
                                     
                                }
                            }         

                        } );
                    } 
                }
                const unique = (value, index, self) => {
                    return self.indexOf(value) === index
                }

                if(index == 10){
                    capacitacionUnica = arrayRelatorD.filter(unique)
                    capacitacionUnica.forEach(function(item){                      
                        $('#select'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                    });
                }
                if(index == 12){
                    capacitacionUnica = arrayEstadoD.filter(unique)
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
        window.location='https://ecep2019.iie.cl/public/api/web/capacitacion/descarga-listado';
  
        //tablaD.button( '.buttons-excel' ).trigger();
 
 
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

    if(JSON.parse(localStorage.user).id_tipo_usuario != 1052 && JSON.parse(localStorage.user).id_cargo != 1004){
        $('#label_total').css('display','')
        $('#total_capacitados').html(data.total_capacitados)
    }else{
        $('#label_total').css('display','none')
    }
    $.unblockUI();
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
            {data: "id_capacitacion"},
            {data: "region"},
            {data: "comuna"},
            {data: "lugar"},
            {data: "fecha_hora",
                render: function(data, type,row){
                    if(row.borrado == false ){
                        return  moment(data).format('DD-MM-YYYY');
                    }else{
                        return '';
                    }
                }       
            },
            {data: "fecha_hora",
                render: function(data, type,row){
                    if(row.borrado == false ){
                        return  moment(data).format('HH:mm')
                    }else{
                        return '';
                    }
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
            {data: "asistentes",className: "text-center"},
            {data: "aprobados",className: "text-center"},
            {data: "observacion"},
            {data: "opciones",className: "text-center",
                render: function(data, type, row){ 
                    var hoy = moment().format('YYYY-MM-DD');
                    var fecha = moment(row.fecha_hora).format('YYYY-MM-DD');

                    if(row.borrado == false){
                        btns =  '<button type="button" id="modificarCapacitacion_'+row.id_capacitacion+'" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'+
                                '<button type="button" id="seleccionarPersonas_'+row.id_capacitacion+'" class="btn btn-primary btn-sm _btn-item ml-1"><i class="fas fa-users"></i></button>'
                        if(moment(fecha).isAfter(hoy)){
                            btns += '<button type="button" id="notificarPersonas_'+row.id_capacitacion+'" class="btn btn-primary btn-sm _btn-item ml-1"><i class="far fa-envelope"></i></button>'
                        }
                        if(row.convocados == null){
                            btns += '<button type="button" id="deshabilitarCapacitacion_'+row.id_capacitacion+'" class="btn btn-danger btn-sm _btn-item ml-1"><i class="fas fa-times"></i></button>'   
                        }
                    }else{
                        btns = ''  
                    }          

                    return btns;
                }
            },
        ],
        "rowCallback": function( row, data ) {

            $('td:eq(13)', row).find('#modificarCapacitacion_'+data.id_capacitacion).data('id_capacitacion',data.id_capacitacion);
            $('td:eq(13)', row).find('#modificarCapacitacion_'+data.id_capacitacion).on('click',modificarCapacitacion);

            $('td:eq(13)', row).find('#seleccionarPersonas_'+data.id_capacitacion).data('id_comuna',data.id_comuna);
            $('td:eq(13)', row).find('#seleccionarPersonas_'+data.id_capacitacion).data('id_region',data.id_region);
            $('td:eq(13)', row).find('#seleccionarPersonas_'+data.id_capacitacion).data('id_capacitacion',data.id_capacitacion);
            $('td:eq(13)', row).find('#seleccionarPersonas_'+data.id_capacitacion).data('region',data.region);
            $('td:eq(13)', row).find('#seleccionarPersonas_'+data.id_capacitacion).data('comuna',data.comuna);
            $('td:eq(13)', row).find('#seleccionarPersonas_'+data.id_capacitacion).data('fecha_hora',data.fecha_hora);
            $('td:eq(13)', row).find('#seleccionarPersonas_'+data.id_capacitacion).data('capacidad',data.capacidad);
            $('td:eq(13)', row).find('#seleccionarPersonas_'+data.id_capacitacion).data('relator',data.nombres+' '+data.apellido_paterno);
            $('td:eq(13)', row).find('#seleccionarPersonas_'+data.id_capacitacion).data('lugar',data.lugar);

            $('td:eq(13)', row).find('#seleccionarPersonas_'+data.id_capacitacion).on('click',asignarVarios);

            $('td:eq(13)', row).find('#notificarPersonas_'+data.id_capacitacion).data('id_comuna',data.id_comuna);
            $('td:eq(13)', row).find('#notificarPersonas_'+data.id_capacitacion).data('id_region',data.id_region);
            $('td:eq(13)', row).find('#notificarPersonas_'+data.id_capacitacion).data('id_capacitacion',data.id_capacitacion);
            $('td:eq(13)', row).find('#notificarPersonas_'+data.id_capacitacion).data('region',data.region);
            $('td:eq(13)', row).find('#notificarPersonas_'+data.id_capacitacion).data('comuna',data.comuna);
            $('td:eq(13)', row).find('#notificarPersonas_'+data.id_capacitacion).data('fecha_hora',data.fecha_hora);
            $('td:eq(13)', row).find('#notificarPersonas_'+data.id_capacitacion).data('capacidad',data.capacidad);
            $('td:eq(13)', row).find('#notificarPersonas_'+data.id_capacitacion).data('relator',data.nombres+' '+data.apellido_paterno);
            $('td:eq(13)', row).find('#notificarPersonas_'+data.id_capacitacion).data('lugar',data.lugar);

            $('td:eq(13)', row).find('#notificarPersonas_'+data.id_capacitacion).on('click',notificarVarios);

            $('td:eq(13)', row).find('#deshabilitarCapacitacion_'+data.id_capacitacion).data('id_capacitacion',data.id_capacitacion);
            $('td:eq(13)', row).find('#deshabilitarCapacitacion_'+data.id_capacitacion).data('convocados',data.convocados);
            $('td:eq(13)', row).find('#deshabilitarCapacitacion_'+data.id_capacitacion).on('click',deshabilitarCapacitacion);

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
             
            var placeholder = ["","Región","Comuna","Lugar","Fecha","","Relator"]
            this.api().columns([1,2,3,4,6]).every( function (index) {
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

                            if(index == 4){
                                arrayFechas.push(moment(d).format('DD-MM-YYYY'));
                            }else if(index != 6){
                                //CARGAR PAGINA MANTENIENDO LOS FILTROS
                                if(index == 1 && localStorage.c_region === d) {
                                    $('#selectC'+index).append( '<option SELECTED value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                                }else if(index == 2 && localStorage.c_comuna === d) {
                                    $('#selectC'+index).append( '<option SELECTED value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                                }else if(index == 3 && localStorage.c_lugar === d) {
                                    $('#selectC'+index).append( '<option SELECTED value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                                }else{
                                    $('#selectC'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                                }
                            }else{
                                arrayCapacitacion.push(d.nombres+' '+d.apellido_paterno+' '+d.apellido_materno);
                            }
                            
                        }
                        
                    } );

                    const unique = (value, index, self) => {
                        return self.indexOf(value) === index
                    }

                    if(index == 4){
                        fechaUnica = arrayFechas.filter(unique)
                         
                        fechaUnica.forEach(function(item){
                            if(localStorage.c_fecha === item) {
                                $('#selectC'+index).append( '<option SELECTED value="'+item+'">'+item+'</option>' )         
                            }else{
                                $('#selectC'+index).append( '<option value="'+item+'">'+item+'</option>' ) 
                            }  
                        });
                    }

                    if(index == 6){
                        relatorUnico = arrayCapacitacion.filter(unique)
                         
                        relatorUnico.forEach(function(item){
                            if(localStorage.c_relator === item) {
                                $('#selectC'+index).append( '<option SELECTED value="'+item+'">'+item+'</option>' )         
                            }else{
                                $('#selectC'+index).append( '<option value="'+item+'">'+item+'</option>' ) 
                            }       
                        });
                    }

                    $('#selectC'+index).niceSelect(); 

                    $(tablaD).ready(function() {    
                        //CARGAR PAGINA MANTENIENDO LOS FILTROS        
                            tablaD.column(1).search( localStorage.c_region ? '^'+localStorage.c_region+'$' : '', true, false ).draw(); 
                            tablaD.column(2).search( localStorage.c_comuna ? '^'+localStorage.c_comuna+'$' : '', true, false ).draw();
                            tablaD.column(3).search( localStorage.c_lugar ? '^'+localStorage.c_lugar+'$' : '', true, false ).draw();
                            tablaD.column(4).search( localStorage.c_fecha ? '^'+localStorage.c_fecha+'$' : '', true, false ).draw();
                            tablaD.column(6).search( localStorage.c_relator ? '^'+localStorage.c_relator+'$' : '', true, false ).draw();            
                    });   
                }
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(settings){
            arrayCapacitacionD = []
            arrayFechasD = []
            var placeholder = ["","Región","Comuna","Lugar","Fecha","","Relator"]
            this.api().columns([1,2,3,4,6]).every( function (index) {
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
                                if(index == 4){                                   
                                    arrayFechasD.push(moment(d).format('DD-MM-YYYY'));        
                                }else if(index != 6){
                                    selectFiltered.append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )    
                                }else{
                                     arrayCapacitacionD.push(d.nombres+' '+d.apellido_paterno+' '+d.apellido_materno);        
                                }
                            }                 

                        } );
                    }
                    
                  
                }
                if(index == 4){
                    const unique = (value, index, self) => {
                        return self.indexOf(value) === index
                    }
                    capacitacionUnica = arrayFechasD.filter(unique)
                    capacitacionUnica.forEach(function(item){                      
                        $('#selectC'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                    });
                }

                if(index == 6){
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
            {data: "capacitaciones", className: "text-center"},
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
 
                            if(index == 1 && localStorage.r_region === d) {
                                $('#selectRE'+index).append( '<option SELECTED value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                            }else if(index == 2 && localStorage.r_comuna === d) {
                                $('#selectRE'+index).append( '<option SELECTED value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                            }else{
                                $('#selectRE'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                            }  
                        }
                        
                    } );

                    $('#selectRE'+index).niceSelect();   

                    $(tablaD).ready(function() {    
                        //CARGAR PAGINA MANTENIENDO LOS FILTROS        
                            tablaD.column(1).search( localStorage.r_region ? '^'+localStorage.r_region+'$' : '', true, false ).draw(); 
                            tablaD.column(2).search( localStorage.r_comuna ? '^'+localStorage.r_comuna+'$' : '', true, false ).draw();    
                    });  
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
            /*{data: "email"},*/
            {data: "telefono"},
            {data: "id_capacitacion"},
            {data: 'lugar'},
            {data: null,
                render: function(data, type,row){
                    if(row.id_capacitacion_persona != null && data.borrado_capacitacion == false){
                        return moment(row.fecha_hora).format('DD-MM-YYYY');
                    }else{
                        return '';
                    } 
                }      
            },
            {data: null,
                render: function(data, type,row){
                    if(row.id_capacitacion_persona != null && data.borrado_capacitacion == false){
                        return moment(row.fecha_hora).format('HH:mm');
                    }else{
                        return '';
                    } 
                }      
            },
            {data: null,
                render: function(data, type,row){
                    if(row.deserta == true){
                        return 'Desertó'
                    }else if(row.estado == null && row.id_capacitacion != null && row.borrado_capacitacion == false){
                        var hoy = moment().format('YYYY-MM-DD');
                        var fecha = moment(row.fecha_hora).format('YYYY-MM-DD');
                        if(moment(fecha).isAfter(hoy)){
                            return 'Capacitación pendiente'
                        }else{
                            return 'Evaluación pendiente'
                        }
                       
                    }else if(row.asistencia == true && row.estado == false){
                        return 'Reprobado';
                    }else if(row.asistencia == false && row.estado == false){
                        return 'No Asistió';
                    }else{
                        return ''
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
                "targets": [13],
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
             
            var placeholder = ["","Región","Comuna","","","","","","","Lugar","Fecha","","Estado"]
            this.api().columns([1,2,9,10,12]).every( function (index) {
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
                            if(index == 12){
                                 
                                if(d.deserta == true){
                                    valor = 'Desertó'
                                }else if(d.estado == null && d.id_capacitacion != null && d.borrado_capacitacion == false){
                                    var hoy = moment().format('YYYY-MM-DD');
                                    var fecha = moment(d.fecha_hora).format('YYYY-MM-DD');
                                    if(moment(fecha).isAfter(hoy)){
                                        valor = 'Capacitación pendiente'
                                    }else{
                                        valor = 'Evaluación pendiente'
                                    }
                                }else if(d.asistencia == true && d.estado == false){
                                    valor = 'Reprobado';
                                }else if(d.asistencia == false && d.estado == false){
                                    valor = 'No Asistió';
                                }else{
                                    valor = ''
                                }

                                if(valor != ''){     
                                    arrayEstado.push(valor);
                                }
                            }else if(index < 10){
                                $('#select'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                            }else{
                                 
                                if(d.lugar != null){
                                    arrayCapacitacion.push(moment(d.fecha_hora).format('DD-MM-YYYY'));
                                }
                                 
                            } 
                        }                       
                    } );
                    const unique = (value, index, self) => {
                        return self.indexOf(value) === index
                    }
                    if(index == 10){
                        capacitacionUnica = arrayCapacitacion.filter(unique)
                     
                        capacitacionUnica.forEach(function(item){
                            $('#select'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                        });
                    }

                    if(index == 12){
                        capacitacionUnica = arrayEstado.filter(unique)
                         
                        capacitacionUnica.forEach(function(item){
                            $('#select'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                        });
                    }

                    $('#select'+index).niceSelect();    
                }
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(settings){
            arrayCapacitacionD = []
            arrayEstadoD = []
            if(JSON.parse(localStorage.user).id_cargo == 1004){
                var api = new $.fn.dataTable.Api(settings);
                api.columns([1]).visible(false);
            }
            var placeholder = ["","Región","Comuna","","","","","","","Lugar","Fecha","","Estado"]
            this.api().columns([1,2,9,10,12]).every( function (index) {
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
                                if(index == 12){
                                    if(d.deserta == true){
                                        valor = 'Desertó'
                                    }else if(d.estado == null && d.id_capacitacion != null && d.borrado_capacitacion == false){
                                        var hoy = moment().format('YYYY-MM-DD');
                                        var fecha = moment(d.fecha_hora).format('YYYY-MM-DD');
                                        if(moment(fecha).isAfter(hoy)){
                                            valor = 'Capacitación pendiente'
                                        }else{
                                            valor = 'Evaluación pendiente'
                                        }
                                        
                                    }else if(d.asistencia == true && d.estado == false){
                                        valor = 'Reprobado';
                                    }else if(d.asistencia == false && d.estado == false){
                                        valor = 'No Asistió';
                                    }else{
                                        valor = ''
                                    }
                                    if(valor != ''){   
                                     arrayEstadoD.push(valor);                                    
                                    }
                                    //selectFiltered.append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )    
                                }else if(index < 10){
                                    selectFiltered.append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )    
                                }else{
                                    if(d.lugar != null){   
                                     arrayCapacitacionD.push(moment(d.fecha_hora).format('DD-MM-YYYY'));                                    
                                    }
                                     
                                }
                            }         

                        } );
                    } 
                }

                const unique = (value, index, self) => {
                    return self.indexOf(value) === index
                }

                if(index == 10){
                    capacitacionUnica = arrayCapacitacionD.filter(unique)
                    capacitacionUnica.forEach(function(item){                      
                        $('#select'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                    });
                }
                if(index == 12){
                    capacitacionUnica = arrayEstadoD.filter(unique)
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

    $('#label_total').css('display','none')

    $.unblockUI();
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
            {data: "id_capacitacion"},
            {data: "region"},
            {data: "comuna"},
            {data: "lugar"},
            {data: "fecha",className: "text-center",
                render:function(data,type,row){
                    return moment(row.fecha_hora).format('DD-MM-YYYY')
                }
            },
            {data: "fecha",className: "text-center",
                render:function(data,type,row){
                    return moment(row.fecha_hora).format('HH:mm')
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
            {data: "asistentes",className: "text-center"},
            {data: "aprobados",className: "text-center"},
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
                "targets": [6],
                "visible": false,
                "searchable": false
            },
        ],
        "rowCallback": function( row, data ) {

            $('td:eq(12)', row).find('#modificarCapacitacion_'+data.id_capacitacion).data('id_capacitacion',data.id_capacitacion);
            $('td:eq(12)', row).find('#modificarCapacitacion_'+data.id_capacitacion).data('region',data.region);
            $('td:eq(12)', row).find('#modificarCapacitacion_'+data.id_capacitacion).data('comuna',data.comuna);
            $('td:eq(12)', row).find('#modificarCapacitacion_'+data.id_capacitacion).on('click',modificarCapacitacion);

            $('td:eq(12)', row).find('#notas_'+data.id_capacitacion).data('id_capacitacion',data.id_capacitacion);
            $('td:eq(12)', row).find('#notas_'+data.id_capacitacion).data('region',data.region);
            $('td:eq(12)', row).find('#notas_'+data.id_capacitacion).data('comuna',data.comuna);
            $('td:eq(12)', row).find('#notas_'+data.id_capacitacion).data('lugar',data.lugar);
            $('td:eq(12)', row).find('#notas_'+data.id_capacitacion).data('fecha',moment(data.fecha_hora).format('DD-MM-YYYY'));
            $('td:eq(12)', row).find('#notas_'+data.id_capacitacion).data('hora',moment(row.fecha_hora).format('HH:mm'));
            $('td:eq(12)', row).find('#notas_'+data.id_capacitacion).on('click',agregarNotas);

            if(data.borrado == true){
                $(row).css('background-color', '#cacaca');
            }
           
        },
        "initComplete": function(settings, json) {
             
            var placeholder = ["","Región","Comuna","Lugar"]
            this.api().columns([1,2,3]).every( function (index) {
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
                             console.log(column.data())
                    column.data().unique().each( function ( d, j ) {
                        if(d != null){
                        	$('#selectCR'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                        }
                        
                    } );

                $('#selectCR'+index).niceSelect(); 

 
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(settings){
 	 		arrayFechasD = []
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
arrayCapacitados = []
arrayCapacitadosD = []
function llenarVistaCapacitados(data){

    //data = JSON.parse(data)
    $('#filtros-capacitados').empty();
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
            {data: "id_capacitacion"},
            {data: "lugar",
                render: function(data, type,row){
                    if(row.id_capacitacion_persona != null && row.borrado_capacitacion == false ){
                        return  data;
                    }else{
                        return '';
                    }
                }       
            },
            {data: "fecha_hora",
                render: function(data, type,row){
                    if(row.id_capacitacion_persona != null && row.borrado_capacitacion == false ){
                        return  moment(data).format('DD-MM-YYYY');
                    }else{
                        return '';
                    }
                }       
            },
            {data: "fecha_hora",
                render: function(data, type,row){
                    if(row.id_capacitacion_persona != null && row.borrado_capacitacion == false ){
                        return moment(data).format('HH:mm');
                    }else{
                        return '';
                    }
                }       
            },
            {data: null, className : "text-center",
                render: function(data, type,row){
                    if(row.pruebas !=  null){
                        if(row.pruebas.length > 1){
                            return  row.pruebas[1].puntaje == 0 ? '' : row.pruebas[1].puntaje
                        }else{
                            return '';
                        }
                    }else{
                        return '';
                    }
                     
                     
                }
            },
            {data: null, className : "text-center",
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
            {data: null,
                render: function(data, type,row){
                    if(row.asistencia == false || (row.asistencia == null && row.estado == null)){
                        return 'No Asistió'
                    }else if(row.estado == false){
                        return 'Reprobó'
                    }else if(row.estado == true){
                        return 'Aprobado'
                    }else{
                        return 'No Asistió'
                    }
                }      
            },
            {data: null,
                render: function(data, type,row){
                    return '';
                }
            },
        ],
        "rowCallback": function( row, data ) {

            if(JSON.parse(localStorage.user).id_tipo_usuario == 1051 && data.estado == true){
                btn = '<button type="button" id="capacitado_'+data.id_persona+'"  class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'
                $('td:eq(14)', row).html(btn)
                $('td:eq(14)', row).find('#capacitado_'+data.id_persona).data('id_persona',data.id_persona);
                $('td:eq(14)', row).find('#capacitado_'+data.id_persona).data('id_capacitacion_persona',data.id_capacitacion_persona);
                $('td:eq(14)', row).find('#capacitado_'+data.id_persona).data('nombres',data.nombres+' '+data.apellido_paterno);
                $('td:eq(14)', row).find('#capacitado_'+data.id_persona).data('run',data.run);
                $('td:eq(14)', row).find('#capacitado_'+data.id_persona).on('click',obtenerNota); 
            }
             
           
        },
        "initComplete": function(settings, json) {
            //$('#inputRolAsignado').prop('disabled',true)
            if(JSON.parse(localStorage.user).id_cargo == 1004){
                var api = new $.fn.dataTable.Api(settings);
                api.columns([1]).visible(false);
            }
            if(JSON.parse(localStorage.user).id_tipo_usuario != 1051){
                var api = new $.fn.dataTable.Api(settings);
                api.columns([14]).visible(false);
            }

            var checkbox = $('input:checkbox[name=inputRolAsignado]')
            for (var i = 0; i < checkbox.length; i++) {
                checkbox[i].disabled = true;
          
            }
            $('#inputUsuario').prop('disabled',true)
            $('#inputContrasena').prop('disabled',true)
            $('#divRol').css('display','none')
            $('#divUsuario').css('display','none')
             
            var placeholder = ["","Región","Comuna","","","","","","Lugar","Fecha"]
            this.api().columns([1,2,8,9]).every( function (index) {
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
                    /*column.data().unique().each( function ( d, j ) {
                        if(d != null){
                            $('#selectCA'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                        }
                        
                    } );*/

                    column.data().unique().each( function ( d, j ) {
                        if(d != null){  
                            if(index != 9){
                                $('#selectCA'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )         
                            }else{
                                $('#selectCA'+index).append( '<option value="'+moment(d).format('DD-MM-YYYY')+'">'+moment(d).format('DD-MM-YYYY')+'</option>' )         
                                /*if(d.lugar != null){
                                    arrayCapacitados.push(d.lugar+', '+moment(d.fecha_hora).format('DD-MM-YYYY  HH:mm'));
                                }*/
                                 
                            }  
                        }
                        
                    } );

                    /* const unique = (value, index, self) => {
                                    return self.indexOf(value) === index
                                }

                                capacitadosUnica = arrayCapacitados.filter(unique)
                                 
                                capacitadosUnica.forEach(function(item){
                                    $('#selectCA'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                                });
                    */
                    $('#selectCA'+index).niceSelect();    
                }
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(settings){
            arrayCapacitadosD = []
            var placeholder = ["","Región","Comuna","","","","","","Lugar","Fecha"]
            this.api().columns([1,2,8,9]).every( function (index) {
                if(JSON.parse(localStorage.user).id_cargo == 1004 && index == 1){
                    return;
                }else{
                    var columnFiltered = this;
                    var selectFiltered = $("#selectCA"+index)
                    if(selectFiltered.val()===''){
                        selectFiltered.empty()
                        selectFiltered.append('<option value="">'+placeholder[index]+'</option>')
                        columnFiltered.column(index,{search:'applied'}).data().unique().each( function ( d, j ) {


                            /*if(d != null){
                                selectFiltered.append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )    
                            } */    

                            if(d != null){
                                if(index != 9){
                                    selectFiltered.append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )    
                                }else{
                                    selectFiltered.append( '<option value="'+moment(d).format('DD-MM-YYYY')+'">'+moment(d).format('DD-MM-YYYY')+'</option>' )    
                                    /*if(d.lugar != null){   
                                        arrayCapacitadosD.push(d.lugar+', '+moment(d.fecha_hora).format('DD-MM-YYYY  HH:mm'));                                    
                                    }*/
                                     
                                }
                            }  

                        } );
                    }
                }

               /* if(index == 7){
                    const unique = (value, index, self) => {
                        return self.indexOf(value) === index
                    }
                    capacitadosUnica = arrayCapacitadosD.filter(unique)
                    capacitadosUnica.forEach(function(item){                      
                        $('#selectCA'+index).append( '<option value="'+item+'">'+item+'</option>' )     
                    });
                }*/

                $('select').niceSelect('update');
            })
        }
 
 
    });
    $('#limpiar-filtros-capacitados').click(btnClearFilters);

    $('#total_registrosCapacitados').html(data.length)
    $("#descargar-lista-capacitados").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });
    $("#table-capacitados").show();  
 
}

function obtenerNota (){
    $('#labelRunCapacitado').html($(this).data('run'))
    $('#labelNombreCapacitado').html($(this).data('nombres'))
    id = $(this).data('id_persona')
    $.ajax({
        method:'POST',
        url: webservice+'/capacitacion/obtenerNota',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
                id_persona : id,
                id_capacitacion_persona: $(this).data('id_capacitacion_persona')
            },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)

            if (data.resultado != "error") {
                $('#inputNotaTecnica').val(data.puntaje)
                $('#inputNotaTecnica').data('id_capacitacion_prueba',data.id_capacitacion_prueba)
                $('#inputNotaTecnica').data('id_persona',id)
                $('#modalNotaCapacitado').modal({backdrop: 'static', keyboard: false},'show')
            } else {
                showFeedback("error","Error al guardar","Error");
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
 
function guardarNota(){
    if($('#inputNotaTecnica').val() >= 90){
        $.ajax({
            method:'POST',
            url: webservice+'/capacitacion/guardarNota',
            headers:{
               't': JSON.parse(localStorage.user).token
            },
            crossDomain: true,
            dataType:'text',
            data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
                id_persona: $('#inputNotaTecnica').data('id_persona'),
                id_capacitacion_prueba: $('#inputNotaTecnica').data('id_capacitacion_prueba'),
                puntaje: $('#inputNotaTecnica').val()
            },
            success: function(data, textStatus, jqXHR) {
                data = JSON.parse(data) 
                if (data.resultado == "ok") {
                    showFeedback("success", data.descripcion, "Guardado");
                    $('#modalNotaCapacitado').modal('hide')
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
    }else{
        showFeedback("error",'No puede agregar un Nota menor a 90',"Error");
    } 
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
    $('#select10').val("").niceSelect('update'); 
    $('#select12').val("").niceSelect('update'); 
    
    $('#selectC1').val("").niceSelect('update'); 
    $('#selectC2').val("").niceSelect('update'); 
    $('#selectC3').val("").niceSelect('update'); 
    $('#selectC4').val("").niceSelect('update'); 
    $('#selectC6').val("").niceSelect('update'); 

    $('#selectRE1').val("").niceSelect('update'); 
    $('#selectRE2').val("").niceSelect('update'); 

    $('#selectCR1').val("").niceSelect('update'); 
    $('#selectCR2').val("").niceSelect('update');
    $('#selectCR3').val("").niceSelect('update'); 

    $('#selectCA1').val("").niceSelect('update'); 
    $('#selectCA2').val("").niceSelect('update'); 
    $('#selectCA7').val("").niceSelect('update'); 
    $('#selectCA8').val("").niceSelect('update'); 
 
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

    var table = $('#table-capacitados').DataTable();
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
    $('#inputAsistentesR').val(data.asistentes)
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
        $.blockUI({  
            baseZ: 3000,
            message: '<img style="width: 10%;" src="images/loading.gif" />',
            css: {
                border:     'none',
                backgroundColor:'transparent',        
            } 
        }); 

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
                    asistentes: $('#inputAsistentesR').val(),
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
                    localStorage.c_region = $('#selectC1').val()
                    localStorage.c_comuna = $('#selectC2').val()
                    localStorage.c_lugar = $('#selectC3').val()
                    localStorage.c_fecha = $('#selectC4').val()                     
                    localStorage.c_relator = $('#selectC6').val()

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

function desertar(){
    Swal.fire({
      title: '¿Está seguro que '+$(this).data('nombre')+' desea desertar?',
      text: "Una vez que confirme no se podra modificar.",
      type: 'warning',
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
        if (result.value) {
            guardaDeserta($(this).data('id_persona'))
        }
    })
    function guardaDeserta(id){
        if($(this).data('convocados') == null){
            $.ajax({
                method:'POST',
                url: webservice+'/capacitacion/desertar',
                headers:{
                   't': JSON.parse(localStorage.user).token
                },
                crossDomain: true,
                dataType:'text',
                data :{ 
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    id_persona: id
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

function asignar(){

    $('#guardar_asignacion').css('display','none')
    $('#eliminar_asignacion').css('display','')
    
    $('#guardar_asignacion').prop('disabled',false)
    localStorage.capacitacion_tipo = 1;

    $('#div-individual').css('display','')
    $('#div-varios').css('display','none')
    $('#div-selectCapacitacion').css('display','')
    
    localStorage.id_capacitacion = $(this).data('id_capacitacion') 
    localStorage.borrado_capacitacion = $(this).data('borrado_capacitacion') 
    localStorage.comuna = $(this).data('id_comuna') 
    localStorage.region = $(this).data('id_region') 
    localStorage.id_persona = $(this).data('id_persona') 

    $('#info_cap').css('display','none')
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
            console.log('aca '+localStorage.id_capacitacion)
            $('#selectCapacitacion').val(localStorage.id_capacitacion)
        }else{
            $('#selectCapacitacion').val(-1)
        }
        $('#selectCapacitacion').prop('disabled',true)
    }else{
        $('#selectCapacitacion').append('<option value="-1" selected="">Sin Capacitaciones...</option>') 
    }

    $('#asignarCapacitacion').modal({backdrop: 'static', keyboard: false},'show')   
        
}
entro = 0
function asignarVarios(){
    $('#eliminar_asignacion').css('display','none')
    $('#guardar_asignacion').css('display','').prop('disabled',false)
    localStorage.capacitacion_tipo = 2;

    $('#div-individual').css('display','none')
    $('#div-varios').css('display','')
    $('#info_cap').css('display','')

    localStorage.id_capacitacion = $(this).data('id_capacitacion') 
    localStorage.borrado_capacitacion = $(this).data('borrado_capacitacion') 
    localStorage.comuna = $(this).data('id_comuna')     
    localStorage.region = $(this).data('id_region') 
    localStorage.fecha_hora = $(this).data('fecha_hora') 

    $('#labelRegionCapacitacion').html($(this).data('region'))
    $('#labelComunaCapacitacion').html($(this).data('comuna'))
    $('#labelRelator').html($(this).data('relator'))
    $('#labelCapacidad').html($(this).data('capacidad'))
    $('#labelLugar').html($(this).data('lugar'))    
    $('#labelHora').html(moment($(this).data('fecha_hora')).format('HH:mm'))
    $('#labelFecha').html(moment($(this).data('fecha_hora')).format('DD-MM-YYYY'))

    if(moment(moment().format('YYYY-MM-DD, HH:mm:ss')).isAfter($(this).data('fecha_hora'))){
        $('#agregar-persona').css('display','')
        $('#div-filtro').removeClass('col-12').addClass('col-6')
       
    }else{
        $('#agregar-persona').css('display','none')
        $('#div-filtro').removeClass('col-6').addClass('col-12')
    }

    $('#selectCapacitacionAll').html('')

    id =  $(this).data('id_region') 

    if(capacitaciones[id] != undefined){
        $('#selectCapacitacionAll').append('<option value="-1" selected="">Elegir...</option>') 
        for(h = 0; h < capacitaciones[id].length; h++){
            $('#selectCapacitacionAll').append('<option value="'+capacitaciones[id][h].id_capacitacion+'">'+moment(capacitaciones[id][h].fecha_hora).format('DD-MM-YYYY - HH:mm')+', '+capacitaciones[id][h].lugar+'</option>') 
        }
        $('#selectCapacitacionAll').val(localStorage.id_capacitacion)
        
        if(entro == 0){
            verPersonal()
            entro++;
        }
    }else{
        $('#selectCapacitacionAll').append('<option value="-1" selected="">Sin Capacitaciones...</option>') 
    }


    $('#div-selectCapacitacion').css('display','none')

    $('#asignarCapacitacion').modal({backdrop: 'static', keyboard: false},'show')   
        
}

function notificarVarios(){
    // $('#eliminar_asignacion').css('display','none')
    $('#guardar_asignacion_correo').css('display','').prop('disabled',false)
    localStorage.capacitacion_tipo = 2;

    $('#div-individual').css('display','none')
    $('#div-varios').css('display','')
    $('#info_cap').css('display','')

    localStorage.id_capacitacion = $(this).data('id_capacitacion') 
    localStorage.borrado_capacitacion = $(this).data('borrado_capacitacion') 
    localStorage.comuna = $(this).data('id_comuna')     
    localStorage.region = $(this).data('id_region') 
    localStorage.fecha_hora = $(this).data('fecha_hora') 

    $('#labelRegionCapacitacionCorreo').html($(this).data('region'))
    $('#labelComunaCapacitacionCorreo').html($(this).data('comuna'))
    $('#labelRelatorCorreo').html($(this).data('relator'))
    $('#labelCapacidadCorreo').html($(this).data('capacidad'))
    $('#labelLugarCorreo').html($(this).data('lugar'))    
    $('#labelHoraCorreo').html(moment($(this).data('fecha_hora')).format('HH:mm'))
    $('#labelFechaCorreo').html(moment($(this).data('fecha_hora')).format('DD-MM-YYYY'))

    id =  $(this).data('id_region') 

    if(capacitaciones[id] != undefined){
        $('#selectCapacitacionAll').append('<option value="-1" selected="">Elegir...</option>') 
        for(h = 0; h < capacitaciones[id].length; h++){
            $('#selectCapacitacionAll').append('<option value="'+capacitaciones[id][h].id_capacitacion+'">'+moment(capacitaciones[id][h].fecha_hora).format('DD-MM-YYYY - HH:mm')+', '+capacitaciones[id][h].lugar+'</option>') 
        }
        $('#selectCapacitacionAll').val(localStorage.id_capacitacion)
        
        if(entro == 0){
            verPersonalConvocado()
            entro++;
        }
    }else{
        $('#selectCapacitacionAll').append('<option value="-1" selected="">Sin Capacitaciones...</option>') 
    }


    $('#div-selectCapacitacion').css('display','none')

    // $('#asignarCapacitacion').modal({backdrop: 'static', keyboard: false},'show')   
        
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
                entro = 0
                if (data.resultado == undefined) {
                    cargarPersonal((data.personal_capacitacion))
                }else {
                    showFeedback("error",data.resultado,"Error");
                    console.log("invalidos");
                    $.unblockUI();
                }
                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                entro = 0
                showFeedback("error","Error en el servidor","Datos incorrectos");
                console.log("error del servidor, datos incorrectos");
                $.unblockUI();
            }
        })
    }
        
}

function verPersonalConvocado(){
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
            url: webservice+'/capacitacion/obtenerPersonalConvocado',
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
                entro = 0
                if (data.resultado != 'error') {
                    console.log("No error");
                    cargarPersonalCorreo((data.personal_capacitacion))
                    $('#notificarCapacitacion').modal({backdrop: 'static', keyboard: false},'show')   
                }else {
                    showFeedback("error",data.descripcion,"Error");
                    console.log("invalidos");
                    $.unblockUI();
                }
                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                entro = 0
                showFeedback("error","Error en el servidor","Datos incorrectos");
                $.unblockUI();
            }
        })
    }
        
}

function cargarPersonal(data){
   // $('#div_personas').html('');
    console.log(data)
        $('#filtros-personasVarias').empty();

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
            {data: "telefono"},
            {data: "confirma_asistencia", className: 'text-center',
                render: function(data, type,row){
                    if(data == 0){
                        return 'Sin Información'
                    }else if(data == 1){
                        return 'SI'
                    }else{
                        return 'NO'
                    }
                }
            },
            {data: "veces_reprobada", className: 'text-center',
                render: function(data, type,row){
                    if(data == null){
                        return 0
                    
                    }else{
                        return data
                    }
                }
            },
            {data: "link_confirmacion",
                render: function(data, type,row){
                    if(data == null){
                        return ''
                    
                    }else{
                        return '<a href="'+data+'" target="_blank">Confirmación</a>'
                    }
                }
            },
        ],
        "rowCallback": function( row, data ) {

            if(moment(moment().format('YYYY-MM-DD, HH:mm:ss')).isAfter(localStorage.fecha_hora)){
                disabled = "disabled"
            }else{
                disabled = data.id_capacitacion != null ?  "disabled" : ""
            }

            check = data.id_capacitacion != null ?  "checked" : "" 
            
            $('td:eq(0)', row).html('<input type="checkbox" id="check-persona-'+data.id_persona+'" name="checkPersonalCapacitacion" value="'+data.id_persona+'" '+
                                    ''+check+' '+disabled+'>');


        },
        "initComplete": function(settings, json) {
             
            var placeholder = ["","Región","Comuna","","","","","","Confirma Asistencia"]
            this.api().columns([1,2,8]).every( function (index) {
                if(JSON.parse(localStorage.user).id_cargo == 1004 && index == 1){
                    return;
                }else{
                    var column = this;
                    var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectPV'+index+'" >'+
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
                        if(index == 8){
                            confirma = (d == 0 ? 'Sin Información' : d == 1 ? 'Si' : 'No')
                            $('#selectPV'+index).append( '<option value="'+confirma+'">'+confirma+'</option>' )     
                        }else if(d != null){
                            $('#selectPV'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                        }
                        
                    } );
                    $('#selectPV'+index).niceSelect();    
                }
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(settings){
 
            var placeholder = ["","Región","Comuna","","","","","","Confirma Asistencia"]
            this.api().columns([1,2,8]).every( function (index) {
                if(JSON.parse(localStorage.user).id_cargo == 1004 && index == 1){
                    return;
                }else{
                    var columnFiltered = this;
                    var selectFiltered = $("#selectPV"+index)
                    if(selectFiltered.val()===''){
                        selectFiltered.empty()
                        selectFiltered.append('<option value="">'+placeholder[index]+'</option>')
                        columnFiltered.column(index,{search:'applied'}).data().unique().each( function ( d, j ) {
                            /*if(d != null){
                                selectFiltered.append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )    
                            } */
                            if(index == 8){
                                console.log(d)
                                confirma = (d == 0 ? 'Sin Información' : d == 1 ? 'Si' : 'No')
                                selectFiltered.append( '<option value="'+confirma+'">'+confirma+'</option>' )            
                            }else if(d != null){
                                console.log(d)
                                console.log(index)
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
    $('#limpiar-filtros-personasVarias').click(btnClearFiltersModal);
    $.unblockUI();                                 
    
}

function cargarPersonalCorreo(data){
    // $('#div_personas').html('');
     console.log(data)
         $('#filtros-personasVarias-correo').empty();
 
     if($.fn.dataTable.isDataTable('#table-personasVarias-correo')){
         $('#table-personasVarias-correo').DataTable().destroy();
         $('#lista-personasVarias-correo').empty();
     }
 
     var tablaD = $("#table-personasVarias-correo").DataTable({
         dom: "",
 
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
             {data: "confirma_asistencia", className: 'text-center',
                 render: function(data, type,row){
                     if(data == 0){
                         return 'Sin Información'
                     }else if(data == 1){
                         return 'SI'
                     }else{
                         return 'NO'
                     }
                 }
             },
             {data: "veces_reprobada", className: 'text-center',
                 render: function(data, type,row){
                     if(data == null){
                         return 0
                     
                     }else{
                         return data
                     }
                 }
             },
         ],
         "rowCallback": function( row, data ) {
 
             if(moment(moment().format('YYYY-MM-DD, HH:mm:ss')).isAfter(localStorage.fecha_hora)){
                 disabled = "disabled"
             }else{
                 disabled = data.id_capacitacion != null ?  "disabled" : ""
             }
 
            //  check = data.id_capacitacion != null ?  "checked" : "" 
             
             $('td:eq(0)', row).html('<input type="checkbox" id="check-persona-'+data.id_persona+'" name="checkPersonalCorreoCapacitacion" value="'+data.id_persona+'">');
         },
         "initComplete": function(settings, json) {
              
             var placeholder = ["","Región","Comuna","","","","","Confirma Asistencia"]
             this.api().columns([1,2,7]).every( function (index) {
                 if(JSON.parse(localStorage.user).id_cargo == 1004 && index == 1){
                     return;
                 }else{
                     var column = this;
                     var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectPV'+index+'" >'+
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
                         if(index == 7){
                             confirma = (d == 0 ? 'Sin Información' : d == 1 ? 'Si' : 'No')
                             $('#selectPV'+index).append( '<option value="'+confirma+'">'+confirma+'</option>' )     
                         }else if(d != null){
                             $('#selectPV'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                         }
                         
                     } );
                     $('#selectPV'+index).niceSelect();    
                 }
             })   
 
             $('.dataTables_length select').addClass('nice-select small');         
         },
         "drawCallback": function(settings){
  
             var placeholder = ["","Región","Comuna","","","","","Confirma Asistencia"]
             this.api().columns([1,2,7]).every( function (index) {
                 if(JSON.parse(localStorage.user).id_cargo == 1004 && index == 1){
                     return;
                 }else{
                     var columnFiltered = this;
                     var selectFiltered = $("#selectPV"+index)
                     if(selectFiltered.val()===''){
                         selectFiltered.empty()
                         selectFiltered.append('<option value="">'+placeholder[index]+'</option>')
                         columnFiltered.column(index,{search:'applied'}).data().unique().each( function ( d, j ) {
                             /*if(d != null){
                                 selectFiltered.append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )    
                             } */
                             if(index == 7){
                                 console.log(d)
                                 confirma = (d == 0 ? 'Sin Información' : d == 1 ? 'Si' : 'No')
                                 selectFiltered.append( '<option value="'+confirma+'">'+confirma+'</option>' )            
                             }else if(d != null){
                                 console.log(d)
                                 console.log(index)
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
     $('#limpiar-filtros-personasVarias').click(btnClearFiltersModal);
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
    if(capacitacionesAsignadas.length > 1){
        $.blockUI({
            message: '<h1>Espere por favor mientras se envian los correos.</h1>',
            baseZ: 2000
        });    
    }else if(capacitacionesAsignadas.length == 1){
        $.blockUI({
            message: '<h1>Espere por favor mientras se envia el correo.</h1>',
            baseZ: 2000
        });
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
                $.unblockUI();
                if(JSON.parse(localStorage.user).id_cargo == 1004){
                    getPersonalRegional();
                }else{
                    getPersonal();
                } 
            } else {
                showFeedback("error",data.descripcion,"Error");
                console.log("invalidos");
                $.unblockUI();
            }
            $('#guardar_asignacion').prop('disabled',false)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#guardar_asignacion').prop('disabled',false)
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
            $.unblockUI();
 
        }
    })
 
}

function notificarCapacitacion(){
    capacitacionesAsignadas = [];
    selectIdCapacitacion = 0;
    if(localStorage.capacitacion_tipo == 1){
        check = $('#selectCapacitacion').val() == -1 ? 0 : 1
        capacitacionesAsignadas.push({id_persona:localStorage.id_persona, asignar: check})
        selectIdCapacitacion = $('#selectCapacitacion').val();

    }else if(localStorage.capacitacion_tipo == 2){
        var checkbox = $('input:checkbox[name=checkPersonalCorreoCapacitacion]')
        for (var i = 0; i < checkbox.length; i++) {
            check = checkbox[i].checked == true ? 1 : 0
            capacitacionesAsignadas.push({id_persona: checkbox[i].value, asignar: check})  
        }

        selectIdCapacitacion = $('#selectCapacitacionAll').val();
    }
    if(capacitacionesAsignadas.length > 1){
        $.blockUI({
            message: '<h1>Espere por favor mientras se envian los correos.</h1>',
            baseZ: 2000
        });    
    }else if(capacitacionesAsignadas.length == 1){
        $.blockUI({
            message: '<h1>Espere por favor mientras se envia el correo.</h1>',
            baseZ: 2000
        });
    }

    var correoCopia = $('#inputCorreoCopia').val() != '' ? $('#inputCorreoCopia').val() : null;
    if(correoCopia != null && correoCopia != ''){
        var correo_bool = ValidateEmail(correoCopia)
        if(correo_bool == false){
            showFeedback("warning","","Correo inválido");
            $('#inputCorreoCopia').addClass('div_is-invalid')
            $('#guardar_asignacion_correo').prop('disabled',false)
            $.unblockUI();
            return
        }else{
            $('#inputCorreoCopia').removeClass('div_is-invalid')
            $('#guardar_asignacion_correo').prop('disabled',true)
        }
    }

    $.ajax({
        method:'POST',
        url: webservice+'/capacitacion/notificarCapacitacionPorCorreo',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
                id_capacitacion: selectIdCapacitacion,
                personal_capacitacion: capacitacionesAsignadas,
                correo_copia: correoCopia,
            },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)
            if (data.resultado != "error") {
                showFeedback("success", data.descripcion, "Guardado");
                $('#asignarCapacitacion').modal('hide');
                localStorage.id_capacitacion = 'null'
                $.unblockUI();
                // if(JSON.parse(localStorage.user).id_cargo == 1004){
                //     getPersonalRegional();
                // }else{
                //     getPersonal();
                // } 
            } else {
                showFeedback("error",data.descripcion,"Error");
                console.log("invalidos");
                $.unblockUI();
            }
            $('#guardar_asignacion').prop('disabled',false)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#guardar_asignacion').prop('disabled',false)
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
            $.unblockUI();
 
        }
    })
 
}
 
function desconvocar(){
    $('#eliminar_asignacion').prop('disabled',true)
    $.ajax({
        method:'POST',
        url: webservice+'/capacitacion/desconvocar',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
                id_capacitacion: $('#selectCapacitacion').val(),
                id_persona: localStorage.id_persona,
            },
        success: function(data, textStatus, jqXHR) {
            data = JSON.parse(data) 
            console.log(data)

            if (data.resultado != "error") {
                showFeedback("success", data.descripcion, "Guardado");
                $('#asignarCapacitacion').modal('hide');
                localStorage.id_capacitacion = 'null'
                $.unblockUI();
                localStorage.p_region = $('#selec1').val()
                localStorage.p_comuna = $('#selec2').val()
                localStorage.p_capacitacion = $('#selec8').val()
                localStorage.p_estado = $('#selec9').val()

                if(JSON.parse(localStorage.user).id_cargo == 1004){
                    getPersonalRegional();

                }else{
                    getPersonal();
                }

            } else {
                showFeedback("error",data.descripcion,"Error");
                console.log("invalidos");
                $.unblockUI();
            }
            $('#eliminar_asignacion').prop('disabled',false)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#guardar_asignacion').prop('disabled',false)
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
            $.unblockUI();
 
        }
    })  
}

function agregarNotas(){
    localStorage.id_capacitacion =  $(this).data('id_capacitacion');

    $('#labelRegionCapacitacionRelator').html($(this).data('region'))
    $('#labelRegionComunaCapacitacionRelator').html($(this).data('comuna'))
    $('#labelRegionLugarCapacitacionRelator').html($(this).data('lugar'))
    $('#labelFechaCapacitacionRelator').html($(this).data('fecha'))
    $('#labelHoraCapacitacionRelator').html($(this).data('hora'))

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
 
    if($.fn.dataTable.isDataTable('#table-evaluarPersonas')){
        $('#table-evaluarPersonas').DataTable().destroy();
        $('#body-evaluacion').empty();
    }

    for ( var i = 0; i < data.length; i++) {
  
        tr = '<tr id="tr-'+i+'">'+
                '<td>'+data[i].run+'</td>'+
                '<td>'+data[i].nombres+' '+data[i].apellido_paterno+' '+data[i].apellido_materno+'</td>'+

                '<td><select id="asistencia_'+i+'" class="form-control">'+
                    '<option value="-1">Seleccione...</option>'+
                    '<option value="true">Presente</option>'+
                    '<option value="false">Ausente</option>'+
                '</select></td>'+
                
                '<td><input class="form-control" value="'+(data[i].capacitacion_prueba == null ? 0 
                    : (data[i].capacitacion_prueba[1] == undefined ? 0 : data[i].capacitacion_prueba[1].puntaje))+'" oninput="this.value=porcentaje(this.value)"></input></td>'+

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

        $('#asistencia_'+i).on('change',function(){
            id = $(this).attr('id').replace('asistencia_','')
            if($(this).val() == 'false'){

                $('#tr-'+id).find('td:nth-child(4) input').prop('disabled',true)
                $('#tr-'+id).find('td:nth-child(5) select').prop('disabled',true)
                $('#tr-'+id).find('td:nth-child(6) select').val('-1')
                $('#tr-'+id).find('td:nth-child(6) select').prop('disabled',true)
 
            }else{
                $('#tr-'+id).find('td:nth-child(4) input').prop('disabled',false)
                $('#tr-'+id).find('td:nth-child(5) select').prop('disabled',false)
                $('#tr-'+id).find('td:nth-child(6) select').val('-1')
                $('#tr-'+id).find('td:nth-child(6) select').prop('disabled',false)  
            }
        })
        $('#asistencia_'+i).val(data[i].asistencia == null ? -1 : ''+data[i].asistencia+'')

        $('#psicologica_'+i).val(data[i].capacitacion_prueba == null ? -1 : ''+data[i].capacitacion_prueba[0].puntaje+'')
      
        $('#estado_'+i).val(data[i].estado == null ? -1 : ''+data[i].estado+'')

        if(data[i].asistencia == false){
            $('#tr-'+i).find('td:nth-child(4) input').prop('disabled',true)
            $('#tr-'+i).find('td:nth-child(5) select').prop('disabled',true)
            $('#tr-'+i).find('td:nth-child(6) select').val('-1')
            $('#tr-'+i).find('td:nth-child(6) select').prop('disabled',true)

        }
        if(data[i].estado == true){
            $('#tr-'+i).find('td:nth-child(3) select').prop('disabled',true)
            $('#tr-'+i).find('td:nth-child(4) input').prop('disabled',true)
            $('#tr-'+i).find('td:nth-child(5) select').prop('disabled',true)
            $('#tr-'+i).find('td:nth-child(6) select').prop('disabled',true)

        }

        $('#tr-'+i).data('id_persona',data[i].id_persona);
        $('#tr-'+i).data('id_persona_cargo',data[i].id_persona_cargo); 
        $('#tr-'+i).data('id_capacitacion_persona',data[i].id_capacitacion_persona); 
        $('#tr-'+i).data('id_capacitacion',data[i].id_capacitacion); 
         
    }

    var tablaD = $("#table-evaluarPersonas").DataTable({
        dom: "<'search'f><'top'i>",
        language:spanishTranslation,
        lengthChange: true,
        info: true,
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
    });
              

    $('#evaluarPostulante').modal({backdrop: 'static', keyboard: false},'show')   
}

function guardarEvaluacion(){
    cumple = true;
    evaluaciones = []
    $('#body-evaluacion tr').each(function() {
        var id_capacitacion  = $(this).data('id_capacitacion')
        var id_persona = $(this).data('id_persona')
        var id_capacitacion_persona = $(this).data('id_capacitacion_persona')
        var asistencia = $(this).find('td:nth-child(3) select').val() == "" ? 0 : $(this).find('td:nth-child(3) select').val()
        var puntaje_contenido = $(this).find('td:nth-child(4) input').val() == "" ? 0 : $(this).find('td:nth-child(4) input').val()
        var puntaje_psicologica = $(this).find('td:nth-child(5) select').val() == "" ? 0 : $(this).find('td:nth-child(5) select').val()
        var estado = $(this).find('td:nth-child(6) select').val() == "" ? 0 : $(this).find('td:nth-child(6) select').val()

      

        //VALIDAR QUE SI PUSO ALGUNA NOTA TIENE QUE LLENAR TODO
            if(puntaje_contenido > 0 || puntaje_psicologica != -1){
                if(asistencia  == -1){
                    $(this).find('td:nth-child(3) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(3) select').removeClass('is-invalid')
                }

                if(puntaje_contenido == 0 || puntaje_contenido.length == 0){
                    $(this).find('td:nth-child(4) input').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(4) input').removeClass('is-invalid')
                }

                if(puntaje_psicologica == -1){
                    $(this).find('td:nth-child(5) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(5) select').removeClass('is-invalid')
                }

                if(estado == -1){
                    $(this).find('td:nth-child(6) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(6) select').removeClass('is-invalid')
                }

            }
        //VALIDAR QUE SI ASISTE DEBE LLENAR TODA LA INFORMACION
            if(asistencia  == 'true' && (puntaje_contenido == 0 || puntaje_contenido.length == 0 || puntaje_psicologica == -1 || estado == -1)){
                if(puntaje_contenido == 0 || puntaje_contenido.length == 0){
                    $(this).find('td:nth-child(4) input').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(4) input').removeClass('is-invalid')
                }

                if(puntaje_psicologica == -1){
                    $(this).find('td:nth-child(5) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(5) select').removeClass('is-invalid')
                }

                if(estado == -1){
                    $(this).find('td:nth-child(6) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(6) select').removeClass('is-invalid')
                }
            }


        //VALIDAR QUE SI NO ASISTE NO PUEDE LLENAR CON INFORMACION LOS DEMAS DATOS
            if(asistencia  == 'false' && (puntaje_contenido > 0 || puntaje_psicologica != -1 || estado != -1)){
                if(puntaje_contenido > 0){
                    $(this).find('td:nth-child(4) input').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(4) input').removeClass('is-invalid')
                }

                if(puntaje_psicologica != -1){
                    $(this).find('td:nth-child(5) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(5) select').removeClass('is-invalid')
                }

                if(estado != -1){
                    $(this).find('td:nth-child(6) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(6) select').removeClass('is-invalid')
                }
            }

        // VALIDAR QUE APRUEBE CUANDO NO CUMPLE CON LAS CONDICIONES
            if(estado == 'true'){
                if(asistencia  != 'true'){
                    $(this).find('td:nth-child(3) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(3) select').removeClass('is-invalid')
                }

                if(puntaje_contenido < 90){
                    $(this).find('td:nth-child(4) input').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(4) input').removeClass('is-invalid')
                }
                //VALIDAR QUE NO APRUEBE CUANDO NO CUMPLIO LA PRUEBA PSICOLOGICA
                if(puntaje_psicologica == 0){
                    $(this).find('td:nth-child(5) select').addClass('is-invalid')
                    $(this).find('td:nth-child(6) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(5) select').removeClass('is-invalid')
                    $(this).find('td:nth-child(6) select').removeClass('is-invalid')
                }
            }

        // VALIDAR QUE RECHAZE CUANDO CUMPLE CON LAS CONDICIONES
            if(estado == 'false'){
                if(asistencia  == '-1'){
                    $(this).find('td:nth-child(3) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(3) select').removeClass('is-invalid')
                }

                if(puntaje_contenido > 89 && puntaje_psicologica == 1){
                    $(this).find('td:nth-child(4) input').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(4) input').removeClass('is-invalid')
                }

                if(puntaje_psicologica != 0 && puntaje_contenido > 89){
                    $(this).find('td:nth-child(5) select').addClass('is-invalid')
                    cumple = false
                }else{
                    $(this).find('td:nth-child(5) select').removeClass('is-invalid')
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

    
    $('#selectPV1').val("").niceSelect('update');
    $('#selectPV2').val("").niceSelect('update');  
    $('#selectPV7').val("").niceSelect('update'); 

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

    var table = $('#table-personasVarias').DataTable();
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
    $.blockUI({  
        baseZ: 3000,
        message: '<img style="width: 10%;" src="images/loading.gif" />',
        css: {
            border:     'none',
            backgroundColor:'transparent',        
        } 
    });
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
                localStorage.r_region = $('#selectRE1').val()
                localStorage.r_comuna = $('#selectRE2').val()

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

function ValidateEmail(mail) {
    var mailState=true
    var email = mail;
    var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!expr.test(email)) {
        return mailState=false
    }else{
        return mailState=true}
}


function searchRUNCapacitacion(){
    if($("#inputRunCapacitado").val().trim() == ""){
        showFeedback('error', 'Debe ingresar un RUN para realizar solicitud.', 'Error');
        return;
    }

    if($.validateRut($("#inputRunCapacitado").val().trim()) == false) {
        showFeedback('error', 'Debe ingresar un RUN válido.', 'Error');
        return;
    }

    var run = ($('#inputRunCapacitado').val().trim().toUpperCase()).replace(/\./g,'');
    $('#inputRunCapacitado').val($.formatRut(run))
    $.blockUI({
        message: '<h1>Espere por favor</h1>',
        baseZ: 2000
    });

    $.ajax({
        method: 'POST',
        url: webservice+'/capacitacion/obtenerPersonaCapacitacion',
        headers: {
            't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType: 'text',
        data: { 
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            id_capacitacion: localStorage.id_capacitacion,
            run: run,
        },
        success: function(data, textStatus, jqXHR) {
            var mensaje = JSON.parse(data);
            if(mensaje["resultado"] == 'ok'){
                console.log("correcto!")
                showFeedback("success", data.descripcion, "Guardado");
                verPersonal()
                $.unblockUI();
            }else{

                showFeedback("error", mensaje["descripcion"], "");
                $.unblockUI();
                console.log("error!")
                
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