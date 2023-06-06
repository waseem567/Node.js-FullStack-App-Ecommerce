const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth");
const { check, body } = require("express-validator");

router.get("/login", userController.getLogin);

router.post(
  "/login",
  check("email").isEmail().withMessage("Please enter a valid email..."),
  check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters long..."),
  userController.postLogin
);

router.get("/signup", userController.getSignup);

router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Please enter a valid email..."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Please enter password of length atleast 6 characters..."),
    check("confirmPassword")
      .custom((value, { req }) => {
        if (value === req.body.password) {
          return true;
        }
        return false;
      })
      .withMessage("Both passwords have to be matched..."),
  ],
  userController.postSignup
);

router.post("/logout", userController.postLogout);

module.exports = router;
