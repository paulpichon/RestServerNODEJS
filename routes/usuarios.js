//RUTAS 
//Router permite crear una instancia de nuestro ROUTER
const { Router } = require('express');
const { check } = require('express-validator');

// //importar middleware validarCampos
// const { validarCampos } = require('../middlewares/validar-campos');
// //importamos validarJWT para poder hacer uso de JWT
// const { validarJWT } = require('../middlewares/validar-jwt');
// //importar middleware para verificar si es Administrador
// //por el momento solo esta habilitado tieneRole para ser flexibles sobre quien puede eliminar registros
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

//PARA USAR LAS IMPORTACIONES DEL ARCHIVO INDEX.JS DE LA CARPETA MIDDLEWARE HACEMOS LO SIGUIENTE
//al ser un archivo INDEX.JS no es necesario especificar el nombre del archivo aunque se puede poner
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');

//importar esRoleValido
//existeemail para verificar correo existe
const { 
        esRoleValido, 
        existeEmail,
        existeUsuarioPorId } = require('../helpers/db-validators');


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
    //password, .isLength() define el tama??o del string del password
    check('password', 'La contrase??a debe tener minimo 6 caracteres').isLength({ min: 6 }),
    //en este caso usaremos el check() que es un middelware donde especificamos que campo del BODY necesito revisar en este caso sera el correo, podemos pasar como 2do argumento un mensaje de error
    check('correo', 'El correo no es v??lido').isEmail(),
    //creamos nuestro propio manejo de error en caso de que el correo ya existe en la base de datos
    check('correo').custom( existeEmail ),
    //.isIn() verifica lo que hay dentro de un arreglo
    //lo mas conveniente es que n luigar del arreglo que esta en duro usemos una base de datos
    //check('rol', 'No es un rol v??lido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    
    //evaluamos el rol contra lo que hay en la base datos
    //se usa CUSTOM()  para hacer una verificacion personalizada
    check('rol').custom( esRoleValido ),
    //validarCampos sera el ultimo middleware que usaremos despues de validar con el check
    validarCampos

], usuariosPost);
//Peticiones put
//para obtener un parametro de la URL siempre y cuando sea un numero se pone el nombre del parametro de la siguiente 
//forma -> /:id
router.put('/:id', [
    //middleware para verificar que el ID que venga en la URL se una URL valida de MONGO
    //.isMongoId() ---> verifica sea una URL valida de MONGO
    check('id', 'No es un ID v??lido').isMongoId(),
    //verificar si existe un usuario por ID manejando el error con un custom
    check('id').custom( existeUsuarioPorId ),
    //evaluamos el rol contra lo que hay en la base datos
    //se usa CUSTOM()  para hacer una verificacion personalizada
    check('rol').custom( esRoleValido ),
    //ponemos nuestra funcion validarCampos para que no muestre errores en consola --> que sean nuestros propios ERRORES personalizados
    validarCampos
],usuariosPut );
//Peticiones patch
router.patch('/', usuariosPatch);

//Peticiones delete
router.delete('/:id', [
    //estos middleware se hacen de forma sequiencial, es decir si tiene la funcion next() ejecuta el otro y asi sucesivamente, pero si da un error ya no se ejecutan los demas
    //llamamos el middleware para usar el TOKEN
    validarJWT,
    //middleware para verificar si es administrador
    //este middleware fuerza a que el usuario sea administrador sea ADMIN_ROLE
    //esAdminRole,

    //este middleware es mas flexible ya que permite que sea ADMIN_ROLE y VENTAS_ROLE quienes puedan eliminar registros
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    //middleware para verificar que el ID que venga en la URL se una URL valida de MONGO
    //.isMongoId() ---> verifica sea una URL valida de MONGO
    check('id', 'No es un ID v??lido').isMongoId(),
    //verificar si existe un usuario por ID manejando el error con un custom
    check('id').custom( existeUsuarioPorId ),
    //ponemos nuestra funcion validarCampos para que no muestre errores en consola --> que sean nuestros propios ERRORES personalizados
    validarCampos
],usuariosDelete);


//exportaciones
module.exports = router;