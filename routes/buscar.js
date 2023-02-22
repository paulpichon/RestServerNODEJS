//importar 
const { Router } = require('express');
//importar controlador BUSCAR
const { buscar } = require('../controllers/buscar');

//router
const router = Router();


//el estadar para busquedas es poner los paramentros en la URL
//y se hace una peticion GET por lo general
// /:coleccion ---> en que "tabla" de la BD quiere buscar
// /:termino ---> lo que quiere buscar
router.get('/:coleccion/:termino', buscar);



//exportar router
module.exports = router;