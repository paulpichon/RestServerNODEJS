//manejaremos CLASES 
//importacion de express
const express = require('express')

class Server {
    //constructor
    constructor() {
        //estosignifica que creacion el servidor como una propiedad de la clase Server
        this.app = express();
        //declaramos el puerto donde estaremos escuchando
        this.port = process.env.PORT;

        //middlewares
        //los middlewares  son los que van añadir otra funcionalidad al web server
        this.middlewares();


        //rutas de mi aplicacion
        //hacemos llamado a las rutas
        this.routes();
    }

    //middleware
    middlewares() {

        //Directorio público
        this.app.use( express.static('public') );

    }



    //creacion de una propiedad llamada routes que manejara todas las rutas de del rest server
    routes() {
        //Peticiones GET
        this.app.get('/api', (req, res) => {
            res.json({
                msg: 'get API'
            });
        });
        //Peticiones put
        this.app.put('/api', (req, res) => {
            res.json({
                msg: 'put API'
            });
        });
        //Peticiones post
        this.app.post('/api', (req, res) => {
            res.json({
                msg: 'post API'
            });
        });
        //Peticiones delete
        this.app.delete('/api', (req, res) => {
            res.json({
                msg: 'delete API'
            });
        });
        //Peticiones patch
        this.app.patch('/api', (req, res) => {
            res.json({
                msg: 'patch API'
            });
        });
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