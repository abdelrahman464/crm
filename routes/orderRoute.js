const express = require("express");

const { protect, allowedTo } = require("../services/authServices");

const {
  getAllOrders,
  getAllRequestOrders,
} = require("../services/orderService");

const router = express.Router();

router.route("/").get(protect, allowedTo("admin"), getAllOrders);
router
  .route("/:requestId/:requestType")
  .get(protect, allowedTo("admin", "employee"), getAllRequestOrders);

module.exports = router;
