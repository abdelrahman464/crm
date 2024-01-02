const express = require("express");

const { protect, allowedTo } = require("../services/authServices");

const {
  getOrdersBetweenDates,
  getAllRequestOrders,
} = require("../services/orderService");

const router = express.Router();

router.route("/").post(protect, allowedTo("admin"), getOrdersBetweenDates);
router
  .route("/:requestId/:requestType")
  .get(protect, allowedTo("admin", "employee", "user"), getAllRequestOrders);

module.exports = router;
