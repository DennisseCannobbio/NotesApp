const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

//Para cifrar la contraseña que coloque el usuario
usersSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hash(password, salt)
    return hash
}

// Para ver si las contraseñas coinciden cuando el usuario se logee => Se cifrará en la sección de "volver a ingresar contraseña" para que se puedan comparar correctamente
usersSchema.methods.matchPassword = async function(password) {
    // Retornamos la comparación entre la contraseña que está ingresando ahora el usuario y la contraseña que ya ingresó
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', usersSchema)