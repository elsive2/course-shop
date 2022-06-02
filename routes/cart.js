const { Router } = require('express')
const router = Router()
const controller = require('../controllers/cartController')

router.post('/add', controller.addToCart)
router.get('/', controller.getCart)
router.delete('/remove/:id', controller.deleteFromCart)

module.exports = router