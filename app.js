//DOTENV
//alno usar modulos lo importamos con require
require('dotenv').config()

//creacion del web server
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen( process.env.PORT, () => {
    console.log("Servidor correindo en el puerto", process.env.PORT);
});