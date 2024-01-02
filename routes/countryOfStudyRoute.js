const express = require("express");

const { protect, allowedTo } = require("../services/authServices");

const {
  createCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
} = require("../services/countryOfStudyServices");

const router = express.Router();

router
  .route("/")
  .get(getAllCountries)
  .post(protect, allowedTo("admin"), createCountry);
router
  .route("/:id")
  .get(getCountryById)
  .put(protect, allowedTo("admin"), updateCountry)
  .delete(protect, allowedTo("admin"), deleteCountry);

module.exports = router;
