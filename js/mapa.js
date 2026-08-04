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
    // Cuando el track carga, añadir popup al pasar el ratón
    e.target.on('mouseover', function(ev) {
        this.bindPopup(
            '<u><b>Ruta de las Cuevas</b></u><br>' +
            '📏 5.2 km<br>🕐 1h 30min<br><b>Dificultad:</b> Fácil',
            {closeButton: false, minWidth: 100}
        ).openPopup(ev.latlng);
    });
    e.target.on('mouseout', function() {
        this.closePopup();
    });
    e.target.on('click', function() {
        window.location.href = 'cuevas.html';
    });
}).addTo(mapa);