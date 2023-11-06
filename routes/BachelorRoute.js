const express = require("express");

const { protect, allowedTo } = require("../services/authServices");
const { canSendRequest,filterRequests } = require("../services/handlerFactory");
const {
  getAllBachelors,
  getBachelorById,
  sendBachelorRequest,
  updateBachelorRequest,
  deleteBachelor,
  
} = require("../services/BachelorServices");

const router = express.Router();

router
  .route("/")
  .get(protect,filterRequests,getAllBachelors)
  .post(protect, allowedTo("user"), canSendRequest, sendBachelorRequest);
router
  .route("/:id")
  .delete(protect, allowedTo("admin"), deleteBachelor)
  .get(
    protect,
    allowedTo("admin", "user"), // we need validation to user that make the request who get it
    getBachelorById
  )
  .put(protect, allowedTo("admin"), updateBachelorRequest);

module.exports = router;
