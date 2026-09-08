// ====================================================
// FUNCIONES COMPARTIDAS PARA TODAS LAS RUTAS
// Edita aquí para cambiar algo en todas las rutas a la vez
// ====================================================


// ── Estado global compartido ──────────────────────────
var _mapaRuta         = null;   // referencia al mapa activo
var _poiMarcadores    = [];     // L.Marker[] (null si en cluster) en orden de puntosInteres
var _poiCardsLista    = [];     // elementos DOM de .punto-card en orden
var _tarjetaActual    = null;   // punto abierto en la mini-tarjeta
var _boundsIniciales  = null;   // límites del track para restablecer la vista
var _mapaListo        = false;  // true tras cargarTrack + fitBounds
var _clusterExpandido = [];     // marcadores individuales al expandir cluster
var _clusterOriginal  = null;   // { grupo, marker } del cluster actualmente expandido


// ── Inicializa el mapa (bloqueado: sin interacción de usuario) ──
function inicializarMapaRuta() {
    var mapa = L.map('mapa-detalle', {
        zoomControl:        false,
        attributionControl: false,
        dragging:           false,
        scrollWheelZoom:    false,
        doubleClickZoom:    false,
        boxZoom:            false,
        keyboard:           false,
        touchZoom:          false,
        tap:                false,
        inertia:            false
    }).setView([43.2513, -3.4607], 14);

    L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: '© Esri' }
    ).addTo(mapa);

    // Escala cartográfica discreta
    L.control.scale({ position: 'bottomleft', metric: true, imperial: false, maxWidth: 80 }).addTo(mapa);

    _mapaRuta = mapa;
    return mapa;
}


// ── Crea el control de elevación ──────────────────────
function crearElevacion(divId) {
    return L.control.elevation({
        theme:        'custom-theme',
        collapsed:    false,
        detached:     true,
        elevationDiv: divId,
        autohide:     false,
        followMarker: true,
        height:       120,
        time:         false,
        distance:     false,
        elevation:    false,
        speed:        false,
        slope:        false,
        legend:       false,
        ruler:        false,
        closeBtn:     false,
        waypoints:    false,
        wptIcons:     false,
        polyline:     false
    });
}


// ── Carga GPX, ajusta la vista y emite ruta:ready ─────
function cargarTrack(mapa, gpxFile, padValue, usarMaxBounds) {
    if (padValue === undefined)      padValue = 1;
    if (usarMaxBounds === undefined) usarMaxBounds = true;

    return new L.GPX(gpxFile, {
        async: true,
        polyline_options: {
            color:     '#f5ead8',
            weight:    4.5,
            opacity:   0.88,
            className: 'mi-track'
        },
        marker_options: {
            startIconUrl: null,
            endIconUrl:   null,
            shadowUrl:    null
        }
    }).on('loaded', function(e) {
        var bounds = e.target.getBounds();
        mapa.fitBounds(bounds, { paddingTopLeft: [0, 0], paddingBottomRight: [0, 0] });
        if (usarMaxBounds) mapa.setMaxBounds(bounds.pad(padValue));
        mapa.options.minZoom = mapa.getZoom();
        _boundsIniciales = bounds;
        _mapaListo       = true;
        mapa.fire('ruta:ready');
    }).addTo(mapa);
}


// ── Algoritmo de clustering (union-find) ──────────────
// Agrupa POIs cuya distancia en pantalla sea menor que umbralPx.
function _calcularClusters(mapa, puntos, umbralPx) {
    var n = puntos.length;
    var parent = [];
    for (var i = 0; i < n; i++) parent[i] = i;

    function find(x) {
        while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }
    function union(a, b) { parent[find(a)] = find(b); }

    var pts = puntos.map(function(p) {
        return mapa.latLngToLayerPoint(L.latLng(p.coords));
    });

    for (var i = 0; i < n; i++) {
        for (var j = i + 1; j < n; j++) {
            var dx = pts[i].x - pts[j].x;
            var dy = pts[i].y - pts[j].y;
            if (Math.sqrt(dx * dx + dy * dy) < umbralPx) union(i, j);
        }
    }

    var groups = {};
    for (var k = 0; k < n; k++) {
        var root = find(k);
        if (!groups[root]) groups[root] = [];
        groups[root].push(k);
    }

    return Object.values(groups);
}


// ── Iconos de marcador ────────────────────────────────

function crearIconoPOI(numStr) {
    return L.divIcon({
        className:     'poi-marcador',
        html:          '<div class="poi-pin">' + numStr + '</div>',
        iconSize:      [30, 30],
        iconAnchor:    [15, 15],
        tooltipAnchor: [0, -18]
    });
}

function crearIconoCluster(count) {
    return L.divIcon({
        className:  'poi-cluster',
        html:       '<div class="poi-cluster-pin">' + count + '</div>',
        iconSize:   [38, 38],
        iconAnchor: [19, 19]
    });
}

// Backward-compat: rutas antiguas sin ficha
var iconoMarker = L.divIcon({
    className:  'marker-personalizado',
    html:       '<div class="marker-pin"></div>',
    iconSize:   [20, 20],
    iconAnchor: [10, 10]
});


// ── Vuelo con compensación por mini-tarjeta ───────────
// Desplaza el centro del mapa para que el POI quede en el
// área libre, fuera de la tarjeta superpuesta.
function _volarAPunto(coords) {
    if (!_mapaRuta) return;
    var zoom = Math.max(_mapaRuta.getZoom(), 15);
    var cont = _mapaRuta.getContainer();
    var W = cont.offsetWidth;
    var H = cont.offsetHeight;
    var isMobile = window.innerWidth <= 768;

    // Posición destino del POI en píxeles dentro del contenedor
    var targetX = isMobile
        ? W / 2                     // centrado horizontalmente
        : 310 + (W - 310) / 2;     // centro del área libre (derecha de la tarjeta)
    var targetY = isMobile
        ? H * 0.36                  // tercio superior (sobre el bottom-sheet)
        : H * 0.44;                 // ligeramente sobre el centro

    // newCenter = punto proyectado + offset para llevarlo a (targetX, targetY)
    var pt = _mapaRuta.project(L.latLng(coords), zoom);
    var newCenter = _mapaRuta.unproject(
        L.point(pt.x + (W / 2 - targetX), pt.y + (H / 2 - targetY)),
        zoom
    );

    _mapaRuta.flyTo(newCenter, zoom, { animate: true, duration: 0.6 });
}


// ── Activa visualmente marcador y card de lista ────────
function _activarMarcador(idx) {
    _poiMarcadores.forEach(function(m, i) {
        if (!m) return; // POI en cluster — sin marcador individual
        var el = m.getElement();
        if (el) el.classList.toggle('poi-activo', i === idx);
    });
    _poiCardsLista.forEach(function(card, i) {
        card.classList.toggle('punto-card-activa', i === idx);
    });
}


// ── Mini tarjeta de preview ───────────────────────────

function crearTarjetaPrevia() {
    if (document.getElementById('tarjeta-previa')) return;
    var div = document.createElement('div');
    div.id = 'tarjeta-previa';
    div.innerHTML =
        '<button id="tarjeta-cerrar" aria-label="Cerrar">✕</button>' +
        '<div id="tarjeta-foto-wrap"><img id="tarjeta-foto" alt=""></div>' +
        '<div id="tarjeta-cuerpo">' +
            '<span id="tarjeta-categoria"></span>' +
            '<h3 id="tarjeta-nombre"></h3>' +
            '<p id="tarjeta-desc"></p>' +
            '<button id="tarjeta-btn">Descubrir más →</button>' +
        '</div>';
    document.body.appendChild(div);

    document.getElementById('tarjeta-cerrar').addEventListener('click', cerrarTarjetaPrevia);

    document.getElementById('tarjeta-btn').addEventListener('click', function() {
        cerrarTarjetaPrevia();
        if (_tarjetaActual && document.getElementById('ficha-overlay')) {
            abrirFichaPunto(_tarjetaActual);
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') { cerrarTarjetaPrevia(); }
    });
}

function abrirTarjetaPrevia(punto) {
    var panel = document.getElementById('tarjeta-previa');
    if (!panel) return;
    _tarjetaActual = punto;

    var cat = document.getElementById('tarjeta-categoria');
    cat.textContent = punto.categoria || '';
    cat.style.display = punto.categoria ? 'block' : 'none';

    document.getElementById('tarjeta-nombre').textContent = punto.nombre;

    var img  = document.getElementById('tarjeta-foto');
    var wrap = document.getElementById('tarjeta-foto-wrap');
    if (punto.foto) {
        img.src = punto.foto;
        img.style.display = 'block';
        wrap.style.display = 'block';
    } else {
        wrap.style.display = 'none';
    }

    var desc = document.getElementById('tarjeta-desc');
    desc.textContent = punto.descripcion || '';
    desc.style.display = punto.descripcion ? '-webkit-box' : 'none';

    var btn = document.getElementById('tarjeta-btn');
    var tieneInfo = punto.historia || punto.informacionPractica || punto.enlaceOficial || punto.streetview;
    btn.style.display = tieneInfo ? 'inline-block' : 'none';

    panel.classList.add('visible');
}

function cerrarTarjetaPrevia() {
    var panel = document.getElementById('tarjeta-previa');
    if (panel) panel.classList.remove('visible');
    _tarjetaActual = null;
    _activarMarcador(-1);
    colapsarCluster(); // re-contraer cluster expandido si lo hay
    // Restablecer vista inicial del track
    if (_mapaRuta && _boundsIniciales) {
        _mapaRuta.fitBounds(_boundsIniciales, { animate: true });
    }
}


// ── Cluster: expandir/contraer ────────────────────────
// Al pulsar el cluster se hace zoom sobre esos puntos y
// se muestran los marcadores individuales separados.

function expandirCluster(grupo, puntosInteres, clusterMarker) {
    if (!_mapaRuta) return;
    // Retirar el marcador agrupado
    _mapaRuta.removeLayer(clusterMarker);
    _clusterOriginal = { grupo: grupo, marker: clusterMarker };

    // Añadir marcadores individuales para cada POI del grupo
    _clusterExpandido = [];
    grupo.forEach(function(i) {
        var punto = puntosInteres[i];
        var num   = String(i + 1).padStart(2, '0');
        var m = L.marker(punto.coords, { icon: crearIconoPOI(num) }).addTo(_mapaRuta);
        m.bindTooltip(punto.nombre, {
            permanent:  false,
            direction:  'top',
            className:  'poi-tooltip',
            offset:     [0, -18]
        });
        (function(idx, p) {
            m.on('click', function(e) {
                L.DomEvent.stopPropagation(e);
                _activarMarcador(idx);
                _volarAPunto(p.coords);
                abrirTarjetaPrevia(p);
            });
        })(i, punto);
        _poiMarcadores[i] = m;
        _clusterExpandido.push(m);
    });

    // Ajustar la vista para que se vean todos los puntos del cluster
    var latLngs = grupo.map(function(i) {
        return L.latLng(puntosInteres[i].coords);
    });
    _mapaRuta.fitBounds(L.latLngBounds(latLngs), {
        padding:  [60, 60],
        animate:  true,
        maxZoom:  17
    });
}

function colapsarCluster() {
    if (!_clusterOriginal || !_mapaRuta) return;
    // Quitar los marcadores individuales del cluster expandido
    _clusterExpandido.forEach(function(m) { _mapaRuta.removeLayer(m); });
    _clusterOriginal.grupo.forEach(function(i) { _poiMarcadores[i] = null; });
    // Restaurar el marcador agrupado
    _clusterOriginal.marker.addTo(_mapaRuta);
    _clusterExpandido = [];
    _clusterOriginal  = null;
}


// ── Crea marcadores numerados con clustering ──────────
function crearMarcadoresConFicha(mapa, puntosInteres) {
    if (!puntosInteres || !puntosInteres.length) return;

    function _doCrear() {
        _poiMarcadores = new Array(puntosInteres.length);
        for (var x = 0; x < puntosInteres.length; x++) _poiMarcadores[x] = null;

        var grupos = _calcularClusters(mapa, puntosInteres, 34);

        grupos.forEach(function(grupo) {
            if (grupo.length === 1) {
                var i     = grupo[0];
                var punto = puntosInteres[i];
                var num   = String(i + 1).padStart(2, '0');
                var marker = L.marker(punto.coords, { icon: crearIconoPOI(num) }).addTo(mapa);

                marker.bindTooltip(punto.nombre, {
                    permanent:  false,
                    direction:  'top',
                    className:  'poi-tooltip',
                    offset:     [0, -18]
                });

                (function(idx, p) {
                    marker.on('click', function(e) {
                        L.DomEvent.stopPropagation(e);
                        _activarMarcador(idx);
                        _volarAPunto(p.coords);
                        abrirTarjetaPrevia(p);
                    });
                })(i, punto);

                _poiMarcadores[i] = marker;

            } else {
                // Cluster: centroide de posiciones en capa
                var layerPts = grupo.map(function(i) {
                    return mapa.latLngToLayerPoint(L.latLng(puntosInteres[i].coords));
                });
                var cx = layerPts.reduce(function(s, p) { return s + p.x; }, 0) / layerPts.length;
                var cy = layerPts.reduce(function(s, p) { return s + p.y; }, 0) / layerPts.length;
                var center = mapa.layerPointToLatLng(L.point(cx, cy));

                var clusterMarker = L.marker(center, { icon: crearIconoCluster(grupo.length) }).addTo(mapa);

                (function(grp, cm) {
                    cm.on('click', function(e) {
                        L.DomEvent.stopPropagation(e);
                        expandirCluster(grp, puntosInteres, cm);
                    });
                })(grupo, clusterMarker);
            }
        });

        // Cerrar tarjeta al pulsar en el fondo del mapa
        mapa.on('click', function() {
            cerrarTarjetaPrevia();
        });
    }

    if (_mapaListo) {
        _doCrear();
    } else {
        mapa.once('ruta:ready', _doCrear);
    }
}


// ── Lightbox estándar (backward-compat) ───────────────

function crearLightbox() {
    var lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML =
        '<div id="lightbox-contenido">' +
            '<span id="lightbox-cerrar">✕</span>' +
            '<img id="lightbox-img">' +
            '<p id="lightbox-titulo"></p>' +
        '</div>';
    document.body.appendChild(lightbox);
    document.getElementById('lightbox-cerrar').addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
}

function crearLightboxConStreetView() {
    var lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML =
        '<div id="lightbox-contenido">' +
            '<span id="lightbox-cerrar">✕</span>' +
            '<img id="lightbox-img">' +
            '<iframe id="lightbox-iframe" style="display:none;width:100%;height:300px;border:0;" allowfullscreen="" loading="lazy"></iframe>' +
            '<p id="lightbox-titulo"></p>' +
        '</div>';
    document.body.appendChild(lightbox);
    document.getElementById('lightbox-cerrar').addEventListener('click', function() {
        lightbox.style.display = 'none';
        document.getElementById('lightbox-iframe').src = '';
    });
}

function crearMarcadores(mapa, puntosInteres) {
    puntosInteres.forEach(function(punto) {
        var marker = L.marker(punto.coords, { icon: iconoMarker }).addTo(mapa);
        marker.on('mouseover', function() {
            var c = '<b>' + punto.nombre + '</b>';
            if (punto.foto) c += '<br><img src="' + punto.foto + '" style="width:150px;margin-top:5px;border-radius:4px;">';
            this.bindPopup(c, { closeButton: false, maxWidth: 200, autoPan: false }).openPopup();
        });
        marker.on('mouseout',  function() { this.closePopup(); });
        marker.on('click', function() {
            document.getElementById('lightbox-img').src = punto.foto;
            document.getElementById('lightbox-titulo').textContent = punto.nombre;
            document.getElementById('lightbox').style.display = 'flex';
        });
    });
}

function crearMarcadoresConStreetView(mapa, puntosInteres) {
    puntosInteres.forEach(function(punto) {
        var marker = L.marker(punto.coords, { icon: iconoMarker }).addTo(mapa);
        marker.on('mouseover', function() {
            var c = '<b>' + punto.nombre + '</b>';
            if (punto.foto) c += '<br><img src="' + punto.foto + '" style="width:150px;margin-top:5px;border-radius:4px;">';
            this.bindPopup(c, { closeButton: false, maxWidth: 200, autoPan: false }).openPopup();
        });
        marker.on('mouseout',  function() { this.closePopup(); });
        marker.on('click', function() {
            var iframe = document.getElementById('lightbox-iframe');
            var img    = document.getElementById('lightbox-img');
            if (punto.streetview) {
                iframe.src = punto.streetview; iframe.style.display = 'block'; img.style.display = 'none';
            } else if (punto.foto) {
                img.src = punto.foto; img.style.display = 'block'; iframe.style.display = 'none'; iframe.src = '';
            }
            document.getElementById('lightbox-titulo').textContent = punto.nombre;
            document.getElementById('lightbox').style.display = 'flex';
        });
    });
}

function abrirLightboxFoto(foto, nombre) {
    var img    = document.getElementById('lightbox-img');
    var iframe = document.getElementById('lightbox-iframe');
    var titulo = document.getElementById('lightbox-titulo');
    if (img)    { img.src = foto; img.style.display = 'block'; }
    if (iframe) { iframe.style.display = 'none'; iframe.src = ''; }
    if (titulo)   titulo.textContent = nombre;
    document.getElementById('lightbox').style.display = 'flex';
}

function abrirLightboxSV(foto, nombre, svUrl) {
    var img    = document.getElementById('lightbox-img');
    var iframe = document.getElementById('lightbox-iframe');
    var titulo = document.getElementById('lightbox-titulo');
    if (svUrl) {
        if (iframe) { iframe.src = svUrl; iframe.style.display = 'block'; }
        if (img)    img.style.display = 'none';
    } else if (foto) {
        if (img)    { img.src = foto; img.style.display = 'block'; }
        if (iframe) { iframe.style.display = 'none'; iframe.src = ''; }
    }
    if (titulo) titulo.textContent = nombre;
    document.getElementById('lightbox').style.display = 'flex';
}


// ── Renderiza tarjetas de puntos de interés ───────────
// Conectada bidireccionalmente con el mapa.
function renderizarPuntosInteres(puntos) {
    var grid    = document.querySelector('.ruta-puntos-grid');
    var seccion = document.querySelector('.ruta-puntos');
    if (!grid) return;
    if (!puntos || puntos.length === 0) {
        if (seccion) seccion.style.display = 'none';
        return;
    }
    _poiCardsLista = [];

    puntos.forEach(function(p, i) {
        var num = String(i + 1).padStart(2, '0');
        var fotoHTML = p.foto
            ? '<img src="' + p.foto + '" alt="' + p.nombre + '" loading="lazy">'
            : '<span class="punto-card-foto-placeholder">' + (p.streetview ? '360°' : '·') + '</span>';

        var card = document.createElement('div');
        card.className = 'punto-card';
        card.innerHTML =
            '<div class="punto-card-foto">' + fotoHTML + '</div>' +
            '<div class="punto-card-cuerpo">' +
                '<span class="punto-num">' + num + '</span>' +
                '<span class="punto-nombre">' + p.nombre + '</span>' +
                (p.descripcion ? '<span class="punto-desc">' + p.descripcion + '</span>' : '') +
            '</div>';

        if (p.foto || p.streetview || p.descripcion) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                _activarMarcador(i);
                if (_mapaRuta && _mapaListo && p.coords) {
                    _volarAPunto(p.coords);
                    var mapaEl = document.getElementById('mapa-detalle');
                    if (mapaEl) mapaEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                if (document.getElementById('tarjeta-previa')) {
                    abrirTarjetaPrevia(p);
                } else if (document.getElementById('ficha-overlay')) {
                    abrirFichaPunto(p);
                } else if (p.streetview) {
                    abrirLightboxSV(p.foto, p.nombre, p.streetview);
                } else if (p.foto) {
                    abrirLightboxFoto(p.foto, p.nombre);
                }
            });
        }

        _poiCardsLista.push(card);
        grid.appendChild(card);
    });
}


// ── Ficha completa de punto de interés ───────────────

function crearFichaPunto() {
    crearTarjetaPrevia();

    var overlay = document.createElement('div');
    overlay.id = 'ficha-overlay';
    overlay.innerHTML =
        '<div id="ficha-panel">' +
            '<div id="ficha-topbar"><button id="ficha-cerrar">✕</button></div>' +
            '<div id="ficha-media">' +
                '<img id="ficha-foto" alt="">' +
                '<iframe id="ficha-sv" allowfullscreen="" loading="lazy"></iframe>' +
            '</div>' +
            '<div id="ficha-cuerpo">' +
                '<span id="ficha-categoria"></span>' +
                '<h2 id="ficha-nombre"></h2>' +
                '<p id="ficha-descripcion"></p>' +
                '<div id="ficha-sec-historia" class="ficha-seccion">' +
                    '<span class="ficha-seccion-titulo">Historia</span>' +
                    '<p id="ficha-historia"></p>' +
                '</div>' +
                '<div id="ficha-sec-info" class="ficha-seccion">' +
                    '<span class="ficha-seccion-titulo">Información práctica</span>' +
                    '<p id="ficha-info"></p>' +
                '</div>' +
                '<a id="ficha-enlace" href="#" target="_blank" rel="noopener">Más información →</a>' +
            '</div>' +
        '</div>';
    document.body.appendChild(overlay);

    document.getElementById('ficha-cerrar').addEventListener('click', cerrarFichaPunto);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) cerrarFichaPunto();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') cerrarFichaPunto();
    });
}

function cerrarFichaPunto() {
    var overlay = document.getElementById('ficha-overlay');
    if (overlay) overlay.classList.remove('abierta');
    var sv = document.getElementById('ficha-sv');
    if (sv) { sv.src = ''; sv.style.display = 'none'; }
}

function abrirFichaPunto(punto) {
    var overlay = document.getElementById('ficha-overlay');
    if (!overlay) return;

    var cat = document.getElementById('ficha-categoria');
    cat.textContent = punto.categoria || '';
    cat.style.display = punto.categoria ? 'block' : 'none';

    document.getElementById('ficha-nombre').textContent = punto.nombre;

    var foto  = document.getElementById('ficha-foto');
    var sv    = document.getElementById('ficha-sv');
    var media = document.getElementById('ficha-media');
    foto.style.display = 'none';
    sv.style.display   = 'none';
    sv.src = '';
    if (punto.streetview) {
        sv.src = punto.streetview; sv.style.display = 'block'; media.style.display = 'block';
    } else if (punto.foto) {
        foto.src = punto.foto; foto.style.display = 'block'; media.style.display = 'block';
    } else {
        media.style.display = 'none';
    }

    var desc = document.getElementById('ficha-descripcion');
    desc.textContent = punto.descripcion || '';
    desc.style.display = punto.descripcion ? 'block' : 'none';

    var secHist = document.getElementById('ficha-sec-historia');
    document.getElementById('ficha-historia').textContent = punto.historia || '';
    secHist.style.display = punto.historia ? 'block' : 'none';

    var secInfo = document.getElementById('ficha-sec-info');
    document.getElementById('ficha-info').textContent = punto.informacionPractica || '';
    secInfo.style.display = punto.informacionPractica ? 'block' : 'none';

    var enlace = document.getElementById('ficha-enlace');
    if (punto.enlaceOficial) {
        enlace.href = punto.enlaceOficial;
        enlace.style.display = 'inline-flex';
    } else {
        enlace.style.display = 'none';
    }

    overlay.classList.add('abierta');
    document.getElementById('ficha-panel').scrollTop = 0;
}


// ── Tabs del entorno ──────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.ruta-entorno-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            var section = this.closest('.ruta-entorno');
            section.querySelectorAll('.ruta-entorno-tab').forEach(function (t) { t.classList.remove('activa'); });
            section.querySelectorAll('.ruta-entorno-panel').forEach(function (p) { p.classList.remove('activo'); });
            this.classList.add('activa');
            var panel = section.querySelector('#panel-' + this.dataset.panel);
            if (panel) panel.classList.add('activo');
        });
    });

    document.querySelectorAll('.ruta-entorno-especie').forEach(function (card) {
        card.addEventListener('click', function () {
            this.classList.toggle('girada');
        });
    });
});
