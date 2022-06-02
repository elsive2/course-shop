const multer = require('multer')

const permittedExtensions = [
	'image/png',
	'image/jpeg',
	'image/jpg'
]

module.exports = multer({
	storage: multer.diskStorage({
		destination(request, file, callback) {
			callback(null, 'images')
		},
		filename(request, file, callback) {
			callback(null, new Date().toISOString() + ' ' + file.originalname)
		}
	}),

	fileFilter: (request, file, callback) => {
		if (permittedExtensions.includes(file.mimetype)) {
			callback(null, true)
		} else {
			callback(null, false)
		}
	}
})