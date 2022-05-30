const { Router } = require('express')
const router = Router()
const User = require('../models/user')
const auth = require('../middlewares/auth')

router.get('/login', async (request, response) => {
	response.render('auth/login', {
		title: 'Login',
		isLoginPage: true
	})
})

router.post('/login', async (request, response) => {
	const user = await User.findOne()
	request.session.user = user
	request.session.isAuthenticated = true
	request.session.save(err => {
		if (err) throw err

		response.redirect('/')
	})
})

router.post('/logout', auth, async (request, response) => {
	request.session.destroy(() => {
		response.redirect('/')
	})
})

module.exports = router