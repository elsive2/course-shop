const csruf = require('csurf')
const connect_flash = require('connect-flash')
const variablesMiddleware = require('../middlewares/variables')
const userMiddleware = require('../middlewares/user')
const fileMiddleware = require('../middlewares/file')
const helmet = require('helmet')
const compression = require('compression')

module.exports = function (app) {
	app.use(csruf())
	app.use(connect_flash())
	app.use(variablesMiddleware)
	app.use(userMiddleware)
	app.use(fileMiddleware.single('avatar'))
	app.use(helmet())
	app.use(compression())
}