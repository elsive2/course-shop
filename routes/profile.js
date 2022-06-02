const { Router } = require('express')
const router = Router()
const auth = require('../middlewares/auth')
const User = require('../models/user')

router.get('/', auth, (request, response) => {
	response.render('profile', {
		title: 'Profile',
		isProfilePage: true,
		user: request.user.toObject()
	})
})

router.post('/', async (request, response) => {
	try {
		const user = await User.findById(request.user._id)
		const toChange = {
			name: request.body.name,
		}

		if (request.file) {
			toChange.avatarUrl = request.file.path
		}

		Object.assign(user, toChange)
		await user.save()
		response.redirect('/profile')
	} catch (e) {
		console.log(e)
	}
})

module.exports = router