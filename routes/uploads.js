//Auth
//Router permite crear una instancia de nuestro ROUTER
const { Router } = require('express');
//para hacer validaciones
const { check } = require('express-validator');
//importamos funcion para crear recursos/archivos
const { cargarArchivo } = require('../controllers/uploads');

//custom middleware para mostrar errores
const { validarCampos } = require('../middlewares/validar-campos');



//asignar la funcion Router() a una variable
const router =  Router();

//crear un nuevo recurso en el servidor
//aqui podriamos hacer las validaciones necesarios para el manejo del archivo con los middlewares
router.post('/', cargarArchivo);

//exportar 
module.exports = router;