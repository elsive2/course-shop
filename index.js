require('dotenv').config()

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/user')
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

const app = express()
const PORT = process.env.PORT || 3000

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

// routes
app.use('/', require('./routes/home'))
app.use('/courses', require('./routes/courses'))
app.use('/cart', require('./routes/cart'))
app.use('/orders', require('./routes/orders'))

async function start() {
	try {
		await mongoose.connect(process.env.MONGODB_URI)

		// create the temporary user
		const candidate = await User.findOne()
		if (!candidate) {
			const user = new User({
				email: 'test@gmail.com',
				name: 'John',
				cart: { item: [] }
			})
			await user.save()
		}

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}...`)
		})
	} catch (e) {
		console.log(e)
	}
}
start()