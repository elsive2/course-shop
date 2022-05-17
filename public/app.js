const toCurrency = price => {
	return new Intl.NumberFormat('ja-JP', {
		currency: 'USD',
		style: 'currency'
	}).format(price)
}

const toDate = date => {
	return new Intl.DateTimeFormat('en-US').format(new Date(date))
}

document.querySelectorAll('.price').forEach(node => {
	node.textContent = toCurrency(node.textContent)
})

document.querySelectorAll('.date').forEach(node => {
	node.textContent = toDate(node.textContent)
})

const $cart = document.querySelector('#cart')
if ($cart) {
	$cart.addEventListener('click', event => {
		if (event.target.classList.contains('js-remove')) {
			const id = event.target.dataset.id

			fetch('/cart/remove/' + id, {
				method: 'DELETE'
			}).then(response => response.json())
				.then(cart => {
					if (cart.courses.length !== 0) {
						const html = cart.courses.map(c => {
							return `
								<tr>
									<td>${c.title}</td>
									<td>${c.count}</td>
									<td>
										<button class="btn js-remove" data-id="${c._id}">Delete</button>
									</td>
								</tr>
							`
						}).join('')

						$cart.querySelector('tbody').innerHTML = html
						$cart.querySelector('.price').textContent = toCurrency(cart.price)
					} else {
						$cart.innerHTML = '<p>Your shopping cart is empty</p>'
					}
				})
		}
	})
}