const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/notes-db-app', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then( db => console.log('Conectado a MongoDB!'))
.catch(err => console.error(err))