const { Router } = require('express')
const router = Router()
const auth = require('../middlewares/auth')
const User = require('../models/user')

router.get('/', auth, (req, res) => {
	res.render('profile', {
		title: 'Profile',
		isProfilePage: true,
		user: req.user.toObject()
	})
})

router.post('/', async (req, res) => {
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
})

module.exports = router