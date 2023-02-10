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

//esto es para quitar ciertas campos que no quiere tener en la respuesta del JSON una vez grabado en la BD
//sobreescribir un metodo llamado toJSON
//debe ser igual a una funcion NORMAL ya que usaremos THIS
UsuarioSchema.methods.toJSON = function() {
   //desestructurar algo que viene de .toObject()
   //toObject() esto genera una instancia de UsuarioSchema con sus valores respectivos
   //y dentro de las llaves ponemos lo que queremos quitar
   //y el resto de argumentos los unificamos con el operador "rest"
   const { __v, password, ...usuario } = this.toObject();
   //y retornamos el usuario
   return usuario;
}



//exportar funcion
//se debe poner en singular ya que mongo le agrega la "S" al final de cada nombre por ejemplo
//casa = casa"s"
//Usuario = Usuario"s"
//ademas debe inicar con letra mayuscula
//y por ultimo pasamos como segundo argumento nuestro Schema en este caso es UsuarioSchema
module.exports = model('Usuario', UsuarioSchema );
