//importar middleware validarCampos
const validarCampos = require('../middlewares/validar-campos');
//importamos validarJWT para poder hacer uso de JWT
const validarJWT    = require('../middlewares/validar-jwt');
//importar middleware para verificar si es Administrador
//por el momento solo esta habilitado tieneRole para ser flexibles sobre quien puede eliminar registros
const tieneRole     = require('../middlewares/validar-roles');
//funcion para validar que venga un archivo en el INPUT
const validarArchivo = require('../middlewares/validar-archivo');


//exportar las constantes
//para no ir exportando uno a uno las funciones de cada constante se puede hacer lo siguiente

//validarCampos.nombrefuncion1
//validarCampos.nombrefuncion2
//validarCampos.nombrefuncion3
//en lugar de hacer todo esto podemos hacer esto: ...validarCampos y ahi ya van todas las funciones de esa importancion

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...tieneRole,
    ...validarArchivo
}