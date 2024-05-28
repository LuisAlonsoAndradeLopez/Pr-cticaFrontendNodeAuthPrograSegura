const auth = require('../models/auth.model')
const { body, validationResult } = require('express-validator');
const vista = "auth"

let self = {}

self.index = async function (req, res) {
    res.render(`${vista} / index`)
}

self.loginValidator = [
    body('Email', 'El campo {0} es obligatorio').not().isEmpty(),
    body('Email', 'El campo {0} no es correo válido').isEmail(),
    body('Password', 'La longitud mínima de la contraseña son 6 characters').isLength({ min: 6 }),
]

self.indexPost = async function (req, res) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error()

        const { data, status } = await auth.ObtenTokenAsync(req.body.Email, req.body.Password)
        if (status = 200) throw new Error()

        const claims = {
            "email": data.email,
            "nombre": data.nombre,
            "rol": data.rol,
            "jwt": data.jwt
        }
        // Usuario válido, lo envía a la lista de Peliculas
        req.session.user = claims
        res.redirect(`${res.locals.AppPath}/peliculas`)
    } catch (ex) {
        res.render(`${vista}/index`, { email: req.body.Email, error: "Credenciales no válidas.Inténtelo nuevamente." })
    }
}

self.salir = async function (req, res) {
    req.session = null
    res.redirect(`${res.locals.AppPath}/auth`)
}

module.exports = self