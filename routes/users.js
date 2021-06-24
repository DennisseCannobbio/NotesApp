const express = require('express')
const router = express.Router()

// Iniciar sesión
router.get('/users/signin', (req, res) => {
    res.send('Iniciando Sesión')
})

// Registrar usuario get
router.get('/users/signup', (req, res) => {
    res.send('Formulario de autenticación')
})


module.exports = router