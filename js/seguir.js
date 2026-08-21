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

// Marcador — div interno con id para rotar solo él
var iconoUsuario = L.divIcon({
    className: '',
    html: '<div id="icono-usuario" style="width:24px;height:24px;position:relative;transform-origin:12px 12px;">' +
              '<div style="position:absolute;top:4px;left:4px;width:16px;height:16px;background:#4fc3f7;border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(79,195,247,0.8);"></div>' +
              '<div style="position:absolute;top:-4px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:10px solid #4fc3f7;"></div>' +
          '</div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});
var marcador = null;

var pausado = false;
var iniciado = false;
var segundos = 0;
var distanciaTotal = 0;
var posicionAnterior = null;
var intervaloTiempo = null;

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

function calcularDistancia(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function actualizarPosicion(pos) {
    if (pausado) return;
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;
    var velocidad = pos.coords.speed ? (pos.coords.speed * 3.6).toFixed(1) : '0.0';

    if (!iniciado) {
        mapa.setView([lat, lon], 16);
        iniciarCronometro();
        iniciado = true;
    }

    if (!marcador) {
        marcador = L.marker([lat, lon], { icon: iconoUsuario }).addTo(mapa);
    } else {
        marcador.setLatLng([lat, lon]);
    }

    if (posicionAnterior) {
        distanciaTotal += calcularDistancia(
            posicionAnterior.lat, posicionAnterior.lon, lat, lon
        );
    }
    posicionAnterior = { lat: lat, lon: lon };

    document.getElementById('distancia').textContent = distanciaTotal.toFixed(2);
    document.getElementById('velocidad').textContent = velocidad;
    mapa.panTo([lat, lon]);
}

navigator.geolocation.watchPosition(
    actualizarPosicion,
    function(err) { console.warn('Error GPS:', err); },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
);

function pausar() {
    pausado = !pausado;
    document.getElementById('btn-pausar').textContent = pausado ? '▶ Reanudar' : '⏸ Pausar';
}

function parar() {
    if (confirm('¿Terminar la ruta?')) {
        clearInterval(intervaloTiempo);
        window.location.href = rutaId + '.html';
    }
}

// === BRÚJULA ===
function aplicarRotacion(angulo) {
    var icono = document.getElementById('icono-usuario');
    if (icono) icono.style.transform = 'rotate(' + angulo + 'deg)';
}

function manejarOrientacion(e) {
    var angulo;
    if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
        angulo = e.webkitCompassHeading; // iOS
    } else if (e.alpha !== null && e.alpha !== undefined) {
        angulo = 360 - e.alpha; // Android
    }
    if (angulo !== undefined) aplicarRotacion(angulo);
}

function activarBrujula() {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ — necesita permiso
        DeviceOrientationEvent.requestPermission()
            .then(function(respuesta) {
                if (respuesta === 'granted') {
                    window.addEventListener('deviceorientation', manejarOrientacion, true);
                    document.getElementById('btn-brujula').style.display = 'none';
                }
            });
    } else {
        // Android — activar directamente
        window.addEventListener('deviceorientationabsolute', manejarOrientacion, true);
        window.addEventListener('deviceorientation', manejarOrientacion, true);
        document.getElementById('btn-brujula').style.display = 'none';
    }
}

// Android: activar automáticamente sin esperar botón
if (typeof DeviceOrientationEvent === 'undefined' ||
    typeof DeviceOrientationEvent.requestPermission !== 'function') {
    window.addEventListener('deviceorientationabsolute', manejarOrientacion, true);
    window.addEventListener('deviceorientation', manejarOrientacion, true);
    window.addEventListener('load', function() {
        var btn = document.getElementById('btn-brujula');
        if (btn) btn.style.display = 'none';
    });
}