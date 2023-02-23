//express para ayudarnos con el tipado
const { response } = require("express");
//importamos Usuario
const { Usuario, Categoria, Producto } = require("../models");
//importar ObjectId para poder saber si algo es un ID de mongo o no
const { ObjectId } = require('mongoose').Types;

//coleccionar permitidas
//aqui iran todas las colecciones que se pueden usar para hacer las busquedas
const coleccionesPermitidas = [
    'categoria',
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
        res.json({
            //preguntamos si viene el usuario si viene regresamos los resultados sino regresamos un arreglo vacio ya que no viene informacion
            results: ( usuario ) ? [ usuario ] : []
        });
    }

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
            //mandamos la funcion buscarUsuarios
            buscarUsuarios( termino, res );
        break;
        case 'categoria':
            
        break;
        case 'productos':
            
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