$(document).ready(function(){
	$('#ingresaPersonal').on('click', ingresaPersonal) 
 	$('#ingresaInfraestructura').on('click', ingresaInfraestructura)
 	$('#ingresaMateriales').on('click', ingresaMateriales) 
 	$('#ingresMP3').on('click', ingresMP3)
 	$('#ingresaTracking').on('click', ingresaTracking)  
 	/*
 	
 	$('#ingresaCallCenter').on('click', ingresaCallCenter) 	 
 	$('#ingresaAplicacion').on('click', ingresaAplicacion) 
 	$('#ingresaDigitalizacion').on('click', ingresaDigitalizacion) 
 	  */
});

function ingresaInfraestructura(){
	redirectInfraestructura()
}

function ingresaMateriales(){
	redirectMateriales()
}

function ingresaPersonal(){
	redirectPersonal()
}

function ingresaCallCenter(){
	redirectCallCenter()
}

function ingresaTracking(){
	redirectTracking()
}

function ingresaAplicacion(){
	redirectAplicacion()
}

function ingresaDigitalizacion(){
	redirectDigitalizacion()
}

function ingresMP3(){
	redirectMP3()
} 
 

  
 