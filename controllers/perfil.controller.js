const express = require('express');
const router = express.Router();
const perfilModel = require('../models/perfil.model');

const vista = "perfil";

// Index route
router.get('/', async (req, res) => {
    try {
        const { data, status } = await perfilModel.ObtenTiempoAsync(req);
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 200) throw new Error();
        const usuario = {
            "email": req.session.user.email,
            "nombre": req.session.user.nombre,
            "rol": req.session.user.rol,
            "jwt": req.session.user.jwt,
            "tiempo": data
        };
        return res.render(`${vista}/index`, { Model: usuario });
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`);
    }
});

module.exports = router;