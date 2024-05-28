const express = require('express');
const router = express.Router();
const auth = require('../models/auth.model');
const { body, validationResult } = require('express-validator');
const vista = "auth";

// Login validator middleware
const loginValidator = [
    body('Email', 'El campo {0} es obligatorio').not().isEmpty(),
    body('Email', 'El campo {0} no es correo válido').isEmail(),
    body('Password', 'La longitud mínima de la contraseña son 6 caracteres').isLength({ min: 6 }),
];

// Define the index route
router.get('/', async (req, res) => {
    res.render(`${vista}/index`);
});

// Define the login route
router.post('/', loginValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new Error();

        const { data, status } = await auth.ObtenTokenAsync(req.body.Email, req.body.Password);
        if (status !== 200) throw new Error();

        const claims = {
            "email": data.email,
            "nombre": data.nombre,
            "rol": data.rol,
            "jwt": data.jwt
        };
        req.session.user = claims;
        res.redirect(`${res.locals.AppPath}/peliculas`);
    } catch (ex) {
        res.render(`${vista}/index`, { email: req.body.Email, error: "Credenciales no válidas. Inténtelo nuevamente." });
        console.log(ex)
    }
});

// Define the logout route
router.get('/salir', async (req, res) => {
    req.session = null;
    res.redirect(`${res.locals.AppPath}/auth`);
});

module.exports = router;