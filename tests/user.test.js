const request = require("supertest")
const app = require("../srs/app")
const User = require('../srs/models/user')
const {userOneId, userOne, setupDatabase, closeDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)
afterEach(closeDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: "Marten Jack",
        age: "35",
        email: "marten@gmail.com",
        password: "marten123"
    }).expect(201)

    // Assert that user was added to DB succssfully 
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull();

    // make sure the user added with hashed password not with a plain text one
    expect(user.password).not.toBe('marten123')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    // validate new token is saved to user object
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'wrongePass'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            age: 55,
            name: "David2 Bahidi2",
        })
        .expect(200)

        // validate the user is updated 
        const user = await User.findById(userOneId)
        expect(user.age).toBe(55)
        expect(user.name).toBe("David2 Bahidi2")
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Cairo',
        })
        .expect(400)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

        // validate the user is removed 
        const user = await User.findById(userOneId)
        expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

