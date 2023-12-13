const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { Master, User } = require("../models");
const { nextStep } = require("./progressServices");
const ApiError = require("../utils/apiError");
const {
  sendRequest,
  updateRequestEligibility,
  getOne,
  getAll,
  deleteOne,
  checkAuthorityRequest,
} = require("./handlerFactory");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploads = uploadMixOfImages([
  {
    name: "PersonalPicture",
    maxCount: 1,
  },
  {
    name: "HighSchoolCertificate",
    maxCount: 1,
  },
  {
    name: "BachelorsDegreeCertificateWithTranscript",
    maxCount: 1,
  },
  {
    name: "EnglishTestResults",
    maxCount: 1,
  },
  {
    name: "CV",
    maxCount: 1,
  },
  {
    name: "TwoRecommendationLetters",
    maxCount: 1,
  },
  {
    name: "ExperienceLetter",
    maxCount: 1,
  },
  {
    name: "PersonalStatement",
    maxCount: 1,
  },
  {
    name: "ResearchProposal",
    maxCount: 1,
  },
  {
    name: "Passport",
    maxCount: 1,
  },
]);

// Processing middleware for resizing and saving BankAccountFile
exports.resize = asyncHandler(async (req, res, next) => {
  if (req.files.Passport) {
    const pdfFile = req.files.Passport[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `Passport-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Master/Passport/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.Passport = pdfFileName;
    } else {
      return next(new ApiError("Invalid Passport file format", 400));
    }
  }
  if (req.files.PersonalPicture) {
    const pdfFile = req.files.PersonalPicture[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `PersonalPicture-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Master/PersonalPicture/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.PersonalPicture = pdfFileName;
    } else {
      return next(new ApiError("Invalid Personal Picture file format", 400));
    }
  }
  if (req.files.HighSchoolCertificate) {
    const pdfFile = req.files.HighSchoolCertificate[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `HighSchoolCertificate-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Master/HighSchoolCertificate/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.HighSchoolCertificate = pdfFileName;
    } else {
      return next(
        new ApiError("Invalid High School Certificate file format", 400)
      );
    }
  }
  if (req.files.EnglishTestResults) {
    const pdfFile = req.files.EnglishTestResults[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `EnglishTestResults-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Master/EnglishTestResults/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.EnglishTestResults = pdfFileName;
    } else {
      return next(
        new ApiError("Invalid English Test Results file format", 400)
      );
    }
  }
  if (req.files.BachelorsDegreeCertificateWithTranscript) {
    const pdfFile = req.files.BachelorsDegreeCertificateWithTranscript[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `BachelorsDegreeCertificateWithTranscript-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Master/BachelorsDegreeCertificateWithTranscript/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.BachelorsDegreeCertificateWithTranscript = pdfFileName;
    } else {
      return next(
        new ApiError(
          "Invalid Bachelors Degree Certificate With Transcript file format",
          400
        )
      );
    }
  }
  if (req.files.TwoRecommendationLetters) {
    const pdfFile = req.files.TwoRecommendationLetters[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `TwoRecommendationLetters-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Master/TwoRecommendationLetters/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.TwoRecommendationLetters = pdfFileName;
    } else {
      return next(
        new ApiError("Invalid Two Recommendation Letters file format", 400)
      );
    }
  }
  if (req.files.ExperienceLetter) {
    const pdfFile = req.files.ExperienceLetter[0];
    if (pdfFile.mimetype === "application/pdf") {
      const pdfFileName = `ExperienceLetter-pdf-${uuidv4()}-${Date.now()}.pdf`;
      const pdfPath = `uploads/Master/ExperienceLetter/${pdfFileName}`;
      fs.writeFileSync(pdfPath, pdfFile.buffer);
      req.body.ExperienceLetter = pdfFileName;
    } else {
      return next(new ApiError("Invalid Experience Letter file format", 400));
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
      const wordPath = `uploads/Master/PersonalStatement/${wordFileName}`;
      fs.writeFileSync(wordPath, wordFile.buffer);
      req.body.PersonalStatement = wordFileName;
    } else {
      return next(new ApiError("Invalid Personal Statement file format", 400));
    }
  }
  if (req.files.ResearchProposal) {
    const wordFile = req.files.ResearchProposal[0];
    if (
      wordFile.mimetype === "application/msword" ||
      wordFile.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const wordFileName = `ResearchProposal-docx-${uuidv4()}-${Date.now()}.docx`;
      const wordPath = `uploads/Master/ResearchProposal/${wordFileName}`;
      fs.writeFileSync(wordPath, wordFile.buffer);
      req.body.ResearchProposal = wordFileName;
    } else {
      return next(new ApiError("Invalid Research Proposal file format", 400));
    }
  }

  next();
});

// send Bachelor Request
exports.sendMasterRequest = sendRequest(Master, "Master");
//check If The User Or Employ That Can get
exports.checkAuthorityRequestMaster = checkAuthorityRequest(Master);
// Get One Bachelor
exports.getMasterById = getOne(Master, [
  {
    model: User,
    as: "UserDetails",
  },
  {
    model: User,
    as: "Employee",
  },
]);

// update request (eligible or not eligible)
exports.updateMasterRequestEligibility = updateRequestEligibility(Master);

// Get All Bachelors
exports.getAllMasters = getAll(Master, "Master", [
  {
    model: User,
    as: "UserDetails",
  },
  {
    model: User,
    as: "Employee",
  },
]);

//update Master by user that have made the request
exports.updateMasterByUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const loggedInUserId = req.user.id; // Get the ID of the logged-in user

  // Find the request by ID and include the associated user
  const request = await Master.findByPk(id);

  if (!request) {
    return next(new ApiError(`Request Not Found`, 404));
  }

  // Check if the logged-in user ID matches the UserID associated with the request
  if (request.UserId !== loggedInUserId) {
    return next(
      new ApiError(
        `Unauthorized. User does not have permission to update this request.`,
        403
      )
    );
  }

  const [affectedRowCount] = await Master.update(
    {
      Passport: req.body.Passport,
      PersonalPicture: req.body.PersonalPicture,
      CV: req.body.CV,
      HighSchoolCertificate: req.body.HighSchoolCertificate,
      BachelorsDegreeCertificateWithTranscript:
        req.body.BachelorsDegreeCertificateWithTranscript,
      EnglishTestResults: req.body.EnglishTestResults,
      TwoRecommendationLetters: req.body.TwoRecommendationLetters,
      ExperienceLetter: req.body.ExperienceLetter,
      PersonalStatement: req.body.PersonalStatement,
      ResearchProposal: req.body.ResearchProposal,
      CountryOfStudy: req.body.CountryOfStudy,
      RequiredSpecialization: req.body.RequiredSpecialization,
    },
    {
      where: { id },
    }
  );

  if (affectedRowCount === 0) {
    return next(new ApiError(`Document Not Found`, 404));
  }

  // Fetch the updated document after the update
  const updatedDocument = await Master.findByPk(id);

  if (!updatedDocument) {
    return next(new ApiError(`Document Not Found`, 404));
  }

  const updatedData = updatedDocument.get();
  res.status(200).json({ data: updatedData });
});
// Delete One Bachelor
exports.deleteMaster = deleteOne(Master);

// exports.goToNextStepAftersignContract = nextStep(
//   "Master",
//   "contract_fees",
//   Master
// );
// exports.goToNextStepAftercontractFees = nextStep(
//   "Master",
//   "sending_offerLetter",
//   Master
// );
// exports.goToNextStepAftersendingOfferLetter = nextStep(
//   "Master",
//   "deliver_and_sign_offerLetter",
//   Master
// );
// exports.goToNextStepAfterdeliverAndSignOfferLetter = nextStep(
//   "Master",
//   "get_copy_of_mohere",
//   Master
// );
// exports.goToNextStepAftergetCopyOfMohere = nextStep(
//   "Master",
//   "visa_fees",
//   Master
// );
// exports.goToNextStepAftervisaFees = nextStep(
//   "Master",
//   "getting_EMGS_approval",
//   Master
// );
// exports.goToNextStepAftergettingEMGSApproval = nextStep(
//   "Master",
//   "registration_fees",
//   Master
// );
// exports.goToNextStepAfterregistrationFees = nextStep(
//   "Master",
//   "getting_final_acceptance_letter",
//   Master
// );
// exports.goToNextStepAftergettingFinalAcceptanceLetter = nextStep(
//   "Master",
//   "recieving_ticket_copy",
//   Master
// );
// exports.goToNextStepAfterrecievingTicketCopy = nextStep(
//   "Master",
//   "applying_for_visa",
//   Master
// );
// exports.goToNextStepAfterapplyingForVisa = nextStep(
//   "Master",
//   "arranging_airport_pickup",
//   Master
// );
