//funcion para validar que se este subiendo un archivo
//recibir ayuda del tipado
const { response } = require("express");

//recordar que cuando se usan los middleware debemos usar la funcion next
const validarArchivoSubir = ( req, res = response, next) => {

    //verificamos si viene la propiedad req.files
    //al mismo tiempo Object.keys(req.files).length === 0 verifica que el archivo tenga un length mayor a 0
    //tambien verificamos si en req.files.archivo tampoco hay nada muestre el error
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        //si no hay req.files mandamos mensaje de error
        return res.status(400).json({ 
            msg: 'No hay archivos que subir - validarArchivoSubir.' 
        });
    }

    //pasar al siguiente middleware
    next();

}


//exportar
module.exports = {
    validarArchivoSubir
}