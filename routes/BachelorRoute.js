const express = require("express");

const { protect, allowedTo } = require("../services/authServices");
const {
  canSendRequest,
  filterRequests,
} = require("../services/handlerFactory");
const {
  getAllBachelors,
  getBachelorById,
  sendBachelorRequest,
  updateBachelorRequest,
  deleteBachelor,
  uploads,
  resize,
  goToNextStepAftersignContract,
  goToNextStepAftercontractFees,
  goToNextStepAftersendingOfferLetter,
  goToNextStepAfterdeliverAndSignOfferLetter,
  goToNextStepAftergetCopyOfMohere,
  goToNextStepAftervisaFees,
  goToNextStepAftergettingEMGSApproval,
  goToNextStepAfterregistrationFees,
  goToNextStepAftergettingFinalAcceptanceLetter,
  goToNextStepAfterrecievingTicketCopy,
  goToNextStepAfterapplyingForVisa,
} = require("../services/BachelorServices");

const router = express.Router();

router
  .route("/")
  .get(protect, filterRequests, getAllBachelors)
  .post(
    protect,
    allowedTo("user"),
    canSendRequest,
    uploads,
    resize,
    sendBachelorRequest
  );
router.route("/:id").delete(protect, allowedTo("admin"), deleteBachelor).get(
  protect,
  allowedTo("admin", "user"), // we need validation to user that make the request who get it
  getBachelorById
);
router.route("/:id").post(protect, allowedTo("admin"), updateBachelorRequest);

router
  .route("/goToNextStepAfterapplyingForVisa/:id")
  .post(protect, allowedTo("employee"), goToNextStepAfterapplyingForVisa);
router
  .route("/goToNextStepAftercontractFees/:id")
  .post(protect, allowedTo("employee"), goToNextStepAftercontractFees);
router
  .route("/goToNextStepAfterdeliverAndSignOfferLetter/:id")
  .post(
    protect,
    allowedTo("employee"),
    goToNextStepAfterdeliverAndSignOfferLetter
  );
router
  .route("/goToNextStepAftergetCopyOfMohere/:id")
  .post(protect, allowedTo("employee"), goToNextStepAftergetCopyOfMohere);
router
  .route("/goToNextStepAftergettingEMGSApproval/:id")
  .post(protect, allowedTo("employee"), goToNextStepAftergettingEMGSApproval);
router
  .route("/goToNextStepAftergettingFinalAcceptanceLetter/:id")
  .post(
    protect,
    allowedTo("employee"),
    goToNextStepAftergettingFinalAcceptanceLetter
  );
router
  .route("/goToNextStepAfterrecievingTicketCopy/:id")
  .post(protect, allowedTo("employee"), goToNextStepAfterrecievingTicketCopy);
router
  .route("/goToNextStepAfterregistrationFees/:id")
  .post(protect, allowedTo("employee"), goToNextStepAfterregistrationFees);
router
  .route("/goToNextStepAftersendingOfferLetter/:id")
  .post(protect, allowedTo("employee"), goToNextStepAftersendingOfferLetter);
router
  .route("/goToNextStepAftersignContract/:id")
  .post(protect, allowedTo("employee"), goToNextStepAftersignContract);
router
  .route("/goToNextStepAftervisaFees/:id")
  .post(protect, allowedTo("employee"), goToNextStepAftervisaFees);

module.exports = router;
