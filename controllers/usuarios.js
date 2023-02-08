//express -> response
const { response } = require('express');

//funciones

//usuarios GET
//asignamos response -> res
const usuariosGet = (req, res = response) => {
    res.json({
        msg: 'get API - usuariosGet'
    });
};

//usuarios Post
const usuariosPost = (req, res = response) => {

    //esto es lo que viene como peticion del usuario es el REQUEST-> req de nuestro parametro
    //podemos desestructurarlo
    //const body = req.body;
    const { nombre, edad } = req.body;

    res.json({
        msg: 'post API - usuariosPost',
        nombre,
        edad
    });
};
//usuarios put
const usuariosPut = (req, res = response) => {
    res.json({
        msg: 'put API - usuariosPut'
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