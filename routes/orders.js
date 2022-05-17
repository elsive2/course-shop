const { Router } = require('express')
const Order = require('../models/order')
const router = Router()

router.get('/', async (request, response) => {
	try {
		const orders = await Order.find({ 'user.userId': request.user._id })
			.populate('user.userId')

		response.render('orders', {
			isOrderPage: true,
			title: 'Orders',
			orders: orders.map(order => ({
				...order._doc,
				price: order.courses.reduce((total, course) => {
					return total += course.count * course.course.price
				}, 0)
			}))
		})
	} catch (e) {
		console.log(e)
	}
})

router.post('/', async (request, response) => {
	try {
		const user = await request.user.populate('cart.items.courseId')
		const courses = user.cart.items.map(item => ({
			course: { ...item.courseId._doc },
			count: item.count
		}))

		const order = new Order({
			user: {
				name: request.user.name,
				email: request.user.email,
				userId: request.user
			},
			courses
		})

		await order.save()
		await request.user.clearCart()

		response.redirect('/orders')
	} catch (e) {
		console.log(e)
	}
})


module.exports = router