//RUTAS 
//Router permite crear una instancia de nuestro ROUTER
const { Router } = require('express');
const { check } = require('express-validator');

//importar middleware validarCampos
const { validarCampos } = require('../middlewares/validar-campos');
//importar Role de models
const Role = require('../models/role');

//importacaiones de mis funciones
const { usuariosGet, 
    usuariosPost, 
    usuariosPut, 
    usuariosDelete, 
    usuariosPatch } = require('../controllers/usuarios');

//asignar la funcion Router() a una variable
const router =  Router();

//Peticiones GET
router.get('/', usuariosGet );
//Peticiones post
//vamos a definir un middelware para validar con express-validator
//si mandamos 2 argumentos el segundo seria el controlador pero, 
//si mandamos un 3er argumento entonces seria el de un middelware que iria en la segunda posicion antes de llamar el controlador
//y si mandamos mas de 1 middlelwares entonces lo hacemos como si fuera un arreglo []

router.post('/', [
    //validar que no este vacio el campo nombre
    //.not().isEmpty() --> quiere decir que no este vacio el campo
    //.isEmpty() --> quiere decir que este vacio el campo
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //password, .isLength() define el tamaño del string del password
    check('password', 'La contraseña debe tener minimo 6 caracteres').isLength({ min: 6 }),
    //en este caso usaremos el check() que es un middelware donde especificamos que campo del BODY necesito revisar en este caso sera el correo, podemos pasar como 2do argumento un mensaje de error
    check('correo', 'El correo no es válido').isEmail(),
    //.isIn() verifica lo que hay dentro de un arreglo
    //lo mas conveniente es que n luigar del arreglo que esta en duro usemos una base de datos
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    
    //evaluamos el rol contra lo que hay en la base datos
    //se usa CUSTOM()  para hacer una verificacion personalizada
    check('rol').custom( async(rol = '') => {
        //verificar si existe  el rol en la coleccion de la base de datos
        const existeRol = await Role.findOne({ rol });
        
        //pero si no existe
        if (!existeRol) {
            //presonalizamos nuestro mensaje de error
            throw new Error(`El rol ${ rol } no está registrado en la base de datos`);
        }

    }),
    //validarCampos sera el ultimo middleware que usaremos despues de validar con el check
    validarCampos

], usuariosPost);
//Peticiones put
//para obtener un parametro de la URL siempre y cuando sea un numero se pone el nombre del parametro de la siguiente 
//forma -> /:id
router.put('/:id', usuariosPut );
//Peticiones patch
router.patch('/', usuariosPatch);
//Peticiones delete
router.delete('/', usuariosDelete);


//exportaciones
module.exports = router;