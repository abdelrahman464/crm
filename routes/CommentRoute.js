const express = require("express");

const { protect, allowedTo } = require("../services/authServices");

const {
  sendLoggedEmployeeIdToParams,
  createtComment,
  deleteComment,
  getUserComments,
} = require("../services/CommentServices");

const router = express.Router();

router.route("/").post(protect, allowedTo("admin", "employee"),sendLoggedEmployeeIdToParams, createtComment);
router.route("/:id").delete(protect, allowedTo("admin"), deleteComment);
router
  .route("/:UserId")
  .get(protect, allowedTo("admin", "employee"), getUserComments);
module.exports = router;
