$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectModulo);
    
 /*    $('#guardar_asignacion').on('click',guardar) */
    if(JSON.parse(localStorage.user).id_cargo == 1004){
        //getPersonalCoordinador();

/*         $('#liZonal').remove();
        $('#liRegion').remove();
        $('#liCentro').remove();
        $('#tabZonal').remove();
        $('#tabRegional').remove();
        $('#tabCentro').remove();
        $('#btn-zonas').remove();
        $('#btn-zonas-nuevaPersona').remove();
        $('#btn-zonasRegion').remove();
        $('#btn-region-nuevaPersona').remove(); */

    }else if(JSON.parse(localStorage.user).id_cargo == 1003){
        //getPersonalCoordinadorZonal();
/*         $('#liZonal').remove();
        $('#liCentro').remove();
        $('#tabZonal').remove();
        $('#tabCentro').remove();
        $('#btn-zonas').remove();
        $('#btn-zonas-nuevaPersona').remove(); */
    }else{
        getPersonal();
    }
});
$('<div class="offset-sm-10 col-2 text-right"><button class="btn btn-primary datatable-excel" role="button" id="descargar-lista" type="button"><i class="fas fa-download"></i> Descargar Lista</button></div>')
    .appendTo($('#table-postulacion_wrapper'));
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
            llenarVistaPersonal(data)
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
        url: webservice+'/asignacion/listaCoordinadorZonal',
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
            llenarVistaPersonal(data)
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
            llenarVistaPersonal(data)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
        }
    })
}

/* anfitrion = 0;
examinador = 0;
eApoyo = 0;
supervisor = 0;
sedes = '';
salas = ''; */

function llenarVistaPersonal(data){

    data = JSON.parse(data)
    console.log(data)
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
            {data: "region"},
            {data: "comuna"},
            {data: "run"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},
            {data: "dia"},
            {data: "sede"},
            {data: "id_sede_ecep"},
            {data: "cargo"},
        ],
        "initComplete": function(settings, json) {
            var placeholder = ["","Región","Comuna","","","","","Día","Sede","","Cargo"]
            this.api().columns([1,2,7,8,10]).every( function (index) {
                // console.log(index)
                var column = this;
                var select = $('<select class="form-control col-sm-2 btn-light _filtros _filtro'+index+' small"  id="selectR1'+index+'" onchange="exportarItems()" ><option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#postulacion-Table_filters'))
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } ).insertBefore( '#clear-filtros' );
                column.data().unique().sort().each( function ( d, j ) {
                    if (d != null) {
                        select.append( '<option value="'+d+'">'+d+'</option>' ) 
                    }                          
                } );             
                $('#selectR1'+index+'').niceSelect();
            })  
            $('.dataTables_length select').addClass('nice-select small');  
        },
        "drawCallback": function(){
            var placeholder = ["","Región","Comuna","","","","","Día","Sede","","Cargo"]
            this.api().columns([1,2,7,8,10]).every(function(index){
                var columnFiltered = this;
                var selectFiltered = $("#selectR1"+index)
                if(selectFiltered.val()===''){
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">'+placeholder[index]+'</option>')
                    columnFiltered.column(index,{search:'applied'}).data().unique().sort().each( function ( d, j ) {
                        if (d != null) {
                            selectFiltered.append( '<option value="'+d+'">'+d+'</option>' )
                        }
                    } );
                }
                $('selectR1').niceSelect('update');
            })
        }
/*         "rowCallback": function( row, data ) {
            if(data.id_cargo == 1006){
                anfitrion++; 
            }else if(data.id_cargo == 8){
                examinador++;
            }else if(data.id_cargo == 1007){
                eApoyo++;
            }else if(data.id_cargo == 9){
                supervisor++;
            }
        }, */
    });

    $('#limpiar-filtros-postulacion').click(btnClearFilters);
    /*$("#descargar-lista").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });*/
    $('#total').html(data.personal_postulacion.length)  
    $("#table-postulacion").show();
    $('#total_asignados').html(data.total_asignados - 1);
    console.log(data.total_asignados);
    
    

 /*    sedes = data.sedes;
    salas = data.salas; */
}

/* function asignar(persona, comuna){
    localStorage.id_persona_cargo = persona;
    $('#inputSede').html('').append('<option value="-1" selected="">Elegir...</option>') 
    if(sedes[comuna] != undefined){
        for(i = 0; i < sedes[comuna].sedes.length; i++){
            $('#inputSede').append('<option value="'+sedes[comuna].sedes[i].id_sede+'">'+sedes[comuna].sedes[i].nombre_sede+'</option>')   
        }
    }
    
    $('#asignacionModal').modal({backdrop: 'static', keyboard: false},'show')
} */

/* function cargarSalas(val){
    console.log(val)
    $('#inputSala').html('').append('<option value="-1" selected="">Elegir...</option>') 
    if(salas[val] != undefined){
        for(i = 0; i < salas[val].length; i++){
            $('#inputSala').append('<option value="'+salas[val][i].id_sala+'">'+salas[val][i].nro_sala+'</option>')   
        }
        $('#inputSala').prop('disabled',false)
    }
 
} */

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
    $('#select7').val("").niceSelect('update'); 
    $('#select8').val("").niceSelect('update'); 
    $('#select10').val("").niceSelect('update');

    var table = $('#table-postulacion').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

}
