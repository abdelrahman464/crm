const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { User } = require("../../models");

exports.signupValidator = [
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 2 })
    .withMessage("Username should be at least 2 characters")
    .isLength({ max: 100 })
    .withMessage("Username should not exceed 100 characters")
    .custom(async (val) => {
      const user = await User.findOne({ where: { username: val } });
      if (user) {
        throw new Error("Username already in use");
      }
    }),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val) => {
      const user = await User.findOne({ where: { email: val } });
      if (user) {
        throw new Error("Email already in use");
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .isLength({ max: 32 })
    .withMessage("Password should not exceed 32 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Confirm password is required"),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters")
    .isLength({ max: 32 })
    .withMessage("password must be at least 8 characters"),
  validatorMiddleware,
];

exports.verifyresetPasswordValidator = [
  check("resetCode").notEmpty().withMessage("ٌReset Code Is Required"),
  validatorMiddleware,
];

exports.verifyEmailValidator = [
  check("verifyCode").notEmpty().withMessage("Verifycode required"),
  validatorMiddleware,
];
