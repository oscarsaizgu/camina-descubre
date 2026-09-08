// ====================================================
// FUNCIONES COMPARTIDAS PARA TODAS LAS RUTAS
// Edita aquí para cambiar algo en todas las rutas a la vez
// ====================================================


// ── Estado global compartido ──────────────────────────
var _mapaRuta         = null;   // referencia al mapa activo
var _poiMarcadores    = [];     // L.Marker[] en orden de puntosInteres
var _poiCardsLista    = [];     // elementos DOM de .punto-card en orden
var _tarjetaActual    = null;   // punto abierto en la mini-tarjeta


// ── Inicializa el mapa con la capa base satélite ──────
function inicializarMapaRuta() {
    var mapa = L.map('mapa-detalle', {
        zoomControl: false,
        attributionControl: false,
        edgeScale: false
    }).setView([43.2513, -3.4607], 14);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
    }).addTo(mapa);

    // Escala cartográfica discreta
    L.control.scale({ position: 'bottomleft', metric: true, imperial: false, maxWidth: 80 }).addTo(mapa);

    _mapaRuta = mapa;
    return mapa;
}


// ── Crea el control de elevación ──────────────────────
function crearElevacion(divId) {
    return L.control.elevation({
        theme: "custom-theme",
        collapsed: false,
        detached: true,
        elevationDiv: divId,
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
}


// ── Carga el track GPX y ajusta el mapa a sus límites ─
function cargarTrack(mapa, gpxFile, padValue, usarMaxBounds) {
    if (padValue === undefined) padValue = 1;
    if (usarMaxBounds === undefined) usarMaxBounds = true;

    return new L.GPX(gpxFile, {
        async: true,
        polyline_options: {
            color: '#f5ead8',
            weight: 4.5,
            opacity: 0.88,
            className: 'mi-track'
        },
        marker_options: {
            startIconUrl: null,
            endIconUrl: null,
            shadowUrl: null
        }
    }).on('loaded', function(e) {
        var bounds = e.target.getBounds();
        mapa.fitBounds(bounds, { paddingTopLeft: [0, 0], paddingBottomRight: [0, 0] });
        if (usarMaxBounds) mapa.setMaxBounds(bounds.pad(padValue));
        mapa.options.minZoom = mapa.getZoom();
    }).addTo(mapa);
}


// ── Icono numerado para puntos de interés ─────────────
function crearIconoPOI(numStr) {
    return L.divIcon({
        className: 'poi-marcador',
        html: '<div class="poi-pin">' + numStr + '</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        tooltipAnchor: [0, -18]
    });
}

// Icono antiguo (backward-compat con rutas que no usan ficha)
var iconoMarker = L.divIcon({
    className: 'marker-personalizado',
    html: '<div class="marker-pin"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});


// ── Activa visualmente un marcador (y la card de lista) ──
function _activarMarcador(idx) {
    _poiMarcadores.forEach(function(m, i) {
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

    // Cierra con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') cerrarTarjetaPrevia();
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

    // Mostrar/ocultar botón según si hay ficha completa
    var btn = document.getElementById('tarjeta-btn');
    var tieneInfo = punto.historia || punto.informacionPractica || punto.enlaceOficial || punto.streetview;
    btn.style.display = tieneInfo ? 'inline-block' : 'none';

    panel.classList.add('visible');
}

function cerrarTarjetaPrevia() {
    var panel = document.getElementById('tarjeta-previa');
    if (panel) panel.classList.remove('visible');
    _tarjetaActual = null;
    _activarMarcador(-1);  // desactiva todos
}


// ── Crea marcadores numerados + abre mini-tarjeta ─────
function crearMarcadoresConFicha(mapa, puntosInteres) {
    _poiMarcadores = [];
    puntosInteres.forEach(function(punto, i) {
        var num    = String(i + 1).padStart(2, '0');
        var marker = L.marker(punto.coords, { icon: crearIconoPOI(num) }).addTo(mapa);

        // Tooltip discreto con el nombre
        marker.bindTooltip(punto.nombre, {
            permanent: false,
            direction: 'top',
            className: 'poi-tooltip',
            offset: [0, -18]
        });

        marker.on('click', function() {
            _activarMarcador(i);
            mapa.flyTo(punto.coords, Math.max(mapa.getZoom(), 15), {
                animate: true,
                duration: 0.5
            });
            abrirTarjetaPrevia(punto);
        });

        _poiMarcadores.push(marker);
    });
}


// ── Lightbox estándar (backward-compat) ───────────────
function crearLightbox() {
    var lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = '<div id="lightbox-contenido"><span id="lightbox-cerrar">✕</span><img id="lightbox-img"><p id="lightbox-titulo"></p></div>';
    document.body.appendChild(lightbox);
    document.getElementById('lightbox-cerrar').addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
}

function crearLightboxConStreetView() {
    var lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = '<div id="lightbox-contenido"><span id="lightbox-cerrar">✕</span><img id="lightbox-img"><iframe id="lightbox-iframe" style="display:none;width:100%;height:300px;border:0;" allowfullscreen="" loading="lazy"></iframe><p id="lightbox-titulo"></p></div>';
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
            var contenido = '<b>' + punto.nombre + '</b>';
            if (punto.foto) contenido += '<br><img src="' + punto.foto + '" style="width:150px; margin-top:5px; border-radius:4px;">';
            this.bindPopup(contenido, { closeButton: false, maxWidth: 200, autoPan: false }).openPopup();
        });
        marker.on('mouseout', function() { this.closePopup(); });
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
            var contenido = '<b>' + punto.nombre + '</b>';
            if (punto.foto) contenido += '<br><img src="' + punto.foto + '" style="width:150px; margin-top:5px; border-radius:4px;">';
            this.bindPopup(contenido, { closeButton: false, maxWidth: 200, autoPan: false }).openPopup();
        });
        marker.on('mouseout', function() { this.closePopup(); });
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
    var img = document.getElementById('lightbox-img');
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
// Conectada bidireccionalmente con el mapa
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
            '</div>';

        if (p.foto || p.streetview || p.descripcion) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                // Activar marcador y centrar mapa
                _activarMarcador(i);
                if (_mapaRuta && p.coords) {
                    _mapaRuta.flyTo(p.coords, Math.max(_mapaRuta.getZoom(), 15), {
                        animate: true,
                        duration: 0.5
                    });
                    // Scroll suave hasta el mapa
                    var mapaEl = document.getElementById('mapa-detalle');
                    if (mapaEl) mapaEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                // Abrir mini tarjeta
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
    // Crea también la mini tarjeta previa
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
