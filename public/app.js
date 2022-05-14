const toCurrency = price => {
	return new Intl.NumberFormat('ja-JP', {
		currency: 'USD',
		style: 'currency'
	}).format(price)
}

document.querySelectorAll('.price').forEach(node => {
	node.textContent = toCurrency(node.textContent)
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
										<button class="btn js-remove" data-id="${c.id}">Delete</button>
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