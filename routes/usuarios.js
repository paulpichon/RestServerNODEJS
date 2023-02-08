//RUTAS 

//Router permite crear una instancia de nuestro ROUTER
const { Router } = require('express');

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
router.post('/', usuariosPost);
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