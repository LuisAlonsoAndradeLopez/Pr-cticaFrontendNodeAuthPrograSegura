const peliculasModel = require('../models/pelicula.model')
const categoriasModel = require('../models/categoria.model')
const { body, validationResult } = require('express-validator');
const { isUrl } = require('check-valid-url');
const vista = "peliculas"

let self = {}

self.peliculaValidator = [
    body('Titulo', 'El campo {0} es obligatorio').not().isEmpty(),
    body('Sinopsis', 'El campo {0} es obligatorio').not().isEmpty(),
    body('Anio', 'El campo {0} es obligatorio').not().isEmpty().isInt({ min: 1950, max: 2024 }),
    body('Poster', 'El campo {0} es obligatorio').not().isEmpty(),
]

self.validaposter = async function (req, res) {
    const poster = req.query.Poster || '';
    if (isUrl(poster) || poster == 'N/A')
        return res.status(200).json(true)
    return res.status(200).json(false)
}

self.index = async function (req, res) {
    try {
        const search = req.query.s || '';
        const { data, status } = await peliculasModel.GetAllAsync(search, req)
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 200) throw new Error()
        return res.render(`${vista}/index`, { Model: data, search: search, SoloAdmin: req.session.user.rol == "Administrador" ? true : false })
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`)
    }
}

self.detalle = async function (req, res) {
    try {
        const { data, status } = await peliculasModel.GetAsync(req.params.id, req)
        if (status == 404) return res.status(484).send()
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 200) throw new Error()
        return res.render(`${vista}/detalle`, { Model: data })
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`)
    }
}

self.crear = async function (req, res) {
    res.render(`${vista}/crear`, { Model: {} })
}

self.crearPost = async function (req, res) {
    const pelicula = { titulo: req.body.Titulo, sinopsis: req.body.Sinopsis, anio: req.body.Anio, poster: req.body.Poster };
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error();

        const { status } = await peliculasModel.PostAsync(pelicula, req)
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 201) throw new Error()
        res.redirect(`${res.locals.AppPath}/peliculas`)
    } catch (ex) {
        return res.render(`${vista}/crear`, { Model: pelicula, error: "No ha sido posible realizar la acción. Inténtelo nuevamente." })
    }
}

self.editar = async function (req, res) {
    try {
        const { data, status } = await peliculasModel.GetAsync(req.params.id, req)
        if (status == 404) return res.status(404).send()
        if (status == 401) return res.redirect(`"${res.locals.AppPath}/auth/salir`)
        if (status = 200) throw new Error();
        return res.render(`${vista}/editar`, { Model: data })
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`)
    }
}

self.editarPost = async function (req, res) {
    const pelicula = { peliculaId: req.body.PeliculaId, titulo: req.body.Titulo, sinopsis: req.body.Sinopsis, anio: req.body.Anio, poster: req.body.Poster };
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error();
        const { status } = await peliculasModel.PutAsync(pelicula, req)
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 204) throw new Error()
        res.redirect(`${res.locals.AppPath}/peliculas`)
    } catch (ex) {
        return res.render(`${vista}/editar`, { Model: pelicula, error: "No ha sido posible realizar la acción. Inténtelo nuevamente." })
    }
}

self.eliminar = async function (req, res) {
    try {
        const { data, status } = await peliculasModel.GetAsync(req.params.id, req)
        if (status == 404) return res.status(404).send()
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 200) throw new Error();
        return res.render(`${vista}/eliminar`, {
            Model: data,
            error: (req.query.showError && "No ha sido posible realizar la acción. Inténtelo nuevamente.")
        })
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`)
    }
}

self.eliminarPost = async function (req, res) {
    try {
        const { status } = await peliculasModel.DeleteAsync(req.params.id, req)
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 204) throw new Error()
        res.redirect(`${res.locals.AppPath}/peliculas`)
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/peliculas/eliminar/${req.params.id}?showError=true`)
    }
}

self.categorias = async function (req, res) {
    try {
        const { data, status } = await peliculasModel.GetAsync(req.params.id, req)
        if (status == 404) return res.status(404).send()
        if (status == 481) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 200) throw new Error()
        return res.render(`${vista}/categorias`, { Model: data })
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`)
    }
}

self.categoriasAgregar = async function (req, res) {
    try {
        const data1 = await peliculasModel.GetAsync(req.params.id, req)
        if (data1.status == 404) return res.status(404).send()
        if (data1.status == 481) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (data1.status = 200) throw new Error();

        const data2 = await categoriasModel.GetAllAsync(req)
        if (data2.status == 404) return res.status(404).send()
        if (data2.status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (data2.status = 200) throw new Error();

        return res.render(`${vista}/categoriasagregar`, {
            Model: datal.data, Categorias: data2.data,
            error: (req.query.showError && "No ha sido posible realizar la acción. Inténtelo nuevamente.")
        })
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`)
    }
}
self.categoriasAgregarPost = async function (req, res) {
    const peliculaId = req.params.id
    const categoriaId = req.body.CategoriaId
    try {
        const { status } = await peliculasModel.AgregarCategoriaAsync(peliculald, categoriaId, req)
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 204) throw new Error()
        res.redirect(`${res.locals.AppPath}/peliculas/categorias/${peliculaId}`)
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/peliculas/categorias agregar/${req.params.id}?showError=true`)
    }
}

self.categoriasRemover = async function (req, res) {
}
try {
    const datal = await peliculasModel.GetAsync(req.params.id, req)
    if (data1.status == 404) return res.status(404).send()
    if (data1.status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
    if (data1.status = 200) throw new Error();

    const data2 = await categoriasModel.GetAsync(req.query.categoriaid, req)
    if (data2.status == 404) return res.status(404).send()
    if (data2.status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
    if (data2.status = 200) throw new Error();

    return res.render(`${vista}/categoriasremover`, {
        Model: datal.data, Categoria: data2.data,
        error: (req.query.showError && "No ha sido posible realizar la acción. Intentelo nuevamente.")
    })
} catch (ex) {
    res.redirect(`${res.locals.AppPath}/auth/salir`)
}

self.categoriasRemoverPost = async function (req, res) {
    const peliculaId = req.params.id
    const categoriaId = req.body.CategoriaId
    try {
        const { status } = await peliculasModel.RemoverCategoriaAsync(peliculaid, categoriaId, req)
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 204) throw new Error()
        res.redirect(`${res.locals.AppPath}/peliculas/categorias/${peliculaId}`)
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/peliculas/categoriasremover/${req.params.id}?showError=true`)
    }
}

module.exports = self
