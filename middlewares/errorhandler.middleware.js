const errorHandler = (err, req, res, next) => {
    return res.render(`home/error`)
}

module.exports = errorHandler