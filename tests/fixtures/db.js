const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const User = require('../../srs/models/user')
const Task = require('../../srs/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "David Bahidi",
    age: "34",
    email: "david@gmail.com",
    password: "david123",
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET_KEY)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "Elon Musk",
    age: "56",
    email: "elon@gmail.com",
    password: "elon123",
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET_KEY)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId,
    description: "Visit Mom",
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId,
    description: "Submit your next month annual vacation",
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId,
    description: "Call back Jason",
    completed: true,
    owner: userTwo._id
}


const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()

    await new User(userOne).save()
    await new User(userTwo).save()

    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userTwoId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}