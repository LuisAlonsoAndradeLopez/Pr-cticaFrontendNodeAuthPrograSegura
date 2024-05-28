const categoriasModel = require('../models/categoria.model')
const { body, validationResult } = require('express-validator');
const vista = "categorias"

let self = {}

self.categoriaValidator = [
    body('Nombre', 'El campo {0} es obligatorio').not().isEmpty()
]

self.index = async function (req, res) {
    try {
        const { data, status } = await categoriasModel.GetAllAsync(req)
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 200) throw new Error()
        return res.render(`${vista}/index`, { Model: data })
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`)
    }
}

self.detalle = async function (req, res) {
    try {
        const { data, status } = await categoriasModel.GetAsync(req.params.id, req)
        if (status == 404) return res.status(404).send()
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
    const categoria = { nombre: req.body.Nombre };
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error();

        const { status } = await categoriasModel.PostAsync(categoria, req)
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 201) throw new Error()
        res.redirect(`${res.locals.AppPath}/categorias`)
    } catch (ex) {
        return res.render(`${vista}/crear`, { Model: categoria, error: "No ha sido posible realizar la acción. Inténtelo nuevamente." })
    }
}

self.editar = async function (req, res) {
    try {
        const { data, status } = await categoriasModel.GetAsync(req.params.id, req)
        if (status == 404) return res.status(404).send()
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 200) throw new Error()
        return res.render(`${vista}/editar`, { Model: data })
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`)
    }
}

self.editarPost = async function (req, res) {
    const categoria = { categoriaId: req.body.CategoriaId, nombre: req.body.Nombre };
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error();
        const { status } = await categoriasModel.PutAsync(categoria, req)
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 204) throw new Error()
        res.redirect(`${res.locals.AppPath}/categorias`)
    } catch (ex) {
        return res.render(`${vista}/editar`, { Model: categoria, error: "No ha sido posible realizar la acción. Inténtelo nuevamente." })
    }
}

self.eliminar = async function (req, res) {
    try {
        const { data, status } = await categoriasModel.GetAsync(req.params.id, req)
        if (status == 404) return res.status(404).send()
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 200) throw new Error()
        return res.render(`${vista}/eliminar`, { Model: data, error: (req.query.showError && "No ha sido posible realizar la acción. Inténtelo nuevamente.") })
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`)
    }
}

self.eliminarPost = async function (req, res) {
    try {
        const { status } = await categoriasModel.DeleteAsync(req.params.id, req)
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 204) throw new Error()
        res.redirect(`${res.locals.AppPath}/categorias`)
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/categorias/eliminar/${req.params.id}?showError=true`)
    }
}

module.exports = self