//Router permite crear una instancia de nuestro ROUTER
const { Router } = require('express');
//para hacer validaciones
const { check } = require('express-validator');

//validar los token --> validarJWT
//validarCampos --> custom middleware para mostrar errores
const { validarJWT, validarCampos } = require('../middlewares');
//Importamos crearCategoria
const { crearCategoria } = require('../controllers/categorias');

//asignar la funcion Router() a una variable
const router =  Router();

/**
 * {{url}}/api/categorias
 */


//obtener todas las categorias - publico
router.get('/', ( req, res ) => {
    res.json("get");
});
//obtener solo una categoria por ID - publico
router.get('/:id', ( req, res ) => {
    res.json("get - ID");
});
//Crear categoria - PRIVADO - cualquier persona con un token valido
//para crear una categoria solo pueden hacerlo aquellos que tengan un TOKEN para ello vamos a usar nuestro middleware validarJWT, recordar que en el FRONTEND deben de mandarlo como: x-token --> para probar en POSTMAN
router.post('/', [ 
    validarJWT,
    //tambien usaremos el CHECK ya que NOMBRE es required
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
     //mostrar los errores
     validarCampos
], crearCategoria );
//Actualizar registro por ID - PRIVADO - cualquiera con un token valido
router.put('/:id', ( req, res ) => {
    res.json("put");
});
//borrar una categoria solo Admin puede borrarlo
router.delete('/:id', ( req, res ) => {
    res.json("delete");
});



//exportar 
module.exports = router;