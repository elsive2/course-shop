const Course = require('../models/course')
const { validationResult } = require('express-validator')

function isOwner(course, user) {
	return course.userId.toString() == user._id.toString()
}

exports.getAll = async function (req, res) {
	const courses = await Course.find()
		.lean()
		.populate('userId', ['name', 'email'])

	res.render('courses', {
		title: 'Courses page',
		isCoursesPage: true,
		userId: req.user ? req.user._id.toString() : null,
		error: req.flash('error'),
		courses
	})
}

exports.showCreate = function (req, res) {
	res.render('create', {
		title: 'Create a new course',
		isCreatePage: true,
	})
}

exports.create = async function (req, res) {
	req.body.userId = req.user
	const course = new Course(req.body)

	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(422).render('create', {
			title: 'Create a new course',
			isCreatePage: true,
			error: errors.array()[0].msg,
			data: req.body
		})
	}

	try {
		await course.save()
		res.redirect('/courses')
	} catch (e) {
		console.log(e)
	}
}

exports.getById = async function (req, res) {
	if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
		const course = await Course.findById(req.params.id).lean()

		return res.render('course', {
			title: 'Single course',
			course
		})
	}
	return res.status(404)
		.redirect('/courses')
}

exports.showEdit = async function (req, res) {
	if (!req.query.allow) {
		return res.redirect('/courses')
	}
	const course = await Course.findById(req.params.id).lean()

	if (!isOwner(course, req.user)) {
		req.flash('error', 'Nice try bro =)')
		return res.redirect('/courses')
	}

	res.render('edit', {
		title: `Edit ${course.title}`,
		course
	})
}

exports.edit = async function (req, res) {
	try {
		const course = await Course.findById(req.body.id)
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(422).render('edit', {
				title: `Edit ${course.title}`,
				error: errors.array()[0].msg,
				course
			})
		}
		if (!isOwner(course, req.user)) {
			req.flash('error', 'Nice try bro =)')
			return res.redirect('/courses')
		}

		course.title = req.body.title
		course.price = req.body.price
		course.image = req.body.image

		await course.save()
		res.redirect('/courses')
	} catch (e) {
		console.log(e)
	}
}

exports.delete = async function (req, res) {
	try {
		await Course.deleteOne({
			_id: req.body.id,
			userId: req.user._id
		})
		res.redirect('/courses')
	} catch (e) {
		console.log(e)
	}
}