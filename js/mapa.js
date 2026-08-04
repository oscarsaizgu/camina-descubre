// Inicializa el mapa centrado en Ramales de la Victoria
var mapa = L.map('mapa').setView([43.2513, -3.4607], 14);

// Capa base del mapa — OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(mapa);

mapa.invalidateSize();

// Carga y dibuja el track de la Ruta de las Cuevas
new L.GPX('data/cuevas.gpx', {
    async: true,
    polyline_options: {
        color: '#2d4a35',
        weight: 4,
        opacity: 0.9,
        className: 'mi-track'
    },
    marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null
    }
}).on('loaded', function(e) {

    var esMobil = window.matchMedia('(hover: none)').matches;

    var contenidoPopup = 
        '<b style="cursor:pointer; text-decoration:underline; color:#f5ead8;" ' +
        'onclick="window.location.href=\'cuevas.html\'">Ruta de las Cuevas</b><br>' +
        '📏 5.2 km&nbsp;&nbsp;🕐 1h 30min<br><b>Dificultad:</b> Fácil';

    // Solo en escritorio: hover muestra popup
    e.target.on('mouseover', function(ev) {
        if (!esMobil) {
            this.bindPopup(contenidoPopup, {closeButton: false, minWidth: 100})
                .openPopup(ev.latlng);
        }
    });

    // Solo en escritorio: cierra popup al salir
    e.target.on('mouseout', function() {
        if (!esMobil) {
            var self = this;
            setTimeout(function() { self.closePopup(); }, 1200);
        }
    });

    // Click — comportamiento diferente según dispositivo
    e.target.on('click', function(ev) {
        if (esMobil) {
            // Móvil: abre popup para poder pulsar el enlace
            this.bindPopup(contenidoPopup, {closeButton: true, minWidth: 100})
                .openPopup(ev.latlng);
        } else {
            // Escritorio: va directo a la ruta
            window.location.href = 'cuevas.html';
        }
    });

    // Touch — algunos móviles necesitan esto para detectar el tap en el track
    e.target.eachLayer(function(layer) {
        layer.on('click', function(ev) {
            if (esMobil) {
                layer.bindPopup(contenidoPopup, {closeButton: true, minWidth: 100})
                    .openPopup(ev.latlng);
            }
        });
    });

}).addTo(mapa);