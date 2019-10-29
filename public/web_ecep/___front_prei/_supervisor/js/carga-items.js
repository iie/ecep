$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    bancoItems();
    colaboradores();
    ocultarLoading();
    cambiarSelectColaborador();
    $('#nav_carga').addClass('active_menu');
    $("#cargar_archivo").on('click', subirArchivo);
    // $("#btn-asignacion").on('click', asignarItems);
     
    
});

$(".custom-file-input").on("change", function() {
  var fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});


function bancoItems(){

    if (JSON.parse(localStorage.user).id_tipo_usuario == 55) {
        $.ajax({
                method: 'POST',
                "url": webservice+"/supervisor/carga/item/lista",
                headers: {
                    't': JSON.parse(localStorage.user).token,
                },
                crossDomain: true,
                dataType: 'text',
                data: {
                    filtro: 'carga'
                },
                success: function(data, textStatus, jqXHR) {
                    if (data != "token invalido") {
                        datos = JSON.parse(data);
                        creaListaItems(JSON.parse(data));
                        // colaboradores();
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
    $('#filtros-borrar').empty();
    if(data.length != 0){

        if($.fn.dataTable.isDataTable('#table-banco-items')){

            $('#table-banco-items').DataTable().destroy();
            $('#lista_items').empty();
        }
    }

    var tablaD = $("#table-banco-items").DataTable({

        dom: '<"top row _info-dataTable"il> rt<"bottom"p><"clear">',
        buttons: [
            {
                extend: 'excel',
                title: 'Banco de Ítems (Colaborador)',
                exportOptions: {
                    modifier: {
                        page: 'current'
                    },
                    columns: [ 0, 1, 2, 3, 4, 5, 6, 7]
                }
            }
        ],
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslatioCasos,
        lengthChange: true,
        info: false,
        paging: false,
        displayLength: -1,
        ordering: true, 
        data: data.lista_items,
        responsive: true, 
        columns:[
            {data: "nro"},
            {data: "id_item"},
            {data: "prueba", className: "text-left"},
            
			// {data: "nivel"},
			{data: "especialidad", className: "text-left"},
            {data: "tema", className: "text-left"},
			{data: "colaborador"},
            

			
            //{
                // render: function(data,type,row){
                    // if(row.colaborador == null || row.colaborador == '' || row.colaborador == ' '){
                        // return 'Sin Asignar';
                    // }else{
                        // return 'Asignado';
                    // }
                // }
            //},            
            {data: "estado_carga"},
            /*{data: "estado_revision"},*/
            {data: "opciones",
                render: function(data, type, row){
                    if(row.opciones == 'Ver'){
                        //return 'Sin Asignar';
						return '<button type="button" id="item_'+row.codigo+'" class="btn _btn-item"><i class="fas fa-search"></i>&nbsp;Ver</button'
                    }
					else{
                        //return 'Asignado';
						return '<button type="button" id="item_'+row.codigo+'" class="btn _btn-item"><i class="fas fa-search"></i>&nbsp;Revisar</button'
                    }
                }
            } 
        ],
        "initComplete": function(settings, json) {
            var placeholder = ["","","Prueba","Especialidad","Tema","","Revision",""]
            this.api().columns([2,3,4,6]).every( function (index) {
                // console.log(index)
                var column = this;
                var select = $('<select class="form-control col-sm-2 btn-light _filtros _filtro'+index+' small"  id="select'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
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
                    $('#select'+index).append( '<option value="'+d+'">'+d+'</option>' )
                } );
                 $('#select'+index).niceSelect();        
            })   

            $('.dataTables_length select').addClass('nice-select small');         
        },
        "drawCallback": function(){
            var placeholder = ["","","Prueba","Especialidad","Tema","","Revision",""]
            this.api().columns([2,3,4,6]).every( function (index) {
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
  });

    $("#descraga-lista-banco-items").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });

    $('#limpiar-filtros').click(btnClearFilters);

    $('#lista_items').on('click','._btn-item',redireccionarItem);
         // $('#limpiar-filtros').on('click', function(){
         //         btnClearFilters();              
         //        });
     


    $('#total-items').html(data.lista_items.length);

    $('#gitems-asinados').html(data.asignados)       

    $("#table-banco-items").show();  
  
}

function colaboradores(){
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
                    selectColaboradores(JSON.parse(data)); 
                                        
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

function cargarItems(){
    $('#id_subprueba').val('-1')
    $('#id_usuario').val('-1')
    $('#file_cargar_items').val(null);
    $('#id_subprueba').removeClass('is-invalid')
    $('#id_usuario').removeClass('is-invalid')
    $('#invalid-planilla').css('display','none')
    $('#crearModal').modal('show')
}

function cambiarSelectColaborador(){

    // Consigue el elemento provincias/poblaciones por su identificador id. Es un método del DOM de HTML
        var id1 = document.getElementById("id_subprueba");
        var id2 = document.getElementById("id_usuario");
        
        // Añade un evento change al elemento id1, asociado a la función cambiar()
        if (id1.addEventListener) {     // Para la mayoría de los navegadores, excepto IE 8 y anteriores
            id1.addEventListener("change", cambiar);
        } else if (id1.attachEvent) {   // Para IE 8 y anteriores
            id1.attachEvent("change", cambiar); // attachEvent() es el método equivalente a addEventListener()
        }

        // Definición de la función cambiar()
        function cambiar() {
            for (var i = 0; i < id2.options.length; i++)
            
            // -- Inicio del comentario -- 
            // Muestra solamente los id2 que sean iguales a los id1 seleccionados, según la propiedad display
            if(id2.options[i].getAttribute("codigo") == id1.options[id1.selectedIndex].getAttribute("codigo")){
                id2.options[i].style.display = "block";
            }else{
                id2.options[i].style.display = "none";
            }
            // -- Fin del comentario --
                    
            id2.value = "";
        }

        // Llamada a la función cambiar()
        cambiar();
    
}

function selectColaboradores(data){

    // console.log(data);
 $('#id_usuario').append('<option value="" selected >Seleccione Colaborador</option>');
    for (var i = 0; i < data.length; i++) {
    	// console.log("vualta" +i);
        // if (data != "" && data != null) {
        //     palabra = '<select class="form-control" id="id_usuario">' +
        //     '<option value="82">Seleccione</option>' 
        //     $('#selectColaborador').append(palabra)
        // }else{
            palabra = 
            // '<select class="form-control" id="id_usuario">' +
            '<option codigo="'+data[i].id_subprueba+'" value="'+data[i].id_usuario+'">'+data[i].nombre+'</option>' 
            $('#id_usuario').append(palabra)
        // }
        
    }



}


// function listaColaboradores(data){

//     if(data.length != 0){

//         if($.fn.dataTable.isDataTable('#table-asignar-colaboradores')){

//             $('#table-asignar-colaboradores').DataTable().destroy();
//             $('#lista_colaboradores').empty();
//         }
//     }
//     // console.log(data);
//     var tablaD = $("#table-asignar-colaboradores").DataTable({

//         // dom: 'flrtip',
//         dom: '<"top row _info-dataTable"> rt<"bottom"><"clear">',
//         buttons:[],
//         lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
//         language:spanishTranslatioCasos,
//         lengthChange: true,
//         info: true,
//         data: data,        
//         paging: true,
//         DisplayLength: -1,
//        /* searching: false,*/
//        // columnDefs: [
//        //       {targets: 0, checkboxes: {selectRow: true}}
//        //    ],
//         columns:[
 
//             {
//                 render: function ( data, type, full, meta, ) {
//                     return ('<input type="radio" class="seleccion" name="usuario" value="'+meta.row+'">');
//                 }
//             },
//             {data: "nombre"},
//             {data: "correo"},
//             {data: "asignados"},
//             {data: "finalizado"},
//             // {data: "pendientes"},
//             {data: "en_proceso"},
//             {data: "finalizado",
//                 render: function (data, type, row) {
//                     return (data == 0 ? '0%' : Math.round((data * 100) / row.asignados)+'%');   
//                 }
//             },
//         ],
//         columnDefs: [
//             {   
//                 orderable: false, 
//                 targets: [0] 
//                 // targets: [8] 
//             }
//         ],
//         "rowCallback": function( row, data, meta ) {
//         	// console.log(meta);
//         	 // $('td:eq(0)', row).html('<input type="radio" class="seleccion" name="radio'+meta+'" value="1">');
//         }       
//       // 'select': {
//       //    'style': 'single'
//       // }
//   });
//   $("#table-asignar-colaboradores").show();  

// }

// function asignarItems(){

//     // var td = $(this).parent();
//     // var tr = td.parent();
//     // $("#table-asignar-colaboradores tr").each(function() {
//     //     var email = $(this).find('td:nth-child(3)').val()
//     //     console.log(email);

//     // })
//   //    var nombre, apellido, valor;
//   // $('.seleccion:checked').each(function(indice, elemento){
  
//   //   var fila = $(this).parents("#table-asignar-colaboradores tr");
//   //   nombre = fila.find('td:nth-child(3)').val();
//   //   // apellido = fila.find(".apellido").val();
//   //   // valor = $(this).val();
//   //   console.log("Nombre: "+nombre+" ");      
//   // });
// // console.log($('input[name=usuario]:checked').val());
// var td = $('input[name=usuario]:checked').parent();
// var tr = td.parent();
// // var children = tr.children().length;
// // var tdIndex = td.index() + 1;
// // var trIndex = tr.index();




//     Swal.fire({
//         title: '¿Está seguro que desea finalizar?',
//         showCancelButton: true,
//         confirmButtonText: 'Si',
//        // confirmButtonColor: '#3085d6',
//         //cancelButtonColor: '#d33',
//         confirmButtonText: 'Si',
//         cancelButtonText: 'No',      
//         reverseButtons: true,
//         }).then((result) => {
//             if (result.value) {
//                 finalizar()
//             }
//         })

//     function finalizar(){
//         var correo = tr.find('td:nth-child(3)').text();
//         var items = $("#cantItems").val();

//         if (JSON.parse(localStorage.user).id_tipo_usuario == 54) {
//             $.blockUI({ message: '<h1>Espere por favor</h1>' });
//             $.ajax({
//                 method: 'POST',
//                 url: webservice + "/supervisor/carga/colaboradores/asignar",
//                 headers: {
//                     't': JSON.parse(localStorage.user).token,
//                 },
//                 crossDomain: true,
//                 dataType: 'text',
//                 data: {
//                     id_usuario: JSON.parse(localStorage.user).id_usuario, 
//                     correo: correo,
//                     cantItems: items,
//                 },
//                 success: function(data, textStatus, jqXHR) {
//                     $.unblockUI();
//                     if (data != "token invalido") {
//                         showFeedback("success", "Éxito al asignar los Ítems", "Finalizado");
//                         disableData();
//                         // console.log(JSON.parse(data));
//                     } else {
//                         showFeedback("error", "Token invalido", "Error");
//                         console.log("invalidos");
//                     }
//                 },
//                 error: function(jqXHR, textStatus, errorThrown) {
//                     $.unblockUI();
//                     showFeedback("error", "Error al asignar Ítems", "Error");
//                     console.log(errorThrown);
//                 }
//             });
//         }
//     }
    
// }

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
        //localStorage.item = $("#"+idItem).data('item'); 
        location.href = serverRedirect + '/_supervisor/carga-item.php';
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

function subirArchivo() {

    if(validarCarga()){
        $.blockUI({ message: '<h2>Guardando datos...</h2>' , baseZ: 2000  });
        $('#subirNomina').attr('disabled',true);
        var formData = new FormData();
        formData.append('file', $('input[type=file]')[0].files[0]);
        $.ajax({
            url: webservice+"/supervisor/carga/items/carga",
            headers: {
                't': JSON.parse(localStorage.user).token,
                'idSubprueba': $('#id_subprueba').val(),
                'idColaborador': $('#id_usuario').val()
            },
            type: 'POST',
            data: formData,
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {

                $.unblockUI();
                console.log(data);
                //showFeedback('success', 'Alumno eliminado con éxito', 'Eliminado');

                if (data.respuesta == 'ok') {
                    showFeedback('success', data.descripcion , 'OK');
                    bancoItems();
                    $('#crearModal').modal('hide');
                    
                }else if (data.respuesta == 'error') {
                    showFeedback('error', data.descripcion , 'Error');
                    
                }else{
                  /*  document.getElementById("upload-file-info").style.backgroundColor = '#d10606';
                    $("#seleccionarNomina").val(null);
                    
                    var errores = "";
                    for(var i = 0 ; i < respuesta.error1.length ; i++){
                        if(respuesta.error1[i].error.length>0){
                            errores += "<div align='justify'>Error <b>FILA N° "+respuesta.error1[i].fila+": </b>"+
                            respuesta.error1[i].error + ".</div><br>"
                        }
                        

                    }*/
                   /* swal({
                          title: '<strong>Informe de errores</strong>',
                          confirmButtonText:'Continuar',
                          width: '60%',
                          html: '<div align="justify"><b style="color: red; font-size: 18px;">Problemas al intentar guardar los datos.</b></b><br><br>'+errores,
                    })*/
                }
            },
            error: function(e) {
                $.unblockUI();
                console.log(e);
            }
        })
    }else{
          showFeedback('error', 'Debe ingresar todos la información solicitada.' , 'Error');
    }
}

function validarCarga(){
    cumple = true
    if($('#id_subprueba').val() == -1){
        cumple = false
        $('#id_subprueba').addClass('is-invalid')
    }else{
        $('#id_subprueba').removeClass('is-invalid')
    }
 
    if($('#id_usuario').val() == -1 || $('#id_usuario').val() == null){
        cumple = false
        $('#id_usuario').addClass('is-invalid')
    }else{
        $('#id_usuario').removeClass('is-invalid')
    }

 
    if($('#file_cargar_items').val() == ""){
        cumple = false
        $('#invalid-planilla').css('display','')
    }else{
        $('#invalid-planilla').css('display','none')
    }

    return cumple;
}

