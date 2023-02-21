//Router permite crear una instancia de nuestro ROUTER
const { Router } = require('express');
//para hacer validaciones
const { check } = require('express-validator');

//custom middleware para mostrar errores
const { validarCampos } = require('../middlewares/validar-campos');

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
router.post('/', ( req, res ) => {
    res.json("post");
});
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