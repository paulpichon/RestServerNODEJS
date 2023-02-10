//verificar/confirmar si hay errores desde routes
const { validationResult } = require('express-validator');


//middlewares
//al ser un middleware tendra un tercer argumento
const validarCampos = ( req, res, next ) => {
    //confirmar si hay errores
    const errors = validationResult( req );
    //verificar si  hay errores
    if ( !errors.isEmpty() ) {
        //retornar los errores encontrados
        return res.status( 400 ).json( errors );
    }

    //si el middleware pasa ponemos el next al final
    next();
}




//exportar
module.exports = {
    validarCampos
}