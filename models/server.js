//manejaremos CLASES 
//importacion de express
const express = require('express');
//importar CORS
const cors = require('cors');
//importar conexion a base de datos
const { dbConnection } = require('../database/config.js');

class Server {
    //constructor
    constructor() {
        //estosignifica que creacion el servidor como una propiedad de la clase Server
        this.app = express();
        //declaramos el puerto donde estaremos escuchando
        this.port = process.env.PORT;

        //Definir las rutas que manejamos para poder tenerlas a la vista
        this.usuariosPath = '/api/usuarios';

        //conectar a la base de datos
        this.conectarDB();

        //middlewares
        //los middlewares  son los que van añadir otra funcionalidad al web server
        this.middlewares();


        //rutas de mi aplicacion
        //hacemos llamado a las rutas
        this.routes();
    }

    //metodo para conectarse a la base de datos
    async conectarDB() {
        await dbConnection();
    }

    //middleware
    middlewares() {

        //CORS
        this.app.use( cors() );

        //Lectura y Parseo del body que sera lo que manda el usuario en una request
        //recordar que para ser un middleware se usa .use() y le pasamos como argumento express.json() que es una funcion
        this.app.use( express.json() );

        //Directorio público
        //la palabra reservada .use() nos indica que es un middleware
        this.app.use( express.static('public') );

    }



    //creacion de una propiedad llamada routes que manejara todas las rutas de del rest server
    routes() {
        //para poder usar las rutas del archivo user.js
        //this.usuariosPath -> valor definido en el constructor
        this.app.use( this.usuariosPath, require('../routes/usuarios'));
    }
    //creacion de metodo listen que significara que estara escuchando lo que pasa en ese puerto
    listen() {
        this.app.listen( this.port, () => {
            console.log("Servidor correindo en el puerto", this.port);
        });
    }

}

//exportar la clase
module.exports = Server;