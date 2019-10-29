$(document).ready(function(){
$('#a10').on('input', function () {
    var value = $(this).val();
    
    if ((value !== '') && (value.indexOf('.') === -1)) {
        
        $(this).val(Math.max(Math.min(value, 15), -2));
    }
});
loginvalid(localStorage.getItem('nombre_tecnico'))    
});

function loginvalid(id_tec){
    
    if (id_tec==null) {
        
        showFeedback("error","Debes iniciar sesion con la cuenta vinculada al sistema","Datos incorrectos");
        redirectLogin()
    } else {
    $('#nombre_tecnico').html(localStorage.nombre_tecnico)
    $('#rut_tecnico').html($.formatRut(localStorage.run))
    $("#btnFinalizar").on('click', finalizar);
    cargarDatosLab()
    scrollBtn()
    changeChecks()
    infoLab()
    }
}

function cargarDatosLab(){
   $.ajax({

        method: 'POST',
        url: server +'api/obtener-datos-lab',
        headers: {
                't' : localStorage.token,
        },
        crossDomain: true,
        dataType: 'text',
        data:{
                id_visita: localStorage.id_visita,
                id_persona: localStorage.id_tecnico,
        },

        success: function(data, textStatus, jqXHR) {
            if (JSON.parse(data).respuesta == "ok") {
                marcarChecks(JSON.parse(data).descripcion)
            }else {
                console.log("invalidos")
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            //feedback
            console.log("error");

        }
    })
}

function infoLab(){
    var datos_lab = JSON.parse(localStorage.getItem('datos_lab'));

    $('#nombre_tecnico_modal').html(localStorage.nombre_tecnico)
    $('#rut_tecnico_modal').html($.formatRut(localStorage.run))
    $('#fecha_visita').html(moment(datos_lab.fecha_visita).format('DD MMMM YYYY, h:mm:ss a'))
    $('#nombre_laboratorio_modal').html(datos_lab.nombre_laboratorio)
    $('#datos_institucion').html(localStorage.nombre_institucion)
    $('#datos_sede').html(' '+localStorage.nombre_sede)
    $('#direccion_laboratorio').html(localStorage.direccion)

    $('#nombre_contacto').html(datos_lab.contacto_nombre)
    $('#cargo_contacto').html(datos_lab.contacto_cargo)
    $('#telefono_contacto').html(datos_lab.contacto_telefono)
    $('#mail_contacto').html(datos_lab.contacto_email)

}


function marcarChecks(data){
    localStorage.id_visita = data.datos_visita.id_laboratorio_visita;
    /*INFRAESTRUCTURA*/
    $("input[name='a1'][value='"+data.infraestructura.a1+"']").prop('checked', true);
    $('#b_a1_'+data.infraestructura.a1).addClass('active btn-primary');
    marcarColor('b_a1_'+data.infraestructura.a1)

    $("input[name='a2'][value='"+data.infraestructura.a2+"']").prop('checked', true);
    $('#b_a2_'+data.infraestructura.a2).addClass('active btn-primary');
    marcarColor('b_a2_'+data.infraestructura.a2)

    $("input[name='a3'][value='"+data.infraestructura.a3+"']").prop('checked', true);
    $('#b_a3_'+data.infraestructura.a3).addClass('active btn-primary');
    marcarColor('b_a3_'+data.infraestructura.a3)

    $("input[name='a4'][value='"+data.infraestructura.a4+"']").prop('checked', true);
    $('#b_a4_'+data.infraestructura.a4).addClass('active btn-primary');
    marcarColor('b_a4_'+data.infraestructura.a4)

    $("input[name='a5'][value='"+data.infraestructura.a5+"']").prop('checked', true);
    $('#b_a5_'+data.infraestructura.a5).addClass('active btn-primary');
    marcarColor('b_a5_'+data.infraestructura.a5)

    $("input[name='a6'][value='"+data.infraestructura.a6+"']").prop('checked', true);
    $('#b_a6_'+data.infraestructura.a6).addClass('active btn-primary');
    marcarColor('b_a6_'+data.infraestructura.a6)

    $("input[name='a7'][value='"+data.infraestructura.a7+"']").prop('checked', true);
    $('#b_a7_'+data.infraestructura.a7).addClass('active btn-primary');
    marcarColor('b_a7_'+data.infraestructura.a7)

    $('#a8_acceso1').val(data.infraestructura.a8_acceso1);
    $('#a8_acceso2').val(data.infraestructura.a8_acceso2);

    $('#a10').val(data.infraestructura.a10)

    $("input[name='a9'][value='"+data.infraestructura.a9+"']").prop('checked', true);
    $('#b_a9_'+data.infraestructura.a9).addClass('active btn-primary');
    marcarColor('b_a9_'+data.infraestructura.a9)

    $("input[name='a12'][value='"+data.infraestructura.a12+"']").prop('checked', true);
    $('#b_a12_'+data.infraestructura.a12).addClass('active btn-primary');
    marcarColor('b_a12_'+data.infraestructura.a12)

    $('#a11').val(data.infraestructura.a11)


    $('#infra_observaciones').val(data.infraestructura.observaciones)

   /* RED ELECTRICA Y CONECTIVIDAD*/
    $("input[name='b1'][value='"+data.red_electrica.b1+"']").prop('checked', true);
    $('#b_b1_'+data.red_electrica.b1).addClass('active btn-primary');
    marcarColor('b_b1_'+data.red_electrica.b1)

    $("input[name='b2'][value='"+data.red_electrica.b2+"']").prop('checked', true);
    $('#b_b2_'+data.red_electrica.b2).addClass('active btn-primary');
    marcarColor('b_b2_'+data.red_electrica.b2)

    $("input[name='b3'][value='"+data.red_electrica.b3+"']").prop('checked', true);
    $('#b_b3_'+data.red_electrica.b3).addClass('active btn-primary');
    marcarColor('b_b3_'+data.red_electrica.b3)

    $('#b3_cantidad').val(data.red_electrica.b3_cantidad);
    $("input[name='b4'][value='"+data.red_electrica.b4+"']").prop('checked', true);
    $('#b_b4_'+data.red_electrica.b4).addClass('active btn-primary');
    marcarColor('b_b4_'+data.red_electrica.b4)

    $('#b4_ubicacion').val(data.red_electrica.b4_ubicacion);
    $("input[name='b5'][value='"+data.red_electrica.b5+"']").prop('checked', true);
    $('#b_b5_'+data.red_electrica.b5).addClass('active btn-primary');
    marcarColor('b_b5_'+data.red_electrica.b5)

    $('#b5_cantidad_cableada').val(data.red_electrica.b5_cantidad_cableada);
    $('#b5_cantidad_inalambrica').val(data.red_electrica.b5_cantidad_inalambrica);
    $('#b6').val(data.red_electrica.b6);
    $('#b7').val(data.red_electrica.b7);
    $('#b8').val(data.red_electrica.b8);

    $('#red_observaciones').val(data.red_electrica.observaciones)

    /*MOILIARIO*/

    $("input[name='c1'][value='"+data.mobiliario.c1+"']").prop('checked', true);
    $('#b_c1_'+data.mobiliario.c1).addClass('active btn-primary');
    marcarColor('b_c1_'+data.mobiliario.c1)

    $("input[name='c2'][value='"+data.mobiliario.c2+"']").prop('checked', true);
    $('#b_c2_'+data.mobiliario.c2).addClass('active btn-primary');
    marcarColor('b_c2_'+data.mobiliario.c2)

    $("input[name='c3'][value='"+data.mobiliario.c3+"']").prop('checked', true);
    $('#b_c3_'+data.mobiliario.c3).addClass('active btn-primary');
    marcarColor('b_c3_'+data.mobiliario.c3)

    $('#c3_cantidad').val(data.mobiliario.c3_cantidad);
    $("input[name='c4'][value='"+data.mobiliario.c4+"']").prop('checked', true);
    $('#b_c4_'+data.mobiliario.c4).addClass('active btn-primary');
    marcarColor('b_c4_'+data.mobiliario.c4)

    $('#mobiliario_observaciones').val(data.mobiliario.observaciones)

    /*RESULTADOS*/

    $("input[name='r1'][value='"+data.chequeo.resultado+"']").prop('checked', true);
    $('#b_r1_'+data.chequeo.resultado).addClass('active btn-primary');
    marcarColor('b_r1_'+data.chequeo.resultado)

    var acceso = null;
    if(data.chequeo.acceso_desde_0730 != null){
        if(data.chequeo.acceso_desde_0730 == true){
            acceso = "SI";
        }else{
            $('#hora_acceso').css('display','')
            $('#a11').prop('disabled',false)
            acceso = "NO";
        }
    }
    $("input[name='r2'][value='"+acceso+"']").prop('checked', true);
    $('#b_r2_'+acceso).addClass('active btn-primary');
    marcarColorBool('b_r2_'+acceso)


    $('#r3').val(data.chequeo.nro_equipos_operativos);
    $('#r4').val(data.chequeo.nro_equipos_no_operativos);
    $('#r5').val(data.chequeo.nro_equipos_contingencia);
    $("input[name='r6'][value='"+data.chequeo.r6+"']").prop('checked', true);
    $('#b_r6_'+data.chequeo.r6).addClass('active btn-primary');
    marcarColor('b_r6_'+data.chequeo.r6)

    $('#r7').val(data.chequeo.nombre_contacto_apertura);
    $('#r8').val(data.chequeo.nombre_referencia_laboratorio);

    $('#resultado_observaciones').val(data.chequeo.observaciones)

    $('#observaciones-datos').val(data.contacto_observacion)
 
    if(localStorage.finalizado == "true"){
        disabledData()
    }
    
}

var back = false;
function guardarRespuesta (estado){

	if(estado == 1){
		$.blockUI({ message: '<h5 style="font-size: 17px;">Enviando su respuesta</h5>' })
	}else{
		$.blockUI({ message: '<h5 style="font-size: 17px;">Enviando su respuesta</h5>' });

	}
     
    $.ajax({

        method: 'POST',
        url: server+'api/guardar-datos-lab',
         headers: {
            't' : localStorage.token,
        },
        crossDomain: true,
        dataType: 'text',
        data: {
            id_visita: localStorage.id_visita,
            id_persona: localStorage.id_tecnico,
            finalizado: estado,
            contacto_observacion: $('#observaciones-datos').val(),
            //RESULTADOS DEL CHEQUEO
            chequeo:{
                resultado: $("input[name='r1']:checked").val(),
                acceso_desde_0730: $("input[name='r2']:checked").val(),
                nro_equipos_operativos: $("#r3").val(),
                nro_equipos_no_operativos: $("#r4").val(),
                nro_equipos_contingencia: $("#r5").val(),
                r6: $("input[name='r6']:checked").val(),
                nombre_contacto_apertura: $("#r7").val(),
                nombre_referencia_laboratorio: $("#r8").val(),
                observaciones:$("#resultado_observaciones").val(),
            },
            //INFRAESTRUCTURA
            infraestructura:{
                a1: $("input[name='a1']:checked").val(),
                a2: $("input[name='a2']:checked").val(),
                a3: $("input[name='a3']:checked").val(),
                a4: $("input[name='a4']:checked").val(),
                a5: $("input[name='a5']:checked").val(),
                a6: $("input[name='a6']:checked").val(),
                a7: $("input[name='a7']:checked").val(),
                a8_acceso1: $("#a8_acceso1").val(),
                a8_acceso2:$("#a8_acceso2").val(),
                a9: $("input[name='a9']:checked").val(),
                a10: $("#a10").val(),
                a11: $("#a11").val(),
                a12: $("input[name='a12']:checked").val(),
                observaciones:$("#infra_observaciones").val(),
            },

            //MOBILIARIO
            mobiliario:{
                c1: $("input[name='c1']:checked").val(),
                c2: $("input[name='c2']:checked").val(),
                c3: $("input[name='c3']:checked").val(),
                c3_cantidad:$("#c3_cantidad").val(), 
                c4: $("input[name='c4']:checked").val(),
                observaciones:$("#mobiliario_observaciones").val(),
            },
            
            //RED ELECTRICA Y CONECTIVIDAD
            red_electrica:{
                b1: $("input[name='b1']:checked").val(),
                b2: $("input[name='b2']:checked").val(),
                b3: $("input[name='b3']:checked").val(),
                b3_cantidad:$("#b3_cantidad").val(),
                b4: $("input[name='b4']:checked").val(),
                b4_ubicacion:$("#b4_ubicacion").val(),
                b5: $("input[name='b5']:checked").val(),
                b5_cantidad_cableada: $("#b5_cantidad_cableada").val(),
                b5_cantidad_inalambrica: $("#b5_cantidad_inalambrica").val(),
                b6: $("#b6").val(),
                b7: $("#b7").val(),
                b8: $("#b8").val(),
                observaciones:$("#red_observaciones").val(),
            }, 
        }, 
        success: function(data, textStatus, jqXHR) {
            if (JSON.parse(data).respuesta == "ok") {
                limpiarInput()
                $.unblockUI()
                if (estado == true){
                    disabledData()
                    back = true
                }
                // marcarChecks(JSON.parse(data).descripcion)
            }else {
                $.unblockUI()
                showFeedback("error",JSON.parse(data).descripcion,"Error");
                console.log("invalidos")
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            $.unblockUI()    
            showFeedback("error",JSON.parse(data).descripcion,"Error");
            //feedback
            console.log("error");

        }
    })
}

function desmarcarColor(id){
	if(id.slice(-2) == 'CO'){
        $('#'+id).removeClass('border-cumpleObs')
    }else if(id.slice(-2) ==  '_C'){
        $('#'+id).removeClass('border-cumple')
    }else if(id.slice(-2) == 'NC'){
        $('#'+id).removeClass('border-noCumple')
    }
}

function desmarcarColorBool(id){
	if(id.slice(-2) == 'SI'){
        $('#'+id).removeClass('border-cumple')
    }else if(id.slice(-2) ==  'NO'){
        $('#'+id).removeClass('border-noCumple')
    }
}

function marcarColorBool(id){
	if(id.slice(-2) == 'SI'){
        $('#'+id).addClass('border-cumple')
    }else if(id.slice(-2) ==  'NO'){
        $('#'+id).addClass('border-noCumple')
    }
}

function marcarColor(id){
    if(id.slice(-2) == 'CO'){
        $('#'+id).addClass('border-cumpleObs')
    }else if(id.slice(-2) ==  '_C'){
       	$('#'+id).addClass('border-cumple')
    }else if(id.slice(-2) == 'NC'){
        $('#'+id).addClass('border-noCumple')
    }
}

function changeChecks(){

    $('label[name=options]').click(function(e) {
        $('label[name=options]').not(this).removeClass('active')
            .siblings('input').prop('checked',false)
            .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
        $(this).addClass('active')
            .siblings('input').prop('checked',true)
            .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
    });

    //INFRAESTRUCTURA 
        $('button[name=b_a1]').click(function(e) {
            $("button[name=b_a1]").parent().parent().removeClass('div_is-invalid')

			$('button[name=b_a1]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});


            $('button[name=b_a1]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');

       		marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_a2]').click(function(e) {
            $("button[name=b_a2]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_a2]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_a2]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_a3]').click(function(e) {
            $("button[name=b_a3]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_a3]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});
            $('button[name=b_a3]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_a4]').click(function(e) {
            $("button[name=b_a4]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_a4]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_a4]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_a5]').click(function(e) {
            $("button[name=b_a5]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_a5]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_a5]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_a6]').click(function(e) {
            $("button[name=b_a6]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_a6]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_a6]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_a7]').click(function(e) {
            $("button[name=b_a7]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_a7]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_a7]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_a9]').click(function(e) {
            $("button[name=b_a9]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_a9]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_a9]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_a12]').click(function(e) {
            $("button[name=b_a12]").parent().parent().removeClass('div_is-invalid')

            $('button[name=b_a12]').not(this).each( function() {
                desmarcarColor($(this).attr('id'))
            });

            $('button[name=b_a12]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

    //RED ELECTRICA Y CONECTIVIDAD 
        $('button[name=b_b1]').click(function(e) {
            $("button[name=b_b1]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_b1]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_b1]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_b2]').click(function(e) {
            $("button[name=b_b2]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_b2]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_b2]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_b3]').click(function(e) {
            $("button[name=b_b3]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_b3]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_b3]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_b4]').click(function(e) {
            $("button[name=b_b4]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_b4]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_b4]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });
        
        $('button[name=b_b5]').click(function(e) {
            $("button[name=b_b5]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_b5]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_b5]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_b6]').click(function(e) {
            $("button[name=b_b6]").parent().parent().removeClass('div_is-invalid')
            
            $('button[name=b_b6]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_b6]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

    //MOBILIARIO
        $('button[name=b_c1]').click(function(e) {
            $("button[name=b_c1]").parent().parent().removeClass('div_is-invalid')
            
            $('button[name=b_c1]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_c1]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_c2]').click(function(e) {
            $("button[name=b_c2]").parent().parent().removeClass('div_is-invalid')
            
            $('button[name=b_c2]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_c2]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_c3]').click(function(e) {
            $("button[name=b_c3]").parent().parent().removeClass('div_is-invalid')
            
            $('button[name=b_c3]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

			$('button[name=b_c3]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_c4]').click(function(e) {
            $("button[name=b_c4]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_c4]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_c4]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

    //RESULTADO
        $('button[name=b_r1]').click(function(e) {
            $("button[name=b_r1]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_r1]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_r1]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_r2]').click(function(e) {
            $("button[name=b_r2]").parent().parent().removeClass('div_is-invalid')

        	$('button[name=b_r2]').not(this).each( function() {
	 			desmarcarColorBool($(this).attr('id'))
			});

            $('button[name=b_r2]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
                console.log($(this).attr('id'))
                if($(this).attr('id') == "b_r2_SI"){
                    $('#hora_acceso').css('display','none')
                    $('#a11').val(null)
                    $('#a11').prop('disabled',true)
                }else{
                    $('#hora_acceso').css('display','')
                    $('#a11').prop('disabled',false)
                }

            marcarColorBool($(this).attr('id'))
            guardarRespuesta(0)
        });

        $('button[name=b_r6]').click(function(e) {
            $("button[name=b_r6]").parent().parent().removeClass('div_is-invalid')
        	$('button[name=b_r6]').not(this).each( function() {
	 			desmarcarColor($(this).attr('id'))
			});

            $('button[name=b_r6]').not(this).removeClass('active')
                .siblings('input').prop('checked',false)
                .siblings('button').addClass('btn-disable').removeClass('is-invalid_check');
            $(this).addClass('active')
                .siblings('input').prop('checked',true)
                .siblings('button').addClass('btn-primary').removeClass('is-invalid_check');
            marcarColor($(this).attr('id'))
            guardarRespuesta(0)
        });
}

function scrollBtn() {
    $('#btn-infra').on('click', function(e) {
        e.preventDefault();
        scroll= $('#card-infraestructura').offset().top - 55;
        $("html, body").animate({scrollTop: scroll }, 1000);
    });

    $('#btn-red').on('click', function(e) {
        e.preventDefault();
        scroll= $('#card-red').offset().top - 55;
        $("html, body").animate({scrollTop: scroll }, 1000);
    });

    $('#btn-mobiliario').on('click', function(e) {
        e.preventDefault();
        scroll= $('#card-mobiliario').offset().top - 55;
        $("html, body").animate({scrollTop: scroll }, 1000);
    });

    $('#btn-resul').on('click', function(e) {
        e.preventDefault();
        scroll= $('#card-resultados').offset().top - 55;
        $("html, body").animate({scrollTop: scroll }, 1000);
    });
}

function Numeros(string){
    var out = '';
    var filtro = '1234567890 ';
    
    for (var i=0; i<string.length; i++){
        if (filtro.indexOf(string.charAt(i)) != -1) {
            if(out.length<15){
                out += string.charAt(i);
            }
        }
    }
    return out;
}




function validarPisos(string){

    var out = '';
    var filtro = '';   

    if(string.charAt(-1) <= 9){
        out += string.charAt(0)
        if(string.charAt(1) <= 9 ){
            out += string.charAt(1)
            
        }
    }else if (string.charAt(0) < 2 && string.charAt(1) <=5){
        out += string.charAt(0)
        for (var i=1; i<string.length; i++){
            if (filtro.indexOf(string.charAt(i)) != -1) {
                if(out.length<2){
                    out += string.charAt(i);
                }
            }
        }
    }        
    return out;
    
}

function isJSON (something) {
    if (typeof something != 'string')
        something = JSON.stringify(something);
    try {
        JSON.parse(something);
        return true;
    } catch (e) {
        return false;
    }
}

function finalizar(){
    if (checkFinalizar()) {
        swal({
            text: '¿Está seguro que desea finalizar la visita?',

            showCancelButton: true,
            showCloseButton: true,
            confirmButtonColor: '#7cd1f9',
            //cancelButtonColor: '#d33',
            confirmButtonText: 'Finalizar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                guardarRespuesta(1);
                localStorage.setItem("finalizado",true);
                //disabledData();

            }
        })
    }
}

function saveLab(finalizar){

}
function limpiarInput(){
    $("input").each(function() {
        if($(this).attr('type') != 'checkbox'){
            if (this.disabled == false && (this.value == "" || this.value == undefined)) {
                //$(this).addClass('is-invalid')
            }else{
                if ($(this).parent().parent().hasClass('div_is-invalid')){
                    $(this).parent().parent().removeClass('div_is-invalid')
                }else{
                }
            }
        }
    }) 

    $("textarea").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
        }else{
            if ($(this).parent().parent().hasClass('div_is-invalid')){
                console.log('Si');
                $(this).parent().parent().removeClass('div_is-invalid')
            }else{
                console.log('No');
            }
        }
    })
}

function checkFinalizar() {

    var resultado = true;
    var infra = 0;
    texto_infra = "";
    texto_red = "";
    texto_mobiliario = "";
    texto_resultado = "";
    var red = 0;
	var mobiliario = 0;
	var resultadoChequeo = 0;
    $("input").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            //$(this).addClass('is-invalid')
            $(this).parent().parent().addClass('div_is-invalid')
            
        }else{
            //$(this).removeClass('is-invalid') 
            $(this).parent().parent().removeClass('div_is-invalid')
           
        }
    })

    /*$("textarea").each(function() {
        if (this.disabled == false && (this.value == "" || this.value == undefined)) {
            $(this).addClass('is-invalid')
            if($(this).attr('id') == 'a11'){
                texto_infra += "<li>A 11</li>"
                infra++;         
                resultado = false;
            }
    
   
        }else{
            $(this).removeClass('is-invalid') 
        }
    })*/

    //INFRA
        if ($('#r8').is(':disabled') == false && ($('#r8').val() == "" || $('#r8').val() == undefined)) {
            texto_infra += "<li>A 1</li>"
            infra++;
        }

        if ($("input[name='r2']:checked").length == 0) {
            //$("button[name='b_r2']").addClass('is-invalid_check')
            $("button[name='b_r2']").parent().parent().addClass('div_is-invalid')
            resultado = false
            infra++;
            texto_infra += "<li>A 2</li>"
        }else{
            $("button[name='b_r2']").removeClass('is-invalid_check') 
        }

        if ($('#a11').is(':disabled') == false && ($('#a11').val() == "" || $('#a11').val() == undefined)) {
            texto_infra += "<li>A 2-2</li>"
            infra++;
        }

        if ($('#r7').is(':disabled') == false && ($('#r7').val() == "" || $('#r7').val() == undefined)) {
            infra++;
            texto_infra += "<li>A 3</li>"
        }

        if ($("input[name='a1']:checked").length == 0) {
            //$("button[name='b_a1']").addClass('is-invalid_check')
            $("button[name='b_a1']").parent().parent().addClass('div_is-invalid')
            texto_infra += "<li>A 4</li>"
            infra++;
            resultado = false
        }else{
            $("button[name='b_a1']").removeClass('is-invalid_check')    
        }

        if ($("input[name='a2']:checked").length == 0) {
            //$("button[name='b_a2']").addClass('is-invalid_check')
            $("button[name='b_a2']").parent().parent().addClass('div_is-invalid')
            texto_infra += "<li>A 5</li>"
            infra++;
            resultado = false
        }else{
            $("button[name='b_a2']").removeClass('is-invalid_check') 
        }

        if ($("input[name='a3']:checked").length == 0) {
            //$("button[name='b_a3']").addClass('is-invalid_check')
            $("button[name='b_a3']").parent().parent().addClass('div_is-invalid')
            texto_infra += "<li>A 6</li>"
            infra++;
            resultado = false
        }else{
            $("button[name='b_a3']").removeClass('is-invalid_check') 
        }

        if ($("input[name='a4']:checked").length == 0) {
            //$("button[name='b_a4']").addClass('is-invalid_check')
            $("button[name='b_a4']").parent().parent().addClass('div_is-invalid')
            texto_infra += "<li>A 7</li>"
            infra++;
            resultado = false
        }else{
            $("button[name='b_a4']").removeClass('is-invalid_check') 
        }

        if ($("input[name='a5']:checked").length == 0) {
            //$("button[name='b_a5']").addClass('is-invalid_check')
            $("button[name='b_a5']").parent().parent().addClass('div_is-invalid')
            texto_infra += "<li>A 8</li>"
            infra++;
            resultado = false
        }else{
            $("button[name='b_a5']").removeClass('is-invalid_check') 
        }

        if ($("input[name='a6']:checked").length == 0) {
            //$("button[name='b_a6']").addClass('is-invalid_check')
            $("button[name='b_a6']").parent().parent().addClass('div_is-invalid')
            texto_infra += "<li>A 9</li>" 
            infra++;
            resultado = false
        }else{
            $("button[name='b_a6']").removeClass('is-invalid_check')
        }

        if ($("input[name='a7']:checked").length == 0) {
            //$("button[name='b_a7']").addClass('is-invalid_check')
            $("button[name='b_a7']").parent().parent().addClass('div_is-invalid')
            texto_infra += "<li>A 10</li>"
            infra++;
            resultado = false
        }else{
            $("button[name='b_a7']").removeClass('is-invalid_check') 
        }

        if ($('#a8_acceso1').is(':disabled') == false && ($('#a8_acceso1').val() == "" || $('#a8_acceso1').val() == undefined)) {
            texto_infra += "<li>A 11-1</li>"
            infra++;
        }

        if ($('#a8_acceso2').is(':disabled') == false && ($('#a8_acceso2').val() == "" || $('#a8_acceso2').val() == undefined)) {
            texto_infra += "<li>A 11-2</li>"
            infra++;
        }

        if ($('#a10').is(':disabled') == false && ($('#a10').val() == "" || $('#a10').val() == undefined)) {
            texto_infra += "<li>A 12</li>"
            infra++;
        }

        if ($("input[name='a9']:checked").length == 0) {
            //$("button[name='b_a9']").addClass('is-invalid_check')
            $("button[name='b_a9']").parent().parent().addClass('div_is-invalid')
            texto_infra += "<li>A 13</li>"
            infra++;
            resultado = false
        }else{
            $("button[name='b_a9']").removeClass('is-invalid_check') 
        }

        if ($("input[name='a12']:checked").length == 0) {
            //$("button[name='b_a12']").addClass('is-invalid_check')
            $("button[name='b_a12']").parent().parent().addClass('div_is-invalid')
            texto_infra += "<li>A 14</li>"
            infra++;
            resultado = false
        }else{
            $("button[name='b_a12']").removeClass('is-invalid_check') 
        }

        /*if ($('#infra_observaciones').is(':disabled') == false && ($('#infra_observaciones').val() == "" || $('#infra_observaciones').val() == undefined)) {
            $("#infra_observaciones").parent().parent().addClass('div_is-invalid')
            texto_infra += "<li>A 15</li>"
            infra++;
            //$('#infra_observaciones').addClass('is-invalid')
        }else{
            //$('#infra_observaciones').removeClass('is-invalid')
            $("#infra_observaciones").parent().parent().css({"border": "0px"})
        }*/

    //RED

        if ($("input[name='b1']:checked").length == 0) {
            //$("button[name='b_b1']").addClass('is-invalid_check')
            $("button[name='b_b1']").parent().parent().addClass('div_is-invalid')
            resultado = false
            texto_red += "<li>B 1</li>"
            red++;
        }else{
            $("button[name='b_b1']").removeClass('is-invalid_check') 
        }

        if ($("input[name='b2']:checked").length == 0) {
            //$("button[name='b_b2']").addClass('is-invalid_check') 
            $("button[name='b_b2']").parent().parent().addClass('div_is-invalid')
            red++;
            resultado = false
            texto_red += "<li>B 2</li>"
        }else{
            $("button[name='b_b2']").removeClass('is-invalid_check') 
        }

        if ($("input[name='b3']:checked").length == 0) {
            //$("button[name='b_b3']").addClass('is-invalid_check') 
            $("button[name='b_b3']").parent().parent().addClass('div_is-invalid')
            texto_red += "<li>B 3-1</li>"
            resultado = false
            red++;
        }else{
            $("button[name='b_b3']").removeClass('is-invalid_check') 
        }

        if ($('#b3_cantidad').is(':disabled') == false && ($('#b3_cantidad').val() == "" || $('#b3_cantidad').val() == undefined)) {
            $("#b3_cantidad").parent().parent().addClass('div_is-invalid')
            texto_red += "<li>B 3-2</li>"
            red++;
        }

        if ($("input[name='b4']:checked").length == 0) {
            //$("button[name='b_b4']").addClass('is-invalid_check') 
            $("button[name='b_b4']").parent().parent().addClass('div_is-invalid')
            resultado = false
            red++;
            texto_red += "<li>B 4-1</li>"
        }else{
            $("button[name='b_b4']").removeClass('is-invalid_check') 
        }

        if ($('#b4_ubicacion').is(':disabled') == false && ($('#b4_ubicacion').val() == "" || $('#b4_ubicacion').val() == undefined)) {
            $("#b4_ubicacion").parent().parent().addClass('div_is-invalid')
            texto_red += "<li>B 4-2</li>"
            red++;
        }

        if ($("input[name='b5']:checked").length == 0) {
            //$("button[name='b_b5']").addClass('is-invalid_check') 
            $("button[name='b_b5']").parent().parent().addClass('div_is-invalid')
            resultado = false
            red++;
            texto_red += "<li>B 5-1</li>"
        }else{
            $("button[name='b_b5']").removeClass('is-invalid_check') 
        }

        if ($('#b5_cantidad_cableada').is(':disabled') == false && ($('#b5_cantidad_cableada').val() == "" || $('#b5_cantidad_cableada').val() == undefined)) {
            $("#b5_cantidad_cableada").parent().parent().addClass('div_is-invalid')
            texto_red += "<li>B 5-2</li>"
            red++;
        }

        if ($('#b5_cantidad_inalambrica').is(':disabled') == false && ($('#b5_cantidad_inalambrica').val() == "" || $('#b5_cantidad_inalambrica').val() == undefined)) {
                texto_red += "<li>B 5-3</li>"
                red++;
        }

        if ($('#b6').is(':disabled') == false && ($('#b6').val() == "" || $('#b6').val() == undefined)) {
                texto_red += "<li>B 6</li>"
                red++;
        }

        if ($('#b7').is(':disabled') == false && ($('#b7').val() == "" || $('#b7').val() == undefined)) {
                texto_red += "<li>B 7</li>"
                red++;
        }

        if ($('#b8').is(':disabled') == false && ($('#b7').val() == "" || $('#b7').val() == undefined)) {
                texto_red += "<li>B 8</li>"
                red++;
        }

        /*if ($('#red_observaciones').is(':disabled') == false && ($('#red_observaciones').val() == "" || $('#red_observaciones').val() == undefined)) {
            $("#red_observaciones").parent().parent().addClass('div_is-invalid')
            texto_red += "<li>B 9</li>"
            red++;
            //$('#red_observaciones').addClass('is-invalid')
        }else{
            //$('#red_observaciones').removeClass('is-invalid')
        }*/

    //MOBILIARIO
        if ($("input[name='c1']:checked").length == 0) {
            //$("button[name='b_c1']").addClass('is-invalid_check') 
            $("button[name='b_c1']").parent().parent().addClass('div_is-invalid')
            resultado = false
            mobiliario++;
            texto_mobiliario += "<li>C 1</li>"
        }else{
            $("button[name='b_c1']").removeClass('is-invalid_check') 
        }

        if ($("input[name='c2']:checked").length == 0) {
            //$("button[name='b_c2']").addClass('is-invalid_check') 
            $("button[name='b_c2']").parent().parent().addClass('div_is-invalid')
            resultado = false
            mobiliario++;
            texto_mobiliario += "<li>C 2</li>"
        }else{
            $("button[name='b_c2']").removeClass('is-invalid_check') 
        }

        if ($("input[name='c3']:checked").length == 0) {
            //$("button[name='b_c3']").addClass('is-invalid_check') 
            $("button[name='b_c3']").parent().parent().addClass('div_is-invalid')
            resultado = false
            mobiliario++;
            texto_mobiliario += "<li>C 3-1</li>"
        }else{
            $("button[name='b_c3']").removeClass('is-invalid_check') 
        }

        if ($('#c3_cantidad').is(':disabled') == false && ($('#c3_cantidad').val() == "" || $('#c3_cantidad').val() == undefined)) {
                texto_mobiliario += "<li>C 3-2</li>"
                mobiliario++;
        }
        if ($("input[name='c4']:checked").length == 0) {
            //$("button[name='b_c4']").addClass('is-invalid_check') 
            $("button[name='b_c4']").parent().parent().addClass('div_is-invalid')
            resultado = false
            mobiliario++;
            texto_mobiliario += "<li>C 4</li>"
        }else{
            $("button[name='b_c4']").removeClass('is-invalid_check') 
        }
        /*
        if ($('#mobiliario_observaciones').is(':disabled') == false && ($('#mobiliario_observaciones').val() == "" || $('#mobiliario_observaciones').val() == undefined)) {
            texto_mobiliario += "<li>C 5</li>"
            mobiliario++;
            resultado = false
            //$('#mobiliario_observaciones').addClass('is-invalid')
            $("#mobiliario_observaciones").parent().parent().addClass('div_is-invalid')
        }else{
            $('#mobiliario_observaciones').removeClass('is-invalid')
        }*/

    //RESULTADO
        if ($("input[name='r1']:checked").length == 0) {
            //$("button[name='b_r1']").addClass('is-invalid_check') 
            $("button[name='b_r1']").parent().parent().addClass('div_is-invalid')
            resultado = false
            resultadoChequeo++;
            texto_resultado += "<li>D 1</li>"
        }else{
            $("button[name='b_r1']").removeClass('is-invalid_check') 
        }

        if ($('#r3').is(':disabled') == false && ($('#r3').val() == "" || $('#r3').val() == undefined)) {
                texto_resultado += "<li>D 2</li>"
                resultadoChequeo++;
        }
        if ($('#r4').is(':disabled') == false && ($('#r4').val() == "" || $('#r4').val() == undefined)) {
                texto_resultado += "<li>D 3</li>"
                resultadoChequeo++;
        }
        /*if ($('#r5').is(':disabled') == false && ($('#r5').val() == "" || $('#r5').val() == undefined)) {
                texto_resultado += "<li>D 5</li>"
                resultadoChequeo++;
        }*/

        /*if ($("input[name='r6']:checked").length == 0) {
            $("button[name='b_r6']").addClass('is-invalid_check')
            resultado = false
            resultadoChequeo++;
            texto_resultado += "<li>D 6</li>"
        }else{
            $("button[name='b_r6']").removeClass('is-invalid_check') 
        }*/

        /*
        if ($('#resultado_observaciones').is(':disabled') == false && ($('#resultado_observaciones').val() == "" || $('#resultado_observaciones').val() == undefined)) {
            texto_resultado += "<li>D 4</li>"
            resultadoChequeo++;
            resultado = false
            //$('#resultado_observaciones').addClass('is-invalid')
            $("#resultado_observaciones").parent().parent().addClass('div_is-invalid')
        }else{
            $('#resultado_observaciones').removeClass('is-invalid')
        }
        */




    if (resultado == false) {
        //showFeedback("error","Existen campos incompletos","Formulario incompleto");
        if(infra > 0){
            $('#row_infra').css('display','')
        }else{
            $('#row_infra').css('display','none')
        }

        if(red > 0){
            $('#row_red').css('display','') 
        }else{
            $('#row_red').css('display','none') 
        }

        if(mobiliario > 0){
            $('#row_mobiliario').css('display','')
        }else{
            $('#row_mobiliario').css('display','none')
        }

        if(resultadoChequeo > 0){
            $('#row_resultado').css('display','')
        }else{
            $('#row_resultado').css('display','none')
        }

        $('#faltantes_infraestructura').html(16-infra)
        $('#faltantes_red').html(13-red)
        $('#faltantes_mobiliario').html(6-mobiliario)
        $('#faltantes_resultado').html(4-resultadoChequeo)

        $('#li_infra').html(texto_infra)
        $('#li_red').html(texto_red)
        $('#li_mobiliario').html(texto_mobiliario)
        $('#li_resultado').html(texto_resultado)    

        $('#datosFaltantes').modal('show')
    }

    //$(".is-invalid").on('blur', validarNoCompletados)
    return resultado
}

function volver(){

    if(back == true || localStorage.finalizado == "false"){

        swal({
            text: '¿Está seguro que desea salir? Recuerde que debe finalizar la visita.',

            showCancelButton: true,
            showCloseButton: true,
            confirmButtonColor: '#7cd1f9',
            //cancelButtonColor: '#d33',
            confirmButtonText: 'Salir',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                redirectVista();
                //disableData();
         

            }
        })
    }else{
        redirectVista();
    }

}

function disabledData(){
    $('input').each( function() {
        this.disabled = true;
    });

    $('textarea').each( function() {
        this.disabled = true;
    });

    $('button').each( function() {
        this.disabled = true;
    });

    $('#info').prop('disabled',false)
    $('#close_modal').prop('disabled',false)

}
