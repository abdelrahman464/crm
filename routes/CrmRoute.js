const express = require("express");

const { protect, allowedTo } = require("../services/authServices");

const {
  assignEmployeeForRequest,
  removeEmployeeFromRequest,
  getEmployeeRequests,
  getMyRequests,
  getRequestDocById,
} = require("../services/CrmService");

const router = express.Router();

router
  .route("/assign")
  .put(protect, allowedTo("admin"), assignEmployeeForRequest);
router
  .route("/remove")
  .put(protect, allowedTo("admin"), removeEmployeeFromRequest);
router
  .route("/reqDoc/:id")
  .get(protect, allowedTo("user", "admin", "employee"), getRequestDocById);
router
  .route("/myRequests")
  .get(
    protect,
    allowedTo("employee", "user", "admin"),
    getMyRequests
  );
router
  .route("/:id/requests")
  .get(protect, allowedTo("admin"), getEmployeeRequests);

module.exports = router;
