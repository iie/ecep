var $heightFooter;
var $heightSidebar;
var cantidadItemsConRecursos = 0;
var itemsConRecursos = 0;

$(document).ready(function() {
 
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres + ' ' + JSON.parse(localStorage.user).apellidos)
    resizeFooter(sizeDefecto);
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectEditor)

    $("#show-sidebar").click(function() {
        if($(".page-wrapper").hasClass("toggled")== false){
             $(".page-wrapper").addClass("toggled");
             $('#icon_sidebar').css('transform','rotate(-180deg)')

                $('#icon_animation').css('transform','')
                $("#contenido-footer").height(0);
                $("#contenido-footer").hide();
                $("body").css("overflow", "auto");

        }else{
             $(".page-wrapper").removeClass("toggled");
             $('#icon_sidebar').css('transform','')

        }
        
    });

    $("._btn-editar").click(function() {
    	if($("_btn-editar").on('click',guardarItem)){
	    	$('._btn-editar').prop('disabled', false);
	    	$('._btn-editar').css('display','none');
	    	$('._btn-guardar').prop('disabled', false);
	    	$('._btn-guardar').css('display','inline');
	    	habilitarItems();
	    }       
    });
      $("._btn-guardar").click(function() {
    	if($("_btn-editar").on('click',guardarItem)){
	    	$('._btn-editar').prop('disabled', false);
	    	$('._btn-editar').css('display','');
	    	$('._btn-guardar').prop('disabled', false);
	    	$('._btn-guardar').css('display','none');
	    	editarItem();
	    	deshabilitarItems();
	    	// listarComponentesItem(JSON.parse(localStorage.item));
	    }        
    });


    items = JSON.parse(localStorage.items)

    console.log(items);
    // start = parseInt(localStorage.itemsSelected)+1

    listarComponentesItem(JSON.parse(localStorage.item));

    $("#select-estimulo").niceSelect();
    $("#select-estimulo").on('change', function() {
        agregarClase($("#select-estimulo"))
    });

    $("#select-pregunta").niceSelect();
    $("#select-pregunta").on('change', function() {
        agregarClase($("#select-pregunta"))
    });

    $("#select-alternativas").niceSelect();
    $("#select-alternativas").on('change', function() {
        agregarClase($("#select-alternativas"))
    });

    $("#guardar").on('click',guardarItem);
    $("#finalizar").on('click',finalizarItem);

});

var sizeDefecto = 1;
$(window).resize(function() {
    resizeFooter(parseInt(localStorage.getItem('sizeScreen')));
});

// function listarComponentesItem() {
function listarComponentesItem(id) {

    if (JSON.parse(localStorage.user).id_tipo_usuario == 56) {
        $.ajax({
            method: 'POST',
            "url": webservice + "/editor/item/item",
            headers: {
                't': JSON.parse(localStorage.user).token
            },
            crossDomain: true,
            dataType: 'text',
            data: {
                // id_item: 4982,
                id_item: id,
                id_usuario: JSON.parse(localStorage.user).id_usuario,
            },
            success: function(data, textStatus, jqXHR) {
                if (data != "token invalido") {
                	limpiar()
                    if(JSON.parse(data).respuesta == undefined){
                        muestraItems(JSON.parse(data));
                        //estadoFinal();
                    }else{
                        if(JSON.parse(data).descripcion = 'instruso_detected'){
                             showFeedback("error", "ERROR", "Error");
                        }                        
                        disableData()                         
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
                disableData()
                limpiar()
                $('#info_finalizado').css('display','none')
            }
        });
    }
}

function guardarItem() {

    if (JSON.parse(localStorage.user).id_tipo_usuario == 56) {
        $.blockUI({ message: '<h1>Espere por favor</h1>' });
        $.ajax({
            method: 'POST',
            url: webservice + "/evaluador/item/guarda",
            headers: {
                't': JSON.parse(localStorage.user).token,
            },
            crossDomain: true,
            dataType: 'text',
            data: {
                id_item: localStorage.item,
                estimulo_aprobacion: ($("#select-estimulo").val() == "-1" ? "" : $("#select-estimulo").val()),
                estimulo_observacion: $("#estimulo_obs").val(),
                pregunta_aprobacion: ($("#select-pregunta").val() == "-1" ? "" : $("#select-pregunta").val()),
                pregunta_observacion: $("#pregunta_obs").val(),
                alternativa_aprobacion: ($("#select-alternativas").val() == "-1" ? "" : $("#select-alternativas").val()),
                alternativa_observacion: $("#alternativa_obs").val(),
                finalizado: "no_finalizado"
            },
            success: function(data, textStatus, jqXHR) {
                $.unblockUI();
                if (data != "token invalido") {
                    showFeedback("success", "Éxito al guardar el ítem", "Guardado");
                    console.log(JSON.parse(data));
                } else {
                    showFeedback("error", "Token invalido", "Error");
                    console.log("invalidos");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $.unblockUI();
                showFeedback("error", "Error al guardar el ítem", "Error");
                console.log(errorThrown);
            }
        });
    }
    // 
}

function finalizarItem() {
    Swal({
        title: '¿Está seguro que desea finalizar?',
       // text: "You won't be able to revert this!",
       // type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
       // confirmButtonColor: '#3085d6',
        //cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',      
        reverseButtons: true
        }).then((result) => {
            if (result.value) {
                finalizar()
            }
        })  

    function finalizar(){
        if (JSON.parse(localStorage.user).id_tipo_usuario == 56) {
            $.blockUI({ message: '<h1>Espere por favor</h1>' });
            $.ajax({
                method: 'POST',
                url: webservice + "/evaluador/item/guarda",
                headers: {
                    't': JSON.parse(localStorage.user).token,
                },
                crossDomain: true,
                dataType: 'text',
                data: {
                    id_item: localStorage.item,
                    estimulo_aprobacion: ($("#select-estimulo").val() == "-1" ? "" : $("#select-estimulo").val()),
                    estimulo_observacion: $("#estimulo_obs").val(),
                    pregunta_aprobacion: ($("#select-pregunta").val() == "-1" ? "" : $("#select-pregunta").val()),
                    pregunta_observacion: $("#pregunta_obs").val(),
                    alternativa_aprobacion: ($("#select-alternativas").val() == "-1" ? "" : $("#select-alternativas").val()),
                    alternativa_observacion: $("#alternativa_obs").val(),
                    finalizado: "finalizado"
                },
                success: function(data, textStatus, jqXHR) {
                    $.unblockUI();
                    if (data != "token invalido") {
                        showFeedback("success", "Éxito al finalizar el ítem", "Finalizado");
                        disableData();
                        console.log(JSON.parse(data));
                    } else {
                        showFeedback("error", "Token invalido", "Error");
                        console.log("invalidos");
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $.unblockUI();
                    showFeedback("error", "Error al guardar el ítem", "Error");
                    console.log(errorThrown);
                }
            });
        }
    }
}

function editarItem() {

    if (JSON.parse(localStorage.user).id_tipo_usuario == 56) {
    	
        $.ajax({
            method: 'POST',
            url: webservice + "/editor/item/editarItem",
            headers: {
                't': JSON.parse(localStorage.user).token,
            },
            crossDomain: true,
            dataType: 'text',
            data: {
                id_item: localStorage.item,
                enunciado: $("#enu").val(),
                pregunta: $("#pre").val(),
                alternativa : getAlternativas(),
            },
            success: function(data, textStatus, jqXHR) {
                if (data != "token invalido") {
                    console.log(JSON.parse(data));
                    listarComponentesItem(JSON.parse(localStorage.item));
                    // $('input[type="text"]').on('keyup', resizeInput).each(resizeInput);
                } else {
                    console.log("invalidos");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);                
            }
        });
    }
}

function habilitarItems(){
	var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
    }
}

function deshabilitarItems(){
	var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }
}

function muestraItems(data) {

	// $('#status').html(data.panel_evaluacion.evaluacion)

    /*NAV LATERAL*/
    // $('#codigo').html(data.nav_lateral[0].id_item)
    // $('#dificultad').html(data.nav_lateral[0].dificultad)
    // $('#habilidad').html(data.nav_lateral[0].habilidad)
    // $('#tipo_area').html('Tipo: '+data.nav_lateral[0].area)
	   //  if(data.nav_lateral[0].tipo_item =! 1){
	   //      $('#tipo_prueba').html(data.nav_lateral[0].materia)
	   //      $('#tipo_item').show()
	   //  } 
 
    // $('#tema').html(data.nav_lateral[0].tema)
    // $('#estandar').html(data.nav_lateral[0].estandar)
    // $('#indicador').html(data.nav_lateral[0].indicador)    

    /*CUERPO ITEM*/
    // enunciadot = '<input type="text" id="enu" class="form-control" disabled value="'+data.cuerpo_item.enunciado+'" required>'
    // $('#enunciado').html(enunciadot)
    // $('input[type="text"]').on('keyup', resizeInput).each(resizeInput);
    // $('#estimulo').html(data.cuerpo_item.estimulo)
    // $('#recurso_enunciado').html(seleccionarTipoRecurso(data.cuerpo_item.tipo_recurso, data.cuerpo_item.ruta))
    // preguntat = '<input type="text" id="pre" class="form-control" disabled value="'+data.cuerpo_item.pregunta+'" required>'
    // $('#pregunta').html(preguntat)
    // $('input[type="text"]').on('keyup', resizeInput).each(resizeInput);
    
    /* ALTERNATIVA*/
    // $('#bodyAlternativas').empty()
    // for (var i = 0; i < data.alternativa.length; i++) {
    //     if (data.alternativa[i].alternativa != "" && data.alternativa[i].alternativa != null) {
    //         palabra = '<tr>' +
    //         '<td style="width:10%">' +
    //         '<div class="badge identificador-letra"  id="letra_'+i+'">' + data.alternativa[i].letra + '</div>' +
    //         '</td>' +
    //         '<td> <input type="text" id="pregunta'+i+'" class="form-control" disabled" value="'+data.alternativa[i].alternativa+'" required>' 
             
    //         + '</td>' +
    //         '</tr>'
    //         $('#bodyAlternativas').append(palabra)
            // $('input[type="text"]').on('keyup', resizeInput).each(resizeInput);
    //     }else{
    //         palabra = '<tr>' +
    //         '<td style="width:10%">' +
    //         '<div class="badge identificador-letra">' + data.alternativa[i].letra + '</div>' +
    //         '</td>' +
    //         '<td>' +
    //         '<div>' + seleccionarTipoRecurso(data.alternativa[i].tipo_recurso, data.alternativa[i].alternativa_recurso) + '</div>' +
    //         '</td></tr>'
    //         $('#bodyAlternativas').append(palabra)
    //     }
        
    // }

    /*PANEL EVALUACION*/
    // if(typeof data.panel_evaluacion !== 'undefined' || data.panel_evaluacion.length > 0){

    //     if (data.panel_evaluacion[0].estimulo_aprobacion != null && data.panel_evaluacion[0].estimulo_aprobacion != "") {
    //         $('#select-estimulo').val(data.panel_evaluacion[0].estimulo_aprobacion);
    //         //$('#indicador_estimulo').html(colorIndicador(data.panel_evaluacion[0].estimulo_aprobacion));
    //         //agregarClase($('#select-estimulo'));
    //     } else {
    //         $('#select-estimulo').val(-1);
    //     }
    //     $('#select-estimulo').prop('disabled',false).niceSelect('update');
    //     $('#estimulo_obs').val(data.panel_evaluacion[0].estimulo_observacion).prop('disabled',false);


    //     if (data.panel_evaluacion[0].pregunta_aprobacion != null && data.panel_evaluacion[0].pregunta_aprobacion != "") {
    //         $('#select-pregunta').val(data.panel_evaluacion[0].pregunta_aprobacion)
    //         //$('#indicador_pregunta').html(colorIndicador(data.panel_evaluacion[0].pregunta_aprobacion));
    //         //agregarClase($('#select-pregunta'));
    //     } else {
    //         $('#select-pregunta').val(-1);
    //     }
    //     $('#select-pregunta').prop('disabled',false).niceSelect('update');
    //     $('#pregunta_obs').val(data.panel_evaluacion[0].pregunta_observacion).prop('disabled',false);


    //     if (data.panel_evaluacion[0].alternativa_aprobacion != null && data.panel_evaluacion[0].alternativa_aprobacion != "") {
    //         $('#select-alternativas').val(data.panel_evaluacion[0].alternativa_aprobacion);
    //         //$('#indicador_alternativa').html(colorIndicador(data.panel_evaluacion[0].alternativa_aprobacion));
    //         //agregarClase($('#select-alternativas'));
    //     } else {
    //         $('#select-alternativas').val(-1);
    //     }
    //     $('#select-alternativas').prop('disabled',false).niceSelect('update');
    //     $('#alternativa_obs').val(data.panel_evaluacion[0].alternativa_observacion).prop('disabled',false);

    //     /*BARRA ESTADO EVALUACION*/
    //         /*if (data.panel_evaluacion[0].estimulo_aprobacion == null || data.panel_evaluacion[0].pregunta_aprobacion == null || data.panel_evaluacion[0].alternativa_aprobacion == null){
    //             $('#status').html("Pendiente")
    //         }else if(data.panel_evaluacion[0].estimulo_aprobacion == "rechazado" || data.panel_evaluacion[0].pregunta_aprobacion == "rechazado" || data.panel_evaluacion[0].alternativa_aprobacion == "rechazado"){
    //             $('#status').html("Rechazado")
    //         }else if(data.panel_evaluacion[0].estimulo_aprobacion == "aprobado" && data.panel_evaluacion[0].pregunta_aprobacion == "aprobado" && data.panel_evaluacion[0].alternativa_aprobacion == "aprobado"){
    //             $('#status').html("Aprobado")
    //         }else if(data.panel_evaluacion[0].estimulo_aprobacion == "aprobado_observacion" || data.panel_evaluacion[0].pregunta_aprobacion == "aprobado_observacion" || data.panel_evaluacion[0].alternativa_aprobacion == "aprobado_observacion"){
    //             $('#status').html("Aprobado Con Observaciones")
    //         }*/
    //    if(data.panel_evaluacion[0].finalizado == true){

    //         disableData()
    //         $('#info_finalizado').html("Finalizado el "+ moment(data.panel_evaluacion[0].finalizado_fecha).format("DD-MM-YYYY"));
    //    }else{
    //    		$('#info_finalizado').css('display','none')
    //    }
    // }     
// }

    /*NAV LATERAL*/
    $('#codigo').html(data.nav_lateral[0].id_item)
    $('#dificultad').html(data.nav_lateral[0].dificultad)
    $('#habilidad').html(data.nav_lateral[0].habilidad)
    $('#tipo_area').html('Tipo: '+data.nav_lateral[0].area)
    if(data.nav_lateral[0].tipo_item != 1){
        $('#tipo_prueba').html(data.nav_lateral[0].materia)
        $('#tipo_item').show()
    }
 
    $('#tema').html(data.nav_lateral[0].tema)
    $('#estandar').html(data.nav_lateral[0].estandar)
    $('#indicador').html(data.nav_lateral[0].indicador)

    /*CUERPO ITEM*/
     $('#enunciado').html(data.cuerpo_item.enunciado)
    if (data.cuerpo_item.enunciado_con_formula == true) {
        CKEDITOR.replace( 'enunciado', {
            extraPlugins: 'ckeditor_wiris',
            mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
            removePlugins: 'filetools,uploadimage,uploadwidget,uploadfile,filebrowser,easyimage',
            extraAllowedContent: mathElements.join( ' ' ) + '(*)[*]{*};img[data-mathml,data-custom-editor,role](Wirisformula)',
            readOnly: true
        } );
    }else{
        $('#enunciado').html('<input type="text" name="enunciado" value='+data.cuerpo_item.enunciado+'>')
    }

    $('#estimulo').html(data.cuerpo_item.estimulo)

    if(data.cuerpo_item.con_recurso == true){
        
        $('#div-seccion-img').show();
        cantidadItemsConRecursos++;

        if(data.cuerpo_item.item_recurso != null){
            itemsConRecursos++;
            $('#img0').attr('src', '../img_show.php?path=/'+data.cuerpo_item.item_recurso);
            tieneImagen(0,'add-image')
        }

         
    }

    /*if( data.cuerpo_item.estimulo == null ||  data.cuerpo_item.estimulo == ""){
         $('#recurso_enunciado').html('')
    }else{
         $('#recurso_enunciado').html(seleccionarTipoRecurso(data.cuerpo_item.tipo_recurso, data.cuerpo_item.estimulo))
    }*/
    
    $('#pregunta').html(data.cuerpo_item.pregunta)

    if (data.cuerpo_item.pregunta_con_formula == true) {
        CKEDITOR.replace( 'pregunta', {
            extraPlugins: 'ckeditor_wiris',
            mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
            removePlugins: 'filetools,uploadimage,uploadwidget,uploadfile,filebrowser,easyimage',
            extraAllowedContent: mathElements.join( ' ' ) + '(*)[*]{*};img[data-mathml,data-custom-editor,role](Wirisformula)',
            readOnly: true
        } );
    }else{
        $('#pregunta').html('<input type="text" name="pregunta" value='+data.cuerpo_item.pregunta+'>')
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
                    '<div class="col-sm-12 pl-5 pr-5" id="alternativa'+data.alternativa[i].letra +'">'
                    if (data.alternativa[i].con_formula != true) {
                        palabra +='<input type="text" name="alternativa'+data.alternativa[i].id_alternativa+'" value='+data.alternativa[i].alternativa+'>'
                    }else{
                       palabra += data.alternativa[i].alternativa
                    }
                        
                        // '<input type="text" name="alternativa'+data.alternativa[i].id_alternativa+'" value='+data.alternativa[i].alternativa+'>'+
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
                        '<div class="file-upload">'+
                            '<button id="'+data.alternativa[i].id_alternativa+'" name="archivo_adjunto'+(i+1)+'"  class="file-upload-btn mx-auto" type="button" data-toggle="modal" data-target="#adjuntarRecurso" data-tipo_recurso="Alternativa '+data.alternativa[i].letra+'" >Agregar Imagen</button>'+
/*                          '<button class="file-upload-btn" type="button" onclick="$(\'#archivo_adjunto'+(i+1)+'\').trigger(\'click\')">Agregar Imagen</button>'+*/
                            '<div id="div_upload'+(i+1)+'" class="image-upload-wrap">'+
                                /*'<input class="file-upload-input" id="archivo_adjunto'+(i+1)+'" type="file" onchange="readURL(this);" accept="image/*" />'+*/
                                '<div class="drag-text">'+
                                    '<h3>Aquí verá la imagen una vez que la seleccione</h3>'+
                                '</div>'+
                            '</div>'+
                            '<div id="div_file_upload_content'+(i+1)+'" class="file-upload-content">'+
                                '<img id="img'+(i+1)+'" class="file-upload-image img-fluid" src="../img_show.php?path=/'+image+'" style="max-height: 165px;"/>'+
                                '<div class="image-title-wrap">'+
                                    '<button type="button" id="button_archivo_adjunto'+(i+1)+'" onclick="eliminarImg(this,'+data.alternativa[i].id_alternativa+')" class="remove-image">Eliminar Imagen <span id="image-title'+(i+1)+'" class="image-title"></span></button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</td>'+
                '</tr>'

                cantidadItemsConRecursos++;
            }
    

            $('#bodyAlternativas').append(palabra)
            if(image != null && image != ""){
                tieneImagen(i+1,data.alternativa[i].id_alternativa)
            }

            if (data.alternativa[i].con_formula == true) {
                CKEDITOR.replace('alternativa'+data.alternativa[i].letra +'', {
                    extraPlugins: 'ckeditor_wiris',
                    mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
                    removePlugins: 'filetools,uploadimage,uploadwidget,uploadfile,filebrowser,easyimage',
                    extraAllowedContent: mathElements.join( ' ' ) + '(*)[*]{*};img[data-mathml,data-custom-editor,role](Wirisformula)',
                    readOnly: true
                } );
            }
            // else{
            //     $('#alternativa'+data.alternativa[i].letra +'').append('<input type="text" name="alternativa'+data.alternativa[i].id_alternativa+'" value='+data.alternativa[i].alternativa+'>');
            // }
      
    }

    /*PANEL EVALUACION*/
    if(typeof data.panel_evaluacion !== 'undefined' && data.panel_evaluacion.length > 0){

        // Info Evaluadores
        if (data.panel_evaluacion[0].estimulo_aprobacion != null || data.panel_evaluacion[0].estimulo_aprobacion != "" && data.panel_evaluacion[1].estimulo_aprobacion != null || data.panel_evaluacion[1].estimulo_aprobacion != "" ) {
            $('#evaluacion-estimulo').html(colorIndicador(data.panel_evaluacion[0].estimulo_aprobacion));
            $('#evaluacion-eval2').html(colorIndicador(data.panel_evaluacion[1].estimulo_aprobacion));  
        } 

        if (data.panel_evaluacion[0].finalizado_fecha != null || data.panel_evaluacion[0].finalizado_fecha != "" && data.panel_evaluacion[1].finalizado_fecha != null || data.panel_evaluacion[1].finalizado_fecha != "") {
            if(data.panel_evaluacion[0].finalizado_fecha == null || data.panel_evaluacion[0].finalizado_fecha == "" || data.panel_evaluacion[1].finalizado_fecha == null || data.panel_evaluacion[1].finalizado_fecha == ""){
                // $('#fecha-evaluacion').html(colorIndicador(data.panel_evaluacion[0].finalizado_fecha)).css("padding-top","8px");
                // $('#fecha-eval2').html(colorIndicador(data.panel_evaluacion[0].finalizado_fecha)).css("padding-top","8px");
                $('#fecha-evaluacion').html("Sin revisión");
                $('#fecha-eval2').html("Sin revisión");                 
            }else{
                $('#fecha-evaluacion').html(moment(data.panel_evaluacion[0].finalizado_fecha).format("DD-MM-YYYY"));
                $('#fecha-eval2').html(moment(data.panel_evaluacion[1].finalizado_fecha).format("DD-MM-YYYY"));
            }
        }

        if (data.panel_evaluacion[0].nombres != null || data.panel_evaluacion[0].nombres != "" && data.panel_evaluacion[0].apellidos!= null || data.panel_evaluacion[0].apellidos != ""
            && data.panel_evaluacion[1].nombres != null || data.panel_evaluacion[1].nombres != "" && data.panel_evaluacion[1].apellidos!= null || data.panel_evaluacion[1].apellidos != "") {
            $('#nombre-evaluador1').html(data.panel_evaluacion[0].nombres+" "+data.panel_evaluacion[0].apellidos);
            $('#nombre-eval2').html(data.panel_evaluacion[1].nombres+" "+data.panel_evaluacion[1].apellidos);
        } 
        // Fin Info Evaluadores

        // Evaluaciones
        if (data.panel_evaluacion[0].estimulo_aprobacion != null || data.panel_evaluacion[0].estimulo_aprobacion != "" && data.panel_evaluacion[1].estimulo_aprobacion != null || data.panel_evaluacion[1].estimulo_aprobacion != "" ) {
            $('#evaluacion-enunciado').html(colorIndicador(data.panel_evaluacion[0].estimulo_aprobacion));
            $('#evaluacion-enunciado-eval2').html(colorIndicador(data.panel_evaluacion[1].estimulo_aprobacion));
        }

        if (data.panel_evaluacion[0].pregunta_aprobacion != null || data.panel_evaluacion[0].pregunta_aprobacion != "" && data.panel_evaluacion[1].pregunta_aprobacion != null || data.panel_evaluacion[1].pregunta_aprobacion != "") {
            $('#evaluacion-pregunta').html(colorIndicador(data.panel_evaluacion[0].pregunta_aprobacion));
            $('#evaluacion-pregunta-eval2').html(colorIndicador(data.panel_evaluacion[1].pregunta_aprobacion));
        }

        if (data.panel_evaluacion[0].alternativa_aprobacion != null || data.panel_evaluacion[0].alternativa_aprobacion != "" && data.panel_evaluacion[1].alternativa_aprobacion != null || data.panel_evaluacion[1].alternativa_aprobacion !="" ) {
            $('#evaluacion-alternativas').html(colorIndicador(data.panel_evaluacion[0].alternativa_aprobacion));
            $('#evaluacion-alternativas-eval2 ').html(colorIndicador(data.panel_evaluacion[1].alternativa_aprobacion));
       
        }
        // Fin Evaluaciones

        // Text Areas
        $('#estimulo_obs').val(data.panel_evaluacion[0].estimulo_observacion).prop('disabled',true);
        $('#pregunta_obs').val(data.panel_evaluacion[0].pregunta_observacion).prop('disabled',true);
        $('#alternativa_obs').val(data.panel_evaluacion[0].alternativa_observacion).prop('disabled',true);
        $('#estimulo_obs_eval2').val(data.panel_evaluacion[1].estimulo_observacion).prop('disabled',true);
        $('#pregunta_obs_eval2').val(data.panel_evaluacion[1].pregunta_observacion).prop('disabled',true);
        $('#alternativa_obs_eval2').val(data.panel_evaluacion[1].alternativa_observacion).prop('disabled',true);
        // Fin Text Areas
       
    } //Fin if
}

// $("#bodyTablaE tr").each(function() {
// 	var areai = $(this).find('td:nth-child(1) input').val() == undefined ? "" : $(this).find('td:nth-child(1) input').val()
// 	var plazoi = $(this).find('td:nth-child(2) input').val() == undefined ? "" : $(this).find('td:nth-child(2) input').val()
// 	var tiempoi = $(this).find('td:nth-child(2) select').val() == undefined ? "" : $(this).find('td:nth-child(2) select').val()
// 	var instrumentos = $(this).find('td:nth-child(3) input').val() == undefined ? "" : $(this).find('td:nth-child(3) input').val()
// 	if (areai != "" || plazoi != "" || instrumentos != "") {
// 	    enviar.profundizacion_diagnostica.push({ area: areai, plazo: plazoi, tiempo: tiempoi, estrategias: instrumentos })
// 	}

// })

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

function itemCorreccion(){
    var enviar = {};
    var alternativas = [];
    var cuerpo = [];

    vacios = false


    nuevaHabilidad = $('#select-habilidad').val() != undefined ? $('#select-habilidad').val() : "-1";
    nuevaDificultad = $('#select-dificultad').val()  != undefined ? $('#select-dificultad').val() : "-1";
    nuevoTema = $('#select-tema').val() != undefined ? $('#select-tema').val() : "-1";
    nuevoEstandar = $('#select-estandar').val()  != undefined ? $('#select-estandar').val() : "-1";
    nuevoIndicador = $('#select-indicador').val() != undefined ? $('#select-indicador').val() : "-1";



    nuevoEnunciado = $('#edit_enunciado').val() != undefined ? $('#edit_enunciado').val() : $('#enunciado').html();
    nuevaPregunta = $('#edit_pregunta').val()  != undefined ? $('#edit_pregunta').val() : $('#pregunta').html();

    $('#bodyAlternativas tr').each(function() {
        if($(this).attr('id') != undefined){
        
            idAlternativa = $(this).attr('id').replace('tr','')
            div =  $(this).find('td:nth-child(2) div')
            texto = CKEDITOR.instances[$(div[0]).attr('id')] != undefined ?  CKEDITOR.instances[$(div[0]).attr('id')].getData() : 
                $('#'+$(div[0]).attr('id')).find('textarea').length > 0 ? $('#'+$(div[0]).attr('id')).find('textarea').val() : $('#'+$(div[0]).attr('id')).html()
            if(texto.length <= 1){
                vacios = true
                if($('#'+$(div[0]).attr('id')).find('textarea') != undefined){
                    $('#'+$(div[0]).attr('id')).find('textarea').addClass('is-invalid')
                }
            }else{
                if($('#'+$(div[0]).attr('id')).find('textarea') != undefined){
                    $('#'+$(div[0]).attr('id')).find('textarea').removeClass('is-invalid')
                }
            }

            alternativas.push({id_alternativa:idAlternativa, alternativa: texto})
        }
    })

    if(itemsRevision.enunciado_aprobacion != "aprobado" && nuevoEnunciado.length <= 1){
        vacios = true
        if($('#edit_enunciado').val()  != undefined ){
                $('#edit_enunciado').addClass('is-invalid')
        }
    }else{
        if($('#edit_enunciado').val()  != undefined ){
            $('#edit_enunciado').removeClass('is-invalid')
        }
    }

    if(itemsRevision.pregunta_aprobacion != "aprobado" && nuevaPregunta.length <= 1){
        vacios = true
        if($('#edit_pregunta').val()  != undefined ){
            $('#edit_pregunta').addClass('is-invalid')
        }
    }else{
        if($('#edit_pregunta').val()  != undefined ){
            $('#edit_pregunta').removeClass('is-invalid')
        }
    }
   
    cuerpo.push({
            enunciado:nuevoEnunciado, 
            pregunta:nuevaPregunta, 
            id_habilidad: nuevaHabilidad,
            id_dificultad: nuevaDificultad,
            id_tema: nuevoTema,
            id_estandar: nuevoEstandar,
            id_indicador: nuevoIndicador});

    enviar.alternativa = alternativas;
    enviar.cuerpo_item = cuerpo;

    if(vacios == true){
        showFeedback("error", "Existen campos vacios.", "Error");
        return vacios;
    }else{        
        return enviar;
    }
 
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
                    limpiar()
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
        imgs='<div class="col-5" style="display: flex; justify-content: center; align-items: center;">'+
            '<div style="text-align:center;">'+
                '<input type="image" class="img-fluid" name="'+json[i].nombre+'"  src="../img_show.php?path=/'+json[i].base64+'" onclick="imagen(this)" style="border: 1px solid grey;"/>'+
                '<br>'+
                '<label style="font-size:10px">'+json[i].nombre+'</label>'+
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
                    //barraFooter()
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

function disableData(){
    $('#footer-finalizar').hide();

    var textareas = document.getElementsByTagName("textarea");
    for (var i = 0; i < textareas.length; i++) {
        textareas[i].disabled = true;
    }

    var buttonsAgregar = document.getElementsByClassName("file-upload-btn");
    for (var i = 0; i < buttonsAgregar.length; i++) {
        buttonsAgregar[i].style.display = "none";
    }

    var buttonsEliminar = document.getElementsByClassName("remove-image");
    for (var i = 0; i < buttonsEliminar.length; i++) {
        buttonsEliminar[i].style.display = "none";
    }
}

function getAlternativas(){
	var enviar = [];
	 $("#bodyAlternativas tr").each(function(index) {

        var letra = $(this).find('td:nth-child(1) .identificador-letra').val() == undefined ? "" : $(this).find('td:nth-child(1) .identificador-letra').val()
        
 		console.log(document.getElementById("letra_"+index).textContent);

        var alternativa = $(this).find('td:nth-child(2) input').val() == undefined ? "" : $(this).find('td:nth-child(2) input').val()
 
		if (alternativa != "") {
		    enviar.push({ alternativas: alternativa, letras: letra })
		}
	})
	 return enviar;
}

function guardarEvaluacion(data) {
    console.log(select.id) 
}

// function resizeFooter(size) {
//     localStorage.sizeScreen = size;

//     var screen = (($(window).height() < 900) ? "hd" : "fullhd");
//     localStorage.screen = screen;

//     switch (document.getElementById("contenido-footer").scrollHeight) {

//         case 0:
//             $("body").css("overflow", "auto");
//             $("#contenido-footer").height(($(window).height() / 2.3));
//             $("#contenido-footer").show();
//             $('#icon_animation').css('transform','rotate(-180deg)')
//             recalcularEspacio();

//             // if($(".page-wrapper").hasClass("toggled") == true){
//             //     $(".page-wrapper").removeClass("toggled");
//             //     $('#icon_sidebar').css('transform','')
//             // }

//             break;
//         default:
//             $('#icon_animation').css('transform','')
//             $("#contenido-footer").height(0);
//             $("#contenido-footer").hide();
//             $("body").css("overflow", "auto");
            
//             break;
//     }
//     $heightFooter = $('#nav-footer').outerHeight(true);
//     $heightSidebar = $('#sidebar').outerHeight(true);

//     // $('#sidebar').height(calc( $heightFooter - $heightSidebar)+'px');
//     // $heightBody = $heightSidebar - $heightTest;

//     // console.log($heightTest);
// }

// // function resizeInput() {  
// //   var valueLength = $(this).prop('value').length;  
// //     // Para que no arroje error si el input se vacía
// //     if (valueLength > 0) {      
// //       $(this).prop('size', valueLength);
// //     }
// // }

// function recalcularEspacio() {

//     $('#card-body-observacion').height($("#contenido-footer").height() - 112);
//     $("#estimulo_obs").css("height", ($('#card-body-observacion').height() - 80) + "px");
//     $("#pregunta_obs").css("height", ($('#card-body-observacion').height() - 80) + "px");
//     $("#alternativa_obs").css("height", ($('#card-body-observacion').height() - 80) + "px");
// }

// function limpiar(){
//     $('#guardar').prop('disabled', false);
//     $('#guardar').css('display','');
//     $('#finalizar').prop('disabled', false);
//     $('#finalizar').css('display','');


// 	$('#select-estimulo').val(-1).niceSelect('update');
//     $('#select-pregunta').val(-1).niceSelect('update');
//     $('#select-alternativas').val(-1).niceSelect('update');
//     $('#select-estimulo').removeClass('_border-select-aprobado _border-select-observaciones _border-select-rechazado');
//     $("#select-estimulo-texto").removeClass('_texto-select-aprobado _texto-select-observaciones _texto-select-rechazado');
//     $('#select-estimulo').niceSelect('update');
//     $('#select-pregunta').removeClass('_border-select-aprobado _border-select-observaciones _border-select-rechazado');
//     $("#select-pregunta-texto").removeClass('_texto-select-aprobado _texto-select-observaciones _texto-select-rechazado');
//     $('#select-pregunta').niceSelect('update');
//     $('#select-alternativas').removeClass('_border-select-aprobado _border-select-observaciones _border-select-rechazado');
//     $("#select-alternativas-texto").removeClass('_texto-select-aprobado _texto-select-observaciones _texto-select-rechazado');
//     $('#select-alternativas').niceSelect('update');

//     var textareas = document.getElementsByTagName("textarea");
//     for (var i = 0; i < textareas.length; i++) {

//         textareas[i].value = '';
//     }
// }

// function disableData(){
//     $('#guardar').prop('disabled', true);
//     $('#guardar').css('display','none');
//     $('#finalizar').prop('disabled', true);
//     $('#finalizar').css('display','none');

//     $('#info_finalizado').css('display','');

//     var inputs = document.getElementsByTagName("input");
//     for (var i = 0; i < inputs.length; i++) {

//         inputs[i].disabled = true;
//     }

//     var textareas = document.getElementsByTagName("textarea");
//     for (var i = 0; i < textareas.length; i++) {

//         textareas[i].disabled = true;
//     }

//     $('#select-estimulo').prop('disabled', true).niceSelect('update');
//     $('#select-pregunta').prop('disabled', true).niceSelect('update');
//     $('#select-alternativas').prop('disabled', true).niceSelect('update');
// }

function resizeFooter(size) {
    // console.log("xddddd");
    localStorage.sizeScreen = size;

    var screen = (($(window).height() < 900) ? "hd" : "fullhd");
    localStorage.screen = screen;

    switch (document.getElementById("contenido-footer").scrollHeight) {
        // console.log("xddddd");
        case 0:
            $("body").css("overflow", "auto");
            $("#contenido-footer").height(($(window).height() / 2.3));
            $("#contenido-footer").show();
            $('#icon_animation').css('transform','rotate(-180deg)');
            // console.log("xddddd");
            recalcularEspacio();

            if($(".page-wrapper").hasClass("toggled") == true){
                $(".page-wrapper").removeClass("toggled");
                $('#icon_sidebar').css('transform','');
                // console.log("xddddd");
            }
            break;
        default:
            $('#icon_animation').css('transform','');
            $("#contenido-footer").height(0);
            $("#contenido-footer").hide();
            $("body").css("overflow", "auto");  
            // console.log("xddddd");          
            break;
    }
    $heightFooter = $('#nav-footer').outerHeight(true);
    $heightSidebar = $('#sidebar').outerHeight(true);
}

function recalcularEspacio() {
    $('#card-body-observacion').height($("#contenido-footer").height() - 100);
    $("#estimulo_obs").css("height", ($('#card-body-observacion').height() - 30) + "px");
    $("#estimulo_obs_eval2").css("height", ($('#card-body-observacion').height() - 30) + "px");
    $("#pregunta_obs").css("height", ($('#card-body-observacion').height() - 30) + "px");
    $("#pregunta_obs_eval2").css("height", ($('#card-body-observacion').height() - 30) + "px");
    $("#alternativa_obs").css("height", ($('#card-body-observacion').height() - 30) + "px");
    $("#alternativa_obs_eval2").css("height", ($('#card-body-observacion').height() - 30) + "px");
}

function colorIndicador(val) {
    switch (val) {
        case 'aprobado':
            html = '<label class="_texto_indicador" style="color: #79d7c0;">Aprobado</label>'
            break;
        case 'observado':
            html = '<label class="_texto_indicador" style="color: #a991d7;">Observado</label>'
            break;
        case 'rechazado':
            html = '<label class="_texto_indicador" style="color: #f06e96;">Rechazado</label>'
            break;
        case null:
            html = '<label class="_texto_indicador" style="color: #ffc400;">Pendiente</label>'
            break;
        case '':
            html = '<label class="_texto_indicador" style="color: #ffc400;">Pendiente</label>'
            break;
    }
    return html;
}

function limpiar(){
    var textareas = document.getElementsByTagName("textarea");
    for (var i = 0; i < textareas.length; i++) {
        textareas[i].value = '';
    }
}

function disableData(){
    var textareas = document.getElementsByTagName("textarea");
    for (var i = 0; i < textareas.length; i++) {
        textareas[i].disabled = true;
    }
}
