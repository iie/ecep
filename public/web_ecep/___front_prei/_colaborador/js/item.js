var $heightFooter;
var $heightSidebar;
var cantidadItemsConRecursos = 0;
var itemsConRecursos = 0;
$(document).ready(function() {

    $("#finalizar").hide();
 
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres + ' ' + JSON.parse(localStorage.user).apellidos)
    $('#nav_carga').addClass('active_menu');
   // resizeFooter(sizeDefecto);
    $('#redirect').css('display','');
    $('#redirect').on('click',redirectColaboradorCarga)
    $('#tab_menu').hide();
    // $("#btn_file").on('click', subirArchivo);
    $("#btn_seleccionar").on('click', seleccionarArchivo);
    $("#button_archivo_adjunto0").on('click', function(){
    	$("#add-image").html("Agregar Imagen");
        // $("#finalizar").hide();
    });

    $('#div-seccion-img').hide();
    //$('#footer-finalizar').hide();
    
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

    $("#guardar").on('click',guardarItem);
    $("#finalizar").on('click',finalizarItem);


    jsonImagenes()
  

	// View a list of images
	//var gallery = new Viewer(document.getElementById('images'));

});

var alternativa = null;
var directorio = ""
var name_button = ""

$('#adjuntarRecurso').on('show.bs.modal', function (event) {
  	var button = $(event.relatedTarget) 
	var tipo = button.data('tipo_recurso')
	alternativa = $(button).attr('id') == undefined ? null : $(button).attr('id')
	name_button = $(button).attr('name')
	// console.log(name_button)
 	$('#adjuntarRecursoTitle').html(''+tipo)
})

function listarComponentesItem(id) {
    //if (JSON.parse(localStorage.user).id_tipo_usuario == 135) {

        $.ajax({
            method: 'POST',
            "url": webservice + "/colaborador/item/obtener",
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

function guardarItem() {
    //obtenerFormulas()
    finalizar('en_proceso')  
}

function finalizarItem() {

    if(cantidadItemsConRecursos == itemsConRecursos){
        Swal.fire({
        title: '¿Está seguro que desea finalizar la carga de este ítem?',
        showCancelButton: true,
        confirmButtonText: 'Si',
       // confirmButtonColor: '#3085d6',
        //cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',      
        reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                finalizar('finalizado')  
            }
        })
    }else{
        showFeedback("error", "Debe ingresar todos los recursos.", "Error");
    }

}

function finalizar(estado){

    $.blockUI({ message: '<h1>Espere por favor</h1>' });
    $.ajax({
        method: 'POST',
        url: webservice + "/colaborador/item/finalizar",
        headers: {
            't': JSON.parse(localStorage.user).token,
        },
        crossDomain: true,
        dataType: 'text',
        data: {
            id_usuario: JSON.parse(localStorage.user).id_usuario,
            id_item: localStorage.item,
            datos: obtenerFormulas(),
            finalizado: estado
        },
        success: function(data, textStatus, jqXHR) {
            $.unblockUI();
            if (data != "token invalido") {
                if(estado== 'finalizado'){
                     mensajeFinalizacion();
                     disableData();
                }else{
                    showFeedback("success", "El Item se ha guardado con exito.", "Éxito al subir");
                }
                
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
}

function obtenerFormulas(){
    var datos = [];
    var alternativas = [];

    texto_enunciado = CKEDITOR.instances.enunciado == undefined ? $('#enunciado').html() : CKEDITOR.instances.pregunta.getData();

    texto_pregunta = CKEDITOR.instances.pregunta == undefined ? $('#pregunta').html() : CKEDITOR.instances.pregunta.getData();

    $('#bodyAlternativas tr').each(function() {
        if($(this).attr('id') != undefined){
        
            idAlternativa = $(this).attr('id').replace('tr','')
            div =  $(this).find('td:nth-child(2) div')
            texto =CKEDITOR.instances[$(div[0]).attr('id')] == undefined ? $('#'+$(div[0]).attr('id')).html() : CKEDITOR.instances[$(div[0]).attr('id')].getData();
            alternativas.push({id_alternativa:idAlternativa, alternativa: texto})
        }
    })
    //CKEDITOR.instances.pregunta.setData('<p><math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><mo>&#8748;</mo></msqrt></math></p>');
    datos = {
        enunciado: texto_enunciado,
        pregunta: texto_pregunta,
        alternativa: alternativas

    }

    return datos;

}

function mensajeFinalizacion(){
    Swal.fire({
        title: 'El Item se ha finalizado con exito',
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Volver'
        }).then((result) => {
          if (result.value) {
            location.href = serverRedirect + '/_colaborador/lista.php';
          }
        })
}

function muestraItems(data) {
    
	if (JSON.parse(localStorage.user).id_tipo_usuario == 135) {
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
	}



    //$('#status').html(data.panel_evaluacion.evaluacion)

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
    
    /* ALTERNATIVA*/
    $('#bodyAlternativas').empty()
    for (var i = 0; i < data.alternativa.length; i++) {

        
        /*if (data.alternativa[i].alternativa != "" && data.alternativa[i].alternativa != null) {*/

        	 
            palabra = '<tr id="tr' +data.alternativa[i].id_alternativa + '">' +
                '<td style="width:10%; padding-top: 20px;">' +
                    '<div class="badge identificador-letra">' +data.alternativa[i].letra + '</div>' +
                '</td>' +

                '<td style="padding-top: 20px;">' +
                '<div class="col-sm-12 pl-5 pr-5" id="alternativa'+data.alternativa[i].letra +'">'+
                data.alternativa[i].alternativa+
                            // '<textarea id="text-alternativa'+ data.alternativa[i].letra +'" rows="3" class="form-control">'+data.alternativa[i].alternativa +' </textarea>'+
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
/*	                        '<button class="file-upload-btn" type="button" onclick="$(\'#archivo_adjunto'+(i+1)+'\').trigger(\'click\')">Agregar Imagen</button>'+*/
	                     
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

                // palabra+= '<tr>'
                //     '<td style="width:10%; padding-top: 20px;">'+
                //         '<div class="col-sm-12 pl-5 pr-5" id="alterntaiva'+ data.alternativa[i].letra +'">'+
                //             '<textarea id="text-alternativa'+ data.alternativa[i].letra +'" rows="3" class="form-control"></textarea>'+
                //         '</div>'+
                //     '</td>'+
                // '</tr>'

                cantidadItemsConRecursos++;

                // if (data.alternativa[i].con_formula == true) {
                //     CKEDITOR.replace('alternativa'+data.alternativa[i].letra +'', {
                //       extraPlugins: 'mathjax',
                //       mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
                //       height: 120
                //     });
                // }
	        }

    

            $('#bodyAlternativas').append(palabra)
            if(image != null && image != ""){
                tieneImagen(i+1,data.alternativa[i].id_alternativa)
            }
      //       $("#button_archivo_adjunto"+(i+1)).on('click', function(){
		    // 	$("#"+data.alternativa[i].id_alternativa).html("Agregar Imagen");
		    // });

       /* }else{
            palabra = '<tr>' +
            '<td style="width:10%">' +
                '<div class="badge identificador-letra">' + data.alternativa[i].letra + '</div>' +
            '</td>' +
            '<td>' +
                '<div>' + seleccionarTipoRecurso(data.alternativa[i].tipo_recurso, data.alternativa[i].alternativa_recurso) + '</div>' +
            // '</td>'+
            //  '<td>'+ 
            // '<div class="offset-md-6" style="font-size: 14px">'+
            // '<button type="button" class="btn btn-primary input-file" data-toggle="modal" data-target="#adjuntarRecurso" style="min-width: max-content;">Adjuntar Recurso</button>'+
            // '</div>'+
            '</td>'+
            $('#bodyAlternativas').append(palabra)

        }*/

        if (data.alternativa[i].con_formula == true) {
            /*CKEDITOR.replace('alternativa'+data.alternativa[i].letra +'', {
              extraPlugins: 'mathjax',
              mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
              height: 120
            });*/

            CKEDITOR.replace('alternativa'+data.alternativa[i].letra +'', {
                extraPlugins: 'ckeditor_wiris',
                mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
                removePlugins: 'filetools,uploadimage,uploadwidget,uploadfile,filebrowser,easyimage',
                extraAllowedContent: mathElements.join( ' ' ) + '(*)[*]{*};img[data-mathml,data-custom-editor,role](Wirisformula)',
                
            } );
        }
    }


    // button_archivo_adjunto1
        
    // $("#button_archivo_adjunto1").on('click', function(){
    // 	$("#'"+data.alternativa[i].id_alternativa+"'").html("Agregar Imagen");
    // });
    // $("#button_archivo_adjunto2").on('click',function(){$('#'+data.alternativa[i].id_alternativa).html("Agregar Imagen")});
    // $("#button_archivo_adjunto3").on('click',function(){$('#'+data.alternativa[i].id_alternativa).html("Agregar Imagen")});
    // $("#button_archivo_adjunto4").on('click',function(){$('#'+data.alternativa[i].id_alternativa).html("Agregar Imagen")});   
    // }

    //barraFooter()

    if (data.cuerpo_item.con_formula == true) {
        /*CKEDITOR.replace('enunciado', {
          extraPlugins: 'mathjax',
          mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
          height: 120
        });*/

        CKEDITOR.replace( 'enunciado', {
            extraPlugins: 'ckeditor_wiris',
            mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
            removePlugins: 'filetools,uploadimage,uploadwidget,uploadfile,filebrowser,easyimage',
            extraAllowedContent: mathElements.join( ' ' ) + '(*)[*]{*};img[data-mathml,data-custom-editor,role](Wirisformula)'
        } );
    }

    if (data.cuerpo_item.pregunta_con_formula == true) {
       /* CKEDITOR.replace('pregunta', {
          extraPlugins: 'ckeditor_wiris',
          allowedContent: true,
          mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
          height: 120
        });*/

        /*CKEDITOR.plugins.addExternal( 'ckeditor_wiris', 'https://wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image' );*/
         
        CKEDITOR.replace( 'pregunta', {
            extraPlugins: 'ckeditor_wiris',
            mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
            removePlugins: 'filetools,uploadimage,uploadwidget,uploadfile,filebrowser,easyimage',
            extraAllowedContent: mathElements.join( ' ' ) + '(*)[*]{*};img[data-mathml,data-custom-editor,role](Wirisformula)'
        } );


    }

    if(data.cuerpo_item.estado_carga == 'finalizado'){
       $('#footer-finalizar').hide(); 
       var buttonsAgregar = document.getElementsByClassName("file-upload-btn");
        for (var i = 0; i < buttonsAgregar.length; i++) {
            buttonsAgregar[i].style.display = "none";
        }

        var buttonsEliminar = document.getElementsByClassName("remove-image");
        for (var i = 0; i < buttonsEliminar.length; i++) {
            buttonsEliminar[i].style.display = "none";
        }
    }
    // show()

}




// function guardarEvaluacion(data) {
//     console.log(select.id)
// }

// function recalcularEspacio() {
//     $('#card-body-observacion').height($("#contenido-footer").height() - 112);
//     $("#estimulo_obs").css("height", ($('#card-body-observacion').height() - 80) + "px");
//     $("#pregunta_obs").css("height", ($('#card-body-observacion').height() - 80) + "px");
//     $("#alternativa_obs").css("height", ($('#card-body-observacion').height() - 80) + "px");
// }

// function show(){
//     var value = CKEDITOR.instances.text_pregunta.getData();
//     console.log(value);

// }

function limpiar(){
    $('#guardar').prop('disabled', false);
    $('#guardar').css('display','');
    $('#finalizar').prop('disabled', false);
    $('#finalizar').css('display','');

    var textareas = document.getElementsByTagName("textarea");
    for (var i = 0; i < textareas.length; i++) {
        textareas[i].value = '';
    }
}

function disableData(){
    $('#footer-finalizar').hide();

    CKEDITOR.instances.enunciado != undefined ? CKEDITOR.instances.enunciado.setReadOnly(true) : null;
    CKEDITOR.instances.pregunta != undefined ? CKEDITOR.instances.pregunta.setReadOnly(true) : null;

    $('#bodyAlternativas tr').each(function() {
        if($(this).attr('id') != undefined){

            div =  $(this).find('td:nth-child(2) div')
            CKEDITOR.instances[$(div[0]).attr('id')] != undefined ?  CKEDITOR.instances[$(div[0]).attr('id')].setReadOnly(true)  : null;
   
        }
    })

    var buttonsAgregar = document.getElementsByClassName("file-upload-btn");
    for (var i = 0; i < buttonsAgregar.length; i++) {
        buttonsAgregar[i].style.display = "none";
    }

    var buttonsEliminar = document.getElementsByClassName("remove-image");
    for (var i = 0; i < buttonsEliminar.length; i++) {
        buttonsEliminar[i].style.display = "none";
    }
}


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
                    if(directorio_imagen != -1){
                        readURL(name_button)
                    }
               		 
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
    $("#finalizar").hide();
    var j = 1+data.alternativa.length;

    for (var i = 0; i < j; i++) {
        if ($("#div_file_upload_content"+i).css('display') == 'block') {

        }
    }

    if($("#div_file_upload_content0").css('display') == 'block' || $("#div_file_upload_content1").css('display') == 'block'){
        $("#finalizar").show();
    };

}


/*function barraFooter(){

    if(cantidadItemsConRecursos == itemsConRecursos){
        $('#footer-finalizar').show();
    }else{
        $('#footer-finalizar').hide();
    }   
}*/