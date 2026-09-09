// ======================================================
// seguir.js — GPS tracking + brújula + UI Camina y Descubre
// ======================================================

var params  = new URLSearchParams(window.location.search);
var rutaId  = params.get('ruta') || 'cuevas';

// Nombres legibles de cada ruta
var nombreRutas = {
    'cuevas':     'Ruta de las Cuevas',
    'pondra':     'Pondra y Riancho',
    'guardamino': 'Alto de Guardamino',
    'coto':       'Coto del Asón',
    'cubillas':   'Fuente Cubillas'
};
var nombreRuta = nombreRutas[rutaId] || (rutaId.charAt(0).toUpperCase() + rutaId.slice(1));

// ─── MAPA ─────────────────────────────────────────────
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

// ─── MARCADOR DE USUARIO ───────────────────────────────
var iconoUsuario = L.divIcon({
    className: '',
    html: '<div id="icono-usuario" style="width:24px;height:24px;position:relative;transform-origin:12px 12px;">' +
              '<div style="position:absolute;inset:0;border-radius:50%;background:rgba(79,195,247,0.2);"></div>' +
              '<div style="position:absolute;top:4px;left:4px;width:16px;height:16px;background:#4fc3f7;border:2.5px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>' +
              '<div id="flecha-usuario" style="position:absolute;top:-5px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:9px solid white;display:none;"></div>' +
          '</div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});
var marcador = null;

// ─── ESTADO ────────────────────────────────────────────
var pausado                       = false;
var iniciado                      = false;
var segundos                      = 0;
var distanciaTotal                = 0;
var posicionAnterior              = null;
var saltarPrimerPuntoTrasReanudar = false;
var intervaloTiempo               = null;
var watchId                       = null;
var siguiendoUsuario              = true;
var historialVelocidad            = [];

var MAX_PRECISION_M = 50;
var MAX_SALTO_KM    = 0.3;

// ─── INICIO ────────────────────────────────────────────
function iniciarUI() {
    // Nombres en cabecera y modal fin
    var elCab = document.getElementById('cab-ruta');
    var elFin = document.getElementById('fin-nombre-ruta');
    if (elCab) elCab.textContent = nombreRuta;
    if (elFin) elFin.textContent = nombreRuta;

    // Bloque POI: sin datos en este contexto, mostrar mensaje neutro
    var num    = document.getElementById('sig-poi-num');
    var nombre = document.getElementById('sig-poi-nombre');
    var dist   = document.getElementById('sig-poi-dist');
    var flecha = document.getElementById('sig-poi-flecha');
    var ph     = document.getElementById('sig-poi-placeholder');

    if (num)    num.style.display    = 'none';
    if (nombre) nombre.style.display = 'none';
    if (dist)   dist.style.display   = 'none';
    if (flecha) flecha.style.display = 'none';
    if (ph) {
        ph.textContent   = 'Ruta activa';
        ph.style.cssText = 'font-family:CanvaSans,sans-serif;font-size:0.75rem;letter-spacing:0.08em;color:rgba(45,74,53,0.45);';
    }
}

// ─── CRONÓMETRO ────────────────────────────────────────
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

// ─── HAVERSINE ─────────────────────────────────────────
function calcularDistancia(lat1, lon1, lat2, lon2) {
    var R    = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a    = Math.sin(dLat/2) * Math.sin(dLat/2) +
               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
               Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── GPS: ACTUALIZAR POSICIÓN ──────────────────────────
function actualizarPosicion(pos) {
    var lat       = pos.coords.latitude;
    var lon       = pos.coords.longitude;
    var precision = pos.coords.accuracy;
    var velGPS    = pos.coords.speed;

    // Ocultar aviso GPS si estaba visible
    var aviso = document.getElementById('aviso-gps');
    if (aviso) aviso.classList.remove('visible');

    // Arranque inicial
    if (!iniciado) {
        mapa.setView([lat, lon], 16);
        iniciarCronometro();
        iniciado = true;
    }

    // Mover marcador
    if (!marcador) {
        marcador = L.marker([lat, lon], { icon: iconoUsuario }).addTo(mapa);
    } else {
        marcador.setLatLng([lat, lon]);
    }

    // Seguir posición en el mapa
    if (siguiendoUsuario) mapa.panTo([lat, lon]);

    // En pausa no acumular estadísticas
    if (pausado) return;

    // Primer punto tras reanudar: no contar el salto
    if (saltarPrimerPuntoTrasReanudar) {
        posicionAnterior = { lat: lat, lon: lon };
        saltarPrimerPuntoTrasReanudar = false;
        return;
    }

    // Acumular distancia con filtros
    if (posicionAnterior && precision <= MAX_PRECISION_M) {
        var delta = calcularDistancia(posicionAnterior.lat, posicionAnterior.lon, lat, lon);
        if (delta < MAX_SALTO_KM) {
            var enMovimiento = (velGPS !== null && velGPS !== undefined)
                ? velGPS > 0.3
                : (delta * 1000) > (precision * 0.5);
            if (enMovimiento) distanciaTotal += delta;
        }
        posicionAnterior = { lat: lat, lon: lon };
    } else if (!posicionAnterior && precision <= MAX_PRECISION_M) {
        posicionAnterior = { lat: lat, lon: lon };
    }

    // Velocidad
    var velKmh = (velGPS !== null && velGPS !== undefined && velGPS >= 0)
        ? velGPS * 3.6 : 0;
    historialVelocidad.push(velKmh);
    if (historialVelocidad.length > 5) historialVelocidad.shift();
    var velMedia = historialVelocidad.reduce(function(a, b) { return a + b; }, 0) / historialVelocidad.length;

    document.getElementById('distancia').textContent = distanciaTotal.toFixed(2).replace('.', ',');
    document.getElementById('velocidad').textContent = velMedia.toFixed(1).replace('.', ',');
}

function errorGPS(err) {
    var msgs = {
        1: 'Permiso de ubicación denegado. Actívalo en los ajustes del navegador.',
        2: 'No se puede obtener tu posición. Comprueba la señal GPS.',
        3: 'Tiempo de espera agotado. Buscando señal…'
    };
    var texto = document.getElementById('gps-texto-contenido');
    if (texto) texto.textContent = msgs[err.code] || 'Error GPS. Comprueba tu señal.';
    var aviso = document.getElementById('aviso-gps');
    if (aviso) aviso.classList.add('visible');
}

watchId = navigator.geolocation.watchPosition(
    actualizarPosicion,
    errorGPS,
    { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
);

// ─── ARRASTRAR MAPA ────────────────────────────────────
mapa.on('dragstart', function() {
    siguiendoUsuario = false;
    document.getElementById('btn-volver').classList.add('visible');
    document.getElementById('btn-centrar').classList.remove('activo');
    var tog = document.getElementById('toggle-seguir');
    if (tog) { tog.textContent = 'OFF'; tog.classList.remove('on'); }
});

// ─── CONTROLES PRINCIPALES ─────────────────────────────

function pausar() {
    pausado = !pausado;

    var banner   = document.getElementById('pausa-banner');
    var iconoEl  = document.getElementById('icon-pausar');
    var textoEl  = document.getElementById('txt-pausar');

    if (pausado) {
        // ── PAUSAR ──
        if (banner)  banner.classList.add('visible');
        if (textoEl) textoEl.textContent = 'Reanudar';
        if (iconoEl) iconoEl.innerHTML =
            '<path d="M1 1.5L11 7.5L1 13.5V1.5Z" fill="currentColor"/>';
        // Cambiar viewBox del icono a triángulo play
        if (iconoEl) { iconoEl.setAttribute('viewBox','0 0 12 15'); iconoEl.setAttribute('width','12'); iconoEl.setAttribute('height','15'); }
    } else {
        // ── REANUDAR ──
        saltarPrimerPuntoTrasReanudar = true;
        historialVelocidad = [];
        document.getElementById('velocidad').textContent = '—';
        if (banner)  banner.classList.remove('visible');
        if (textoEl) textoEl.textContent = 'Pausar';
        if (iconoEl) {
            iconoEl.setAttribute('viewBox','0 0 14 16');
            iconoEl.setAttribute('width','14');
            iconoEl.setAttribute('height','16');
            iconoEl.innerHTML =
                '<rect x="0" y="0" width="4" height="16" rx="2" fill="currentColor"/>' +
                '<rect x="10" y="0" width="4" height="16" rx="2" fill="currentColor"/>';
        }
    }
}

function volverAPosicion() {
    siguiendoUsuario = true;
    document.getElementById('btn-volver').classList.remove('visible');
    document.getElementById('btn-centrar').classList.add('activo');
    var tog = document.getElementById('toggle-seguir');
    if (tog) { tog.textContent = 'ON'; tog.classList.add('on'); }
    if (marcador) mapa.panTo(marcador.getLatLng());
}

// ─── FIN DE RUTA ───────────────────────────────────────
function mostrarFinRuta() {
    var elT = document.getElementById('tiempo');
    document.getElementById('fin-tiempo').textContent = elT ? elT.textContent : '—';
    document.getElementById('fin-distancia').textContent = distanciaTotal.toFixed(2).replace('.', ',') + ' km';
    var velMedia = segundos > 0 ? (distanciaTotal / (segundos / 3600)) : 0;
    document.getElementById('fin-velocidad').textContent = (velMedia > 0)
        ? velMedia.toFixed(1).replace('.', ',') + ' km/h' : '—';
    document.getElementById('modal-fin').classList.add('visible');
}

function cerrarFinRuta() {
    document.getElementById('modal-fin').classList.remove('visible');
}

function confirmarFin() {
    clearInterval(intervaloTiempo);
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    desactivarBrujula();
    window.location.href = rutaId + '.html';
}

// ─── OPCIONES / CAPAS ──────────────────────────────────
function abrirOpciones() {
    document.getElementById('modal-opciones').classList.add('visible');
}
function cerrarOpciones() {
    document.getElementById('modal-opciones').classList.remove('visible');
}
function abrirCapas() {
    var el = document.getElementById('modal-capas');
    if (el) el.style.display = 'flex';
}
function cerrarCapas() {
    var el = document.getElementById('modal-capas');
    if (el) el.style.display = 'none';
}

// ─── GPS: REINTENTAR / IGNORAR ─────────────────────────
function reiniciarGPS() {
    document.getElementById('aviso-gps').classList.remove('visible');
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    watchId = navigator.geolocation.watchPosition(
        actualizarPosicion, errorGPS,
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
    );
}

function ignorarGPS() {
    document.getElementById('aviso-gps').classList.remove('visible');
}

// ─── TOGGLES ───────────────────────────────────────────
function toggleSeguirPosicion() {
    siguiendoUsuario = !siguiendoUsuario;
    var btn = document.getElementById('toggle-seguir');
    btn.textContent = siguiendoUsuario ? 'ON' : 'OFF';
    btn.classList.toggle('on', siguiendoUsuario);
    var bv = document.getElementById('btn-volver');
    if (siguiendoUsuario) bv.classList.remove('visible'); else bv.classList.add('visible');
    document.getElementById('btn-centrar').classList.toggle('activo', siguiendoUsuario);
    if (siguiendoUsuario && marcador) mapa.panTo(marcador.getLatLng());
}

var brujulaWidgetVisible = true;
function toggleBrujulaWidget() {
    brujulaWidgetVisible = !brujulaWidgetVisible;
    var btn = document.getElementById('toggle-brujula-opt');
    btn.textContent = brujulaWidgetVisible ? 'ON' : 'OFF';
    btn.classList.toggle('on', brujulaWidgetVisible);
    document.getElementById('brujula-widget').classList.toggle('oculta', !brujulaWidgetVisible);
}

// ─── BRÚJULA ───────────────────────────────────────────
var brujulaActiva      = false;
var anguloSuavizado    = null;
var recibiendoAbsoluto = false;

function aplicarRotacion(angulo) {
    if (anguloSuavizado === null) {
        anguloSuavizado = angulo;
    } else {
        var diff = angulo - anguloSuavizado;
        if (diff >  180) diff -= 360;
        if (diff < -180) diff += 360;
        anguloSuavizado = (anguloSuavizado + diff * 0.3 + 360) % 360;
    }

    // Marcador usuario
    var icono = document.getElementById('icono-usuario');
    if (icono) icono.style.transform = 'rotate(' + anguloSuavizado.toFixed(1) + 'deg)';

    var flecha = document.getElementById('flecha-usuario');
    if (flecha) flecha.style.display = 'block';

    // Widget brújula (aguja apunta al Norte: rotación inversa al heading del dispositivo)
    var aguja = document.getElementById('brujula-aguja');
    if (aguja) aguja.style.transform = 'rotate(' + ((-anguloSuavizado + 360) % 360).toFixed(1) + 'deg)';
}

function manejarOrientacionAbsoluta(e) {
    recibiendoAbsoluto = true;
    if (e.alpha !== null && e.alpha !== undefined) {
        aplicarRotacion((360 - e.alpha + 360) % 360);
    }
}

function manejarOrientacion(e) {
    if (recibiendoAbsoluto) return;
    if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
        aplicarRotacion(e.webkitCompassHeading);
    } else if (e.alpha !== null && e.alpha !== undefined) {
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

function pedirPermisoBrujula() {
    document.getElementById('modal-brujula').style.display = 'none';
    DeviceOrientationEvent.requestPermission()
        .then(function(permiso) {
            if (permiso === 'granted') activarListeners();
        })
        .catch(function() { /* sin brújula, GPS sigue funcionando */ });
}

function activarBrujula() {
    if (typeof DeviceOrientationEvent === 'undefined') return;
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        document.getElementById('modal-brujula').style.display = 'flex';
    } else {
        activarListeners();
    }
}

// ─── ARRANQUE ──────────────────────────────────────────
// El script está al final del body, el DOM ya está listo.
// No esperamos al evento 'load' para evitar el parpadeo de "Cargando…".
iniciarUI();
activarBrujula();
document.getElementById('btn-centrar').classList.add('activo');
