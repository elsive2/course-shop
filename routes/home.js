const { Router } = require('express')
const router = Router()
const controller = require('../controllers/homeController')

router.get('/', controller.index)

module.exports = router