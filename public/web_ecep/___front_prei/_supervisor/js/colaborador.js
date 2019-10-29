$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    listar()
    $('#nav_colaborador').addClass('active_menu');

    $('#guardar-colaborador').on('click', nuevoColaborador);

    $('#agregarColaborador').on('hidden.bs.modal', function (e) {
          $(this)
            .find("input,textarea,select")
               .val('')
               .end()
            .find("input[type=checkbox], input[type=radio]")
               .prop("checked", "")
               .end();
    });



  //     $("#newModalForm").validate({
  //   rules: {
  //     pName: {
  //       required: true,
  //       minlength: 8
  //     },
  //     action: "required"
  //   },
  //   messages: {
  //     pName: {
  //       required: "Please enter some data",
  //       minlength: "Your data must be at least 8 characters"
  //     },
  //     action: "Please provide some data"
  //   }
  // });


});


 

function listar(){
	$.ajax({
            method: 'POST',
            "url": webservice + "/supervisor/carga/colaboradores/lista",
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
                    // console.log(data);
                	creaLista(JSON.parse(data)); 
                                        
                } else {
                    console.log("invalidos");
                }
                $.unblockUI();
                ocultarLoading()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                ocultarLoading()
            }
 	});
}

function creaLista(data){
    console.log(data);
    $('#total_evaluadores').html(data.length)
    /* $('#total_editores').html(data.resumen.total_editores)*/

    if(data.length != 0){

        if($.fn.dataTable.isDataTable('#table-colaboradores')){

            $('#table-colaboradores').DataTable().destroy();
            $('#lista_colaboradores').empty();
        }
    }

    var tablaD = $("#table-colaboradores").DataTable({

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
        info: false,
        data: data,        
        paging: false,
       /* searching: false,*/
        columns:[

            {data: "nombre"},
            {data: "correo"},
            {data: "asignatura"},
            {data: "asignados"},
            {data: "finalizado"},
            // {data: "pendientes"},
            {data: "en_proceso"},
            {data: "finalizado",
                render: function (data, type, row) {
                    return (data == 0 ? '0%' : Math.round((data * 100) / row.asignados)+'%');   
                }
            },
            /*{data: "estado"},*/

        ],
   /*     columnDefs: [
            {   
                orderable: false, 
                targets: [6] 
            }
        ],*/
        "initComplete": function(settings, json) {
            $('.dataTables_length select').addClass('nice-select small'); 
            /*var placeholder = ["","","Prueba","","","","",""]*/
            //  var placeholder = ["","","Prueba","","","","","","Estado"]
            //  this.api().columns([2,8]).every( function (index) {
           /* this.api().columns([2]).every( function (index) {
                //console.log(index)
                var column = this;
                var select = $('<select class="form-control col-sm-2 btn-light _filtros-eval" data-width="auto" id="select'+index+'"><option value="">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#evaluadoresTable_filters'))
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
            } )*/
        },
     /*   "drawCallback": function(){
            var placeholder = ["","","Prueba","","","","",""]
            this.api().columns([2]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#select"+index)
                if(selectFiltered.val()===''){
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">Seleccione '+placeholder[index]+'</option>')
                    columnFiltered.column(index,{search:'applied'}).data().unique().sort().each( function ( d, j ) {
                        selectFiltered.append( '<option value="'+d+'">'+d+'</option>' )
                    } );
                }
                $('select').niceSelect('update');
            })
        }*/
        //ordering:true, 


  });
    $("#descraga-lista-banco-items").on("click", function() {
    tablaD.button( '.buttons-excel' ).trigger();
});
 
  $("#table-banco-items").show();  

}	

function nuevoColaborador(){
    var asignaturas = [];
    $.each($("input[name='checkAsignaturas']:checked"), function(){
        asignaturas.push($(this).val());
    });

    //         for (var i = 0; i < asignaturas.length; i++) {
    //             console.log(asignaturas[i]);
                
    //         }
    // console.log(asignaturas);

    if ($('#nombre-colaborador').val()=='' || $('#apellido-colaborador').val() == '' || $('#contrasena-colaborador').val() == '' || $('#email-colaborador').val() == '' ) {
        alert("Ingrese datos en los campos")
    }else{


        $.blockUI({ message: '<h2>Guardando datos...</h2>' });
        $.ajax({
                method: 'POST',
                url: webservice + "/supervisor/carga/colaboradores/crear",
                headers: {
                    't': JSON.parse(localStorage.user).token,
                },
                crossDomain: true,
                dataType: 'text',
                data: {
            
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    nombres: $('#nombre-colaborador').val() ,
                    apellidos: $('#apellido-colaborador').val(),
                    pass: $('#contrasena-colaborador').val() ,
                    mail: $('#email-colaborador').val(),
                    asignaturas : asignaturas



                },
                success: function(data, textStatus, jqXHR) {
                    if (data != "token invalido") {
                        showFeedback("success", "Éxito al crear el colaborador", "Finalizado");
                        console.log(data);
                        listar()
                                            
                    } else {
                        console.log("invalidos");
                    }
                    $.unblockUI();

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(data);
                    showFeedback("error", "Error al crear el colaborador", "Error");
                    console.log(errorThrown);
                    ocultarLoading()
                }
        });
    }

}