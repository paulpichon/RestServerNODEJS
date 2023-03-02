//PATH ya esta incluido en NODE.JS
const path = require('path');
//importar fileSytem para verificar si existe determinado PATH
const fs   = require('fs');
// Require the Cloudinary library
const cloudinary = require('cloudinary').v2
//configuracion de cloudinary CON LA VARIABLE DE ENTORNO CLOUDINARY_URL
cloudinary.config( process.env.CLOUDINARY_URL );

//importamos express para ayudarnos con el tipado
const { response } = require("express");
//helper para la subida de archivos
const { subirArchivo } = require("../helpers");

//importar modelos Usuario, Producto
const { Usuario, Producto } = require('../models')


const cargarArchivo = async( req, res = response ) => {
    
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
    //se va a establecer el valor de modelo de forma condicional
    let modelo;

    switch( coleccion ){
        case 'usuarios':
            //buscar del modelo usuario por el ID
            modelo =  await Usuario.findById( id );
            //si no hay conincidencia
            if ( !modelo ) {
                return res.status( 400 ).json({
                    msg: `No existe un usuario con el ID ${ id }`
                });
            }


        break;
        
        case 'productos':
            //buscar de productos por el ID
            modelo =  await Producto.findById( id );
            //si no hay conincidencia
            if ( !modelo ) {
                return res.status( 400 ).json({
                    msg: `No existe un producto con el ID ${ id }`
                });
            }


        break;

        default:
            //este mensaje es en caso de que cuando se suba al servidor o repositorio muestre este mensaje podria ser que se haya olvidado validar algo 
            return res.status( 500 ).json({ msg: 'Se me olvidó validar esto' });

    }

    //ESTA FUNCION SOLO SE EJECUTARA SI LA PROPIEDAD IMG EXISTE, Y SI EXISTE EL PATH DE LA IMAGEN, ENTONCES BORRARA LA IMAGEN/ARCHIVO
    //Limpiar imágenes previas
    //verificar si el modelo.img existe es decir si existela propieda img del modelo usuarios/productos pero eso no quiere decir que la imagen exista
    if ( modelo.img) {
        //hay que borrar la imagen del servidor
        //construimos la ruta
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );

        //VERIFICAR SI EXISTE EL PATH
        //.existsSync = verifica si existe un PATH
        if ( fs.existsSync( pathImagen ) ) {
            //si existe, borramos la imagen
            fs.unlinkSync( pathImagen );
        }

    }

         
    /*
        Esto funciona tanto para guardar imagenes del modelo Usuarios como para Productos
    */
    //modelo trae Usuarios o Productos
    //creacion de la imagen para coleccion usuarios/productos
    //en coleccion trae el nombre de la carpeta donde se guardara la imagen y de no existir crea dicha carpeta
    const nombre = await subirArchivo( req.files, undefined, coleccion );
    //guardar con el nombre del archivo
    modelo.img = nombre;

    //por ultimo lo guardamos en la base de datos
    await modelo.save();

    //retornemos al modelo
    res.json( modelo );

} 

//controlador para actualizar imagen MEDIANTE CLOUDINARY
//esta funcion es la que vamos aestar usando para guardar las imagenes en CLOUDINARY
const actualizarImagenCloudinary = async( req, res = response) => {

    //desestructurar el id y la coleccion del req.params
    const { id, coleccion } = req.params;
    //se va a establecer el valor de modelo de forma condicional
    let modelo;

    switch( coleccion ){
        case 'usuarios':
            //buscar del modelo usuario por el ID
            modelo =  await Usuario.findById( id );
            //si no hay conincidencia
            if ( !modelo ) {
                return res.status( 400 ).json({
                    msg: `No existe un usuario con el ID ${ id }`
                });
            }


        break;
        
        case 'productos':
            //buscar de productos por el ID
            modelo =  await Producto.findById( id );
            //si no hay conincidencia
            if ( !modelo ) {
                return res.status( 400 ).json({
                    msg: `No existe un producto con el ID ${ id }`
                });
            }


        break;

        default:
            //este mensaje es en caso de que cuando se suba al servidor o repositorio muestre este mensaje podria ser que se haya olvidado validar algo 
            return res.status( 500 ).json({ msg: 'Se me olvidó validar esto' });

    }

    //ESTA FUNCION SOLO SE EJECUTARA SI LA PROPIEDAD IMG EXISTE, Y SI EXISTE EL PATH DE LA IMAGEN, ENTONCES BORRARA LA IMAGEN/ARCHIVO
    //Limpiar imágenes previas
    //verificar si el modelo.img existe es decir si existela propieda img del modelo usuarios/productos pero eso no quiere decir que la imagen exista
    if ( modelo.img) {
        //conrtar nombre de la imagen para poder identificarla
        //https://res.cloudinary.com/dy9prn3ue/image/upload/v1677728018/kykdj6ef9vnvj1xwmwip.jpg
        const nombreArr = modelo.img.split('/');
        //obtener la ultima posicion del arreglo, asi obtenemos la ultima posicion de un arreglo nombreArr.length - 1
        const nombre = nombreArr[ nombreArr.length - 1 ];
        //volvemos a cortar con un split() el arreglo
        const [ public_id ] = nombre.split('.'); // ['kykdj6ef9vnvj1xwmwip']
        //eliminar imagen de cloudinary mediante el PUBLIC_ID
        cloudinary.uploader.destroy( public_id );

    }

    /*
        Esto funciona tanto para guardar imagenes del modelo Usuarios como para Productos
    */
    //subir a CLOUDINARY
    // console.log( req.files.archivo);
    //el tempFilePath viene de ---> req.files.archivo
    //tempFilePath contiene temporalmente el archivo
    const { tempFilePath } = req.files.archivo;
    //subir el archivo
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath ); //esto regresa una promesa
    // res.json( resp );
    //de la respuesta no necesitamos mas que el secure_url
    modelo.img = secure_url;



    //por ultimo lo guardamos en la base de datos
    await modelo.save();
    //retornemos al modelo
    res.json( modelo );

} 

//controlador para mostrar imagen
const mostrarImagen = async( req, res = response ) => {
    
    //desestructurar el id y la coleccion del req.params
    const { id, coleccion } = req.params;
    //se va a establecer el valor de modelo de forma condicional
    let modelo;

    switch( coleccion ){
        case 'usuarios':
            //buscar del modelo usuario por el ID
            modelo =  await Usuario.findById( id );
            //si no hay conincidencia
            if ( !modelo ) {
                return res.status( 400 ).json({
                    msg: `No existe un usuario con el ID ${ id }`
                });
            }


        break;
        
        case 'productos':
            //buscar de productos por el ID
            modelo =  await Producto.findById( id );
            //si no hay conincidencia
            if ( !modelo ) {
                return res.status( 400 ).json({
                    msg: `No existe un producto con el ID ${ id }`
                });
            }


        break;

        default:
            //este mensaje es en caso de que cuando se suba al servidor o repositorio muestre este mensaje podria ser que se haya olvidado validar algo 
            return res.status( 500 ).json({ msg: 'Se me olvidó validar esto' });

    }

    //ESTA FUNCION SOLO SE EJECUTARA SI LA PROPIEDAD IMG EXISTE, Y SI EXISTE EL PATH DE LA IMAGEN, ENTONCES BORRARA LA IMAGEN/ARCHIVO
    //Limpiar imágenes previas
    //verificar si el modelo.img existe es decir si existela propieda img del modelo usuarios/productos pero eso no quiere decir que la imagen exista
    if ( modelo.img) {
        //hay que borrar la imagen del servidor
        //construimos la ruta
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );

        //VERIFICAR SI EXISTE EL PATH
        //.existsSync = verifica si existe un PATH
        if ( fs.existsSync( pathImagen ) ) {
            //retornamos el PATH de la imagen
            return res.sendFile( pathImagen );
        }

    }


    //
    // /Path en caso de que no haya ninguna imagen del usuario o producto
    const pathNoImagen = path.join( __dirname, '../assets/no-image.jpg');
    //mostrar la imagen, no imagen.jpg
    //retornamos el PATH de la imagen
    res.sendFile( pathNoImagen );

}

//exports
module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}