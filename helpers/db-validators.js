//importar Role de models
const Role = require('../models/role');
//Usuario = para verificar el email
//Categoria = verificar si existe categoria por ID
const { Usuario, Categoria } = require('../models');

/********VALIDADORES DE ROLES *******/
const esRoleValido = async(rol = '') => {
    //verificar si existe  el rol en la coleccion de la base de datos
    const existeRol = await Role.findOne({ rol });
    
    //pero si no existe
    if (!existeRol) {
        //presonalizamos nuestro mensaje de error
        throw new Error(`El rol ${ rol } no está registrado en la base de datos`);
    }

}

/***VALIDADORES DE USUARIOS****/

//funcion para verificar si un email existe
const existeEmail = async( correo = '' ) => {
    //verificar si el correo ya existe en la coleccion de la base de datos
    //findOne() --> metodo/funcion para verificar si hay algo repetido
    const verificarEmail = await Usuario.findOne({ correo });

    if ( verificarEmail ) {
        //presonalizamos nuestro mensaje de error
        throw new Error(`Ese correo ${ correo } ya esta registrado`);
    }
}

//Funcion para validar si existe un usuario por ID
const existeUsuarioPorId = async( id) => {
    //verificar si el correo ya existe en la coleccion de la base de datos
    //findOne() --> metodo/funcion para verificar si hay algo repetido
    //.findById() --> encuentra un registro por ID
    const existeUsuario = await Usuario.findById(id);
    //si es NULL
    if ( !existeUsuario ) {
        //presonalizamos nuestro mensaje de error
        throw new Error(`El id ${ id } no existe`);
    }
}

//VALIDADORES DE CATEGORIAS

//validar existeCategoria del controlador categorias.js
const existeCategoriaPorId = async( id) => {
    //.findById() --> encuentra un registro por ID
    const existeCategoria = await Categoria.findById(id);
    //si es NULL
    if ( !existeCategoria ) {
        //presonalizamos nuestro mensaje de error
        throw new Error(`El id ${ id } no existe`);
    }
}

//exportar 
module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId,
    existeCategoriaPorId
}