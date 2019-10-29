$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')

    //redireccionar();
    // bancoItems();
    // ocultarLoading();
    // $('#nav_banco').addClass('active_menu');
    
});

$(".custom-file-input").on("change", function() {
  var fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

function redireccionar(perfil){
    
    switch(perfil){
        case 1:
            location.href = serverRedirect+'/_supervisor/banco-items.php'
        break;
        case 2:
            location.href = serverRedirect+'/_supervisor/carga-items.php'
        break;
        case 3:
            location.href = serverRedirect+'/_editor/editor-items.php'
        break;

        case 4:
            location.href = serverRedirect+'/_colaborador/colaborador.php'
        break;
    }
    
 }