const mongoose = require('mongoose')
const cfg = require('../config/application')

module.exports = async function start(app) {
	try {
		await mongoose.connect(cfg.CONNECTION)

		app.listen(cfg.PORT, () => {
			console.log(`Server is running on port ${cfg.PORT}...`)
		})
	} catch (e) {
		console.log(e)
	}
}