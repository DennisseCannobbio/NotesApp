// Para validar con passport y passport local
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/user')

//Para definir una nueva estrategia de autenticación
passport.use(new localStrategy({
    // Enviamos el email
    usernameField: 'email'
    // Ejecutamos una funcion para validar el email => necesitamos el dato email, password y callback (done)
}, async (email, password, done) => {
    //Buscamos el correo para validarlo
    const user = await User.findOne({ email: email })
    // Si no encuentra un usuario entonces le enviamos un mensaje
    if(!user) {
        // Null => no encontró error, false => no encontro usuario, message => enviamos un msj
        return done(null, false, { message: 'Usuario no encontrado'})
    } else {
        // Si encontro el usuario entonces valida la contraseña (con el metodo que hicimos en user.js matchPassword)
        const match = await user.matchPassword(password)
        //Si la contraseña coincide, devuelve el usuario
        if(match) {
            return done(null, user)
        // Si la contraseña no coincide entonces le enviamos un mensaje de error
        } else {
            return done(null, false, { message: 'Contraseña incorrecta'})
       }
    }
}))

//Si el usuario se logea, almacenamos en la sesión el id del usuario
passport.serializeUser((user, done) => {
    done(null, user.id)
})

//Proceso inverso
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})