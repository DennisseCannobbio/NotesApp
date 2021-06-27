const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')

// Iniciar sesión
router.get('/users/signin', (req, res) => {
    res.render('users/signIn')
})

// Iniciar sesión post
router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

// Registrar usuario get
router.get('/users/signup', (req, res) => {
    res.render('users/signUp')
})

//Registar usuario post
router.post('/users/signup', async (req, res) => {
    // Utilizamos los parametros del form
    const { name, email, password, confirmPassword} = req.body
    //Creamos arreglo de errores
    const errors = []
    // Si el nombre está vacío
    if(name <= 0) {
        errors.push({ text: 'Por favor, ingrese un nombre'})
    }
    //Si el correo está vacío
    if(!validateEmail(email)) {
        errors.push({ text: 'Por favor, ingrese un correo válido'})
    }
    // Si las contraseñas son distinas hago un arreglo que almacene los errores
    if(password != confirmPassword) {
        errors.push({ text: 'Las contraseñas no coinciden'})
    }
    // Si la contraseña es menor a cuatro caracteres le envía un mensaje
    if(password.length < 4) {
        errors.push({ text: 'La contraseña debe tener más de cuatro caracteres'})
    }
    // Si existen errores, entonces envía esos errores por pantalla
    if(errors.length > 0) {
        res.render('users/signUp', {errors, name, email, password, confirmPassword})
    } else {
        // Si el correo ya existe no puede registrarse
        const emailUser = await User.findOne({ email: email})
        // Si el correo ya existe enviamos un mensaje de error
        if(emailUser) {
            req.flash('error_msg', 'El email ya está registrado')
            // Lo redirigimos a la misma página de signup
            res.redirect('/users/signup')
        }
        //Si no existen errores entonces sigue el código
        const newUser = new User({ name, email, password })
        // Para encriptar la contraseña del usuario
        newUser.password = await newUser.encryptPassword(password)
        //Guardamos el user dentro de la base de datos
        await newUser.save()
        // Enviamos un mensaje de éxito por flash
        req.flash('success_msg', '¡Registrado Correctamente!')
        // Redireccionamos al usuario al login
        res.redirect('/users/signin')
    }

})

/*FUNCIONES PROPIAS*/
//Función validar email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = router