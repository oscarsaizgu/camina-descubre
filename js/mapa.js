// ============================================================
// MAPA PRINCIPAL — index.html
// Leaflet + GPX. Mantiene funcionalidad completa:
// 6 rutas, popups, leyenda con toggle, botón "Ver ruta →"
// ============================================================

var mapa = L.map('mapa', {
    zoomControl: false,
    attributionControl: false
}).setView([43.2513, -3.4607], 14);

// Capa base IGN España — mapa oficial, sin API key
L.tileLayer('https://www.ign.es/wmts/ign-base?request=getTile&service=WMTS&VERSION=1.0.0&Layer=IGNBaseTodo&Style=default&Format=image/png&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
    attribution: '© IGN España',
    maxZoom: 19
}).addTo(mapa);

// Control de zoom — esquina superior derecha
L.control.zoom({ position: 'topright' }).addTo(mapa);

mapa.invalidateSize();

// ─── Definición de rutas ─────────────────────────────────────
// Para añadir una ruta nueva, añade una entrada aquí.
var rutas = [
    {
        id: 'cuevas',
        gpx: 'data/cuevas.gpx',
        color: '#2d6b45',       // Verde saturado para distinguir del fondo
        dashArray: null,
        numero: '01',
        nombre: 'Ruta de las Cuevas',
        distancia: '6 km',
        duracion: '1h',
        dificultad: 'Moderada'
    },
    {
        id: 'vega',
        gpx: 'data/vega.gpx',
        color: '#1a5f7a',
        dashArray: null,
        numero: '02',
        nombre: 'Paseo de Vegacorredor',
        distancia: '7 km',
        duracion: '1h 30min',
        dificultad: 'Moderada'
    },
    {
        id: 'guardamino',
        gpx: 'data/guardamino.gpx',
        color: '#7a1a1a',
        dashArray: null,
        numero: '03',
        nombre: 'Paseo de Guardamino',
        distancia: '4,7 km',
        duracion: '50 min',
        dificultad: 'Moderada'
    },
    {
        id: 'cubillas',
        gpx: 'data/cubillas.gpx',
        color: '#8B4513',
        dashArray: null,
        numero: '04',
        nombre: 'Paseo de Cubillas',
        distancia: '4 km',
        duracion: '45 min',
        dificultad: 'Fácil'
    },
    {
        id: 'coto',
        gpx: 'data/coto.gpx',
        color: '#6b4c9a',
        dashArray: null,
        numero: '05',
        nombre: 'Paseo de Coto Cuende',
        distancia: '1,26 km',
        duracion: '15 min',
        dificultad: 'Fácil'
    },
    {
        id: 'pondra',
        gpx: 'data/pondra.gpx',
        color: '#b5651d',
        dashArray: null,
        numero: '06',
        nombre: 'Paseo de Riancho-Pondra',
        distancia: '3,5 km',
        duracion: '1h',
        dificultad: 'Fácil'
    }
    // Rutas comentadas (no activas):
    // { id: 'dama', gpx: 'data/dama.gpx', color: '#b5651d', dashArray: null, numero: '', nombre: 'Ruta de Dama Roja', distancia: '9,14 km', duracion: '2h', dificultad: 'Moderada' },
];

// ─── HTML del popup editorial ─────────────────────────────────
// Genera el contenido interno del popup para cada ruta.
// La envoltura (.leaflet-popup-content-wrapper) se colorea
// después mediante pintarPopup().
function crearPopup(ruta) {
    return '<div class="popup-editorial">' +
        '<div class="popup-editorial-cabeza">' +
            '<span class="popup-num">' + ruta.numero + '</span>' +
            '<span class="popup-nombre">' + ruta.nombre + '</span>' +
        '</div>' +
        '<div class="popup-cuerpo">' +
            '<p class="popup-stats">' +
                ruta.distancia +
                '<span class="popup-sep">·</span>' +
                ruta.duracion +
                '<span class="popup-sep">·</span>' +
                '<span class="popup-dificultad">' + ruta.dificultad + '</span>' +
            '</p>' +
            '<button class="popup-btn" onclick="window.location.href=\'' + ruta.id + '.html\'">' +
                'Ver ruta →' +
            '</button>' +
        '</div>' +
    '</div>';
}

// ─── Color del popup según la ruta ───────────────────────────
// Aplica el color de la ruta al fondo del wrapper y la punta
// usando !important para ganarle al CSS global.
function pintarPopup(marcador, color) {
    var el = marcador.getPopup().getElement();
    if (!el) return;
    var wrapper = el.querySelector('.leaflet-popup-content-wrapper');
    var punta   = el.querySelector('.leaflet-popup-tip');
    if (wrapper) wrapper.style.setProperty('background-color', color, 'important');
    if (punta)   punta.style.setProperty('background-color',   color, 'important');
    // También actualiza el borde del close button
    var close = el.querySelector('.leaflet-popup-close-button');
    if (close) close.style.color = 'rgba(245,234,216,0.5)';
}

// ─── Carga de tracks GPX ─────────────────────────────────────
var capas = {};

rutas.forEach(function(ruta) {
    var opciones = {
        async: true,
        polyline_options: {
            color:     ruta.color,
            weight:    4,
            opacity:   0.85,
            className: 'mi-track'
        },
        marker_options: {
            startIconUrl: null,
            endIconUrl:   null,
            shadowUrl:    null
        }
    };
    if (ruta.dashArray) opciones.polyline_options.dashArray = ruta.dashArray;

    capas[ruta.id] = new L.GPX(ruta.gpx, opciones).on('loaded', function(e) {
        var contenido = crearPopup(ruta);

        function abrirPopup(ev) {
            this.bindPopup(contenido, {
                closeButton: true,
                minWidth: 160,
                maxWidth: 220
            }).openPopup(ev.latlng);
            // Pintamos después de un tick para que el DOM del popup esté listo
            var self = this;
            setTimeout(function() { pintarPopup(self, ruta.color); }, 0);
        }

        e.target.on('click', abrirPopup);
        e.target.eachLayer(function(layer) {
            layer.on('click', abrirPopup);
        });
    }).addTo(mapa);
});

// ─── Leyenda interactiva ──────────────────────────────────────
// Control personalizado: lista de rutas con checkboxes.
// Al pulsar el nombre de una ruta, navega a su página.
// Al marcar/desmarcar el checkbox, muestra/oculta el track.
var Leyenda = L.Control.extend({
    options: { position: 'bottomright' },

    onAdd: function() {
        var div  = L.DomUtil.create('div', 'leyenda-control');
        var html = '<div class="leyenda-header" onclick="toggleLeyenda(this)">' +
                       'RUTAS <span class="leyenda-flecha">▸</span>' +
                   '</div>' +
                   '<div class="leyenda-lista" id="leyenda-lista" style="display:none;">';

        rutas.forEach(function(ruta) {
            var lineaEstilo = ruta.dashArray
                ? 'background: repeating-linear-gradient(90deg,' + ruta.color + ' 0,' + ruta.color + ' 6px,transparent 6px,transparent 12px);'
                : 'background:' + ruta.color + ';';

            html += '<div class="leyenda-item">' +
                '<label style="display:flex;align-items:center;gap:0.45rem;cursor:pointer;">' +
                    '<input type="checkbox" checked onchange="toggleRuta(\'' + ruta.id + '\', this.checked)">' +
                    '<span class="leyenda-linea" style="' + lineaEstilo + '"></span>' +
                '</label>' +
                '<span class="leyenda-nombre" onclick="window.location.href=\'' + ruta.id + '.html\'">' +
                    ruta.numero + ' ' + ruta.nombre.replace('Paseo de ', '').replace('Ruta de ', '') +
                '</span>' +
            '</div>';
        });

        html += '</div>';
        div.innerHTML = html;
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);
        return div;
    }
});

new Leyenda().addTo(mapa);

// ─── Funciones globales ───────────────────────────────────────

function toggleRuta(id, visible) {
    if (visible) { mapa.addLayer(capas[id]); }
    else         { mapa.removeLayer(capas[id]); }
}

function toggleLeyenda(header) {
    var lista  = document.getElementById('leyenda-lista');
    var flecha = header ? header.querySelector('.leyenda-flecha') : null;
    var abierto = lista.style.display !== 'none';

    lista.style.display = abierto ? 'none' : 'block';
    if (flecha) flecha.textContent = abierto ? '▸' : '▾';
}
