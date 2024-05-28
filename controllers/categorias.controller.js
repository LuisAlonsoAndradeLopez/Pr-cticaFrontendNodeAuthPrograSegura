const express = require('express');
const router = express.Router();
const categoriasModel = require('../models/categoria.model');
const { body, validationResult } = require('express-validator');
const vista = "categorias";

// Validator middleware for category creation and edition
const categoriaValidator = [
    body('Nombre', 'El campo {0} es obligatorio').not().isEmpty()
];

// Index route
router.get('/', async (req, res) => {
    try {
        const { data, status } = await categoriasModel.GetAllAsync(req);
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 200) throw new Error();
        return res.render(`${vista}/index`, { Model: data });
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`);
    }
});

// Route to view category details
router.get('/:id', async (req, res) => {
    try {
        const { data, status } = await categoriasModel.GetAsync(req.params.id, req);
        if (status == 404) return res.status(404).send();
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 200) throw new Error();
        return res.render(`${vista}/detalle`, { Model: data });
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`);
    }
});

// Route to render category creation form
router.get('/crear', (req, res) => {
    res.render(`${vista}/crear`, { Model: {} });
});

// Route to handle category creation
router.post('/crear', categoriaValidator, async (req, res) => {
    const categoria = { nombre: req.body.Nombre };
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new Error();
        const { status } = await categoriasModel.PostAsync(categoria, req);
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 201) throw new Error();
        res.redirect(`${res.locals.AppPath}/categorias`);
    } catch (ex) {
        return res.render(`${vista}/crear`, { Model: categoria, error: "No ha sido posible realizar la acción. Inténtelo nuevamente." });
    }
});

// Route to render category editing form
router.get('/editar/:id', async (req, res) => {
    try {
        const { data, status } = await categoriasModel.GetAsync(req.params.id, req);
        if (status == 404) return res.status(404).send();
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 200) throw new Error();
        return res.render(`${vista}/editar`, { Model: data });
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`);
    }
});

// Route to handle category editing
router.post('/editar/:id', categoriaValidator, async (req, res) => {
    const categoria = { categoriaId: req.body.CategoriaId, nombre: req.body.Nombre };
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new Error();
        const { status } = await categoriasModel.PutAsync(categoria, req);
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 204) throw new Error();
        res.redirect(`${res.locals.AppPath}/categorias`);
    } catch (ex) {
        return res.render(`${vista}/editar`, { Model: categoria, error: "No ha sido posible realizar la acción. Inténtelo nuevamente." });
    }
});

// Route to render category deletion confirmation page
router.get('/eliminar/:id', async (req, res) => {
    try {
        const { data, status } = await categoriasModel.GetAsync(req.params.id, req);
        if (status == 404) return res.status(404).send();
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 200) throw new Error();
        return res.render(`${vista}/eliminar`, { Model: data, error: (req.query.showError && "No ha sido posible realizar la acción. Inténtelo nuevamente.") });
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`);
    }
});

// Route to handle category deletion
router.post('/eliminar/:id', async (req, res) => {
    try {
        const { status } = await categoriasModel.DeleteAsync(req.params.id, req);
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 204) throw new Error();
        res.redirect(`${res.locals.AppPath}/categorias`);
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/categorias/eliminar/${req.params.id}?showError=true`);
    }
});

module.exports = router;