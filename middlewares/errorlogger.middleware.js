const errorLogger = (err, req, res, next) => {
    // Aqui puedes enviar el error a un archivo de texto 
    console.log(err.message)
    next(err)
}

module.exports = errorLogger