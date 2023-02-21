//mas informacion en: https://developers.google.com/identity/gsi/web/guides/verify-google-id-token?hl=es-419

const { OAuth2Client } = require('google-auth-library');
//se crea una instancia de OAuth2Client con el cliente ID
const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

//la funcion espera nuestro TOKEN que lo podemos inicializar como vacio
async function googleVerify( token = '' ) {

  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  //hacemos la desestructuracion  de las propiedades que necesitamos
  const { name, picture, email } = ticket.getPayload();

  //cambiamos el nombre de las variables para nombrarlas conforme nuestro modelo de MONGOOSE/MONGO
  return {
    nombre: name, 
    img: picture, 
    correo: email
  }

}

module.exports = {
    googleVerify
}