// ====================================================
// DATOS DE ESTA RUTA — lo único que hay que editar aquí
// Guardamino tiene dos variantes (A y B), por eso es algo diferente
// ====================================================

var datos = {
    a: { distancia: '4,71 km', duracion: '60 min', desnivel: '146m', tipo: 'Circular' },
    b: { distancia: '3,71 km', duracion: '50 min', desnivel: '127m', tipo: 'Circular' }
};

var descripciones = {
    a: 'Comenzamos la ruta en el Ayuntamiento, nos dirigimos hacia la bolera de pasabolo "Domingo Muguira" y tomamos la calle del barrio La Casa en dirección al Bº Guardamino. Sin desviarnos de la carretera, a 2,5 km del inicio llegamos a un cruce que tomamos a la izquierda, en dirección a la ermita de Nuestra Señora de Guardamino. A 300 m de la ermita encontramos otro cruce, también a la izquierda, que nos lleva a la zona más alta de la ruta, desde donde se divisa el pueblo de Ramales y todo el macizo del Pico San Vicente y la Sierra del Hornijo. Siguiendo el camino llegamos al monumento a la batalla de Ramales, de la Primera Guerra Carlista. Desde aquí, continuamos por la carretera de la izquierda para volver, en 1 km, al punto de inicio.',
    b: 'Comenzamos la ruta en el Ayuntamiento, nos dirigimos hacia la bolera de pasabolo "Domingo Muguira" y tomamos la calle del barrio La Casa en dirección al Bº Guardamino. Antes del taller Madreselva, subimos por el monte a mano izquierda hasta llegar a la Piedra Carlista. Siguiendo el camino llegamos al monumento a la batalla de Ramales, de la Primera Guerra Carlista. Desde aquí, continuamos por la carretera de la izquierda para volver, en 1 km, al punto de inicio.'
};

var puntosInteres = [
    {
        coords: [43.26138646986801, -3.455310394447993],
        nombre: "Monumento a La Batalla de Ramales",
        foto: "fotos/guardamino/piedra.jpg",
        categoria: "Monumento histórico",
        descripcion: "Monumento que conmemora la Batalla de Ramales, librada el 5 de mayo de 1839 durante la Primera Guerra Carlista. La victoria del general Espartero sobre las fuerzas carlistas fue tan decisiva que el municipio añadió 'de la Victoria' a su nombre.",
        historia: "El 5 de mayo de 1839, las tropas liberales del general Baldomero Espartero asaltaron las posiciones carlistas en la peña de Los Cuerpos de Guardamino. La batalla fue un punto de inflexión en la Primera Guerra Carlista, y el municipio fue rebautizado como 'Ramales de la Victoria' en honor al triunfo. La Piedra Carlista, una roca natural que servía de parapeto defensivo, es el principal vestigio material de la batalla.",
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.2620532187991, -3.4450485940378512],
        nombre: "Iglesia de Nuestra Señora, Parroquia de San Pedro",
        foto: "fotos/guardamino/iglesia.jpg",
        categoria: "Patrimonio religioso",
        descripcion: "Iglesia parroquial de Ramales de la Victoria, dedicada a San Pedro. Elemento central del núcleo histórico del municipio, con una arquitectura que refleja las distintas etapas constructivas de la arquitectura religiosa cantábrica.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.256952100060936, -3.4629698197607337],
        nombre: "Bolera Domingo Muguira",
        foto: "fotos/guardamino/bolera.jpg",
        categoria: "Deporte tradicional",
        descripcion: "Bolera de pasabolo, el deporte autóctono de la comarca del Asón. En el pasabolo se lanzan bolas de piedra o madera contra unos bolos alineados en un tablón o una losa. La bolera está dedicada a Domingo Muguira, figura del pasabolo ramaliego.",
        historia: "El pasabolo es el deporte tradicional por excelencia del valle del Asón. Su práctica se remonta a siglos atrás como forma de ocio y competición entre vecinos, y sigue siendo un referente de identidad cultural en la comarca. Existen dos modalidades principales: pasabolo tablón y pasabolo losa.",
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.25867491569154, -3.450799765317839],
        nombre: "Camino secundario",
        foto: "fotos/guardamino/secundario.jpg",
        categoria: "Sendero",
        descripcion: "Tramo de camino rural que conecta el barrio de La Casa con las zonas altas de Guardamino, ofreciendo vistas sobre el pueblo de Ramales y los macizos del Pico San Vicente y la Sierra del Hornijo.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    }
];

// ====================================================
// A partir de aquí no hay que tocar nada
// ====================================================

if (!window.MODO_SEGUIR) {
var mapa = inicializarMapaRuta();

// Elevación variante A
var elevacionA = crearElevacion('#grafico-elevacion');
elevacionA.addTo(mapa);
elevacionA.load('data/guardamino.gpx');

// Elevación variante B
var elevacionB = crearElevacion('#grafico-elevacion-b');
elevacionB.addTo(mapa);
elevacionB.load('data/guardaminob.gpx');

var trackA, trackB;

function activarVariante(v) {
    document.getElementById('grafico-elevacion').style.display   = v === 'a' ? 'block' : 'none';
    document.getElementById('grafico-elevacion-b').style.display = v === 'b' ? 'block' : 'none';

    document.getElementById('dato-distancia').textContent = datos[v].distancia;
    document.getElementById('dato-duracion').textContent  = datos[v].duracion;
    document.getElementById('dato-desnivel').textContent  = datos[v].desnivel;
    document.getElementById('dato-tipo').textContent      = datos[v].tipo;

    document.getElementById('texto-descripcion').textContent = descripciones[v];

    // Mostrar la foto solo en la ruta secundaria
    var fotoVarianteB = document.getElementById('foto-variante-b');
    if (fotoVarianteB) {
        fotoVarianteB.style.display = v === 'b' ? 'block' : 'none';
    }

    document.getElementById('btn-variante-a').classList.toggle('variante-activa', v === 'a');
    document.getElementById('btn-variante-b').classList.toggle('variante-activa', v === 'b');

    if (trackA) trackA.setStyle({ dashArray: null, weight: v === 'a' ? 4 : 2, opacity: v === 'a' ? 0.88 : 0.22 });
    if (trackB) trackB.setStyle({ dashArray: null, weight: v === 'b' ? 4 : 2, opacity: v === 'b' ? 0.88 : 0.22 });
}

trackA = new L.GPX('data/guardamino.gpx', {
    async: true,
    polyline_options: { color: '#fce8c6', weight: 4, opacity: 0.9, className: 'mi-track' },
    marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null }
}).on('loaded', function(e) {
    var bounds = e.target.getBounds();
    _boundsIniciales = bounds;
    mapa.fitBounds(bounds);
    mapa.setMaxBounds(bounds.pad(1));
    mapa.once('moveend', function() {
        mapa.options.minZoom = mapa.getZoom();
        _mapaListo = true;
        mapa.fire('ruta:ready');
    });
    e.target.on('click', function() { activarVariante('a'); });
    e.target.eachLayer(function(layer) { layer.on('click', function() { activarVariante('a'); }); });
}).addTo(mapa);

trackB = new L.GPX('data/guardaminob.gpx', {
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
activarVariante('a');
} // fin if (!window.MODO_SEGUIR)
