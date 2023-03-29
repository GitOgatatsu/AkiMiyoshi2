const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
const session = require("express-session");
const port = process.env.PORT || 5000;

// Session
app.use(session({
	secret: "secretKey",
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 30000 }
} ) );



// Connecting to MongoDB
mongoose.connect("mongodb+srv://herasake:2g1CSfTWK6xb2m64@cluster0.mq7iilc.mongodb.net/?retryWrites=true&w=majority")
	.then(() => {
		console.log("Success: Connected to MongoDB");
	})
	.catch((error) => {
		console.error("Failure: Unconnected to MongoDB");
	});



// Defining Schema and Model
const Schema = mongoose.Schema;
const BlogSchema = new Schema({
	title: String,
	summary: String,
	image: String,
	textBody: String
});
const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		rquired: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

const BlogModel = mongoose.model("Blog", BlogSchema);
const UserModel = mongoose.model("BlogUser", UserSchema);





// Read All Blogs
app.get("/", async (req, res) => {
//	res.send("こんにちは");
	const allBlogs = await BlogModel.find();
	console.log(req.session.userId);
//	console.log("allBlogsの中身：", allBlogs);
//	res.send("全ブログデータを読み込みました");
	res.render("index", { allBlogs: allBlogs, session: req.session.userId } );
});



// Read One Blog
app.get("/blog/:id", async (req, res) => {
	console.log(req.session.userId);
	const oneBlog = await BlogModel.findById(req.params.id);
//	console.log("oneBlogの中身：", oneBlog);
//	res.send("個別の記事ページ");
	res.render("blogRead", { oneBlog: oneBlog, session: req.session.userId } );
});



// Create
app.get("/new", (req, res) => {
	if (req.session.userId) {
		res.render("blogCreate");
	} else {
		res.redirect("/user/create");
	}

});

app.post("/new", async (req, res) => {
//	console.log(req.body);
	await BlogModel.create(req.body);
//	res.send("データの書き込みが成功しました");
	res.redirect("/");
});



// Update
app.get("/update/:id", async (req, res) => {
	const oneBlog = await BlogModel.findById(req.params.id);
//	console.log("ondBlogの中身：", oneBlog);
	res.render("blogUpdate", { oneBlog });
});

app.post("/update/:id", async (req, res) => {
	console.log(req.params.id);
	console.log(req.body);
	try {
		await BlogModel.updateOne(
			{
				_id: req.params.id
			},
			req.body
		);
	} catch (err) {
		console.log(err);
	}
//	res.send("データの更新が成功しました");
	res.redirect("/");
});



// Delete
app.get("/delete/:id", async (req, res) => {
	const oneBlog = await BlogModel.findById(req.params.id);
//	console.log("ondBlogの中身：", oneBlog);
	res.render("blogDelete", { oneBlog });
});

app.post("/delete/:id", async (req, res) => {
	console.log(req.params.id);
	await BlogModel.deleteOne(
		{
			_id: req.params.id
		}
	);
//	res.send("データの削除が成功しました");
	res.redirect("/");
});



// Create User
app.get("/user/create", async (req, res) => {
	res.render("userCreate");
});

app.post("/user/create", async (req, res) => {
	await UserModel.create(req.body);
//	res.send("データの書き込みが成功しました");
	res.redirect("/user/login");
});



// Login
app.get("/user/login", async (req, res) => {
	res.render("login");
});

app.post("/user/login", async (req, res) => {
	const oneUser = await UserModel.findOne(
		{
			email: req.body.email
		}
	);
	console.log(oneUser);
	if (oneUser) {
		if (req.body.password === oneUser.password) {
			req.session.userId = oneUser._id;
	//		res.send("ログイン成功");
			res.redirect("/");
		} else {
//			res.send("パスワードが違います");
			res.render("error", { message: "/user/loginのエラー: パスワードが違います" });
		}
	} else {
		//		res.send("ユーザが存在しません");
		res.render("error", { message: "/user/loginのエラー: ユーザが存在しません" });
	}
});



app.get("*", (req, res) => {
	res.render("error", { message: "ページが存在しません" });
});


// Listening
app.listen( port, () => {
	console.log( `Litening on localhost port ${port}` );
});
