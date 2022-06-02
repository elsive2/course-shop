const { Router } = require('express')
const router = Router()
const Course = require('../models/course')
const auth = require('../middlewares/auth')
const { courseValidator } = require('../utils/validator')
const { validationResult } = require('express-validator')

function isOwner(course, user) {
	return course.userId.toString() == user._id.toString()
}

router.get('/', async (request, response) => {
	const courses = await Course.find()
		.lean()
		.populate('userId', ['name', 'email'])

	response.render('courses', {
		title: 'Courses page',
		isCoursesPage: true,
		userId: request.user ? request.user._id.toString() : null,
		error: request.flash('error'),
		courses
	})
})

router.get('/create', auth, (request, response) => {
	response.render('create', {
		title: 'Create a new course',
		isCreatePage: true,
	})
})

router.post('/create', auth, courseValidator, async (request, response) => {
	request.body.userId = request.user
	const course = new Course(request.body)

	const errors = validationResult(request)
	if (!errors.isEmpty()) {
		return response.status(422).render('create', {
			title: 'Create a new course',
			isCreatePage: true,
			error: errors.array()[0].msg,
			data: request.body
		})
	}

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

router.get('/:id/edit', auth, async (request, response) => {
	if (!request.query.allow) {
		return response.redirect('/courses')
	}
	const course = await Course.findById(request.params.id).lean()

	if (!isOwner(course, request.user)) {
		request.flash('error', 'Nice try bro =)')
		return response.redirect('/courses')
	}

	response.render('edit', {
		title: `Edit ${course.title}`,
		course
	})
})

router.post('/edit', auth, courseValidator, async (request, response) => {
	try {
		const course = await Course.findById(request.body.id)
		const errors = validationResult(request)

		if (!errors.isEmpty()) {
			return response.status(422).render('edit', {
				title: `Edit ${course.title}`,
				error: errors.array()[0].msg,
				course
			})
		}
		// if (!isOwner(course, request.user)) {
		// 	request.flash('error', 'Nice try bro =)')
		// 	return response.redirect('/courses')
		// }

		course.title = request.body.title
		course.price = request.body.price
		course.image = request.body.image

		await course.save()
		response.redirect('/courses')
	} catch (e) {
		console.log(e)
	}
})

router.post('/remove', auth, async (request, response) => {
	try {
		await Course.deleteOne({
			_id: request.body.id,
			userId: request.user._id
		})
		response.redirect('/courses')
	} catch (e) {
		console.log(e)
	}
})

module.exports = router