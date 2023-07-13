const express = require('express')

const router = new express.Router()

router.get('/', async (req, res) => {
    res.render('index', {
        title: 'TestingScope'
    })
})

router.get('/contact', async (req, res) => {
    res.render('contact', {
        title: 'Contact us'
    })
})

router.get('/resume', async (req, res) => {
    res.render('resume', {
        title: 'Resume'
    })
})

router.get('/courses', async (req, res) => {
    res.render('courses', {
        title: 'Courses'
    })
})

router.get('*', async (req, res) => {
    res.render('404', {
        title: 'Error 404',
        errorMsg: '404 Page not found!'
    })
})

module.exports = router