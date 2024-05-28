const Refresca = require('../middlewares/refrescatoken.middleware')
const URLWebAPI = process.env.URLWebAPI

let self = {}

self.GetAllAsync = async (req) => {
    const response = await fetch(`${URLWebAPI}/api/usuarios`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer $(req.session.user.jwt}` }
    });
    if (response.ok) {
        Refresca(req, response)
        return { "data": await response.json(), "status": response.status }
    }
    return { "status": response.status }
}

self.GetAsync = async (id, req) => {
    const response = await fetch(`${URLWebAPI}/api/usuarios/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}` }
    });
    if (response.ok) {
        Refresca(req, response)
        return { "data": await response.json(), "status": response.status }
    }
    return { "status": response.status }
}

self.PostAsync = async (usuario, req) => {
    const response = await fetch(`${URLWebAPI}/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}` },
        body: JSON.stringify(usuario)
    });
    if (response.ok) {
        Refresca(req, response)
        return { "data": await response.json(), "status": response.status }
    }
    return { "status": response.status }
}

self.PutAsync = async (usuario, req) => {
    const response = await fetch(`${URLWebAPI}/api/usuarios/${usuario.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}` },
        body: JSON.stringify(usuario)
    });
    console.log(response)
    if (response.ok) {
        Refresca(req, response)
        return { "status": response.status }
    }
    return { "status": response.status }
}

self.DeleteAsync = async (id, req) => {
    const response = await fetch(`${URLWebAPI}/api/usuarios/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}`
        }
    });
    console.log(response)
    if (response.ok) {
        Refresca(req, response)
        return { "status": response.status }
    }
    return { "status": response.status }
}

module.exports = self