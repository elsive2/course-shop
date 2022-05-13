document.querySelectorAll('.price').forEach(node => {
	node.textContent = new Intl.NumberFormat('ja-JP', {
		currency: 'USD',
		style: 'currency'
	}).format(node.textContent)
})