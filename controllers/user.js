const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const mongoose = require("mongoose");
const product = require("../models/product");
const session = require("express-session");
const stripe = require("stripe")(
	"sk_test_51NDrRrAzaSClxK0USgBgsBy4dkiAFZmRYlqQFF17RwP3fd05MkdiQXZDYcAbI5dOISmcKHJDy7BV2MBobdQahdMI00MagYsn0B"
);

exports.getUserProducts = (req, res, next) => {
	Product.find().then((products) => {
		res.render("user/products.ejs", {
			pageTitle: "Products",
			path: "/",
			products: products,
			productDetail: false,
		});
	});
};

exports.getProductDetail = (req, res, next) => {
	const productid = req.params.productId;
	const id = new mongoose.Types.ObjectId(productid);
	Product.findById({ _id: productid }).then((product) => {
		res.render("user/products.ejs", {
			pageTitle: product.title,
			path: "",
			products: product,
			productDetail: true,
			auth: req.session.user,
		});
	});
};

exports.getCart = (req, res, next) => {
	User.find().then((user) => {
		const products = user;
		const cart = products[0].cart.items;
		let totalQuantity = 0;
		let individualQuantity = [];
		cart.map((product) => {
			totalQuantity += product.quantity;
			individualQuantity.push(product.quantity);
		});
		const ids = [];
		cart.map((id) => {
			ids.push(id.productId.toString());
		});
		Product.find()
			.where("_id")
			.in(ids)
			.exec((err, records) => {
				let totalPrice = 0;
				records.map((prod, index) => {
					totalPrice += prod.price * individualQuantity[index];
				});
				console.log(totalPrice);
				res.render("user/cart.ejs", {
					auth: req.session.user,
					path: "/cart",
					pageTitle: "Your Cart",
					products: records,
					totalPrice: totalPrice,
					items: records.length,
					totalQuantity: totalQuantity,
				});
			});
	});
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.prodId;
	Product.findById(prodId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then((result) => {
			res.redirect("/cart");
		});
};

exports.postDeleteCart = (req, res, next) => {
	const delProductId = req.body.productid;
	Product.findById(delProductId)
		.then((product) => {
			console.log("cart " + product);
			return req.user.deleteFromCart(product);
		})
		.then((result) => {
			res.redirect("/cart");
		});
};
exports.getOrders = (req, res, next) => {
	Order.find().then((orders) => {
		res.render("user/orders.ejs", {
			path: "/orders",
			pageTitle: "Your Orders",
			orders: orders,
			auth: req.session.user,
		});
	});
};
exports.postOrders = (req, res, next) => {
	const price = req.body.totalPrice;
	const quantity = req.body.totalQuantity;
	const items = req.body.totalItems;
	if (price > 0) {
		const order = new Order({
			amount: price,
			quantity: quantity,
			items: items,
		});
		order.save().then((saved) => {
			req.user.clearCart().then((resp) => {
				console.log(resp);
				res.redirect("/orders");
			});
		});
	} else {
		res.redirect("/");
	}
};
exports.postDeleteOrder = (req, res, next) => {
	const id = req.body.deleteOrderId;
	Order.findByIdAndDelete(id).then((result) => {
		res.redirect("/orders");
	});
};

exports.postSearchResult = (req, res, next) => {
	const searched = req.body.searchedProduct;
	Product.find({ title: searched }).then((searchedProducts) => {
		res.render("user/search-result.ejs", {
			pageTitle: searched,
			products: searchedProducts,
			path: "",
			auth: req.session.user,
		});
	});
};
exports.getCheckOut = async (req, res, next) => {
	res.render("user/check-out.ejs", {
		auth: req.session.user,
		path: "/check-out",
		pageTitle: "Checkout",
	});
};

// exports.postCheckOut = async (req, res) => {
// 	console.log(req.body.sessionId);
// 	try {
// 		const customer = await stripe.customers.create({
// 			email: "customer@example.com",
// 			source: "stripeToken", // replace with a valid payment source token or ID
// 		});

// 		const session = await stripe.checkout.sessions.create({
// 			payment_method_types: ["card"],
// 			customer: customer.id,
// 			line_items: [
// 				{
// 					price_data: {
// 						currency: "usd",
// 						product_data: {
// 							name: "Product",
// 						},
// 						unit_amount: 1000, // amount in cents
// 					},
// 					quantity: 1,
// 				},
// 			],
// 			mode: "payment",
// 			success_url: "http://localhost:3000/",
// 			cancel_url: "http://localhost:3000/",
// 		});
// 		res.send({ success: "success" });
// 	} catch (error) {
// 		console.error("Error:", error);
// 		res.status(500).send("An error occurred.");
// 	}
// };
