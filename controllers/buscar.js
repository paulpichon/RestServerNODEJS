//express para ayudarnos con el tipado
const { response } = require("express");

const buscar = ( req, res = response) => {

    //extraemos la coleccion y el termino de busqueda
    //coleccion y termino vienen en la URL
    const { coleccion, termino } = req.params;





    res.json({
        coleccion,
        termino
    });
}


//exportar
module.exports = {
    buscar
}