const UserModel = require("../../models/user");

module.exports = async (req, res) => {
	try {
		await UserModel.create(req.body);
		res.redirect("/user/login");
	} catch (error) {
		res.render("error", { message: "/user/createのエラー" });
	}
}
