$(document).ready(function(){

    loginvalid(localStorage.getItem('user'))
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectModulo);

    if(JSON.parse(localStorage.user).id_cargo == 1004){
        getPersonalCoordinador();

    }else if(JSON.parse(localStorage.user).id_cargo == 1003){
        getPersonalCoordinadorZonal();

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


function llenarVistaPersonal(data){

    data = JSON.parse(data)
    console.log(data)
    $('#filtros-postulacion').empty();
    if($.fn.dataTable.isDataTable('#table-postulacion')){
        $('#table-postulacion').DataTable().destroy();
        $('#lista-postulacion').empty();
    }

    var tablaD = $("#table-postulacion").DataTable({
        columnDefs: [
            {"className": "dt-center", "targets": [7,9]}
          ],
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
        "initComplete": function (settings, json) {
            var checkbox = $('input:checkbox[name=inputRolAsignado]')
            for (var i = 0; i < checkbox.length; i++) {
                checkbox[i].disabled = true;
            }
            $('#divRol').css('display', 'none')
            var placeholder = ["","Región","Comuna","","","","","Día","Sede","","Cargo"]
            this.api().columns([1,2,7,8,10]).every(function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="select' + index + '" >' +
                    '<option value="" selected="selected">' + placeholder[index] + '</option></select>')
                    .appendTo($('#filtros-postulacion'))
                    .on('change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );

                        column
                            .search(val ? '^' + val + '$' : '', true, false)
                            .draw();
                    });
                column.data().unique().each(function (d, j) {
                    if (d != null) {
                        $('#select' + index).append('<option value="' + d.charAt(0).toUpperCase() + d.slice(1) + '">' + d.charAt(0).toUpperCase() + d.slice(1) + '</option>')
                    }
                });
                $('#select' + index).niceSelect();
            })
            $('.dataTables_length select').addClass('nice-select small');
        },

        "drawCallback": function () {
            var placeholder = ["","Región","Comuna","","","","","Día","Sede","","Cargo"]
            this.api().columns([1,2,7,8,10]).every(function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#select" + index)
                if (selectFiltered.val() === '') {
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">' + placeholder[index] + '</option>')
                    columnFiltered.column(index, { search: 'applied' }).data().unique().each(function (d, j) {
                        if (d != null) {
                            selectFiltered.append('<option value="' + d.charAt(0).toUpperCase() + d.slice(1) + '">' + d.charAt(0).toUpperCase() + d.slice(1) + '</option>')
                        }
                    });
                }
                $('select').niceSelect('update');
            })
        }
        
        
    });

    $('#limpiar-filtros-postulacion').click(btnClearFilters);
    $("#descargar-lista-postulacion").on("click", function() {
        window.location='https://ecep2019.iie.cl/public/api/web/asignacion/descargar-excel'
    });
    $('#total').html(data.personal_postulacion.length);  
    $("#table-postulacion").show();
    $('#total_asignados').html(data.total_asignados.length);
    $('#total_requeridos').html(data.total_requeridos[0].total_requeridos);
    
    


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
    $('#selectP1').val("").niceSelect('update');
    $('#selectP2').val("").niceSelect('update'); 
    $('#selectP7').val("").niceSelect('update'); 
    $('#selectP8').val("").niceSelect('update'); 
    $('#selectP10').val("").niceSelect('update');

    var table = $('#table-postulacion').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

}
