$(document).ready(function(){
    $('#nombre_usuario').html(JSON.parse(localStorage.user).nombres+' '+JSON.parse(localStorage.user).apellidos+' ')
    $('#nav_monitoreo').addClass('active_menu');
 
    listar()
});


function listar(){
    $.ajax({
            method: 'POST',
            "url": webservice + "/supervisor/monitoreo/lista",
            headers: {
                't': JSON.parse(localStorage.user).token,
            },
            crossDomain: true,
            dataType: 'text',
            data: {
        
                id_usuario: JSON.parse(localStorage.user).id_usuario,
            },
            success: function(data, textStatus, jqXHR) {
                if (data != "token invalido") {
                    cargarVista(JSON.parse(data)); 
                                        
                } else {
                    console.log("invalidos");
                }
                $.unblockUI();
                ocultarLoading()

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                ocultarLoading()
            }
    });
}

function cargarVista(data){
    console.log(data)

    // $('#fecha_inicio').html(data.general.fecha_inicio == null ? '-' : moment(data.general.fecha_inicio).format("DD-MM-YYYY"))
    // $('#fecha_termino').html(data.general.fecha_termino == null ? '-' :moment(data.general.fecha_termino).format("DD-MM-YYYY"))
    // $('#dias_disponibles').html(data.general.dias_disponibles == null ? '-' : data.general.dias_disponibles)
     

    cargarGraficosPie(data.grafico_general)
    cargarGraficoBarra(data)
}   

function cargarGraficosPie(data){

    Highcharts.chart('graficoItems', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            backgroundColor: null
        },
        title: {
            text: 'Items: '+(data.item.nuevo+data.item.asignado+data.item.evaluado),
            align: 'center',
            verticalAlign: 'middle',
            y: 8,
            style: {
                fontSize: '14px'
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>Item</b><br>' + 
                        this.point.name +': <b>' + this.point.y + '</b> ('+Highcharts.numberFormat(this.point.percentage, 1)+'%)';
                         
            },
            positioner: function(labelWidth, labelHeight, point) {
                  var tooltipX = 70;
                var tooltipY = point.plotY + 110;
                return {
                    x: tooltipX,
                    y: tooltipY
                };
            },
            style:{
                whiteSpace: "nowrap"
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false,    
                },
                colors: ['#ffc400', '#ef8963', '#7e2161'],
                // colors: ['#c1c1c1', '#a4bdd9', '#267de1'],
                startAngle: -90,
                endAngle: 90,
                size: '45%'
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            type: 'pie',
            name: 'Evaluación',
            innerSize: '65%',
            data: [
                ['Pendientes', data.item.nuevo],
                ['En Proceso', data.item.asignado],
                ['Finalizados', data.item.evaluado]

            ]
        }]
    });

    Highcharts.chart('graficoEstado', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            backgroundColor: null
        },
        title: {
            text: 'Items: '+(data.estado.aprobado+data.estado.rechazado+data.estado.pendiente),
            align: 'center',
            verticalAlign: 'middle',
            y: 8,
            style: {
                fontSize: '14px'
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>Estado</b><br>' + 
                        this.point.name +': <b>' + this.point.y + '</b> ('+Highcharts.numberFormat(this.point.percentage, 1)+'%)';
            },
            positioner: function(labelWidth, labelHeight, point) {
                var tooltipX = 70;
                var tooltipY = point.plotY + 110;
                return {
                    x: tooltipX,
                    y: tooltipY
                };
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false,    
                },
                colors: ['#32c2a0', '#7b58c2', '#e9215e'],

                startAngle: -90,
                endAngle: 90,                
                size: '45%'
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            type: 'pie',
            name: 'Avance',
            innerSize: '65%',
            data: [
            	['Aprobados', data.estado.aprobado],
                ['Observados', data.estado.pendiente],
                ['Rechazados', data.estado.rechazado],
            ]
        }]
    });
}

function cargarGraficoBarra(data){

	Highcharts.chart('detalle_avance', {
	    chart: {
	        type: 'bar'
	    },
        credits: {
            enabled: false
        },
	    title: {
	        text: ''
	    },
	    xAxis: {
	        categories: data.asignaturas
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: ''
	        }
	    },
	    legend: {
	        reversed: true
	    },
	    plotOptions: {
	        series: {
	            stacking: 'normal',
                pointWidth: 20,
                dataLabels: {
                    enabled: true
                }

	        },
	    },
	    series: [{
	        name: 'Finalizados',
	        data: data.grafico_detalle.avance.evaluado,
            color: '#7e2161'
	    },{
	        name: 'En Proceso',
	        data: data.grafico_detalle.avance.asignado,
	        color: '#ef8963'
	    },{
	        name: 'Pendientes',
	        data: data.grafico_detalle.avance.nuevo,
            color: '#ffc400'
	    }]
	});

	Highcharts.chart('detalle_resultado', {
	    chart: {
	        type: 'bar'
	    },
        credits: {
            enabled: false
        },
	    title: {
	        text: ''
	    },
	    xAxis: {
	        categories: data.asignaturas
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: ''
	        }
	    },
	    legend: {
	        reversed: true
	    },
	    plotOptions: {
	        series: {
	            stacking: 'normal',
                pointWidth: 20,
                dataLabels: {
                    enabled: true
                }
	        },
	    },
	    series: [
        {
            name: 'Rechazados',
            data: data.grafico_detalle.resultados.rechazado,
            color: '#e9215e'
        },{
	        name: 'Observados',
	        data: data.grafico_detalle.resultados.pendiente,
	        color: '#7b58c2'
	    },{
            name: 'Aprobados',
            data: data.grafico_detalle.resultados.aprobado,
            color: '#32c2a0'
        }]
	});
    // Highcharts.chart('detalle_edicion', {
    //     chart: {
    //         type: 'bar'
    //     },
    //     credits: {
    //         enabled: false
    //     },
    //     title: {
    //         text: ''
    //     },
    //     xAxis: {
    //         categories: data.asignaturas
    //     },
    //     yAxis: {
    //         min: 0,
    //         title: {
    //             text: ''
    //         }
    //     },
    //     legend: {
    //         reversed: true
    //     },
    //     plotOptions: {
    //         series: {
    //             stacking: 'normal',
    //             pointWidth: 20,
    //             dataLabels: {
    //                 enabled: true
    //             }
    //         },
    //     },
    //     series: [{
    //         name: 'Aprobados con observación',
    //         data: data.grafico_detalle.resultados.pendiente,
    //         color: '#7b58c2'
    //     },{
    //         name: 'Rechazados',
    //         data: data.grafico_detalle.resultados.rechazado,
    //         color: '#e9215e'
    //     },{
    //         name: 'Aprobados',
    //         data: data.grafico_detalle.resultados.aprobado,
    //         color: '#32c2a0'
    //     }]
    // });
}