$(document).ready(function(){
	getDatos()
});

function getDatos(){
	$.ajax({
	    method:'GET',
	    url: webservice+'/monitoreo/mp3/lista',
	    /*headers:{
	      't': JSON.parse(localStorage.user).token
	    },*/
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

function llenarVista(data){

    $('#filtros').empty();
    data= data.mp3
    if(data.length != 0){
        if($.fn.dataTable.isDataTable('#table-mp3')){
            $('#table-mp3').DataTable().destroy();
            $('#lista-mp3').empty();
        }
    }

    for (var i = 0; i < data.length; i++){   
        //var sum= data[j]["data_region"][k].data_comuna.reclutado+data[j]["data_region"][k].data_comuna.capacitado+data[j]["data_region"][k].data_comuna.seleccionado+data[j]["data_region"][k].data_comuna.contratado
        trData= '<tr id='+data[i].id_grabado_mp3+'>';    
        trData+= '<td>' + data[i].asignatura + '</td>'
        trData+= '<td><input class="form-control" value="'+(data[i].grabado == null ? 0 : data[i].grabado)+'" oninput="this.value=Numeros(this.value)"></input></td>'
        trData+= '<td><input class="form-control" value="'+(data[i].revisado == null ? 0 : data[i].revisado)+'" oninput="this.value=Numeros(this.value)"></input></td>'
        trData+= '<td><input class="form-control" value="'+(data[i].etiquetado == null ? 0 : data[i].etiquetado)+'" oninput="this.value=Numeros(this.value)"></input></td>'
        trData+= '</tr>';   

        $('#lista-mp3').append(trData);
       
    } 
 
 

    var tablaD = $("#table-mp3").DataTable({
        language:spanishTranslation,
        lengthChange: true,
        info: false,
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
        search: false, 
        responsive: true, 
        filter:false,

    });

    //$('#limpiar-filtros-mp3').click(btnClearFilters);


}

function guardar(){
    dispositivos = [];
    $("#lista-mp3 tr").each(function() {
        console.log(this)
        var id = $(this).attr('id')
        var grabado = $(this).find('td:nth-child(2) input').val() == "" ? 0 : $(this).find('td:nth-child(2) input').val()
        var revisados = $(this).find('td:nth-child(3) input').val() == "" ? 0 : $(this).find('td:nth-child(3) input').val()
        var etiquetados = $(this).find('td:nth-child(4) input').val() == "" ? 0 : $(this).find('td:nth-child(4) input').val()
         
        dispositivos.push({ id:id, grabado: grabado, revisados: revisados, etiquetados: etiquetados})
  

    })
 
    $.ajax({
        method:'GET',
        url: webservice+'/monitoreo/mp3/guardar',
        /*headers:{
          't': JSON.parse(localStorage.user).token
        },*/
        crossDomain: true,
        dataType:'text',
        data:{ 
            dispositivos: dispositivos
        },
        success: function(data, textStatus, jqXHR) {
            showFeedback("success", data.descripcion, "Guardado");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            showFeedback("error","Error en el servidor","Datos incorrectos");
            console.log("error del servidor, datos incorrectos");
        }

    })

}
