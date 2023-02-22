//Router permite crear una instancia de nuestro ROUTER
const { Router } = require('express');
//para hacer validaciones
const { check } = require('express-validator');

//validar los token --> validarJWT
//validarCampos --> custom middleware para mostrar errores
const { validarJWT, 
        validarCampos, 
        esAdminRole } = require('../middlewares');

//Importamos crearProducto
//obtener Producto
//obtener Producto
//actualizar Producto
//borrar la Producto
const { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto} = require('../controllers/productos');
//Verificar si existe la categoria por ID --> existeCategoriaPorId
//Verificar si existe producto por ID ---> existeProductoPorId
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

//asignar la funcion Router() a una variable
const router =  Router();

/**
 * {{url}}/api/categorias
 */


//obtener todas los Productos - publico
//controlador para obtenerCategorias
router.get('/', obtenerProductos);
//obtener solo un Producto por ID - publico
router.get('/:id',[
    //validar que sea un id de mongo valido
    check('id', 'No es un ID de mongo valido').isMongoId(),
    //verificar si existe producto
    check('id').custom( existeProductoPorId ),
    //validar campos midleware propio
    validarCampos
    
], obtenerProducto);
//Crear producto - PRIVADO - cualquier persona con un token valido
//para crear una categoria solo pueden hacerlo aquellos que tengan un TOKEN para ello vamos a usar nuestro middleware validarJWT, recordar que en el FRONTEND deben de mandarlo como: x-token --> para probar en POSTMAN
router.post('/', [ 
    validarJWT,
    //tambien usaremos el CHECK ya que NOMBRE es required
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //verificar que sea un ID valido de MONGO
    check('categoria', 'No es un ID valido de MONGO').isMongoId(),
    //verificar si existe la categoria por ID
    check('categoria').custom( existeCategoriaPorId ),
    //mostrar los errores
    validarCampos
], crearProducto );
//Actualizar registro por ID - PRIVADO - cualquiera con un token valido
router.put('/:id', [
    //validar el JWT
    validarJWT,
    //verificar que sea un ID valido de MONGO
    //check('categoria', 'No es un ID valido de MONGO').isMongoId(),
    //verificar si existe el ID del producto
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);
//borrar un producto solo Admin puede borrarlo
router.delete('/:id', [
    //validar el JWT de quien lo quiere eliminar
    validarJWT,
    //una vez validado el JWT, verificar que quien va a borrar el producto sea un adminRole
    esAdminRole,
    //validar que sea un id de mongo valido
    check('id', 'No es un ID de mongo valido').isMongoId(),
    //verificar si existe el ID delproducto
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto);



//exportar 
module.exports = router;