$(document).ready(function(){
	tipoUsuario()
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
});

$(".custom-file-input").on("change", function() {
  var fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

function tipoUsuario(){
	if(JSON.parse(localStorage.user).id_tipo_usuario == 28){
		$('#card-infraestructura').remove();
		$('#card-evaluados').remove();
		$('#card-centros').remove();
		$('#card-capacitacion').remove();
		$('#card-rrhh').css('display','')
		$('#card-asignacion').css('display','')
		
	}else{
		$('#card-infraestructura').css('display','')
		$('#card-evaluados').css('display','')
		$('#card-rrhh').css('display','')
		$('#card-centros').css('display','')
		$('#card-asignacion').css('display','')
		$('#card-capacitacion').css('display','')
	}
}
 