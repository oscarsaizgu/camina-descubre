// ======================================================
// seguir.js — GPS tracking + brújula opcional
// ======================================================

var params  = new URLSearchParams(window.location.search);
var rutaId  = params.get('ruta') || 'cuevas';

// --- Mapa ---
var mapa = L.map('mapa-seguir', {
    zoomControl: false,
    attributionControl: false
}).setView([43.2513, -3.4607], 15);

mapa.invalidateSize();
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri'
}).addTo(mapa);

new L.GPX('data/' + rutaId + '.gpx', {
    async: true,
    polyline_options: { color: '#fce8c6', weight: 4, opacity: 0.9, className: 'mi-track' },
    marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null }
}).on('loaded', function(e) {
    mapa.fitBounds(e.target.getBounds());
}).addTo(mapa);

// --- Marcador de usuario (flecha oculta hasta tener orientación) ---
var iconoUsuario = L.divIcon({
    className: '',
    html: '<div id="icono-usuario" style="width:24px;height:24px;position:relative;transform-origin:12px 12px;">' +
              '<div style="position:absolute;top:4px;left:4px;width:16px;height:16px;background:#4fc3f7;border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(79,195,247,0.8);"></div>' +
              '<div id="flecha-usuario" style="position:absolute;top:-4px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:10px solid #4fc3f7;display:none;"></div>' +
          '</div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});
var marcador = null;

// --- Estado general ---
var pausado                    = false;
var iniciado                   = false;
var segundos                   = 0;
var distanciaTotal             = 0;    // km
var posicionAnterior           = null;
var saltarPrimerPuntoTrasReanudar = false;
var intervaloTiempo            = null;
var watchId                    = null;
var siguiendoUsuario           = true;
var historialVelocidad         = [];   // últimas N lecturas para suavizar

// Límites para filtrar ruido GPS
var MAX_PRECISION_M  = 50;   // ignorar si la precisión es peor que esto
var MAX_SALTO_KM     = 0.3;  // ignorar si salta más de 300m de golpe (teleportación)

// --- Cronómetro ---
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

// --- Haversine (devuelve km) ---
function calcularDistancia(lat1, lon1, lat2, lon2) {
    var R    = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a    = Math.sin(dLat/2) * Math.sin(dLat/2) +
               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
               Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// --- Actualizar posición GPS ---
function actualizarPosicion(pos) {
    var lat       = pos.coords.latitude;
    var lon       = pos.coords.longitude;
    var precision = pos.coords.accuracy;  // metros
    var velGPS    = pos.coords.speed;     // m/s o null

    // Ocultar aviso de error GPS si estaba visible
    var aviso = document.getElementById('aviso-gps');
    if (aviso) aviso.style.display = 'none';

    // Primer arranque: centrar el mapa e iniciar cronómetro
    if (!iniciado) {
        mapa.setView([lat, lon], 16);
        iniciarCronometro();
        iniciado = true;
    }

    // Mover marcador (siempre, también en pausa)
    if (!marcador) {
        marcador = L.marker([lat, lon], { icon: iconoUsuario }).addTo(mapa);
    } else {
        marcador.setLatLng([lat, lon]);
    }

    // Seguimiento automático del mapa
    if (siguiendoUsuario) {
        mapa.panTo([lat, lon]);
    }

    // No acumular estadísticas mientras está pausado
    if (pausado) return;

    // Primer punto tras reanudar: actualizar referencia sin contar distancia
    // (evita sumar el salto producido durante la pausa)
    if (saltarPrimerPuntoTrasReanudar) {
        posicionAnterior = { lat: lat, lon: lon };
        saltarPrimerPuntoTrasReanudar = false;
        return;
    }

    // Calcular distancia con filtros
    if (posicionAnterior && precision <= MAX_PRECISION_M) {
        var delta = calcularDistancia(posicionAnterior.lat, posicionAnterior.lon, lat, lon);

        // Filtrar teleportaciones (salto absurdo)
        if (delta < MAX_SALTO_KM) {
            // Determinar si hay movimiento real:
            // - Si el GPS da velocidad: usar esa (más fiable que comparar posiciones)
            // - Si no: comparar el desplazamiento con la propia precisión declarada
            var enMovimiento = (velGPS !== null && velGPS !== undefined)
                ? velGPS > 0.3                       // > ~1 km/h
                : (delta * 1000) > (precision * 0.5); // movimiento > mitad del error

            if (enMovimiento) {
                distanciaTotal += delta;
            }
        }
        posicionAnterior = { lat: lat, lon: lon };
    } else if (!posicionAnterior && precision <= MAX_PRECISION_M) {
        posicionAnterior = { lat: lat, lon: lon };
    }

    // Velocidad: usar la del GPS cuando esté disponible (suele estar filtrada por el SO)
    var velKmh = (velGPS !== null && velGPS !== undefined && velGPS >= 0)
        ? velGPS * 3.6
        : 0;

    // Suavizar con media de las últimas 5 lecturas
    historialVelocidad.push(velKmh);
    if (historialVelocidad.length > 5) historialVelocidad.shift();
    var velMedia = historialVelocidad.reduce(function(a, b) { return a + b; }, 0) / historialVelocidad.length;

    document.getElementById('distancia').textContent = distanciaTotal.toFixed(2);
    document.getElementById('velocidad').textContent = velMedia.toFixed(1);
}

function errorGPS(err) {
    var msgs = {
        1: 'Permiso de ubicación denegado. Actívalo en los ajustes del navegador.',
        2: 'No se puede obtener tu posición. Comprueba la señal GPS.',
        3: 'Tiempo de espera GPS agotado. Buscando señal...'
    };
    var aviso = document.getElementById('aviso-gps');
    if (aviso) {
        aviso.textContent = msgs[err.code] || 'Error GPS. Comprueba tu señal.';
        aviso.style.display = 'block';
    }
}

watchId = navigator.geolocation.watchPosition(
    actualizarPosicion,
    errorGPS,
    { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
);

// --- Desactivar seguimiento si el usuario arrastra el mapa ---
mapa.on('dragstart', function() {
    siguiendoUsuario = false;
    document.getElementById('btn-volver').style.display = 'block';
});

// ======================================================
// CONTROLES
// ======================================================

function pausar() {
    pausado = !pausado;
    if (!pausado) {
        // Al reanudar: ignorar primer punto para no contar el salto de la pausa
        saltarPrimerPuntoTrasReanudar = true;
        historialVelocidad = [];
        document.getElementById('velocidad').textContent = '0.0';
    }
    document.getElementById('btn-pausar').textContent = pausado ? '▶ Reanudar' : '⏸ Pausar';
}

function volverAPosicion() {
    siguiendoUsuario = true;
    document.getElementById('btn-volver').style.display = 'none';
    if (marcador) mapa.panTo(marcador.getLatLng());
}

function parar() {
    if (confirm('¿Terminar la ruta?')) {
        clearInterval(intervaloTiempo);
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }
        desactivarBrujula();
        window.location.href = rutaId + '.html';
    }
}

// ======================================================
// BRÚJULA — completamente opcional
// ======================================================

var brujulaActiva      = false;
var anguloSuavizado    = null;
var recibiendoAbsoluto = false; // indica si ya recibimos eventos de orientación absoluta

function aplicarRotacion(angulo) {
    // Suavizado exponencial con manejo correcto de wrap-around (p.ej. 359° → 1°)
    if (anguloSuavizado === null) {
        anguloSuavizado = angulo;
    } else {
        var diff = angulo - anguloSuavizado;
        if (diff >  180) diff -= 360;
        if (diff < -180) diff += 360;
        anguloSuavizado = (anguloSuavizado + diff * 0.3 + 360) % 360;
    }

    var icono = document.getElementById('icono-usuario');
    if (icono) icono.style.transform = 'rotate(' + anguloSuavizado.toFixed(1) + 'deg)';

    // Mostrar la flecha solo cuando hay datos reales de orientación
    var flecha = document.getElementById('flecha-usuario');
    if (flecha) flecha.style.display = 'block';
}

// deviceorientationabsolute: disponible en Chrome/Android, alpha = ángulo desde Norte magnético
function manejarOrientacionAbsoluta(e) {
    recibiendoAbsoluto = true;
    if (e.alpha !== null && e.alpha !== undefined) {
        // alpha crece en sentido antihorario → convertir a rumbo horario
        aplicarRotacion((360 - e.alpha + 360) % 360);
    }
}

// deviceorientation: fallback para iOS y Android sin absolute
function manejarOrientacion(e) {
    if (recibiendoAbsoluto) return; // preferir orientación absoluta si ya la tenemos

    if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
        // iOS: webkitCompassHeading es ya un rumbo real (0=Norte, sentido horario)
        aplicarRotacion(e.webkitCompassHeading);
    } else if (e.alpha !== null && e.alpha !== undefined) {
        // Android sin absolute o navegadores de escritorio: menos fiable
        aplicarRotacion((360 - e.alpha + 360) % 360);
    }
}

function activarListeners() {
    brujulaActiva = true;
    window.addEventListener('deviceorientationabsolute', manejarOrientacionAbsoluta, true);
    window.addEventListener('deviceorientation', manejarOrientacion, true);
}

function desactivarBrujula() {
    if (brujulaActiva) {
        window.removeEventListener('deviceorientationabsolute', manejarOrientacionAbsoluta, true);
        window.removeEventListener('deviceorientation', manejarOrientacion, true);
        brujulaActiva = false;
    }
}

// Llamado desde el modal (botón "Activar brújula") en iOS
function pedirPermisoBrujula() {
    document.getElementById('modal-brujula').style.display = 'none';
    DeviceOrientationEvent.requestPermission()
        .then(function(permiso) {
            if (permiso === 'granted') activarListeners();
            // denied o error: continúa sin brújula, el GPS sigue funcionando
        })
        .catch(function() {
            // No se pudo pedir permiso: continúa sin brújula
        });
}

function activarBrujula() {
    if (typeof DeviceOrientationEvent === 'undefined') {
        // El navegador no soporta orientación: sin brújula, sin aviso, GPS normal
        return;
    }
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+: requiere permiso explícito — mostrar modal
        document.getElementById('modal-brujula').style.display = 'flex';
    } else {
        // Android / otros: sin permiso explícito, activar directamente
        activarListeners();
    }
}

window.addEventListener('load', function() {
    activarBrujula();
});
