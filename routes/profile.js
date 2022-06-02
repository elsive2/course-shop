const { Router } = require('express')
const router = Router()
const controller = require('../controllers/profileController')

router.get('/', controller.getProfile)
router.post('/', controller.changeProfile)

module.exports = router