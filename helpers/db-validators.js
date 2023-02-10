//importar Role de models
const Role = require('../models/role');

const esRoleValido = async(rol = '') => {
    //verificar si existe  el rol en la coleccion de la base de datos
    const existeRol = await Role.findOne({ rol });
    
    //pero si no existe
    if (!existeRol) {
        //presonalizamos nuestro mensaje de error
        throw new Error(`El rol ${ rol } no está registrado en la base de datos`);
    }

}

//exportar 
module.exports = {
    esRoleValido
}