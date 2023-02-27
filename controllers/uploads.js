//vamos a importar el PATH
const path = require('path');

//importamos express para ayudarnos con el tipado
const { response } = require("express");


const cargarArchivo = ( req, res = response ) => {
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

    //desestructuramos
    //establecer lo que viene en el require.files()
    const { archivo } = req.files;
    //construccion del path a donde moveremos el archivo
    //The join() method creates and returns a new string by concatenating all of the elements in an array
    const uploadPath = path.join( __dirname, '../uploads/', archivo.name );

    //.mv() ---> mueve el archivo
    archivo.mv(uploadPath, (err) => {
        if (err) {
        return res.status(500).json({err});
        }

        res.json({
            msg: 'File uploaded to ' + uploadPath
        });
    });


}


//exports
module.exports = {
    cargarArchivo
}