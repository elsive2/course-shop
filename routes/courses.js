const { Router } = require('express')
const router = Router()
const auth = require('../middlewares/auth')
const { courseValidator } = require('../utils/validator')
const controller = require('../controllers/coursesController')

router.get('/', controller.getAll)
router.get('/create', auth, controller.showCreate)
router.post('/create', auth, courseValidator, controller.create)
router.get('/:id', controller.getById)
router.get('/:id/edit', auth, controller.showEdit)
router.post('/edit', auth, courseValidator, controller.edit)
router.post('/remove', auth, controller.delete)

module.exports = router