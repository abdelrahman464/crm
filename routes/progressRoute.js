const express = require("express");
const {
  uploadContractValidator,
  uploadSignedContractValidator,
  uploadOfferLetterValidator,
  uploadSignedOfferLetterValidator,
  uploadMOHEREValidator,
  uploadTicketValidator,
  uploadEMGSValidator,
  uploadMOHEREApprovalValidator,
  uploadEVALValidator,
} = require("../utils/validators/progessValidator");
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
  uploadMOHEREApproval,
  uploadEMGS,
  uploadEVAL,
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
    uploadContractValidator,
    uploadContract
  );

//-----------------------------------------------------------------------------------------------------------------------------
//valid who upload the signed contract is the user who sent request
router
  .route("/uploadSignedContract/:requestId")
  .post(
    protect,
    allowedTo("user"),
    uploads,
    resize,
    uploadSignedContractValidator,
    uploadSignedContract
  );

//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/uploadOfferLetter/:requestId/:requestType")
  .post(
    protect,
    allowedTo("employee", "admin"),
    uploads,
    resize,
    uploadOfferLetterValidator,
    uploadOfferLetter
  );
//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/uploadSignedOfferLetter/:requestId")
  .post(
    protect,
    allowedTo("user"),
    uploads,
    resize,
    uploadSignedOfferLetterValidator,
    uploadSignedOfferLetter
  );
//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/uploadMOHERE/:requestId")
  .post(
    protect,
    allowedTo("user"),
    uploads,
    resize,
    uploadMOHEREValidator,
    uploadMOHERE
  );
//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/uploadEVAL/:requestId/:requestType")
  .post(
    protect,
    allowedTo("employee", "admin"),
    uploads,
    resize,
    uploadEVALValidator,
    uploadEVAL
  );
//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/uploadMOHEREApproval/:requestId/:requestType")
  .post(
    protect,
    allowedTo("employee", "admin"),
    uploads,
    resize,
    uploadMOHEREApprovalValidator,
    uploadMOHEREApproval
  );
//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/uploadEMGS/:requestId/:requestType")
  .post(
    protect,
    allowedTo("employee", "admin"),
    uploads,
    resize,
    uploadEMGSValidator,
    uploadEMGS
  );
//-----------------------------------------------------------------------------------------------------------------------------
router
  .route("/uploadTicket/:requestId")
  .post(
    protect,
    allowedTo("user"),
    uploads,
    resize,
    uploadTicketValidator,
    uploadTicket
  );
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
