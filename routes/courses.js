const { Router } = require('express')
const router = Router()
const Course = require('../models/course')

router.get('/', async (reqeust, response) => {
	const courses = await Course.find().lean()

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

	try {
		await course.save()
		response.redirect('/courses')
	} catch (e) {
		console.log(e)
	}
})

router.get('/:id', async (request, response) => {
	if (request.params.id.match(/^[0-9a-fA-F]{24}$/)) {
		const course = await Course.findById(request.params.id).lean()

		return response.render('course', {
			title: 'Single course',
			course
		})
	}
	return response.status(404)
		.redirect('/courses')
})

router.get('/:id/edit', async (request, response) => {
	if (!request.query.allow) {
		return response.redirect('/courses')
	}
	const course = await Course.findById(request.params.id).lean()

	response.render('edit', {
		title: `Edit ${course.title}`,
		course
	})
})

router.post('/edit', async (request, response) => {
	try {
		await Course.findByIdAndUpdate(request.body.id, request.body)
		response.redirect('/courses')
	} catch (e) {
		console.log(e)
	}
})

router.post('/remove', async (request, response) => {
	try {
		await Course.deleteOne({ _id: request.body.id })
		response.redirect('/courses')
	} catch (e) {
		console.log(e)
	}
})

module.exports = router