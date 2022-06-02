const { Router } = require('express')
const router = Router()
const controller = require('../controllers/orderController')

router.get('/', controller.getAll)
router.post('/', controller.create)

module.exports = router