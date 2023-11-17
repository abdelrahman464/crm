const express = require("express");

const { protect, allowedTo } = require("../services/authServices");
const { canSendRequest,filterRequests } = require("../services/handlerFactory");
const {
  getAllPhDs,
  getPhDById,
  sendBPhdRequest,
  updatePhDRequest,
  deletePhD,
} = require("../services/PH_DServices");

const router = express.Router();

router
  .route("/")
  .get(protect,filterRequests,getAllPhDs)
  .post(protect, allowedTo("user"), canSendRequest, sendBPhdRequest);
router
  .route("/:id")
  .delete(protect, allowedTo("admin"), deletePhD)
  .get(
    protect,
    allowedTo("admin", "user"), // we need validation to user that make the request who get it
    getPhDById
  )
  .put(protect, allowedTo("admin"), updatePhDRequest);

module.exports = router;