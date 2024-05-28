const Authorize = (rol) => {
    return async (req, res, next) => {
        try {
            if (req.session.user == null)
                return res.redirect(`"${res.locals.AppPath}/auth`)

            // Verifica si el rol está autorizado
            if (rol.split(',').indexOf(req.session.user.rol == -1))
                return res.render(`home/accessdenied`)

            // Continua con el método
            next()
        } catch (error) {
            return res.status(401).json()
        }
    }
}

module.exports = Authorize