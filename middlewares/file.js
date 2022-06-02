const multer = require('multer')

const permittedExtensions = [
	'image/png',
	'image/jpeg',
	'image/jpg'
]

const fileFilter = (request, file, callback) => {
	if (permittedExtensions.includes(file.mimetype)) {
		callback(null, true)
	} else {
		callback(null, false)
	}
}

const storage = multer.diskStorage({
	destination(request, file, callback) {
		callback(null, 'public/images')
	},
	filename(request, file, callback) {
		callback(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
	}
})


module.exports = multer({
	storage,
	fileFilter
})