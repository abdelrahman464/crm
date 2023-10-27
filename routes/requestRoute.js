const express = require("express");

const { protect, allowedTo } = require("../services/authServices");
const {
  canSendRequest,
  SendRequest,
  deleteRequest,
  updateRequest,
  getAllRequests,
  calculateTotalBalance,
  myRequests,
} = require("../services/requestServices");
const {
  requestUpdateValidator,
  requestGetAllValidator,
  requestCreateValidator,
} = require("../utils/validators/requestValidator");

const router = express.Router();
router.get("/myReq", protect, myRequests);

router.get(
  "/totalAcceptedBalance",
  protect,
  allowedTo("admin"),
  calculateTotalBalance
);

router.get(
  "/:status?",
  protect,
  allowedTo("admin"),
  requestGetAllValidator,
  getAllRequests
);

router
  .route("/")
  .post(
    protect,
    allowedTo("user"),
    canSendRequest,
    requestCreateValidator,
    SendRequest
  );
router
  .route("/:id")
  .delete(protect, allowedTo("admin"), deleteRequest)
  .put(protect, allowedTo("admin"), requestUpdateValidator, updateRequest);

module.exports = router;
