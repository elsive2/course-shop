const { Router } = require('express')
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
		cart
	})
})

module.exports = router