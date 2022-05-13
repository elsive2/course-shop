const uuid = require('uuid')
const fs = require('fs')
const path = require('path')

const PATH = path.join(__dirname, '..', 'data', 'courses.json')

class Course {
	constructor(object) {
		this.object = object

		this.object.id = uuid.v4()
	}

	async save() {
		const courses = await Course.getAll()
		courses.push(this.object)

		return new Promise((resolve, reject) => {
			fs.writeFile(PATH, JSON.stringify(courses), (err) => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}

	static getAll() {
		return new Promise((resolve, reject) => {
			fs.readFile(PATH, 'utf-8', (err, content) => {
				if (err) {
					reject(err)
				} else {
					resolve(JSON.parse(content))
				}
			}
			)
		})
	}
}

module.exports = Course