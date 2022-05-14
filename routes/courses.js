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

router.get('/:id', async (request, response) => {
	const course = await Course.getById(request.params.id)

	response.render('course', {
		title: 'Singe course',
		course
	})
})

router.get('/:id/edit', async (request, response) => {
	if (!request.query.allow) {
		return response.redirect('/courses')
	}

	const course = await Course.getById(request.params.id)

	response.render('edit', {
		title: `Edit ${course.title}`,
		course
	})
})

router.post('/edit', async (request, response) => {
	await Course.update(request.body)

	response.redirect('/courses')
})

module.exports = router