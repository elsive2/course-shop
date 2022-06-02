const cfg = require('../config/application')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)

module.exports = function (app) {
	app.use(session({
		secret: cfg.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
			collection: 'sessions',
			uri: cfg.CONNECTION
		})
	}))
}