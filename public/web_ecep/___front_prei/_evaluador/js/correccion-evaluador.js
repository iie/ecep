var $heightFooter;
var $heightSidebar;
var cantidadItemsConRecursos = 0;
var itemsConRecursos = 0;

$(document).ready(function() {
 
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres + ' ' + JSON.parse(localStorage.user).apellidos)
    resizeFooter(sizeDefecto);
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectEvaluador)

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
    
    items = JSON.parse(localStorage.items)
    // console.log(items)
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

function listarComponentesItem(id) {

    if (JSON.parse(localStorage.user).id_tipo_usuario == 54) {
        $.ajax({
            method: 'POST',
            "url": webservice + "/evaluador/item/obtener",
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

    if (JSON.parse(localStorage.user).id_tipo_usuario == 54) {
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
                    $('#status').html("En Proceso")
                    // console.log(JSON.parse(data));
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

    Swal.fire({
        title: '¿Está seguro que desea finalizar?',
        showCancelButton: true,
        confirmButtonText: 'Si',
       // confirmButtonColor: '#3085d6',
        //cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',      
        reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                finalizar()
            }
        })

    function finalizar(){
        if (JSON.parse(localStorage.user).id_tipo_usuario == 54) {
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
                        $('#status').html("Finalizado")
                        disableData();
                        // console.log(JSON.parse(data));
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

function muestraItems(data) {

    $("#pagination li").each(function(index) {
        if(isNaN($(this).text()) == false){
            if(items[$(this).text()-1].evaluacion != '-'){
                $(this).addClass('text-'+ (items[$(this).text()-1].evaluacion).replace(/ /g, ""))
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
            readOnly: true,
            height: 100
        } );
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
    $('#recurso_enunciado').html(seleccionarTipoRecurso(data.cuerpo_item.tipo_recurso, data.cuerpo_item.estimulo_recurso))
    $('#pregunta').html(data.cuerpo_item.pregunta)
    if (data.cuerpo_item.pregunta_con_formula == true) {
        CKEDITOR.replace( 'pregunta', {
            extraPlugins: 'ckeditor_wiris',
            mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
            removePlugins: 'filetools,uploadimage,uploadwidget,uploadfile,filebrowser,easyimage',
            extraAllowedContent: mathElements.join( ' ' ) + '(*)[*]{*};img[data-mathml,data-custom-editor,role](Wirisformula)',
            readOnly: true,
            height: 100
        } );
    }
    
    /* ALTERNATIVA*/

    $('#bodyAlternativas').empty()
    for (var i = 0; i < data.alternativa.length; i++) {

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
	                    '<div class="file-upload">'+
	                        // '<button id="'+data.alternativa[i].id_alternativa+'" name="archivo_adjunto'+(i+1)+'"  class="file-upload-btn mx-auto" type="button" data-toggle="modal" data-target="#adjuntarRecurso" data-tipo_recurso="Alternativa '+data.alternativa[i].letra+'" >Agregar Imagen</button>'+
/*	                        '<button class="file-upload-btn" type="button" onclick="$(\'#archivo_adjunto'+(i+1)+'\').trigger(\'click\')">Agregar Imagen</button>'+*/
	                     
	                        '<div id="div_upload'+(i+1)+'" class="image-upload-wrap">'+
	                            /*'<input class="file-upload-input" id="archivo_adjunto'+(i+1)+'" type="file" onchange="readURL(this);" accept="image/*" />'+*/
	                            '<div class="drag-text">'+
	                                '<h3>Aquí verá la imagen una vez que la seleccione</h3>'+
	                            '</div>'+
	                        '</div>'+
	                        '<div id="div_file_upload_content'+(i+1)+'" class="file-upload-content">'+
	                            '<img id="img'+(i+1)+'" class="file-upload-image img-fluid center" src="../img_show.php?path=/'+image+'" style="max-height: 165px;"/>'+
	                            '<div class="image-title-wrap">'+
	                                // '<button type="button" id="button_archivo_adjunto'+(i+1)+'" onclick="eliminarImg(this,'+data.alternativa[i].id_alternativa+')" class="remove-image">Eliminar Imagen <span id="image-title'+(i+1)+'" class="image-title"></span></button>'+
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
                    readOnly: true,
                    height: 100
                } );
            }
    }

    /*PANEL EVALUACION*/

    $('#status').html("Pendiente")
    
    if(typeof data.panel_evaluacion !== 'undefined' && data.panel_evaluacion.length > 0){

        if (data.panel_evaluacion[0].estimulo_aprobacion != null && data.panel_evaluacion[0].estimulo_aprobacion != "") {
            $('#select-estimulo').val(data.panel_evaluacion[0].estimulo_aprobacion);
            $('#indicador_estimulo').html(colorIndicador(data.panel_evaluacion[0].estimulo_aprobacion));
            agregarClase($('#select-estimulo'));
        } else {
            $('#select-estimulo').val(-1);
        }
        $('#select-estimulo').prop('disabled',false).niceSelect('update');
        $('#estimulo_obs').val(data.panel_evaluacion[0].estimulo_observacion).prop('disabled',false);


        if (data.panel_evaluacion[0].pregunta_aprobacion != null && data.panel_evaluacion[0].pregunta_aprobacion != "") {
            $('#select-pregunta').val(data.panel_evaluacion[0].pregunta_aprobacion)
            $('#indicador_pregunta').html(colorIndicador(data.panel_evaluacion[0].pregunta_aprobacion));
            agregarClase($('#select-pregunta'));
        } else {
            $('#select-pregunta').val(-1);
        }
        $('#select-pregunta').prop('disabled',false).niceSelect('update');
        $('#pregunta_obs').val(data.panel_evaluacion[0].pregunta_observacion).prop('disabled',false);


        if (data.panel_evaluacion[0].alternativa_aprobacion != null && data.panel_evaluacion[0].alternativa_aprobacion != "") {
            $('#select-alternativas').val(data.panel_evaluacion[0].alternativa_aprobacion);
            $('#indicador_alternativa').html(colorIndicador(data.panel_evaluacion[0].alternativa_aprobacion));
            agregarClase($('#select-alternativas'));
        } else {
            $('#select-alternativas').val(-1);
        }
        $('#select-alternativas').prop('disabled',false).niceSelect('update');
        $('#alternativa_obs').val(data.panel_evaluacion[0].alternativa_observacion).prop('disabled',false);

       if(data.panel_evaluacion[0].finalizado == true){

            disableData()
            $('#info_finalizado').html("Finalizado el "+ moment(data.panel_evaluacion[0].finalizado_fecha).format("DD-MM-YYYY"));
       }else{
       		$('#info_finalizado').css('display','none')
       }
       $('#status').html(data.panel_evaluacion[0].avance)
    }
    
    
    
    
}

function resizeFooter(size) {
    localStorage.sizeScreen = size;

    var screen = (($(window).height() < 900) ? "hd" : "fullhd");
    localStorage.screen = screen;

    switch (document.getElementById("contenido-footer").scrollHeight) {

        case 0:
            $("body").css("overflow", "auto");
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
            $('#icon_animation').css('transform','')
            $("#contenido-footer").height(0);
            $("#contenido-footer").hide();
            $("body").css("overflow", "auto");
            
            break;
    }
    $heightFooter = $('#nav-footer').outerHeight(true);
    $heightSidebar = $('#sidebar').outerHeight(true);
}

function tieneImagen(id, alternativa){
    $('#div_upload'+id).hide(); 
    $('#'+alternativa).html("Cambiar Imagen");
    $('#div_file_upload_content'+id).show();
}

function recalcularEspacio() {

    $('#card-body-observacion').height($("#contenido-footer").height() - 112);
    $("#estimulo_obs").css("height", ($('#card-body-observacion').height() - 80) + "px");
    $("#pregunta_obs").css("height", ($('#card-body-observacion').height() - 80) + "px");
    $("#alternativa_obs").css("height", ($('#card-body-observacion').height() - 80) + "px");

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
        case 'rechazado':
            $('#' + select.attr('id')).removeClass('_border-select-aprobado _border-select-observaciones').addClass('_border-select-rechazado');
            $("#" + select.attr('id') + "-texto").removeClass('_texto-select-aprobado _texto-select-observaciones').addClass('_texto-select-rechazado');
            $("#" + select.attr('id')).niceSelect('update');
            break;
        default:
            $('#' + select.attr('id')).removeClass('_border-select-aprobado _border-select-observaciones _border-select-rechazado');
            $("#" + select.attr('id') + "-texto").removeClass('_texto-select-aprobado _texto-select-observaciones _texto-select-rechazado');
            $("#" + select.attr('id')).niceSelect('update');
            break;
    }
}

function colorIndicador(val) {
    switch (val) {
        case 'aprobado':

            html =  '<label class="_texto_indicador" style="color: #79d7c0;">'+
                    '<i class="fa fa-circle" aria-hidden="true" style="color: #79d7c0; font-size: 12px; padding-right: 6px;"></i>Aprobado</label>'

            break;
        case 'observado':
            html =  '<label class="_texto_indicador" style="color: #a991d7;">'+
                    '<i class="fa fa-circle" aria-hidden="true" style="color: #a991d7; font-size: 12px; padding-right: 6px;"></i>Observado</label>'
            break;
        case 'rechazado':
            html =  '<label class="_texto_indicador" style="color: #f06e96;">'+
                    '<i class="fa fa-circle" aria-hidden="true" style="color: #f06e96; font-size: 12px; padding-right: 6px;"></i>Rechazado</label>'
            break;
    }

    return html;
}

function limpiar(){
    $('#guardar').prop('disabled', false);
    $('#guardar').css('display','');
    $('#finalizar').prop('disabled', false);
    $('#finalizar').css('display','');


	$('#select-estimulo').val(-1).niceSelect('update');
    $('#select-pregunta').val(-1).niceSelect('update');
    $('#select-alternativas').val(-1).niceSelect('update');
    $('#select-estimulo').removeClass('_border-select-aprobado _border-select-observaciones _border-select-rechazado');
    $("#select-estimulo-texto").removeClass('_texto-select-aprobado _texto-select-observaciones _texto-select-rechazado');
    $('#select-estimulo').niceSelect('update');
    $('#select-pregunta').removeClass('_border-select-aprobado _border-select-observaciones _border-select-rechazado');
    $("#select-pregunta-texto").removeClass('_texto-select-aprobado _texto-select-observaciones _texto-select-rechazado');
    $('#select-pregunta').niceSelect('update');
    $('#select-alternativas').removeClass('_border-select-aprobado _border-select-observaciones _border-select-rechazado');
    $("#select-alternativas-texto").removeClass('_texto-select-aprobado _texto-select-observaciones _texto-select-rechazado');
    $('#select-alternativas').niceSelect('update');

    var textareas = document.getElementsByTagName("textarea");
    for (var i = 0; i < textareas.length; i++) {

        textareas[i].value = '';
    }
}

function disableData(){
    $('#guardar').prop('disabled', true);
    $('#guardar').css('display','none');
    $('#finalizar').prop('disabled', true);
    $('#finalizar').css('display','none');

    $('#info_finalizado').css('display','');

    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {

        inputs[i].disabled = true;
    }

    var textareas = document.getElementsByTagName("textarea");
    for (var i = 0; i < textareas.length; i++) {

        textareas[i].disabled = true;
    }

    $('#select-estimulo').prop('disabled', true).niceSelect('update');
    $('#select-pregunta').prop('disabled', true).niceSelect('update');
    $('#select-alternativas').prop('disabled', true).niceSelect('update');
}
