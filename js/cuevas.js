// ====================================================
// DATOS DE ESTA RUTA — lo único que hay que editar aquí
// ====================================================

var GPX = 'data/cuevas.gpx';

var puntosInteres = [
    {
        coords: [43.244719, -3.454010],
        nombre: "Mirador de Covalanas",
        foto: "fotos/cuevas/mirador.jpg",
        streetview: null,
        categoria: "Mirador",
        descripcion: "Punto elevado con vistas sobre el valle del Asón y la entrada al complejo de cuevas prehistóricas de Ramales. Desde aquí se distinguen los farallones kársticos que albergan las cuevas de Covalanas y El Mirón.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.245467, -3.452144],
        nombre: "Cueva de Covalanas",
        foto: "fotos/cuevas/covalanas.jpg",
        streetview: null,
        categoria: "Cueva prehistórica · Patrimonio UNESCO",
        descripcion: "Declarada Patrimonio de la Humanidad por la UNESCO en 2008, junto al resto del Arte Rupestre del Paleolítico de la Cornisa Cantábrica. Alberga una extraordinaria procesión de 18 ciervas pintadas hace más de 25.000 años mediante una técnica de punteado única en el mundo.",
        historia: "Descubierta en 1903 por Hermilio Alcalde del Río y Lorenzo Sierra. Las pinturas, realizadas en pigmento rojo mediante la técnica del trazado aureolado o punteado, son consideradas únicas en el arte rupestre mundial. Su hallazgo fue clave para el reconocimiento del arte paleolítico cantábrico.",
        informacionPractica: "Precio: 3 € (general) / 1,50 € (reducida). Visitas de miércoles a domingo, en sesiones de 10:10, 11:10 y 12:10 h. Máximo 4 personas por sesión. Reserva imprescindible llamando al 942 59 84 25.",
        enlaceOficial: "https://cuevas.culturadecantabria.com"
    },
    {
        coords: [43.245171, -3.452452],
        nombre: "Cueva del Mirón",
        foto: "fotos/cuevas/miron.jpg",
        streetview: null,
        categoria: "Yacimiento arqueológico · BIC",
        descripcion: "Yacimiento de excepcional importancia que alberga el primer enterramiento magdaleniense documentado en la Península Ibérica. La 'Dama del Mirón', fragmentos de una joven cubierta de ocre rojo con más de 18.500 años de antigüedad, es uno de los hallazgos más significativos del Paleolítico europeo.",
        historia: "Declarada Bien de Interés Cultural (BIC) en 2006. Las excavaciones dirigidas por Lawrence Straus y Manuel González Morales desde 1996 han revelado una secuencia de ocupación humana de más de 40.000 años. El enterramiento estaba asociado a grabados en la roca y cubierto de ocre rojo, un ritual único en la Península Ibérica.",
        informacionPractica: "La cueva no está abierta al público. Es un yacimiento activo de investigación arqueológica.",
        enlaceOficial: null
    },
    {
        coords: [43.244278, -3.450562],
        nombre: "Cueva de la Luz",
        foto: "fotos/cuevas/luz.jpg",
        streetview: null,
        categoria: "Cueva",
        descripcion: "Cavidad kárstica integrada en el rico conjunto espeleológico del macizo del Asón, en los alrededores de Ramales de la Victoria.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.248049, -3.456690],
        nombre: "Cueva el Haza",
        foto: "fotos/cuevas/haza.jpg",
        streetview: null,
        categoria: "Cueva",
        descripcion: "Cavidad kárstica del entorno de Ramales de la Victoria, integrada en el conjunto espeleológico del macizo kárstico del Asón.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.255676, -3.458022],
        nombre: "Cueva de Cullalvera",
        foto: "fotos/cuevas/cullalvera.jpg",
        streetview: null,
        categoria: "Cueva prehistórica · Patrimonio UNESCO",
        descripcion: "Una de las cuevas más espectaculares de Cantabria por sus dimensiones monumentales: su boca mide 14 metros de alto por 28 de ancho. En el interior, una pasarela de 400 metros sobre el río subterráneo permite descubrir el mundo kárstico. La cueva es accesible para personas con movilidad reducida.",
        historia: "Forma parte de un sistema kárstico de 12 kilómetros. A 600 y 1.200 metros del interior se conservan grabados paleolíticos declarados Patrimonio de la Humanidad por la UNESCO en 2008, aunque no son visitables en la actualidad. La cueva fue habilitada para visitas con infraestructura accesible.",
        informacionPractica: "Precio: 3 € (general) / 1,50 € (reducida). Accesible para personas con movilidad reducida. Capacidad máxima: 30 personas por sesión. Reservas: 942 59 84 25.",
        enlaceOficial: "https://cuevas.culturadecantabria.com"
    },
    {
        coords: [43.243676959842375, -3.4515943412797148],
        nombre: "Mirador Pared del Eco",
        foto: "fotos/cuevas/mirador.jpg",
        streetview: "https://www.google.com/maps/embed?pb=!4v1786105827670!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRHlqZUhfQ2c.!2m2!1d43.24362767947232!2d-3.451567598630545!3f102.16397789636218!4f0!5f0.7820865974627469",
        categoria: "Formación geológica · Mirador",
        descripcion: "Imponente pared de roca caliza que cierra el valle del río Calera. Recibe su nombre por el eco que producen los sonidos al rebotar en su vertical superficie. Es también una conocida zona de escalada deportiva con rutas de distintos niveles.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    }
];

// ====================================================
// Inicialización — no editar
// ====================================================

inicializarRuta({ gpx: GPX, pad: 1, maxBounds: false });
