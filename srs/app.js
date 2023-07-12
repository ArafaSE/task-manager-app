const path = require('path')
const express = require('express')
const hbs = require('hbs')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/task-manager.yaml');
require('./db/mongoose')

const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')
const siteRouter = require('./routes/site')

const app = express()

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine views location 
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve 
app.use(express.static(publicDirPath))

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(siteRouter)

module.exports = app