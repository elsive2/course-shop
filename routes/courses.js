const { Router } = require('express')
const router = Router()
const Course = require('../models/course')

router.get('/', async (reqeust, response) => {
	const courses = await Course.getAll()
	response.render('courses', {
		title: 'Courses page',
		isCoursesPage: true,
		courses
	})
})

router.get('/create', (request, response) => {
	response.render('create', {
		title: 'Create a new course',
		isCreatePage: true,
	})
})

router.post('/create', async (request, response) => {
	const course = new Course(request.body)

	await course.save()

	response.redirect('/courses')
})

module.exports = router