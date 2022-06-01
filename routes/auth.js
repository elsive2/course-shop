const { Router } = require('express')
const router = Router()
const User = require('../models/user')
const auth = require('../middlewares/auth')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const emailOptions = require('../emails/registration')
const resetOptions = require('../emails/reset')
const emailService = require('../services/email')

router.get('/login', (request, response) => {
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

router.get('/reset', (request, response) => {
	response.render('auth/reset', {
		title: 'Reset password',
		error: request.flash('error')
	})
})

router.post('/reset', (request, response) => {
	try {
		crypto.randomBytes(32, async (err, buffer) => {
			if (err) {
				request.flash('error', 'Something went wrong! Try it later!')
				return response.redirect('/auth/reset')
			}

			const token = buffer.toString('hex')
			const user = await User.findOne({ email: request.body.email })

			if (user) {
				user.resetToken = token
				user.resetTokenExp = Date.now() + 60 * 60 * 1000
				await user.save()

				emailService.getInstance().sendMail(resetOptions(user.email, token), (err, info) => {
					if (err) throw err

					request.flash('success', `Confirm password reset that was sent to the email - ${user.email}`)
					response.redirect('/auth/login')
				})
			} else {
				request.flash('error', 'There is no such a user with this email')
				return response.redirect('/auth/reset')
			}
		})
	} catch (e) {
		console.log(e)
	}
})

router.get('/reset_password', async (request, response) => {
	const token = request.query.token

	if (!token) {
		return response.redirect('/auth/login')
	}
	try {
		const user = await User.findOne({
			resetToken: token,
		})

		if (!user || user.resetTokenExp < Date.now()) {
			return response.redirect('/auth/login')
		}
		response.render('auth/password', {
			title: 'Change your password',
			error: request.flash('error'),
			userId: user._id.toString(),
			token
		})
	} catch (e) {
		console.log(e)
	}
})

module.exports = router