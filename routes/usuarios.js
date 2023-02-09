//RUTAS 

//Router permite crear una instancia de nuestro ROUTER
const { Router } = require('express');
const { check } = require('express-validator');

//asignar la funcion Router() a una variable
const router =  Router();

//importacaiones de mis funciones
const { usuariosGet, 
    usuariosPost, 
    usuariosPut, 
    usuariosDelete, 
    usuariosPatch } = require('../controllers/usuarios');

//Peticiones GET
router.get('/', usuariosGet );
//Peticiones post
//vamos a definir un middelware para validar con express-validator
//si mandamos 2 argumentos el segundo seria el controlador pero, 
//si mandamos un 3er argumento entonces seria el de un middelware que iria en la segunda posicion antes de llamar el controlador
//y si mandamos mas de 1 middlelwares entonces lo hacemos como si fuera un arreglo []

router.post('/', [
    //en este caso usaremos el check() que es un middelware donde especificamos que campo del BODY necesito revisar en este caso sera el correo, podemos pasar como 2do argumento un mensaje de error
    check('correo', 'El correo no es válido').isEmail(),
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