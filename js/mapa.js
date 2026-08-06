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

// Carga y dibuja el track de la Ruta de Vegacorredor
new L.GPX('data/vega.gpx', {
    async: true,
    polyline_options: {
        color: '#1a5f7a',
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
        'onclick="window.location.href=\'vega.html\'">Paseo de Vegacorredor</b><br>' +
        '📏 7 km&nbsp;&nbsp;🕐 1h 30min<br><b>Dificultad:</b> Fácil';

    // Click — escritorio y móvil
    e.target.on('click', function(ev) {
        this.bindPopup(contenidoPopup, 
            {closeButton: true, 
                minWidth: 100,
                className: 'vega-popup'
            })
            .openPopup(ev.latlng);
    });

    // Touch — algunos móviles necesitan esto
    e.target.eachLayer(function(layer) {
        layer.on('click', function(ev) {
            layer.bindPopup(contenidoPopup, {closeButton: true, minWidth: 100, className: 'vega-popup'})
                .openPopup(ev.latlng);
        });
    });
}).addTo(mapa);

// Carga y dibuja el track de la Ruta de Guardamino
new L.GPX('data/guardamino.gpx', {
    async: true,
    polyline_options: {
        color: '#7a1a1a',
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
        'onclick="window.location.href=\'guardamino.html\'">Paseo de Guardamino</b><br>' +
        '📏 4,7 km&nbsp;&nbsp;🕐 50min <br><b>Dificultad:</b> Fácil';

    // Click — escritorio y móvil
    e.target.on('click', function(ev) {
        this.bindPopup(contenidoPopup, 
            {closeButton: true, 
                minWidth: 100,
                className: 'guardamino-popup'
            })
            .openPopup(ev.latlng);
    });

    // Touch — algunos móviles necesitan esto
    e.target.eachLayer(function(layer) {
        layer.on('click', function(ev) {
            layer.bindPopup(contenidoPopup, {closeButton: true, minWidth: 100, className: 'guardamino-popup'})
                .openPopup(ev.latlng);
        });
    });
}).addTo(mapa);

// Carga y dibuja el track de la Coto Cuende
new L.GPX('data/coto.gpx', {
    async: true,
    polyline_options: {
        color: '#6b4c9a',
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
        'onclick="window.location.href=\'coto.html\'">Paseo de Coto Cuende</b><br>' +
        '📏 1,26 km&nbsp;&nbsp;🕐 15min <br><b>Dificultad:</b> Fácil';

    // Click — escritorio y móvil
    e.target.on('click', function(ev) {
        this.bindPopup(contenidoPopup, 
            {closeButton: true, 
                minWidth: 100,
                className: 'coto-popup'
            })
            .openPopup(ev.latlng);
    });

    // Touch — algunos móviles necesitan esto
    e.target.eachLayer(function(layer) {
        layer.on('click', function(ev) {
            layer.bindPopup(contenidoPopup, {closeButton: true, minWidth: 100, className: 'coto-popup'})
                .openPopup(ev.latlng);
        });
    });
}).addTo(mapa);

// Carga y dibuja el track de la Dama Roja
new L.GPX('data/dama.gpx', {
    async: true,
    polyline_options: {
        color: '#b5651d',
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
        'onclick="window.location.href=\'dama.html\'">Ruta de Dama Roja</b><br>' +
        '📏 9,14 km&nbsp;&nbsp;🕐 2h <br><b>Dificultad:</b> Moderada';

    // Click — escritorio y móvil
    e.target.on('click', function(ev) {
        this.bindPopup(contenidoPopup, 
            {closeButton: true, 
                minWidth: 100,
                className: 'dama-popup'
            })
            .openPopup(ev.latlng);
    });

    // Touch — algunos móviles necesitan esto
    e.target.eachLayer(function(layer) {
        layer.on('click', function(ev) {
            layer.bindPopup(contenidoPopup, {closeButton: true, minWidth: 100, className: 'dama-popup'})
                .openPopup(ev.latlng);
        });
    });
}).addTo(mapa);

// Carga y dibuja el track de la Cucurio Ancillo
new L.GPX('data/cucurioancillo.gpx', {
    async: true,
    polyline_options: {
        color: '#2d6b4a',
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
        'onclick="window.location.href=\'cucurioa.html\'">Ruta de Cucurio por Ancillo</b><br>' +
        '📏 13,16km&nbsp;&nbsp;🕐 3h<br><b>Dificultad:</b> Moderada';

    // Click — escritorio y móvil
    e.target.on('click', function(ev) {
        this.bindPopup(contenidoPopup, 
            {closeButton: true, 
                minWidth: 100,
                className: 'cucurioa-popup'
            })
            .openPopup(ev.latlng);
    });

    // Touch — algunos móviles necesitan esto
    e.target.eachLayer(function(layer) {
        layer.on('click', function(ev) {
            layer.bindPopup(contenidoPopup, {closeButton: true, minWidth: 100, className: 'cucurioa-popup'})
                .openPopup(ev.latlng);
        });
    });
}).addTo(mapa);

// Carga y dibuja el track de la Cucurio Bolaiz
new L.GPX('data/cucuriobolaiz.gpx', {
    async: true,
    polyline_options: {
        color: '#4a2d6b',
        weight: 4,
        opacity: 0.9,
        dashArray: '8, 8',
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
        'onclick="window.location.href=\'cucuriob.html\'">Ruta de Cucurio por Bolaiz</b><br>' +
        '📏 7,21km&nbsp;&nbsp;🕐 1h 30min<br><b>Dificultad:</b> Moderada';

    // Click — escritorio y móvil
    e.target.on('click', function(ev) {
        this.bindPopup(contenidoPopup, 
            {closeButton: true, 
                minWidth: 100,
                className: 'cucuriob-popup'
            })
            .openPopup(ev.latlng);
    });

    // Touch — algunos móviles necesitan esto
    e.target.eachLayer(function(layer) {
        layer.on('click', function(ev) {
            layer.bindPopup(contenidoPopup, {closeButton: true, minWidth: 100, className: 'cucuriob-popup'})
                .openPopup(ev.latlng);
        });
    });
}).addTo(mapa);