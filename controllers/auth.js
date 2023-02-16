///controlador de login
//importamos response de express para ayudar con el tipado
const { response } = require("express");
//importar BCRYPTJS para comparar las contraseñas del usuario
const bcryptjs = require('bcryptjs');

//necesitamos el modelo de usuarios para verificar por CORREO si existe el USUARIO en la BD
const Usuario = require('../models/usuario');


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

        //debemos tener solo un res.json en todo el controlador
        res.json({
            msg: 'Login OK'
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


//exportamos login
module.exports = {
    login
}