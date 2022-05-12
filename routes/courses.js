const { Router } = require('express')
const router = Router()

router.get('/', (reqeust, response) => {
	response.render('courses', {
		title: 'Courses page',
		isCoursesPage: true
	})
})

router.get('/create', (request, response) => {
	response.render('create', {
		title: 'Create a new course',
		isCreatePage: true
	})
})

module.exports = router