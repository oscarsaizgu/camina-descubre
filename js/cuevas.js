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
elevacion.load('data/cuevas.gpx');

// Track beige
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
    mapa.fitBounds(e.target.getBounds());
}).addTo(mapa);

// Puntos de interés con fotos
var puntosInteres = [
    {
        coords: [43.244719, -3.454010],
        nombre: "Mirador de Covalanas",
        foto: "fotos/mirador.jpg"
    },
    {
        coords: [43.245467, -3.452144],
        nombre: "Cueva de Covalanas",
        foto: "fotos/covalanas.jpg"
    },
    {
        coords: [43.245171, -3.452452],
        nombre: "Cueva del Mirón",
        foto: "fotos/miron.jpg"
    },
    {
        coords: [43.244278, -3.450562],
        nombre: "Cueva de la Luz",
        foto: "fotos/luz.jpg"
    },
    {
        coords: [43.248049, -3.456690],
        nombre: "Cueva el Haza",
        foto: "fotos/haza.jpg"
    },
    {
        coords: [43.255676, -3.458022],
        nombre: "Cueva de Cullalvera",
        foto: "fotos/cullalvera.jpg"
    }
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