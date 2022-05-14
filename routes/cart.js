const { Router } = require('express')
const { route } = require('express/lib/application')
const router = Router()
const Cart = require('../models/cart')
const Course = require('../models/course')

router.post('/add', async (request, response) => {
	const course = await Course.getById(request.body.id)
	await Cart.add(course)

	response.redirect('/cart')
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
	console.log(cart)
	response.status(200).json(cart)
})

module.exports = router