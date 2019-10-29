var limit = 1;
$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    bancoItems();
    ocultarLoading();
    $('#nav_banco').addClass('active_menu');

    $("#id_subprueba").niceSelect();
        $('#table-lista-items').hide(); 
        $('#tabla-evaluadores').hide()

    $("#id_subprueba").on('change',function(){
        if ($('#id_subprueba').val() != -1) {
            listasAsignar()
        }else{
            $('#tabla-evaluadores').hide(); 
            $('#tabla-items').hide(); 
        }
    });

    $('#asignar-items').on('click', asignacion);

    $("input[name='checkItems']").on('change', function(evt) {
       if($(this).siblings(':checked').length >= limit) {
           this.checked = false;
       }
    });
    
});

$(".custom-file-input").on("change", function() {
  var fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

function bancoItems(){
    if (JSON.parse(localStorage.user).id_tipo_usuario == 55) {
        $.ajax({
                method: 'POST',
                "url": webservice+"/supervisor/gestion/item/lista",
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

function listasAsignar(){
    if (JSON.parse(localStorage.user).id_tipo_usuario == 55) {
        $.ajax({
                method: 'POST',
                "url": webservice+"/supervisor/gestion/asignacion/listaAsignacion",
                headers: {
                    't': JSON.parse(localStorage.user).token,
                },
                crossDomain: true,
                dataType: 'text',
                data: {
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    id_subprueba: $('#id_subprueba').val()
                },
                success: function(data, textStatus, jqXHR) {
                    if (data != "token invalido") {
                        datos = JSON.parse(data);
                        creaListaAsignaItems(JSON.parse(data));
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

function asignacion(){

var items = [];
var evaluadores = [];

    $.each($("input[name='checkItems']:checked"), function(){
        items.push($(this).val());
    });

    $.each($("input[name='checkEvaluador']:checked"), function(){
        evaluadores.push($(this).val());
    });


    if (JSON.parse(localStorage.user).id_tipo_usuario == 55) {
        $.ajax({
                method: 'POST',
                "url": webservice+"/supervisor/gestion/asignacion/asignar",
                headers: {
                    't': JSON.parse(localStorage.user).token,
                },
                crossDomain: true,
                dataType: 'text',
                data: {
                    id_usuario: JSON.parse(localStorage.user).id_usuario,
                    evaluadores: evaluadores,
                    items: items,

                },
                success: function(data, textStatus, jqXHR) {
                    // if (data != "token invalido") {
                    //     datos = JSON.parse(data);
                    //     creaListaAsignaItems(JSON.parse(data));
                    // } 
                    // else {
                    //     console.log("invalidos");
                    // }
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
    if(data.lista_items.length != 0){
        if($.fn.dataTable.isDataTable('#table-banco-items')){
            $('#table-banco-items').DataTable().destroy();
            $('#lista_items').empty();
        }
    }

    var tablaD = $("#table-banco-items").DataTable({
        dom: '<"top row _info-dataTable"il> rt<"bottom"p><"clear">',
        // dom: 'flrtip',
        buttons: [
        {
            extend: 'excel',
            title: 'Banco de Ítems (Supervisor)',
            exportOptions: {
                modifier: {
                    page: 'current'
                },
                columns: [ 0, 1, 2, 3, 4, 5, 6, ]
            }
        }
    ],
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslatioCasos,
        lengthChange: true,
        info: true,
        paging: true,
        ordering: true, 
        data: data.lista_items,
        responsive: true, 
        aoColumnDefs: [
            { "sWidth": "80px", "aTargets": [0] },
            { "sWidth": "100px", "aTargets": [1] },
            { "sWidth": "350px", "aTargets": [2] },
            { "sWidth": "200px", "aTargets": [2,4] },
            { "sWidth": "200px", "aTargets": [5] },
            { "sWidth": "100px", "aTargets": [6] },
        ],
        columns:[

            {data: "nro"},
            {data: "id_item"},
            {data: "prueba"},
            {data: "res_evaluacion",
                render:function(data,type,row){

                    if (data[0].nombre == undefined) {
                        return ""
                    }else{
                        return data[0].nombre
                    }
                }
            },
            {data: "res_evaluacion",
                render:function(data,type,row){
                    if (data.length < 2) {
                        return ""
                    }else{
                        return data[1].nombre
                    }
                }
            },
            {data: "evaluacionFinal",
                render:function(data,type,row){
                   if (data == null) {
                        return ""
                    }else{
                        return '<label class="text-'+data.replace(/ /g, "")+'">'+data + '</label>'
                    }
                }
            },
            {data: "opciones",
                render: function(data, type, row){
                    localStorage.item = row.id_item;
                    return '<button type="button" class="btn _btn-item" id="item_'+row.id_item+'"><i class="fas fa-search"></i> Ver</button'

                }
            }
            
        ],
       columnDefs: [
            {   
                orderable: false, 
                targets: [6] 
            }
        ],
        "initComplete": function(settings, json) {
            var placeholder = ["","","Prueba","Evaluador 1","Evaluador 2","Evaluación",""]
            this.api().columns([2,3,4,5]).every( function (index) {
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
                    } ).insertBefore( '#clear-filtros' );
                column.data().unique().sort().each( function ( d, j ) {
                    if(index!=3 && index!= 4){
                        select.append( '<option value="'+d+'">'+d+'</option>' )
                    }
                    else if(index == 3 && d.length > 0){
                        select.append( '<option value="'+d[0].nombre+'">'+d[0].nombre+'</option>' )
                    }
                    else if(index == 4 && d.length == 2){
                         select.append( '<option value="'+d[1].nombre+'">'+d[1].nombre+'</option>' )
                    }   
                } );
                
                $('#select'+index+'').niceSelect();		
            })  
            $('.dataTables_length select').addClass('nice-select small');      
        },
        "rowCallback": function( row, data ) {
	     	if (data.res_evaluacion[0].nombre == null) {
                $('td:eq(3)', row).html( "Sin Asignar");
            }else{
                if (data.res_evaluacion[0].evaluacion == null) {
                    $('td:eq(3)', row).html( "Pendiente");
                }else{
                	    $('td:eq(3)', row).html( data.res_evaluacion[0].nombre+ '</br><label class="text-'+data.res_evaluacion[0].evaluacion.replace(/ /g, "")+'">'+data.res_evaluacion[0].evaluacion + '</label>');
                  }
            }
            if (data.res_evaluacion.length < 2 || data.res_evaluacion[1].nombre == null) {
                $('td:eq(4)', row).html( "Sin Asignar");
            }else{
                if (data.res_evaluacion[1].evaluacion == null) {
                    $('td:eq(4)', row).html( "Pendiente");
                }else{     
                        $('td:eq(4)', row).html( data.res_evaluacion[1].nombre+ '</br><label class="text-'+data.res_evaluacion[1].evaluacion.replace(/ /g, "")+'">'+data.res_evaluacion[1].evaluacion + '</label>');
                }
            }
		 },
         "drawCallback": function(){
            var placeholder = ["","","Prueba","Evaluador 1","Evaluador 2","Evaluación",""]
            this.api().columns([2,3,4,5]).every(function(index){
                var columnFiltered = this;
                var selectFiltered = $("#select"+index)
                if(selectFiltered.val()===''){
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">'+placeholder[index]+'</option>')
                    columnFiltered.column(index,{search:'applied'}).data().unique().sort().each( function ( d, j ) {

                        if(index!=3 && index!= 4){
                            selectFiltered.append( '<option value="'+d+'">'+d+'</option>' )
                        }
                        else if(index == 3 && d.length > 0){
                            selectFiltered.append( '<option value="'+d[0].nombre+'">'+d[0].nombre+'</option>' )
                        }
                        else if(index == 4 && d.length == 2){
                             selectFiltered.append( '<option value="'+d[1].nombre+'">'+d[1].nombre+'</option>' )
                        }
                    } );
                }
                $('select').niceSelect('update');
            })
        }
  });

$("#descraga-lista-banco-items").on("click", function() {
    tablaD.button( '.buttons-excel' ).trigger();
});

$('#limpiar-filtros').click(btnClearFilters);

$('#lista_items').on('click','._btn-item',redireccionarItem);

  localStorage.cantidadItems = data["lista_items"].length;

  $('#total-items').html(data.lista_items.length)
  $('#items-asignados').html(data.lista_items.length)       

  $("#table-banco-items").show();  
  
}

function creaListaAsignaItems(data) {
    if(data.lista_asignacion.items.length != 0){

        if($.fn.dataTable.isDataTable('#table-lista-items')){

            $('#table-lista-items').DataTable().destroy();
            $('#lista_items_asignar').empty();
            $('#tabla-items').show();
            $('#tabla-evaluadores').show();
            
        }
    }
    if(data.lista_asignacion.items.length == 0){
        $('#tabla-items').show(); 
        $('#tabla-evaluadores').hide();  
    }

    if(data.lista_asignacion.evaluadores.length != 0){

        if($.fn.dataTable.isDataTable('#table-lista-evaluadores')){

            $('#table-lista-evaluadores').DataTable().destroy();
            $('#llista_evaluadores_asignar').empty();
        }
    }

    var tablaD = $("#table-lista-items").DataTable({

        dom: '<"top row _info-dataTable"il> rt<"bottom"p><"clear">',
        // dom: 'flrtip',
        buttons: [],
        // lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslatioCasos,
        // lengthChange: true,
        info: false,
        ordering: false, 
        scrollY: "150px",
        scrollCollapse: true,
        paging: false,
        // retrieve: true,
        destroy: true,
        searching: false,
        data: data.lista_asignacion.items,
        responsive: true, 
        columns:[

            {data: "id_item",
                render:function(data,type,row){
                    return '<input  type="checkbox" name="checkItems" id="item'+data+'" value="'+data+'" required>'      
                }
            },
            {data: "nro"},
            {data: "id_item"},
            {data: "prueba"},           
        ],
        
  });


    var tablaD = $("#table-lista-evaluadores").DataTable({

        dom: '<"top row _info-dataTable"i> rt<"bottom"><"clear">',
        buttons: [],
        language:spanishTranslatioCasos,
        info: false,
        scrollY: "150px",
        scrollCollapse: true,
        paging: false,
        ordering: false, 
        // retrieve: true,
        // destroy: true,
        searching: false,
        data: data.lista_asignacion.evaluadores,
        responsive: true, 
        columns:[

            {data: "id_supervisor_evaluador",
                render:function(data,type,row){
                    return '<input  type="checkbox" name="checkEvaluador" id="evaluador'+data+'" value="'+data+'" required>'
                }
            },
            {data: "nro"},
            {data: "nombre"},
            {data: "email"},
            {data: "prueba"},    
            {data: "asignados"},        
        ],
  });

  $("#table-lista-items").show();  
  $("#table-lista-evaluadores").show(); 

   
  
}



// function redireccionarItem() {
//     // var idItem = $(this).attr('id')
//     // console.log(idItem);
    

//     var idItem = $(this).attr('id')
//     console.log(idItem);
//     // console.log($("#item_"+idItem).data('id_item'));
//     // localStorage.item = $("#item_"+idItem).data('id_item');
//     console.log($('#'+idItem+' tr' ).find('td:nth-child(2)').text());
//     // localStorage.item = $(this).find('td:nth-child(2)').text();
//     localStorage.item = $("#"+idItem).data('id_item', 'td:nth-child(2)'); 

    
//     location.href = serverRedirect + '/_supervisor/item.php';
// }

function redireccionarItem() {

    var td = $(this).parent();
    // console.log(td);
    var tr = td.parent();
    // console.log(tr);
    var children = tr.children().length;
    // console.log(children);
    var tdIndex = td.index() + 1;
    // console.log(tdIndex);
    var trIndex = tr.index();
    // console.log(trIndex);
    localStorage.itemsSelected = trIndex;

    var idItem = $(this).attr('id')
    items=[];
    $("#lista_items tr").each(function() {
        var id = $(this).find('td:nth-child(2)').text() == undefined ? "" : $(this).find('td:nth-child(2)').text()
        // var evaluacion = $(this).find('td:nth-child(7)').text() == undefined ? "" : $(this).find('td:nth-child(7)').text()
        items.push({id_item: id})

    })

    localStorage.item = items[trIndex].id_item;

    localStorage.items = JSON.stringify(items); 


    redirect()

    function redirect()    {
        localStorage.item = $("#"+idItem).data('item'); 
        location.href = serverRedirect + '/_supervisor/item.php';
    }
}

function btnClearFilters(){
	$('#select2').val("").niceSelect('update');
	$('#select3').val("").niceSelect('update');
	$('#select4').val("").niceSelect('update');
	$('#select5').val("").niceSelect('update');

    var table = $('#table-banco-items').DataTable();
		table
		 .search( '' )
		 .columns().search( '' )
		 .draw();

}

