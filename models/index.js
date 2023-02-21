//Se crea este archivo para poder exporta desde aqui todos los archivos creados en esta carpeta
//MODELOS
const Categoria = require('./categoria');
const Role = require('./role');
const Server = require('./server');
const Usuario = require('./usuario');


//EXPORTAR
module.exports = {
    Categoria,
    Role,
    Server,
    Usuario
}