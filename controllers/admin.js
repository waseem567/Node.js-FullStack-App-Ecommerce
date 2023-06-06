const Product = require("../models/product");
const User = require("../models/user");
const mongoose = require("mongoose");
exports.getAdminProducts = (req, res, next) => {
	Product.find().then((products) => {
		res.render("admin/admin-products.ejs", {
			pageTitle: "Products",
			path: "/admin-products",
			products: products,
			productDetail: false,
			auth: req.session.loggedIn,
		});
	});
};
exports.getAddProduct = (req, res, next) => {
	res.render("admin/add-product.ejs", {
		pageTitle: "Add Products | Admin",
		path: "/add-product",
		auth: req.session.loggedIn,
		edit: false,
		imageErrorMsg: false,
		imageError: [],
		oldInputValues: {
			title: "",
			price: "",
			description: "",
		},
	});
};
exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const price = req.body.price;
	const image = req.file;
	const description = req.body.description;
	if (!image) {
		req.flash("imageError", "Selected file is not an image!");
		return res.render("admin/add-product", {
			imageError: req.flash("imageError"),
			pageTitle: "Add Products | Admin",
			path: "/add-product",
			auth: req.session.loggedIn,
			edit: false,
			imageErrorMsg: true,
			oldInputValues: {
				title: title,
				price: price,
				description: description,
			},
		});
	}

	const product = new Product({
		title: title,
		price: price,
		image: image.path,
		description: description,
		userId: req.user,
	});
	product.save().then((data) => {
		res.redirect("/admin-products");
	});
};
exports.getEditProduct = (req, res, next) => {
	const productid = req.params.productId;
	const id = mongoose.Types.ObjectId(productid);
	Product.find({ _id: id }).then((product) => {
		res.render("admin/add-product.ejs", {
			pageTitle: "Edit Produc",
			path: "/add-product",
			admin: req.session.user,
			edit: true,
			product: product[0],
			imageErrorMsg: false,
			imageError: [],
		});
	});
};
exports.postEditProduct = (req, res, next) => {
	const productid = req.params.productId;
	const id = mongoose.Types.ObjectId(productid);
	const editedTitle = req.body.title;
	const editedPrice = req.body.price;
	const image = req.file;
	const editeddescription = req.body.description;
	const filter = {
		_id: id,
	};
	const update = {
		title: editedTitle,
		price: editedPrice,
		description: editeddescription,
	};
	if (image) {
		const imageUrl = image.path;
		update["image"] = imageUrl;
	}

	Product.findOneAndUpdate(filter, update).then((product) => {
		res.redirect("/admin-products");
	});
};

exports.postDeleteProduct = (req, res, next) => {
	const product = req.body.productId;
	Product.findByIdAndRemove(product)
		.then((product) => {
			res.redirect("/admin-products");
		})
		.catch((err) => console.log(err));
};
