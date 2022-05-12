const express = require('express')
const app = express()

const hbs = require('express-handlebars').create({
	defaultLayout: 'main',
	extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

app.use(express.static('public'))

// routes
app.use('/', require('./routes/home'))
app.use('/courses', require('./routes/courses'))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`)
})