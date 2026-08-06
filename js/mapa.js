var mapa = L.map('mapa', {
    zoomControl: false,
    attributionControl: false
}).setView([43.2513, -3.4607], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(mapa);

mapa.invalidateSize();

// Definición de todas las rutas
var rutas = [
    {
        id: 'cuevas', gpx: 'data/cuevas.gpx', color: '#2d4a35', dashArray: null,
        nombre: 'Ruta de las Cuevas', className: 'cuevas-popup',
        popup: '<b style="cursor:pointer;text-decoration:underline;color:#f5ead8;" onclick="window.location.href=\'cuevas.html\'">Ruta de las Cuevas</b><br>📏 5.2 km&nbsp;&nbsp;🕐 1h 30min<br><b>Dificultad:</b> Fácil'
    },
    {
        id: 'cubillas', gpx: 'data/cubillas.gpx', color: '#8B4513', dashArray: null,
        nombre: 'Paseo de Cubillas', className: 'cubillas-popup',
        popup: '<b style="cursor:pointer;text-decoration:underline;color:#f5ead8;" onclick="window.location.href=\'cubillas.html\'">Paseo de Cubillas</b><br>📏 4 km&nbsp;&nbsp;🕐 45min<br><b>Dificultad:</b> Fácil'
    },
    {
        id: 'vega', gpx: 'data/vega.gpx', color: '#1a5f7a', dashArray: null,
        nombre: 'Paseo de Vegacorredor', className: 'vega-popup',
        popup: '<b style="cursor:pointer;text-decoration:underline;color:#f5ead8;" onclick="window.location.href=\'vega.html\'">Paseo de Vegacorredor</b><br>📏 7 km&nbsp;&nbsp;🕐 1h 30min<br><b>Dificultad:</b> Fácil'
    },
    {
        id: 'guardamino', gpx: 'data/guardamino.gpx', color: '#7a1a1a', dashArray: null,
        nombre: 'Paseo de Guardamino', className: 'guardamino-popup',
        popup: '<b style="cursor:pointer;text-decoration:underline;color:#f5ead8;" onclick="window.location.href=\'guardamino.html\'">Paseo de Guardamino</b><br>📏 4,7 km&nbsp;&nbsp;🕐 50min<br><b>Dificultad:</b> Fácil'
    },
    {
        id: 'coto', gpx: 'data/coto.gpx', color: '#6b4c9a', dashArray: null,
        nombre: 'Paseo de Coto Cuende', className: 'coto-popup',
        popup: '<b style="cursor:pointer;text-decoration:underline;color:#f5ead8;" onclick="window.location.href=\'coto.html\'">Paseo de Coto Cuende</b><br>📏 1,26 km&nbsp;&nbsp;🕐 15min<br><b>Dificultad:</b> Fácil'
    },
    {
        id: 'dama', gpx: 'data/dama.gpx', color: '#b5651d', dashArray: null,
        nombre: 'Ruta de Dama Roja', className: 'dama-popup',
        popup: '<b style="cursor:pointer;text-decoration:underline;color:#f5ead8;" onclick="window.location.href=\'dama.html\'">Ruta de Dama Roja</b><br>📏 9,14 km&nbsp;&nbsp;🕐 2h<br><b>Dificultad:</b> Moderada'
    },
    {
        id: 'cucurioa', gpx: 'data/cucurioancillo.gpx', color: '#2d6b4a', dashArray: null,
        nombre: 'Cucurio por Ancillo', className: 'cucurioa-popup',
        popup: '<b style="cursor:pointer;text-decoration:underline;color:#f5ead8;" onclick="window.location.href=\'cucurioa.html\'">Ruta de Cucurio por Ancillo</b><br>📏 13,16 km&nbsp;&nbsp;🕐 3h<br><b>Dificultad:</b> Moderada'
    },
    {
        id: 'cucuriob', gpx: 'data/cucuriobolaiz.gpx', color: '#4a2d6b', dashArray: '8, 8',
        nombre: 'Cucurio por Bolaiz', className: 'cucuriob-popup',
        popup: '<b style="cursor:pointer;text-decoration:underline;color:#f5ead8;" onclick="window.location.href=\'cucuriob.html\'">Ruta de Cucurio por Bolaiz</b><br>📏 7,21 km&nbsp;&nbsp;🕐 1h 30min<br><b>Dificultad:</b> Moderada'
    }
];

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
        var contenido = ruta.popup;
        var clase = ruta.className;
        e.target.on('click', function(ev) {
            this.bindPopup(contenido, { closeButton: true, minWidth: 100, className: clase }).openPopup(ev.latlng);
        });
        e.target.eachLayer(function(layer) {
            layer.on('click', function(ev) {
                layer.bindPopup(contenido, { closeButton: true, minWidth: 100, className: clase }).openPopup(ev.latlng);
            });
        });
    }).addTo(mapa);
});

// Leyenda con toggles
var Leyenda = L.Control.extend({
    options: { position: 'topright' },
    onAdd: function() {
        var div = L.DomUtil.create('div', 'leyenda-control');
        var html = '<div class="leyenda-header" onclick="toggleLeyenda()">Rutas ▾</div><div class="leyenda-lista" id="leyenda-lista">';
        rutas.forEach(function(ruta) {
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
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);
        return div;
    }
});

new Leyenda().addTo(mapa);

function toggleRuta(id, visible) {
    if (visible) { mapa.addLayer(capas[id]); }
    else { mapa.removeLayer(capas[id]); }
}

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