	$(document).ready(function(){
       localStorage.setItem('firsload', false);
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')

    $('#redirect').css('display','');

    $('#redirect').on('click',redirectModulo);
    loginvalid(localStorage.getItem('user'))
    autoload1()
    autoload2()
 
    
     //getPersonal();

    //$('#guardar_persona').click(guardarPersonal);

    //$('input:radio[name=inputExtranjero]').on('change',extranjero)



     // $("#inputRun").rut({

        // formatOn: 'keyup',

        // minimunLength: 8,

        // validateOn: 'change'

    // });

    $("#select-view").change(function () {
        if ($("#select-view").val()==1) {
            getPersonal(unoobt);
        }
        if ($("#select-view").val()==2) {
            getpostula(dosobt);
        }
       });

});

var unoobt;
var dosobt;
function autoload1(){
     $.ajax({

        method:'GET',

        url: webservice+'/monitoreo/personal/lista',
        //url: 'https://pruebadeconocimientos.iie.cl/api/web/monitoreo/personal/lista',

        headers:{

           't': JSON.parse(localStorage.user).token

        },

        crossDomain: true,

        dataType:'text',

        data:{ 

            id_usuario: JSON.parse(localStorage.user).id_usuario,

        },

        success: function(data, textStatus, jqXHR) {
            unoobt = JSON.parse(data);
        if (localStorage.getItem('firsload')=="false") {
        console.log(localStorage.getItem('firsload'))
        if ($("#select-view").val()==1) {
            console.log("val1")
            getPersonal(unoobt);
            localStorage.setItem('firsload', true);
        }
    }
            
        },

        error: function(jqXHR, textStatus, errorThrown) {

            showFeedback("error","Error en el servidor","Datos incorrectos");

            console.log("error del servidor, datos incorrectos");

 

        }

    })
}

function autoload2(){
    $.ajax({

        method:'GET',

        url: webservice+'/monitoreo/personal-por-estado/lista',
        //url: 'https://pruebadeconocimientos.iie.cl/api/web/monitoreo/personal-por-estado/lista',

        headers:{

           't': JSON.parse(localStorage.user).token

        },

        crossDomain: true,

        dataType:'text',

        data:{ 

            id_usuario: JSON.parse(localStorage.user).id_usuario,

        },

        success: function(data, textStatus, jqXHR) {
            dosobt = JSON.parse(data);
            if (localStorage.getItem('firsload')=="false") {
            
            if ($("#select-view").val()==2) {
                console.log("val2")
                getpostula(dosobt);
                localStorage.setItem('firsload', true);
            }
           }
        },

        error: function(jqXHR, textStatus, errorThrown) {

            showFeedback("error","Error en el servidor","Datos incorrectos");

            console.log("error del servidor, datos incorrectos");

 

        }

    })
}


function getpostula(response){
    //tabs
    $("#tab-postulacion").html("Postulantes")
    $("#tab-zonal").html("Capacitados")
    $("#tab-regional").html("Seleccionados")
    $("#tab-centro").html("Contratados")
    //vista 1
    $("#ttotal_supervisor").html("SUPERVISORES")
    $("#ttotal_capacitados").html("EXAMINADORES")
    $("#ttotal_seleccionados").html("EXAM. DE APOYO")
    $("#ttotal_contratados").html("ANFITRION")
    $("#change_post").html("SUPERVISORES")
    $("#change_capa").html("EXAMINADORES")
    $("#change_sele").html("EXAM. DE APOYO")
    $("#change_contr").html("ANFITRION")
    //vista 2
    $("#ttotal_supervisor2").html("SUPERVISORES")
    $("#ttotal_capacitados2").html("EXAMINADORES")
    $("#ttotal_seleccionados2").html("EXAM. DE APOYO")
    $("#ttotal_contratados2").html("ANFITRION")
    $("#change_post2").html("SUPERVISORES")
    $("#change_capa2").html("EXAMINADORES")
    $("#change_sele2").html("EXAM. DE APOYO")
    $("#change_contr2").html("ANFITRION")
    //vista 3
    $("#ttotal_supervisor3").html("SUPERVISORES")
    $("#ttotal_capacitados3").html("EXAMINADORES")
    $("#ttotal_seleccionados3").html("EXAM. DE APOYO")
    $("#ttotal_contratados3").html("ANFITRION")
    $("#change_post3").html("SUPERVISORES")
    $("#change_capa3").html("EXAMINADORES")
    $("#change_sele3").html("EXAM. DE APOYO")
    $("#change_contr3").html("ANFITRION")
    //vista 4
    $("#ttotal_supervisor4").html("SUPERVISORES")
    $("#ttotal_capacitados4").html("EXAMINADORES")
    $("#ttotal_seleccionados4").html("EXAM. DE APOYO")
    $("#ttotal_contratados4").html("ANFITRION")
    $("#change_pos4").html("SUPERVISORES")
    $("#change_cap4").html("EXAMINADORES")
    $("#change_sel4").html("EXAM. DE APOYO")
    $("#change_cont4").html("ANFITRION")


    llenarVista(response["descripcion"]["0"]["data_estado"],response["descripcion"]["contador"]["reclutado"],response["descripcion"]["contador"].total_reclutado);
    llenarVista2(response["descripcion"]["2"]["data_estado"],response["descripcion"]["contador"]["capacitado"],response["descripcion"]["contador"].total_capacitado);
    llenarVista3(response["descripcion"]["3"]["data_estado"],response["descripcion"]["contador"]["seleccionado"],response["descripcion"]["contador"].total_seleccionado);
    llenarVista4(response["descripcion"]["4"]["data_estado"],response["descripcion"]["contador"]["contratado"],response["descripcion"]["contador"].total_contratado);
    //console.log(response["descripcion"]["0"]["data_estado"])
   
    
       
     

}

function getPersonal(response){
    //tabs
    $("#tab-postulacion").html("Supervisores")
    $("#tab-zonal").html("Examinadores")
    $("#tab-regional").html("Examinadores de Apoyo")
    $("#tab-centro").html("Anfitrión")
    //vista 1
    $("#ttotal_supervisor").html("POSTULANTES")
    $("#ttotal_capacitados").html("CAPACITADOS")
    $("#ttotal_seleccionados").html("SELECCIONADOS")
    $("#ttotal_contratados").html("CONTRATADOS")
    $("#change_post").html("POSTULANTES")
    $("#change_capa").html("CAPACITADOS")
    $("#change_sele").html("SELECCIONADOS")
    $("#change_contr").html("CONTRATADOS")
    $("#change_tota").html("TOTAL")
    
    //vista 2
    $("#ttotal_supervisor2").html("POSTULANTES")
    $("#ttotal_capacitados2").html("CAPACITADOS")
    $("#ttotal_seleccionados2").html("SELECCIONADOS")
    $("#ttotal_contratados2").html("CONTRATADOS")
    $("#change_post2").html("POSTULANTES")
    $("#change_capa2").html("CAPACITADOS")
    $("#change_sele2").html("SELECCIONADOS")
    $("#change_contr2").html("CONTRATADOS")
    $("#change_tota2").html("TOTAL")
    //vista 3
    $("#ttotal_supervisor3").html("POSTULANTES")
    $("#ttotal_capacitados3").html("CAPACITADOS")
    $("#ttotal_seleccionados3").html("SELECCIONADOS")
    $("#ttotal_contratados3").html("CONTRATADOS")
    $("#change_post3").html("POSTULANTES")
    $("#change_capa3").html("CAPACITADOS")
    $("#change_sele3").html("SELECCIONADOS")
    $("#change_contr3").html("CONTRATADOS")
    $("#change_tota3").html("TOTAL")
    //vista 4
    $("#ttotal_supervisor4").html("POSTULANTES")
    $("#ttotal_capacitados4").html("CAPACITADOS")
    $("#ttotal_seleccionados4").html("SELECCIONADOS")
    $("#ttotal_contratados4").html("CONTRATADOS")
    $("#change_pos4").html("POSTULANTES")
    $("#change_cap4").html("CAPACITADOS")
    $("#change_sel4").html("SELECCIONADOS")
    $("#change_cont4").html("CONTRATADOS")
    $("#change_tota4").html("TOTAL")
    //console.log(response)
    llenarVista(response["descripcion"]["1"]["data_rol"],response["descripcion"]["contador"]["Supervisor"],response);
    llenarVista2(response["descripcion"]["0"]["data_rol"],response["descripcion"]["contador"]["Examinador"],response);
    llenarVista3(response["descripcion"]["4"]["data_rol"],response["descripcion"]["contador"]["examinador_de_apoyo"],response);
    llenarVista4(response["descripcion"]["3"]["data_rol"],response["descripcion"]["contador"]["anfitrion"],response);
    

}



supervisor = 0;
examinador = 0;
examinadorap=0;
anfitrion=0;

function llenarVista(data,data2,data3){

    $('#filtros-postulacion').empty();
    if($.fn.dataTable.isDataTable('#table-postulacion')){
        $('#table-postulacion').DataTable().destroy();
        $('#lista-postulacion').empty();
    }
	
	trData = '';
	nro = 1;
	for (var j = 0; j < data.length; j++){
		for (var k = 0; k < data[j]["data_region"].length; k++){	
			//console.log(data[j]["data_region"][0].comuna);
			//for (var x = 0; x < data[j]["data_region"][k]["data_comuna"].length; x++){	
			
				if ($("#select-view").val()==1) {
                    var sum= data[j]["data_region"][k].data_comuna.reclutado+data[j]["data_region"][k].data_comuna.capacitado+data[j]["data_region"][k].data_comuna.seleccionado+data[j]["data_region"][k].data_comuna.contratado
                    trData+= '<tr>';    
                trData+= '<td style="text-align:center">' + nro + '</td>'
                trData+= '<td>' + data[j]["region"] + '</td>'
                trData+= '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.reclutado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.capacitado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.seleccionado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.contratado + '</td>'
                trData+= '<td style="text-align:center">' + sum + '</td>'
                trData+= '</tr>';   
            //}
                nro++;
                }
                if ($("#select-view").val()==2) {
                    var sum= data[j]["data_region"][k].data_comuna.Supervisor+data[j]["data_region"][k].data_comuna.Examinador+data[j]["data_region"][k].data_comuna.examinador_de_apoyo+data[j]["data_region"][k].data_comuna.anfitrion
                     trData+= '<tr>';    
                trData+= '<td style="text-align:center">' + nro + '</td>'
                trData+= '<td>' + data[j]["region"] + '</td>'
                trData+= '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.Supervisor + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.Examinador + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.examinador_de_apoyo + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.anfitrion + '</td>'
                trData+= '<td style="text-align:center">' + sum + '</td>'
                trData+= '</tr>';   
            //}
                nro++;
                }
				
		}
			// trData = '<tr>'
				// + '     <td style="border-right:1px solid #dddddd;">' + _data[j]["nro"] + '</td>'
				// + '     <td class="text-left" style="padding-left:10px; ' + borderCol + ' ">' + _data[j]["region"] + '</td>'
				// + '     <td class="text-center">' + _data[j]["inscritosD1"] + '</td>' 
				// + '     <td class="text-center">' + _data[j]["inscritosD2"] + '</td>' 
				// + '     <td class="text-center">' + _data[j]["inscritosD3"] + '</td>' 
				// + '     <td class="text-center" style="border-right:3px solid #dddddd;">' + _data[j]["inscritosD4"]    + '</td>'
				// + '   </tr>'
		
	}

	$('#lista-postulacion').append(trData);	

    var tablaD = $("#table-postulacion").DataTable({
        dom: "",
        buttons: [
            {
                extend: 'excel',
                title: 'Postulantes',
                /*exportOptions: {

                    modifier: {

                        page: 'current'

                    },

                    columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

                }*/
                exportOptions: {
                    columns: [ 0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13,14,15,16,17,18,19,20,21,22,23,24,25,26],
                }
            }
        ],

        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        language:spanishTranslation,
        lengthChange: true,
        info: false,
        /*columnDefs: [
            { targets: [0,1,2,3,5,6,7], searchable: false }
        ],*/
        paging: false,
        displayLength: -1,
        ordering: true, 
        order: [],
        search: true,
        data: data.personal_postulacion,
        responsive: true, 
        /*columnDefs: [{
            targets: 9,
            orderable: false
        }],*/
        // columns:[
            // {data: "region"},
            // {data: "comuna"},
            // {data: "nombre_rol"},
            // {data: "run"},
            // {data: "nombres"},
            // {data: "apellido_paterno"},
        // ],

         "rowCallback": function( row, data ) {
                supervisor++; 
        },

        "initComplete": function(settings, json) {
            //$('#inputRolAsignado').prop('disabled',true)
            var checkbox = $('input:checkbox[name=inputRolAsignado]')
            for (var i = 0; i < checkbox.length; i++) {
                checkbox[i].disabled = true;
            }
            $('#divRol').css('display','none')
            var placeholder = ["","Región","Comuna"]
            this.api().columns([1,2]).every( function (index) {
                var column = this;
                var select = $('<select class="form-control col-sm-2 small _filtros"  id="select'+index+'" >'+
                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')
                    .appendTo( $('#filtros-postulacion'))
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
                        $('#select'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     
                    }
                } );
                $('#select'+index).niceSelect();    
            })   
            $('.dataTables_length select').addClass('nice-select small');         
        },

        "drawCallback": function(){
            var placeholder = ["","Región","Comuna"]
            this.api().columns([1,2]).every( function (index) {
                var columnFiltered = this;
                var selectFiltered = $("#select"+index)
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
        }
    });

    if ($("#select-view").val()==1) {
            $('#total_supervisor').html(data2.reclutado)
            $('#total_capacitados').html(data2.capacitado)
            $('#total_seleccionados').html(data2.seleccionado)
            $('#total_contratados').html(data2.contratado)
            $('#ttotal').html(data2.reclutado+data2.seleccionado+data2.capacitado+data2.contratado)
            
        }
        if ($("#select-view").val()==2) {
            $('#total_supervisor').html(data2.Supervisor)
            $('#total_capacitados').html(data2.Examinador)
            $('#total_seleccionados').html(data2.examinador_de_apoyo)
            $('#total_contratados').html(data2.anfitrion)
            $('#ttotal').html(data3)
        }

    
    $('#limpiar-filtros-postulacion').click(btnClearFilters);

    $("#descargar-lista").on("click", function() {
        tablaD.button( '.buttons-excel' ).trigger();
    });

    $("#table-postulacion").show();  
}

function llenarVista2(data,data2,data3){

     

    $('#filtros-zonal').empty();

    if($.fn.dataTable.isDataTable('#table-zonal')){

        $('#table-zonal').DataTable().destroy();

        $('#lista-zonal').empty();

    }

	trData = '';
	nro = 1;
	for (var j = 0; j < data.length; j++){
		for (var k = 0; k < data[j]["data_region"].length; k++){	
			//console.log(data[j]["data_region"][0].comuna);
			//for (var x = 0; x < data[j]["data_region"][k]["data_comuna"].length; x++){	
			     
				
				if ($("#select-view").val()==1) {
                    var sum= data[j]["data_region"][k].data_comuna.reclutado+data[j]["data_region"][k].data_comuna.capacitado+data[j]["data_region"][k].data_comuna.seleccionado+data[j]["data_region"][k].data_comuna.contratado
                    trData+= '<tr>';    
                trData+= '<td style="text-align:center">' + nro + '</td>'
                trData+= '<td>' + data[j]["region"] + '</td>'
                trData+= '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.reclutado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.capacitado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.seleccionado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.contratado + '</td>'
                trData+= '<td style="text-align:center">' + sum + '</td>'
                trData+= '</tr>';   
            //}
                nro++;
                }
                if ($("#select-view").val()==2) {
                    var sum= data[j]["data_region"][k].data_comuna.Supervisor+data[j]["data_region"][k].data_comuna.Examinador+data[j]["data_region"][k].data_comuna.examinador_de_apoyo+data[j]["data_region"][k].data_comuna.anfitrion
                     trData+= '<tr>';    
                trData+= '<td style="text-align:center">' + nro + '</td>'
                trData+= '<td>' + data[j]["region"] + '</td>'
                trData+= '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.Supervisor + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.Examinador + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.examinador_de_apoyo + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.anfitrion + '</td>'
                trData+= '<td style="text-align:center">' + sum + '</td>'
                trData+= '</tr>';   
            //}
                nro++;
                }
            }
	}	
	$('#lista-zonal').append(trData);		

    var tablaD = $("#table-zonal").DataTable({

        dom: "",

        

        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],

        language:spanishTranslation,

        lengthChange: true,

        info: false,

        /*columnDefs: [

            { targets: [0,1,2,3,5,6,7], searchable: false }

        ],*/

        paging: false,

        displayLength: -1,

        ordering: true, 

        order: [],

        search: true,

        data: data.coordinador_zonal,

        responsive: true, 

        /*columnDefs: [{

            targets: 9,

            orderable: false

        }],*/

       /* columns:[

            
            {data: "region"},

            {data: "comuna"},

            {data: "nombre_rol"},

            {data: "run"},

            {data: "nombres"},

            {data: "apellido_paterno"},

        ],*/

        "rowCallback": function( row, data ) {

         
                examinador++; 

            

        },

        "initComplete": function(settings, json) {

            var placeholder = ["","Región","Comuna"]

            this.api().columns([1,2]).every( function (index) {

                var column = this;

                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectZ_'+index+'" >'+

                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')

                    .appendTo( $('#filtros-zonal'))

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

                        $('#selectZ_'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     

                    }

                    

                } );

                 $('#selectZ_'+index).niceSelect();        

            })   



            $('.dataTables_length select').addClass('nice-select small');         

        },

        "drawCallback": function(){

           var placeholder = ["","Región","Comuna"]

            this.api().columns([1,2]).every( function (index) {

                var columnFiltered = this;

                var selectFiltered = $("#selectZ_"+index)

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

        }

  });

    if ($("#select-view").val()==1) {
            $('#total_supervisor2').html(data2.reclutado)
            $('#total_capacitados2').html(data2.capacitado)
            $('#total_seleccionados2').html(data2.seleccionado)
            $('#total_contratados2').html(data2.contratado)
            $('#ttotal2').html(data2.reclutado+data2.seleccionado+data2.capacitado+data2.contratado)
        }
        if ($("#select-view").val()==2) {
            $('#total_supervisor2').html(data2.Supervisor)
            $('#total_capacitados2').html(data2.Examinador)
            $('#total_seleccionados2').html(data2.examinador_de_apoyo)
            $('#total_contratados2').html(data2.anfitrion)
            $('#ttotal2').html(data3)
        }

    $('#limpiar-filtros-zonal').click(btnClearFilters);

   // $('#total-centro').html(data.centros_confirmados.length);

    $("#table-zonal").show();  

    //llenarVista3(data)

}



function llenarVista3(data,data2,data3){

     //console.log(data)

    $('#filtros-regional').empty();

    if($.fn.dataTable.isDataTable('#table-regional')){

        $('#table-regional').DataTable().destroy();

        $('#lista-regional').empty();

    }

	trData = '';
	nro = 1;
	for (var j = 0; j < data.length; j++){
		for (var k = 0; k < data[j]["data_region"].length; k++){	
			//console.log(data[j]["data_region"][0].comuna);
			//for (var x = 0; x < data[j]["data_region"][k]["data_comuna"].length; x++){	
			
				
				if ($("#select-view").val()==1) {
                    var sum= data[j]["data_region"][k].data_comuna.reclutado+data[j]["data_region"][k].data_comuna.capacitado+data[j]["data_region"][k].data_comuna.seleccionado+data[j]["data_region"][k].data_comuna.contratado
                    trData+= '<tr>';    
                trData+= '<td style="text-align:center">' + nro + '</td>'
                trData+= '<td>' + data[j]["region"] + '</td>'
                trData+= '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.reclutado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.capacitado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.seleccionado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.contratado + '</td>'
                trData+= '<td style="text-align:center">' + sum + '</td>'
                trData+= '</tr>';   
            //}
                nro++;
                }
                if ($("#select-view").val()==2) {
                    var sum= data[j]["data_region"][k].data_comuna.Supervisor+data[j]["data_region"][k].data_comuna.Examinador+data[j]["data_region"][k].data_comuna.examinador_de_apoyo+data[j]["data_region"][k].data_comuna.anfitrion
                     trData+= '<tr>';    
                trData+= '<td style="text-align:center">' + nro + '</td>'
                trData+= '<td>' + data[j]["region"] + '</td>'
                trData+= '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.Supervisor + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.Examinador + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.examinador_de_apoyo + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.anfitrion + '</td>'
                trData+= '<td style="text-align:center">' + sum + '</td>'
                trData+= '</tr>';   
            //}
                nro++;
                }
		}
	}	
	$('#lista-regional').append(trData);		


    var tablaD = $("#table-regional").DataTable({

        dom: "", 

        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],

        language:spanishTranslation,

        lengthChange: true,

        info: false,

        /*columnDefs: [

            { targets: [0,1,2,3,5,6,7], searchable: false }

        ],*/

        paging: false,

        displayLength: -1,

        ordering: true, 

        order: [],

        search: true,

        data: data.coordinador_regional,

        responsive: true, 

        /*columnDefs: [{

            targets: 9,

            orderable: false

        }],*/

        // columns:[

            // {data: "region"},

            // {data: "comuna"},

            // {data: "nombre_rol"},

            // {data: "run"},

            // {data: "nombres"},

            // {data: "apellido_paterno"},

        // ],

        "rowCallback": function( row, data ) {

         
                examinadorap++; 

            

        },

        "initComplete": function(settings, json) {

            var placeholder = ["","Región","Comuna"]

            this.api().columns([1,2]).every( function (index) {

                var column = this;

                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectR_'+index+'" >'+

                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')

                    .appendTo( $('#filtros-regional'))

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

        }

  });

    if ($("#select-view").val()==1) {
            $('#total_supervisor3').html(data2.reclutado)
            $('#total_capacitados3').html(data2.capacitado)
            $('#total_seleccionados3').html(data2.seleccionado)
            $('#total_contratados3').html(data2.contratado)
            $('#ttotal3').html(data2.reclutado+data2.seleccionado+data2.capacitado+data2.contratado)
        }
        if ($("#select-view").val()==2) {
            $('#total_supervisor3').html(data2.Supervisor)
            $('#total_capacitados3').html(data2.Examinador)
            $('#total_seleccionados3').html(data2.examinador_de_apoyo)
            $('#total_contratados3').html(data2.anfitrion)
            $('#ttotal3').html(data3)
        }
  
    // $('#total_anfitrion').html(postulantes+'/-')
    $('#limpiar-filtros-examinadorap').click(btnClearFilters);

   // $('#total-centro').html(data.centros_confirmados.length);

    $("#table-regional").show();  

    //llenarVista4(data)

}



function llenarVista4(data,data2,data3){

     

    $('#filtros-centro').empty();

    if($.fn.dataTable.isDataTable('#table-centro')){

        $('#table-centro').DataTable().destroy();

        $('#lista-centro').empty();

    }

	trData = '';
	nro = 1;
	for (var j = 0; j < data.length; j++){
		for (var k = 0; k < data[j]["data_region"].length; k++){	
			//console.log(data[j]["data_region"][0].comuna);
			//for (var x = 0; x < data[j]["data_region"][k]["data_comuna"].length; x++){	
			
				
				if ($("#select-view").val()==1) {
                    var sum= data[j]["data_region"][k].data_comuna.reclutado+data[j]["data_region"][k].data_comuna.capacitado+data[j]["data_region"][k].data_comuna.seleccionado+data[j]["data_region"][k].data_comuna.contratado
                    trData+= '<tr>';    
                trData+= '<td style="text-align:center">' + nro + '</td>'
                trData+= '<td>' + data[j]["region"] + '</td>'
                trData+= '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.reclutado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.capacitado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.seleccionado + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.contratado + '</td>'
                trData+= '<td style="text-align:center">' + sum + '</td>'
                trData+= '</tr>';   
            //}
                nro++;
                }
                if ($("#select-view").val()==2) {
                    var sum= data[j]["data_region"][k].data_comuna.Supervisor+data[j]["data_region"][k].data_comuna.Examinador+data[j]["data_region"][k].data_comuna.examinador_de_apoyo+data[j]["data_region"][k].data_comuna.anfitrion
                     trData+= '<tr>';    
                trData+= '<td style="text-align:center">' + nro + '</td>'
                trData+= '<td>' + data[j]["region"] + '</td>'
                trData+= '<td>' + data[j]["data_region"][k].comuna + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.Supervisor + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.Examinador + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.examinador_de_apoyo + '</td>'
                trData+= '<td style="text-align:center">' + data[j]["data_region"][k].data_comuna.anfitrion + '</td>'
                trData+= '<td style="text-align:center">' + sum + '</td>'
                trData+= '</tr>';   
            //}
                nro++;
                }
		}
	}	
	$('#lista-centro').append(trData);		


    var tablaD = $("#table-centro").DataTable({

        dom: "",

        

        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],

        language:spanishTranslation,

        lengthChange: true,

        info: false,

        /*columnDefs: [

            { targets: [0,1,2,3,5,6,7], searchable: false }

        ],*/

        paging: false,

        displayLength: -1,

        ordering: true, 

        order: [],

        search: true,

        data: data.coordinador_centro,

        responsive: true, 

        /*columnDefs: [{

            targets: 9,

            orderable: false

        }],*/

        // columns:[

            // {data: "region"},

            // {data: "comuna"},

            // {data: "nombre_rol"},

            // {data: "run"},

            // {data: "nombres"},

            // {data: "apellido_paterno"},

        // ],

         "rowCallback": function( row, data ) {

         
                anfitrion++; 

            

        },

        "initComplete": function(settings, json) {

            var placeholder = ["","Región","Comuna"]

            this.api().columns([1,2]).every( function (index) {

                var column = this;

                var select = $('<select class="form-control col-sm-2 small _filtros"  id="selectC_'+index+'" >'+

                    '<option value="" selected="selected">'+placeholder[index]+'</option></select>')

                    .appendTo( $('#filtros-centro'))

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

                        $('#selectC_'+index).append( '<option value="'+d.charAt(0).toUpperCase() + d.slice(1)+'">'+d.charAt(0).toUpperCase() + d.slice(1)+'</option>' )     

                    }

                    

                } );

                 $('#selectC_'+index).niceSelect();        

            })   



            $('.dataTables_length select').addClass('nice-select small');         

        },

        "drawCallback": function(){

            var placeholder = ["","Región","Comuna"]

            this.api().columns([1,2]).every( function (index) {

                var columnFiltered = this;

                var selectFiltered = $("#selectC_"+index)

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

        }

  });

    if ($("#select-view").val()==1) {
            $('#total_supervisor4').html(data2.reclutado)
            $('#total_capacitados4').html(data2.capacitado)
            $('#total_seleccionados4').html(data2.seleccionado)
            $('#total_contratados4').html(data2.contratado)
            $('#ttotal4').html(data2.reclutado+data2.seleccionado+data2.capacitado+data2.contratado)
        }
        if ($("#select-view").val()==2) {
            $('#total_supervisor4').html(data2.Supervisor)
            $('#total_capacitados4').html(data2.Examinador)
            $('#total_seleccionados4').html(data2.examinador_de_apoyo)
            $('#total_contratados4').html(data2.anfitrion)
            $('#ttotal4').html(data3)
        }
 

    $('#limpiar-filtros-anfitrion').click(btnClearFilters);

   // $('#total-centro').html(data.centros_confirmados.length);

    $("#table-centro").show();  

}



function btnClearFilters(){
    $('#select1').val("").niceSelect('update');
    $('#select2').val("").niceSelect('update'); 
    

    $('#selectZ_1').val("").niceSelect('update');
    $('#selectZ_2').val("").niceSelect('update'); 

    $('#selectR_1').val("").niceSelect('update');
    $('#selectR_2').val("").niceSelect('update');

    $('#selectC_1').val("").niceSelect('update');
    $('#selectC_2').val("").niceSelect('update');
    
    var table = $('#table-postulacion').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();
    var table = $('#table-zonal').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();
    var table = $('#table-regional').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();
    var table = $('#table-centro').DataTable();
        table
         .search( '' )
         .columns().search( '' )
         .draw();
         

}

// var regiones = ''

// function llenarSelects(data){

    

    // regiones = data.regiones;

    



    // $('#inputRegionNacimiento').html('').append('<option value="-1" selected="">Elegir...</option>') 

    // for(i = 0; i < data.regiones.length; i++){

        // $('#inputRegionNacimiento').append('<option value="'+data.regiones[i].id_region+'">'+data.regiones[i].nombre+'</option>') 

    // }



    // $('#inputRegionResidencia').html('').append('<option value="-1" selected="">Elegir...</option>') 

    // for(i = 0; i < data.regiones.length; i++){

        // $('#inputRegionResidencia').append('<option value="'+data.regiones[i].id_region+'">'+data.regiones[i].nombre+'</option>') 

    // }



    // $('#inputUniversidad').html('').append('<option value="-1" selected="">Elegir...</option>') 

    // for(i = 0; i < data.institucion.length; i++){

        // $('#inputUniversidad').append('<option value="'+data.institucion[i].id_institucion+'">'+data.institucion[i].institucion+'</option>') 

    // }



    // $('#inputRegionPostulacion').html('').append('<option value="-1" selected="">Elegir...</option>') 

    // for(i = 0; i < data.regiones.length; i++){

        // $('#inputRegionPostulacion').append('<option value="'+data.regiones[i].id_region+'">'+data.regiones[i].nombre+'</option>') 

    // }

// }



// function cargarComunas(input,id){

    // $('#'+input).html('')

    // $('#'+input).append('<option value="-1" selected="">Elegir...</option>') 

    // for(h = 0; h < regiones.length; h++){

        // if(regiones[h].id_region == id){

            // for(i = 0; i < regiones[h].comunas.length; i++){

                // $('#'+input).append('<option value="'+regiones[h].comunas[i].id_comuna+'">'+regiones[h].comunas[i].nombre+'</option>') 

            // }

        // }

    // }

// }



// function btnClearFilters(){

    // $('#select1').val("").niceSelect('update');

    // $('#select2').val("").niceSelect('update'); 

    // $('#select3').val("").niceSelect('update'); 

    // $('#select10').val("").niceSelect('update'); 



    // $('#selectC_1').val("").niceSelect('update');

    // $('#selectC_2').val("").niceSelect('update'); 

    // $('#selectC_3').val("").niceSelect('update'); 

    // var table = $('#table-postulacion').DataTable();

        // table

         // .search( '' )

         // .columns().search( '' )

         // .draw();

    // var table = $('#table-cargo').DataTable();

        // table

         // .search( '' )

         // .columns().search( '' )

         // .draw();



// }



// function nuevaPersona(){



    // localStorage.id_persona = -1;    

    // localStorage.id_persona_cargo = -1;

    // $('#divRol').css('display','')

    // var checkbox = $('input:checkbox[name=inputRolAsignado]')

    // for (var i = 0; i < checkbox.length; i++) {

        // checkbox[i].disabled = false;

  

    // }

 

    // limpiar()

    // disabledData()

    // $('#inputRun').prop('disabled',false)

    // $('#div-search').css('display','')

    // $('#titulo_modal').html('Nueva Persona');

    // $('#personalModal').modal({backdrop: 'static', keyboard: false},'show')

// }



// function searchRUN() {

    // if($("#inputRun").val() == ""){

        // showFeedback('error', 'Debe ingresar un RUN para realizar solicitud.', 'Error');

        // return;

    // }



    // if($.validateRut($("#inputRun").val()) == false) {

        // showFeedback('error', 'Debe ingresar un RUN válido.', 'Error');

        // return;

    // }



    // var run = ($('#inputRun').val().toUpperCase()).replace(/\./g,'');

    // limpiar()

    // $('#inputRun').val($.formatRut(run))

    // $.blockUI({

        // message: '<h1>Espere por favor</h1>',

        // baseZ: 2000

    // });



    // $.ajax({

        // method: 'POST',

        // url: webservice+'/personal/obtenerPersona',

        // headers: {

            // 't': JSON.parse(localStorage.user).token

        // },

        // crossDomain: true,

        // dataType: 'text',

        // data: { 

            // id_usuario: JSON.parse(localStorage.user).id_usuario,

            // run: run,

        // },

        // success: function(data, textStatus, jqXHR) {

            // var mensaje = JSON.parse(data);

            // if(typeof mensaje["resultado"] === 'undefined'){

                // console.log("correcto!")

                // cargarDatos(JSON.parse(data))

                // enabledData()

                // $.unblockUI();

            // }else{

                // if(mensaje["resultado"] == 'existe'){

                    // console.log("correcto!")

                    // showFeedback("warning", mensaje["descripcion"], "");

                    // disabledData()

                    // $('#inputRun').prop('disabled',false)

                    // $.unblockUI();



                // }else{

                    // showFeedback("warning", mensaje["descripcion"], "");

                    // enabledData()

                    // $.unblockUI();

                    // console.log("incorrecto!")

                // }

            // }

        // },

        // error: function(jqXHR, textStatus, errorThrown) {

            // //feedback

            // console.log(textStatus)

            // showFeedback("error","Error en el servidor","Error");

            // $.unblockUI();

            // console.log(textStatus);

        // }

    // });

// }



// function modificar(id,idPersonaCargo,postula){



    // if(postula == true){

        // $('#divRegionPostulacion').css('display','')

        // $('#divComunaPostulacion').css('display','')

        // $('#inputRegionPostulacion').prop('disabled',false)

        // $('#inputComunaPostulacion').prop('disabled',false)

    // }else{

        // $('#divRegionPostulacion').css('display','none')

        // $('#divComunaPostulacion').css('display','none')

        // $('#inputRegionPostulacion').prop('disabled',true)

        // $('#inputComunaPostulacion').prop('disabled',true)

    // }



    // var checkbox = $('input:checkbox[name=inputRolAsignado]')

    // for (var i = 0; i < checkbox.length; i++) {

        // checkbox[i].disabled = true;

  

    // }

    // $('#divRol').css('display','none')

    // $.ajax({

        // method:'POST',

        // url: webservice+'/personal/modificar',

        // headers:{

           // 't': JSON.parse(localStorage.user).token

        // },

        // crossDomain: true,

        // dataType:'text',

        // data :{ 

                // id_usuario: JSON.parse(localStorage.user).id_usuario,

                // id_persona : id,

                // id_persona_cargo : idPersonaCargo

        // },

        // success: function(data, textStatus, jqXHR) {

            // data = JSON.parse(data) 

            // console.log(data)



            // if (data.resultado == undefined) {

                // cargarDatos(data)

            // }else {

                // showFeedback("error",data.resultado,"Error");

                // console.log("invalidos");

            // }

        // },

        // error: function(jqXHR, textStatus, errorThrown) {

            // showFeedback("error","Error en el servidor","Datos incorrectos");

            // console.log("error del servidor, datos incorrectos");

 

        // }

    // }) 

// }



// function verDocs(id){

    // $.ajax({

        // method:'POST',

        // url: webservice+'/personal/documentos',

        // headers:{

           // 't': JSON.parse(localStorage.user).token

        // },

        // crossDomain: true,

        // dataType:'text',

        // data :{ 

                // id_usuario: JSON.parse(localStorage.user).id_usuario,

                // id_persona : id,

        // },

        // success: function(data, textStatus, jqXHR) {

            // data = JSON.parse(data) 

            // console.log(data)



            // if (data.resultado == undefined) {

                // cargarDocs(data)

            // }else {

                // showFeedback("error",data.resultado,"Error");

                // console.log("invalidos");

            // }

        // },

        // error: function(jqXHR, textStatus, errorThrown) {

            // showFeedback("error","Error en el servidor","Datos incorrectos");

            // console.log("error del servidor, datos incorrectos");

 

        // }

    // })

// }



// function cargarDocs(data){



    // if($.fn.dataTable.isDataTable('#table-documentos')){

        // $('#table-documentos').DataTable().destroy();

        // $('#lista-documentos').empty();

    // }



    // var tablaD = $("#table-documentos").DataTable({

        // //dom: "<'search'f>",

        // lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Todos"]],

        // language:spanishTranslation,

        // lengthChange: true,

        // info: false,

        // paging: false,

        // displayLength: -1,

        // ordering: true, 

        // order: [],

        // searching: false,

        // data: data,

        // responsive: true, 

        // columns:[

            // {data: "doc",

                // render: function(data, type, row){ 

                    // return  row.tipo+row.nombre_archivo;

                // }

            // },

            // {data: "descargar",

                // render: function(data, type, row){ 

                    // return '<button type="button" class="btn btn-primary btn-sm _btn-item"><i class="fa fa-pencil-alt"></i></button>'

                    

                // }

            // },

        // ],

        // "rowCallback": function( row, data ) {

            // console.log($('td:eq(1)', row).find('button'))

            // $('td:eq(1)', row).find('button').data('doc_nombre',data.tipo+data.nombre_archivo);

            // $('td:eq(1)', row).find('button').data('t_descarga',data.token_descarga);

            // $('td:eq(1)', row).find('button').data('extension',data.extension);

            // $('td:eq(1)', row).find('button').on('click',verDocumento);

        // },

  // });

 

    // $('#docsModal').modal({backdrop: 'static', keyboard: false},'show') 

// }



// function verDocumento(){

    // $('#titulo_modal_doc').html('Documento: ' +$(this).data('doc_nombre'))

    // if($(this).data('extension') == 'png' || $(this).data('extension') == 'jpg'){

        // $('#content-doc').html('<img class="ver-docs" src="https://ecep2019.iie.cl/public/api/personas/descarga/archivo/'+$(this).data('t_descarga')+'">')

    // }else{

        // $('#content-doc').html('<iframe id="iframeDoc" class="ver-docs" src="https://docs.google.com/viewer?url=https://ecep2019.iie.cl/public/api/personas/descarga/archivo/'+$(this).data('t_descarga')+'&embedded=true"></iframe>')

         // //$('#iframeDoc').attr('src','https://docs.google.com/viewer?url=https://ecep2019.iie.cl/public/api/personas/descarga/archivo/'+ $(this).data('t_descarga')+'&embedded=true')

    // }

    

    // //window.open('https://docs.google.com/viewer?url=https://ecep2019.iie.cl/public/api/personas/descarga/archivo/'+ $(this).data('t_descarga'), '_blank');

    // $('#verDocModal').modal('show')  

// }

// function cerrarDoc(){

  // $('#verDocModal').modal('hide')    

// }

 

// function extranjero(){

    // if(this.value == 'No'){

        // $('#inputExtranjero_no').prop('checked',true);

        // $('#reginNacimiento').css('display','')

        // $('#comunaNacimiento').css('display','')

    // }else{

        // $('#inputExtranjero_si').prop('checked',true);

        // $('#reginNacimiento').css('display','none')

        // $('#comunaNacimiento').css('display','none')

    // }

// }



// function cargarDatos(data){

    // $('#div-search').css('display','none')

    // $('#titulo_modal').html('Modificar Persona');

    // localStorage.id_persona = data.id_persona;

    // localStorage.id_persona_cargo = data.id_persona_cargo == null ? -1 : data.id_persona_cargo;

    // limpiar()

    // enabledData()

    // $('#inputRun').val($.formatRut(data.run))

    // $('#inputNombres').val(data.nombres)

    // $('#inputApellidoPaterno').val(data.apellido_paterno)

    // $('#inputApellidoMaterno').val(data.apellido_materno)



    // $('#inputSexo').val(data.id_sexo == null ? -1 : data.id_sexo)

    // $('#inputEstadoCivil').val(data.id_estado_civil == null ? -1 : data.id_estado_civil)

    // $('#inputFechaNacimiento').val(data.fecha_nacimiento)

    // $('#inputNacionalidad').val(data.nacionalidad)

    // if(/*data.nacionalidad == null || (data.nacionalidad).trim().toLowerCase() == 'chile' || (data.nacionalidad).trim().toLowerCase() == 'chilena' ||*/ data.otra_nacionalidad == 'No'){

        // $('#inputExtranjero_no').prop('checked',true);

        // $('#reginNacimiento').css('display','')

        // $('#comunaNacimiento').css('display','')

    // }else{

        // $('#inputExtranjero_si').prop('checked',true);

        // $('#reginNacimiento').css('display','none')

        // $('#comunaNacimiento').css('display','none')

    // }



    // $('#inputRegionNacimiento').val(data.id_region_nacimiento == null ? -1 : data.id_region_nacimiento)

    // cargarComunas('inputComunaNacimiento', data.id_region_nacimiento)

    // $('#inputComunaNacimiento').val(data.id_comuna_nacimiento == null ? -1 : data.id_comuna_nacimiento)



    // $('#inputRegionResidencia').val(data.id_region_residencia == null ? -1 : data.id_region_residencia)

    // cargarComunas('inputComunaResidencia', data.id_region_residencia)

    // $('#inputComunaResidencia').val(data.id_comuna_residencia == null ? -1 : data.id_comuna_residencia)



    // $('#inputRegionPostulacion').val(data.id_region_postulacion == null ? -1 : data.id_region_postulacion)

    // cargarComunas('inputComunaPostulacion', data.id_region_postulacion)

    // $('#inputComunaPostulacion').val(data.id_comuna_postulacion == null ? -1 : data.id_comuna_postulacion)

 



    // $('#inputDireccion').val(data.domicilio)

    // $('#inputSector').val(data.domicilio_sector)

    // $('#inputMail').val(data.email)

    // $('#inputTelefono').val(data.telefono)

    // $('#inputNivelEstudios').val(data.nivel_estudios == null ? -1 : data.nivel_estudios)

    // $('#inputProfesion').val(data.profesion)



    // $('#inputUniversidad').val(data.id_institucion == null ? -1 : data.id_institucion)



    // /*$('#inputRegionAsignada').val()*/

    // $('#inputNroCuenta').val(data.banco_nro_cuenta)

    // $('#inputTipoCuenta').val(data.banco_tipo_cuenta)

    // $('#inputBanco').val(data.banco_nombre)

 



    // /*$('#inputEstado').val(data.estado)*/

    // //$('#inputRolAsignado').val(data.id_cargo == null ? -1 : data.id_cargo)





    // $('#personalModal').modal({backdrop: 'static', keyboard: false},'show')

// }



// function guardarPersonal(){

    // var checkbox = $('input:checkbox[name=inputRolAsignado]')

    // cargos = [];

    // for (var i = 0; i < checkbox.length; i++) {

        // if(checkbox[i].checked == true){

            // cargos.push(checkbox[i].value)

        // }

         

    // }

    // if(validar() == true){

        // $.ajax({

            // method:'POST',

            // url: webservice+'/personal/guardar',

            // headers:{

               // 't': JSON.parse(localStorage.user).token

            // },

            // crossDomain: true,

            // dataType:'text',

            // data :{ 

                    // id_usuario: localStorage.id_usuario,

                    // id_persona: localStorage.id_persona,

                    // id_persona_cargo: localStorage.id_persona_cargo,

                    // run: ($('#inputRun').val().toUpperCase()).replace(/\./g,''),

                    // nombres: $('#inputNombres').val(),

                    // apellido_paterno: $('#inputApellidoPaterno').val(),

                    // apellido_materno: $('#inputApellidoMaterno').val(),

                    // email: $('#inputMail').val(),

                    // telefono: $('#inputTelefono').val(),

                    // id_comuna_nacimiento: $('#inputComunaNacimiento').val() == -1 ? null : $('#inputComunaNacimiento').val(),

                    // id_cargo: cargos,

                    // //id_cargo: $('#inputRolAsignado').attr('disabled') == true ? null : $('#inputRolAsignado').val(),

                    // //estado:   $('#inputEstado').val(),

                    // id_sexo: $('#inputSexo').val() == -1 ? null : $('#inputSexo').val(),

                    // id_estado_civil: $('#inputEstadoCivil').val() == -1 ? null : $('#inputEstadoCivil').val(),

                    // id_institucion: $('#inputUniversidad').val() == -1 ? null : $('#inputUniversidad').val(),

                    // id_comuna_residencia: $('#inputComunaResidencia').val() == -1 ? null : $('#inputComunaResidencia').val(),

                    // nacionalidad: $('#inputNacionalidad').val(),

                    // domicilio: $('#inputDireccion').val(),

                    // domicilio_sector: $('#inputSector').val(),

                    // fecha_nacimiento: $('#inputFechaNacimiento').val(),

                    // nivel_estudios: $('#inputNivelEstudios').val() == -1 ? null : $('#inputNivelEstudios').val(),

                    // profesion: $('#inputProfesion').val(),

                    // banco_nro_cuenta: $('#inputNroCuenta').val(),

                    // banco_tipo_cuenta: $('#inputTipoCuenta').val(),

                    // banco_nombre: $('#inputBanco').val(),

                    // otra_nacionalidad: $('input:radio[name=inputExtranjero]').val(),

                    // id_comuna_postulacion:$('#inputComunaPostulacion').val() == -1 ? null : $('#inputComunaPostulacion').val()





                // },

            // success: function(data, textStatus, jqXHR) {

                // data = JSON.parse(data) 

                // console.log(data)



                // if (data.resultado != "error") {

                    // showFeedback("success", data.descripcion, "Guardado");

                    // $('#personalModal').modal('hide');

                    // getPersonal()

                // } else {

                    // showFeedback("error","Error al guardar","Error");

                    // console.log("invalidos");

                // }

            // },

            // error: function(jqXHR, textStatus, errorThrown) {

                // showFeedback("error","Error en el servidor","Datos incorrectos");

                // console.log("error del servidor, datos incorrectos");

     

            // }

        // })

    // }

// }



// function validar(){

    // var input = document.getElementsByTagName("input");

    // valida = true



    // if($('#inputRun').val().length < 1){

        // valida = false

        // $('#inputRun').addClass('is-invalid')

    // }else{

        // $('#inputRun').removeClass('is-invalid')

    // }



    // if($('#inputNombres').val().length < 1){

        // valida = false

        // $('#inputNombres').addClass('is-invalid')

    // }else{

        // $('#inputNombres').removeClass('is-invalid')

    // }



    // if($('#inputApellidoPaterno').length < 1){

        // valida = false

        // $('#inputApellidoPaterno').addClass('is-invalid')

    // }else{

        // $('#inputApellidoPaterno').removeClass('is-invalid')

    // }



    // if($('#divRol').is(":visible")){

        // if($('input:checkbox[name=inputRolAsignado]').is(':checked') == false){

            // $("#rol-no-select").show()

            // valida = false

        // }else{

            // $("#rol-no-select").hide()



        // }

    // }

    

    // return valida;

// }



// function limpiar(){

    // var input = document.getElementsByTagName("input");

    

    // for (var i = 0; i < input.length; i++) {

        // if(input[i].type != 'checkbox' && input[i].type != 'radio'){

            // input[i].value = '';

            // input[i].disabled = false;

            // $(input[i]).removeClass('is-invalid')

        // }

    // }

    // $("#rol-no-select").hide()

    // $('#inputSexo').val('-1') 

    // $('#inputNivelEstudios').val('-1') 

    // $('#inputEstadoCivil').val('-1') 

    // $('#inputRegionNacimiento').val('-1') 

    // $('#inputRegionResidencia').val('-1') 

    // $('#inputRegionPostulacion').val('-1') 

    // $('#inputUniversidad').val('-1') 

    // //$('#inputRolAsignado').val('-1') 

    // var checkbox = $('input:checkbox[name=inputRolAsignado]')

    // for (var i = 0; i < checkbox.length; i++) {

        // checkbox[i].checked = false;

  

    // }

    // $('#inputRegionAsignada').val('-1') 

// }



// function disabledData(){

    // var input = document.getElementsByTagName("input");

    

    // for (var i = 0; i < input.length; i++) {

        // input[i].disabled = true

  

    // }

    // $('#inputExtranjero_no').prop('checked',true);

    // var select = document.getElementsByTagName("select");

    

    // for (var i = 0; i < select.length; i++) {

        // select[i].disabled = true

  

    // }



 

// }



// function enabledData(){

    // var input = document.getElementsByTagName("input");

    

    // for (var i = 0; i < input.length; i++) {

        // input[i].disabled = false

  

    // }

    // $('#inputExtranjero_no').prop('checked',true);

    // var select = document.getElementsByTagName("select");

    

    // for (var i = 0; i < select.length; i++) {

        // select[i].disabled = false

  

    // }



 

//	}

