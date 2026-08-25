// Inicializa el mapa de la ruta centrado en Ramales
var mapa = L.map('mapa-detalle', {zoomControl: false, 
    attributionControl: false,
edgeScale: false}).setView([43.2513, -3.4607], 14);

// Capa base satélite
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri'
}).addTo(mapa);

// Inicializa el perfil de elevación
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

// Carga el perfil de elevación
elevacion.load('data/pondra.gpx');

// Track beige
new L.GPX('data/pondra.gpx', {
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
    mapa.setMaxBounds(bounds.pad(0.1));
    mapa.options.minZoom = mapa.getZoom();
}).addTo(mapa);

// Puntos de interés con fotos
var puntosInteres = [

];

// Icono personalizado para los marcadores
var iconoMarker = L.divIcon({
    className: 'marker-personalizado',
    html: '<div class="marker-pin"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

// Crear marcador para cada punto
puntosInteres.forEach(function(punto) {
    var marker = L.marker(punto.coords, { icon: iconoMarker }).addTo(mapa);

    // Al pasar el ratón, mostrar miniatura
    marker.on('mouseover', function() {
        this.bindPopup(
            '<b>' + punto.nombre + '</b><br>' +
            '<img src="' + punto.foto + '" style="width:150px; margin-top:5px; border-radius:4px;">',
            { closeButton: false, maxWidth: 200 }
        ).openPopup();
    });

    marker.on('mouseout', function() {
        this.closePopup();
    });

    // Al hacer clic, popup más grande
marker.on('click', function() {
    document.getElementById('lightbox-img').src = punto.foto;
    document.getElementById('lightbox-titulo').textContent = punto.nombre;
    document.getElementById('lightbox').style.display = 'flex';
});
});

// Crear el lightbox (ventana de imagen grande)
var lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = '<div id="lightbox-contenido"><span id="lightbox-cerrar">✕</span><img id="lightbox-img"><p id="lightbox-titulo"></p></div>';
document.body.appendChild(lightbox);

document.getElementById('lightbox-cerrar').addEventListener('click', function() {
    lightbox.style.display = 'none';
});