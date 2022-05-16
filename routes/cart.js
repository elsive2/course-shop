const { Router } = require('express')
const router = Router()
const Course = require('../models/course')

router.post('/add', async (request, response) => {
	const course = await Course.findById(request.body.id)
	await request.user.addToCart(course)
	response.redirect('/courses')
})

router.get('/', async (request, response) => {
	const user = await request.user.populate('cart.items.courseId')
	const courses = user.cart.items.map((item) => {
		return { ...item.courseId._doc, count: item.count }
	})
	const price = courses.reduce((total, course) => {
		return total += course.price * course.count
	}, 0)


	response.render('cart', {
		title: 'Cart',
		isCartPage: true,
		price,
		courses
	})
})

router.delete('/remove/:id', async (request, response) => {
	const cart = await Cart.remove(request.params.id)

	response.json(cart)
})

module.exports = router