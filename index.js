require('dotenv').config()

const PORT = process.env.PORT || 3000
const CONNECTION = process.env.MONGODB_URI

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/user')
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)

const app = express()
const hbs = require('express-handlebars').create({
	defaultLayout: 'main',
	extname: 'hbs',
	handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
	extended: true
}))

app.use(session({
	secret: 'secret-key',
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		collection: 'sessions',
		uri: CONNECTION
	})
}))

// middlewares
app.use(async (request, response, next) => {
	try {
		const user = await User.findOne()
		request.user = user
		next()
	} catch (e) {
		console.log(e)
	}
})
app.use(require('./middlewares/variables'))

// routes
app.use('/', require('./routes/home'))
app.use('/courses', require('./routes/courses'))
app.use('/cart', require('./routes/cart'))
app.use('/orders', require('./routes/orders'))
app.use('/auth', require('./routes/auth'))

async function start() {
	try {
		await mongoose.connect(CONNECTION)

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}...`)
		})
	} catch (e) {
		console.log(e)
	}
}
start()