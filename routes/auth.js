const { Router } = require('express')
const router = Router()
const User = require('../models/user')
const auth = require('../middlewares/auth')
const bcrypt = require('bcryptjs')

router.get('/login', async (request, response) => {
	response.render('auth/login', {
		title: 'Login',
		isLoginPage: true
	})
})

router.post('/login', async (request, response) => {
	try {
		const { email, password } = request.body
		const candidate = await User.findOne({ email })
		const passwordsAreSame = await bcrypt.compare(password, candidate.password)

		if (candidate && passwordsAreSame) {
			request.session.user = candidate
			request.session.isAuthenticated = true
			request.session.save(err => {
				if (err) throw err

				response.redirect('/')
			})
		} else {
			response.redirect('/auth/login#login')
		}
	} catch (e) {
		console.log(e)
	}
})

router.post('/register', async (request, response) => {
	try {
		const { email, password, name } = request.body
		const candidate = await User.findOne({ email })
		const hashPassword = await bcrypt.hash(password, 10)

		if (!candidate) {
			const user = new User({
				email,
				name,
				password: hashPassword,
				cart: { items: [] }
			})
			await user.save()
			response.redirect('/auth/login#login')
		} else {
			response.redirect('/auth/login#register')
		}


	} catch (e) {
		console.log(e)
	}
})

router.post('/logout', auth, async (request, response) => {
	request.session.destroy(() => {
		response.redirect('/')
	})
})

module.exports = router