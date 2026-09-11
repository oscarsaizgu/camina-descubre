// ====================================================
// DATOS DE ESTA RUTA — lo único que hay que editar aquí
// ====================================================

var GPX = 'data/coto.gpx';

var puntosInteres = [
    {
        coords: [43.27978204665902, -3.4445231521155373],
        nombre: "Refugio de pescadores del río Asón",
        foto: "fotos/coto/coto.jpg",
        categoria: "Pesca fluvial",
        descripcion: "Pequeño refugio en la orilla del río Asón, en el tramo del coto de pesca de Ramales de la Victoria. El Asón es uno de los ríos salmoneros más valorados de Cantabria, con capturas de salmón atlántico y trucha común. Este refugio sirve de punto de descanso y resguardo para los pescadores que faenan en el coto.",
        historia: null,
        informacionPractica: "Pesca regulada por coto. Es necesaria la licencia de pesca de Cantabria y respetar los cupos, tallas mínimas y vedas establecidos por la Consejería de Medio Ambiente.",
        enlaceOficial: null
    },
];

// ====================================================
// Inicialización — no editar
// ====================================================

if (!window.MODO_SEGUIR) {
    inicializarRuta({ gpx: GPX });
}
