//mongoose
const { Schema, model } = require('mongoose');

//funcion
const ProductoSchema = Schema({
    nombre: {
        type: String,
        required : [ true, 'El nombre es ogligatorio'],
        unique: true
    },
    estado: { //referencia a si esta eliminado o no
        type: Boolean,
        default: true,
        required : true //Aunque venga por defecto:true, debemos mandar el valor para que no genere un error
    },
    //para crear una categoria yo necesito saber que  usuario fue el que la creo
    //este es el type que se debe poner para saber que viene de MONGO
    //y la referencia para saber a que collecion o a que Object.Id dirigirse
    //en este caso ref: 'Usuario', Usuario ---> viene de usuario.js nombre del Schema
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', //nombre del otro Schema de MONGO
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria', //nombre del otro Schema de Mongo
        required: true
    },
    descripcion: { type: String },//hace referencia a la existencia del producto
    disponible: { type: Boolean, default: true },//saber si esta disponible el producto o no
    img: { type: String }//imagen del producto
});


//esto es para quitar ciertas campos que no quiere tener en la respuesta del JSON una vez grabado en la BD
//sobreescribir un metodo llamado toJSON
//debe ser igual a una funcion NORMAL ya que usaremos THIS
ProductoSchema.methods.toJSON = function() {
    //desestructurar algo que viene de .toObject()
    //toObject() esto genera una instancia de ProductoSchema con sus valores respectivos
    //y dentro de las llaves ponemos lo que queremos quitar
    //y el resto de argumentos los unificamos con el operador "rest" --->...producto
    const { __v, estado,...producto } = this.toObject();
    //y retornamos la categoria
    return producto;
 }


//exportar

//se debe poner en singular ya que mongo le agrega la "S" al final de cada nombre por ejemplo
//casa = casa"s"
//Usuario = Usuario"s"
//Producto = Producto"s" --> nombre de la tabla en MONGO
//ademas debe inicar con letra mayuscula
//y por ultimo pasamos como segundo argumento nuestro Schema en este caso es ProductoSchema
module.exports = model( 'Producto', ProductoSchema );