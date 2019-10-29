$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    bancoItems();
    ocultarLoading();
    $('#nav_carga').addClass('active_menu');

    // $("#seleccionarNomina").change(function() {
        // $('#subirNomina').attr('disabled',false);
    // });

    // $("#uploadFile").on('submit', function(e) {
        // e.preventDefault();
        // subirArchivoAlumnos();
    // })

    // $("#seccionItem").on('click', function(){
        // location.href = serverRedirect + '/_colaborador/subirItem.php';
    // })
    
});

$(".custom-file-input").on("change", function() {
  var fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

function nombreArchivo(a) {
    document.getElementById("upload-file-info").style.backgroundColor = '#5bc0de';
    var nombre = a.substring(a.lastIndexOf("\\") + 1, a.length);
    $('#upload-file-info').html(nombre);

}

function bancoItems(){

    if (JSON.parse(localStorage.user).id_tipo_usuario == 135) {
        $.ajax({
                method: 'POST',
                "url": webservice+"/colaborador/item/lista",
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
                        console.log(datos);
                        creaListaItems(JSON.parse(data));
                        // creaListaItems();
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


// function ingresarItem(){

        // if (JSON.parse(localStorage.user).id_tipo_usuario == 135) {
        // $.blockUI({ message: '<h1>Espere por favor</h1>' });
        // $.ajax({
            // method: 'POST',
            // url: webservice + "/evaluador/item/guarda",
            // headers: {
                // 't': JSON.parse(localStorage.user).token,
            // },
            // crossDomain: true,
            // dataType: 'text',
            // data: {
                 // dificultad : $("#inputDificultad").val(),
                 // habilidad : $("#inputHabilidad").val(),
                 // tipo : $("#inputTipo").val(),
                 // nivel : $("#inputNivel").val(),
                 // especialidad : $("#inputEspecialidad").val(),
                 // tema : $("#inputTema").val(),
                 // tipoItem : $("#inputTipoItem").val(),
                 // estandar : $("#inputEstandar").val(),
                 // indicador : $("#inputIndicador").val(),

                 // enunciado : $("#inputEnunciado").val(),
                // //  estimulo : $("#inputEstimulo").val(),
                 // pregunta : $("#inputPregunta").val(),

                 // alternativaA : $("#inputAlternativaA").val(),
                 // alternativaB : $("#inputAlternativaB").val(),
                 // alternativaC : $("#inputAlternativaC").val(),
                 // alternativaD : $("#inputAlternativaD").val()
                // // id_item: localStorage.item,
                // // estimulo_aprobacion: ($("#select-estimulo").val() == "-1" ? "" : $("#select-estimulo").val()),
                // // estimulo_observacion: $("#estimulo_obs").val(),
                // // pregunta_aprobacion: ($("#select-pregunta").val() == "-1" ? "" : $("#select-pregunta").val()),
                // // pregunta_observacion: $("#pregunta_obs").val(),
                // // alternativa_aprobacion: ($("#select-alternativas").val() == "-1" ? "" : $("#select-alternativas").val()),
                // // alternativa_observacion: $("#alternativa_obs").val(),
                // // finalizado: "no_finalizado"
            // },
            // success: function(data, textStatus, jqXHR) {
                // $.unblockUI();
                // if (data != "token invalido") {
                    // showFeedback("success", "Éxito al guardar el ítem", "Guardado");
                    // console.log(JSON.parse(data));
                // } else {
                    // showFeedback("error", "Token invalido", "Error");
                    // console.log("invalidos");
                // }
            // },
            // error: function(jqXHR, textStatus, errorThrown) {
                // $.unblockUI();
                // showFeedback("error", "Error al guardar el ítem", "Error");
                // console.log(errorThrown);
            // }
        // });
    // }

// }


 
// data=[];
// data.push({ 
//     nro : 1,
//     codigo : 4965,
//     tipo: 'Pedagógico',
//     nivel: 'Media',
//     especialidad : 'Ciencias Mención Bílogia, Química y Física',
//     tema: 'Aprendizaje y desarrollo de los estudiantes de Educación Media.',
//     tipo_item: 'Abierto',
//     estado : 'En proceso',
//     opciones:'editar'

// })


function creaListaItems(data) {
    console.log(data.lista_items.carga );
    if(data.lista_items.carga.length != 0){

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
                    columns: [ 0, 1, 2, 3, 4, 5, ]
                }
            }
        ],
        lengthMenu: [[-1, 10, 15, 20], ["Todos", 10, 15, 20]],
        language:spanishTranslatioCasos,
        lengthChange: true,
        info: false,
        paging: false,
        ordering: true, 
        data: data.lista_items.carga,
        responsive: true, 
        columns:[
            {data: "nro"},
            {data: "id_item"},
            {data: "prueba", className: "text-left"},
            // {data: "nivel"},
            {data: "especialidad",className: "text-left"},
            {data: "tema", className: "text-left"},
            // {data: "tipo_item"},
            //{data: "estado"},
            {data: "opciones",
                render: function(data, type, row){
                    //return '<button type="button" id="item_'+row.codigo+'" class="btn _btn-item"><i class="fas fa-search"></i> '+data+'</button'
					return '<button type="button" id="item_'+row.codigo+'" class="btn _btn-item"><i class="fas fa-search"></i> Ir</button'

                }
            } 
        ],
        "initComplete": function(settings, json) {
            var placeholder = ["","","Prueba","Especialidad","Tema","",""]
            // console.log(settings)
            // console.log(json)
            //  var placeholder = ["","","Prueba","","","","","","Estado"]
            //  this.api().columns([2,8]).every( function (index) {
            this.api().columns([2,3,4]).every( function (index) {
                // console.log(index)
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
                    // console.log(d)
                    // console.log(j)
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
                 $('#select'+index+'').niceSelect();        
            })  

            $('.dataTables_length select').addClass('nice-select small');     
        },
        "drawCallback": function(){
            var placeholder = ["","","Prueba","Especialidad","Tema","Estado",""]
            this.api().columns([2,3,4,5]).every( function (index) {
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

    $('#items-asignados').html(data.lista_items.length)    

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
        var evaluacion = $(this).find('td:nth-child(7)').text() == undefined ? "" : $(this).find('td:nth-child(6)').text()
        items.push({id_item: id,evaluacion: evaluacion,nro: nro})

    })

    localStorage.item = items[trIndex].id_item;
    localStorage.items = JSON.stringify(items); 
    redirect()
    function redirect()    {        
        location.href = serverRedirect + '/_colaborador/item.php';
    }
}

function btnClearFilters(){
    $('#select2').val("").niceSelect('update');
    $('#select4').val("").niceSelect('update');
    $('#select5').val("").niceSelect('update');
    $('#select6').val("").niceSelect('update');

    var table = $('#table-banco-items').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

}

