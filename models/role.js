//mongoose
const { Schema, model } = require('mongoose');

//funcion
const RoleSchema = Schema({
    rol: {
        type: String,
        required : [ true, 'El rol es ogligatorio']
    }
});


//exportar

//se debe poner en singular ya que mongo le agrega la "S" al final de cada nombre por ejemplo
//casa = casa"s"
//Usuario = Usuario"s"
//Role = Role"s" --> nombre de la tabla en MONGO
//ademas debe inicar con letra mayuscula
//y por ultimo pasamos como segundo argumento nuestro Schema en este caso es UsuarioSchema
module.exports = model( 'Role', RoleSchema );