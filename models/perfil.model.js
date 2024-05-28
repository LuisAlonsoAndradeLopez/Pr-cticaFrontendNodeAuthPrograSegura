const Refresca = require('../middlewares/refrescatoken.middleware')
const URLWebAPI = process.env.URLWebAPI

let self = {}

self.ObtenTiempoAsync = async (req) => {
    const response = await fetch(`${URLWebAPI}/api/auth/tiempo`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}` }
    });
    if (response.ok) {
        Refresca(req, response)
        return { "data": await response.text(), "status": response.status }
    }
    return { "status": response.status }
}

module.exports = self