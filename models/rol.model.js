const Refresca = require('../middlewares/refrescatoken.middleware')
const URLWebAPI = process.env.URLWebAPI

let self = {}

self.GetAllAsync = async (req) => {
    const response = await fetch(`${URLWebAPI}/api/roles`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.user.jwt}` }
    });
    if (response.ok) {
        Refresca(req, response)
        return { "data": await response.json(), "status": response.status }
    }
    return { "status": response.status }
}

module.exports = self