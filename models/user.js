const { Schema, model } = require('mongoose')

const User = new Schema({
	email: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	cart: {
		items: [
			{
				count: {
					type: Number,
					required: true,
					default: 1
				},
				courseId: {
					type: Schema.Types.ObjectId,
					ref: 'Course',
					required: true
				}
			}
		]
	},
	avatarUrl: String,
	resetToken: String,
	resetTokenExp: Date
})

module.exports = model('User', User)