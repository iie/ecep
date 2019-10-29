$(document).ready(function(){
    listarItems()
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')

    $("#div-filtros").hide()

});

function listarItems(){

    if (JSON.parse(localStorage.user).id_tipo_usuario == 56) {
        $.ajax({
                method: 'POST',
                "url": webservice+"/editor/item/lista",
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
    console.log(data.lista_items);
    if(data.lista_items.length != 0){

        if($.fn.dataTable.isDataTable('#table-banco-items')){

            $('#table-banco-items').DataTable().destroy();
            $('#lista_items').empty();
        }

        $("#div-filtros").show()
    }

 //        for (var j = 0; j < data.lista_items.length; j++) {
	// 		trData = '<tr>'
 //                + '<td>' + (data["lista_items"][j].nro == null ? '-' : data["lista_items"][j].nro) + '</td>'
 //                + '<td>' + (data["lista_items"][j].id_item == null ? '-' : data["lista_items"][j].id_item) + '</td>'
	// 			+ '<td style="width: 100px !important;">' + (data["lista_items"][j].descripcion_larga == null ? '' : data["lista_items"][j].descripcion_larga) + '</td>'
	// 			+ '<td>' + (data["lista_items"][j].fecha_limite == null ? '-' : data["lista_items"][j].fecha_limite) + '</td>'
 //                + '<td>' + (data["lista_items"][j].res_evaluacion[0].nombre == null ? 'Sin Asignar' :(data["lista_items"][j].res_evaluacion[0].nombre)) +'</br>' + (data["lista_items"][j].res_evaluacion[0].evaluacion == null ? "Pendiente" :'<label class="text-'+((data["lista_items"][j].res_evaluacion[0].evaluacion)).replace(/ /g, "")+'">'+data["lista_items"][j].res_evaluacion[0].evaluacion) + '</label></td>'
 //                + '<td>' + (data["lista_items"][j].res_evaluacion[1].nombre == null ? 'Sin Asignar' :(data["lista_items"][j].res_evaluacion[1].nombre)) +'</br>' + (data["lista_items"][j].res_evaluacion[1].evaluacion == null ? "Pendiente" :'<label class="text-'+((data["lista_items"][j].res_evaluacion[1].evaluacion)).replace(/ /g, "")+'">'+data["lista_items"][j].res_evaluacion[1].evaluacion) + '</label></td>'
	// 			+ '<td>' + (data["lista_items"][j].evaluacionFinal == null ? '' : '<label class="text-'+((data["lista_items"][j].evaluacionFinal)).replace(/ /g, "")+'">'+data["lista_items"][j].evaluacionFinal) + '</label></td>'
	// 			+ '<td>' + (data["lista_items"][j].evaluacionFinal == null ? '' : '<label class="text-'+((data["lista_items"][j].evaluacionFinal)).replace(/ /g, "")+'">'+data["lista_items"][j].evaluacionFinal) + '</label></td>'
	// 			+ '<td><button type="button" class="btn" id="item_'+data["lista_items"][j].id_item+'">'
 //                +(data["lista_items"][j].opciones=="Editar" ? '<i class="fas fa-binoculars"></i>': '<i class="fas fa-search"></i>')
 //                + '    '+data["lista_items"][j].opciones+'</button></td>'
	// 			+ '</tr>';
	// 		$('#lista_items').append(trData);
	// 		$('#lista_items').find('#item_'+data["lista_items"][j].id_item).data('item', data["lista_items"][j].id_item);
	// 		$('#lista_items').find('#item_'+data["lista_items"][j].id_item).on('click', redireccionarItem);
 //        }
 //    }
	// else{
 //        var vacio = '<div class="col-sm-12">No existen ítems</div>';
 //    }

    var tablaD = $("#table-banco-items").DataTable({

        // dom: 'Bflrtip',
        dom: '<"top row _info-dataTable"il> rt<"bottom"p><"clear">',
        buttons:[],
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslatioCasos,
        lengthChange: true,
        info: true,
        paging: true,
        ordering: true, 
        // searching: false,
        data : data.lista_items,
        responsive: true, 
        columns:[
            {data: "nro"},
            {data: "id_item"},
            {data: "area_pedagogica"},
            {data: "fecha_limite",
                render: function(data,type,row){
                    if (data == null || data =="") {
                        return "-"
                    }else{
                        return moment(data).format("DD-MM-YYYY")
                    }
                }
            },
            {data: "res_evaluacion.0.nombre"},
            {data: "res_evaluacion.1.nombre"},
            {data: "res_evaluacion"},
            {data: "evaluacionFinal"},
            {data: "opciones",
                render : function(data,type,row){
                    return '<button type="button" class="btn _btn-item" id="item_'+row.id_item+'"><i class="fas fa-edit"></i> Editar Ítem</button'
                }
            }
        ],
        columnDefs: [
            { orderable: false, 
                targets: [8] }
          ],
          "initComplete": function(settings, json) {
            var placeholder = ["","","Prueba","","Evaluador 1","Evaluador 2","",""]
            this.api().columns([2,4,5]).every( function (index) {
                
                var column = this;
                var select = $('<select class="form-control col-sm-2 btn-light _filtros _filtro'+index+' small"  id="select'+index+'" ><option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#supervisor-prueba-Table_filters'))
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } ).insertBefore('#clear-filtros');
 
                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
                 $('#select'+index+'').niceSelect();        
            })       
        },
        "rowCallback": function(row,data){

            if (data.res_evaluacion[0].nombre == null) {
                $('td:eq(4)', row).html( "Sin Asignar");
            }else{
                if (data.res_evaluacion[0].evaluacion == null) {
                    $('td:eq(4)', row).html( "Pendiente");
                }else{
                    // if (data.res_evaluacion[0].evaluacion == "Observado") {
                    //     $('td:eq(4)', row).html( data.res_evaluacion[0].nombre+ '</br><label class="text-Aprobadoconobservación">Observado</label>');
                    // }else{
                        $('td:eq(4)', row).html( data.res_evaluacion[0].nombre+ '</br><label class="text-'+data.res_evaluacion[0].evaluacion.replace(/ /g, "")+'">'+data.res_evaluacion[0].evaluacion + '</label>');
                    // }
                }
            }

            if (data.res_evaluacion[1].nombre == null) {
                $('td:eq(5)', row).html( "Sin Asignar");
            }else{
                if (data.res_evaluacion[1].evaluacion == null) {
                    $('td:eq(5)', row).html( "Pendiente");
                }else{
                    //    if (data.res_evaluacion[1].evaluacion == "Observado") {
                    //     $('td:eq(5)', row).html( data.res_evaluacion[1].nombre+ '</br><label class="text-Aprobadoconobservación">Observado</label>');
                    // }else{
                        $('td:eq(5)', row).html( data.res_evaluacion[1].nombre+ '</br><label class="text-'+data.res_evaluacion[1].evaluacion.replace(/ /g, "")+'">'+data.res_evaluacion[1].evaluacion + '</label>');
                    // }
  
                }
            }

            if (data.res_evaluacion[0].evaluacion == "-" || data.res_evaluacion[1].evaluacion == "-" || data.res_evaluacion[0].evaluacion == null || data.res_evaluacion[1].evaluacion == null ) {
                    $('td:eq(6)', row).html('<label class="text-Pendiente">Pendiente</label>');
            }


            if (data.res_evaluacion[0].evaluacion == "Aprobado" && data.res_evaluacion[1].evaluacion == "Aprobado"  ) {
                $('td:eq(6)', row).html('<label class="text-'+data.res_evaluacion[0].evaluacion.replace(/ /g, "")+'">'+data.res_evaluacion[0].evaluacion + '</label>');
                
            }
            else if (data.res_evaluacion[0].evaluacion == "Observado" && data.res_evaluacion[1].evaluacion == "Aprobado" || data.res_evaluacion[0].evaluacion == "Observado" && data.res_evaluacion[1].evaluacion == "Observado")  {
                $('td:eq(6)', row).html('<label class="text-'+data.res_evaluacion[1].evaluacion.replace(/ /g, "")+'">'+data.res_evaluacion[1].evaluacion + '</label>');
            }
            else if (data.res_evaluacion[0].evaluacion == "Rechazado" && data.res_evaluacion[1].evaluacion == "Aprobado" || data.res_evaluacion[0].evaluacion == "Rechazado" && data.res_evaluacion[1].evaluacion == "Observado") {
                $('td:eq(6)', row).html('<label class="text-'+data.res_evaluacion[0].evaluacion.replace(/ /g, "")+'">'+data.res_evaluacion[0].evaluacion + '</label>');

            }



            else if (data.res_evaluacion[1].evaluacion == "Observado" && data.res_evaluacion[0].evaluacion == "Aprobado") {
                $('td:eq(6)', row).html('<label class="text-'+data.res_evaluacion[1].evaluacion.replace(/ /g, "")+'">'+data.res_evaluacion[1].evaluacion + '</label>');
            }
            else if (data.res_evaluacion[1].evaluacion == "Rechazado" && data.res_evaluacion[0].evaluacion == "Aprobado" || data.res_evaluacion[1].evaluacion == "Rechazado" && data.res_evaluacion[0].evaluacion == "Observado") {
                $('td:eq(6)', row).html('<label class="text-'+data.res_evaluacion[1].evaluacion.replace(/ /g, "")+'">'+data.res_evaluacion[1].evaluacion + '</label>');
            }
            else if (data.res_evaluacion[0].evaluacion == "Rechazado" && data.res_evaluacion[1].evaluacion == "Rechazado") {
                $('td:eq(6)', row).html('<label class="text-'+data.res_evaluacion[1].evaluacion.replace(/ /g, "")+'">'+data.res_evaluacion[1].evaluacion + '</label>');
            }
 

        }, 
        


  });

  $('#lista_items').on('click','._btn-item',redireccionarItem); 
  localStorage.cantidadItems = data.lista_items.length;
  $("#table-banco-items").show();  
}



function redireccionarItem() {
   var td = $(this).parent();
    // console.log(td)
    var tr = td.parent();
    // console.log(tr)
    var children = tr.children().length;
    var tdIndex = td.index() + 1;
    var trIndex = tr.index();
    localStorage.itemsSelected = trIndex;

    var idItem = $(this).attr('id')
    items=[];
    $("#lista_items tr").each(function() {
        var nro = $(this).find('td:nth-child(1)').text() == undefined ? "" : $(this).find('td:nth-child(1)').text()
        var id = $(this).find('td:nth-child(2)').text() == undefined ? "" : $(this).find('td:nth-child(2)').text()
        var evaluacion = $(this).find('td:nth-child(7)').text() == undefined ? "" : $(this).find('td:nth-child(7)').text()
        items.push({nro: nro,id_item: id,evaluacion: evaluacion})

    })
     localStorage.item = items[trIndex].id_item;




    localStorage.items = JSON.stringify(items); 


    redirect()

    function redirect()    {        
        // localStorage.item = $("#"+idItem).data('item'); 
        // localStorage.item = $("#lista_items").rows( idItem.row ).data('item')

        console.log(items[trIndex].id_item);

        location.href = serverRedirect + '/_editor/item.php';
    }
}

