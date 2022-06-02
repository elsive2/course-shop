const { Router } = require('express')
const router = Router()
const auth = require('../middlewares/auth')
const { registerValidator } = require('../utils/validator')
const controller = require('../controllers/authController')

router.get('/login', controller.getLogin)
router.post('/login', controller.login)
router.post('/register', registerValidator, controller.register)
router.post('/logout', auth, controller.logout)
router.get('/reset', auth, controller.getReset)
router.post('/reset', auth, controller.reset)
router.get('/reset_password', auth, controller.getResetPassword)
router.post('/reset_password', auth, controller.resetPassword)

module.exports = router