//para ayudarnos con el tipado importamos response de express
const { response } = require("express");
//importar los modelos
//tambien se puede poner require('../models/index'), pero poner INDEX al final esta demas ya que NODE detecta automaticamente el archivo INDEX
const { Categoria } = require('../models');

const crearCategoria = async( req, res = response ) => {

    //extraer el nombre que viene en la RESQUEST.body
    //y lo convertimos a letras mayuculas con .toUpperCase()
    //Para almacenar las categorias en MAYUSCULA
    const nombre = req.body.nombre.toUpperCase();

    //una vez tenemos el nombre, vamos a revisar si existe una categoria previa con el mismo nombre
    //utilizamos .findOne() para encontrar coincidencias
    const categoriaDB = await Categoria.findOne({ nombre });
    //si existe coincidencia quiere decir que ya hay una categoria con ese nombre y nostramos el error
    if( categoriaDB ) {
        //mostrar mensaje
        return res.status( 400 ).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    //generar la data a guardar
    //mandamos el usuario ya que es required
    const data = {
        nombre, 
        usuario: req.usuario._id //ponemos el _id en lugar de uid ya que en mongo lo tenemos como _id
    }

    //crear la data con una nueva instancia de Categoria
    const categoria = new Categoria( data );
    //guardarla en la BD
    await categoria.save();

    //response con estatus 201 que indica que se guardo algo enla BD de forma exitosa
    res.status(201).json( categoria );
}   



//exportamos
module.exports = {
    crearCategoria
}
