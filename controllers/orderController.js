const Order = require('../models/order')
const orderService = require('../services/orderService')
const cartService = require('../services/cartService')

exports.getAll = async function (req, res) {
	try {
		const orders = await Order.find({ 'user.userId': req.user._id })
			.populate('user.userId')

		res.render('orders', {
			isOrderPage: true,
			title: 'Orders',
			orders: orders.map(orderService.formatOrders)
		})
	} catch (e) {
		req.flash('error', e.message)
		res.redirect('/')
	}
}

exports.create = async function (req, res) {
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
		await cartService.clearCart(req.user)

		res.redirect('/orders')
	} catch (e) {
		req.flash('error', e.message)
		res.redirect('/')
	}
}