const Refresca = require('../middlewares/refrescatoken.middleware')
const URLWebAPI = process.env.URLWebAPI

let self = {}

self.GetAllAsync = async (req) => {
    const response = await fetch(`${URLWebAPI}/api/categorias`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}` }
    });
    if (response.ok) {
        Refresca(req, response)
        return { "data": await response.json(), "status": response.status }
    }
    return { "status": response.status }
}

self.GetAsync = async (id, req) => {
    const response = await fetch(`${URLWebAPI}/api/categorias/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}` }
    });
    if (response.ok) {
        Refresca(req, response)
        return { "data": await response.json(), "status": response.status }
    }
    return { "status": response.status }
}

self.PostAsync = async (categoria, req) => {
    const response = await fetch(`${URLWebAPI}/api/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}` },
        body: JSON.stringify(categoria)
    });
    if (response.ok) {
        Refresca(req, response)
        return { "data": await response.json(), "status": response.status }
    }
    return { "status": response.status }
}

self.PutAsync = async (categoria, req) => {
    const response = await fetch(`${URLWebAPI}/api/categorias/${categoria.categoriaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}` },
        body: JSON.stringify(categoria) });
    if (response.ok) {
        Refresca(req, response)
        return { "status": response.status }
    }
    return { "status": response.status }
}

self.DeleteAsync = async (id, req) => {
    const response = await fetch(`${ URLWebAPI }/api/categorias/${ id }`, {
    method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}` }
    });
    if (response.ok) {
        Refresca(req, response)
        return { "status": response.status }
    }
    return { "status": response.status }
}

module.exports = self