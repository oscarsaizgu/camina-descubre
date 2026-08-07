var mapa = L.map('mapa-detalle', {zoomControl: false, 
    attributionControl: false,
    edgeScale: false}).setView([43.2513, -3.4607], 14);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri'
}).addTo(mapa);

var elevacion = L.control.elevation({
    theme: "custom-theme",
    collapsed: false,
    detached: true,
    elevationDiv: "#grafico-elevacion",
    autohide: false,
    followMarker: true,
    height: 120,
    time: false,
    distance: false,
    elevation: false,
    speed: false,
    slope: false,
    legend: false,
    ruler: false,
    closeBtn: false,
    waypoints: false,
    wptIcons: false,
    polyline: false,
});
elevacion.addTo(mapa);
elevacion.load('data/cuevas.gpx');

new L.GPX('data/cuevas.gpx', {
    async: true,
    polyline_options: {
        color: '#fce8c6',
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
    var bounds = e.target.getBounds();
    mapa.fitBounds(bounds);
    mapa.options.minZoom = mapa.getZoom();
}).addTo(mapa);

var puntosInteres = [
    { coords: [43.244719, -3.454010], nombre: "Mirador de Covalanas", foto: "fotos/mirador.jpg", streetview: null },
    { coords: [43.245467, -3.452144], nombre: "Cueva de Covalanas", foto: "fotos/covalanas.jpg", streetview: null },
    { coords: [43.245171, -3.452452], nombre: "Cueva del Mirón", foto: "fotos/miron.jpg", streetview: null },
    { coords: [43.244278, -3.450562], nombre: "Cueva de la Luz", foto: "fotos/luz.jpg", streetview: null },
    { coords: [43.248049, -3.456690], nombre: "Cueva el Haza", foto: "fotos/haza.jpg", streetview: null },
    { coords: [43.255676, -3.458022], nombre: "Cueva de Cullalvera", foto: "fotos/cullalvera.jpg", streetview: null },
    { coords: [43.243676959842375, -3.4515943412797148], nombre: "Mirador Pared del Eco", foto: null, streetview: "https://www.google.com/maps/embed?pb=!4v1786105827670!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRHlqZUhfQ2c.!2m2!1d43.24362767947232!2d-3.451567598630545!3f102.16397789636218!4f0!5f0.7820865974627469" }
];

var iconoMarker = L.divIcon({
    className: 'marker-personalizado',
    html: '<div class="marker-pin"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

puntosInteres.forEach(function(punto) {
    var marker = L.marker(punto.coords, { icon: iconoMarker }).addTo(mapa);

    marker.on('mouseover', function() {
        var contenido = '<b>' + punto.nombre + '</b>';
        if (punto.foto) {
            contenido += '<br><img src="' + punto.foto + '" style="width:150px; margin-top:5px; border-radius:4px;">';
        }
        this.bindPopup(contenido, { closeButton: false, maxWidth: 200, autoPan: false }).openPopup();
    });

    marker.on('mouseout', function() {
        this.closePopup();
    });

    marker.on('click', function() {
        var iframe = document.getElementById('lightbox-iframe');
        var img = document.getElementById('lightbox-img');

        if (punto.streetview) {
            iframe.src = punto.streetview;
            iframe.style.display = 'block';
            img.style.display = 'none';
        } else if (punto.foto) {
            img.src = punto.foto;
            img.style.display = 'block';
            iframe.style.display = 'none';
            iframe.src = '';
        }
        document.getElementById('lightbox-titulo').textContent = punto.nombre;
        document.getElementById('lightbox').style.display = 'flex';
    });
});

var lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = '<div id="lightbox-contenido"><span id="lightbox-cerrar">✕</span><img id="lightbox-img"><iframe id="lightbox-iframe" style="display:none;width:100%;height:300px;border:0;" allowfullscreen="" loading="lazy"></iframe><p id="lightbox-titulo"></p></div>';
document.body.appendChild(lightbox);

document.getElementById('lightbox-cerrar').addEventListener('click', function() {
    lightbox.style.display = 'none';
    document.getElementById('lightbox-iframe').src = '';
});