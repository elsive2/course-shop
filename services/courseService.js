exports.isOwner = function (course, user) {
	return course.userId.toString() == user._id.toString()
}