const express = require("express");

const { protect, allowedTo } = require("../services/authServices");
const { canSendRequest } = require("../services/handlerFactory");
const {
  getAllMasters,
  getMasterById,
  updateMasterRequest,
  sendMasterRequest,
  deleteMaster,
} = require("../services/MasterServices");

const router = express.Router();

router
  .route("/")
  .get(protect, getAllMasters)
  .post(protect, allowedTo("user"), canSendRequest, sendMasterRequest);
router
  .route("/:id")
  .delete(protect, allowedTo("admin"), deleteMaster)
  .get(
    protect,
    allowedTo("admin", "user"), // we need validation to user that make the request who get it
    getMasterById
  )
  .put(protect, allowedTo("admin", "user"), updateMasterRequest);

module.exports = router;
