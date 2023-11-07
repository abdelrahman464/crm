const express = require("express");

const {
  signupValidator,
  loginValidator,
  verifyresetPasswordValidator,
} = require("../utils/validators/authValidator");
const {
  signup,
  verifyEmail,
  protect,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  generateVerifyCode,
} = require("../services/authServices");

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.route("/verifyEmail").post(protect, verifyEmail);
router.route("/sendVerifyCode").get(protect, generateVerifyCode);

router.route("/login").post(loginValidator, login);

router.route("/forgotPassword").post(forgotPassword);
router
  .route("/verifyResetCode")
  .post(verifyresetPasswordValidator, verifyPassResetCode);
router.route("/resetPassword").put(resetPassword);

module.exports = router;
