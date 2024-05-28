const vista = "home"

let self = {}

self.index = async function (req, res) {
    res.render(`${vista}/index`)
}

module.exports = self