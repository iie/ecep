var $heightFooter;
var $heightSidebar;
var cantidadItemsConRecursos = 0;
var itemsConRecursos = 0;

$(document).ready(function() {
    $("._padding-paginacion").css('display','none');
    $("._tab").css('display','none');  
    // $("._padding-paginacion").hide();
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres + ' ' + JSON.parse(localStorage.user).apellidos)
    resizeFooter(sizeDefecto);
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectSupervisor);

    $("#show-sidebar").click(function() {
        // console.log("xddddd");
        if($(".page-wrapper").hasClass("toggled")== false){
            $(".page-wrapper").addClass("toggled");
            $('#icon_sidebar').css('transform','rotate(-180deg)')
            $('#icon_animation').css('transform','')
            $("#contenido-footer").height(0);
            $("#contenido-footer").hide();
            $("body").css("overflow", "auto");
            // console.log("xddddd");
        }else{
            $(".page-wrapper").removeClass("toggled");
            $('#icon_sidebar').css('transform','')
            // console.log("xddddd");
        }        
    });

    items = JSON.parse(localStorage.items)

    listarComponentesItem(items[localStorage.itemsSelected].id_item);   

});


var sizeDefecto = 1;
$(window).resize(function() {
    resizeFooter(parseInt(localStorage.getItem('sizeScreen')));
});

function listarComponentesItem(id) {

    if (JSON.parse(localStorage.user).id_tipo_usuario == 55) {
        $.ajax({
            method: 'POST',
            "url": webservice + "/supervisor/gestion/item/obtener",
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
                        disableData();
                    }                         
                } else {
                    console.log("invalidos");
                }
                $.unblockUI();
                ocultarLoading();

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                ocultarLoading();
                disableData();
                limpiar();
            }
        });
    }
}

function muestraItems(data) {

    // $('#status').html(data.panel_evaluacion.evaluacion)

    /*NAV LATERAL*/
    // $('#codigo').html(data.nav_lateral[0].id_item);
    // $('#dificultad').html(data.nav_lateral[0].dificultad);
    // $('#habilidad').html(data.nav_lateral[0].habilidad);
    // $('#tipo_area').html('Tipo: '+data.nav_lateral[0].area);
    // if(data.nav_lateral[0].tipo_item =! 1){
    //     $('#tipo_prueba').html(data.nav_lateral[0].materia);
    //     $('#tipo_item').show();
    // }
 
    // $('#tema').html(data.nav_lateral[0].tema);
    // $('#estandar').html(data.nav_lateral[0].estandar);
    // $('#indicador').html(data.nav_lateral[0].indicador);

    /*CUERPO ITEM*/
    // $('#enunciado').html(data.cuerpo_item.enunciado);
    // $('#estimulo').html(data.cuerpo_item.estimulo);
    // $('#recurso_enunciado').html(seleccionarTipoRecurso(data.cuerpo_item.tipo_recurso, data.cuerpo_item.ruta));
    // $('#pregunta').html(data.cuerpo_item.pregunta);
    
    /* ALTERNATIVA*/
    // $('#bodyAlternativas').empty()
    // for (var i = 0; i < data.alternativa.length; i++) {
    //     if (data.alternativa[i].alternativa != "" && data.alternativa[i].alternativa != null) {
    //         palabra = '<tr>' +
    //         '<td style="width:10%">' +
    //         '<div class="badge identificador-letra">' + data.alternativa[i].letra + '</div>' +
    //         '</td>' +
    //         '<td>' + data.alternativa[i].alternativa + '</td>' +
    //         '<tr>'
    //         $('#bodyAlternativas').append(palabra);
    //     }else{
    //         palabra = '<tr>' +
    //         '<td style="width:10%">' +
    //         '<div class="badge identificador-letra">' + data.alternativa[i].letra + '</div>' +
    //         '</td>' +
    //         '<td>' +
    //         '<div>' + seleccionarTipoRecurso(data.alternativa[i].tipo_recurso, data.alternativa[i].alternativa_recurso) + '</div>' +
    //         '</td>'
    //         $('#bodyAlternativas').append(palabra);
    //     }        
    // }


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
/*                          '<button class="file-upload-btn" type="button" onclick="$(\'#archivo_adjunto'+(i+1)+'\').trigger(\'click\')">Agregar Imagen</button>'+*/
                         
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
                $('#fecha-evaluacion').html("Sin revisión");                $('#fecha-eval2').html("Sin revisión");                 
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

function tieneImagen(id, alternativa){
    $('#div_upload'+id).hide(); 
    $('#'+alternativa).html("Cambiar Imagen");
    $('#div_file_upload_content'+id).show();
}

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
