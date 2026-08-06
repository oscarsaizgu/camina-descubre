// Inicializa el mapa principal centrado en Ramales de la Victoria
var mapa = L.map('mapa', {
    zoomControl: false,
    attributionControl: false
}).setView([43.2513, -3.4607], 14);

// Carga la capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(mapa);

mapa.invalidateSize(); // Fuerza a Leaflet a recalcular el tamaño del mapa

// Definición de todas las rutas: solo datos, nada de HTML ni CSS repetido.
// Para añadir una ruta nueva, solo se añade una línea aquí.
var rutas = [
    { id: 'cuevas',     gpx: 'data/cuevas.gpx',         color: '#2d4a35', dashArray: null,   nombre: 'Ruta de las Cuevas',   distancia: '5.2 km',   duracion: '1h 30min', dificultad: 'Fácil' },
    { id: 'cubillas',   gpx: 'data/cubillas.gpx',       color: '#8B4513', dashArray: null,   nombre: 'Paseo de Cubillas',    distancia: '4 km',     duracion: '45min',    dificultad: 'Fácil' },
    { id: 'vega',       gpx: 'data/vega.gpx',           color: '#1a5f7a', dashArray: null,   nombre: 'Paseo de Vegacorredor',distancia: '7 km',     duracion: '1h 30min', dificultad: 'Fácil' },
    { id: 'guardamino', gpx: 'data/guardamino.gpx',     color: '#7a1a1a', dashArray: null,   nombre: 'Paseo de Guardamino', distancia: '4,7 km',   duracion: '50min',    dificultad: 'Fácil' },
    { id: 'coto',       gpx: 'data/coto.gpx',           color: '#6b4c9a', dashArray: null,   nombre: 'Paseo de Coto Cuende',distancia: '1,26 km',  duracion: '15min',    dificultad: 'Fácil' },
    { id: 'dama',       gpx: 'data/dama.gpx',           color: '#b5651d', dashArray: null,   nombre: 'Ruta de Dama Roja',   distancia: '9,14 km',  duracion: '2h',       dificultad: 'Moderada' },
    { id: 'cucurioa',   gpx: 'data/cucurioancillo.gpx', color: '#2d6b4a', dashArray: null,   nombre: 'Cucurio por Ancillo', distancia: '13,16 km', duracion: '3h',       dificultad: 'Moderada' },
    { id: 'cucuriob',   gpx: 'data/cucuriobolaiz.gpx',  color: '#4a2d6b', dashArray: '8, 8', nombre: 'Cucurio por Bolaiz',  distancia: '7,21 km',  duracion: '1h 30min', dificultad: 'Moderada' }
];

// Construye el texto del popup a partir de los datos sueltos de la ruta
function crearPopup(ruta) {
    return '<b style="cursor:pointer;text-decoration:underline;color:#f5ead8;" onclick="window.location.href=\'' + ruta.id + '.html\'">' + ruta.nombre + '</b><br>' +
        '📏 ' + ruta.distancia + '&nbsp;&nbsp;🕐 ' + ruta.duracion + '<br>' +
        '<b>Dificultad:</b> ' + ruta.dificultad;
}

// Pinta el fondo del popup recién abierto con el color de su ruta
function pintarPopup(marcador, color) {
    var elemento = marcador.getPopup().getElement(); // El popup que se acaba de abrir
    if (!elemento) return;
    var wrapper = elemento.querySelector('.leaflet-popup-content-wrapper');
    var punta = elemento.querySelector('.leaflet-popup-tip');
    wrapper.style.setProperty('background-color', color, 'important'); // 'important' para ganarle al !important del CSS
    punta.style.setProperty('background-color', color, 'important');
}

// Carga los tracks y guarda cada capa en el objeto 'capas'
var capas = {};

rutas.forEach(function(ruta) {
    var opciones = {
        async: true,
        polyline_options: {
            color: ruta.color,
            weight: 4,
            opacity: 0.9,
            className: 'mi-track'
        },
        marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null }
    };
    if (ruta.dashArray) opciones.polyline_options.dashArray = ruta.dashArray;

    capas[ruta.id] = new L.GPX(ruta.gpx, opciones).on('loaded', function(e) {
        var contenido = crearPopup(ruta); // Texto del popup, generado a partir de los datos

        // Abre el popup con el texto de esta ruta y lo pinta de su color
        function abrirPopup(ev) {
            this.bindPopup(contenido, { closeButton: true, minWidth: 100 }).openPopup(ev.latlng);
            pintarPopup(this, ruta.color);
        }

        e.target.on('click', abrirPopup); // Click en la línea del track
        e.target.eachLayer(function(layer) {
            layer.on('click', abrirPopup); // Click en cada segmento de la línea
        });
    }).addTo(mapa);
});

// Control personalizado: leyenda con la lista de rutas y sus checkboxes
var Leyenda = L.Control.extend({
    options: { position: 'topright' },
    onAdd: function() {
        var div = L.DomUtil.create('div', 'leyenda-control');
        var html = '<div class="leyenda-header" onclick="toggleLeyenda()">Rutas ▾</div><div class="leyenda-lista" id="leyenda-lista">';
        rutas.forEach(function(ruta) {
            // Si la ruta es discontinua (dashArray), dibuja la línea de la leyenda a rayas
            var lineaEstilo = ruta.dashArray
                ? 'background: repeating-linear-gradient(90deg,' + ruta.color + ' 0,' + ruta.color + ' 8px,transparent 8px,transparent 16px);'
                : 'background:' + ruta.color + ';';
            html += '<label class="leyenda-item">' +
                '<input type="checkbox" checked onchange="toggleRuta(\'' + ruta.id + '\', this.checked)">' +
                '<span class="leyenda-linea" style="' + lineaEstilo + '"></span>' +
                '<span class="leyenda-nombre">' + ruta.nombre + '</span>' +
                '</label>';
        });
        html += '</div>';
        div.innerHTML = html;
        L.DomEvent.disableClickPropagation(div); // Evita que un clic en la leyenda mueva el mapa
        L.DomEvent.disableScrollPropagation(div); // Evita que el scroll en la leyenda haga zoom en el mapa
        return div;
    }
});

new Leyenda().addTo(mapa); // Añade la leyenda al mapa

// Muestra u oculta el track de una ruta al marcar/desmarcar su checkbox
function toggleRuta(id, visible) {
    if (visible) { mapa.addLayer(capas[id]); }
    else { mapa.removeLayer(capas[id]); }
}

// Pliega o despliega la lista de rutas de la leyenda
function toggleLeyenda() {
    var lista = document.getElementById('leyenda-lista');
    var header = document.querySelector('.leyenda-header');
    if (lista.style.display === 'none') {
        lista.style.display = 'block';
        header.innerHTML = 'Rutas ▾';
    } else {
        lista.style.display = 'none';
        header.innerHTML = 'Rutas ▸';
    }
}