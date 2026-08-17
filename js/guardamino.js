var mapa = L.map('mapa-detalle', {
    zoomControl: false,
    attributionControl: false,
    edgeScale: false
}).setView([43.2513, -3.4607], 14);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri'
}).addTo(mapa);

// Elevación principal
var elevacionA = L.control.elevation({
    theme: "custom-theme", collapsed: false, detached: true,
    elevationDiv: "#grafico-elevacion", autohide: false, followMarker: true,
    height: 120, time: false, distance: false, elevation: false, speed: false,
    slope: false, legend: false, ruler: false, closeBtn: false,
    waypoints: false, wptIcons: false, polyline: false
});
elevacionA.addTo(mapa);
elevacionA.load('data/guardamino.gpx');

// Elevación variante B
var elevacionB = L.control.elevation({
    theme: "custom-theme", collapsed: false, detached: true,
    elevationDiv: "#grafico-elevacion-b", autohide: false, followMarker: true,
    height: 120, time: false, distance: false, elevation: false, speed: false,
    slope: false, legend: false, ruler: false, closeBtn: false,
    waypoints: false, wptIcons: false, polyline: false
});
elevacionB.addTo(mapa);
elevacionB.load('data/guardaminob.gpx');

// Datos de cada variante
var datos = {
    a: { distancia: '4,71 km', duracion: '60 min', desnivel: '146m', tipo: 'Circular' },
    b: { distancia: '3,71 km', duracion: '50 min', desnivel: '127m',    tipo: 'Circular' }
};

var descripciones = {
    a: 'Comenzamos la ruta en la bolera de pasabolo "Domingo Muguira" y tomamos la calle del barrio La Casa en dirección al Bº Guardamino. Sin desviarnos de la carretera, a 2,5 km del inicio llegamos a un cruce que tomamos a la izquierda, en dirección a la ermita de Nuestra Señora de Guardamino. A 300 m de la ermita encontramos otro cruce, también a la izquierda, que nos lleva a la zona más alta de la ruta, desde donde se divisa el pueblo de Ramales y todo el macizo del Pico San Vicente y la Sierra del Hornijo. Siguiendo el camino llegamos al monumento a la batalla de Ramales, de la Primera Guerra Carlista. Desde aquí, continuamos por la carretera de la izquierda para volver, en 1 km, al punto de inicio.',
    b: 'Comenzamos la ruta en la bolera de pasabolo "Domingo Muguira" y tomamos la calle del barrio La Casa en dirección al Bº Guardamino. Antes del taller Madreselva, subimos por el monte hasta llegar a la Piedra Carlista. Siguiendo el camino llegamos al monumento a la batalla de Ramales, de la Primera Guerra Carlista. Desde aquí, continuamos por la carretera de la izquierda para volver, en 1 km, al punto de inicio.'
};

var trackA, trackB, polylineA, polylineB;

function activarVariante(v) {
    // Elevación
    document.getElementById('grafico-elevacion').style.display   = v === 'a' ? 'block' : 'none';
    document.getElementById('grafico-elevacion-b').style.display = v === 'b' ? 'block' : 'none';

    // Datos
    document.getElementById('dato-distancia').textContent = datos[v].distancia;
    document.getElementById('dato-duracion').textContent  = datos[v].duracion;
    document.getElementById('dato-desnivel').textContent  = datos[v].desnivel;
    document.getElementById('dato-tipo').textContent      = datos[v].tipo;

    // Descripción
    document.getElementById('texto-descripcion').textContent = descripciones[v];

    // Botones
    document.getElementById('btn-variante-a').classList.toggle('variante-activa', v === 'a');
    document.getElementById('btn-variante-b').classList.toggle('variante-activa', v === 'b');

    // Tracks: el seleccionado sólido y grueso, el otro fino y discontinuo
if (trackA) trackA.setStyle({ dashArray: v === 'a' ? null : '8, 8', weight: v === 'a' ? 4 : 2 });
if (trackB) trackB.setStyle({ dashArray: v === 'b' ? null : '8, 8', weight: v === 'b' ? 4 : 2 });
}

// Track principal
trackA = new L.GPX('data/guardamino.gpx', {
    async: true,
    polyline_options: { color: '#fce8c6', weight: 4, opacity: 0.9, className: 'mi-track' },
    marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null }
}).on('loaded', function(e) {
    var bounds = e.target.getBounds();
    mapa.fitBounds(bounds);
    mapa.setMaxBounds(bounds.pad(0.1));
    mapa.options.minZoom = mapa.getZoom();
    polylineA = e.target.getLayers()[0];
    e.target.on('click', function() { activarVariante('a'); });
    e.target.eachLayer(function(layer) { layer.on('click', function() { activarVariante('a'); }); });
}).addTo(mapa);

// Track variante B
trackB = new L.GPX('data/guardaminob.gpx', {
    async: true,
    polyline_options: { color: '#fce8c6', weight: 2, opacity: 0.9, dashArray: '8, 8', className: 'mi-track' },
    marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null }
}).on('loaded', function(e) {
    polylineB = e.target.getLayers()[0];
    e.target.on('click', function() { activarVariante('b'); });
    e.target.eachLayer(function(layer) { layer.on('click', function() { activarVariante('b'); }); });
}).addTo(mapa);

// Lightbox
var lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = '<div id="lightbox-contenido"><span id="lightbox-cerrar">✕</span><img id="lightbox-img"><p id="lightbox-titulo"></p></div>';
document.body.appendChild(lightbox);
document.getElementById('lightbox-cerrar').addEventListener('click', function() {
    lightbox.style.display = 'none';
});

// Puntos de interés con fotos
var puntosInteres = [
    {
        coords: [43.26138646986801, -3.455310394447993],
        nombre: "Monumento a La Batalla de Ramales",
        foto: "fotos/puente.jpg"
    },
    {
        coords: [43.2620532187991, -3.4450485940378512],
        nombre: "Iglesia de Nuestra Señora, Parroquia de San Pedro",
        foto: "fotos/parquecubillas.jpg"
    },
     {
        coords: [43.256952100060936, -3.4629698197607337],
        nombre: "Bolera Domingo Muguira",
        foto: "fotos/pumptrack.jpg"
    },
       {
        coords: [43.25867491569154, -3.450799765317839],
        nombre: "Camino secundario",
        foto: "fotos/pumptrack.jpg"
    },
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

    marker.on('mouseout', function() { this.closePopup(); });

    marker.on('click', function() {
        document.getElementById('lightbox-img').src = punto.foto;
        document.getElementById('lightbox-titulo').textContent = punto.nombre;
        document.getElementById('lightbox').style.display = 'flex';
    });
});