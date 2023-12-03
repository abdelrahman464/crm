const express = require("express");

const { protect, allowedTo } = require("../services/authServices");
const {
  canSendRequest,
  filterRequests,
} = require("../services/handlerFactory");
const {
  uploads,
  resize,
  getAllMasters,
  getMasterById,
  updateMasterRequest,
  sendMasterRequest,
  deleteMaster,
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
} = require("../services/MasterServices");

const router = express.Router();

router
  .route("/")
  .get(protect, filterRequests, getAllMasters)
  .post(
    protect,
    allowedTo("user"),
    canSendRequest,
    uploads,
    resize,
    sendMasterRequest
  );
router
  .route("/:id")
  .delete(protect, allowedTo("admin"), deleteMaster)
  .get(
    protect,
    allowedTo("admin", "user"), // we need validation to user that make the request who get it
    getMasterById
  )
  .put(protect, allowedTo("admin", "employee"), updateMasterRequest);
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
