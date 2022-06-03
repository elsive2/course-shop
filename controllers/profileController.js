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
		const toChange = { name: req.body.name }

		if (req.file) {
			toChange.avatarUrl = req.file.path
		}

		Object.assign(req.user, toChange)
		await req.user.save()
		res.redirect('/profile')
	} catch (e) {
		req.flash('error', 'Something went wrong!')
		res.redirect('/profile')
	}
}