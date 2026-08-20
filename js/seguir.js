// Lee qué ruta hay que mostrar desde la URL
var params = new URLSearchParams(window.location.search);
var rutaId = params.get('ruta') || 'cuevas';

// Inicializa el mapa a pantalla completa
var mapa = L.map('mapa-seguir', {
    zoomControl: false,
    attributionControl: false
}).setView([43.2513, -3.4607], 15);

mapa.invalidateSize();
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri'
}).addTo(mapa);

// Carga el track de la ruta
new L.GPX('data/' + rutaId + '.gpx', {
    async: true,
    polyline_options: {
        color: '#fce8c6',
        weight: 4,
        opacity: 0.9,
        className: 'mi-track'
    },
    marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null }
}).on('loaded', function(e) {
    mapa.fitBounds(e.target.getBounds());
}).addTo(mapa);

// Marcador de posición del usuario
var iconoUsuario = L.divIcon({
    className: '',
    html: '<div id="marcador-usuario"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});
var marcador = null;

// Variables de seguimiento
var pausado = false;
var iniciado = false;
var segundos = 0;
var distanciaTotal = 0;
var posicionAnterior = null;
var intervaloTiempo = null;

// Arranca el cronómetro
function iniciarCronometro() {
    intervaloTiempo = setInterval(function() {
        if (!pausado) {
            segundos++;
            var m = Math.floor(segundos / 60);
            var s = segundos % 60;
            document.getElementById('tiempo').textContent =
                (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
        }
    }, 1000);
}

// Calcula la distancia entre dos coordenadas en km (fórmula Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Actualiza la posición del usuario en el mapa
function actualizarPosicion(pos) {
    if (pausado) return;

    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;
    var velocidad = pos.coords.speed ? (pos.coords.speed * 3.6).toFixed(1) : '0.0';

    // Primera posición — centra el mapa y arranca el cronómetro
    if (!iniciado) {
        mapa.setView([lat, lon], 16);
        iniciarCronometro();
        iniciado = true;
    }

    // Actualiza o crea el marcador
    if (!marcador) {
        marcador = L.marker([lat, lon], { icon: iconoUsuario }).addTo(mapa);
    } else {
        marcador.setLatLng([lat, lon]);
    }

    // Calcula distancia recorrida
    if (posicionAnterior) {
        distanciaTotal += calcularDistancia(
            posicionAnterior.lat, posicionAnterior.lon, lat, lon
        );
    }
    posicionAnterior = { lat: lat, lon: lon };

    // Actualiza los contadores en pantalla
    document.getElementById('distancia').textContent = distanciaTotal.toFixed(2);
    document.getElementById('velocidad').textContent = velocidad;

    // Sigue al usuario con el mapa
    mapa.panTo([lat, lon]);
}

// Inicia el seguimiento GPS
navigator.geolocation.watchPosition(
    actualizarPosicion,
    function(err) { console.warn('Error GPS:', err); },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
);

// Pausa o reanuda el seguimiento
function pausar() {
    pausado = !pausado;
    document.getElementById('btn-pausar').textContent = pausado ? '▶ Reanudar' : '⏸ Pausar';
}

// Para el seguimiento y vuelve a la página de la ruta
function parar() {
    if (confirm('¿Terminar la ruta?')) {
        clearInterval(intervaloTiempo);
        window.location.href = rutaId + '.html';
    }
}

// Orientación del dispositivo (brújula)
var orientacion = 0;

window.addEventListener('deviceorientationabsolute', function(e) {
    if (e.alpha !== null) {
        orientacion = e.alpha;
        if (marcador) {
            marcador.getElement().style.transform += ' rotate(' + orientacion + 'deg)';
        }
    }
}, true);