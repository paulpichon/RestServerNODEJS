//para ayudarnos con el tipado importamos response de express
const { response } = require("express");
//importar los modelos
//tambien se puede poner require('../models/index'), pero poner INDEX al final esta demas ya que NODE detecta automaticamente el archivo INDEX
const { Categoria } = require('../models');

//obtenerCategorias - Paginado - Total - Populate
const obtenerCategorias = async(req, res = response) => {
    //************************************************************************* */
    //desestructurar de los argumentos que vienen en el request.query
    //en caso de que no venga el limite en los parametros de la URL le ponemos por defecto limite = 5
    //desde = 0 desde que registro me va a mostrar informacion por ejemplo desde = 5
    const { limite = 5, desde = 0} = req.query;
    //variable para que determinemos el estado de las categorias true/false 
    //categorias que solo esten activos estado = true ---> dentro de .find({ estado: true })
    const query = { estado: true }
    
    //GET de todos los usuarios
    //creamos una Promesa ---> Promise.all() para que solucionar el retardo del conteo de los registros que se hace despues de traer todas las categorias
    //permite crear un arreglo con todas las PROMESAS que quiero que se ejecuten
    //la respuesta sera una coleccion de promesas
    //aplicamos desestructuracion de ARREGLOS
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre') //traer la informacion del usuario que creo la categoria
            //especifica desde donde nostraera informacion
            .skip(Number( desde ))
            //limitar el numero de querys que nos traera la consulta
            //.limit()   ---> dentro de los parentesis va el numero de registros que quiero que traiga
            //por si las dudas convertimos limite de un string a un numero
            .limit( Number( limite ) )
    ]);

    //retornamos la respuesta
    res.json({ 
        total,
        categorias 
    });
}

//obtener una sola categoria
const obtenerCategoria = async( req, res = response ) => {
    //obtenemos el ID que viene en la URL
    const { id } = req.params;
    //buscamos por ID
    //solo mostrar nombre del usuario que creo la categoria con .populate()
    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');
    //respuesta
    res.json( categoria );
}

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
//actualizar una categoria
const actualizarCategoria = async( req, res = response ) => {
    //extraer el ID
    const { id } = req.params;
    //extraemos tanto estado y usuario para quye no sean modificados desde el formulario desde lo que venga en el REQUEST.BODY
    //y todo lo demas lo ponemos en el ...data
    const { estado, usuario, ...data } = req.body;
    //  Poner en mayusculas el nombre de la categoria
    //a estas alturas ya esta validado que venga el nombre de la categoria
    data.nombre = data.nombre.toUpperCase();
    //establecer el usuario --> el que haya hecho la ultima modificacion
    data.usuario = req.usuario._id; //aqui se asigna el usuario que modifico la categoria
    
    //actualizar el registro
    //.findByIdAndUpdate('id de lo que se va a modificar', 'informacion con lo que se va a modificar', { new:true })
    //{ new:true } ---> retorna el registro modificado
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new:true });
    
    //response
    res.json( categoria );

}

//fucion para eliminar una categoria
const borrarCategoria = async( req, res = response ) => {
    //obtenemos el ID el cual ya  debe de exisir despues de haber hecho las validaciones
    const { id } = req.params;
    //Recordatorio: no se va a borrar el registro solo a cambiar el estado del mismo
    //con esto cambiamos el estado de la categoria { estado: false }
    //{ new: true} para reflejar el registro borrado
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true});

    //response
    res.json( categoriaBorrada );

}


//exportamos las funciones
module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}
