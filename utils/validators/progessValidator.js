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
  check("signedOfferLetter")
    .notEmpty()
    .withMessage("Signed OfferLetter Required"),
  validatorMiddleware,
];
exports.uploadcontractFeesFileValidator = [
  check("requestId").isUUID().withMessage("Invalid Requst id format"),
  check("contractFeesFile")
    .notEmpty()
    .withMessage("contract Fees File Required"),
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
exports.uploadEVALValidator = [
  check("requestId").isUUID().withMessage("Invalid Requst id format"),
  check("EVAL").notEmpty().withMessage("EVAL Required"),
  validatorMiddleware,
];
exports.uploadvisaFeesFileValidator = [
  check("requestId").isUUID().withMessage("Invalid Requst id format"),
  check("visaFeesFile").notEmpty().withMessage("visa Fees File Required"),
  validatorMiddleware,
];
exports.uploadMOHEREApprovalValidator = [
  check("requestId").isUUID().withMessage("Invalid Requst id format"),
  check("MOHEREApproval").notEmpty().withMessage("MOHEREA pproval Required"),
  validatorMiddleware,
];
exports.uploadEMGSValidator = [
  check("requestId").isUUID().withMessage("Invalid Requst id format"),
  check("EMGS").notEmpty().withMessage("EMGS Required"),
  validatorMiddleware,
];
exports.uploadregistrationFeesFileValidator = [
  check("requestId").isUUID().withMessage("Invalid Requst id format"),
  check("registrationFeesFile")
    .notEmpty()
    .withMessage("registration Fees File Required"),
  validatorMiddleware,
];
