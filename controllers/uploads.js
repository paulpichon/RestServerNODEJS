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

    //ponemos un try catch para poder manejar el error como nosotros queremos
    try {
        //imagenes
        //mandamos los re.files como argumento de la funcion que viene de los helpers
        //podemos mandar como un segundo parametro un arreglo con las extensiones permitidas
        //y tambien se le puede añadir el tercer argumento que es el del nombre de la carpeta
        //incluso si no existe la carpeta esta habilitado en el archivo server.js el que se pueda crear la carpeta en caso de que no existe
        //en caso de que no se manden tanto el segundo como tercer argumento mandapor undefined en el segundo argumento y en el tercer argumento mandamos 'imgs' que es el nombre de la carpeta
        //const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );

        res.json({ nombre });

    } catch (msg) {
        //mensaje de error
        res.status(400).json({ msg });
    }

}

//controlador para actualizar imagen
const actualizarImagen = async( req, res = response) => {

    //desestructurar el id y la coleccion del req.params
    const { id, coleccion } = req.params;

    res.json({ id, coleccion});

} 

//exports
module.exports = {
    cargarArchivo,
    actualizarImagen
}