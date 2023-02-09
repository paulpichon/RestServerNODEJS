//construccion del modelo
//uso de Schema y model petenecientes a mongoose
const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
    nombre: {
       type: String,
       required: [true, 'El nombre es obligatorio'] 
    },
    correo: {
       type: String,
       required: [true, 'El correo es obligatorio'],
       unique: true 
    },
    password: {
       type: String,
       required: [true, 'La contraseña es obligatoria']
    },
    img: {
       type: String
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
     },
    google: {
        type: Boolean,
        default: false
     }
});




//exportar funcion
//se debe poner en singular ya que mongo le agrega la "S" al final de cada nombre por ejemplo
//casa = casa"s"
//Usuario = Usuario"s"
//ademas debe inicar con letra mayuscula
//y por ultimo pasamos como segundo argumento nuestro Schema en este caso es UsuarioSchema
module.exports = model('Usuario', UsuarioSchema );
