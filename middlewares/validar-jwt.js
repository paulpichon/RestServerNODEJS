//funcion para validar el JWT y no cualquier persona pueda borrar un registro/usuario
//para ayudarnos con el tipado
const { response, request } = require('express'); 
//importamos JWT
const jwt = require('jsonwebtoken');

//un middleware se dispara con 3 argumentos
//req = request //se pone asi para ayudarnos con el tipado
//res = response //se pone asi para ayudarnos con el tipado
//funcion next que nos indica que puede continuar con el siguiente middleware o controlador
const validarJWT = ( req = request, res = response, next ) => {

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

        //crear una propiedad nueva dentro del request
        req.uid = uid;


        
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