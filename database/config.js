//conexion de la BASE DE DATOS
//import/require mongoose
const mongoose = require('mongoose');

//
const dbConnection = async() => {

    try {
        //para que no aparezca un error
        //debido a la version 6 de mongoose
        mongoose.set('strictQuery', false);
        //conexion a mongoose
        //al ser una promesa podemos usar await para esperar la conexion
        //y dentro del .connect() va el link de la conexion qu en esta caso esta en una variable de entorno
        //tambien se debe configurar ciertas propiedades
        await mongoose.connect( process.env.MONGODB_CNN);
       

        //mensaje de success
        console.log('Base de datos online');

        
    } catch (error) {
        console.log( error );
        //este error se mostrara en caso de que  haya algun problema con la base de datos
        throw new Error('Error a la hora de iniciar la base de datos');
    }

}


//exportar la funcion
module.exports = {
    dbConnection
}