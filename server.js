const express = require('express')
const path = require('path')
const expHbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')

// Initializations
const app = express()
require('./database')

// Settings
app.set('port', process.env.PORT || 5000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', expHbs({ 
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}))
app.set('view engine', '.hbs')

// Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}))

// Global Variables

// Routes
app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))



// Static Files
app.use(express.static(path.join(__dirname, 'public')))

// Run server
app.listen(app.get('port'), () => {
    console.log('Servidor abierto en el puerto', app.get('port'))
})