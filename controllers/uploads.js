//importamos express para ayudarnos con el tipado
const { response } = require("express");


const cargarArchivo = ( req, res = response ) => {

    res.json({
        msg: 'Hola Mundo'
    });


}


//exports
module.exports = {
    cargarArchivo
}