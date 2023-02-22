//para ayudarnos con el tipado importamos response de express
const { response } = require("express");
//importar los modelos
//tambien se puede poner require('../models/index'), pero poner INDEX al final esta demas ya que NODE detecta automaticamente el archivo INDEX
const { Producto } = require('../models');

//obtenerProductos - Paginado - Total - Populate
const obtenerProductos = async(req, res = response) => {
    //************************************************************************* */
    //desestructurar de los argumentos que vienen en el request.query
    //en caso de que no venga el limite en los parametros de la URL le ponemos por defecto limite = 5
    //desde = 0 desde que registro me va a mostrar informacion por ejemplo desde = 5
    const { limite = 5, desde = 0} = req.query;
    //variable para que determinemos el estado de las categorias true/false 
    //categorias que solo esten activos estado = true ---> dentro de .find({ estado: true })
    const query = { estado: true }
    
    //GET de todos las categorias
    //creamos una Promesa ---> Promise.all() para que solucionar el retardo del conteo de los registros que se hace despues de traer todos los productos
    //permite crear un arreglo con todas las PROMESAS que quiero que se ejecuten
    //la respuesta sera una coleccion de promesas
    //aplicamos desestructuracion de ARREGLOS
    const [ total, productos ] = await Promise.all([
        //hace el conteo del total de regsitros ---> countDocuments
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre') //traer la informacion del usuario que creo la categoria
            //especifica desde donde nostraera informacion
            .populate('categoria', 'nombre') //traer la informacion de la categoria a donde esta relacionado el producto
            .skip(Number( desde ))
            //limitar el numero de querys que nos traera la consulta
            //.limit()   ---> dentro de los parentesis va el numero de registros que quiero que traiga
            //por si las dudas convertimos limite de un string a un numero
            .limit( Number( limite ) )
    ]);

    //retornamos la respuesta
    res.json({ 
        total,
        productos 
    });
}

//obtener un solo producto
const obtenerProducto = async( req, res = response ) => {
    //obtenemos el ID que viene en la URL
    const { id } = req.params;
    //buscamos por ID
    //solo mostrar nombre del usuario que creo la categoria con .populate()
    //y tambien mostramos con .popultae() el nombre de la categoria
    const producto = await Producto.findById( id )
                                    .populate('usuario', 'nombre')
                                    .populate('categoria', 'nombre');
    //respuesta
    res.json( producto );
}

const crearProducto = async( req, res = response ) => {

    //extraemoa aquello que no se debe modificar y lo demas lo almacenamos en el rest ...body
    const { estado, usuario, ...body } = req.body;

    //utilizamos .findOne({ nombre }) para encontrar coincidencias
    //asignamos el nombre ---> nombre : body.nombre
    const productoDB = await Producto.findOne({ nombre : body.nombre });
    //si existe coincidencia quiere decir que ya hay una categoria con ese nombre y nostramos el error
    if( productoDB ) {
        //mostrar mensaje
        return res.status( 400 ).json({
            msg: `El produto ${ productoDB.nombre }, ya existe`
        });
    }

    //generar la data a guardar
    //mandamos el usuario ya que es required
    //para no mandar uno por uno las propiedades mandamos ...body
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),//convertimos el nombre a mayusculas 
        usuario: req.usuario._id //ponemos el _id en lugar de uid ya que en mongo lo tenemos como _id
    }

    //crear la data con una nueva instancia de Categoria
    const producto = new Producto( data );
    //guardarla en la BD
    await producto.save();

    //response con estatus 201 que indica que se guardo algo enla BD de forma exitosa
    res.status(201).json( producto );
}   
//actualizar un producto
const actualizarProducto = async( req, res = response ) => {
    //extraer el ID
    const { id } = req.params;
    //extraemos tanto estado y usuario para quye no sean modificados desde el formulario desde lo que venga en el REQUEST.BODY
    //y todo lo demas lo ponemos en el ...data
    const { estado, usuario, ...data } = req.body;

    //verificar si viene el nombre del producto para convertirlo en mayusculas
    if ( data.nombre ) {
        //  Poner en mayusculas el nombre del producto
        data.nombre = data.nombre.toUpperCase();    
    }

    
    //establecer el usuario --> el que haya hecho la ultima modificacion
    data.usuario = req.usuario._id; //aqui se asigna el usuario que modifico la categoria
    
    //actualizar el registro
    //.findByIdAndUpdate('id de lo que se va a modificar', 'informacion con lo que se va a modificar', { new:true })
    //{ new:true } ---> retorna el registro modificado
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    //response
    res.json( producto );

}

//fucion para eliminar un producto
const borrarProducto = async( req, res = response ) => {
    //obtenemos el ID el cual ya  debe de exisir despues de haber hecho las validaciones
    const { id } = req.params;
    //Recordatorio: no se va a borrar el registro solo a cambiar el estado del mismo
    //con esto cambiamos el estado de la categoria { estado: false }
    //{ new: true} para reflejar el registro borrado
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true});

    //response
    res.json( productoBorrado );

}


//exportamos las funciones
module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}
