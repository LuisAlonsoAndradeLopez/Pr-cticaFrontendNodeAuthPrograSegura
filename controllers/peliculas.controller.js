const express = require('express');
const router = express.Router();
const peliculasModel = require('../models/pelicula.model');
const categoriasModel = require('../models/categoria.model');
const { body, validationResult } = require('express-validator');
const { isUrl } = require('check-valid-url');
const vista = "peliculas";

// Validator middleware for movie creation
const peliculaValidator = [
    body('Titulo', 'El campo {0} es obligatorio').not().isEmpty(),
    body('Sinopsis', 'El campo {0} es obligatorio').not().isEmpty(),
    body('Anio', 'El campo {0} es obligatorio').not().isEmpty().isInt({ min: 1950, max: 2024 }),
    body('Poster', 'El campo {0} es obligatorio').not().isEmpty(),
];

// Validate poster URL
const validaposter = async (req, res) => {
    const poster = req.query.Poster || '';
    if (isUrl(poster) || poster == 'N/A')
        return res.status(200).json(true);
    return res.status(200).json(false);
};

// Index route
router.get('/', async (req, res) => {
    try {
        const search = req.query.s || '';
        const { data, status } = await peliculasModel.GetAllAsync(search, req);
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 200) throw new Error();
        return res.render(`${vista}/index`, { Model: data, search: search, SoloAdmin: req.session.user.rol == "Administrador" ? true : false });
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`);
    }
});

// Detail route
router.get('/:id', async (req, res) => {
    try {
        const { data, status } = await peliculasModel.GetAsync(req.params.id, req);
        if (status == 404) return res.status(484).send();
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 200) throw new Error();
        return res.render(`${vista}/detalle`, { Model: data });
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`);
    }
});

// Create route
router.get('/crear', (req, res) => {
    res.render(`${vista}/crear`, { Model: {} });
});

router.post('/crear', peliculaValidator, async (req, res) => {
    const pelicula = { titulo: req.body.Titulo, sinopsis: req.body.Sinopsis, anio: req.body.Anio, poster: req.body.Poster };
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new Error();

        const { status } = await peliculasModel.PostAsync(pelicula, req);
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 201) throw new Error();
        res.redirect(`${res.locals.AppPath}/peliculas`);
    } catch (ex) {
        return res.render(`${vista}/crear`, { Model: pelicula, error: "No ha sido posible realizar la acción. Inténtelo nuevamente." });
    }
});

// Edit route
router.get('/editar/:id', async (req, res) => {
    try {
        const { data, status } = await peliculasModel.GetAsync(req.params.id, req);
        if (status == 404) return res.status(404).send();
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 200) throw new Error();
        return res.render(`${vista}/editar`, { Model: data });
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`);
    }
});

router.post('/editar/:id', peliculaValidator, async (req, res) => {
    const pelicula = { peliculaId: req.body.PeliculaId, titulo: req.body.Titulo, sinopsis: req.body.Sinopsis, anio: req.body.Anio, poster: req.body.Poster };
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new Error();
        const { status } = await peliculasModel.PutAsync(pelicula, req);
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 204) throw new Error();
        res.redirect(`${res.locals.AppPath}/peliculas`);
    } catch (ex) {
        return res.render(`${vista}/editar`, { Model: pelicula, error: "No ha sido posible realizar la acción. Inténtelo nuevamente." });
    }
});

// Delete route
router.get('/eliminar/:id', async (req, res) => {
    try {
        const { data, status } = await peliculasModel.GetAsync(req.params.id, req);
        if (status == 404) return res.status(404).send();
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 200) throw new Error();
        return res.render(`${vista}/eliminar`, { Model: data, error: (req.query.showError && "No ha sido posible realizar la acción. Inténtelo nuevamente.") });
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`);
    }
});

router.post('/eliminar/:id', async (req, res) => {
    try {
        const { status } = await peliculasModel.DeleteAsync(req.params.id, req);
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 204) throw new Error();
        res.redirect(`${res.locals.AppPath}/peliculas`);
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/peliculas/eliminar/${req.params.id}?showError=true`);
    }
});

// Categories routes
router.get('/:id/categorias', async (req, res) => {
    try {
        const { data, status } = await peliculasModel.GetAsync(req.params.id, req);
        if (status == 404) return res.status(404).send();
        if (status == 481) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 200) throw new Error();

        return res.render(`${vista}/categorias`, { Model: data });
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`);
    }
});

router.get('/:id/categoriasagregar', async (req, res) => {
    try {
        const data1 = await peliculasModel.GetAsync(req.params.id, req);
        if (data1.status == 404) return res.status(404).send();
        if (data1.status == 481) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (data1.status == 200) throw new Error();

        const data2 = await categoriasModel.GetAllAsync(req);
        if (data2.status == 404) return res.status(404).send();
        if (data2.status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (data2.status == 200) throw new Error();

        return res.render(`${vista}/categoriasagregar`, {
            Model: data1.data,
            Categorias: data2.data,
            error: (req.query.showError && "No ha sido posible realizar la acción. Inténtelo nuevamente.")
        });
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`);
    }
});

router.post('/:id/categoriasagregar', async (req, res) => {
    const peliculaId = req.params.id;
    const categoriaId = req.body.CategoriaId;
    try {
        const { status } = await peliculasModel.AgregarCategoriaAsync(peliculaId, categoriaId, req);
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 204) throw new Error();
        res.redirect(`${res.locals.AppPath}/peliculas/categorias/${peliculaId}`);
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/peliculas/${peliculaId}/categoriasagregar?showError=true`);
    }
});

router.get('/:id/categoriasremover', async (req, res) => {
    try {
        const data1 = await peliculasModel.GetAsync(req.params.id, req);
        if (data1.status == 404) return res.status(404).send();
        if (data1.status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (data1.status == 200) throw new Error();

        const data2 = await categoriasModel.GetAsync(req.query.categoriaid, req);
        if (data2.status == 404) return res.status(404).send();
        if (data2.status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (data2.status == 200) throw new Error();

        return res.render(`${vista}/categoriasremover`, {
            Model: data1.data,
            Categoria: data2.data,
            error: (req.query.showError && "No ha sido posible realizar la acción. Intentelo nuevamente.")
        });
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`);
    }
});

router.post('/:id/categoriasremover', async (req, res) => {
    const peliculaId = req.params.id;
    const categoriaId = req.body.CategoriaId;
    try {
        const { status } = await peliculasModel.RemoverCategoriaAsync(peliculaId, categoriaId, req);
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`);
        if (status == 204) throw new Error();
        res.redirect(`${res.locals.AppPath}/peliculas/categorias/${peliculaId}`);
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/peliculas/${peliculaId}/categoriasremover?showError=true`);
    }
});

module.exports = router;