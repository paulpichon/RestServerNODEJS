//vamos a importar el PATH
const path = require('path');
//UUID para cambiar el nombre de los archivos por ID´S
const { v4: uuidv4 } = require('uuid');
// uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

//subir archivo
//de ( files ) es de donde vamos a sacar tanto el resolve como el reject
//las extensiones validas las vamos a poner como un arguemnto con un arreglo de las extensiones permitidas para que si el dia de mañana se necesitan cabiar
//y un tercer argumento que es el nombre de la carpeta donde quiero que se aloje el archivo
const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    //Promise()
    return new Promise( ( resolve, reject ) => {

        //desestructuramos
        //establecer lo que viene en el require.files()
        const { archivo } = files;
        //hacer split al nombre del archivo a subir
        const nombreCortado = archivo.name.split('.');
        
        //extension del archivo
        //la extension va a ser igual a la ultima posicion del arreglo nombreCortado
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        //validar si empata la extension que subimos con la del arreglo extensionesValidas
        //si no hay coincidencias
        if ( !extensionesValidas.includes( extension )  ) {
            //reject()
            //mensaje de error
            return reject(`La extensión ${ extension } no es permitida ${ extensionesValidas }`);

        }

        //vamos a usar UUID NPM para cambiar el nombre de los archivos por ID´S

        //nombre temporal del archivo y le añadimos la extension
        const nombreTemp = uuidv4() + '.' + extension;

        //construccion del path a donde moveremos el archivo
        //The join() method creates and returns a new string by concatenating all of the elements in an array
        //el __dirname es donde actualmente me encuentro
        //la carpeta es donde queremos que se copie/mueva la imagen subida
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp );

        //.mv() ---> mueve el archivo
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject( err );
            }
            //devolvemos el nombre del archivo
            resolve( nombreTemp );
        });        

    });

}


//exportar modulos
module.exports = {
    subirArchivo
}