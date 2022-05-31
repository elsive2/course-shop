const { Router } = require('express')
const router = Router()
const User = require('../models/user')
const auth = require('../middlewares/auth')
const bcrypt = require('bcryptjs')
const emailOptions = require('../emails/registration')
const emailService = require('../services/email')

router.get('/login', async (request, response) => {
	response.render('auth/login', {
		title: 'Login',
		isLoginPage: true,
		loginError: request.flash('loginError'),
		registerError: request.flash('registerError'),
		success: request.flash('success')
	})
})

router.post('/login', async (request, response) => {
	try {
		const { email, password } = request.body
		const candidate = await User.findOne({ email })

		if (candidate) {
			const passwordsAreSame = await bcrypt.compare(password, candidate.password)

			if (passwordsAreSame) {
				request.session.user = candidate
				request.session.isAuthenticated = true
				return request.session.save(err => {
					if (err) throw err

					emailService.getInstance().sendMail(emailOptions(email), (error, info) => {
						if (err) throw err

						request.flash('success', 'You signed in successfully!')
						response.redirect('/')
					})
				})
			}

		}
		request.flash('loginError', 'Wrong email or paassword!')
		response.redirect('/auth/login#login')

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

			request.flash('success', 'You registrated successfully!')
			response.redirect('/auth/login#login')
		} else {
			request.flash('registerError', 'The email is already engaged!')
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