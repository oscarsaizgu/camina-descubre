// ====================================================
// DATOS DE ESTA RUTA — lo único que hay que editar aquí
// ====================================================

var GPX = 'data/pondra.gpx';

var puntosInteres = [
    {
        coords: [43.266436307269046, -3.4238348012477324],
        nombre: "Ermita de San Salvador (Pondra)",
        foto: null,
        categoria: "Patrimonio",
        descripcion: "Pequeña ermita reformada con una nave dividida en dos tramos. Conserva bóvedas de crucería del siglo XV y alberga una notable imagen gótica en madera de la Virgen con el Niño de la misma época.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.268425842671, -3.427706556714359],
        nombre: "Ermita de San Juan (Riancho)",
        foto: null,
        categoria: "Patrimonio",
        descripcion: "Edificio gótico del siglo XV con referencias documentales que se remontan al siglo XIII. Nave rectangular formada por tres tramos con bóveda de crucería junto al coro. La entrada presenta un arco de medio punto y los esquinales y contrafuertes son de mampostería de arenisca.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.27261026731905, -3.436065603322273],
        nombre: "Puente",
        foto: null,
        categoria: "Patrimonio",
        descripcion: "Paso tradicional sobre el río en el entorno de Riancho, considerado uno de los elementos históricos y paisajísticos más destacados del municipio de Ramales de la Victoria.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
];

// ====================================================
// Inicialización — no editar
// ====================================================

if (!window.MODO_SEGUIR) {
    inicializarRuta({ gpx: GPX });
}
