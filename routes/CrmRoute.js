const express = require("express");

const { protect, allowedTo } = require("../services/authServices");

const {
  assignEmployeeForRequest,
  removeEmployeeFromRequest,
  sendLoggedUserIdToParams,
  getEmployeeRequests,
} = require("../services/CrmService");

const router = express.Router();

router
  .route("/assign")
  .put(protect, allowedTo("admin"), assignEmployeeForRequest);
router
  .route("/remove")
  .put(protect, allowedTo("admin"), removeEmployeeFromRequest);
router
  .route("/:employeeId/requests")
  .get(protect, allowedTo("admin"), getEmployeeRequests);
router
  .route("/myRequests")
  .get(
    protect,
    allowedTo("employee"),
    sendLoggedUserIdToParams,
    getEmployeeRequests
  );

module.exports = router;
