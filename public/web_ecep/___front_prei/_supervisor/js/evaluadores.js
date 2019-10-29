$(document).ready(function(){
    ocultarLoading()
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    listar();
    $('#nav_evaluadores').addClass('active_menu');

    $('#agregar-evaluador').on('click', nuevoEvaluador);


    $('#agregarEvaluadores').on('hidden.bs.modal', function (e) {
		  $(this)
		    .find("input,textarea,select")
		       .val('')
		       .end()
		    .find("input[type=checkbox], input[type=radio]")
		       .prop("checked", "")
		       .end();
	});
});

function listar(){
	$.ajax({
            method: 'POST',
            "url": webservice + "/supervisor/gestion/evaluadores/lista",
            headers: {
                't': JSON.parse(localStorage.user).token,
            },
            crossDomain: true,
            dataType: 'text',
            data: {
        
                id_usuario: JSON.parse(localStorage.user).id_usuario,
            },
            success: function(data, textStatus, jqXHR) {
                if (data != "token invalido") {
                	creaLista(JSON.parse(data)); 
                                        
                } else {
                    console.log("invalidos");
                }
                // $.unblockUI();
                // ocultarLoading()
                // ocultarLoading()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                // ocultarLoading()
            }
 	});
}

function creaLista(data){
    $('#filtros-borrar').empty();
    $('#total_evaluadores').html(data.resumen.total_evaluadores)
    $('#total_editores').html(data.resumen.total_editores)

    

    if(data.lista.length != 0){

        if($.fn.dataTable.isDataTable('#table-banco-items')){

            $('#table-banco-items').DataTable().destroy();
            $('#lista_banco_items').empty();
        }
    }

    var tablaD = $("#table-banco-items").DataTable({

        // dom: 'flrtip',
        dom: '<"top row _info-dataTable"il> rt<"bottom"p><"clear">',
        buttons:[ {
                extend: 'excel',
                title: 'Evaluadores (Supervisor)',
                exportOptions: {
                modifier: {
                    page: 'current'
                }
            }
            } ],
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslatioCasos,
        lengthChange: true,
        info: true,
        data: data.lista,        
        paging: true,
       /* searching: false,*/
        columns:[

            {data: "nombre"},
            {data: "correo"},
            {data: "prueba"},
            {data: "asignados"},
            /*{data: "fechaTermino"},*/
            {data: "pendientes"},
            {data: "finalizados",
            	render: function (data, type, row) {
                    if(row.asignados == 0){
                        return '0%';
                    }else{
                        return (Math.round((data * 100) / row.asignados)+'%'); 
                    }
            		  
                }
            },
            {data: "aprobados"},
            {data: "rechazados"},
            /*{data: "estado"},*/

        ],
        columnDefs: [
            {   
                orderable: false, 
                targets: [7] 
                // targets: [8] 
            }
        ],
        "initComplete": function(settings, json) {

            var placeholder = ["Evaluador","","Prueba","","","","",""]
            //  var placeholder = ["","","Prueba","","","","","","Estado"]
            //  this.api().columns([2,8]).every( function (index) {
            this.api().columns([0,2]).every( function (index) {
                //console.log(index)
                var column = this;

                var select = $('<select class="form-control col-sm-2 btn-light _filtros-eval" data-width="auto" id="select'+index+'"><option value="">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-borrar'))
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
 
                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
                $('#select'+index+'').niceSelect();
            } )

            $('.dataTables_length select').addClass('nice-select small');  
        },
        "drawCallback": function(){
            var placeholder = ["Evaluador","","Prueba","","","","",""]
          
            this.api().columns([0,2]).every( function (index) {
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
        }
        //ordering:true, 


  });
    $('#limpiar-filtros').click(btnClearFilters);

    $("#descraga-lista-banco-items").on("click", function() {
    tablaD.button( '.buttons-excel' ).trigger();
});
 
  $("#table-banco-items").show();  
}	

function btnClearFilters(){
    $('#select0').val("").niceSelect('update');
    $('#select2').val("").niceSelect('update');

    var table = $('#table-banco-items').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

}

function nuevoEvaluador(){
    var asignaturas = [];
    $.each($("input[name='checkAsignaturas']:checked"), function(){
        asignaturas.push($(this).val());
    });

    //         for (var i = 0; i < asignaturas.length; i++) {
    //             console.log(asignaturas[i]);
                
    //         }
    // console.log(asignaturas);

    if ($('#nombre-evaluador').val()=='' || $('#apellido-evaluador').val() == '' || $('#contrasena-evaluador').val() == '' || $('#email-evaluador').val() == '' ) {
        alert("Ingrese datos en los campos")
    }else{


        $.blockUI({ message: '<h2>Guardando datos...</h2>' });
        $.ajax({
                method: 'POST',
                url: webservice + "/supervisor/gestion/evaluadores/crear",
                headers: {
                    't': JSON.parse(localStorage.user).token,
                },
                crossDomain: true,
                dataType: 'text',
                data: {
            
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    nombres: $('#nombre-evaluador').val() ,
                    apellidos: $('#apellido-evaluador').val(),
                    pass: $('#contrasena-evaluador').val() ,
                    mail: $('#email-evaluador').val(),
                    asignaturas : asignaturas



                },
                success: function(data, textStatus, jqXHR) {
                    if (data != "token invalido") {
                        showFeedback("success", "Éxito al crear el evaluador", "Finalizado");
                        listar()
                    
                                            
                    } else {
                        console.log("invalidos");
                    }
                    $.unblockUI();

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    showFeedback("error", "Error al crear el evaluador", "Error");
                    console.log(errorThrown);
                    ocultarLoading()
                   
                }
        });
    }

}





