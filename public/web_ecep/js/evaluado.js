$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectModulo);
    //getEvaluado() 
    llenarVista()
});

function getEvaluado(){

    $.ajax({
        method:'POST',
        url: webservice+'/evaluado/lista',
        headers:{
           't': JSON.parse(localStorage.user).token
        },
        crossDomain: true,
        dataType:'text',
        data:{ 
            id_usuario: JSON.parse(localStorage.user).id_usuario,
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

function llenarVista( ){
   // data = JSON.parse(data)
    $('#filtros').empty();
   // if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-evaluado')){
            $('#table-evaluado').DataTable().destroy();
            $('#lista_evaluado').empty();
        }
   // }

    var tablaD = $("#table-evaluado").DataTable({
        dom: "<'search'f><'top'i><'bottom'p>",
        processing:true,
        serverSide:true,
        ajax:{
            headers:{
               't': JSON.parse(localStorage.user).token
            },
            type:'POST',
            url: webservice+'/evaluado/lista',
        },
        pageLength: 1000,
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslation,
        /*lengthChange: true,
        info: false,*/
        /*columnDefs: [
            { targets: [0,1,2,3,5,6,7], searchable: false }
        ],*/
        /*paging: true,
        displayLength: 1000,*/
        /*ordering: true, 
        order: [],
        search: true,*/
       // data: data,
        responsive: true, 
        columns:[
            {data: "id_evaluado"},
            {data: "sede"},
            {data: "asignatura"},
            {data: "forma"},
            {data: "rut"},
            {data: "nombres"},
            {data: "apellido_paterno"},
            {data: "apellido_materno"},

        ],
        "initComplete": function(settings, json) {
            $('#total-evaluados').html(json.recordsTotal);
            var placeholder = ["","Sede","Asignatura"]
            this.api().columns([1,2]).every( function (index) {
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
            var placeholder =  ["","Sede","Asignatura"]
            this.api().columns([1,2]).every( function (index) {
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

    $("#descargar-lista").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });

    $('#limpiar-filtros').click(btnClearFilters);
    $("#table-evaluado").show(); 


}

function btnClearFilters(){
    $('#select1').val("").niceSelect('update');
    $('#select2').val("").niceSelect('update');

    var table = $('#table-evaluado').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();

}