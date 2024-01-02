const express = require("express");

const { protect, allowedTo } = require("../services/authServices");

const {
  createtService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../services/serviceServices");

const router = express.Router();

router
  .route("/")
  .get(getAllServices)
  .post(protect, allowedTo("admin"), createtService);
router
  .route("/:id")
  .get(getServiceById)
  .put(protect, allowedTo("admin"), updateService)
  .delete(protect, allowedTo("admin"), deleteService);

module.exports = router;
