//funcion para verificar el  tipo de ROL del usuario
//importar express para ayudarnos con el tipado
const { response } = require("express");


//los middlewares reciben la request y la response
const esAdminRole = ( req, res = response, next) => {

    //validar que estmos llamando al admin_rol correcto
    if ( !req.usuario ) {
        //server internal error ---> un error mio
        return res.status( 500 ).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    //req.usuario; es en baso al ID que venia en el TOKEN
    const { rol, nombre } = req.usuario;

    //verificar si el rol es diferente del rol que queremos evaluar en este caso 'ADMIN_ROL'
    if ( rol !== 'ADMIN_ROLE' ) {
        //no esta autorizado
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede hacer esto`
        });
    }




    //para pasar al siguiente middleware o controlador
    next();

}



//exportar
module.exports = {
    esAdminRole
}