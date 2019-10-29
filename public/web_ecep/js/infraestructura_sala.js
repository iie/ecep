$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectInfraestructura);
    $('#guardar_sala').click(guardarSala);
    getSala()
});

function getSala(){

    $.ajax({
        method:'POST',
        url: webservice+'/sala/lista',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data:{ 
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            id_sede : localStorage.id_sede

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

function llenarVista(data){
    data = JSON.parse(data)

    $('#filtros').empty();
    if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-sala')){
            $('#table-sala').DataTable().destroy();
            $('#sala').empty();
        }
    }

    var tablaD = $("#table-sala").DataTable({
        dom: '<"top row _info-dataTable"il> rt<"bottom"p><"clear">',
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
        data: data,
        responsive: true, 
        columns:[
            {data: "nro_sala"},
            {data: "serie_desde"},
            {data: "serie_hasta"},
            {data: "cantidad"},
            {data: "codigo_caja"},
            {data: "codigo_sobre"},
            {data: "contingencia",
                render: function(data, type, row){
                    if(data == true){
                        return 'SI'
                    }else{
                        return 'NO'
                    }
                }
            }, 
            {data: "dispositivo"},
            {data: "aplicador"},
            /*{data: "opciones",
                render: function(data, type, row){
                    return '<button type="button" id="sala_'+row.id_sala+'" onclick="modificar('+row.id_sala+')" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button'        
                }
            } */
        ],
       /* "initComplete": function(settings, json) {
            var placeholder = ["","","Comuna"]
            this.api().columns([2]).every( function (index) {
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
 
                column.data().unique().sort().each( function ( d, j ) {
                    $('#select'+index).append( '<option value="'+d+'">'+d+'</option>' )
                } );
                 $('#select'+index).niceSelect();        
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(){
            var placeholder = ["","","Comuna"]
            this.api().columns([2]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#select"+index)
                if(selectFiltered.val()===''){
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">'+placeholder[index]+'</option>')
                    columnFiltered.column(index,{search:'applied'}).data().unique().sort().each( function ( d, j ) {
                        selectFiltered.append( '<option value="'+d+'">'+d+'</option>' )
                    } );
                }
                $('select').niceSelect('update');
            })
        }*/
  });

    $("#descargar-lista").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });

    $('#limpiar-filtros').click(btnClearFilters);
    $('#lista_items').on('click','._btn-item',redireccionarSede);
    $('#total-salas').html(data.length);
    $("#table-sala").show(); 

}

function nuevaSala(){
    localStorage.id_sala = -1;
    limpiar()
    $('#nuevaSalaModal').modal({backdrop: 'static', keyboard: false},'show')
}

function limpiar(){

    var input = document.getElementsByTagName("input"); 
    for (var i = 0; i < input.length; i++) {
        input[i].value = '';
    }
    $('#contingencia_no').prop('checked',true)
    $('#inputDispositivo').val('-1')

}

function btnClearFilters(){
    $('#select2').val("").niceSelect('update');

    var table = $('#table-sala').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

}

function redireccionarSede(id){
    localStorage.id_sede = id;
    redirectInfraestructuraSala()
}

function guardarSala(){
    if(validar() == true){
        $.ajax({
            method:'POST',
            url: webservice+'/sala/guardar',
            headers:{
               't': JSON.parse(localStorage.user).token
            },
            crossDomain: true,
            dataType:'text',
            data :{ 
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    id_sede: localStorage.id_sede,
                    id_sala: localStorage.id_sala,
                    serieDesde: $('#inputSerieDesde').val(),
                    serieHasta: $('#inputSerieHasta').val(),
                    cantidad: $('#inputCantidad').val(),
                    codCaja: $('#inputCodCaja').val(),
                    codSobre: $('#inputCodSobre').val(),
                    dispositivo: $('#inputDispositivo').val(),
                    contingencia: $('input:radio[name="contingencia"]').prop('checked') == null ? false : $('input:radio[name="contingencia"]').prop('checked'),
                    aplicador: $('#inputAplicador').val()
                },
            success: function(data, textStatus, jqXHR) {
                data = JSON.parse(data) 
                console.log(data)

                if (data.resultado != "error") {
                    showFeedback("success", data.descripcion, "Guardado");
                    $('#nuevaSalaModal').modal('hide');
                    getSala()
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
        url: webservice+'/sala/modificar',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data :{ 
                id_usuario: JSON.parse(localStorage.user).id_usuario,
                id_sala : id
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
    localStorage.id_sala = data.id_sala;
    limpiar()
    $('#inputSerieDesde').val(data.serie_desde)
    $('#inputSerieHasta').val(data.serie_hasta)
    $('#inputCantidad').val(data.cantidad)
    $('#inputCodCaja').val(data.codigo_caja)
    $('#inputCodSobre').val(data.codigo_sobre)
    $('#inputDispositivo').val(data.dispositivo)
    data.contingencia == true ? $('#contingencia_si').prop('checked',true) : $('#contingencia_no').prop('checked',true)
    $('#inputAplicador').val(data.aplicador)

    $('#nuevaSalaModal').modal({backdrop: 'static', keyboard: false},'show')
}

function validar(){
    var input = document.getElementsByTagName("input");
    valida = true
    for (var i = 0; i < input.length; i++) {
        if(input[i].value.length < 1 && input[i].type != 'radio'){
            valida = false
            $(input[i]).addClass('is-invalid')
        }else{
            $(input[i]).removeClass('is-invalid')
        }
    }

    if($('#inputDispositivo').val() == -1){
        $('#inputDispositivo').addClass('is-invalid')
        valida = false
    }else{
        $('#inputDispositivo').removeClass('is-invalid')
    }

    return valida;
}