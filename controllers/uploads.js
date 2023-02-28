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
    //hacer split al nombre del archivo a subir
    const nombreCortado = archivo.name.split('.');
    
    //extension del archivo
    //la extension va a ser igual a la ultima posicion del arreglo nombreCortado
    const extension = nombreCortado[ nombreCortado.length - 1 ];

    //validar la extencion
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    //validar si empata la extension que subimos con la del arreglo extensionesValidas
    //si no hay coincidencias
    if ( !extensionesValidas.includes( extension )  ) {
        //mensaje de error
        return res.status( 400 ).json({
            msg: `La extension ${ extension } no es permitida, ${ extensionesValidas } `
        });
    }


    res.json({
        extension
    });

    console.log( nombreCortado );


    //construccion del path a donde moveremos el archivo
    //The join() method creates and returns a new string by concatenating all of the elements in an array
    // const uploadPath = path.join( __dirname, '../uploads/', archivo.name );

    // //.mv() ---> mueve el archivo
    // archivo.mv(uploadPath, (err) => {
    //     if (err) {
    //     return res.status(500).json({err});
    //     }

    //     res.json({
    //         msg: 'File uploaded to ' + uploadPath
    //     });
    // });


}


//exports
module.exports = {
    cargarArchivo
}