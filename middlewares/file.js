const multer = require('multer')

const permittedExtensions = [
	'image/png',
	'image/jpeg',
	'image/jpg'
]

const fileFilter = (req, file, cb) => {
	if (permittedExtensions.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(null, false)
	}
}

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'public/images')
	},
	filename(req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
	}
})


module.exports = multer({
	storage,
	fileFilter
})