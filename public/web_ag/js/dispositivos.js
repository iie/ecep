$(document).ready(function(){
	$('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectModulo);

    getDatos()
});

function getDatos(){
	$.ajax({
	    method:'GET',
	    url: webservice+'/monitoreo/mp3/lista',
	    headers:{
	      't': JSON.parse(localStorage.user).token
	    },
	    crossDomain: true,
	    dataType:'text',
	    data:{ 
	        //id_usuario: JSON.parse(localStorage.user).id_usuario,
	    },
	    success: function(data, textStatus, jqXHR) {
	        var dosobt = JSON.parse(data);
	        llenarVista(dosobt);
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	        showFeedback("error","Error en el servidor","Datos incorrectos");
	        console.log("error del servidor, datos incorrectos");
	    }

	})
}

ingles = 0;
totalGrabadosIngles = 0;
musica = 0;
totalGrabadosMusica = 0;
frances = 0;
totalGrabadosFrances = 0;
total= 0;
totalGrabados= 0;
totalRevisados = 0;
totalEtiquetados = 0;
totalAvance = 0;

function llenarVista(data){
    //grafico()
    $('#filtros').empty();
    data= data.mp3
    if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-mp3')){
            $('#table-mp3').DataTable().destroy();
            $('#lista-mp3').empty();
        }
    }
 

    var tablaD = $("#table-mp3").DataTable({
        dom: "",
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslation,
        lengthChange: true,
        info: false,
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
        search: true,
        data: data,
        responsive: true, 
        columns:[
            {data: "nro",className: "text-center",
                render: function(data, type, full, meta){
                    return  meta.row + 1;
                }
            },
            {data: "asignatura"},
            {data: "requerido",className: "text-center"},
            {data: "grabado",className: "text-center"},
            {data: "revisado",className: "text-center"},
            {data: "etiquetado",className: "text-center"},
            /*{data: "avance",className: "text-center",
            	render: function(data, type, full, meta){
                    return  '0%';
                }
        	},*/

        ],
        "rowCallback": function( row, data ) {
 
            if(data.tipo_mp3 == 1){
                ingles+= data.requerido; 
                totalGrabadosIngles+= data.grabado

            }else if(data.tipo_mp3 == 2){
                musica+= data.requerido; 
                totalGrabadosMusica+= data.grabado;
            }else if(data.tipo_mp3 == 3){
                frances+= data.requerido; 
                totalGrabadosFrances+= data.grabado;
            }
            total+=data.requerido; 
            totalGrabados += data.grabado;
            totalRevisados += data.revisado;
            totalEtiquetados += data.etiquetado;
        },
      /*  "initComplete": function(settings, json) {
            var placeholder = ["","Región","Comuna"]
            this.api().columns([1,2]).every( function (index) {
            var column = this;
            var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectR_'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-centros-aplicacion'))
                    .on( 'change', function () {
                    var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
                         column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );

                column.data().unique().each( function ( d, j ) {

                    if(d != null){

                        $('#selectR_'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     

                    }

                    

                } );

                 $('#selectR_'+index).niceSelect();        

            })   



            $('.dataTables_length select').addClass('nice-select small');         

        },

        "drawCallback": function(){

            var placeholder = ["","Región","Comuna"]

            this.api().columns([1,2]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#selectR_"+index)
                if(selectFiltered.val()===''){
                    selectFiltered.empty()
                    selectFiltered.append('<option value="">'+placeholder[index]+'</option>')
                    columnFiltered.column(index,{search:'applied'}).data().unique().each( function ( d, j ) {
                        if(d != null){
                            selectFiltered.append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )    
                        }               
                    } );
                }
                $('select').niceSelect('update');

            })

        }*/
    });

    //$('#limpiar-filtros-mp3').click(btnClearFilters);
 
    $('#mp3RequeridosIngles').html(ingles)
    $('#mp3RequeridosFrances').html(frances)
    $('#mp3RequeridosArtes').html(musica)

    $('#mp3GrabadosIngles').html(totalGrabadosIngles)
    $('#mp3GrabadosFrances').html(totalGrabadosFrances)
    $('#mp3GrabadosArtes').html(totalGrabadosMusica)

     
 
 

    $('#totalRequeridos').html(total)
    $('#totalGrabados').html(totalGrabados)
    $('#totalRevisados').html(totalRevisados)
    $('#totalEtiquetados').html(totalEtiquetados)
     
    $("#table-mp3").show(); 


}

function grafico(){
    Highcharts.chart('container', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            margin: [0, 0, 0, 0]
        },
        title: {
            text: 'AVANCE',
            align: 'center',
            verticalAlign: 'middle',
            y: 30
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            pie: {
                showInLegend: true,
                dataLabels: {
                     enabled: false
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '150%'
            }
        },
        
        series: [{
            type: 'pie',
            name: '',
            innerSize: '70%',
            data: [
                ['Avance', 0],
                ['Pendiente', 100],
            ]
        }]
    });

}
