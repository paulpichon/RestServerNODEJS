//Router permite crear una instancia de nuestro ROUTER
const { Router } = require('express');
//para hacer validaciones
const { check } = require('express-validator');

//validar los token --> validarJWT
//validarCampos --> custom middleware para mostrar errores
const { validarJWT, 
        validarCampos, 
        esAdminRole } = require('../middlewares');

//Importamos crearCategoria
//obtener categorias
//obtener categoria
//actualizar categoria
//borrar la categoria
const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria} = require('../controllers/categorias');
//Verificar si existe la categoria por ID
const { existeCategoriaPorId } = require('../helpers/db-validators');

//asignar la funcion Router() a una variable
const router =  Router();

/**
 * {{url}}/api/categorias
 */


//obtener todas las categorias - publico
//controlador para obtenerCategorias
router.get('/', obtenerCategorias);
//obtener solo una categoria por ID - publico
router.get('/:id',[
    //validar que sea un id de mongo valido
    check('id', 'No es un ID de mongo valido').isMongoId(),
    //verificar si existe categoria
    check('id').custom( existeCategoriaPorId ),
    //validar campos midleware propio
    validarCampos
    
], obtenerCategoria);
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
router.put('/:id', [
    //validar el JWT
    validarJWT,
    //tambien usaremos el CHECK ya que NOMBRE es required
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //verificar si existe el ID de la categoria
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria);
//borrar una categoria solo Admin puede borrarlo
router.delete('/:id', [
    //validar el JWT de quien lo quiere eliminar
    validarJWT,
    //una vez validado el JWT, verificar que quien va a borrar la categoria sea un adminRole
    esAdminRole,
    //validar que sea un id de mongo valido
    check('id', 'No es un ID de mongo valido').isMongoId(),
    //verificar si existe el ID de la categoria
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria);



//exportar 
module.exports = router;