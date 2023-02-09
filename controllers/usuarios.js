//express -> response
const { response, request } = require('express');
//importar el modelo para poder grabar en la base de datos
//ponemos U al inicio de usuario porque esto nos permitira crear instancias de esta constante
//Es un estandar ponerlo asi
const Usuario = require('../models/usuario');


//funciones

//usuarios GET
//asignamos response -> res
//asignamos request -> req
const usuariosGet = (req = request, res = response) => {

    //extraer params, cabe resaltar que para extraer parametros de la url al ser una peticion GET solo se hace en el controlador
    //se puede desestructurar
    //const query = req.query;
    //desestructurar
    //recordar que si no viene un parametro en la url, nosotros podemos definir un valor por defecto al desestructurar
    const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

    res.json({
        msg: 'get API - usuariosGet',
        q,
        nombre,
        apikey,
        page,
        limit
    });
};

//usuarios Post
const usuariosPost = async(req, res = response) => {

    //esto es lo que viene como peticion del usuario es el REQUEST-> req de nuestro parametro
    //podemos desestructurarlo
    //const body = req.body;
    const body = req.body;
    //creando una instancia de Usuario para poder grabar en la base de datos
    //y pasamos como argumento el body
    const usuario = new Usuario( body );
    
    //para decirle a mongo/mongoose que guarde el registro
    await usuario.save();

    res.json({
        usuario
    });
};
//usuarios put
const usuariosPut = (req, res = response) => {

    //ahora asignamos req.params.id a un variable que creamos
    //req.params.id --> id es el nombre que le dimos en el parametro del archivo usuarios.js
    //si tuviera otro nombre lo cambiamos -> req.params.idUsuario etc, etc
    //y al mismo tiempo si hay mas parametros entonces los podemos desestructurar
    //const id = req.params.id;

    //desestructuracion
    const { id } = req.params;

    res.json({
        msg: 'put API - usuariosPut',
        id
    });
}
//usuarios patch
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}
//usuarios delete
const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - usuariosDelete'
    });
}


//exports
module.exports = { 
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
};