exports.formatCourses = function (cart) {
	return cart.items.map((item) => {
		return {
			...item.courseId._doc,
			count: item.count
		}
	})
}

exports.calculatePrice = function (courses) {
	return courses.reduce((total, course) => {
		return total += course.price * course.count
	}, 0)
}

exports.addToCart = function (user, course) {
	return new Promise((resolve, reject) => {
		const items = [...user.cart.items]
		const index = items.findIndex(c => c.courseId.toString() === course._id.toString())

		if (index >= 0) {
			items[index].count++
		} else {
			items.push({ courseId: course._id })
		}
		user.cart = { items }
		user.save()
		resolve()
	})
}

exports.removeFromCart = function (user, id) {
	return new Promise((resolve, reject) => {
		let items = [...user.cart.items]
		const index = items.findIndex(c => c.courseId.toString() === id)

		if (items[index].count <= 1) {
			items = items.filter(c => c.courseId.toString() !== id)
		} else {
			items[index].count--
		}
		user.cart = { items }
		user.save()
		resolve()
	})
}

exports.clearCart = function (user) {
	return new Promise((resolve, reject) => {
		user.cart = { items: [] }
		user.save()
		resolve()
	})
}