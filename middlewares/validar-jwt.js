//funcion para validar el JWT y no cualquier persona pueda borrar un registro/usuario
//para ayudarnos con el tipado
const { response, request } = require('express'); 
//importamos JWT
const jwt = require('jsonwebtoken');

//importar usuario para obtener informacion
const Usuario = require('../models/usuario');

//un middleware se dispara con 3 argumentos
//req = request //se pone asi para ayudarnos con el tipado
//res = response //se pone asi para ayudarnos con el tipado
//funcion next que nos indica que puede continuar con el siguiente middleware o controlador
const validarJWT = async( req = request, res = response, next ) => {

    //x-token = podria llamarse de cualquier forma Authorization etc, etc, etc
    //leer el x-token de los HEADERS
    //como nosotro lo especifiquemos aqui en este caso x-token, el FRONTEND lo debe de enviar
    const token = req.header('x-token');

    //si no viene el token
    if (!token) {
        //estatus 401 = Unauthorized
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }    


    try {

        //validar el JSON WEB TOKEN
        //.verify() ---> verifica si el token es valido
        //function verify(token: string, secretOrPublicKey: jwt.Secret, options: jwt.VerifyOptions & { complete: true;})
        //extraemos el UID
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        //leer el usuario que corresponde al UID de arriba
        //.findById( uid ) de esta forma obtendremos la informacion del usuario con ese ID
        const usuario = await Usuario.findById( uid );

        //si el usuario no existe
        if ( !usuario ) {
            //estatus 401 = Unauthorized
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en BD'
            });
        }
        
        //verificar si el UID tiene estado true ---> En teoria no puede un usuario hacer login si esta en estado:false ya que estaria eliminado
        if ( !usuario.estado ) {
            //estatus 401 = Unauthorized
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            });
        }
        
        //crear una propiedad nueva dentro del request
        req.usuario = usuario;
        //next() para continuar con el siguiente middleware o controlador
        next();
        
    } catch (error) {
        console.log( error );
        res.status(401).json({
            msg: 'Token no válido'
        });
    }


}


//exportar
module.exports = {
    validarJWT
}