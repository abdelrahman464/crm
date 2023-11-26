const express = require("express");

const { protect, allowedTo } = require("../services/authServices");
const {
  uploads,
  uploadContract,
  uploadSignedContract,
  uploadOfferLetter,
  uploadSignedOfferLetter,
  uploadMOHERE,
  resize,
  webhookCheckoutPayVisaFees,
  webhookCheckoutPayFees,
  webhookCheckoutRegistrationFees,
} = require("../services/progressServices");

const router = express.Router();

router
  .route("/uploadContract")
  .post(protect, allowedTo("employee"), uploads, resize, uploadContract);
router
  .route("/uploadSignedContract")
  .post(protect, allowedTo("user"), uploads, resize, uploadSignedContract);
router
  .route("/uploadOfferLetter")
  .post(protect, allowedTo("employee"), uploads, resize, uploadOfferLetter);
router
  .route("/uploadSignedOfferLetter")
  .post(protect, allowedTo("user"), uploads, resize, uploadSignedOfferLetter);
router
  .route("/uploadMOHERE")
  .post(protect, allowedTo("user"), uploads, resize, uploadMOHERE);

router.post(
  "/webhookPayVisaFees",
  express.raw({ type: "application/json" }),
  webhookCheckoutPayVisaFees
);
router.post(
  "/webhookPayFees",
  express.raw({ type: "application/json" }),
  webhookCheckoutPayFees
);
router.post(
  "/webhookRegistrationFees",
  express.raw({ type: "application/json" }),
  webhookCheckoutRegistrationFees
);
module.exports = router;
