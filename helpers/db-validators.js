//importar Role de models
const Role = require('../models/role');
//para verificar el email
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {
    //verificar si existe  el rol en la coleccion de la base de datos
    const existeRol = await Role.findOne({ rol });
    
    //pero si no existe
    if (!existeRol) {
        //presonalizamos nuestro mensaje de error
        throw new Error(`El rol ${ rol } no está registrado en la base de datos`);
    }

}

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

//exportar 
module.exports = {
    esRoleValido,
    existeEmail
}