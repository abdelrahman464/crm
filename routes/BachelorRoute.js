const express = require("express");

const { protect, allowedTo } = require("../services/authServices");
const {
  canSendRequest,
  filterRequests,
} = require("../services/handlerFactory");
const {
  getAllBachelors,
  checkAuthorityRequestBachelor,
  getBachelorById,
  sendBachelorRequest,
  updateBachelorRequestEligibility,
  updateBachelorByUser,
  deleteBachelor,
  uploads,
  resize,
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
router
  .route("/:id")
  .delete(protect, allowedTo("admin"), deleteBachelor)
  .get(
    protect,
    allowedTo("admin", "user", "employee"), 
    checkAuthorityRequestBachelor,
    getBachelorById
  )
  .put(protect, allowedTo("user"), uploads, resize, updateBachelorByUser);

router
  .route("/:id/eligibility")
  .put(protect, allowedTo("admin","employee"), updateBachelorRequestEligibility);

// router
//   .route("/goToNextStepAfterapplyingForVisa/:id")
//   .post(protect, allowedTo("employee"), goToNextStepAfterapplyingForVisa);
// router
//   .route("/goToNextStepAftercontractFees/:id")
//   .post(protect, allowedTo("employee"), goToNextStepAftercontractFees);
// router
//   .route("/goToNextStepAfterdeliverAndSignOfferLetter/:id")
//   .post(
//     protect,
//     allowedTo("employee"),
//     goToNextStepAfterdeliverAndSignOfferLetter
//   );
// router
//   .route("/goToNextStepAftergetCopyOfMohere/:id")
//   .post(protect, allowedTo("employee"), goToNextStepAftergetCopyOfMohere);
// router
//   .route("/goToNextStepAftergettingEMGSApproval/:id")
//   .post(protect, allowedTo("employee"), goToNextStepAftergettingEMGSApproval);
// router
//   .route("/goToNextStepAftergettingFinalAcceptanceLetter/:id")
//   .post(
//     protect,
//     allowedTo("employee"),
//     goToNextStepAftergettingFinalAcceptanceLetter
//   );
// router
//   .route("/goToNextStepAfterrecievingTicketCopy/:id")
//   .post(protect, allowedTo("employee"), goToNextStepAfterrecievingTicketCopy);
// router
//   .route("/goToNextStepAfterregistrationFees/:id")
//   .post(protect, allowedTo("employee"), goToNextStepAfterregistrationFees);
// router
//   .route("/goToNextStepAftersendingOfferLetter/:id")
//   .post(protect, allowedTo("employee"), goToNextStepAftersendingOfferLetter);
// router
//   .route("/goToNextStepAftersignContract/:id")
//   .post(protect, allowedTo("employee"), goToNextStepAftersignContract);
// router
//   .route("/goToNextStepAftervisaFees/:id")
//   .post(protect, allowedTo("employee"), goToNextStepAftervisaFees);

module.exports = router;
