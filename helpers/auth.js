const helpers = {}

//Para comprobar si el usuario está autenticado o no
helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error_msg', 'No autorizado')
    res.redirect('/users/signin')
}

module.exports = helpers