///controlador de login
//importamos response de express para ayudar con el tipado
const { response } = require("express");
//importar BCRYPTJS para comparar las contraseñas del usuario
const bcryptjs = require('bcryptjs');

//necesitamos el modelo de usuarios para verificar por CORREO si existe el USUARIO en la BD
const Usuario = require('../models/usuario');
//importar funcion para generar el TOKEN
const { generarJWT } = require("../helpers/generar-jwt");
//importar googleVerify para hace login 
const { googleVerify } = require("../helpers/google-verify");


const login = async(req, res = response) => {

    //extraer el correo y el password del req.body
    const { correo, password } = req.body;

    //con un try catch por si algo sale mal

    try {

        //Verificar si el email existe
        //.findOne() busca coincidencias 
        const usuario = await Usuario.findOne({ correo });
        //si no existe el correo/usuario
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - correo'
            });
        }


        //Verificar si el usuario esta activo todavia
        //si es false = !usuario.estado ---> es igual a decir usuario.estado === false
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - estado: false'
            });
        }


        //Verificar la contraseña
        //compareSync() ---> compara el password del formulario contra el de la base de datos
        //todo esto lo hace de forma asincrona
        //la respuesta es un booleano
        const validPassword = bcryptjs.compareSync(password, usuario.password);//true/false
        //si el password no es valido = false
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - password'
            });
        }

        //Genererar el JWT
        //para trabajar con JWT debemos hacerlo con promesas
        //lo que se va a grabar en el PAYLOAD sera el usuario.id
        //la funcion generarJWT( usuario.id ) ira en los HELPERS
        const token = await generarJWT( usuario.id );


        //debemos tener solo un res.json en todo el controlador
        //mandamos el usuario y el token que se acaba de generar
        res.json({
            usuario, 
            token
        });

    } catch (error) {
        console.log( error );
        //estatus 500 ---> Internal Server Error
        //se puede poner return al res o quitarselo funciona de igual forma
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

//GOOGLE SIGN-IN
const googleSignIn = async( req, res = response ) => {
    
    //id_token --> debe de venir en el req.body
    const { id_token } = req.body;

    try {
        //desestructuramos
        const { nombre, img, correo } = await googleVerify( id_token );
     
        let usuario = await Usuario.findOne({ correo });//existe o no existe el usuario en nuestra base de datos
        //si no existe el usuario
        if (!usuario) {
            //creamos el usuario
            const data = {
                nombre,
                correo,
                password: ':P',//No puede ir como STRING vacio ya que por las validaciones marcaria un error, se puede poner lo que sea ya que no importa pero no debe ir vacio
                img, 
                rol: "USER_ROLE",
                google: true
                //rol: se definio en el Schema de usuario como default por lo que no es necesario ponerlo aqui
            };

            //se crea instancia de Usuario
            usuario = new Usuario( data );
            //se guarda el usuario en la BD
            await usuario.save();

        }

        //si el usuario tiene el estado: FALSE entonces se niega la autenticacion en la aplicacion
        //porque puede ser que este eliminado el usuario, o este bloqueado etc etc
        if( !usuario.estado ) {
            //uhnouthorized
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //Genererar el JWT
        //para trabajar con JWT debemos hacerlo con promesas
        //lo que se va a grabar en el PAYLOAD sera el usuario.id
        //la funcion generarJWT( usuario.id ) ira en los HELPERS
        const token = await generarJWT( usuario.id );


        //mensaje
        res.json({
            usuario,
            token
        });


    } catch (error) {
        console.log( error );
        //bad request
        res.status(400).json({
            ok: false,
            msg:'El token no se pudo verificar o no es valido'
        });
    }


    

}

//exportamos login
module.exports = {
    login,
    googleSignIn
}