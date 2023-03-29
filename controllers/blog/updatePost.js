const BlogModel = require("../../models/blog");

module.exports = async (req, res) => {
	try {
		await BlogModel.updateOne({ _id: req.params.id }, req.body);
		res.redirect("/");
	} catch (error) {
		res.render("error", { message: "/updateのエラー" });
	}
}
