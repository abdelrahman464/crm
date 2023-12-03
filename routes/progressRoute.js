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
  uploadTicket,
  applyForVisa,
} = require("../services/progressServices");

const router = express.Router();

//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/uploadContract/:requestId/:requestType")
  .post(
    protect,
    allowedTo("employee", "admin"),
    uploads,
    resize,
    uploadContract
  );

//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/uploadSignedContract/:requestId")
  .post(protect, allowedTo("user"), uploads, resize, uploadSignedContract);

//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/uploadOfferLetter/:requestId/:requestType")
  //-----------------------------------------------------------------------------------------------------------------------------
  .post(
    protect,
    allowedTo("employee", "admin"),
    uploads,
    resize,
    uploadOfferLetter
  );
//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/uploadSignedOfferLetter/:requestId")
  .post(protect, allowedTo("user"), uploads, resize, uploadSignedOfferLetter);
//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/uploadMOHERE/:requestId")
  .post(protect, allowedTo("user"), uploads, resize, uploadMOHERE);
//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/uploadTicket/:requestId")
  .post(protect, allowedTo("user"), uploads, resize, uploadTicket);
//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/applyForVisa/:requestId")
  .post(protect, allowedTo("user"), applyForVisa);

//-----------------------------------------------------------------------------------------------------------------------------
router.post(
  "/webhookPayVisaFees",
  express.raw({ type: "application/json" }),
  webhookCheckoutPayVisaFees
);
//-----------------------------------------------------------------------------------------------------------------------------
router.post(
  "/webhookPayFees",
  express.raw({ type: "application/json" }),
  webhookCheckoutPayFees
);
//-----------------------------------------------------------------------------------------------------------------------------
router.post(
  "/webhookRegistrationFees",
  express.raw({ type: "application/json" }),
  webhookCheckoutRegistrationFees
);
module.exports = router;
