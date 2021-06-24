const express = require('express')
const router = express.Router()

//Index page
router.get('/', (req, res) => {
    res.send('Index')
})

// About page
router.get('/about', (req, res) => {
    res.send('About')
})

module.exports = router
