const { Router } = require('express')
const router = Router()
const auth = require('../middlewares/auth')
const controller = require('../controllers/authController')
const { registerValidator } = require('../utils/validator')
const { resetPasswordValidator } = require('../utils/validator')

router.get('/login', controller.getLogin)
router.post('/login', controller.login)
router.get('/register', controller.getRegister)
router.post('/register', registerValidator, controller.register)
router.post('/logout', auth, controller.logout)
router.get('/reset', controller.getReset)
router.post('/reset', controller.reset)
router.get('/reset_password', controller.getResetPassword)
router.post('/reset_password', resetPasswordValidator, controller.resetPassword)

module.exports = router