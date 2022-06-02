const { Router } = require('express')
const router = Router()
const User = require('../models/user')
const auth = require('../middlewares/auth')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const emailOptions = require('../emails/registration')
const resetOptions = require('../emails/reset')
const emailService = require('../services/email')
const { validationResult } = require('express-validator')
const { registerValidator } = require('../utils/validator')

router.get('/login', (req, res) => {
	res.render('auth/login', {
		title: 'Login',
		isLoginPage: true,
		loginError: req.flash('loginError'),
		registerError: req.flash('registerError'),
		success: req.flash('success')
	})
})

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const candidate = await User.findOne({ email })

		if (candidate) {
			const passwordsAreSame = await bcrypt.compare(password, candidate.password)

			if (passwordsAreSame) {
				req.session.user = candidate
				req.session.isAuthenticated = true
				return req.session.save(err => {
					if (err) throw err

					emailService.getInstance().sendMail(emailOptions(email), (error, info) => {
						if (err) throw err

						req.flash('success', 'You signed in successfully!')
						res.redirect('/')
					})
				})
			}

		}
		req.flash('loginError', 'Wrong email or paassword!')
		res.redirect('/auth/login#login')

	} catch (e) {
		console.log(e)
	}
})

router.post('/register', registerValidator, async (req, res) => {
	try {
		const { email, password, name } = req.body
		const hashPassword = await bcrypt.hash(password, 10)

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			req.flash('registerError', errors.array()[0].msg)
			return res.status(422).redirect('/auth/login#register')
		}

		const user = new User({
			email,
			name,
			password: hashPassword,
			cart: { items: [] }
		})
		await user.save()

		req.flash('success', 'You registered successfully!')
		res.redirect('/auth/login#login')

	} catch (e) {
		console.log(e)
	}
})

router.post('/logout', auth, async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/')
	})
})

router.get('/reset', (req, res) => {
	res.render('auth/reset', {
		title: 'Reset password',
		error: req.flash('error')
	})
})

router.post('/reset', (req, res) => {
	try {
		crypto.randomBytes(32, async (err, buffer) => {
			if (err) {
				req.flash('error', 'Something went wrong! Try it later!')
				return res.redirect('/auth/reset')
			}

			const token = buffer.toString('hex')
			const user = await User.findOne({ email: req.body.email })

			if (user) {
				user.resetToken = token
				user.resetTokenExp = Date.now() + 60 * 60 * 1000
				await user.save()

				emailService.getInstance().sendMail(resetOptions(user.email, token), (err, info) => {
					if (err) throw err

					req.flash('success', `Confirm password reset that was sent to the email - ${user.email}`)
					res.redirect('/auth/login')
				})
			} else {
				req.flash('error', 'There is no such a user with this email')
				return res.redirect('/auth/reset')
			}
		})
	} catch (e) {
		console.log(e)
	}
})

router.get('/reset_password', async (req, res) => {
	const token = req.query.token

	if (!token) {
		return res.redirect('/auth/login')
	}
	try {
		const user = await User.findOne({
			resetToken: token,
		})

		if (!user || user.resetTokenExp < Date.now()) {
			req.flash('error', 'Something went wrong! Try it again!')
			return res.redirect('/auth/login')
		}
		res.render('auth/password', {
			title: 'Change your password',
			error: req.flash('error'),
			userId: user._id.toString(),
			token
		})
	} catch (e) {
		console.log(e)
	}
})

router.post('/reset_password', async (req, res) => {
	try {
		const { password, userId, token } = req.body
		const hashPassword = await bcrypt.hash(password, 10)
		c
		const user = await User.findOne({
			_id: userId,
			resetToken: token
		})

		if (!user || user.resetTokenExp < Date.now()) {
			req.flash('error', 'Something went wrong! Try it again!')
			return res.redirect('/auth/login')
		}

		user.password = hashPassword
		user.resetToken = undefined
		user.resetTokenExp = undefined

		await user.save()

		req.flash('success', 'Your password has been altered successfully!')
		res.redirect('/auth/login')

	} catch (e) {
		console.log(e)
	}
})

module.exports = router