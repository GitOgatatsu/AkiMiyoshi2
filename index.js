const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
const session = require("express-session");
const routers = require("./routes");
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

app.use(routers);

// Page NotFound
app.get("*", (req, res) => {
	res.render("error", { message: "ページが存在しません" });
});


// Listening
app.listen( port, () => {
	console.log( `Litening on localhost port ${port}` );
});
