const express = require("express");
const {
  changeLoggedUserPasswordValidator,
  updateLoggedUserValidator,
  createUserValidator,
  updateUserValidator,
} = require("../utils/validators/userValidator");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateLoggedUserData,
  updateLoggedUserPassword,
  getLoggedUserData,
  createFilterObj,
} = require("../services/userServices");
const authServices = require("../services/authServices");

const router = express.Router();

router.get("/getMe", authServices.protect, getLoggedUserData, getUserById);
router.put(
  "/changeMyPassword",
  authServices.protect,
  authServices.allowedTo("admin", "user"),
  changeLoggedUserPasswordValidator,
  updateLoggedUserPassword
);
router.put(
  "/changeMyData",
  authServices.protect,
  updateLoggedUserValidator,
  updateLoggedUserData
);
router
  .route("/:role?")
  .get(
    authServices.protect,
    authServices.allowedTo("admin", "employee"),
    createFilterObj,
    getAllUsers
  )
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "employee"),
    updateUserValidator,
    updateUser
  )
  .delete(authServices.protect, authServices.allowedTo("admin"), deleteUser)
  .get(authServices.protect, authServices.allowedTo("admin"), getUserById);

module.exports = router;
