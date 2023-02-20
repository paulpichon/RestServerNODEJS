//Auth
//Router permite crear una instancia de nuestro ROUTER
const { Router } = require('express');
//para hacer validaciones
const { check } = require('express-validator');

//custom middleware para mostrar errores
const { validarCampos } = require('../middlewares/validar-campos');
//importamos la funcion del controlado login
//importamos la funcion para login con GOOGLE SIGN IN
const { login, googleSignIn } = require('../controllers/auth');



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

//Peticion para autenticarnos con GOOGLE SIGNIN
router.post('/google', [
    //debemos mandar el ID_TOKEN el cual se va a generar cuando se presione el boton GOOGLE SIGN IN
    //no debe de estar vacio .not().isEmpty()
    check('id_token', 'El id_token de google es necesario').not().isEmpty(),
    //llamamos nuestro custom middleware validarCampos
    validarCampos
], googleSignIn);

//exportar 
module.exports = router;