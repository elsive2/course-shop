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
app.get('/', (request, response) => {
	response.render('index', {
		title: 'Home page',
		isHomePage: true
	})
})

app.get('/courses', (request, response) => {
	response.render('courses', {
		title: 'Courses page',
		isCoursesPage: true
	})
})

app.get('/create', (request, response) => {
	response.render('create', {
		title: 'Create a new course',
		isCreatePage: true
	})
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`)
})