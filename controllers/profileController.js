const User = require('../models/user')

exports.getProfile = function (req, res) {
	res.render('profile', {
		title: 'Profile',
		isProfilePage: true,
		user: req.user.toObject()
	})
}

exports.changeProfile = async function (req, res) {
	try {
		const user = await User.findById(req.user._id)
		const toChange = {
			name: req.body.name,
		}

		if (req.file) {
			toChange.avatarUrl = req.file.path
		}

		Object.assign(user, toChange)
		await user.save()
		res.redirect('/profile')
	} catch (e) {
		console.log(e)
	}
}