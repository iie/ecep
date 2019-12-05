$(document).ready(function() {
    $('#lblJardin').html(localStorage.getItem("nombre_jardin"));
    $('#btncerrar').on("click", redirectLogin)
});

function redirectLogin() {
    localStorage.clear()
    location.href = '/'
}
