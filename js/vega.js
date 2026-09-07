// ====================================================
// DATOS DE ESTA RUTA — lo único que hay que editar aquí
// ====================================================

var GPX = 'data/vega.gpx';
var ESCALA_ALTITUD = {
    min: 0,
    max: 200
};

var puntosInteres = [
    {
        coords: [43.257757822382096, -3.469872258786685],
        nombre: "Puente Romano",
        foto: "fotos/puenteromano.jpeg",
        categoria: "Puente histórico",
        descripcion: "Puente de piedra a la salida de Ramales en dirección a Vega, conocido popularmente como el Puente Romano. Cruza el río Asón y forma parte del camino histórico que conectaba los núcleos del valle.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.255762810521176, -3.475972336495188],
        nombre: "Humilladero",
        foto: "fotos/humilladero.jpg",
        categoria: "Patrimonio religioso",
        descripcion: "Pequeña construcción religiosa popular que marca el acceso al núcleo rural. Los humilladeros son una forma de arquitectura devocional extendida por toda la Cantabria interior, donde vecinos y caminantes hacían una parada de oración.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.26165281811487, -3.4842905538024946],
        nombre: "Parque de Vegacorredor",
        foto: "fotos/parquevega.jpeg",
        categoria: "Espacio recreativo",
        descripcion: "Área recreativa junto al cauce del Asón en el barrio de Vega, con zonas de sombra, merenderos y acceso al río. Un punto de descanso habitual para familias y senderistas que recorren el tramo bajo del valle.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.25408574766927, -3.48623600049769],
        nombre: "Fuente Iseña",
        foto: "fotos/fuenteisenia.jpg",
        categoria: "Fuente",
        descripcion: "Fuente de agua en el entorno del barrio de Vega. Las fuentes de manantial son habituales a lo largo de la ruta, aprovechando la abundante red hídrica subterránea que alimenta el karst del Asón.",
        historia: null,
        informacionPractica: "Agua potable.",
        enlaceOficial: null
    },
    {
        coords: [43.25680519840663, -3.470456579361322],
        nombre: "Presa Don Cecilio",
        foto: "fotos/presa.jpg",
        categoria: "Infraestructura hidráulica",
        descripcion: "Pequeña presa histórica sobre el río Asón que reguló el caudal para uso agrícola e industrial en el valle. Hoy es un punto paisajístico del recorrido, con el río formando una lámina de agua tranquila.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    }
];

// ====================================================
// A partir de aquí no hay que tocar nada
// ====================================================

var mapa = inicializarMapaRuta();

var elevacion = crearElevacion('#grafico-elevacion', ESCALA_ALTITUD);
elevacion.addTo(mapa);
elevacion.load(GPX);

cargarTrack(mapa, GPX, 0.1);

crearFichaPunto();
crearMarcadoresConFicha(mapa, puntosInteres);

renderizarPuntosInteres(puntosInteres);
