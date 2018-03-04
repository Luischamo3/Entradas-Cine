
var lista = new Array();
var n = "";
var obj = new Object();

$(document).ready(function () {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
});

var arr = JSON.parse(localStorage.getItem('peliculas'));
if (arr == null) {
    arr = peliculas;
    localStorage.setItem('peliculas', JSON.stringify(arr));
}

function anyThing() {
    setTimeout(function () { $('.stepper').nextStep(); }, 1500);
}

$('.indicator').hide();
$('.check').hide();
$(function () {
    $('.stepper').activateStepper();
});

var contador = 0;

var reservas = JSON.parse(localStorage.getItem("reservas")) || [];
var asientosReservadosInformacion = [];

function guardarReserva() {

    total = document.getElementById("nbutacas").value;

    if (contador != parseInt(total)) {
        alert("Te faltan " + (total - contador) + " asientos por seleccionar")
    } else if (contador > parseInt(total)) {
        alert("Me estas hackeando")

    } else {
        var idPelicula = $("#idPeliculaActual").val();
        var dia = $("#day").val();
        var hora = $('input[name=horas]:checked').val();
        var asientosReservados = [];
        asientosReservadosInformacion = [];

        var uses = document.querySelectorAll("use");
        uses.forEach(element => {
            if (element.getAttribute('style') == "stroke: #2B2A29;stroke-width: 150;fill: green;") {
                asientosReservados.push(element.getAttribute("id"));

                var obj = {
                    fila: element.getAttribute("fila"),
                    butaca: element.getAttribute("butaca")
                }

                asientosReservadosInformacion.push(obj);
            }
        });

        var objReservaActual = {
            dia: dia,
            hora: hora,
            asientos: asientosReservados
        }

        var existe = false;
        var existeDia = false;
        reservas.forEach(element => {
            if (element.id == idPelicula) {
                element.horarios.forEach(h => {
                    if (h.dia == dia && h.hora == hora) {
                        existeDia = true;
                        asientosReservados.forEach(a => {
                            h.asientos.push(a);
                        });
                    }
                });
                if (!existeDia) {
                    element.horarios.push(objReservaActual);
                }
                existe = true;
            }
        });

        if (!existe) {
            var obj = {
                idPelicula: idPelicula,
                horarios: [objReservaActual]
            }
            reservas.push(obj);
        }

        // console.log(reservas);
        // reserva.asientos = asientosReservadosInformacion;
        localStorage.setItem("reservas", JSON.stringify(reservas));
        // localStorage.setItem("sesionActual", JSON.stringify(reserva));


    }
}

function cargarButacasOcupadas() {
    var uses = document.querySelectorAll("use");

    var idP = $("#idPeliculaActual").val();
    var dia = $("#day").val();
    var hora = $('input[name=horas]:checked').val();

    var reservasLS = JSON.parse(localStorage.getItem("reservas")) || [];

    reservasLS.forEach(element => {
        if (element.idPelicula == idP) {
            element.horarios.forEach(h => {
                if (h.dia == dia && h.hora == hora) {
                    h.asientos.forEach(a => {
                        document.getElementById(a).setAttribute("style", "stroke: #2B2A29;stroke-width: 150;fill: red;");
                    });
                }
            });
        }
    });
}

function pagar() {
    guardarReserva();


    var contenedor = document.getElementById("contenedorButacas");

    asientosReservadosInformacion.forEach(element => {
        let p = document.createElement("p");
        p.innerHTML = "Entrada - Fila: <b>" + element.fila + "</b> - Butaca: <b>" + element.butaca + "</b> - Precio 5.99€";
        contenedor.appendChild(p);
    });

    var compras = JSON.parse(localStorage.getItem("compras")) || [];

    var n = $("#nombre").val();
    var a = $("#apellido").val();
    var t = $("#tarjeta").val();
    var c = $("#cvv").val();

    var obj = {
        nombre: n,
        apellido: a,
        tarjeta: t,
        cvv: c,
        asientos: asientosReservadosInformacion
    }

    compras.push(obj);

    localStorage.setItem("compras", JSON.stringify(compras));
}

function cambiar(b) {
    g = document.getElementById(b.srcElement.id);
    total = document.getElementById("nbutacas").value;

    if (g.getAttribute('style') == 'stroke: #2B2A29;stroke-width: 150;fill: red;') {

    } else {
        if (contador != parseInt(total)) {
            if (g.getAttribute('style') == 'stroke: #2B2A29;stroke-width: 150;fill: white;') {
                contador++;
                g.setAttribute('style', 'stroke: #2B2A29;stroke-width: 150;fill: green;');

            } else {
                g.setAttribute('style', 'stroke: #2B2A29;stroke-width: 150;fill: white;');
                contador--;
            }
        } else {
            if (g.getAttribute('style') == 'stroke: #2B2A29;stroke-width: 150;fill: green;') {
                g.setAttribute('style', 'stroke: #2B2A29;stroke-width: 150;fill: white;');
                contador--;
            }
        }
    }
}

function loadPage() {

    var cont = document.getElementById("contenedorSvg");

    for (let indexF = 0, y = 10, id = 0; indexF < 5; indexF++ , y += 600) {
        for (let indexB = 0, x = 10; indexB < 16; indexB++ , x += 600, id++) {
            var svgns = "http://www.w3.org/2000/svg";
            var xlinkns = "http://www.w3.org/1999/xlink";
            // var estado = "";

            // index % 2 == 0 ? estado = "ocupado" : estado = "libre";

            var use = document.createElementNS(svgns, "use");
            use.setAttributeNS(xlinkns, "href", "#asiento");
            use.setAttribute("x", x);
            use.setAttribute("y", y);
            use.setAttribute("width", 515);
            use.setAttribute("height", 879);
            use.setAttribute("fila", indexF);
            use.setAttribute("butaca", indexB);
            use.setAttribute("style", "stroke: #2B2A29;stroke-width: 150;fill: white;");
            use.setAttribute("id", id);
            use.addEventListener("click", cambiar, false);


            // use.setAttribute("estado", estado);
            // estado == "ocupado" ? use.setAttribute("class", "copa ocupado") : use.setAttribute("class", "copa noSelected");
            // use.addEventListener("click", cambiar, false);

            cont.appendChild(use);
        }
    }

    var li = $('.slides').find('li');

    arr.forEach(function (e) {
        $('.materialboxed').materialbox();
        //Lista de Carteles
        var principal = $('<div class="col s6 m4 l3  center-align carta"></div>');
        var card = $(' <div class="card hoverable" id="carta" ></div>');
        var cardimage = $(`<div class="card-image imghover z-depth-2" id="change" onclick="createTab(${e.id},this)"></div>`);
        var cardcontent = $(`<div class="card-content truncate">${e.nombre}</div>`);
        var img = $(`<img class="imagen responsive-img " src="${e.src}" alt="${e.nombre}" name="${e.nombre}">`);

        $(".carteles").append(principal);
        $(principal).append(card);
        $(card).append(cardimage);
        $(card).append(cardcontent);
        $(cardimage).append(img);
        paginate({
            itemSelector: ".carta"
            , paginationSelector: "#pagination-1"
            , itemsPerPage: 4
        });
    });
}



function createTab(id, elemento) {

    $("#idPeliculaActual").val(id);
    var idsave = id;    /*Progreso Formulario*/
    $('.tab').removeClass('scale-out');
    $('.card-image').removeClass('imgactive');
    $('.card-image').addClass('imghover');

    $('#day').empty();
    //    $('.card').addClass('z-depth-5');
    $(peliculas).each(function (i, element) {
        // cleanTab('#change');
        console.log(element.hora);

        if (idsave == element.id) {
            $(elemento).removeClass('imghover');
            $(elemento).addClass('imgactive');

            cleanTab('datapeli');
            // cleanTab('f');

            var principal = $(`
         <div class="col s12 center-align ">
                 <h2 id="titulo">${element.nombre}</h2>
             </div>
            
             <div class="col m8 s12 l5 center-align " aria-hidden="true">
                    <div class="video-container controls ">
                        <iframe id="video" width="660" height="400" src="https://www.youtube.com/embed/${element.url}" autoplay=1 frameborder="0"  allowfullscreen></iframe>
                    </div>
                </div>    
             <div class="col l7 " id="sinopsis">${element.sinopsis}</div>`);

            //Carga del Select

            element.horas.forEach(e => {

                console.log(e);

                // var option = $('#day').find('option').next().text(e.dia);

                var option = document.createElement("option");
                option.innerText = e.dia;
                option.value = e.dia;
                document.getElementById("day").appendChild(option);

            });

            $('select').material_select(function () {             //Carga Checkbox

                console.log(idsave);

                peliculas.forEach(element => {
                    if (element.id == idsave) {

                        element.horas.forEach(h => {
                            if (h.dia == document.getElementById("day").value) {
                                var contador = 0;
                                cleanTab("contenedorHoras");
                                h.horas.forEach(ho => {
                                    var cont = document.getElementById("contenedorHoras");

                                    var p = document.createElement("p");
                                    p.innerHTML = '<input name="horas" type="radio" id="radio-' + contador + '" value="' + ho + '" /><label for="radio-' + contador + '">' + ho + '</label>';
                                    contador++;
                                    cont.appendChild(p);
                                });
                            }
                        });

                    }
                });

            });

            //Efecto de Pestaña           
            $('.tab').append(principal)
                //  .removeClass('scale-out')
                .addClass('scale-in').delay(5500);
            $('.indicator').delay(1000).fadeIn('slow');
            // .attr('style',`background-image:url(${element.src});`);

            // $('.formulario').append(formulario)
            //     .addClass('scale-in').delay(5500).fadeIn('slow');
            // removeClass('scale-out');
        }

    });
};

function cleanTab(id) {
    var myNode = document.getElementById(id);
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}


function paginate(options) {
    var items = $(options.itemSelector);
    var numItems = items.length;
    var perPage = options.itemsPerPage;
    items.slice(perPage).hide();
    $(options.paginationSelector).pagination({
        items: numItems,
        itemsOnPage: perPage,
        cssStyle: "dark-theme",
        onPageClick: function (pageNumber) {
            $('.indicator').hide();
            cleanTab('datapeli');
            cleanTab('f');
            var showFrom = perPage * (pageNumber - 1);
            var showTo = showFrom + perPage;
            items.hide()
                .slice(showFrom, showTo).show();
            return false;
        }
    });
}


// function videoHover(element) {
//     // $(arr).each(function (i, element) {
//     if (element.click(() => {
//         var myNode = document.getElementById("change");
//         while (myNode.firstChild) {
//             myNode.removeChild(myNode.firstChild);
//         }
//         var vhover = $(`<div class="video-container  " controls>
//         <iframe id="video" width="225" height="329" src="https://www.youtube.com/embed/${element.url}" frameborder="0" allow="autoplay allowfullscreen></iframe>
//      </div>`);
//         $('.card').append(vhover);
//     }));

// }

// function setLocalStorageIdPelicula(id) {
//     var obj = { id: id };
//     localStorage.setItem('idPelicula', JSON.stringify(obj));
// }

// Tarjeta Segunda Página
// function loadMovie() {
//     var idsave = JSON.parse(localStorage.getItem('idPelicula'));
//     var titulo = peliculas[idsave.id].nombre;
//     var video = peliculas[idsave.id].url;
//     var src = peliculas[idsave.id].src;
//     var sinopsis = peliculas[idsave.id].sinopsis;
//     document.getElementById('titulo').innerText = titulo;
//     document.getElementById('video').setAttribute('src', 'https://www.youtube.com/embed/' + video);
//     document.getElementById('imagen').setAttribute('src', src);
//     document.getElementById('imagen').setAttribute('style', 'width:80%');
//     document.getElementById('sinopsis').innerText = sinopsis;
// }



// google.charts.load("current", { packages: ["corechart"] });
// google.charts.setOnLoadCallback(drawChart);

// function drawChart(index) {
//     // Create the data table.
//     var data = new google.visualization.DataTable();
//     data.addColumn('string', 'Topping');
//     data.addColumn('number', 'Votos');
//     var peliculas = JSON.parse(localStorage.getItem('peliculas'));

//     peliculas.forEach(element => {
//         // console.log(element);
//         data.addRows([
//             [element.nombre, element.votos]
//         ]);
//     });

//     if (index == 0) {
//         var options = {
//             title: 'Resultados votacion',
//             'width': 800,
//             'height': 500,
//             chartArea: { width: '60%' },
//             hAxis: {
//                 title: 'Pelicula',
//                 minValue: 0,
//                 maxValue: 20
//             },
//             vAxis: {
//                 title: 'Votos'
//             }
//         };

//         var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
//         chart.draw(data, options);
//     } else if (index == 1) {
//         // Set chart options
//         var options = {
//             'title': 'Resultados votacion',
//             'width': 800,
//             'height': 500,
//             pieHole: 0.4,

//         };


//         var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
//         chart.draw(data, options);
//     } else if (index == 2) {
//         // Set chart options
//         var options = {
//             'title': 'Resultados votacion',
//             'width': 800,
//             'height': 500,
//             is3D: true,
//         };

//         // Instantiate and draw our chart, passing in some options.
//         var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
//         chart.draw(data, options);
//     }

//     document.getElementById("char_div").focus();
// }


function saveVote() {
    /// pasar el id de la pelicula al registro
    var idsave = JSON.parse(localStorage.getItem('idPelicula')).id;
    /// en el registro crear objeto usuario y guardarlo en localstorage

    // recoger el nombre
    var nombre = document.getElementById('nombre').value;
    var apellido = document.getElementById('apellido').value;
    var telefono = document.getElementById('telefono').value;
    var email = document.getElementById('email').value;

    var usuario = {
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        email: email,
        voto: idsave
    }

    /// mirar si existe el array de usuarios en local storage?
    var usuarios = JSON.parse(localStorage.getItem('usuarios'));
    if (usuarios == null) {
        usuarios = [];
    }

    usuarios.push(usuario);

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    var peliculas = JSON.parse(localStorage.getItem('peliculas'));

    peliculas.forEach(element => {
        if (element.id == idsave) {
            element.votos++;
        }
    });
    localStorage.setItem('peliculas', JSON.stringify(peliculas));


}

