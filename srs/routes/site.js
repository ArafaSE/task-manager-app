const express = require('express')

const router = new express.Router()

router.get('/', async (req, res) => {
    res.render('index', {
        title: 'Home',
        name: 'Mohamed Arafa'
    })
})

router.get('/about', async (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Mohamed Arafa'
    })
})

router.get('/api', async (req, res) => {
    res.render('api', {
        title: 'API Docs',
        name: 'Mohamed Arafa'
    })
})

router.get('*', async (req, res) => {
    res.render('404', {
        title: 'Error 404',
        name: 'Mohamed Arafa',
        errorMsg: '404 Page not found!'
    })
})

module.exports = router