const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const authMiddleware = require("../authMiddleware/authentication");

router.get("/", userController.getUserProducts);

router.get("/cart", authMiddleware, userController.getCart);

router.get("/check-out", userController.getCheckOut);

// router.post("/check-out", userController.postCheckOut);

router.post("/cart", authMiddleware, userController.postCart);

router.post("/deleteCartProduct", userController.postDeleteCart);

router.get("/orders", authMiddleware, userController.getOrders);

router.post("/orders", userController.postOrders);

router.post("/deleteOrder", userController.postDeleteOrder);

router.post("/search", userController.postSearchResult);

router.get("/:productId([0-9a-fA-F]{24})", userController.getProductDetail);

module.exports = router;
