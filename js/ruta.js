// ============================================================
// js/ruta.js
// LÓGICA UNIVERSAL DE LAS PÁGINAS DE RUTA
// ============================================================
//
// ¿QUÉ HACE ESTE ARCHIVO?
//   Lee el parámetro "id" de la URL (por ejemplo: ruta.html?id=cuevas),
//   busca esa ruta en el objeto RUTAS (definido en js/datos-rutas.js),
//   y rellena toda la página dinámicamente: título, mapa, gráfico de
//   elevación, estadísticas, descripción, servicios, imágenes y botones.
//
// ¿CUÁNDO LO TOCO YO?
//   Casi nunca. Para cambiar contenido (textos, fotos, datos),
//   edita js/datos-rutas.js. Para cambiar el diseño visual, edita
//   css/estilos.css. Este archivo controla el COMPORTAMIENTO.
//
// ¿QUÉ NO DEBO TOCAR?
//   La lógica interna: las funciones, las llamadas a Leaflet,
//   los eventos. Si algo no funciona, revisa antes la consola
//   del navegador (F12 → Consola) para ver el error.
// ============================================================


// ── 1. LEER EL ID DE LA RUTA DESDE LA URL ─────────────────────────────
// La URL tiene el formato: ruta.html?id=cuevas
// URLSearchParams permite extraer el valor de "id" fácilmente.
var params = new URLSearchParams(window.location.search);
var rutaId = params.get('id'); // Devuelve 'cuevas', 'cubillas', etc.

// Si no hay "id" en la URL o la ruta no existe en el catálogo, mostramos un error.
var ruta = RUTAS[rutaId];
if (!ruta) {
    // Muestra un mensaje de error en la página y detiene la ejecución.
    document.getElementById('ruta-nombre').textContent = 'Ruta no encontrada';
    document.getElementById('texto-descripcion').innerHTML =
        '<p>No se ha encontrado ninguna ruta con el identificador <b>' + (rutaId || '(vacío)') + '</b>.</p>' +
        '<p><a href="index.html">← Volver al mapa</a></p>';
    throw new Error('Ruta no encontrada: ' + rutaId); // Detiene el resto del script
}


// ── 2. MARCAR EL BODY CON EL ID DE LA RUTA ────────────────────────────
// Esto permite personalizar el diseño de cada ruta desde el CSS con:
//   body[data-ruta="cuevas"] { ... }
// Ver la sección 13 de css/estilos.css para ejemplos y explicaciones.
document.body.setAttribute('data-ruta', rutaId);


// ── 3. RELLENAR EL TÍTULO Y LAS ESTADÍSTICAS BÁSICAS ─────────────────
// Actualiza el título del navegador (pestaña) y el encabezado de la página.
document.title = ruta.nombre + ' - Camina y Descubre';
document.getElementById('ruta-nombre').textContent = ruta.nombre;

// Rellena los cuatro datos del panel de estadísticas (distancia, duración, etc.)
document.getElementById('dato-distancia').textContent = ruta.distancia;
document.getElementById('dato-duracion').textContent  = ruta.duracion;
document.getElementById('dato-desnivel').textContent  = ruta.desnivel;
document.getElementById('dato-tipo').textContent      = ruta.tipo;


// ── 4. RELLENAR LA DESCRIPCIÓN ────────────────────────────────────────
// La descripción puede tener varios párrafos (array de strings en datos-rutas.js).
// Creamos un <p> por cada elemento del array.
var contenedorDesc = document.getElementById('texto-descripcion');
ruta.descripcion.forEach(function(parrafo) {
    var p = document.createElement('p'); // Crea un elemento <p>
    p.textContent = parrafo;             // Le asigna el texto
    contenedorDesc.appendChild(p);       // Lo añade al contenedor
});


// ── 5. RELLENAR LOS SERVICIOS ─────────────────────────────────────────
// Crea un bloque div.servicio por cada servicio definido en datos-rutas.js.
var contenedorServicios = document.getElementById('servicios-ruta');
ruta.servicios.forEach(function(servicio) {
    // Crea el div contenedor del servicio
    var div = document.createElement('div');
    div.className = 'servicio'; // La clase CSS que le da el estilo de cuadrícula

    // Crea la imagen del icono
    var img = document.createElement('img');
    img.src = servicio.icono;  // Ruta al archivo PNG del icono
    img.alt = servicio.texto;  // Texto alternativo para accesibilidad

    // Crea el texto del servicio
    var span = document.createElement('span');
    span.textContent = servicio.texto;

    // Monta el servicio y lo añade a la sección
    div.appendChild(img);
    div.appendChild(span);
    contenedorServicios.appendChild(div);
});


// ── 6. RELLENAR LAS IMÁGENES DECORATIVAS (PINTURAS) ──────────────────
// Inserta las imágenes de ilustración/pintura definidas en datos-rutas.js.
// Si la imagen tiene un "style" definido, se lo aplica directamente.
// Si el "style" está vacío, el CSS de estilos.css controla su posición.
var contenedorPinturas = document.getElementById('pinturas');
ruta.pinturas.forEach(function(pintura) {
    var img = document.createElement('img');
    img.src = pintura.src;   // Ruta al archivo de la imagen
    img.alt = pintura.alt;   // Texto alternativo
    if (pintura.style) {
        // Si hay estilos inline definidos en datos-rutas.js, los aplicamos.
        // Esto permite posicionamientos especiales (como en vega o dama).
        img.style.cssText = pintura.style;
    }
    contenedorPinturas.appendChild(img);
});


// ── 7. CONFIGURAR EL BOTÓN "SEGUIR RUTA" ─────────────────────────────
// El botón enlaza a seguir.html pasando el id de la ruta como parámetro.
// seguir.js leerá ese parámetro para cargar el GPX correcto.
document.getElementById('btn-seguir-ruta').href = 'seguir.html?ruta=' + rutaId;


// ── 8. INICIALIZAR EL MAPA ────────────────────────────────────────────
// Crea el mapa Leaflet en el div#mapa-detalle.
// Se usa capa de satélite de Esri, igual que en la pantalla "seguir ruta".
var mapa = L.map('mapa-detalle', {
    zoomControl: false,       // Ocultamos los botones +/- por diseño
    attributionControl: false // Ocultamos la atribución del mapa
}).setView([43.2513, -3.4607], 14); // Vista inicial centrada en Ramales

// Capa de imágenes satélite de Esri (se verán los caminos desde el aire)
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri'
}).addTo(mapa);


// ── 9. PUNTOS DE INTERÉS (marcadores en el mapa) ──────────────────────
// Creamos el lightbox (ventana emergente de foto) una sola vez para toda la página.
// El lightbox es un div que se muestra/oculta según el marcador en el que se pulse.
var lightbox = document.createElement('div');
lightbox.id = 'lightbox';
// El lightbox puede mostrar: una imagen, un iframe de Street View, o ambos.
// El botón #lightbox-toggle permite cambiar entre foto y Street View si existen los dos.
lightbox.innerHTML =
    '<div id="lightbox-contenido">' +
        '<span id="lightbox-cerrar">✕</span>' +
        '<img id="lightbox-img" src="" alt="">' +
        '<iframe id="lightbox-sv" src="" frameborder="0" allowfullscreen style="display:none;width:100%;height:300px;border-radius:8px;"></iframe>' +
        '<div id="lightbox-botones" style="display:none;margin-top:0.5rem;text-align:center;">' +
            '<button id="lightbox-toggle-foto" onclick="lightboxMostrarFoto()">📷 Foto</button>' +
            '<button id="lightbox-toggle-sv"   onclick="lightboxMostrarSV()">📍 Street View</button>' +
        '</div>' +
        '<p id="lightbox-titulo"></p>' +
    '</div>';
document.body.appendChild(lightbox);

// Cierra el lightbox al pulsar la X
document.getElementById('lightbox-cerrar').addEventListener('click', function() {
    lightbox.style.display = 'none';
    // Cuando se cierra, limpiamos el src del iframe para detener el video/mapa
    document.getElementById('lightbox-sv').src = '';
});

// Variables para guardar las URLs del punto actual (foto y Street View)
var lightboxFotoActual = null;
var lightboxSVActual   = null;

// Muestra la foto en el lightbox (oculta el iframe de Street View)
function lightboxMostrarFoto() {
    document.getElementById('lightbox-img').style.display = 'block';
    document.getElementById('lightbox-sv').style.display  = 'none';
}

// Muestra el Street View en el lightbox (oculta la foto)
function lightboxMostrarSV() {
    var iframe = document.getElementById('lightbox-sv');
    iframe.src = lightboxSVActual; // Carga el iframe solo cuando se pide (ahorra datos)
    iframe.style.display = 'block';
    document.getElementById('lightbox-img').style.display = 'none';
}

// Icono personalizado para los marcadores de puntos de interés
var iconoMarker = L.divIcon({
    className: 'marker-personalizado', // La clase CSS que da la forma de chincheta
    html: '<div class="marker-pin"></div>',
    iconSize:   [20, 20],
    iconAnchor: [10, 10]
});

// Crea un marcador en el mapa por cada punto de interés
ruta.puntosInteres.forEach(function(punto) {
    var marker = L.marker(punto.coords, { icon: iconoMarker }).addTo(mapa);

    // Al pasar el ratón por encima: popup pequeño con miniatura de la foto
    marker.on('mouseover', function() {
        var contenidoPopup = '<b>' + punto.nombre + '</b>';
        if (punto.foto) {
            // Si hay foto, la muestra como miniatura en el popup
            contenidoPopup += '<br><img src="' + punto.foto + '" style="width:150px;margin-top:5px;border-radius:4px;">';
        }
        this.bindPopup(contenidoPopup, { closeButton: false, maxWidth: 200 }).openPopup();
    });

    // Al salir del ratón: cierra el popup automáticamente
    marker.on('mouseout', function() {
        this.closePopup();
    });

    // Al hacer clic: abre el lightbox grande
    marker.on('click', function() {
        var img    = document.getElementById('lightbox-img');
        var iframe = document.getElementById('lightbox-sv');
        var titulo = document.getElementById('lightbox-titulo');
        var bots   = document.getElementById('lightbox-botones');

        titulo.textContent = punto.nombre;

        // Guarda las URLs para que los botones foto/SV funcionen
        lightboxFotoActual = punto.foto;
        lightboxSVActual   = punto.streetview;

        // Resetea el iframe (para que no quede cargado el SV anterior)
        iframe.src = '';
        iframe.style.display = 'none';

        if (punto.foto) {
            img.src = punto.foto;
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
        }

        // Muestra los botones de cambio solo si hay tanto foto como Street View
        if (punto.foto && punto.streetview) {
            bots.style.display = 'block';
        } else if (punto.streetview && !punto.foto) {
            // Solo Street View: lo muestra directamente
            bots.style.display = 'none';
            lightboxMostrarSV();
        } else {
            bots.style.display = 'none';
        }

        lightbox.style.display = 'flex'; // Muestra el lightbox
    });
});


// ── 10. CARGAR EL GRÁFICO DE ELEVACIÓN Y EL TRACK GPX ────────────────
// Configuración común para todos los gráficos de elevación.
// Los valores numéricos (height, etc.) se pueden ajustar en estilos.css.
function crearControlElevacion(divId) {
    return L.control.elevation({
        theme: 'custom-theme',      // Clase CSS para personalizar colores del gráfico
        collapsed: false,           // Muestra el gráfico expandido por defecto
        detached: true,             // El gráfico se dibuja en un div externo (no dentro del mapa)
        elevationDiv: '#' + divId, // ID del div donde se dibujará el gráfico
        autohide: false,
        followMarker: true,         // El gráfico resalta la posición al mover el ratón
        height: 120,                // Altura del gráfico en píxeles
        time: false,                // No muestra el eje de tiempo
        distance: false,            // No muestra eje de distancia (solo perfil)
        elevation: false,           // No muestra eje de altitud
        speed: false,
        slope: false,
        legend: false,
        ruler: false,
        closeBtn: false,
        waypoints: false,
        wptIcons: false,
        polyline: false             // No dibuja la línea del track dentro del control de elevación
    });
}

// Función para cargar un track GPX en el mapa con el color de la ruta
function cargarTrack(gpxUrl, mapa, opacidad) {
    opacidad = opacidad !== undefined ? opacidad : 0.9; // Por defecto: bien visible
    return new L.GPX(gpxUrl, {
        async: true,
        polyline_options: {
            color: '#fce8c6',     // Color beige claro para que resalte sobre el satélite
            weight: 4,            // Grosor de la línea en píxeles
            opacity: opacidad,
            className: 'mi-track' // Clase CSS para personalización adicional
        },
        marker_options: {
            startIconUrl: null,   // Sin icono de inicio
            endIconUrl:   null,   // Sin icono de fin
            shadowUrl:    null    // Sin sombra
        }
    });
}


// ── 10a. RUTA CON VARIANTES (solo Guardamino por ahora) ───────────────
if (ruta.variantes) {
    // Esta ruta tiene dos o más recorridos alternativos.
    // Mostramos un selector de botones y cargamos ambos tracks en el mapa.

    var selectorDiv = document.getElementById('selector-variante');
    selectorDiv.style.display = ''; // Hace visible el selector

    // Genera un botón por cada variante definida en datos-rutas.js
    Object.keys(ruta.variantes).forEach(function(clave, indice) {
        var variante = ruta.variantes[clave];
        var btn = document.createElement('button');
        btn.id = 'btn-variante-' + clave;       // Ej: btn-variante-a
        btn.textContent = variante.etiqueta;     // Texto del botón
        if (indice === 0) btn.className = 'variante-activa'; // Primera variante activa por defecto
        btn.setAttribute('onclick', 'activarVariante("' + clave + '")');
        selectorDiv.appendChild(btn);
    });

    // Capas GPX de cada variante (se guardan para poder mostrar/ocultar)
    var capasVariantes = {};

    // Controles de elevación de cada variante
    var elevacionA = crearControlElevacion('grafico-elevacion');
    elevacionA.addTo(mapa);
    var elevacionB = crearControlElevacion('grafico-elevacion-b');
    elevacionB.addTo(mapa);

    var clavesVariantes = Object.keys(ruta.variantes);

    clavesVariantes.forEach(function(clave, indice) {
        var variante = ruta.variantes[clave];

        // Carga el gráfico de elevación de esta variante
        var elev = (clave === clavesVariantes[0]) ? elevacionA : elevacionB;
        elev.load(variante.gpx);

        // Carga el track en el mapa (la primera variante a plena opacidad, la otra más tenue)
        var opacidad = (indice === 0) ? 0.9 : 0.35;
        var capa = cargarTrack(variante.gpx, mapa, opacidad).addTo(mapa);
        capasVariantes[clave] = capa;

        // Cuando carga la primera variante, ajusta el mapa a sus límites
        if (indice === 0) {
            capa.on('loaded', function(e) {
                mapa.fitBounds(e.target.getBounds());
            });
        }
    });

    // Función que activa una variante: resalta su track, muestra sus estadísticas
    // y actualiza el gráfico de elevación.
    // Se llama desde los botones del selector-variante en el HTML.
    window.activarVariante = function(clave) {
        var variante = ruta.variantes[clave];
        if (!variante) return;

        // Actualiza las estadísticas del panel
        document.getElementById('dato-distancia').textContent = variante.distancia;
        document.getElementById('dato-duracion').textContent  = variante.duracion;
        document.getElementById('dato-desnivel').textContent  = variante.desnivel;
        document.getElementById('dato-tipo').textContent      = variante.tipo;

        // Actualiza el texto de descripción
        var desc = document.getElementById('texto-descripcion');
        desc.innerHTML = '<p>' + variante.descripcion + '</p>';

        // Resalta el track activo y atenúa el otro
        Object.keys(capasVariantes).forEach(function(k) {
            capasVariantes[k].eachLayer(function(layer) {
                if (layer.setStyle) {
                    layer.setStyle({ opacity: (k === clave) ? 0.9 : 0.35 });
                }
            });
        });

        // Muestra el gráfico de elevación correcto
        clavesVariantes.forEach(function(k, indice) {
            var divId = (indice === 0) ? 'grafico-elevacion' : 'grafico-elevacion-b';
            document.getElementById(divId).style.display = (k === clave) ? '' : 'none';
        });

        // Marca el botón activo con la clase CSS "variante-activa"
        clavesVariantes.forEach(function(k) {
            var btn = document.getElementById('btn-variante-' + k);
            if (btn) btn.className = (k === clave) ? 'variante-activa' : '';
        });
    };

// ── 10b. RUTA SIMPLE (sin variantes) ──────────────────────────────────
} else {
    // La mayoría de las rutas: un solo track y un solo gráfico de elevación.

    // Inicializa el control de elevación y lo adjunta al div del HTML
    var elevacion = crearControlElevacion('grafico-elevacion');
    elevacion.addTo(mapa);
    elevacion.load(ruta.gpx); // Carga el GPX para dibujar el perfil

    // Carga el track en el mapa y ajusta la vista a los límites del recorrido
    cargarTrack(ruta.gpx, mapa).on('loaded', function(e) {
        var bounds = e.target.getBounds();
        mapa.fitBounds(bounds);                          // Centra y hace zoom al track
        mapa.setMaxBounds(bounds.pad(0.1));              // Limita el desplazamiento del mapa
        mapa.options.minZoom = mapa.getZoom();           // Evita que se pueda alejar demasiado
    }).addTo(mapa);
}
