const express = require('express')
const router = express.Router()
const Note = require('../models/note')
const {isAuthenticated} = require('../helpers/auth')

//All notes index
router.get('/notes', isAuthenticated, async (req, res) => {
    //Buscamos todas las notas correspondientes a un usuario en especifico, las ordenamos descendiente
    const notes = await Note.find({ user: req.user.id }).sort({ date: 'desc'})
    //Renderizamos la página de todas las notas
    res.render('notes/allNotes', { notes })
})

// GET del formulario para agregar notas
//Utilizamos isAuthenticated para verificar si está en una sesión de usuario
router.get('/notes/add', isAuthenticated, (req, res) => {
    //Renderizamos la vista newNote para agregar notas
    res.render('notes/newNote')
})

// POST del formulario para agregar notas 
router.post('/notes/newNote', isAuthenticated, async (req, res) => {
    // Utilizamos los parametros de notes => title y description
    const { title, description} = req.body
    // Si hay errores
    const errors = []
    if(!title) {
        errors.push({text: 'Por favor, escriba un título'})
    }
    if(!description) {
        errors.push({ text: 'Por favor, escriba una descripción'})
    }
    // Si el arreglo de errores es mayor a 0, entonces si hay errores.
    // Renreiza la página de nueva nota de nuevo y le pasa el error
    if(errors.length > 0) {
        res.render('notes/newNote', {
            errors,
            title,
            description
        })
    } else {
        // Si no existen errores entonces agrega una nueva nota
        const newNote = new Note({ title, description})
        // Usamos esto para que guarde la nota propia en el usuario => Si escribo una nota con mi usuario solo queda en MI CUENTA
        newNote.user = req.user.id
        // Guardamos la nota en la base de datos
        await newNote.save()
        // Agregamos el mensaje de flash => Que se agregó correctamente
        req.flash('success_msg', '¡Nota agregada correctamente!')
        // Redirigimos a todas las notas
        res.redirect('/notes')
    }
})

// Routes para editar notas
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    //Buscamos por id de la nota para editar
    const note = await Note.findById(req.params.id)
    // Si funciona bien entonces editará la nota
    res.render('notes/editNote', { note })
})

// Routes PUT para editar notas
router.put('/notes/editNote/:id', isAuthenticated, async (req, res) => {
    // Utilizamos los parametros de notes => title y description
    const { title, description} = req.body
    // Buscamos por id y editamos la nota => le pasamos el id, el titulo y la descripcion
    await Note.findByIdAndUpdate(req.params.id, { title, description })
    // Enviamos un mensaje de éxito con flash
    req.flash('success_msg', '¡Nota actualizada correctamente!')
    // Redireccionamos a todas las notas 
    res.redirect('/notes')
})

// Routes para eliminar
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    // Buscamos la nota por id y eliminamos esa nota seleccionada
    await Note.findByIdAndDelete(req.params.id)
    // Mensaje satisfactorio de flash
    req.flash('success_msg', '¡Nota eliminada correctamente!')
    //Redirigimos a todas las notas
    res.redirect('/notes')
})

module.exports = router