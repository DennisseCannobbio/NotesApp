const express = require('express')
const router = express.Router()

// Iniciar sesión
router.get('/users/signin', (req, res) => {
    res.render('users/signIn')
})

// Registrar usuario get
router.get('/users/signup', (req, res) => {
    res.render('users/signUp')
})


module.exports = router