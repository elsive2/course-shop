const Course = require('../models/course')
const { validationResult } = require('express-validator')
const courseService = require('../services/courseService')

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
		req.flash('error', 'Something went wrong!')
		res.redirect('/courses')
	}
}

exports.getById = async function (req, res) {
	try {
		if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
			throw new Error('Identificator is invalid!')
		}

		const course = await Course.findById(req.params.id).lean()

		return res.render('course', {
			title: 'Single course',
			course
		})
	} catch (e) {
		req.flash('error', e.message)
		res.redirect('/courses')
	}
}

exports.showEdit = async function (req, res) {
	try {
		const course = await Course.findById(req.params.id).lean()

		if (!courseService.isOwner(course, req.user)) {
			throw new Error('Nice try bro =)')
		}

		res.render('edit', {
			title: `Edit ${course.title}`,
			course
		})
	} catch (e) {
		req.flash('error', e.message)
		res.redirect('/courses')
	}
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
		if (!courseService.isOwner(course, req.user)) {
			throw new Error('Nice try bro =)')
		}

		course.title = req.body.title
		course.price = req.body.price
		course.image = req.body.image

		await course.save()
		res.redirect('/courses')
	} catch (e) {
		req.flash('error', e.message)
		res.redirect('/courses')
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
		req.flash('error', 'Something went wrong!')
		res.redirect('/courses')
	}
}