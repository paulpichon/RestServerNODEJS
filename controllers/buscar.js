//express para ayudarnos con el tipado
const { response } = require("express");
//importamos Usuario
const { Usuario, Categoria, Producto } = require("../models");
//importar ObjectId para poder saber si algo es un ID de mongo o no
const { ObjectId } = require('mongoose').Types;

//coleccionar permitidas
//aqui iran todas las colecciones que se pueden usar para hacer las busquedas
const coleccionesPermitidas = [
    'categorias',
    'usuarios',
    'productos',
    'roles'
];

//termino de busqueda ---> lo que se quiere encontrar
//podemos iniciar el termino como un string vacio
const buscarUsuarios = async( termino = '', res = response ) => {

    //verificar si algo es un ID de mongo
    const esMongoID = ObjectId.isValid( termino ); //true o false

    //si es un ID de mongo
    if ( esMongoID ) {
        //busquemos coincidencias del ID contra el termino
        const usuario = await Usuario.findById( termino );
        //respuesta
        return res.json({
            //preguntamos si viene el usuario si viene regresamos los resultados sino regresamos un arreglo vacio ya que no viene informacion
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    //vamos a crear una expresion regular para poder hacer que nuestra busqueda sea key sensitive, es decir que se pueda buscar con minisculas o mayusculas y aun asi encontrar coincidencias
    // 'i' ----> esto hace que sea insensible a mayusculas y minusculas
    const regex = new RegExp( termino, 'i');

    //buscar por nombre de usuario
    //mandamos el regex para que no haya problema si viene en mayusculas o minusculas
    //find() retorna un arreglo ya sea vacio o con informacion si es que encontro algo
    const usuarios = await Usuario.find({
        //$or --> es una atributo propio de MONGO y sirve para buscar mas de una expresion
        $or:[{nombre: regex, estado: true}, { correo: regex, estado: true }],
        //coincidnecia con el nombre del usuario y que ademas deben de estar como usuarios activos ---> {nombre: regex, estado: true}
        //y en correo tambien mostramos solo a los que estan activos usando el operador $and de MONGO
        $and: [{ estado: true}]
    });

    res.json({
        results: usuarios
    });

}

//termino de busqueda ---> lo que se quiere encontrar
//podemos iniciar el termino como un string vacio
const buscarCategorias = async( termino = '', res = response ) => {

    //verificar si algo es un ID de mongo
    const esMongoID = ObjectId.isValid( termino ); //true o false

    //si es un ID de mongo
    if ( esMongoID ) {
        //busquemos coincidencias del ID contra el termino
        const categoria = await Categoria.findById( termino );
        //respuesta
        return res.json({
            //preguntamos si viene la categoria si viene regresamos los resultados sino regresamos un arreglo vacio ya que no viene informacion
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    //vamos a crear una expresion regular para poder hacer que nuestra busqueda sea key sensitive, es decir que se pueda buscar con minisculas o mayusculas y aun asi encontrar coincidencias
    // 'i' ----> esto hace que sea insensible a mayusculas y minusculas
    const regex = new RegExp( termino, 'i');

    //buscar por nombre de usuario
    //mandamos el regex para que no haya problema si viene en mayusculas o minusculas
    //find() retorna un arreglo ya sea vacio o con informacion si es que encontro algo
    //buscamos por nombre y que el estado este en TRUE
    const categorias = await Categoria.find({nombre: regex, estado: true});

    res.json({
        results: categorias
    });

}

//termino de busqueda ---> lo que se quiere encontrar
//podemos iniciar el termino como un string vacio
const buscarProductos = async( termino = '', res = response ) => {

    //verificar si algo es un ID de mongo
    const esMongoID = ObjectId.isValid( termino ); //true o false

    //si es un ID de mongo
    if ( esMongoID ) {
        //busquemos coincidencias del ID contra el termino
        const producto = await Producto.findById( termino )
                                        .populate('categoria', 'nombre');
        //respuesta
        return res.json({
            //preguntamos si viene el producto si viene regresamos los resultados sino regresamos un arreglo vacio ya que no viene informacion
            results: ( producto ) ? [ producto ] : []
        });
    }

    //vamos a crear una expresion regular para poder hacer que nuestra busqueda sea key sensitive, es decir que se pueda buscar con minisculas o mayusculas y aun asi encontrar coincidencias
    // 'i' ----> esto hace que sea insensible a mayusculas y minusculas
    const regex = new RegExp( termino, 'i');

    //buscar por nombre de usuario
    //mandamos el regex para que no haya problema si viene en mayusculas o minusculas
    //find() retorna un arreglo ya sea vacio o con informacion si es que encontro algo
    //buscamos por nombre y que el estado este en TRUE
    const productos = await Producto.find({nombre: regex, estado: true})
                                    .populate('categoria', 'nombre');

    res.json({
        results: productos
    });

}

const buscar = ( req, res = response) => {

    //extraemos la coleccion y el termino de busqueda
    //coleccion y termino vienen en la URL
    const { coleccion, termino } = req.params;

    //verificar si dentro del arreglo coleccionesPermitidas esta la coleccion que viene en la URL
    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        //si no coincide ninguna mostramos un error
        return res.status( 400 ).json({ 
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }

    //switch
    switch ( coleccion ) {
        case 'usuarios':
            //mandamos la funcion buscarUsuarios junsto con la res: response
            buscarUsuarios( termino, res );
        break;
        case 'categorias':
            //mandamos la funcion buscarCategorias junsto con la res: response
            buscarCategorias( termino, res );
        break;
        case 'productos':
            //mandamos la funcion buscarProductos junto con la res: response
            buscarProductos( termino, res );
        break;
        //por defectoponemos un error 500 indicando que es un error nuestro
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta búsqueda: contactar al BACKEND'
            })
    }
}


//exportar
module.exports = {
    buscar
}