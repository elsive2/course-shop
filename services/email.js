const nodemailer = require('nodemailer')
const cfg = require('../config/application')

class EmailService {
	static getInstance() {
		return nodemailer.createTransport({
			host: "smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: cfg.EMAIL_USER,
				pass: cfg.EMAIL_PASSWORD
			}
		})
	}
}

module.exports = EmailService