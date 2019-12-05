var id_pregunta1=[];
$(document).ready(function () {
	getJardin()
    //tab 1.1
    $("#a1_1").change(function () { 

      console.log("La 1-1-a seleccionada es: " + $('input:radio[name=radgroupa]:checked').val());
       console.log("La 1-1-b seleccionada es: " + $('input:radio[name=radgroupb]:checked').val());
       console.log("La 1-1-c seleccionada es: " + $('input:radio[name=radgroupc]:checked').val());
       console.log("La 1-1-d seleccionada es: " + $('input:radio[name=radgroupd]:checked').val());
       console.log("La 1-1-e seleccionada es: " + $('input:radio[name=radgroupe]:checked').val());
      if ($('input:radio[name=radgroupa]:checked').val()!=null) {
      var letras = ["a", "b", "c", "d", "e", "f"]; 
      
      console.log(id_pregunta1)

        //console.log("La 1-1-a seleccionada es: " + $('input:radio[name=radgroupa]:checked').val());
        
        guardarJardin($('input:radio[name=radgroupa]:checked').val(),1);
      }
      if ($('input:radio[name=radgroupb]:checked').val()!=null) {
      
      }
      if ($('input:radio[name=radgroupc]:checked').val()!=null) {
        
      }
      if ($('input:radio[name=radgroupd]:checked').val()!=null) {
        
      }
      if ($('input:radio[name=radgroupe]:checked').val()!=null) {
        
      }
        
        
        
        
        
        document.getElementById('dot_1').style.backgroundColor='#45D2B1';
        $("#dot_1_1").css("backgroundColor","#45D2B1");
        
        
    });
    //tab 1.2
     $("#a1_2").change(function () {    
        console.log("La 1-2-a seleccionada es: " + $('input:radio[name=radgroupa]:checked').val());
        console.log("La 1-2-b seleccionada es: " + $('input:radio[name=radgroupb]:checked').val());
        console.log("La 1-2-c seleccionada es: " + $('input:radio[name=radgroupc]:checked').val());
        console.log("La 1-2-d seleccionada es: " + $('input:radio[name=radgroupd]:checked').val());
        console.log("La 1-2-e seleccionada es: " + $('input:radio[name=radgroupe]:checked').val());
        document.getElementById('dot_1').style.backgroundColor='#45D2B1';
        $("#dot_1_2").css("backgroundColor","#45D2B1");
     
    });
    //tab 1.3  
      $("#a1_3").change(function () {    
        console.log("La 1-3-a seleccionada es: " + $('input:radio[name=radgroupa]:checked').val());
        console.log("La 1-3-b seleccionada es: " + $('input:radio[name=radgroupb]:checked').val());
        console.log("La 1-3-c seleccionada es: " + $('input:radio[name=radgroupc]:checked').val());
        console.log("La 1-3-d seleccionada es: " + $('input:radio[name=radgroupd]:checked').val());
        console.log("La 1-3-e seleccionada es: " + $('input:radio[name=radgroupe]:checked').val());
        document.getElementById('dot_1').style.backgroundColor='#45D2B1';
        $("#dot_1_3").css("backgroundColor","#45D2B1");
        
    });
      //2.1
    $("#a2_1").change(function () {    
        alert("La 2-1-a seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
     $("#b2_1").change(function () {    
        alert("La 2-1-b seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
      $("#c2_1").change(function () {    
        alert("La 2-1-c seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
      $("#d2_1").change(function () {    
        alert("La 2-1-d seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
    //tab 2.2
     $("#a2_2").change(function () {    
        alert("La 2-2-a seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
     $("#b2_2").change(function () {    
        alert("La 2-2-b seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
      $("#c2_2").change(function () {    
        alert("La 2-2-c seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
      $("#d2_2").change(function () {    
        alert("La 2-2-d seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
      $("#e2_2").change(function () {    
        alert("La 2-2-e seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
     //2.3
    $("#a2_3").change(function () {    
        alert("La 2-3-a seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
     $("#b2_3").change(function () {    
        alert("La 2-3-b seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
      $("#c2_3").change(function () {    
        alert("La 2-3-c seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
      $("#d2_3").change(function () {    
        alert("La 2-3-d seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
       //2.4
    $("#a2_4").change(function () {    
        alert("La 2-4-a seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
     $("#b2_4").change(function () {    
        alert("La 2-4-b seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
      $("#c2_4").change(function () {    
        alert("La 2-4-c seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
      $("#d2_4").change(function () {    
        alert("La 2-4-d seleccionada es: " + $('input:radio[name=radgroup]:checked').val());
        
    });
});


function getJardin() {
    $.ajax({
        method: 'GET',
        url: 'php/obtenerRespuestas.php',
        crossDomain: true,
        dataType: 'json',
        data: {
            usuario: 999
        },
        success: function(data, textStatus, jqXHR) {
            
            if (data.respuesta == "ok"){
                var datos = data.descripcion;
                /*console.log(datos)*/
                llenarFormulario(datos)
            }else{
                alert("Error: " + data.descripcion);
            }
            // alert("Usuario encontrado");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // alert("Usuario no encontrado");
            // console.log(errorThrown);
        }
    });
}

function guardarJardin(data,data2) {
    $.ajax({
        method: 'GET',
        url: 'php/guardarRespuestas.php',
        crossDomain: true,
        dataType: 'json',
        data: {
            id_usuario: localStorage.id_usuario,
            id_alternativa: data,
            id_elemento_gestion: data2,
        },
        success: function(data, textStatus, jqXHR) {
            
            if (data.respuesta == "ok"){
               
                
              
            }else{
                alert("Error: " + data.descripcion);
            }
            // alert("Usuario encontrado");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // alert("Usuario no encontrado");
            // console.log(errorThrown);
        }
    });
}


function llenarFormulario(data){
  
  $("#nav1").html(data[0].nombre_area)
  $("#nav1_1").html("1."+data[0]["datos"][0].id_dimension+" "+data[0]["datos"][0].nombre_dimension)
  //var tipo = ["Basal", "Emergente", "Satisfactorio", "Consolidado", "Experto", "Destacado"];
  
  var letra = ["a", "b", "c", "d", "e", "f"];
  pregunta1=0;
  
  
  for (var j = 0; j < data[0]["datos"][0]["datos"].length; j++) {
  id_pregunta1.push({id_pregunta:data[0]["datos"][0]["datos"][j].id_pregunta})
  for (var ja = 0; ja < data[0]["datos"][0]["datos"][0]["datos"].length; ja++) {
   
  
  console.log(data[0]["datos"][0]["datos"][0]["datos"][ja].id_alternativa) 
    $("#a1_1").append(`<div class="col-12 mb-2" style="background:#53C2C2; color: #FFFFFF;margin-right: 2%;" id="`+letra[j]+`1_1-txt">
                        `+data[0]["datos"][0]["datos"][j].nombre_pregunta+`                            
                        </div>
                        <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF;border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="basal1_1`+letra[j]+`" name="radgroup`+letra[j]+`" value="`+data[0]["datos"][0]["datos"][0]["datos"][ja].id_alternativa+`">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="basal1_1`+letra[j]+`">Basal
                                      <br>0</label>

                              </div>
                              <div >

                                  <label class="pl-2 mb-0 label-status" for="basal1_1`+letra[j]+`" id="basal1_1`+letra[j]+`-txt" style="background: #FBF9F9; ">
                                      La Dirección no desarrolla trabajo específico en la línea del elemento de gestión, ya sea porque se encuentra organizando la gestión del jardín infantil en sus distintos dominios y componentes en su primer año de funcionamiento, o bien, porque no lo prioriza.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF;border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="emergente1_1`+letra[j]+`" name="radgroup`+letra[j]+`" value="`+data[0]["datos"][0]["datos"][0]["datos"][ja].id_alternativa+`">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="emergente1_1`+letra[j]+`">Emergente
                                      <br>1</label>

                              </div>
                              <div>

                                  <label class="pl-2 mb-0 label-status" for="emergente1_1`+letra[j]+`" id="emergente1_1`+letra[j]+`-txt" style="background: #FBF9F9;">
                                      La Dirección planifica definir criterios o generar un mecanismo para establecer un comportamiento socialmente responsable en el jardín infantil y preocupación por el medio ambiente, entorno y condiciones laborales y familiares del personal.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar " style="background: linear-gradient(to bottom, #DFDFDF,#DFDFDF 50%,#DFDFDF 50%,#FBF9F9 50%,#FBF9F9 100%); /* W3C background: #DFDFDF;*/border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="satisfactorio1_1`+letra[j]+`" name="radgroup`+letra[j]+`" value="`+data[0]["datos"][0]["datos"][0]["datos"][ja].id_alternativa+`">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="satisfactorio1_1`+letra[j]+`">Satisfactorio
                                      <br>2</label>

                              </div>
                              <div >
                                  <label class="pl-2 mb-0 label-status" for="satisfactorio1_1`+letra[j]+`" id="satisfactorio1_1`+letra[j]+`-txt" style="background: #FBF9F9;">
                                      La Dirección establece normas para asegurar el comportamiento socialmente responsable en el jardín infantil, orientando a la comunidad a contribuir con el cuidado del medio ambiente.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF; border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="consolidado1_1`+letra[j]+`" name="radgroup`+letra[j]+`" value="`+data[0]["datos"][0]["datos"][0]["datos"][ja].id_alternativa+`">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="consolidado1_1`+letra[j]+`">Consolidado
                                      <br>3</label>

                              </div>
                              <div>

                                  <label class="pl-2 mb-0 label-status" for="consolidado1_1`+letra[j]+`" id="consolidado1_1`+letra[j]+`-txt" style="background: #FBF9F9;">
                                      La Dirección diseña e implementa estrategias para asegurar el comportamiento socialmente responsable en el jardín infantil, orientando a la comunidad a contribuir con el cuidado del medio ambiente.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF; border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2" style="border: 2px solid #5964AD;">
                              <input type="radio" id="experto1_1`+letra[j]+`" name="radgroup`+letra[j]+`" value="`+data[0]["datos"][0]["datos"][0]["datos"][ja].id_alternativa+`">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #5964AD;border-bottom: 2px solid #5964AD;" align="center">
                                  <label for="experto1_1`+letra[j]+`">Experto
                                      <br>4</label>

                              </div>
                              <div>

                                  <label class="pl-2 mb-0 label-status" for="experto1_1`+letra[j]+`" id="experto1_1`+letra[j]+`-txt" style="padding-bottom: 23%;background: #FBF9F9;">
                                      La Dirección implementa estrategias para asegurar un comportamiento socialmente responsable en el jardín infantil y evalúa con agentes de la comunidad, contribuir al cuidado del medio ambiente y el entorno social.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF; border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="destacado1_1`+letra[j]+`" name="radgroup`+letra[j]+`" value="`+data[0]["datos"][0]["datos"][0]["datos"][ja].id_alternativa+`">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="destacado1_1`+letra[j]+`">Destacado
                                      <br>5</label>

                              </div>
                              <div>

                                  <label class="pl-2 mb-0 label-status" for="destacado1_1`+letra[j]+`" id="destacado1_1`+letra[j]+`-txt" style="background: #FBF9F9;">
                                      La Dirección no desarrolla trabajo específico en la línea del elemento de gestión, ya sea porque se encuentra organizando la gestión del jardín infantil en sus distintos dominios y componentes en su primer año de funcionamiento, o bien, porque no lo prioriza.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="row col-sm-12 mr-5" style="margin-top: 6%;">
                          <div class="col-sm-3">
                              <button class="btn text-white" type="button" id="agregarfile`+letra[j]+`" style="background: #69CBCA !important;">Asociar medio de verificación <i class="fas fa-plus"></i></button>
                          </div>
                          <div class="col-sm-6 ml-5 pl-5 pr-5 mb-5" style="padding-left: 0px !important; padding-right: 0px !important;margin-left: 25% !important;">
                              <table id="table-medioverificacion1_1`+letra[j]+`" class="stripe table table-hover _table-link dataTable no-footer" style="width:100%;">
                                  <thead>
                                      <tr>
                                          <th>N°</th>
                                          <th>Nombre de medio</th>
                                          <th>Comentario</th>
                                          <th>Descargar</th>
                                          <th>Eliminar</th>
                                      </tr>
                                  </thead>
                                  <tbody id="lista_medioverificacion1_1`+letra[j]+`">
                                  </tbody>
                              </table>
                          </div>
                      </div>`)}
  
  }
  $("#a1_1").append(`<div class="row justify-content-center mb-4">
                      <div class="col-12 text-right" style="margin-left: 216%;margin-top: 10%;">
                          <button type="button" class="btn btn-greys" style="background: #555555!important;">Atrás</button>
                          <button type="button" class="btn btn-greys" style="background: #52C2C2!important;">Guardar</button>
                          <button type="button" class="btn btn-greys" style="background: #666695!important;">Siguiente</button>
                      </div>
                  </div>`)

  $("#nav1_2").html("1."+data[0]["datos"][1].id_dimension+" "+data[0]["datos"][1].nombre_dimension)

   for (var k = 0; k < data[0]["datos"][1]["datos"].length; k++) {
  
  
    
    $("#a1_2").append(`<div class="col-12 mb-2" style="background:#53C2C2; color: #FFFFFF;margin-right: 2%;" id="`+letra[k]+`1_1-txt">
                        `+data[0]["datos"][1]["datos"][k].nombre_pregunta+`                            
                        </div>
                        <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF;border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="basal1_2`+letra[k]+`" name="radgroup`+letra[k]+`" value="0">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="basal1_2`+letra[k]+`">Basal
                                      <br>0</label>

                              </div>
                              <div >

                                  <label class="pl-2 mb-0 label-status" for="basal1_2`+letra[k]+`" id="basal1_2`+letra[k]+`-txt" style="background: #FBF9F9; ">
                                      La Dirección no desarrolla trabajo específico en la línea del elemento de gestión, ya sea porque se encuentra organizando la gestión del jardín infantil en sus distintos dominios y componentes en su primer año de funcionamiento, o bien, porque no lo prioriza.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF;border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="emergente1_2`+letra[k]+`" name="radgroup`+letra[k]+`" value="1">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="emergente1_2`+letra[k]+`">Emergente
                                      <br>1</label>

                              </div>
                              <div>

                                  <label class="pl-2 mb-0 label-status" for="emergente1_2`+letra[k]+`" id="emergente1_2`+letra[k]+`-txt" style="background: #FBF9F9;">
                                      La Dirección planifica definir criterios o generar un mecanismo para establecer un comportamiento socialmente responsable en el jardín infantil y preocupación por el medio ambiente, entorno y condiciones laborales y familiares del personal.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar " style="background: linear-gradient(to bottom, #DFDFDF,#DFDFDF 50%,#DFDFDF 50%,#FBF9F9 50%,#FBF9F9 100%); /* W3C background: #DFDFDF;*/border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="satisfactorio1_2`+letra[k]+`" name="radgroup`+letra[k]+`" value="2">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="satisfactorio1_2`+letra[k]+`">Satisfactorio
                                      <br>2</label>

                              </div>
                              <div >
                                  <label class="pl-2 mb-0 label-status" for="satisfactorio1_2`+letra[k]+`" id="satisfactorio1_2`+letra[k]+`-txt" style="background: #FBF9F9;">
                                      La Dirección establece normas para asegurar el comportamiento socialmente responsable en el jardín infantil, orientando a la comunidad a contribuir con el cuidado del medio ambiente.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF; border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="consolidado1_2`+letra[k]+`" name="radgroup`+letra[k]+`" value="3">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="consolidado1_2`+letra[k]+`">Consolidado
                                      <br>3</label>

                              </div>
                              <div>

                                  <label class="pl-2 mb-0 label-status" for="consolidado1_2`+letra[k]+`" id="consolidado1_2`+letra[k]+`-txt" style="background: #FBF9F9;">
                                      La Dirección diseña e implementa estrategias para asegurar el comportamiento socialmente responsable en el jardín infantil, orientando a la comunidad a contribuir con el cuidado del medio ambiente.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF; border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2" style="border: 2px solid #5964AD;">
                              <input type="radio" id="experto1_2`+letra[k]+`" name="radgroup`+letra[k]+`" value="4">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #5964AD;border-bottom: 2px solid #5964AD;" align="center">
                                  <label for="experto1_2`+letra[k]+`">Experto
                                      <br>4</label>

                              </div>
                              <div>

                                  <label class="pl-2 mb-0 label-status" for="experto1_2`+letra[k]+`" id="experto1_2`+letra[k]+`-txt" style="padding-bottom: 23%;background: #FBF9F9;">
                                      La Dirección implementa estrategias para asegurar un comportamiento socialmente responsable en el jardín infantil y evalúa con agentes de la comunidad, contribuir al cuidado del medio ambiente y el entorno social.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF; border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="destacado1_2`+letra[k]+`" name="radgroup`+letra[k]+`" value="5">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="destacado1_2`+letra[k]+`">Destacado
                                      <br>5</label>

                              </div>
                              <div>

                                  <label class="pl-2 mb-0 label-status" for="destacado1_2`+letra[k]+`" id="destacado1_2`+letra[k]+`-txt" style="background: #FBF9F9;">
                                      La Dirección no desarrolla trabajo específico en la línea del elemento de gestión, ya sea porque se encuentra organizando la gestión del jardín infantil en sus distintos dominios y componentes en su primer año de funcionamiento, o bien, porque no lo prioriza.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="row col-sm-12 mr-5" style="margin-top: 6%;">
                          <div class="col-sm-3">
                              <button class="btn text-white" type="button" id="agregarfile`+letra[k]+`" style="background: #69CBCA !important;">Asociar medio de verificación <i class="fas fa-plus"></i></button>
                          </div>
                          <div class="col-sm-6 ml-5 pl-5 pr-5 mb-5" style="padding-left: 0px !important; padding-right: 0px !important;margin-left: 25% !important;">
                              <table id="table-medioverificacion1_2`+letra[k]+`" class="stripe table table-hover _table-link dataTable no-footer" style="width:100%;">
                                  <thead>
                                      <tr>
                                          <th>N°</th>
                                          <th>Nombre de medio</th>
                                          <th>Comentario</th>
                                          <th>Descargar</th>
                                          <th>Eliminar</th>
                                      </tr>
                                  </thead>
                                  <tbody id="lista_medioverificacion1_2`+letra[k]+`">
                                  </tbody>
                              </table>
                          </div>
                      </div>`)


      

  }
  $("#a1_2").append(`<div class="row justify-content-center mb-4">
                      <div class="col-12 text-right" style="margin-left: 216%;margin-top: 10%;">
                          <button type="button" class="btn btn-greys" style="background: #555555!important;">Atrás</button>
                          <button type="button" class="btn btn-greys" style="background: #52C2C2!important;">Guardar</button>
                          <button type="button" class="btn btn-greys" style="background: #666695!important;">Siguiente</button>
                      </div>
                  </div>`)
  $("#nav1_3").html("1."+data[0]["datos"][2].id_dimension+" "+data[0]["datos"][2].nombre_dimension)
  for (var l = 0; l < data[0]["datos"][2]["datos"].length; l++) {
   $("#a1_3").append(`<div class="col-12 mb-2" style="background:#53C2C2; color: #FFFFFF;margin-right: 2%;" id="`+letra[l]+`1_1-txt">
                        `+data[0]["datos"][2]["datos"][l].nombre_pregunta+`                            
                        </div>
                        <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF;border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="basal1_3`+letra[l]+`" name="radgroup`+letra[l]+`" value="0">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="basal1_3`+letra[l]+`">Basal
                                      <br>0</label>

                              </div>
                              <div >

                                  <label class="pl-2 mb-0 label-status" for="basal1_3`+letra[l]+`" id="basal1_3`+letra[l]+`-txt" style="background: #FBF9F9; ">
                                      La Dirección no desarrolla trabajo específico en la línea del elemento de gestión, ya sea porque se encuentra organizando la gestión del jardín infantil en sus distintos dominios y componentes en su primer año de funcionamiento, o bien, porque no lo prioriza.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF;border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="emergente1_3`+letra[l]+`" name="radgroup`+letra[l]+`" value="1">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="emergente1_3`+letra[l]+`">Emergente
                                      <br>1</label>

                              </div>
                              <div>

                                  <label class="pl-2 mb-0 label-status" for="emergente1_3`+letra[l]+`" id="emergente1_3`+letra[l]+`-txt" style="background: #FBF9F9;">
                                      La Dirección planifica definir criterios o generar un mecanismo para establecer un comportamiento socialmente responsable en el jardín infantil y preocupación por el medio ambiente, entorno y condiciones laborales y familiares del personal.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar " style="background: linear-gradient(to bottom, #DFDFDF,#DFDFDF 50%,#DFDFDF 50%,#FBF9F9 50%,#FBF9F9 100%); /* W3C background: #DFDFDF;*/border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="satisfactorio1_3`+letra[l]+`" name="radgroup`+letra[l]+`" value="2">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="satisfactorio1_3`+letra[l]+`">Satisfactorio
                                      <br>2</label>

                              </div>
                              <div >
                                  <label class="pl-2 mb-0 label-status" for="satisfactorio1_3`+letra[l]+`" id="satisfactorio1_3`+letra[l]+`-txt" style="background: #FBF9F9;">
                                      La Dirección establece normas para asegurar el comportamiento socialmente responsable en el jardín infantil, orientando a la comunidad a contribuir con el cuidado del medio ambiente.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF; border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="consolidado1_3`+letra[l]+`" name="radgroup`+letra[l]+`" value="3">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="consolidado1_3`+letra[l]+`">Consolidado
                                      <br>3</label>

                              </div>
                              <div>

                                  <label class="pl-2 mb-0 label-status" for="consolidado1_3`+letra[l]+`" id="consolidado1_3`+letra[l]+`-txt" style="background: #FBF9F9;">
                                      La Dirección diseña e implementa estrategias para asegurar el comportamiento socialmente responsable en el jardín infantil, orientando a la comunidad a contribuir con el cuidado del medio ambiente.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF; border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2" style="border: 2px solid #5964AD;">
                              <input type="radio" id="experto1_3`+letra[l]+`" name="radgroup`+letra[l]+`" value="4">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #5964AD;border-bottom: 2px solid #5964AD;" align="center">
                                  <label for="experto1_3`+letra[l]+`">Experto
                                      <br>4</label>

                              </div>
                              <div>

                                  <label class="pl-2 mb-0 label-status" for="experto1_3`+letra[l]+`" id="experto1_3`+letra[l]+`-txt" style="padding-bottom: 23%;background: #FBF9F9;">
                                      La Dirección implementa estrategias para asegurar un comportamiento socialmente responsable en el jardín infantil y evalúa con agentes de la comunidad, contribuir al cuidado del medio ambiente y el entorno social.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="col-sm-2 p-0 radio-toolbar" style="background: #DFDFDF; border:2px solid #FBF9F9;">
                          <div align="center" class="pt-2">
                              <input type="radio" id="destacado1_3`+letra[l]+`" name="radgroup`+letra[l]+`" value="5">

                              <div class="mt-2 label-blocker" style="background: #DFDFDF;border-top: 2px solid #FBF9F9;border-bottom: 2px solid #FBF9F9;" align="center">
                                  <label for="destacado1_3`+letra[l]+`">Destacado
                                      <br>5</label>

                              </div>
                              <div>

                                  <label class="pl-2 mb-0 label-status" for="destacado1_3`+letra[l]+`" id="destacado1_3`+letra[l]+`-txt" style="background: #FBF9F9;">
                                      La Dirección no desarrolla trabajo específico en la línea del elemento de gestión, ya sea porque se encuentra organizando la gestión del jardín infantil en sus distintos dominios y componentes en su primer año de funcionamiento, o bien, porque no lo prioriza.
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div class="row col-sm-12 mr-5" style="margin-top: 6%;">
                          <div class="col-sm-3">
                              <button class="btn text-white" type="button" id="agregarfile`+letra[l]+`" style="background: #69CBCA !important;">Asociar medio de verificación <i class="fas fa-plus"></i></button>
                          </div>
                          <div class="col-sm-6 ml-5 pl-5 pr-5 mb-5" style="padding-left: 0px !important; padding-right: 0px !important;margin-left: 25% !important;">
                              <table id="table-medioverificacion1_3`+letra[l]+`" class="stripe table table-hover _table-link dataTable no-footer" style="width:100%;">
                                  <thead>
                                      <tr>
                                          <th>N°</th>
                                          <th>Nombre de medio</th>
                                          <th>Comentario</th>
                                          <th>Descargar</th>
                                          <th>Eliminar</th>
                                      </tr>
                                  </thead>
                                  <tbody id="lista_medioverificacion1_3`+letra[l]+`">
                                  </tbody>
                              </table>
                          </div>
                      </div>`)


      

  }
  $("#a1_3").append(`<div class="row justify-content-center mb-4">
                      <div class="col-12 text-right" style="margin-left: 216%;margin-top: 10%;">
                          <button type="button" class="btn btn-greys" style="background: #555555!important;">Atrás</button>
                          <button type="button" class="btn btn-greys" style="background: #52C2C2!important;">Guardar</button>
                          <button type="button" class="btn btn-greys" style="background: #666695!important;">Siguiente</button>
                      </div>
                  </div>`)
  
  $("#nav2").html(data[1].nombre_area)
  $("#nav3").html(data[2].nombre_area)
  $("#nav4").html(data[3].nombre_area)
  $("#nav5").html(data[4].nombre_area)
  $("#nav6").html(data[5].nombre_area)
  
  
    
    for (var j = 0; j < data[0]["datos"].length; j++) {
      data[0]["datos"].id_dimencion
      
    }
    for (var k = 0; k < data[1]["datos"].length; k++) {
    }
    for (var l = 0; l < data[2]["datos"].length; l++) {
    }
    for (var m = 0; m < data[3]["datos"].length; m++) {
    }
    for (var n = 0; n < data[4]["datos"].length; n++) {
    }
    for (var o = 0; o < data[5]["datos"].length; o++) {
    }
  


}