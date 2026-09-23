// ====================================================
// DATOS DE ESTA RUTA — lo único que hay que editar aquí
// ====================================================

var GPX = 'data/pondra.gpx';

var puntosInteres = [
    {
        coords: [43.266436307269046, -3.4238348012477324],
        nombre: "Ermita de San Salvador (Pondra)",
        foto: "fotos/pondra/emita2.png",
        categoria: "Patrimonio",
        descripcion: "Edificio de pequeñas dimensiones y reformado en el exterior. En su interior dispone de una nave dividida en dos tramos, de los que se conserva una bóveda de crucería de cuatro plementos y una clave. Tiene arcos formeros y fajones de medio punto. Todos estos descansan sobre ménsulas decoradas con mano abierta y tres ovas (obra del siglo XV). En su interior conserva una talla de la Virgen gótica del siglo XV, con niño, que está de pie y que descansa sobre dos cabezas de ángeles.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.268425842671, -3.427706556714359],
        nombre: "Ermita de San Juan (Riancho)",
        foto: "fotos/pondra/ermita.png",
        categoria: "Patrimonio",
        descripcion: "Construcción del siglo XV en estilo gótico, aunque la constancia documental se retrotrae hasta el siglo XIII. Consta de una nave rectangular formada por tres tramos. Al interior se accede mediante un arco de medio punto. El primero de los tres tramos se cubre con madera, y los más próximos a la cabecera mediante bóveda de crucería con cuatro plementos. Tanto los arcos formeros como fajones son apuntados y descansan sobre ménsulas. Al exterior, la fábrica se compone de sillería de arenisca en esquinas y contrafuertes y mampuesto en los muros. Tiene contrafuertes en cada esquina y en cada parte de la nave. A los pies también cuenta con una pequeña espadaña con tronera, rematada con cruz de calvario y un pórtico de reciente construcción.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.27261026731905, -3.436065603322273],
        nombre: "Puente",
        foto:  "fotos/pondra/puente.png",
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
