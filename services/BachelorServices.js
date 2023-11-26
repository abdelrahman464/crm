const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { Bachelor } = require("../models");
const { nextStep } = require("./progressServices");
const ApiError = require("../utils/apiError");
const {
  sendRequest,
  updateRequestEligibility,
  getOne,
  getAll,
  deleteOne,
} = require("./handlerFactory");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploads = uploadMixOfImages([
  {
    name: "CV",
    maxCount: 1,
  },
  {
    name: "HighSchoolCertificate",
    maxCount: 1,
  },
  {
    name: "Passport",
    maxCount: 1,
  },
  {
    name: "PersonalPicture",
    maxCount: 1,
  },
  {
    name: "PersonalStatement",
    maxCount: 1,
  },
]);

// Processing middleware for resizing and saving BankAccountFile
exports.resize = asyncHandler(async (req, res, next) => {
  if (req.files.CV) {
    const pdfFile = req.files.CV[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `CV-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Bachelor/cv/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.CV = pdfFileName;
    } else {
      return next(new ApiError("Invalid CV file format", 400));
    }
  }
  if (req.files.HighSchoolCertificate) {
    const pdfFile = req.files.HighSchoolCertificate[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `HighSchoolCertificate-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Bachelor/HighSchoolCertificate/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.HighSchoolCertificate = pdfFileName;
    } else {
      return next(
        new ApiError("Invalid HighSchoolCertificate file format", 400)
      );
    }
  }
  if (req.files.PersonalPicture) {
    const pdfFile = req.files.PersonalPicture[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `PersonalPicture-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Bachelor/PersonalPicture/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.PersonalPicture = pdfFileName;
    } else {
      return next(new ApiError("Invalid PersonalPicture file format", 400));
    }
  }
  if (req.files.Passport) {
    const pdfFile = req.files.Passport[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `Passport-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Bachelor/Passport/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.Passport = pdfFileName;
    } else {
      return next(new ApiError("Invalid Passport file format", 400));
    }
  }
  if (req.files.PersonalStatement) {
    const wordFile = req.files.PersonalStatement[0];
    if (
      wordFile.mimetype === "application/msword" ||
      wordFile.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const wordFileName = `PersonalStatement-docx-${uuidv4()}-${Date.now()}.docx`;
      const wordPath = `uploads/Bachelor/PersonalStatement/${wordFileName}`;
      fs.writeFileSync(wordPath, wordFile.buffer);
      req.body.PersonalStatement = wordFileName;
    } else {
      return next(new ApiError("Invalid Personal Statement file format", 400));
    }
  }
  next();
});

//-------------------------------------------------------------------------------------------------------------------
// send  Bachelor Request
exports.sendBachelorRequest = sendRequest(Bachelor, "Bachelor");

// Get One Bachelor
exports.getBachelorById = getOne(Bachelor);

// update request (eligible or not eligible)
exports.updateBachelorRequest = updateRequestEligibility(Bachelor);

// Get All Bachelors
exports.getAllBachelors = getAll(Bachelor, "Bachelor");

// Delete One Bachelor
exports.deleteBachelor = deleteOne(Bachelor);

exports.goToNextStepAftersignContract = nextStep("Bachelor", "contract_fees");
exports.goToNextStepAftercontractFees = nextStep("Bachelor", "sending_offerLetter");
exports.goToNextStepAftersendingOfferLetter = nextStep("Bachelor", "deliver_and_sign_offerLetter");
exports.goToNextStepAfterdeliverAndSignOfferLetter = nextStep("Bachelor", "get_copy_of_mohere");
exports.goToNextStepAftergetCopyOfMohere = nextStep("Bachelor", "visa_fees");
exports.goToNextStepAftervisaFees = nextStep("Bachelor", "getting_EMGS_approval");
exports.goToNextStepAftergettingEMGSApproval = nextStep("Bachelor", "registration_fees");
exports.goToNextStepAfterregistrationFees = nextStep("Bachelor", "getting_final_acceptance_letter");
exports.goToNextStepAftergettingFinalAcceptanceLetter = nextStep("Bachelor", "recieving_ticket_copy");
exports.goToNextStepAfterrecievingTicketCopy = nextStep("Bachelor", "applying_for_visa");
exports.goToNextStepAfterapplyingForVisa = nextStep("Bachelor", "arranging_airport_pickup");

