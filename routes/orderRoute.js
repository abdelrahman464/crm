const express = require("express");

const { protect, allowedTo } = require("../services/authServices");

const {
  getOrdersBetweenDates,
  getAllRequestOrders,
  updateOrderToPaid,
} = require("../services/orderService");

const router = express.Router();

router
  .route("/:paied?")
  .post(protect, allowedTo("admin"), getOrdersBetweenDates);
router
  .route("/:requestId/:requestType")
  .get(protect, allowedTo("admin", "employee", "user"), getAllRequestOrders);
router
  .route("/:id/setAsPaied")
  .put(protect, allowedTo("admin", "employee"), updateOrderToPaid);
module.exports = router;
