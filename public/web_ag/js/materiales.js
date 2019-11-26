$(document).ready(function(){
	loginvalid(localStorage.getItem('user'))
	$('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')

    $('#redirect').css('display','');

    $('#redirect').on('click',redirectModulo);
 	//login() 
});

function login(){
	// //$('#imprenta').attr('src','https://simce.amf.cl/')	
	// $.ajax({
	    // type: "GET",
		// url: "https://simce.amf.cl/bin/login.php",
		// cache: false,
		// crossDomain: true,
	    // data: {user:"ufro", pass:"ufro"},
	    // dataType: 'JSON',
	    // beforeSend: function(){},
	    // success: function(response){
	    	// console.log('asdf')
	        // // /*swal(response.paso);*/ console.log(response);	
	        // $('#imprenta').attr('src','https://simce.amf.cl/')	
	        // /*if (response.paso == "sinusu") {
	        	// $("input[type=text]").val("").focus();
	        	// $("p:eq(0)").html("Usuario Inválido");
	        // }else if (response.paso == "sinclave") {
	        	// $("input[type=password]").val("").focus();
	        	// $("p:eq(0)").html("Clave Incorrecta");
	        // }else if (response.paso = "paso") {
	        	// $("p:eq(0)").html("");
	        	// window.location = "./";
	        // }*/
	    // },
	    // error: function(response){} 
	 // });
}

