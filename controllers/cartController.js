const Course = require('../models/course')
const cartService = require('../services/cartService.js')

exports.addToCart = async function (req, res) {
	const course = await Course.findById(req.body.id)
	await req.user.addToCart(course)
	res.redirect('/courses')
}

exports.getCart = async function (req, res) {
	viewOptions = {
		title: 'Cart',
		isCartPage: true
	}

	try {
		const user = await req.user.populate('cart.items.courseId')
		const courses = cartService.formatCourses(user.cart)
		const price = cartService.calculatePrice(courses)

		viewOptions.price = price
		viewOptions.courses = courses
	} catch (e) { } finally {
		res.render('cart', viewOptions)
	}
}

exports.deleteFromCart = async function (req, res) {
	await req.user.removeFromCart(req.params.id)
	const user = await req.user.populate('cart.items.courseId')
	const courses = cartService.formatCourses(user.cart)

	res.json({
		courses, price: cartService.calculatePrice(courses)
	})
}