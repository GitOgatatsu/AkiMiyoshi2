const BlogModel = require("../../models/blog");

module.exports = async (req, res) => {
	try {
		await BlogModel.deleteOne({ _id: req.params.id });
		res.redirect("/");
	} catch( error ) {
		res.render("error", { message: "/deleteのエラー" });
	}
}
