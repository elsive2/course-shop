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

