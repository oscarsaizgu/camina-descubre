// ====================================================
// DATOS DE ESTA RUTA — lo único que hay que editar aquí
// ====================================================

var GPX = 'data/vega.gpx';

var puntosInteres = [
    { coords: [43.257757822382096, -3.469872258786685],  nombre: "Puente Romano",          foto: "fotos/puenteromano.jpeg" },
    { coords: [43.255762810521176, -3.475972336495188],  nombre: "Humilladero",             foto: "fotos/humilladero.jpg" },
    { coords: [43.26165281811487,  -3.4842905538024946], nombre: "Parque de Vegacorredor",  foto: "fotos/parquevega.jpeg" },
    { coords: [43.25408574766927,  -3.48623600049769],   nombre: "Fuente Iseña",            foto: "fotos/fuenteisenia.jpg" },
    { coords: [43.25680519840663,  -3.470456579361322],  nombre: "Presa Don Cecilio",       foto: "fotos/presa.jpg" },
];

// ====================================================
// A partir de aquí no hay que tocar nada
// ====================================================

var mapa = inicializarMapaRuta();

var elevacion = crearElevacion('#grafico-elevacion');
elevacion.addTo(mapa);
elevacion.load(GPX);

cargarTrack(mapa, GPX, 0.1);

crearLightbox();
crearMarcadores(mapa, puntosInteres);
