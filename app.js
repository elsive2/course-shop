const express = require('express')
const path = require('path')
const app = express()

const middlewares = require('./bootstrap/middlewares')
const routes = require('./bootstrap/routes')
const start = require('./bootstrap/start')
const session = require('./bootstrap/session')
const hbs = require('./bootstrap/handlebars')

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/public/images', express.static(path.join(__dirname, 'public', 'images')))
app.use(express.urlencoded({ extended: true }))

session(app)
middlewares(app)
routes(app)
start(app)