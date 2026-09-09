// ====================================================
// DATOS DE ESTA RUTA — lo único que hay que editar aquí
// Vega tiene dos variantes (A y B), por eso es algo diferente
// ====================================================

var GPX_A = 'data/vega.gpx';
var GPX_B = 'data/vegab.gpx';

var datos = {
    a: { distancia: '7 km',     duracion: '1h 30min', desnivel: '58m', tipo: 'Circular' },
    b: { distancia: '7,29 km',  duracion: '1h 30min', desnivel: '80m', tipo: 'Circular' }
};

// Solo el párrafo final cambia entre variantes (el resto está en el HTML)
var descripciones = {
    a: 'Desde la Fuente Iseña, se vuelve hasta el área recreativa de Iseña y se sigue por la carretera hasta el Mazo, llegando otra vez hasta la ribera del río, y se continúa por la carretera de ida, pasando otra vez la Herrería y el Humilladero y se sigue hasta llegar al Ayuntamiento.',
    b: 'Desde la Fuente Iseña, el camino sigue hacia los valles, y después vuelve a bajar hasta la Herrería, donde encontramos otra vez el Humilladero y se sigue por la misma carretera de ida hasta el Ayuntamiento.'
};

var puntosInteres = [
    {
        coords: [43.257757822382096, -3.469872258786685],
        nombre: "Puente Romano",
        foto: "fotos/vega/puenteromano.png",
        encuadreClase: "poi-img--puenteromano",
        categoria: "Puente histórico",
        descripcion: "Puente de piedra a la salida de Ramales en dirección a Vega, conocido popularmente como el Puente Romano. Cruza el río Asón y forma parte del camino histórico que conectaba los núcleos del valle.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.25680519840663, -3.470456579361322],
        nombre: "Presa Don Cecilio",
        foto: "fotos/vega/presa.png",
        encuadreClase: "poi-img--presa",
        categoria: "Infraestructura hidráulica",
        descripcion: "Pequeña presa histórica sobre el río Asón que reguló el caudal para uso agrícola e industrial en el valle. Hoy es un punto paisajístico del recorrido, con el río formando una lámina de agua tranquila.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.255762810521176, -3.475972336495188],
        nombre: "Humilladero",
        foto: "fotos/vega/humilladero.png",
        encuadreClase: "poi-img--humilladero",
        categoria: "Patrimonio religioso",
        descripcion: "Pequeña construcción religiosa popular que marca el acceso al núcleo rural. Los humilladeros son una forma de arquitectura devocional extendida por toda la Cantabria interior, donde vecinos y caminantes hacían una parada de oración.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.260868, -3.484183],
        nombre: "Mural de mensajes de madera",
        foto: "fotos/vega/mural.png",
        encuadreClase: "poi-img--mural",
        categoria: "Arte y cultura",
        descripcion: "Panel de madera en el que vecinos y visitantes dejan mensajes escritos a mano. Un espacio de participación colectiva que refleja el vínculo de la comunidad con el entorno natural del valle del Asón.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null,
        secreto: {
            titulo: "UN PEQUEÑO SECRETO DEL CAMINO",
            texto: "Entre los cientos de mensajes que cubren el mural, encima de la madera, hay dos pequeñas casitas construidas con musgo y ramas. ¿Te has fijado bien?",
            fotos: ["fotos/vega/casagnomo1.png", "fotos/vega/casagnomo2.png"]
        }
    },
    {
        coords: [43.26165281811487, -3.4842905538024946],
        nombre: "Parque de Vegacorredor",
        foto: "fotos/vega/parquevega.png",
        encuadreClase: "poi-img--parquevega",
        categoria: "Espacio recreativo",
        descripcion: "Área recreativa junto al cauce del Asón en el barrio de Vega, con zonas de sombra, merenderos y acceso al río. Un punto de descanso habitual para familias y senderistas que recorren el tramo bajo del valle.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.263521, -3.484525],
        nombre: "Parque infantil",
        foto: "fotos/vega/parqueinfantil.png",
        encuadreClase: "poi-img--parqueinfantil",
        categoria: "Espacio recreativo",
        descripcion: "Zona de juegos infantiles en el barrio de Vega, junto al río Asón. Un punto de parada ideal para las familias que realizan la ruta, con equipamiento lúdico y espacios al aire libre.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.25408574766927, -3.48623600049769],
        nombre: "Fuente Iseña",
        foto: "fotos/vega/fuenteisena.png",
        encuadreClase: "poi-img--fuenteisena",
        categoria: "Fuente",
        descripcion: "Fuente de agua en el entorno del barrio de Vega. Las fuentes de manantial son habituales a lo largo de la ruta, aprovechando la abundante red hídrica subterránea que alimenta el karst del Asón.",
        historia: null,
        informacionPractica: "Agua potable.",
        enlaceOficial: null
    }
];

// ====================================================
// A partir de aquí no hay que tocar nada
// ====================================================

var mapa = inicializarMapaRuta();

// Elevación variante A
var elevacionA = crearElevacion('#grafico-elevacion');
elevacionA.addTo(mapa);
elevacionA.load(GPX_A);

// Elevación variante B
var elevacionB = crearElevacion('#grafico-elevacion-b');
elevacionB.addTo(mapa);
elevacionB.load(GPX_B);

var trackA, trackB;

function activarVariante(v) {
    document.getElementById('grafico-elevacion').style.display   = v === 'a' ? 'block' : 'none';
    document.getElementById('grafico-elevacion-b').style.display = v === 'b' ? 'block' : 'none';

    document.getElementById('dato-distancia').textContent = datos[v].distancia;
    document.getElementById('dato-duracion').textContent  = datos[v].duracion;
    document.getElementById('dato-desnivel').textContent  = datos[v].desnivel;
    document.getElementById('dato-tipo').textContent      = datos[v].tipo;

    document.getElementById('texto-descripcion').textContent = descripciones[v];

    document.getElementById('btn-variante-a').classList.toggle('variante-activa', v === 'a');
    document.getElementById('btn-variante-b').classList.toggle('variante-activa', v === 'b');

    if (trackA) trackA.setStyle({ dashArray: null, weight: v === 'a' ? 4 : 2, opacity: v === 'a' ? 0.88 : 0.22 });
    if (trackB) trackB.setStyle({ dashArray: null, weight: v === 'b' ? 4 : 2, opacity: v === 'b' ? 0.88 : 0.22 });
}

trackA = new L.GPX(GPX_A, {
    async: true,
    polyline_options: { color: '#fce8c6', weight: 4, opacity: 0.9, className: 'mi-track' },
    marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null }
}).on('loaded', function(e) {
    var bounds = e.target.getBounds();
    _boundsIniciales = bounds;
    mapa.fitBounds(bounds);
    mapa.setMaxBounds(bounds.pad(0.1));
    mapa.once('moveend', function() {
        mapa.options.minZoom = mapa.getZoom();
        _mapaListo = true;
        mapa.fire('ruta:ready');
    });
    e.target.on('click', function() { activarVariante('a'); });
    e.target.eachLayer(function(layer) { layer.on('click', function() { activarVariante('a'); }); });
}).addTo(mapa);

trackB = new L.GPX(GPX_B, {
    async: true,
    polyline_options: { color: '#fce8c6', weight: 6, opacity: 0.22, className: 'mi-track' },
    marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null }
}).on('loaded', function(e) {
    e.target.on('click', function() { activarVariante('b'); });
    e.target.eachLayer(function(layer) { layer.on('click', function() { activarVariante('b'); }); });
}).addTo(mapa);

crearFichaPunto();
crearMarcadoresConFicha(mapa, puntosInteres);
renderizarPuntosInteres(puntosInteres);

// Activar variante A por defecto
activarVariante('a');
