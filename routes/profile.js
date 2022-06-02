const { Router } = require('express')
const router = Router()
const auth = require('../middlewares/auth')

router.get('/', (request, response) => {
	response.render('profile', {
		title: 'Profile',
		isProfilePage: true,
		user: request.user.toObject()
	})
})

router.post('/', async (request, response) => {

})

module.exports = router