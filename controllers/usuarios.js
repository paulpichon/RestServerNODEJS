//express -> response
const { response, request } = require('express');
//importamos bcryptj para encriptar las contraseñas
const bcryptjs = require('bcryptjs');
//importar el modelo para poder grabar en la base de datos
//ponemos U al inicio de usuario porque esto nos permitira crear instancias de esta constante
//Es un estandar ponerlo asi
const Usuario = require('../models/usuario');



//funciones

//usuarios GET
//asignamos response -> res
//asignamos request -> req
const usuariosGet = async(req = request, res = response) => {

    //extraer params, cabe resaltar que para extraer parametros de la url al ser una peticion GET solo se hace en el controlador
    //se puede desestructurar
    //const query = req.query;
    //desestructurar
    //recordar que si no viene un parametro en la url, nosotros podemos definir un valor por defecto al desestructurar
    //const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

    //************************************************************************* */
    //desestructurar de los argumentos que vienen en el request.query
    //en caso de que no venga el limite en los parametros de la URL le ponemos por defecto limite = 5
    //desde = 0 desde que registro me va a mostrar informacion por ejemplo desde = 5
    const { limite = 5, desde = 0} = req.query;
    //variable para que determinemos el estado de los usuario true/false 
    //usuarios que solo esten activos estado = true ---> dentro de .find({ estado: true })
    const query = { estado: true }
    //GET de todos los usuarios
    //find() ---> muestra los usarios(TODOS)
    //adicional a esto le podemos validar ciertos cosas mas , como que desde y limite sean solo numeros
    //ademas vamos a mostrar a los usuarios que solo esten activos estado = true ---> dentro de .find({ estado: true })
    //const usuarios = await Usuario.find(query)
        //especifica desde donde nostraera informacion
        //.skip(Number( desde ))
        //limitar el numero de querys que nos traera la consulta
        //.limit()   ---> dentro de los parentesis va el numero de registros que quiero que traiga
        //por si las dudas convertimos limite de un string a un numero
        //.limit( Number( limite ) );

    //Retornar el numero toal de registros en una coleccion
    //.countDocuments() ---> retorna el numer de registros
    //ademas vamos a contar a los usuarios que solo esten activos estado = true ---> dentro de .find({ estado: true })
    //const total = await Usuario.countDocuments(query);


    //creamos una Promesa ---> Promise.all() para que solucionar el retardo del conteo de los registros que se hace despues de traer todos los usuarios
    //permite crear un arreglo con todas las PROMESAS que quiero que se ejecuten
    //la respuesta sera una coleccion de promesas
    //aplicamos desestructuracion de ARREGLOS
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            //especifica desde donde nostraera informacion
            .skip(Number( desde ))
            //limitar el numero de querys que nos traera la consulta
            //.limit()   ---> dentro de los parentesis va el numero de registros que quiero que traiga
            //por si las dudas convertimos limite de un string a un numero
            .limit( Number( limite ) )
    ]);

    //en lugar de retornar total y usuario, retornamos la respuesta
    res.json({ 
        total,
        usuarios 
    });
};

//usuarios Post
const usuariosPost = async(req, res = response) => {

    //esto es lo que viene como peticion del usuario es el REQUEST-> req de nuestro parametro
    //podemos desestructurarlo
    //const body = req.body;
    const { nombre, correo, password, rol, img } = req.body;
    //creando una instancia de Usuario para poder grabar en la base de datos
    //y pasamos como argumento el body
    const usuario = new Usuario({ nombre, correo, password, rol, img });
    
    //Verificar si el correo esta repetido
    //findOne() --> metodo/funcion para verificar si hay algun correo repetido
    /*const existeEmail = await Usuario.findOne({ correo });

    if ( existeEmail ) {
        //regresamos un badRequest 400
        return res.status(400).json({
            msg: 'Ese correo ya esta registrado'
        });
    }*/

    //Encriptar la contraseña
    //por defecto .genSaltSync() tiene 10 en cuanto a seguridad(vueltas) pero se puede cambiar el valor
    //pero el que viene por default es bueno
    const salt = bcryptjs.genSaltSync();
    //encriptar contraseña  
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en base de datos
    //para decirle a mongo/mongoose que guarde el registro
    await usuario.save();
    //regresa el usuario grabado
    res.json({
        usuario
    });
};
//usuarios put
const usuariosPut = async(req, res = response) => {

    //ahora asignamos req.params.id a un variable que creamos
    //req.params.id --> id es el nombre que le dimos en el parametro del archivo usuarios.js
    //si tuviera otro nombre lo cambiamos -> req.params.idUsuario etc, etc
    //y al mismo tiempo si hay mas parametros entonces los podemos desestructurar
    //const id = req.params.id;

    //desestructuracion
    const { id } = req.params;
    //extraer lo que no necesito que se grabe en la base de datos
    //...resto ---> las demas propiedades
    //se extrae _id para que no haya un error de casteo: castError
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO: validar contra base de datos
    //si viene el password
    if( password ) {
        //por defecto .genSaltSync() tiene 10 en cuanto a seguridad(vueltas) pero se puede cambiar el valor
        //pero el que viene por default es bueno
        const salt = bcryptjs.genSaltSync();
        //encriptar contraseña  
        resto.password = bcryptjs.hashSync( password, salt );
    }

    //actualizar registro
    //.findByIdAndUpdate('ID', 'informacion que voy actualizar') ---> buscar por el ID y actualizarlo
    //si no es un ID valido crashea la app
    //{new: true} ----> para que nos devuelva el registro actualizado y no el anterior
    const usuario = await Usuario.findByIdAndUpdate( id, resto, {new: true} );

    //se imprime el objeto usuario en consola
    res.json({usuario});
}
//usuarios patch
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}
//usuarios delete
const usuariosDelete = async(req, res = response) => {

    //extraer el ID de los params
    const { id } = req.params;

    //BORRAR FISICAMENTE
    //ESTE PROCESO ES POCO RECOMENDADO
    //eliminar un usuario fisicamente .findByIdAndDelete() de la base de datos
    //const usuario = await Usuario.findByIdAndDelete( id );

    //FORMA RECOMENDADA
    //cambiamos el estado del usuario
    //.findByIdAndUpdate( id, { estado: false} ) de esta forma cambiamos el estado del usuario ya que verificamos que el ID si exista y sea un ID valido de MONGO
    //{new: true} ----> para que nos devuelva el registro actualizado y no el anterior ---> ( id, { estado: false}, {new: true} )
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false}, {new: true} );

    
    //retornamos el usuario que acaba de ser borrado
    //TODO: imprimir usuario y usuarioAutenticado
    res.json(usuario);
}


//exports
module.exports = { 
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
};