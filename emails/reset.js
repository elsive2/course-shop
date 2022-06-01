const cfg = require('../config/application')

module.exports = function (email, token) {
	return {
		to: email,
		from: cfg.EMAIL_FROM,
		subject: 'Recover your password',
		html: `
			<h1>Course Shop</h1>
			<h2>Recover your password</h2>
			<p>If you didn't request to reset your passwort ignore this email</p>
			<p>Otherwise, click the link below to reset your password:</p>
			<p><a href="${cfg.BASE_URL}/auth/reset_password?token=${token}">Reset</a></p>
		`
	}
}