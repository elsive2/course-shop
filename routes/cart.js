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

router.post('/add', async (req, res) => {
	const course = await Course.findById(req.body.id)
	await req.user.addToCart(course)
	res.redirect('/courses')
})

router.get('/', async (req, res) => {
	viewOptions = {
		title: 'Cart',
		isCartPage: true
	}

	try {
		const user = await req.user.populate('cart.items.courseId')
		const courses = formatCourses(user.cart)
		const price = calculatePrice(courses)

		viewOptions.price = price
		viewOptions.courses = courses
	} catch (e) { } finally {
		res.render('cart', viewOptions)
	}
})

router.delete('/remove/:id', async (req, res) => {
	await req.user.removeFromCart(req.params.id)
	const user = await req.user.populate('cart.items.courseId')
	const courses = formatCourses(user.cart)

	res.json({
		courses, price: calculatePrice(courses)
	})
})

module.exports = router