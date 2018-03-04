
var lista = new Array();
var n = "";
var obj = new Object();

$(document).ready(function () {    
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
        localStorage.setItem("reservas", JSON.stringify(reservas));    

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
            cont.appendChild(use);
        }
    }

    var li = $('.slides').find('li');

    arr.forEach(function (e) {       
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
    var idsave = id;   
    $('.tab').removeClass('scale-out');
    $('.card-image').removeClass('imgactive');
    $('.card-image').addClass('imghover');

    $('#day').empty();
    
    $(peliculas).each(function (i, element) {
        if (idsave == element.id) {
            $(elemento).removeClass('imghover');
            $(elemento).addClass('imgactive');

            cleanTab('datapeli');

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
                .addClass('scale-in').delay(5500);
            $('.indicator').delay(1000).fadeIn('slow');
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





