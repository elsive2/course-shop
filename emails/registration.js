const cfg = require('../config/application')

module.exports = function (email) {
	return {
		to: email,
		from: cfg.EMAIL_FROM,
		subject: 'You successfully registered!',
		html: `
			<h1>Hey there!</h1>
			<p>Welcome to our course shop</p>
			<p>You successfully created a new account</p>
		`
	}
}