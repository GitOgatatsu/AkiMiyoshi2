const UserModel = require("../../models/user");

module.exports = async (req, res) => {
	const user = await UserModel.findOne({ email: req.body.email });
	console.log(user);
	if (user !== null ) {
		if (req.body.password === user.password) {
			req.session.userId = user._id;
			res.redirect("/");
		} else {
			res.render("error", { message: "/user/loginのエラー: パスワードが違います" });
		}
	} else {
		res.render("error", { message: "/user/loginのエラー: ユーザが存在しません" });
	}
}
