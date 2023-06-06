const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const flash = require("connect-flash");
const csrfProtection = csurf();
const bodyParser = require("body-parser");
const multer = require("multer");
const createHash = require("hash-generator");

const userRouts = require("./routes/userRoutes");
const adminRouts = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/user");

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images/");
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
	},
});
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const store = new MongoDBStore({
	uri: "your mongo uri",
	collection: "sessions",
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single("file")
);

app.use(
	session({
		secret: "my secret",
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.use(csrfProtection);
app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id).then((user) => {
		req.user = user;
		return next();
	});
});

app.use((req, res, next) => {
	res.locals.auth = req.session.user;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use(flash());
app.use(authRoutes);
app.use(adminRouts);
app.use(userRouts);

mongoose.connect("mongodb connection url").then((db) => {
	app.listen(3000, () => console.log("app is running"));
});
//mongodb+srv://waseem:nodeapp@nodefullstackapp.rhrulpf.mongodb.net/
