const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { User } = require("../../models");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("name required")
    .isLength({ min: 2 })
    .withMessage("too short User name")
    .isLength({ max: 100 })
    .withMessage("too long User name")
    ,

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters")
    .isLength({ max: 32 })
    .withMessage("password must be at least 8 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("password does not match");
      }
      return true;
    }),

  check("passwordConfirm").notEmpty().withMessage("password required"),
  check("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  check("DataEntryPhone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  check("CeoPhone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),
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
