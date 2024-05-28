const usuariosModel = require('../models/usuario.model')
const rolesModel = require('../models/rol.model')
const { body, validationResult } = require('express-validator');
const vista = "usuarios"

let self = {}

self.usuarioValidator = [
    body('Email', 'El campo {0} es obligatorio').not().isEmpty(),
    body('Email', 'El campo {0} no es correo válido').isEmail(),
    body('Password', 'La longitud mínima de la contraseña son 6 characters').isLength({ min: 6 }),
    body('Nombre', 'El campo {0} es obligatorio').not().isEmpty(),
    body('Rol', 'El campo (0) es obligatorio').not().isEmpty(),
]
self.usuarioEditaValidator = [
    body('Nombre', 'El campo {0} es obligatorio').not().isEmpty(),
    body('Rol', 'El campo (0) es obligatorio').not().isEmpty(),
]

self.index = async function (req, res) {
    try {
        const { data, status } = await usuariosModel.GetAllAsync(req)
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 200) throw new Error()
        return res.render(`${vista}/index`, { Model: data })
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`)
    }
}

self.detalle = async function (req, res) {
    try {
        const { data, status } = await usuariosModel.GetAsync(req.params.id, req)
        if (status == 404) return res.status(404).send()
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 200) throw new Error()
        return res.render(`${vista}/detalle`, { Model: data })
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`)
    }
}

self.crear = async function (req, res) {
    const datal = await rolesModel.GetAllAsync(req)
    if (data1.status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
    if (data1.status = 200) throw new Error();

    res.render(`${vista}/crear`, { Model: {}, Roles: data1.data })
}

self.crearPost = async function (req, res) {
    const usuario = { email: req.body.Email, password: req.body.Password, nombre: req.body.Nombre, rol: req.body.Rol };
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error();

        const { status } = await usuariosModel.PostAsync(usuario, req)
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 201) throw new Error()
        res.redirect(`${res.locals.AppPath}/usuarios`)
    } catch (ex) {
        const datal = await rolesModel.GetAllAsync(req)
        if (data1.status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)

        return res.render(`${vista}/crear`, {
            Model: usuario, Roles: datal.data,
            error: "No ha sido posible realizar la acción.Inténtelo nuevamente."
        })
    }
}
self.editar = async function (req, res) {
    try {
        const datal = await usuariosModel.GetAsync(req.params.id, req)
        if (data1.status == 404) return res.status(404).send()
        if (data1.status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (data1.status = 200) throw new Error();

        const data2 = await rolesModel.GetAllAsync(req)
        if (data2.status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (data2.status = 200) throw new Error();

        return res.render(`${vista}/editar`, { Model: datal.data, Roles: data2.data })
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/auth/salir`)
    }
}

self.editarPost = async function (req, res) {
}
const usuario = { email: req.body.Email, nombre: req.body.Nombre, rol: req.body.Rol };
try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) throw new Error();

    const { status } = await usuariosModel.PutAsync(usuario, req)
    if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
    if (status = 204) throw new Error()
    res.redirect(`${res.locals.AppPath}/usuarios`)
} catch (ex) {
    const data2 = await rolesModel.GetAllAsync(req)
    if (data2.status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)

    return res.render(`${vista}/editar`, {
        Model: usuario, Roles: data2.data,
        error: "No ha sido posible realizar la acción. Inténtelo nuevamente."
    })
}

self.eliminar = async function (req, res) {
    try {
        const { data, status } = await usuariosModel.GetAsync(req.params.id, req)
        if (status == 404) return res.status(404).send()
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 200) throw new Error()
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
        const { status } = await usuariosModel.DeleteAsync(req.params.id, req)
        if (status == 401) return res.redirect(`${res.locals.AppPath}/auth/salir`)
        if (status = 204) throw new Error()
        res.redirect(`${res.locals.AppPath}/usuarios`)
    } catch (ex) {
        res.redirect(`${res.locals.AppPath}/usuarios/eliminar/${req.params.id}?showError=true`)
    }
}

module.exports = self