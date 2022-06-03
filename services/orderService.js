exports.formatOrders = order => ({
	...order._doc,
	price: order.courses.reduce((total, course) => {
		return total += course.count * course.course.price
	}, 0)
})