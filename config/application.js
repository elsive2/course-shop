require('dotenv').config()

const config = {
	PORT: process.env.PORT || 3000,
	CONNECTION: process.env.MONGODB_URI,
	SESSION_SECRET: process.env.SESSION_SECRET
}

module.exports = config