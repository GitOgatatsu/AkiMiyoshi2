module.exports = async (req, res) => {
	if (req.session.userId) {
		res.render("blogCreate");
	} else {
		res.redirct("/user/login");
	}
}
