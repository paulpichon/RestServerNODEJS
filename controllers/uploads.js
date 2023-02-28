//importamos express para ayudarnos con el tipado
const { response } = require("express");
//helper para la subida de archivos
const { subirArchivo } = require("../helpers");


const cargarArchivo = async( req, res = response ) => {
    //verificamos si viene la propiedad req.files
    //al mismo tiempo Object.keys(req.files).length === 0 verifica que el archivo tenga un length mayor a 0
    //tambien verificamos si en req.files.archivo tampoco hay nada muestre el error
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        //si no hay req.files mandamos mensaje de error
        res.status(400).json({
            msg: 'No hay archivos que subir.'
        });
        return;
    }

    //imagenes
    //mandamos los re.files como argumento de la funcion que viene de los helpers
    const nombre = await subirArchivo( req.files );
    //
    res.json({ nombre });

}


//exports
module.exports = {
    cargarArchivo
}