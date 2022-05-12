const { Router } = require('express')
const router = Router()

router.get('/', (reqeust, response) => {
	response.render('index', {
		title: 'Home page',
		isHomePage: true
	})
})

module.exports = router