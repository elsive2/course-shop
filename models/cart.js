const path = require('path')
const fs = require('fs')

const PATH = path.join(__dirname, '..', 'data', 'cart.json')
class Card {
	static async add(data) {
		const cart = await this.fetch()

		const index = cart.courses.findIndex(c => c.id === data.id)
		const course = cart.courses[index]

		if (course) {
			// course already exists in cart
			course.count++
			cart.courses[index] = course
		} else {
			// course is new in cart
			data.count = 1
			cart.courses.push(data)
		}
		cart.price += +data.price

		return new Promise((resolve, reject) => {
			fs.writeFile(PATH, JSON.stringify(cart), (err) => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}

	static async fetch() {
		if (!fs.existsSync(PATH)) {
			fs.writeFile(PATH, JSON.stringify({ courses: [], price: 0 }), (err) => {
				if (err) throw err
			})
		}
		return new Promise((resolve, reject) => {
			fs.readFile(PATH, 'utf-8', (err, content) => {
				if (err) {
					reject(err)
				} else {
					resolve(JSON.parse(content))
				}
			})
		})
	}
}

module.exports = Card