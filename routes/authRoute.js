const express = require("express");

const {
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
  generateVerifyCode
} = require("../services/authServices");
const{uploads,resize}=require("../services/userServices")

const router = express.Router();

router.post("/signup",uploads,resize, signup);
router.route("/verifyEmail").post(protect, verifyEmail);
router.route("/sendVerifyCode").post(protect, generateVerifyCode);

router.route("/login").post(loginValidator, login);

router.route("/forgotPassword").post(forgotPassword);
router
  .route("/verifyResetCode")
  .post(verifyresetPasswordValidator, verifyPassResetCode);
router.route("/resetPassword").put(resetPassword);

module.exports = router;
