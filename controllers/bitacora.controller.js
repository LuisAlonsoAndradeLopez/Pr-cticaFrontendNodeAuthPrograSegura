const express = require('express');
const router = express.Router();
const vista = "bitacora";

// Define the index route
router.get('/', async (req, res) => {
    res.render(`${vista}/index`);
});

// Export the router
module.exports = router;