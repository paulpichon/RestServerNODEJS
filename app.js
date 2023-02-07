//alno usar modulos lo importamos con require
//dotenv variables de entorno
require('dotenv').config();

//importar la clase Server
const Server = require('./models/server');


//llamamos la clase Server
//creamos una instancia de la clase
const server = new Server();

//y llamamos el metodo por el cual escucha nuestra aplicacion
server.listen();