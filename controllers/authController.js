const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const emailOptions = require('../emails/registration')
const resetOptions = require('../emails/reset')
const emailService = require('../services/emailService')
const { validationResult } = require('express-validator')
const User = require('../models/user')

exports.getLogin = (req, res) => {
	res.render('auth/login', {
		title: 'Login',
		isLoginPage: true,
		success: req.flash('success')
	})
}

exports.login = async function (req, res) {
	const { email, password } = req.body

	try {
		const user = await User.findOne({ email })
		const passwordsAreSame = await bcrypt.compare(password, user.password)

		if (!user || !passwordsAreSame) {
			throw new Error
		}

		req.session.user = user
		req.session.isAuthenticated = true
		await req.session.save()

		req.flash('success', 'You signed in successfully!')
		res.redirect('/')
	} catch (e) {
		res.render('auth/login', {
			title: 'Login',
			isLoginPage: true,
			error: 'Wrong email or paassword!',
			email
		})
	}
}
exports.getRegister = function (req, res) {
	res.render('auth/register', {
		title: 'Registration'
	})
}

exports.register = async function (req, res) {
	const { email, password, name } = req.body
	try {
		const hashPassword = await bcrypt.hash(password, 10)
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			throw new Error(errors.array()[0].msg)
		}

		await emailService.getInstance().sendMail(emailOptions(email))

		const user = new User({
			email,
			name,
			password: hashPassword,
			cart: { items: [] }
		})
		await user.save()

		req.flash('success', 'You registered successfully!')
		res.redirect('/auth/login')

	} catch (e) {
		res.status(422).render('auth/register', {
			title: 'Register',
			error: e,
			data: req.body
		})
	}
}

exports.logout = async function (req, res) {
	await req.session.destroy()
	res.redirect('/')
}

exports.getReset = function (req, res) {
	res.render('auth/reset', {
		title: 'Reset password',
		error: req.flash('error')
	})
}

exports.reset = async function (req, res) {
	try {
		const buffer = crypto.randomBytes(32)
		const token = buffer.toString('hex')
		const user = await User.findOne({ email: req.body.email })

		if (!user) {
			throw new Error('There is no such a user with this email')
		}

		user.resetToken = token
		user.resetTokenExp = Date.now() + 60 * 60 * 1000

		await user.save()
		await emailService.getInstance().sendMail(resetOptions(user.email, token))

		req.flash('success', `Confirm password reset that was sent to the email - ${user.email}`)
		res.redirect('/auth/login')
	} catch (e) {
		req.flash('error', e.message)
		res.redirect('/auth/reset')
	}
}

exports.getResetPassword = async function (req, res) {
	try {
		const token = req.query.token
		if (!token) {
			throw new Error('Something went wrong with token')
		}

		const user = await User.findOne({
			resetToken: token,
		})

		if (!user) {
			throw new Error('Something went wrong with token')
		}
		if (user.resetTokenExp < Date.now()) {
			throw new Error('error', 'Token has inspired! =(')
		}

		res.render('auth/password', {
			title: 'Change your password',
			error: req.flash('error'),
			userId: user._id.toString(),
			token
		})
	} catch (e) {
		req.flash('error', e.message)
		res.redirect('/auth/login')
	}
}

exports.resetPassword = async function (req, res) {
	const { password, userId, token } = req.body
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			req.flash('error', errors.array()[0].msg)
			return res.status(422).redirect(`/auth/reset_password?token=${token}`)
		}

		const hashPassword = await bcrypt.hash(password, 10)
		const user = await User.findOne({
			_id: userId,
			resetToken: token
		})

		if (!user) {
			throw new Error('Something went wrong!')
		}
		if (user.resetTokenExp < Date.now()) {
			throw new Error('Token has inspired! =(')
		}

		user.password = hashPassword
		user.resetToken = undefined
		user.resetTokenExp = undefined

		await user.save()

		req.flash('success', 'Your password has been altered successfully!')
		res.redirect('/auth/login')

	} catch (e) {
		req.flash('error', e.message)
		res.redirect('/auth/login')
	}
}