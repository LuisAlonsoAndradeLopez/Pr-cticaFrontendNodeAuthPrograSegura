const Refresca = async (req, res) => {
    // Revisa si el servidor nos envió un nuevo token
    const token = res.headers.get('set-authorization')
    if (!token)
        return
        
    // Obtiene el token y lo refresca en el cliente 
    req.session.user.jwt = token
}

module.exports = Refresca