exports.index = function (req, res) {
	res.render('index', {
		title: 'Home page',
		isHomePage: true,
		success: req.flash('success')
	})
}