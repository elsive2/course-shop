document.querySelectorAll('.price').forEach(node => {
	node.textContent = new Intl.NumberFormat('ja-JP', {
		currency: 'USD',
		style: 'currency'
	}).format(node.textContent)
})

const $cart = document.querySelector('#cart')
if ($cart) {
	$cart.addEventListener('click', event => {
		if (event.target.classList.contains('js-remove')) {
			const id = event.target.dataset.id

			fetch('/cart/remove/' + id, {
				method: 'DELETE'
			}).then(response => response.json())
				.then(result => console.log(result))
		}
	})
}