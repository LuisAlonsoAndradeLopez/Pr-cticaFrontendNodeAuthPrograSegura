const URLWebAPI = process.env.URLWebAPI
let self = {}

self.ObtenTokenAsync = async (email, password) => {
    const usuario = {
        email: email,
        password: password
    };
    const response = await fetch(`${URLWebAPI}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    });
    if (response.ok) {
        return { "data": await response.json(), "status": response.status }
    }
    return { "status": response.status }
}

module.exports = self