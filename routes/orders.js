const { Router } = require('express')
const Order = require('../models/order')
const router = Router()

router.get('/', async (request, response) => {
	response.render('orders', {
		isOrderPage: true,
		title: 'Orders'
	})
})

router.post('/', async (request, response) => {
	response.redirect('/orders')
})

module.exports = router