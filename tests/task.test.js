const request = require("supertest")
const Task = require('../srs/models/task')
const app = require("../srs/app")
const {userOne, taskThree, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "From my test suite"
        })
        .expect(201)
    // make sure the task added succssfully on DB
    const task  = await Task.findById(response.body._id)
    expect(task.description).toBe("From my test suite")
    expect(task.completed).toEqual(false)
})

test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    // make sure that userOne has 2 tasks
    expect(response.body.length).toEqual(2)
})

test('Should not be able to delete other users tasks', async () => {
    await request(app)
        .delete(`/api/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)

    // make sure thae task still exist
    const task = await Task.findById(taskThree._id)
    expect(task).not.toBeNull()
})


