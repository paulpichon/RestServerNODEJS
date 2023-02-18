//funcion para verificar el  tipo de ROL del usuario
//importar express para ayudarnos con el tipado
const { response } = require("express");


//los middlewares reciben la request y la response
//esta funcion valida que solo y solo sea ADMIN_ROLE quien pueda borrar registros
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

//funcion para permitir que ADMIN_ROLE y VENTAS_ROLE puedan eliminar registros
//...roles ---> aqui vienen todos los roles que se pasan como argumentos en el ROUTES
const tieneRole = ( ...roles ) => {
    //al tener los roles arriba debemos poner aqui req, res = response, next
    return ( req, res = response, next ) => {

        
        //validar que se haya validado el token
        if ( !req.usuario ) {
            //server internal error ---> un error mio
            return res.status( 500 ).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        //verificar el rol del usuario
        //si en roles.includes no esta el rol se lanza el error
        if ( !roles.includes( req.usuario.rol ) ) {
            return res.status( 401 ).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }


        //pasar a la siguiente funcion o middleware
        next();

    }
}



//exportar
module.exports = {
    esAdminRole,
    tieneRole
}