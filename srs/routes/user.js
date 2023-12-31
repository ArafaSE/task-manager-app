const express = require('express')
const User = require('../models/user')
const Task = require('../models/task')
const auth = require('../middelware/auth')
const router = new express.Router()

 router.get('/api/users', async (req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    } catch(e){
        res.status(500).send(e)
    }
 })

router.post('/api/users', async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e){
        res.status(400).send(e)
    }
 })

 router.post('/api/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e){
        res.status(400).send(e)
    }
 })

 router.post('/api/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e){
        res.status(500).send(e)
    }
 })

 
 router.post('/api/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e){
        res.status(500).send(e)
    }
 })

 router.get('/api/users/me', auth, async (req, res) => {
    res.send(req.user)
 })

 router.get('/api/users/:id', async (req, res)=>{
    const _id = req.params.id

    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch(e){
        res.status(500).send(e)
    }
 })

 router.patch('/api/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try{
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch(e){
        res.status(400).send(e)
    }
 })

 router.delete('/api/users/me', auth, async (req, res) => {
    try{
        await Task.deleteMany({owner: req.user._id})
        await User.findByIdAndDelete(req.user._id)
        res.send(req.user)
    } catch(e){
        res.status(500).send(e)
    }
 })

 module.exports = router