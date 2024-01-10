const express = require("express");

const { protect, allowedTo } = require("../services/authServices");

const {
  createCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
  uploads,
  resize,
} = require("../services/countryOfStudyServices");

const router = express.Router();

router
  .route("/")
  .get(getAllCountries)
  .post(protect, allowedTo("admin"), uploads, resize, createCountry);
router
  .route("/:id")
  .get(getCountryById)
  .put(protect, allowedTo("admin"), uploads, resize, updateCountry)
  .delete(protect, allowedTo("admin"), deleteCountry);

module.exports = router;
