const { Router } = require('express')
const router = Router()
const Course = require('../models/course')

router.post('/add', async (request, response) => {
	const course = await Course.findById(request.body.id)
	await request.user.addToCart(course)
	response.redirect('/courses')
})

router.get('/', async (request, response) => {
	const cart = await Cart.fetch()

	response.render('cart', {
		title: 'Cart',
		isCartPage: true,
		courses: cart.courses,
		price: cart.price
	})
})

router.delete('/remove/:id', async (request, response) => {
	const cart = await Cart.remove(request.params.id)

	response.json(cart)
})

module.exports = router