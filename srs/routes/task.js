const express = require('express')
const Task = require('../models/task')
const auth = require('../middelware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send(e)
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const query = { owner: req.user._id };
    const sortParams = {}
    if (req.query.completed)
      query.completed = req.query.completed === "true" ? true : false;

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sortParams[parts[0]] = parts[1] === 'desc'? -1 : 1;
    }

    try{
        const tasks = await Task.find(query)
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip))
            .sort(sortParams);

        res.send(tasks)
    } catch(e){
        res.status(500).send(e)
    }
})
 
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    if(_id.length !== 24){
        return res.status(400).send({'bad request':'id length should be 24 char'})
    }

    try{
        const task = await Task.findOne({ _id, owner: req.user._id })
        if(!task){
            return res.status(404).send('Not found!')
        }
        res.send(task)
    } catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
   
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    
    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
       
        if(!task){
            return res.status(404).send("Task not Found!")
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res)=>{
    try{
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if(!task){
            return res.status(404).send({error :'Task not Found!'})
        }
        res.send(task)
    } catch(e){
        res.status(500).send(e)
    }
})

module.exports = router