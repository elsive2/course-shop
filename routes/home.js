const { Router } = require('express')
const router = Router()

router.get('/', (request, response) => {
	response.render('index', {
		title: 'Home page',
		isHomePage: true,
		success: request.flash('success')
	})
})

module.exports = router