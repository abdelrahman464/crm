const express = require("express");

const { protect, allowedTo } = require("../services/authServices");

const {
  assignEmployeeForRequest,
  removeEmployeeFromRequest,
  sendLoggedUserIdToParams,
  getMyRequests,
  getRequestDocById
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
  .get(protect, allowedTo("user","admin","employee"), getRequestDocById);
router
  .route("/:id/requests")
  .get(protect, allowedTo("admin"), getMyRequests);
router
  .route("/myRequests")
  .get(
    protect,
    allowedTo("employee", "user", "admin"),
    sendLoggedUserIdToParams,
    getMyRequests
  );

module.exports = router;
