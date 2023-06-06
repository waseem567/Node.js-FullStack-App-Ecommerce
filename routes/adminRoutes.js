const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const authMiddleware = require("../authMiddleware/authentication");

router.get("/admin-products", authMiddleware, adminController.getAdminProducts);

router.get("/add-product", authMiddleware, adminController.getAddProduct);

router.post("/add-product", adminController.postAddProduct);

router.post("/admin-products", adminController.postDeleteProduct);

router.get("/edit/:productId", authMiddleware, adminController.getEditProduct);

router.post(
	"/edit/:productId",
	authMiddleware,
	adminController.postEditProduct
);

module.exports = router;
