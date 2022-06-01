const { body } = require('express-validator')
const User = require('../models/user')

exports.registerValidator = [
	body('email', 'Email is incorrect!').isEmail().custom(async (value, { req }) => {
		try {
			const user = await User.findOne({ email: value })

			if (user) {
				return Promise.reject('The email is already engaged!')
			}
		} catch (e) {
			console.log(e)
		}
	}).normalizeEmail(),
	body('password', 'Password is incorrect!').isLength({ min: 8, max: 64 }).trim(),
	body('password_confirmation', 'Passwords must be the same!').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Passwords must be the same!')
		}
		return true
	}).trim(),
	body('name', 'Name is incorrect!').isLength({ min: 2, max: 64 })
]