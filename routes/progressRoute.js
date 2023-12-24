const express = require("express");

const { protect, allowedTo } = require("../services/authServices");
const {
  uploads,
  nextStep,
  uploadContract,
  uploadSignedContract,
  uploadOfferLetter,
  uploadSignedOfferLetter,
  uploadMOHERE,
  resize,
  checkoutSessionToPayFees,
  webhookCheckoutPayFees,
  uploadTicket,
  applyForVisa,
} = require("../services/progressServices");

const router = express.Router();

//validation for employee
//validation for current step if require any fees
router
  .route("/nextStep/:requestId/:requestType")
  .put(protect, allowedTo("employee", "admin"), nextStep);

//-----------------------------------------------------------------------------------------------------------------------------

//valid who upload the contract is the employee that has assigned to request
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
//valid who upload the signed contract is the user who sent request
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
  .route("/uploadMOHERE/:requestId/:requestType")
  .post(protect, allowedTo("user"), uploads, resize, uploadMOHERE);
//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/uploadTicket/:requestId")
  .post(protect, allowedTo("user"), uploads, resize, uploadTicket);
//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/applyForVisa/:requestId")
  .post(protect, allowedTo("user"), applyForVisa);

//------------------------WEBHOOKS--------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
router.post(
  "/webhookPayFees",
  express.raw({ type: "application/json" }),
  webhookCheckoutPayFees
);

router.put("/checkoutSession/:requestId", protect, checkoutSessionToPayFees);

module.exports = router;
