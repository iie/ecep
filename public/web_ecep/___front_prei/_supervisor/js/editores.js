$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    listar()
    $('#nav_editores').addClass('active_menu');

    $('#agregarEditores').on('hidden.bs.modal', function (e) {
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
            "url": webservice + "/supervisor/evaluadores/lista",
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
                $.unblockUI();
                ocultarLoading()
                ocultarLoading()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                ocultarLoading()
            }
 	});
}

function creaLista(data){
    $('#total_evaluadores').html(data.resumen.total_evaluadores)
    $('#total_editores').html(data.resumen.total_editores)

    if(data.lista.length != 0){

        if($.fn.dataTable.isDataTable('#table-banco-items')){

            $('#table-banco-items').DataTable().destroy();
            $('#lista_banco_items').empty();
        }
    }

    var tablaD = $("#table-banco-items").DataTable({

        dom: '<"top row _info-dataTable"il> rt<"bottom"p><"clear">',
        buttons:[],
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslatioCasos,
        lengthChange: true,
        info: true,
        data: data.lista_real,        
        paging: true,
       /* searching: false,*/
        columns:[

            {data: "nombre"},
            {data: "correo"},
            {data: "prueba"},
            {data: "asignados"},
            {data: "pendientes"},
            {data: "finalizados",
            	render: function (data, type, row) {
            		return (Math.round((data * 100) / row.asignados)+'%');   
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
            }
        ],
        "initComplete": function(settings, json) {
            var placeholder = ["","","Prueba","","","","",""]
            //  var placeholder = ["","","Prueba","","","","","","Estado"]
            //  this.api().columns([2,8]).every( function (index) {
            this.api().columns([2]).every( function (index) {
                //console.log(index)
                var column = this;
                var select = $('<select class="nice-select form-control col-sm-2 btn-light _filtros-eval" data-width="auto" id="select'+index+'"><option value="">'+placeholder[index]+'</option></select>')
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
            } )
        },
        "drawCallback": function(){
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
        }
        //ordering:true, 


  });
 
  $("#table-banco-items").show();  
}	