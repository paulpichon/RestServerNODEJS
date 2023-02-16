//Auth
//Router permite crear una instancia de nuestro ROUTER
const { Router } = require('express');
//para hacer validaciones
const { check } = require('express-validator');

//custom middleware para mostrar errores
const { validarCampos } = require('../middlewares/validar-campos');
//importamos la funcion del controlado login
const { login } = require('../controllers/auth');



//asignar la funcion Router() a una variable
const router =  Router();

//Peticiones POST
//vamos a mandar informacion con los customs middlwares vamos a validar
router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    //password solo verificar que no este vacio el campo
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    //custom middleware para mostrar errores
    validarCampos
], login );

//exportar 
module.exports = router;