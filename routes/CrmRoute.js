const express = require("express");

const { protect, allowedTo } = require("../services/authServices");

const {
 assignEmployeeForRequest,removeEmployeeFromRequest
} = require("../services/CrmService");

const router = express.Router();

router
  .route("/assign")
  .put(protect,allowedTo("admin"),assignEmployeeForRequest)
router
  .route("/remove")
  .put(protect,allowedTo("admin"),removeEmployeeFromRequest)
  
module.exports = router;
