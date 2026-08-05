// Inicializa el mapa centrado en Ramales de la Victoria
var mapa = L.map('mapa', {zoomControl: false,
    attributionControl: false
}).setView([43.2513, -3.4607], 14);

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

    var contenidoPopup = 
        '<b style="cursor:pointer; text-decoration:underline; color:#f5ead8;" ' +
        'onclick="window.location.href=\'cuevas.html\'">Ruta de las Cuevas</b><br>' +
        '📏 5.2 km&nbsp;&nbsp;🕐 1h 30min<br><b>Dificultad:</b> Fácil';

    // Click — escritorio y móvil
    e.target.on('click', function(ev) {
        this.bindPopup(contenidoPopup, {closeButton: true, minWidth: 100})
            .openPopup(ev.latlng);
    });

    // Touch — algunos móviles necesitan esto
    e.target.eachLayer(function(layer) {
        layer.on('click', function(ev) {
            layer.bindPopup(contenidoPopup, {closeButton: true, minWidth: 100})
                .openPopup(ev.latlng);
        });
    });
}).addTo(mapa);

// Carga y dibuja el track de la Ruta de Cubillas
new L.GPX('data/cubillas.gpx', {
    async: true,
    polyline_options: {
        color: '#8B4513',
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

    var contenidoPopup = 
        '<b style="cursor:pointer; text-decoration:underline; color:#f5ead8;" ' +
        'onclick="window.location.href=\'cubillas.html\'">Paseo de Cubillas</b><br>' +
        '📏 4 km&nbsp;&nbsp;🕐 45mins <br><b>Dificultad:</b> Fácil';

    // Click — escritorio y móvil
    e.target.on('click', function(ev) {
        this.bindPopup(contenidoPopup, 
            {closeButton: true, 
                minWidth: 100,
                className: 'cubillas-popup'
            })
            .openPopup(ev.latlng);
    });

    // Touch — algunos móviles necesitan esto
    e.target.eachLayer(function(layer) {
        layer.on('click', function(ev) {
            layer.bindPopup(contenidoPopup, {closeButton: true, minWidth: 100, className: 'cubillas-popup'})
                .openPopup(ev.latlng);
        });
    });
}).addTo(mapa);