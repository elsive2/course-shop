const { Router } = require('express')
const router = Router()

router.get('/login', async (request, response) => {
	response.render('auth/login', {
		title: 'Login',
		isLoginPage: true
	})
})

router.post('/login', async (request, response) => {
	request.session.isAuthenticated = true
	response.redirect('/')
})

router.post('/logout', async (request, response) => {
	request.session.destroy(() => {
		response.redirect('/')
	})
})

module.exports = router