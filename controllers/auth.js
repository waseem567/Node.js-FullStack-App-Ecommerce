const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
exports.getLogin = (req, res, next) => {
	res.render("auth/login.ejs", {
		pageTitle: "Login",
		path: "/login",
		auth: req.session.loggedIn,
		validityError: [],
		flashError: {},
	});
};
exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const loginErrors = validationResult(req);
	if (!loginErrors.isEmpty()) {
		return res.render("auth/login.ejs", {
			pageTitle: "Login",
			path: "/login",
			auth: req.session.loggedIn,
			flashError: req.flash("error"),
			validityError: loginErrors.array(),
		});
	} else {
		// findig user
		User.findOne({ email: email }).then((user) => {
			if (!user) {
				req.flash("error", "User with this email does not found!");
				return res.render("auth/login.ejs", {
					pageTitle: "Login",
					path: "/login",
					auth: req.session.loggedIn,
					flashError: req.flash("error"),
					validityError: loginErrors.array(),
				});
			}
			//   comparing
			bcrypt.compare(password, user.password).then((doMatch) => {
				if (doMatch) {
					req.session.loggedIn = true;
					req.session.user = user;
					return req.session.save((err) => {
						return res.redirect("/");
					});
				}
			});
			// end comparing
			// end finding user
		});
	}
};

//     })
//   }else{
//     User.findOne({ email: email }).then((user) => {
//         if (!user) {
//           req.flash("error", "User with this email does not found!");
//           return res.render("auth/login.ejs" , {
//             pageTitle: "Login",
//             path: "/login",
//             auth: req.session.loggedIn,
//             flashError: req.flash('error'),
//             validityError : loginErrors.array(),
//           });
//         }
//     })
//     }
// };
// }else{
// bcrypt.compare(password, user.password).then((doMatch) => {
//     if (doMatch) {
//       req.session.loggedIn = true;
//       req.session.user = user;
//       return req.session.save((err) => {
//         return res.redirect("/");
//       });
//     }else{
//         req.flash("error", "Wrong password!");
//         return res.redirect("/login");
//     }
// });
// });
exports.getSignup = (req, res, next) => {
	res.render("auth/signup.ejs", {
		pageTitle: "Signup",
		path: "/signup",
		auth: req.session.loggedIn,
		errorMessage: req.flash("errorMessage"),
		errMessage: null,
		oldInputValue: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});
};
exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.render("auth/signup.ejs", {
			pageTitle: "Signup",
			path: "/signup",
			auth: req.session.loggedIn,
			errorMessage: errors.array(),
			errMessage: null,
			oldInputValue: {
				email: email,
				password: password,
				confirmPassword: confirmPassword,
			},
		});
	}
	User.findOne({ email: email }).then((user) => {
		if (user) {
			req.flash(
				"errorMessage",
				"Already registered, please pick different email..."
			);
			return res.render("auth/signup.ejs", {
				pageTitle: "Signup",
				path: "/signup",
				auth: req.session.loggedIn,
				errorMessage: [],
				errMessage: req.flash("errorMessage"),
				oldInputValue: {
					email: email,
					password: password,
					confirmPassword: confirmPassword,
				},
			});
		}
		return bcrypt
			.hash(password, 12)
			.then((hashedPassword) => {
				const user = new User({
					email: email,
					password: hashedPassword,
					cart: { items: [] },
				});
				return user.save();
			})
			.then((saved) => {
				return res.redirect("/login");
			});
	});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy(() => {
		delete req.session;
		res.redirect("/login");
	});
};
