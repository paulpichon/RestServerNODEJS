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
    res.json({
        msg: 'post API - usuariosPost'
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