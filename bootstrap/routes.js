const homeRoutes = require('../routes/home')
const courseRoutes = require('../routes/courses')
const authRoutes = require('../routes/auth')
const cartRoutes = require('../routes/cart')
const orderRoutes = require('../routes/orders')
const profileRoutes = require('../routes/profile')

const authMiddleware = require('../middlewares/auth')

module.exports = function (app) {
	app.use('/', homeRoutes)
	app.use('/courses', courseRoutes)
	app.use('/auth', authRoutes)
	app.use('/cart', authMiddleware, cartRoutes)
	app.use('/orders', authMiddleware, orderRoutes)
	app.use('/profile', authMiddleware, profileRoutes)

	// handle not found exception (404)
	app.get('*', (req, res) => {
		res.status(404).render('404', {
			title: 'Page not found!'
		})
	})
}