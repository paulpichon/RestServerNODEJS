//JWT
//importar el paquete de JSONWEBTOKEN
const jwt = require('jsonwebtoken');

//uid = user identifier y determinamos que uid siempre sea un string
const generarJWT = ( uid = '' ) => {
    //promesa
    //reject es en caso de que algo salga mal
    return new Promise((resolve, reject)  => {


        //grabar solamente el uid en el payload, pero en teoria podriamos grabar lo que quisieramos
        //por ejemplo: { uid, nombre, edad, telefono, correo, etc, etc, etc}
        const payload = { uid };

        //.sign() ---> para firmar/crear un nuevo token
        //JWT.sign(payload: string | object | Buffer, secretOrPrivateKey: jwt.Secret, options?: jwt.SignOptions | undefined): string (+2 overloads)
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            //OPCIONES
            //tiempo de expiracion de la JWT en esta caso de 4 horas
            expiresIn: '4h'

        }, ( err, token ) => {

            //si hay un error
            if ( err ) {
                console.log( err );
                //reject para mandar un mensaje
                reject('No se pudo generar el token')
            }else{
                //pero si todo sale bien llamamos el resolve mandandole el token
                resolve( token );

            }

        });

    });

}


//exportar JWT
module.exports = {
    generarJWT
}