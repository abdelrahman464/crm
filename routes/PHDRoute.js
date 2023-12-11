const express = require("express");

const { protect, allowedTo } = require("../services/authServices");
const {
  canSendRequest,
  filterRequests,
} = require("../services/handlerFactory");
const {
  getAllPhDs,
  checkAuthorityRequestPHD,
  getPhDById,
  sendBPhdRequest,
  updatePHDByUser,
  uploads,
  resize,
  updatePhDRequestEligibility,
  deletePhD,
  goToNextStepAfterapplyingForVisa,
  goToNextStepAftercontractFees,
  goToNextStepAfterdeliverAndSignOfferLetter,
  goToNextStepAftergetCopyOfMohere,
  goToNextStepAftergettingEMGSApproval,
  goToNextStepAftergettingFinalAcceptanceLetter,
  goToNextStepAfterrecievingTicketCopy,
  goToNextStepAfterregistrationFees,
  goToNextStepAftersendingOfferLetter,
  goToNextStepAftersignContract,
  goToNextStepAftervisaFees,
} = require("../services/PH_DServices");

const router = express.Router();

router
  .route("/")
  .get(protect, filterRequests, getAllPhDs)
  .post(
    protect,
    allowedTo("user"),
    canSendRequest,
    uploads,
    resize,
    sendBPhdRequest
  );
router
  .route("/:id")
  .delete(protect, allowedTo("admin"), deletePhD)
  .get(
    protect,
    allowedTo("admin", "user", "employee"), // we need validation to user that make the request who get it
    checkAuthorityRequestPHD,
    getPhDById
  )
  .put(protect, allowedTo("user"), uploads, resize, updatePHDByUser);
//elgibility
router
  .route("/:id/eligibility")
  .put(protect, allowedTo("admin"), updatePhDRequestEligibility);

//steps
router
  .route("/goToNextStepAfterapplyingForVisa")
  .post(protect, allowedTo("employee"), goToNextStepAfterapplyingForVisa);
router
  .route("/goToNextStepAftercontractFees")
  .post(protect, allowedTo("employee"), goToNextStepAftercontractFees);
router
  .route("/goToNextStepAfterdeliverAndSignOfferLetter")
  .post(
    protect,
    allowedTo("employee"),
    goToNextStepAfterdeliverAndSignOfferLetter
  );
router
  .route("/goToNextStepAftergetCopyOfMohere")
  .post(protect, allowedTo("employee"), goToNextStepAftergetCopyOfMohere);
router
  .route("/goToNextStepAftergettingEMGSApproval")
  .post(protect, allowedTo("employee"), goToNextStepAftergettingEMGSApproval);
router
  .route("/goToNextStepAftergettingFinalAcceptanceLetter")
  .post(
    protect,
    allowedTo("employee"),
    goToNextStepAftergettingFinalAcceptanceLetter
  );
router
  .route("/goToNextStepAfterrecievingTicketCopy")
  .post(protect, allowedTo("employee"), goToNextStepAfterrecievingTicketCopy);
router
  .route("/goToNextStepAfterregistrationFees")
  .post(protect, allowedTo("employee"), goToNextStepAfterregistrationFees);
router
  .route("/goToNextStepAftersendingOfferLetter")
  .post(protect, allowedTo("employee"), goToNextStepAftersendingOfferLetter);
router
  .route("/goToNextStepAftersignContract")
  .post(protect, allowedTo("employee"), goToNextStepAftersignContract);
router
  .route("/goToNextStepAftervisaFees")
  .post(protect, allowedTo("employee"), goToNextStepAftervisaFees);

module.exports = router;
