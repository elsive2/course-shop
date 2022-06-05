require('dotenv').config()

const config = {
	PORT: process.env.PORT || 3000,
	CONNECTION: process.env.MONGODB_URI,
	BASE_URL: process.env.BASE_URL,

	SESSION_SECRET: process.env.SESSION_SECRET,

	EMAIL_USER: process.env.EMAIL_USER,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

	EMAIL_FROM: process.env.EMAIL_FROM,
}

module.exports = config