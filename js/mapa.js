// ============================================================
// js/mapa.js
// LÓGICA DEL MAPA DE PORTADA (index.html)
// ============================================================
//
// ¿QUÉ HACE ESTE ARCHIVO?
//   Dibuja el mapa interactivo de la portada con todos los tracks
//   de las rutas y la leyenda con sus checkboxes.
//
// ¿CUÁNDO LO TOCO YO?
//   Casi nunca. Los datos de las rutas (nombre, color, GPX…)
//   están en js/datos-rutas.js. Para cambiar el diseño del mapa,
//   edita css/estilos.css.
//
// ¿QUÉ NO DEBO TOCAR?
//   La lógica de Leaflet ni la estructura del código.
//
// NOTA: Este archivo usa el objeto RUTAS y el array RUTAS_ORDEN
//   definidos en js/datos-rutas.js, que debe cargarse primero
//   en index.html con: <script src="js/datos-rutas.js"></script>
// ============================================================


// ── 1. INICIALIZAR EL MAPA ────────────────────────────────────────────
// Crea el mapa centrado en Ramales de la Victoria, sin botones de zoom
// ni atribución para un aspecto más limpio.
var mapa = L.map('mapa', {
    zoomControl: false,       // Oculta los botones + y - del zoom
    attributionControl: false // Oculta el texto "© OpenStreetMap" etc.
}).setView([43.2513, -3.4607], 14); // [latitud, longitud], nivel de zoom inicial

// Capa base de CartoDB (mapa claro, estilo minimalista)
// Para cambiar a satélite, sustituye la URL por la de Esri que usa seguir.html
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CartoDB'
}).addTo(mapa);

// Fuerza a Leaflet a recalcular el tamaño del contenedor del mapa.
// Es necesario cuando el div del mapa se renderiza antes de que el CSS
// le haya dado su tamaño definitivo.
mapa.invalidateSize();


// ── 2. OBTENER LAS RUTAS VISIBLES EN PORTADA ─────────────────────────
// Construye un array solo con las rutas que tienen visibleEnMapa: true,
// respetando el orden definido en RUTAS_ORDEN (de datos-rutas.js).
// Las rutas con visibleEnMapa: false (cucurioa, cucuriob) se omiten aquí.
var rutasVisibles = RUTAS_ORDEN
    .map(function(id) { return RUTAS[id]; })          // Obtiene el objeto de cada ruta por su id
    .filter(function(ruta) { return ruta && ruta.visibleEnMapa; }); // Filtra las visibles


// ── 3. FUNCIÓN: CREAR EL CONTENIDO DEL POPUP ─────────────────────────
// Genera el HTML del popup que aparece al hacer clic en un track del mapa.
// Incluye nombre, distancia, duración, dificultad y botón "Ver ruta".
// El botón lleva a ruta.html con el id de la ruta como parámetro.
function crearPopup(ruta) {
    return '<b style="color:#f5ead8;">' + ruta.nombre + '</b><br>' +
        '📏 ' + ruta.distancia + '&nbsp;&nbsp;🕐 ' + ruta.duracion + '<br>' +
        '<b>Dificultad:</b> ' + ruta.dificultad + '<br>' +
        // El botón lleva a ruta.html?id=xxx (antes era xxx.html)
        '<button onclick="window.location.href=\'ruta.html?id=' + ruta.id + '\'" ' +
        'style="background:#f5ead8;color:' + ruta.color + ';border:none;padding:0.2rem 0.6rem;border-radius:12px;font-family:CanvaSans,sans-serif;font-size:0.7rem;cursor:pointer;width:100%;">Ver ruta →</button>';
}


// ── 4. FUNCIÓN: COLOREAR EL POPUP CON EL COLOR DE LA RUTA ─────────────
// Cuando se abre un popup, cambia su fondo al color propio de esa ruta.
// Esto da un efecto visual donde cada ruta tiene su propio color.
function pintarPopup(marcador, color) {
    var elemento = marcador.getPopup().getElement(); // El popup que se acaba de abrir
    if (!elemento) return;
    var wrapper = elemento.querySelector('.leaflet-popup-content-wrapper');
    var punta   = elemento.querySelector('.leaflet-popup-tip');
    // Usamos 'important' para sobrepasar el !important que puede tener el CSS de Leaflet
    wrapper.style.setProperty('background-color', color, 'important');
    punta.style.setProperty('background-color',   color, 'important');
}


// ── 5. CARGAR LOS TRACKS DE TODAS LAS RUTAS VISIBLES ─────────────────
// Itera las rutas visibles, carga su archivo GPX en el mapa,
// y asocia el popup al track. Guarda cada capa para poder
// mostrarla/ocultarla con los checkboxes de la leyenda.
var capas = {}; // Diccionario: { cuevas: capaLeaflet, cubillas: capaLeaflet, ... }

rutasVisibles.forEach(function(ruta) {

    // Opciones de visualización del track en el mapa
    var opciones = {
        async: true,             // Carga el GPX de forma asíncrona (sin bloquear la página)
        polyline_options: {
            color:    ruta.color, // Color del trazado, definido en datos-rutas.js
            weight:   4,          // Grosor de la línea en píxeles
            opacity:  0.9,        // Opacidad del track (0=invisible, 1=sólido)
            className: 'mi-track' // Clase CSS para personalización adicional
        },
        marker_options: {
            startIconUrl: null, // Sin icono de inicio del track
            endIconUrl:   null, // Sin icono de fin del track
            shadowUrl:    null  // Sin sombra bajo los iconos
        }
    };

    // Si la ruta tiene línea discontinua, añadimos la propiedad dashArray
    if (ruta.dashArray) opciones.polyline_options.dashArray = ruta.dashArray;

    // Carga el track y le añade el popup al hacer clic en él
    capas[ruta.id] = new L.GPX(ruta.gpx, opciones).on('loaded', function(e) {
        var contenido = crearPopup(ruta); // Genera el HTML del popup

        // Función que abre el popup y le pone el color de la ruta
        function abrirPopup(ev) {
            this.bindPopup(contenido, { closeButton: true, minWidth: 100 }).openPopup(ev.latlng);
            pintarPopup(this, ruta.color);
        }

        e.target.on('click', abrirPopup); // Click en la línea completa del track
        e.target.eachLayer(function(layer) {
            layer.on('click', abrirPopup); // Click en cada segmento individual de la línea
        });
    }).addTo(mapa); // Añade el track al mapa nada más cargarlo
});


// ── 6. LEYENDA CON CHECKBOXES ─────────────────────────────────────────
// Control personalizado de Leaflet situado en la esquina inferior derecha.
// Muestra la lista de rutas con su color y permite ocultarlas/mostrarlas.
var Leyenda = L.Control.extend({
    options: { position: 'bottomright' }, // Posición en el mapa

    onAdd: function() {
        // Crea el div principal de la leyenda
        var div = L.DomUtil.create('div', 'leyenda-control');

        // Cabecera clicable que expande/colapsa la lista de rutas
        var html = '<div class="leyenda-header" onclick="toggleLeyenda()">Rutas ▸</div>';
        // Lista de rutas, oculta por defecto (se abre al pulsar la cabecera)
        html += '<div class="leyenda-lista" id="leyenda-lista" style="display:none;">';

        // Genera una fila por cada ruta visible
        rutasVisibles.forEach(function(ruta) {

            // Genera el estilo de la línea de color: continua o discontinua
            var lineaEstilo = ruta.dashArray
                ? 'background: repeating-linear-gradient(90deg,' + ruta.color + ' 0,' + ruta.color + ' 8px,transparent 8px,transparent 16px);'
                : 'background:' + ruta.color + ';';

            html +=
                '<div class="leyenda-item">' +
                    // Checkbox para mostrar/ocultar el track en el mapa
                    '<label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;">' +
                        '<input type="checkbox" checked onchange="toggleRuta(\'' + ruta.id + '\', this.checked)">' +
                        '<span class="leyenda-linea" style="' + lineaEstilo + '"></span>' +
                    '</label>' +
                    // Nombre de la ruta clicable: lleva a ruta.html?id=xxx
                    '<span class="leyenda-nombre" ' +
                        'onclick="window.location.href=\'ruta.html?id=' + ruta.id + '\'" ' +
                        'style="cursor:pointer;text-decoration:underline;">' +
                        ruta.nombre +
                    '</span>' +
                '</div>';
        });

        html += '</div>'; // Cierre de leyenda-lista
        div.innerHTML = html;

        // Evita que los clics dentro de la leyenda muevan el mapa
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);

        return div;
    }
});

// Añade la leyenda al mapa
new Leyenda().addTo(mapa);


// ── 7. FUNCIONES DE LA LEYENDA ────────────────────────────────────────

// Muestra u oculta el track de una ruta al marcar/desmarcar su checkbox
function toggleRuta(id, visible) {
    if (visible) {
        mapa.addLayer(capas[id]);    // Vuelve a mostrar el track
    } else {
        mapa.removeLayer(capas[id]); // Oculta el track del mapa
    }
}

// Expande o colapsa la lista de rutas de la leyenda al pulsar la cabecera
function toggleLeyenda() {
    var lista  = document.getElementById('leyenda-lista');
    var header = document.querySelector('.leyenda-header');
    if (lista.style.display === 'none') {
        lista.style.display = 'block';   // Muestra la lista
        header.innerHTML = 'Rutas ▾';   // Cambia la flecha a "apuntando abajo"
    } else {
        lista.style.display = 'none';    // Oculta la lista
        header.innerHTML = 'Rutas ▸';   // Cambia la flecha a "apuntando a la derecha"
    }
}
