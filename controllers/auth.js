///controlador de login
//importamos response de express para ayudar con el tipado
const { response } = require("express");

const login = (req, res = response) => {

    //extraer el correo y el password del req.body
    const { correo, password } = req.body;


    res.json({
        msg: 'Login OK'
    });

}


//exportamos login
module.exports = {
    login
}