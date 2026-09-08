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
            texto: "Si miras bien entre la vegetación cerca del mural, encontrarás algo inesperado…",
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

var elevacion = crearElevacion('#grafico-elevacion', ESCALA_ALTITUD);
elevacion.addTo(mapa);
elevacion.load(GPX);

cargarTrack(mapa, GPX, 0.1);

crearFichaPunto();
crearMarcadoresConFicha(mapa, puntosInteres);

renderizarPuntosInteres(puntosInteres);
