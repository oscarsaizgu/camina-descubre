// ====================================================
// FUNCIONES COMPARTIDAS PARA TODAS LAS RUTAS
// Edita aquí para cambiar algo en todas las rutas a la vez
// ====================================================


// Inicializa el mapa con la capa base satélite
function inicializarMapaRuta() {
    var mapa = L.map('mapa-detalle', {
        zoomControl: false,
        attributionControl: false,
        edgeScale: false
    }).setView([43.2513, -3.4607], 14);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
    }).addTo(mapa);

    return mapa;
}


// Crea el control de elevación con la configuración estándar
// Para cambiar la altura del gráfico, edita 'height' aquí
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


// Carga el track GPX y ajusta el mapa a sus límites
// padValue controla el margen alrededor de la ruta (0.1 = ajustado, 1 = más holgado)
// usarMaxBounds impide que el usuario se aleje demasiado del track (true por defecto)
function cargarTrack(mapa, gpxFile, padValue, usarMaxBounds) {
    if (padValue === undefined) padValue = 1;
    if (usarMaxBounds === undefined) usarMaxBounds = true;

    return new L.GPX(gpxFile, {
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
        if (usarMaxBounds) mapa.setMaxBounds(bounds.pad(padValue));
        mapa.options.minZoom = mapa.getZoom();
    }).addTo(mapa);
}


// Icono personalizado para los marcadores de puntos de interés
var iconoMarker = L.divIcon({
    className: 'marker-personalizado',
    html: '<div class="marker-pin"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});


// Crea el lightbox estándar (solo imágenes)
// Usado en: coto, cubillas, vega, pondra, guardamino
function crearLightbox() {
    var lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = '<div id="lightbox-contenido"><span id="lightbox-cerrar">✕</span><img id="lightbox-img"><p id="lightbox-titulo"></p></div>';
    document.body.appendChild(lightbox);

    document.getElementById('lightbox-cerrar').addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
}


// Crea el lightbox extendido (imágenes + Street View)
// Usado en: cuevas
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


// Crea los marcadores en el mapa para cada punto de interés (solo fotos)
// Usado en: coto, cubillas, vega, pondra, guardamino
function crearMarcadores(mapa, puntosInteres) {
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
            document.getElementById('lightbox-img').src = punto.foto;
            document.getElementById('lightbox-titulo').textContent = punto.nombre;
            document.getElementById('lightbox').style.display = 'flex';
        });
    });
}


// Crea los marcadores con soporte para Street View además de fotos
// Usado en: cuevas (los puntos pueden tener foto o streetview)
function crearMarcadoresConStreetView(mapa, puntosInteres) {
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
}
