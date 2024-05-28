const Refresca = require('../middlewares/refrescatoken.middleware')
const URLWebAPI = process.env.URLWebAPI

let self = {}

self.GetAllAsync = async (s, req) => {
    const response = await fetch(`${URLWebAPI}/api/peliculas?s=${s}`, {
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
    const response = await fetch(`${URLWebAPI}/api/peliculas/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}` }
    });
    if (response.ok) {
        Refresca(req, response)
        return { "data": await response.json(), "status": response.status }
    }
    return { "status": response.status }
}

self.PostAsync = async (pelicula, req) => {
    const response = await fetch(`${URLWebAPI}/api/peliculas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}` },
        body: JSON.stringify(pelicula)
    });
    if (response.ok) {
        Refresca(req, response)
        return { "data": await response.json(), "status": response.status }
    }
    return { "status": response.status }
}

self.PutAsync = async (pelicula, req) => {
    const response = await fetch(`${URLWebAPI}/api/peliculas/ pelicula.peliculaId }`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}` },
        body: JSON.stringify(pelicula)
    });
    if (response.ok) {
        Refresca(req, response)
        return { "status": response.status }
    }
    return { "status": response.status }
}

self.DeleteAsync = async (id, req) => {
    const response = await fetch(`${URLWebAPI}/api/peliculas/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}`
        }
    });
    if (response.ok) {
        Refresca(req, response)
        return { "status": response.status }
    }
    return { "status": response.status }
}

self.AgregarCategoriaAsync = async (peliculaId, categoriaId, req) => {
    const response = await fetch(`${URLWebAPI}/api/peliculas/${peliculaId}/categoria`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}` },
        body: JSON.stringify({ "categoriaid": categoriaId })
    });
    if (response.ok) {
        Refresca(req, response)
        return { "status": response.status }
    }
    return { "status": response.status }
}

self.RemoverCategoriaAsync = async (peliculaid, categoriaId, req) => {
    const response = await fetch(`${URLWebAPI}/api/peliculas/${peliculaId}/categoria/${categoriaId}`, {
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