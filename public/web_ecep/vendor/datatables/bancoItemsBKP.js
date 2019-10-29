$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    bancoItems();
    ocultarLoading();
    $('#nav_banco').addClass('active_menu');

});

$(".custom-file-input").on("change", function() {
  var fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});



function bancoItems(){

    if (JSON.parse(localStorage.user).id_tipo_usuario == 55) {
        $.ajax({
                method: 'POST',
                "url": webservice+"/supervisor/item/lista",
                headers: {
                    't': JSON.parse(localStorage.user).token,
                },
                crossDomain: true,
                dataType: 'text',
                data: {

                },
                success: function(data, textStatus, jqXHR) {
                    if (data != "token invalido") {
                        datos = JSON.parse(data);
                        creaListaItems(JSON.parse(data));
                    } 
                    else {
                        console.log("invalidos");
                    }
                    ocultarLoading()
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    ocultarLoading()
                }
        });
    }
}

function creaListaItems(data) {
    // console.log(dsata.lista_items);
    if(data.lista_items.length != 0){

        if($.fn.dataTable.isDataTable('#table-banco-items')){

            $('#table-banco-items').DataTable().destroy();
            $('#lista_items').empty();
        }

        // for (var j = 0; j < data.lista_items.length; j++) {
			// trData = '<tr>'
   //              + '<td>' + (data["lista_items"][j].nro == null ? '-' : data["lista_items"][j].nro) + '</td>'
			// 	+ '<td>' + (data["lista_items"][j].id_item == null ? '-' : data["lista_items"][j].id_item) + '</td>'
			// 	+ '<td>' + (data["lista_items"][j].descripcion_larga == null ? '' : data["lista_items"][j].descripcion_larga) + '</td>'
			// 	+ '<td>' + (data["lista_items"][j].fecha_limite == null ? '-' : data["lista_items"][j].fecha_limite) + '</td>'
   //              + '<td>' + (data["lista_items"][j].res_evaluacion[0].nombre == null ? 'Sin Asignar' :(data["lista_items"][j].res_evaluacion[0].nombre)) +'</br>' + (data["lista_items"][j].res_evaluacion[0].evaluacion == null ? "Pendiente" :'<label class="text-'+((data["lista_items"][j].res_evaluacion[0].evaluacion)).replace(/ /g, "")+'">'+data["lista_items"][j].res_evaluacion[0].evaluacion) + '</label></td>'
   //              + '<td>' + (data["lista_items"][j].res_evaluacion[1].nombre == null ? 'Sin Asignar' :(data["lista_items"][j].res_evaluacion[1].nombre)) +'</br>' + (data["lista_items"][j].res_evaluacion[1].evaluacion == null ? "Pendiente" :'<label class="text-'+((data["lista_items"][j].res_evaluacion[1].evaluacion)).replace(/ /g, "")+'">'+data["lista_items"][j].res_evaluacion[1].evaluacion) + '</label></td>'
			// 	+ '<td>' + (data["lista_items"][j].evaluacionFinal == null ? '' : '<label class="text-'+((data["lista_items"][j].evaluacionFinal)).replace(/ /g, "")+'">'+data["lista_items"][j].evaluacionFinal) + '</label></td>'
   //              + '<td><button type="button" class="btn" id="item_'+data["lista_items"][j].id_item+'"><i class="fas fa-search"></i>Ver</button></td>'
			// 	// + '<td><button type="button" class="btn" id="item_'+data["lista_items"][j].id_item+'">'
    //             +(data["lista_items"][j].opciones=="Editar" ? '<i class="fas fa-binoculars"></i>': '<i class="fas fa-search"></i>')
    //             + '    '+data["lista_items"][j].opciones+'</button></td>'
			// 	+ '</tr>';
			// $('#lista_items').append(trData);
			// $('#lista_items').find('#item_'+data["lista_items"][j].id_item).data('item', data["lista_items"][j].id_item);
			// $('#lista_items').find('#item_'+data["lista_items"][j].id_item).on('click', redireccionarItem);
   //      }
   //  }
	// else{
 //        var vacio = '<div class="col-sm-12">No existen ítems</div>';
 //    }

    var tablaD = $("#table-banco-items").DataTable({

        dom: 'Bflrtip',
        buttons:[],
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslatioCasos,
        lengthChange: true,
        info: false,
        data: data.lista_items,
        paging: true, 
        columns:[

            {data: "nro"},
            {data: "id_item"},
            {data: "descripcion_larga"},
            {data: "fecha_limite"},
            {data: "res_evaluacion.0.nombre",
            render:function(data,type,row){
                nombre == null ? return 'Sin Asignar' : return nombre +'</br>' + evaluacionFinal == null ? "Pendiente" : return '<label class="text-'+evaluacionFinal.replace(/ /g, "")+'">'+evaluacionFinal + '</label>'
            }
        },
            {data: "res_evaluacion.1.nombre"},
            {data: "evaluacionFinal"},
            {data: "opciones",
                render: function(data, type, row){
                    return '<button type="button" class="btn" id="item_'+data.lista_items.id_item+'"><i class="fas fa-search"></i>Ver</button>'

                }
            },
        ],

       columnDefs: [
            {   
                orderable: false, 
                targets: [6] 
            }
        ],
        "initComplete": function(settings, json) {
            var placeholder = ["","","Prueba","","Asignado","","Estado",""]
            //  var placeholder = ["","","Prueba","","","","","","Estado"]
            //  this.api().columns([2,8]).every( function (index) {
            this.api().columns([2,4,6]).every( function (index) {
                // console.log(index)
                var column = this;
                var select = $('<select class="form-control col-sm-2 btn-light" data-width="auto" id="select'+index+'"><option value="">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#supervisor-prueba-Table_filters'))
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
            } )
            // $('#lista_items').find('#item_'+data.id_item).data('item', data.id_item);
            // $('#lista_items').find('#item_'+data.id_item).on('click', redireccionarItem);
            // console.log(data.id_item);
        }
  });
    
  localStorage.cantidadItems = data.lista_items.length;

  $("#table-banco-items").show();  
}

function redireccionarItem() {
    var idItem = $(this).attr('id')
    localStorage.item = $("#"+idItem).data('item'); 
    location.href = serverRedirect + '/_supervisor/item.php';
}

