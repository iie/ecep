var $heightFooter;
var $heightSidebar;
var cantidadItemsConRecursos = 0;
var itemsConRecursos = 0;
$(document).ready(function() {
 
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres + ' ' + JSON.parse(localStorage.user).apellidos)
    resizeFooter(sizeDefecto);
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectSupervisorRevision)
    // $("#btn_file").on('click', subirArchivo);
    $("#btn_seleccionar").on('click', seleccionarArchivo);
    $("#button_archivo_adjunto0").on('click', function(){
    	$("#add-image").html("Agregar Imagen");
        // $("#finalizar").hide();
    });

    $('#guardar').css('display','none')
    $('#finalizar').css('display','none')

    $('#div-seccion-img').hide();
 

    
    // $("#show-sidebar").click(function() {
    //     if($(".page-wrapper").hasClass("toggled")== false){
    //          $(".page-wrapper").addClass("toggled");
    //          $('#icon_sidebar').css('transform','rotate(-180deg)')

    //             $('#icon_animation').css('transform','')
    //             $("#contenido-footer").height(0);
    //             $("#contenido-footer").hide();
    //             $("body").css("overflow", "auto");

    //     }else{
    //          $(".page-wrapper").removeClass("toggled");
    //          $('#icon_sidebar').css('transform','');
    //     }
        
    // });
    
    items = JSON.parse(localStorage.items)
 
    start = parseInt(localStorage.itemsSelected)+1
    
    $('#pagination').twbsPagination({
            totalPages: items.length,
            startPage: start,
            visiblePages: 10,
            // Text labels
            first: '',
            prev: '<i class="fas fa-angle-left"></i> Anterior',
            next: 'Siguiente <i class="fas fa-angle-right"></i>',
            last: '',
            // loop: false,
            onPageClick: function (event, page) {    



            },
            pageClass:'page-item'
    
        }).on('page', function (event, page) {
            localStorage.itemsSelected = (page-1)
            localStorage.item = items[(page-1)].id_item
            $.blockUI({ message: '<h1>Espere por favor</h1>' });          
            listarComponentesItem(items[(page-1)].id_item);

        });
    listarComponentesItem(items[localStorage.itemsSelected].id_item);

    $("#select-ficha").niceSelect();
    $("#select-ficha").on('change', function() {
        agregarClase($("#select-ficha"))
        evaluacion()
        if($(this).val()== 'observado'){
            $('#ficha_obs').attr('disabled',false)
        }else{
            $('#ficha_obs').val(null)
            $('#ficha_obs').attr('disabled',true)
        }
    });

    $("#select-estimulo").niceSelect();
    $("#select-estimulo").on('change', function() {
        agregarClase($("#select-estimulo"))
        evaluacion()
        if($(this).val()== 'observado'){
            $('#estimulo_obs').attr('disabled',false)
        }else{
            $('#estimulo_obs').val(null)
            $('#estimulo_obs').attr('disabled',true)
        }
    });

    $("#select-pregunta").niceSelect();
    $("#select-pregunta").on('change', function() {
        agregarClase($("#select-pregunta"))
        evaluacion()
        if($(this).val()== 'observado'){
            $('#pregunta_obs').attr('disabled',false)
        }else{
            $('#pregunta_obs').val(null)
            $('#pregunta_obs').attr('disabled',true)
        }
    });

    $("#select-alternativas").niceSelect();
    $("#select-alternativas").on('change', function() {
        agregarClase($("#select-alternativas"))
        evaluacion()
        if($(this).val()== 'observado'){
            $('#alternativa_obs').attr('disabled',false)
        }else{
            $('#alternativa_obs').val(null)
            $('#alternativa_obs').attr('disabled',true)
        }
    });

    $("#guardar").on('click',guardarItem);
    // $("#guardar").on('click',seleccionarArchivo);

    $("#finalizar").on('click',finalizarItem);


    jsonImagenes()
  

	// View a list of images
	//var gallery = new Viewer(document.getElementById('images'));

});

var alternativa = null;
var directorio = ""
var name_button = ""

function evaluacion(){
    if($("#select-ficha").val() == 'observado' || $("#select-estimulo").val() == 'observado' || $("#select-pregunta").val() == 'observado' || $("#select-alternativas").val() == 'observado'){
        $('#finalizar').css('display','none')
        $('#guardar').css('display','')
    }else if($("#select-ficha").val() == 'aprobado' && $("#select-estimulo").val() == 'aprobado' && $("#select-pregunta").val() == 'aprobado' && $("#select-alternativas").val() == 'aprobado'){
        $('#guardar').css('display','none')
        $('#finalizar').css('display','')
    }else{
        $('#finalizar').css('display','none')
    }
}

$('#adjuntarRecurso').on('show.bs.modal', function (event) {
  	var button = $(event.relatedTarget) 
	var tipo = button.data('tipo_recurso')
	alternativa = $(button).attr('id') == undefined ? null : $(button).attr('id')
	name_button = $(button).attr('name')
	// console.log(name_button)
 	$('#adjuntarRecursoTitle').html(''+tipo)
})


var sizeDefecto = 1;
$(window).resize(function() {
    resizeFooter(parseInt(localStorage.getItem('sizeScreen')));
});

function resizeFooter(size) {
    localStorage.sizeScreen = size;

    var screen = (($(window).height() < 900) ? "hd" : "fullhd");
    localStorage.screen = screen;

    switch (document.getElementById("contenido-footer").scrollHeight) {

        case 0:
            $("body").css("overflow", "auto");
            $("#espacioBlanco").height(($(window).height() / 2.6));
            $("#contenido-footer").height(($(window).height() / 2.3));
            $("#contenido-footer").show();
            $('#icon_animation').css('transform','rotate(-180deg)')
            recalcularEspacio();

            if($(".page-wrapper").hasClass("toggled") == true){
                $(".page-wrapper").removeClass("toggled");
                $('#icon_sidebar').css('transform','')
            }

            break;
        default:
            $("#espacioBlanco").height(0);
            $('#icon_animation').css('transform','')
            $("#contenido-footer").height(0);
            $("#contenido-footer").hide();
            $("body").css("overflow", "auto");
            
            break;
    }
    $heightFooter = $('#nav-footer').outerHeight(true);
    $heightSidebar = $('#sidebar').outerHeight(true);
}

function recalcularEspacio() {

    $('#card-body-observacion').height($("#contenido-footer").height() - 112);
    $("#ficha_obs").css("height", ($('#card-body-observacion').height() - 60) + "px");
    $("#estimulo_obs").css("height", ($('#card-body-observacion').height() - 60) + "px");
    $("#pregunta_obs").css("height", ($('#card-body-observacion').height() - 60) + "px");
    $("#alternativa_obs").css("height", ($('#card-body-observacion').height() - 60) + "px");

}

function listarComponentesItem(id) {
    //if (JSON.parse(localStorage.user).id_tipo_usuario == 135) {

        $.ajax({
            method: 'POST',
            "url": webservice + "/supervisor/carga/items/obtener",
            headers: {
                't': JSON.parse(localStorage.user).token,
            },
            crossDomain: true,
            dataType: 'text',
            data: {
                id_item: id,
                id_usuario: JSON.parse(localStorage.user).id_usuario,
            },
            success: function(data, textStatus, jqXHR) {
                if (data != "token invalido") {
                    limpiar()
                    if(JSON.parse(data).respuesta == undefined){
                         // $("#finalizar").css("display", "none");
                         // $("#finalizar").hide();
                        muestraItems(JSON.parse(data));
                        localStorage.infoItem = data;                        
                        //estadoFinal();
                    }else{
                        if(JSON.parse(data).descripcion = 'instruso_detected'){
                             showFeedback("error", "ERROR", "Error");
                        }                        
                        //disableData()                         
                        $('#info_finalizado').css('display','none')
                    }                         
                } else {
                    console.log("invalidos");
                }
                $.unblockUI();
                ocultarLoading()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                ocultarLoading()
                //disableData()
                limpiar()
                $('#info_finalizado').css('display','none')
            }
        });
    //}
}

function finalizarItem() {

    Swal.fire({
        title: '¿Está seguro que desea finalizar este Item?',
        showCancelButton: true,
        confirmButtonText: 'Si',
       // confirmButtonColor: '#3085d6',
        //cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',      
        reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                finalizar(true)  
            }
        })

}
function guardarItem() {
    if(validarCampos()){
     Swal.fire({
        title: 'Se enviarán las observaciones al Colaborador. ¿Desea continuar?',
        showCancelButton: true,
        confirmButtonText: 'Si',
       // confirmButtonColor: '#3085d6',
        //cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',      
        reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                finalizar(false) 
            }
        })
    }else{
        $.unblockUI();
        showFeedback("error", 'Existen campos incompletos.' , "Error");
    } 
    
}
 
function finalizar(opcion){
    $.blockUI({ message: '<h1>Espere por favor</h1>' });
    if(validarCampos()){
        $.ajax({
            method: 'POST',
            url: webservice + "/supervisor/carga/item/evalua",
            headers: {
                't': JSON.parse(localStorage.user).token,
            },
            crossDomain: true,
            dataType: 'text',
            data: {
                id_usuario: JSON.parse(localStorage.user).id_usuario,
                id_item: localStorage.item,
                ficha_aprobacion: ($("#select-ficha").val() == "-1" ? "" : $("#select-ficha").val()),
                ficha_observacion: $("#ficha_obs").val(),
                enunciado_aprobacion: ($("#select-estimulo").val() == "-1" ? "" : $("#select-estimulo").val()),
                enunciado_observacion: $("#estimulo_obs").val(),
                pregunta_aprobacion: ($("#select-pregunta").val() == "-1" ? "" : $("#select-pregunta").val()),
                pregunta_observacion: $("#pregunta_obs").val(),
                alternativa_aprobacion: ($("#select-alternativas").val() == "-1" ? "" : $("#select-alternativas").val()),
                alternativa_observacion: $("#alternativa_obs").val(),
                aprobado: opcion,
                corregido: false
            },
            success: function(data, textStatus, jqXHR) {
                console.log(data)
                $.unblockUI();
                if (data != "token invalido") {
                    if(opcion == true){
                        mensajeFinalizacion()
                    }else{
                        mensajeCorrecion()
                    }
                    limpiar();
                    disableData();
                } else {
                    showFeedback("error", "Token invalido", "Error");
                    console.log("invalidos");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $.unblockUI();
                showFeedback("error", "Error al finalizar el ítem", "Error");
                console.log(errorThrown);
            }
        });
    }else{
        $.unblockUI();
        showFeedback("error", 'Existen campos incompletos.' , "Error");
    }    
}

function validarCampos(){
 
    falta = true
    if($("#select-ficha").val() == '-1'){
        $("#select-ficha").addClass('is-invalid').niceSelect('update');
        falta = false
    }else if($("#select-ficha").val() == 'observado' && $("#ficha_obs").val().length == 0){
        $("#ficha_obs").addClass('is-invalid')
        falta = false
    }else{
        $("#ficha_obs").removeClass('is-invalid')
        $("#select-ficha").removeClass('is-invalid')
    }

    if($("#select-estimulo").val() == '-1'){
        $("#select-estimulo").addClass('is-invalid').niceSelect('update');
        falta = false
    }else if($("#select-estimulo").val() == 'observado' && $("#estimulo_obs").val().length == 0){
        $("#estimulo_obs").addClass('is-invalid')
        falta = false
    }else{
        $("#estimulo_obs").removeClass('is-invalid')
        $("#select-estimulo").removeClass('is-invalid')
    }

    if($("#select-pregunta").val() == '-1'){
        $("#select-pregunta").addClass('is-invalid').niceSelect('update');
        falta = false
    }else if($("#select-pregunta").val() == 'observado' && $("#pregunta_obs").val().length == 0){
        $("#pregunta_obs").addClass('is-invalid')
        falta = false
    }else{
        $("#pregunta_obs").removeClass('is-invalid')
        $("#select-pregunta").removeClass('is-invalid')
    }

    if($("#select-alternativas").val() == '-1'){
        falta = false
        $("#select-alternativas").addClass('is-invalid').niceSelect('update');
    }else if($("#select-alternativas").val() == 'observado' && $("#alternativa_obs").val().length == 0){
        falta = false
        $("#alternativa_obs").addClass('is-invalid')
    }else{
        $("#alternativa_obs").removeClass('is-invalid')
        $("#select-alternativas").removeClass('is-invalid')
    }
    return falta;
}

function mensajeFinalizacion(){
    Swal.fire({
        title: 'El Item se ha finalizado con exito',
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Volver'
        }).then((result) => {
          if (result.value) {
            location.href = serverRedirect + '/_supervisor/revision.php';
          }
        })
}

function mensajeCorrecion(){
    Swal.fire({
        title: 'Sus correcciones se han enviado con éxito y serán revisadas',
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Volver'
        }).then((result) => {
          if (result.value) {
            location.href = serverRedirect + '/_supervisor/revision.php';
          }
        })
}

function muestraItems(data) {
    
	 
	$("#pagination li").each(function(index) {


		if(isNaN($(this).text()) == false){

			if(items[$(this).text()-1].evaluacion != '-'){
				$(this).addClass('text-sinEstado')
				$(this).attr('data-title',items[$(this).text()-1].evaluacion); 
			}               
		}
	})

	$("#pagination li a").each(function(index) {
		if(isNaN($(this).text()) == false){
				var aux = $('.page-link').text().replace(/ /g, "")
				var ant = "Anterior"
				var sig = "Siguiente"          
			if (aux != ant || aux != sig ) {
				$(this).text(items[$(this).text()-1].nro); 
			}
		}        
	})
 

    if(data.estado_revision == "observado"){
        $('#select-ficha').prop('disabled',true).niceSelect('update');
        $('#select-estimulo').prop('disabled',true).niceSelect('update');
        $('#select-pregunta').prop('disabled',true).niceSelect('update');
        $('#select-alternativas').prop('disabled',true).niceSelect('update');
    }else{
        $('#select-ficha').prop('disabled',true).niceSelect('update');
        $('#select-estimulo').prop('disabled',false).niceSelect('update');
        $('#select-pregunta').prop('disabled',false).niceSelect('update');
        $('#select-alternativas').prop('disabled',false).niceSelect('update');
    }

    $('#status').html(data.panel_evaluacion.evaluacion)

    /*NAV LATERAL*/
    $('#codigo').html(data.nav_lateral[0].id_item)
    $('#dificultad').html(data.nav_lateral[0].dificultad)
    $('#habilidad').html(data.nav_lateral[0].habilidad)
    $('#tipo_area').html('Tipo: '+data.nav_lateral[0].area)
    if(data.nav_lateral[0].tipo_item != 1){
        $('#tipo_prueba').html('Especialidad: '+data.nav_lateral[0].materia)
        $('#tipo_item').show()
    }
 
    $('#tema').html(data.nav_lateral[0].tema)
    $('#estandar').html(data.nav_lateral[0].estandar)
    $('#indicador').html(data.nav_lateral[0].indicador)

    /*CUERPO ITEM*/
    $('#enunciado').html(data.cuerpo_item.enunciado)
    console.log('AQUIIII '+data.cuerpo_item.estimulo)
    $('#estimulo').html(data.cuerpo_item.estimulo)
    if (data.cuerpo_item.con_formula == true) {
        CKEDITOR.replace( 'enunciado', {
            extraPlugins: 'ckeditor_wiris',
            mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
            removePlugins: 'filetools,uploadimage,uploadwidget,uploadfile,filebrowser,easyimage',
            extraAllowedContent: mathElements.join( ' ' ) + '(*)[*]{*};img[data-mathml,data-custom-editor,role](Wirisformula)',
            readOnly: true
        } );
    }

    

    if(data.cuerpo_item.con_recurso == true){
        
        $('#div-seccion-img').show();
        cantidadItemsConRecursos++;

        if(data.cuerpo_item.item_recurso != null){
            itemsConRecursos++;
            $('#img0').attr('src', '../img_show.php?path=/'+data.cuerpo_item.item_recurso);
            tieneImagen(0,'add-image')
        }

        $('#add-image').hide();
        $('#button_archivo_adjunto0').hide();
         
    }else{
    	$('#div-seccion-img').hide();
    }

    
    $('#pregunta').html(data.cuerpo_item.pregunta)
    if (data.cuerpo_item.pregunta_con_formula == true) {
        CKEDITOR.replace( 'pregunta', {
            extraPlugins: 'ckeditor_wiris',
            mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
            removePlugins: 'filetools,uploadimage,uploadwidget,uploadfile,filebrowser,easyimage',
            extraAllowedContent: mathElements.join( ' ' ) + '(*)[*]{*};img[data-mathml,data-custom-editor,role](Wirisformula)',
            readOnly: true
        } );
    }
    
    /* ALTERNATIVA*/
    $('#bodyAlternativas').empty()
    for (var i = 0; i < data.alternativa.length; i++) {
        /*if (data.alternativa[i].alternativa != "" && data.alternativa[i].alternativa != null) {*/

        	 
            palabra = '<tr>' +
                '<td style="width:10%; padding-top: 20px;">' +
                    '<div class="badge identificador-letra">' + data.alternativa[i].letra + '</div>' +
                '</td>' +

                '<td style="padding-top: 20px;">' +
                    '<div class="col-sm-12 pl-5 pr-5" id="alternativa'+data.alternativa[i].letra +'">'+
                        data.alternativa[i].alternativa+
                    '</div>'+
                '</td>'+
            '</tr>' 

			image = '';
            if(data.alternativa[i].con_recurso == true){
                if( data.alternativa[i].alternativa_recurso == null){
                    image = ''
                }else{
                    itemsConRecursos++;
                    image = data.alternativa[i].alternativa_recurso;

                }

             
	            palabra += '<tr style="border-bottom: 2px solid #efefef;">'+
	                '<td colspan=2 style="padding-bottom: 30px;">'+ 
	                    '<div class="file-upload">'

                            if(data.estado_revision != "observado"){
                                 palabra += '<button id="'+data.alternativa[i].id_alternativa+'" name="archivo_adjunto'+(i+1)+'"  class="file-upload-btn mx-auto" type="button" data-toggle="modal" data-target="#adjuntarRecurso" data-tipo_recurso="Alternativa '+data.alternativa[i].letra+'" >Agregar Imagen</button>'
                            }

	                        palabra += '<div id="div_upload'+(i+1)+'" class="image-upload-wrap">'+
	                            '<div class="drag-text">'+
	                                '<h3>Aquí verá la imagen una vez que la seleccione</h3>'+
	                            '</div>'+
	                        '</div>'+
	                        '<div id="div_file_upload_content'+(i+1)+'" class="file-upload-content">'+
	                            '<img id="img'+(i+1)+'" class="file-upload-image img-fluid" src="../img_show.php?path=/'+image+'" style="max-height: 165px;"/>'

                                if(data.estado_revision != "observado"){
                                    palabra += '<div class="image-title-wrap">'+
                                     '<button type="button" id="button_archivo_adjunto'+(i+1)+'" onclick="eliminarImg(this,'+data.alternativa[i].id_alternativa+')" class="remove-image">Eliminar Imagen <span id="image-title'+(i+1)+'" class="image-title"></span></button>'+
                                    '</div>'
                                }

	                            
	                        palabra += '</div>'+
	                    '</div>'+
	            	'</td>'+
	            '</tr>'

                cantidadItemsConRecursos++;
	        }
    

            $('#bodyAlternativas').append(palabra)

            if (data.alternativa[i].con_formula == true) {
                CKEDITOR.replace('alternativa'+data.alternativa[i].letra +'', {
                    extraPlugins: 'ckeditor_wiris',
                    mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
                    removePlugins: 'filetools,uploadimage,uploadwidget,uploadfile,filebrowser,easyimage',
                    extraAllowedContent: mathElements.join( ' ' ) + '(*)[*]{*};img[data-mathml,data-custom-editor,role](Wirisformula)',
                    readOnly: true
                } );
            }
            
            if(image != null && image != ""){
                tieneImagen(i+1,data.alternativa[i].id_alternativa)
            }
    }

    /*PANEL EVALUACION*/
    if(data.panel_evaluacion !== 'undefined' /*&& data.estado_revision == 'observado'*/){
    	opciones = 0;
        if (typeof data.panel_evaluacion.ficha_aprobacion !== 'undefined' && data.panel_evaluacion.ficha_aprobacion != "") {
            opciones++;
            $('#select-ficha').val(data.panel_evaluacion.ficha_aprobacion);
            $('#indicador_ficha').html(colorIndicador(data.panel_evaluacion.ficha_aprobacion));
            agregarClase($('#select-ficha'));
        }else {
            $('#select-ficha').val(-1);
        }
        $('#select-ficha').prop('disabled',true).niceSelect('update');
        $('#ficha_obs').val(data.panel_evaluacion.ficha_observacion).prop('disabled',true);


        if (typeof data.panel_evaluacion.enunciado_aprobacion !== 'undefined' && data.panel_evaluacion.enunciado_aprobacion != "") {
        	opciones++;
            $('#select-estimulo').val(data.panel_evaluacion.enunciado_aprobacion);
            $('#indicador_estimulo').html(colorIndicador(data.panel_evaluacion.enunciado_aprobacion));
            agregarClase($('#select-estimulo'));
        }else {
            $('#select-estimulo').val(-1);
        }
        $('#select-estimulo').prop('disabled',true).niceSelect('update');
        $('#estimulo_obs').val(data.panel_evaluacion.enunciado_observacion).prop('disabled',true);


        if (typeof data.panel_evaluacion.pregunta_aprobacion !== 'undefined' && data.panel_evaluacion.pregunta_aprobacion != "") {
        	opciones++;
            $('#select-pregunta').val(data.panel_evaluacion.pregunta_aprobacion)
            $('#indicador_pregunta').html(colorIndicador(data.panel_evaluacion.pregunta_aprobacion));
            agregarClase($('#select-pregunta'));
        } else {
            $('#select-pregunta').val(-1);
        }
        $('#select-pregunta').prop('disabled',true).niceSelect('update');
        $('#pregunta_obs').val(data.panel_evaluacion.pregunta_observacion).prop('disabled',true);


        if (typeof data.panel_evaluacion.alternativa_aprobacion !== 'undefined' && data.panel_evaluacion.alternativa_aprobacion != "") {
        	opciones++;
            $('#select-alternativas').val(data.panel_evaluacion.alternativa_aprobacion);
            $('#indicador_alternativa').html(colorIndicador(data.panel_evaluacion.alternativa_aprobacion));
            agregarClase($('#select-alternativas'));
        } else {
            $('#select-alternativas').val(-1);
        }
        $('#select-alternativas').prop('disabled',true).niceSelect('update');
        $('#alternativa_obs').val(data.panel_evaluacion.alternativa_observacion).prop('disabled',true);

        if(opciones == 4 && data.estado_revision != 'observado'){
        	$('#guardar').css('display','')
        }
        
       
    }

    if(data.panel_evaluacion !== 'undefined' && data.estado_revision != 'observado'){

        $('#select-ficha').prop('disabled', false).niceSelect('update');
        $('#select-estimulo').prop('disabled', false).niceSelect('update');
        $('#select-pregunta').prop('disabled', false).niceSelect('update');
        $('#select-alternativas').prop('disabled', false).niceSelect('update');

        if(data.panel_evaluacion.ficha_aprobacion == 'observado'){
            $('#ficha_obs').attr('disabled',false)
        }
        if(data.panel_evaluacion.enunciado_aprobacion == 'observado'){
            $('#estimulo_obs').attr('disabled',false)
        }
        if(data.panel_evaluacion.pregunta_aprobacion == 'observado'){
            $('#pregunta_obs').attr('disabled',false)
        }
        if(data.panel_evaluacion.alternativa_aprobacion == 'observado'){
            $('#alternativa_obs').attr('disabled',false)
        }

    }

    barraFooter()
    

}

function limpiar(){
  /*  $('#guardar').prop('disabled', false);*/
    $('#guardar').css('display','none');
/*    $('#finalizar').prop('disabled', false);*/
    $('#finalizar').css('display','none');

    var textareas = document.getElementsByTagName("textarea");
    for (var i = 0; i < textareas.length; i++) {
        textareas[i].value = '';
        textareas[i].disabled = true;
    }
    agregarClase($('#select-ficha').val(-1).prop('disabled', true).niceSelect('update'));
    agregarClase($('#select-estimulo').val(-1).prop('disabled', true).niceSelect('update'));
    agregarClase($('#select-pregunta').val(-1).prop('disabled', true).niceSelect('update'));
    agregarClase($('#select-alternativas').val(-1).prop('disabled', true).niceSelect('update'));
}

// function disableData(){
//     $('#guardar').prop('disabled', true);
//     $('#guardar').css('display','none');
//     $('#finalizar').prop('disabled', true);
//     $('#finalizar').css('display','none');
//     $('#info_finalizado').css('display','');
//     $('#select-estimulo').prop('disabled', true).niceSelect('update');
//     $('#select-pregunta').prop('disabled', true).niceSelect('update');
//     $('#select-alternativas').prop('disabled', true).niceSelect('update');
// }


//ESTA FUNCION ES ANTIGUA SOLO SIRVE PARA SUBIR IMAGENES DESDE EL PC
// function subirArchivo() {
    // console.log(data);
    // var tipo_recuerso = $("#tipo_recuerso").val();
    // var formData = new FormData();
    // formData.append('ruta', "");


    // var tipo_recuerso = $("#tipo_recuerso").val();
    // var formData = new FormData();
    // formData.append('id_item', localStorage.item);
  
 //    if ( $("#archivo_adjunto0").length > 0 ) {
	// 	if($('#archivo_adjunto0')[0].files[0] != undefined){
	//     	formData.append('estimulo', $('#archivo_adjunto0')[0].files[0]);
	//     }
	// }
	// if ( $("#archivo_adjunto1").length > 0 ) {
	//   if($('#archivo_adjunto1')[0].files[0] != undefined){
 //    	formData.append('alternativa_a', $('#archivo_adjunto1')[0].files[0]);
 //        formData.append('id_alternativa', JSON.parse(localStorage.infoItem).alternativa[0].id_alternativa);
 //    }
	// }
	// if ( $("#archivo_adjunto2").length > 0 ) {
	// 	if($('#archivo_adjunto2')[0].files[0] != undefined){
	//     	formData.append('alternativa_b', $('#archivo_adjunto2')[0].files[0]);
 //            formData.append('id_alternativa', JSON.parse(localStorage.infoItem).alternativa[1].id_alternativa);
	//     }
	// }
	// if ( $("#archivo_adjunto3").length > 0 ) {
	// 	if($('#archivo_adjunto3')[0].files[0] != undefined){
	//     	formData.append('alternativa_c', $('#archivo_adjunto3')[0].files[0]);
 //            formData.append('id_alternativa', JSON.parse(localStorage.infoItem).alternativa[2].id_alternativa);
	//     }
	// }
	// if ( $("#archivo_adjunto1").length > 0 ) {
	// 	if($('#archivo_adjunto4')[0].files[0] != undefined){
	//     	formData.append('alternativa_d', $('#archivo_adjunto4')[0].files[0]);
 //            formData.append('id_alternativa', JSON.parse(localStorage.infoItem).alternativa[3].id_alternativa);
	//     }
	// }
  
    // var file = $('#archivo_adjunto0')[0].files[0];
    // console.log(file);
    // var cargarArchivo = new Promise(function(resolve, reject) {
        /*if (file.size > 150000000) {
            showFeedback("error", "El archivo no debe superar los 150 MB", "Error");
            reject();
        } else {*/
            // $.blockUI({ message: '<h1>Subiendo el archivo</h1>', baseZ: 10000 });
            // $.ajax({
            //     url: webservice + "/colaborador/item/guarda",
            //     type: 'POST',
            //     contentType: false,
            //     cache: false,
            //     processData: false,
            //     headers: {
            //         't': localStorage.token,
            //         'tipo': tipo_recuerso
            //     },
            //     data: formData,
                 // id_usuario = localStorage.user.id_usuario,
                 //    id_item: localStorage.item

                // success: function(data, textStatus, jqXHR) {
                //     console.log(data);
                //     $.unblockUI();
                //     showFeedback("success", "Archivo subido con éxito", "Éxito al subir");
                //     resolve();
                    // guardarItem();
            //     },
            //     error: function(jqXHR, textStatus, errorThrown) {
            //         console.log(errorThrown);
            //         $.unblockUI();
            //         showFeedback("error", "Error al subir el archivo", "Error");
            //         reject();
            //     }
            // });
        /*}*/
    // })
// }



// function borderTooltip(){
// var data = $('.page-item').data('data-title')  ;
//  console.log(data);
//   // $('li[title]:after').css("border-color","blue");



// // }else if ($('li[title]=="Enproceso"]')) {
// //   $('li[title]:after').css("border-color","blue");

// // }else if ($('li[title]=="Enproceso"]')) {
// //   $('li[title]:after').css("border-color","blue");

// // }

// }

function tieneImagen(id, alternativa){
    $('#div_upload'+id).hide(); 
    $('#'+alternativa).html("Cambiar Imagen");
    $('#div_file_upload_content'+id).show();
}

function deleteImagen(alternativa){
    // $('#div_upload'+id).hide(); 
    $('#'+alternativa).html("Agregar Imagen");
    // $('#div_file_upload_content'+id).show();
}

// $("#add-image").html("Cambiar Imagen")


/*function readURL(input) {
	console.log(input)
    numero = $(input).attr('id').charAt($(input).attr('id').length-1)

    if (input.files && input.files[0]) {

        var reader = new FileReader();

        reader.onload = function(e) {
            console.log(e.target.result)
            $('#div_upload'+numero).hide();
            $('#img'+numero).attr('src', e.target.result);
            $('#div_file_upload_content'+numero).show();
            console.log(input.files[0].name)
            $('#image-title'+numero).html(input.files[0].name);
        };

        reader.readAsDataURL(input.files[0]);

    } else {
        removeUpload(input);
    }
}*/

function eliminarImg(button,id){
   Swal.fire({
        title: '¿Está seguro que desea eliminar la imagen?',
        showCancelButton: true,
        confirmButtonText: 'Si',
       // confirmButtonColor: '#3085d6',
        //cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',      
        reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                removeUpload(button,id)
            }
        })
}



function removeUpload(button,id_alternativa) {
    if(id_alternativa == "add-image"){
         $("#add-image").html("Agregar Imagen");
    }else{
         $("#"+id_alternativa).html("Agregar Imagen");
    }
    
    alternativa = id_alternativa;
    directorio_imagen = -1;

    seleccionarArchivo()


    id = $(button).attr('id').replace("button_","");
    $('#'+id).replaceWith($('#'+id).clone());
    numero = id.charAt(id.length-1)

    $('#div_file_upload_content'+numero).hide();
    $('#div_upload'+numero).show();
    $('#'+id).val(null)
}

$('#div_upload').bind('dragover', function () {
	$('#div_upload').addClass('image-dropping');
});

$('#div_upload').bind('dragleave', function () {
    $('#div_upload').removeClass('image-dropping');
});

$('#div_upload1').bind('dragover', function () {
    $('#div_upload1').addClass('image-dropping');
});
$('#div_upload1').bind('dragleave', function () {
    $('#div_upload1').removeClass('image-dropping');
});

$('#div_upload2').bind('dragover', function () {
    $('#div_upload2').addClass('image-dropping');
});
$('#div_upload2').bind('dragleave', function () {
    $('#div_upload2').removeClass('image-dropping');
});

$('#div_upload3').bind('dragover', function () {
    $('#div_upload3').addClass('image-dropping');
});
$('#div_upload3').bind('dragleave', function () {
    $('#div_upload3').removeClass('image-dropping');
});

$('#div_upload4').bind('dragover', function () {
    $('#div_upload4').addClass('image-dropping');
});
$('#div_upload4').bind('dragleave', function () {
    $('#div_upload4').removeClass('image-dropping');
});


function jsonImagenes(){

    $.ajax({
            method: 'GET',
            "url": webservice + "/contenido",
            headers: {
                't': JSON.parse(localStorage.user).token,
            },
            crossDomain: true,
            dataType: 'text',
            data: {
                // id_item: id,
                id_usuario: JSON.parse(localStorage.user).id_usuario,
            },
            success: function(data, textStatus, jqXHR) {
                // var xd = JSON.parse(Object.assign({}, data))
                if (data != "token invalido") {
                    /*limpiar() NECESARIO?*/
                    // if(JSON.parse(data) == undefined){
                         // $("#finalizar").css("display", "none");
                         // $("#finalizar").hide();
                        json(data);
                        localStorage.imagenes = JSON.parse(data);
                        //estadoFinal();
                    // }else{
                        // if(JSON.parse(data).descripcion = 'instruso_detected'){
                             // showFeedback("error", "ERROR", "Error");
                        // }                        
                        // disableData()                         
                        // $('#info_finalizado').css('display','none')
                    // }                         
                } else {
                    console.log("invalidos");
                }
                // $.unblockUI();
                // ocultarLoading()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                // ocultarLoading()
                // disableData()
                // limpiar()
                // $('#info_finalizado').css('display','none')
            }
        });

}


function json(data){

	datos=JSON.parse(data);	

	for ( i = 0; i < datos.disciplinar.length; i++) {

		//for (var j = 0; j < datos.disciplinar[i].nombre_carpeta.length; j++) {
			ruta = "'disciplinar/"+datos.disciplinar[i].nombre_carpeta+"'"
			li = '<li onclick="carpeta('+ruta+')"><span class="carpeta" style="text-transform: capitalize;">'+datos.disciplinar[i].nombre_carpeta+'</span></li>'
			
			$('#disciplinar').append(li);
		//}


	 	// li = '<li><span class="">'+datos.disciplinar[i].nombre_carpeta+'</span></li>'
	 		 // '<ul class="nested active">'
	 		// for ( j = 0; j < datos.disciplinar[i].contenido_dir.length; j++) {
		 		// ruta = "'"+datos.disciplinar[i].contenido_dir[j].ruta+"'"
		 		// li +='<li onclick="carpeta('+ruta+')" class><span class="carpeta">'+datos.disciplinar[i].contenido_dir[j].carpeta+'</span></li>'
				/* '<ul class="nested active">'
			 		for ( k = 0; k < datos.disciplinar[i].contenido_dir[j].archivos.length; k++) {
					 	li +='<li>'+datos.disciplinar[i].contenido_dir[j].archivos[k]+'</li>'
					}
				li += '</ul>'*/
                // li += '</li>'
		// }
		// li += '</ul></li>'
        
		

	}

	for ( i = 0; i < datos.pedagogico.length; i++) {
		ruta = "'pedagogico'"
	 	li = '<li onclick="carpeta('+ruta+')"><span class="carpeta" style="text-transform: capitalize;">'+datos.pedagogico[i].carpeta+'</span></li>'
	 		 /*'<ul class="nested active">'
	 		for ( j = 0; j < datos.pedagogico[i].archivos.length; j++) {	 	
		 		li +='<li>'+datos.pedagogico[i].archivos[j]+'</li>'
		}
		li += '</ul></li>'*/
		$('#pedagogico').append(li);

	}

	// <li onclick="carpeta('+ruta')"></li>


	var toggler = document.getElementsByClassName("caret");
	var i;

	for (i = 0; i < toggler.length; i++) {
	  toggler[i].addEventListener("click", function() {
	    this.parentElement.querySelector(".nested").classList.toggle("active");
	    // this.classList.toggle("caret-down");
	  });
	}
}

function carpeta(ruta){

	$.blockUI({ message: '<h1>Cargando imágenes</h1>' });        
	$.ajax({
            method: 'POST',
            "url": webservice + "/contenido-directorio",
            headers: {
                't': JSON.parse(localStorage.user).token,
            },
            crossDomain: true,
            dataType: 'text',
            data: {
                directorio:ruta
            },
            success: function(data, textStatus, jqXHR) {
                if (data != "token invalido") {
                    cargarImagenes(data);  
                    directorio = ruta;                
                } else {
                    console.log("invalidos");
                }
                $.unblockUI();
               
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                $.unblockUI();
            }
        });
}

function cargarImagenes(data){
	json = JSON.parse(data)
	$('#images').html('');
	$('#images').append('<div class="col-12"></div>');
	for (i = 0; i < json.length; i++) {
		imgs='<div class="col-3" style="display: flex; justify-content: center; align-items: center;">'+
			'<div>'+
				'<input type="image" class="img-fluid" name="'+json[i].nombre+'"  src="../img_show.php?path=/'+json[i].base64+'" onclick="imagen(this)"/>'+
			'</div></div>'
		$('#images').append(imgs);
	}
}
 
directorio_imagen = "";
src = "";
function imagen(img){
	$('#images').children('div').removeClass('div_select')
	$(img).parent().parent().addClass('div_select')
	directorio_imagen= directorio + "/" +$(img).attr('name');
	src = $(img).attr('src');
}

function readURL(id) {
    numero = id.charAt(id.length-1)
    $('#div_upload'+numero).hide();
    $('#img'+numero).attr('src', src);
    $('#div_file_upload_content'+numero).show();  
}

function seleccionarArchivo(){
    
    if(directorio_imagen == -1){
        itemsConRecursos--;
    }else{
        itemsConRecursos++;
    }

	$.blockUI({ message: '<h1>Guardando...</h1>' });        
	$.ajax({

            method: 'POST',
            "url": webservice + "/colaborador/item/guarda",
            headers: {
                't': JSON.parse(localStorage.user).token,
            },
            crossDomain: true,
            dataType: 'text',
            data: {
                id_item: localStorage.item,
                id_alternativa: alternativa,
                ruta: directorio_imagen,
                estado_carga: "en_proceso"
            },
            success: function(data, textStatus, jqXHR) {
                console.log(data);
                if (data != "token invalido") {
               		readURL(name_button)
                    //validarTodoIngresado()
               		barraFooter()
               		$('#adjuntarRecurso').modal('hide')
                } else {
                    console.log("invalidos");
                }
                $.unblockUI();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                $.unblockUI();
            }
        });
}

function validarTodoIngresado(){
    $("#finalizar").show();
    var j = 1+data.alternativa.length;

    for (var i = 0; i < j; i++) {


        if ($("#div_file_upload_content"+i).css('display') == 'block') {

        }
        

        
    }

    if($("#div_file_upload_content0").css('display') == 'block' || $("#div_file_upload_content1").css('display') == 'block'){
        $("#finalizar").show();
    };

}


function barraFooter(){

    if(cantidadItemsConRecursos == itemsConRecursos){
        $('#footer-finalizar').show();
    }else{
        $('#footer-finalizar').hide();
    }   
}

function disableData(){
 
    var buttonsAgregar = document.getElementsByClassName("file-upload-btn");
    for (var i = 0; i < buttonsAgregar.length; i++) {
        buttonsAgregar[i].style.display = "none";
    }

    var buttonsEliminar = document.getElementsByClassName("remove-image");
    for (var i = 0; i < buttonsEliminar.length; i++) {
        buttonsEliminar[i].style.display = "none";
    }
}

function agregarClase(select) {
    switch ($('#' + select.attr('id')).val()) {
        case 'aprobado':
            $('#' + select.attr('id')).removeClass('_border-select-observaciones _border-select-rechazado').addClass('_border-select-aprobado');
            $("#" + select.attr('id') + "-texto").removeClass('_texto-select-observaciones _texto-select-rechazado').addClass('_texto-select-aprobado');
            $("#" + select.attr('id')).niceSelect('update');
            break;
        case 'observado':
            $('#' + select.attr('id')).removeClass('_border-select-aprobado _border-select-rechazado').addClass('_border-select-observaciones');
            $("#" + select.attr('id') + "-texto").removeClass('_texto-select-aprobado _texto-select-rechazado').addClass('_texto-select-observaciones');
            $("#" + select.attr('id')).niceSelect('update');
            break;
       /* case 'rechazado':
            $('#' + select.attr('id')).removeClass('_border-select-aprobado _border-select-observaciones').addClass('_border-select-rechazado');
            $("#" + select.attr('id') + "-texto").removeClass('_texto-select-aprobado _texto-select-observaciones').addClass('_texto-select-rechazado');
            $("#" + select.attr('id')).niceSelect('update');
            break;*/
        default:
            $('#' + select.attr('id')).removeClass('_border-select-aprobado _border-select-observaciones _border-select-rechazado');
            $("#" + select.attr('id') + "-texto").removeClass('_texto-select-aprobado _texto-select-observaciones _texto-select-rechazado');
            $("#" + select.attr('id')).niceSelect('update');
            break;
    }
}

function colorIndicador(val) {
    html = ''
    switch (val) {
        case 'aprobado':

            html =  '<label class="_texto_indicador" style="color: #79d7c0;">'+
                    '<i class="fa fa-circle" aria-hidden="true" style="color: #79d7c0; font-size: 12px; padding-right: 6px;"></i>Aprobado</label>'

            break;
        case 'observado':
            html =  '<label class="_texto_indicador" style="color: #a991d7;">'+
                    '<i class="fa fa-circle" aria-hidden="true" style="color: #a991d7; font-size: 12px; padding-right: 6px;"></i>Observado</label>'
            break;
        /*case 'rechazado':
            html =  '<label class="_texto_indicador" style="color: #f06e96;">'+
                    '<i class="fa fa-circle" aria-hidden="true" style="color: #f06e96; font-size: 12px; padding-right: 6px;"></i>Rechazado</label>'
            break;*/
    }

    return html;
}