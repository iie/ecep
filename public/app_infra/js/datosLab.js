$(document).ready(function(){
    loginvalid(localStorage.getItem('nombre_tecnico'))
});

function loginvalid(id_tec){
    
    if (id_tec==null) {
        console.log("S"+"ño");
         showFeedback("error","Debes iniciar sesion con la cuenta vinculada al sistema","Datos incorrectos");
         redirectLogin()
    } else {
        $('#nombre_tecnico').html(localStorage.nombre_tecnico)
        $('#rut_tecnico').html($.formatRut(localStorage.run))
    datos()

    
    console.log(JSON.parse(localStorage.getItem('datos_visitas')))
    }
}

function datos(){
    run = localStorage.run;
    if(run != ""){
        $.ajax({
            method: 'POST',
            url: server+'api/login-tecnico',
            crossDomain: true,
            dataType: 'text',
            data:{
                run,
                infralab : 1
            },
            success: function(data, textStatus, jqXHR) {
                    if(!isJSON(data)){
                        showFeedback("error","Error en los datos ingresados","Datos incorrectos");
                    }else{
                        if (JSON.parse(data).respuesta == "ok") {
                            respuesta = JSON.parse(data).descripcion
                            cargarVisitas(respuesta);
                        }else {                            
                            showFeedback("error",JSON.parse(data).descripcion,"Error");                           
                            console.log("invalidos")
                        }
                    }
            },
            error: function(jqXHR, textStatus, errorThrown) {   
                    showFeedback("error","El servidor no responde correctamente","Error en el servidor");
                        //feedback
                    console.log("error");

            }
        })

    }else{
        showFeedback("error","Ingrese el RUN","Campo vacío");
    }
}
var visitas;
function cargarVisitas(data) {
    visitas = data.datos_visitas
    for (var i = 0; i < visitas.length; i++) {
   
        labs =  '<div class="col-12 pb-3 pl-1 pr-1">'+
                    '<div class="card">'+
                    	' <div class="card-header row m-0 pb-0">'+
    						'<div class="col-1 p-0"><h5><i class="fas fa-university" style="color: #3D88E9;padding-right:10px;"></i></h5></div>'+
                            '<div class="col-11 "><h5 class="card-title" style="color: #3D88E9;">'+visitas[i].nombre+'</h5></div>'+
  						'</div>'+
                        '<div class="card-body pl-4 pr-4 pt-3 pb-4">' 

                            for (var j = 0; j < visitas[i].datos.length; j++) {
                                labs +='<p class="card-text"> SEDE '+(visitas[i].datos[j].nombre).toUpperCase()+'</p>'

                                for (var k = 0; k < visitas[i].datos[j].datos.length; k++) {
	                                labs +=  '<div class="card mt-3 mb-3">'+
	                                		 	'<div class="card-body pl-3 pr-0 pt-0">'+
                                                    '<div class="div-indicador text-center col-12 mb-3">'
                                                        if(visitas[i].datos[j].datos[k].visita_finalizada == true){
                                                            labs += '<p class="card-indicador indicador_finalizado mb-0">FINALIZADA</p>'
                                                        }else{
                                                            labs += '<p class="card-indicador mb-0 indicador_'+((visitas[i].datos[j].datos[k].estado.replace(" ","_")).toLowerCase())+'">'+
                                                                        (visitas[i].datos[j].datos[k].estado).toUpperCase()+
                                                                    '</p>'
                                                        }

                                            labs += '</div>'+
	                                		 		'<p class="card-text"><i class="fas fa-desktop" style="color: #3D88E9;padding-right:10px;"></i>'+visitas[i].datos[j].datos[k].nombre_laboratorio+'</p>'+
			                                		'<p class="card-text-lab mb-0">'+visitas[i].datos[j].datos[k].direccion+'</p>'+
                                                    '<div class="row">'+
                                                        '<div class="col-8">'+
                                                            '<p class="card-text-lab"><i class="far fa-calendar" style="color: #3D88E9;padding-right:2px;"></i>'+moment(visitas[i].datos[j].datos[k].fecha_visita).format('DD MMMM YYYY')+'</p>'+
                                                        '</div>'+
                                                        '<div class="col-4 pl-1">'+
                                                            '<p class="card-text-lab"><i class="far fa-clock" style="color: #3D88E9;padding-right:2px;"></i>'+moment(visitas[i].datos[j].datos[k].fecha_visita).format('h:mm a')+'</p>'+
                                                        '</div>'+
                                                    '</div>'+
	                               			 	'</div>'+
                                                //console.log(JSON.stringify(visitas[i].datos[0].datos[k]).replace(/"/g,''))
	                               			 	'<div class="card-footer"onclick="redirectlaboratorio('+i+','+j+','+k+')">'+(visitas[i].datos[j].datos[k].visita_finalizada == true ? 'Ver': 'Realizar Visita')+'</div>'+
	                               			 '</div>'	                        	
	                            }
                            }
                        labs += '</div>'+
                    '</div>'+
                '</div>'


        $('#info_visitas').append(labs);
    }
}

function redirectlaboratorio(i,j,k){
    localStorage.setItem('datos_lab', JSON.stringify(visitas[i].datos[j].datos[k]));
    localStorage.nombre_institucion = visitas[i].nombre
    localStorage.nombre_sede = visitas[i].datos[j].nombre
    localStorage.id_lab = visitas[i].datos[j].datos[k].id_laboratorio
    localStorage.id_visita = visitas[i].datos[j].datos[k].id_visita
    localStorage.id_tecnico =  visitas[i].datos[j].datos[k].id_tecnico_encargado
    localStorage.finalizado =  visitas[i].datos[j].datos[k].visita_finalizada
    localStorage.direccion = visitas[i].datos[j].datos[k].direccion
    location.href = server+'app_infra/app1.html'
}

function salir(){

    swal({
        text: '¿Está seguro que desea salir?',

        showCancelButton: true,
        showCloseButton: true,
        confirmButtonColor: '#7cd1f9',
        //cancelButtonColor: '#d33',
        confirmButtonText: 'Salir',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            redirectLogin()
     

        }
    })

}