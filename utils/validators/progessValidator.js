const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.uploadContractValidator = [
  check("requestId").isUUID().withMessage("Invalid Requst id format"),
  check("contract").notEmpty().withMessage("Contract Required"),
  validatorMiddleware,
];
exports.uploadSignedContractValidator = [
  check("requestId").isUUID().withMessage("Invalid Requst id format"),
  check("signedContract").notEmpty().withMessage("signed Contract Required"),
  validatorMiddleware,
];
exports.uploadOfferLetterValidator = [
  check("requestId").isUUID().withMessage("Invalid Requst id format"),
  check("offerLetter").notEmpty().withMessage(" OfferLetter Required"),
  validatorMiddleware,
];
exports.uploadSignedOfferLetterValidator = [
  check("requestId").isUUID().withMessage("Invalid Requst id format"),
  check("signedOfferLetter").notEmpty().withMessage("Signed OfferLetter Required"),
  validatorMiddleware,
];
exports.uploadMOHEREValidator = [
  check("requestId").isUUID().withMessage("Invalid Requst id format"),
  check("MOHERE").notEmpty().withMessage("MOHERE Required"),
  validatorMiddleware,
];
exports.uploadTicketValidator = [
  check("requestId").isUUID().withMessage("Invalid Requst id format"),
  check("ticket").notEmpty().withMessage("Ticket Required"),
  validatorMiddleware,
];
