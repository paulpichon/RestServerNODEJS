//Auth
//Router permite crear una instancia de nuestro ROUTER
const { Router } = require('express');
//para hacer validaciones
const { check } = require('express-validator');

//custom middleware para mostrar errores
//validar archivo a subir
const { validarCampos, validarArchivoSubir } = require('../middlewares');
//importamos funcion para crear recursos/archivos
const { cargarArchivo, actualizarImagen } = require('../controllers/uploads');
//colecciones permitidas
const { coleccionesPermitidas } = require('../helpers');





//asignar la funcion Router() a una variable
const router =  Router();

//crear un nuevo recurso en el servidor
//aqui podriamos hacer las validaciones necesarios para el manejo del archivo con los middlewares
//validarArchivoSubir ---> validar que no este vacio el input
router.post('/', validarArchivoSubir,cargarArchivo);

//ruta para actualizar
//como segundo parametro voy a usar los middlewares
router.put('/:coleccion/:id', [
    //validar el archivo a subir,  verificar que no este vacio
    validarArchivoSubir,
    //validar que el ID sea de MONGO
    check('id', 'El id debe de ser de MONGO').isMongoId(),
    //este sera una validacion personalizada mediante el custom
    //validar la coleccion la cual va a estar dentro de un arreglo
    //esta funcion coleccionesPermitidas ira en el helper, en donde yo pongo la coleccion = c que recibe en el PUT y el segundo parametro sera un arreglo con las opciones permitidas
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos']) ),
    //llamamos validar campos para bloquear algun otro error
    validarCampos

], actualizarImagen);

//exportar 
module.exports = router;