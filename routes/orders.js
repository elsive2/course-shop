const { Router } = require('express')
const Order = require('../models/order')
const router = Router()

router.get('/', async (req, res) => {
	try {
		const orders = await Order.find({ 'user.userId': req.user._id })
			.populate('user.userId')

		res.render('orders', {
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

router.post('/', async (req, res) => {
	try {
		const user = await req.user.populate('cart.items.courseId')
		const courses = user.cart.items.map(item => ({
			course: { ...item.courseId._doc },
			count: item.count
		}))

		const order = new Order({
			user: {
				name: req.user.name,
				email: req.user.email,
				userId: req.user
			},
			courses
		})

		await order.save()
		await req.user.clearCart()

		res.redirect('/orders')
	} catch (e) {
		console.log(e)
	}
})


module.exports = router