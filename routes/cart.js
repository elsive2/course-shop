const { Router } = require('express')
const router = Router()
const Course = require('../models/course')

function formatCourses(cart) {
	return cart.items.map((item) => {
		return {
			...item.courseId._doc,
			count: item.count
		}
	})
}

function calculatePrice(courses) {
	return courses.reduce((total, course) => {
		return total += course.price * course.count
	}, 0)
}

router.post('/add', async (request, response) => {
	const course = await Course.findById(request.body.id)
	await request.user.addToCart(course)
	response.redirect('/courses')
})

router.get('/', async (request, response) => {
	viewOptions = {
		title: 'Cart',
		isCartPage: true
	}

	try {
		const user = await request.user.populate('cart.items.courseId')
		const courses = formatCourses(user.cart)
		const price = calculatePrice(courses)

		viewOptions.price = price
		viewOptions.courses = courses
	} catch (e) { } finally {
		response.render('cart', viewOptions)
	}
})

router.delete('/remove/:id', async (request, response) => {
	await request.user.removeFromCart(request.params.id)
	const user = await request.user.populate('cart.items.courseId')
	const courses = formatCourses(user.cart)

	response.json({
		courses, price: calculatePrice(courses)
	})
})

module.exports = router